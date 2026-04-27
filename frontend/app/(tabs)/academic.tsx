import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity,
  ActivityIndicator, Alert, Modal, ScrollView, RefreshControl, Linking,
} from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { resourcesAPI } from '../../services/api';
import { theme, CATEGORY_COLORS, CATEGORY_ICONS } from '../../constants/theme';
import NotificationBell from '../../components/NotificationBell';

interface Resource {
  resource_id: string;
  title: string;
  url: string;
  description: string;
  category: string;
  is_bookmarked: boolean;
  created_at: string;
}

export default function AcademicScreen() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'bookmarks'>('all');

  // Admin modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [form, setForm] = useState({ title: '', url: '', description: '', category: '' });
  const [saving, setSaving] = useState(false);

  const fetchResources = useCallback(async () => {
    try {
      if (activeTab === 'bookmarks') {
        const res = await resourcesAPI.getBookmarks();
        setResources(res.data);
      } else {
        const params: any = {};
        if (search) params.search = search;
        if (activeCategory) params.category = activeCategory;
        const res = await resourcesAPI.getAll(params);
        setResources(res.data);
      }
    } catch {
      Alert.alert('Error', 'Could not load resources');
    }
  }, [search, activeCategory, activeTab]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await resourcesAPI.getCategories();
      setCategories(res.data);
    } catch {}
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchResources(), fetchCategories()]);
      setLoading(false);
    };
    init();
  }, [fetchResources, fetchCategories]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchResources();
    setRefreshing(false);
  };

  const toggleBookmark = async (resource: Resource) => {
    try {
      if (resource.is_bookmarked) {
        await resourcesAPI.removeBookmark(resource.resource_id);
      } else {
        await resourcesAPI.addBookmark(resource.resource_id);
      }
      setResources(prev =>
        prev.map(r =>
          r.resource_id === resource.resource_id
            ? { ...r, is_bookmarked: !r.is_bookmarked }
            : r
        )
      );
      if (activeTab === 'bookmarks' && resource.is_bookmarked) {
        setResources(prev => prev.filter(r => r.resource_id !== resource.resource_id));
      }
    } catch {
      Alert.alert('Error', 'Could not update bookmark');
    }
  };

  const openResource = (url: string) => {
    if (url) Linking.openURL(url).catch(() => Alert.alert('Error', 'Could not open link'));
  };

  // ─── Admin CRUD ────────────────────────────────────────────

  const openCreateModal = () => {
    setEditingResource(null);
    setForm({ title: '', url: '', description: '', category: '' });
    setModalVisible(true);
  };

  const openEditModal = (resource: Resource) => {
    setEditingResource(resource);
    setForm({
      title: resource.title,
      url: resource.url || '',
      description: resource.description || '',
      category: resource.category || '',
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return Alert.alert('Error', 'Title is required');
    setSaving(true);
    try {
      if (editingResource) {
        await resourcesAPI.update(editingResource.resource_id, form);
      } else {
        await resourcesAPI.create(form);
      }
      setModalVisible(false);
      await fetchResources();
    } catch {
      Alert.alert('Error', 'Could not save resource');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (resource: Resource) => {
    Alert.alert(
      'Delete Resource',
      `Delete "${resource.title}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive',
          onPress: async () => {
            try {
              await resourcesAPI.delete(resource.resource_id);
              await fetchResources();
            } catch {
              Alert.alert('Error', 'Could not delete resource');
            }
          },
        },
      ]
    );
  };

  // ─── Render ────────────────────────────────────────────────

  const renderResource = ({ item }: { item: Resource }) => {
    const catColor = CATEGORY_COLORS[item.category] || theme.colors.muted;
    const catIcon = CATEGORY_ICONS[item.category] || '🔗';

    return (
      <TouchableOpacity style={styles.card} onPress={() => openResource(item.url)} activeOpacity={0.8}>
        <View style={styles.cardHeader}>
          <View style={[styles.categoryBadge, { backgroundColor: catColor + '22', borderColor: catColor + '55' }]}>
            <Text style={styles.categoryIcon}>{catIcon}</Text>
            <Text style={[styles.categoryText, { color: catColor }]}>
              {item.category || 'general'}
            </Text>
          </View>

          <View style={styles.cardActions}>
            {isAdmin && (
              <>
                <TouchableOpacity style={styles.iconBtn} onPress={() => openEditModal(item)}>
                  <Text style={styles.iconBtnText}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconBtn} onPress={() => handleDelete(item)}>
                  <Text style={styles.iconBtnText}>🗑️</Text>
                </TouchableOpacity>
              </>
            )}
            {!isAdmin && (
              <TouchableOpacity style={styles.bookmarkBtn} onPress={() => toggleBookmark(item)}>
                <Text style={{ fontSize: 20 }}>{item.is_bookmarked ? '🔖' : '📌'}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <Text style={styles.resourceTitle}>{item.title}</Text>
        {item.description ? (
          <Text style={styles.resourceDesc} numberOfLines={2}>{item.description}</Text>
        ) : null}
        {item.url ? (
          <Text style={styles.resourceUrl} numberOfLines={1}>{item.url}</Text>
        ) : null}
      </TouchableOpacity>
    );
  };

  const categoryAll = ['all', ...categories];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Academic Resources</Text>
          <Text style={styles.headerSub}>{resources.length} resource{resources.length !== 1 ? 's' : ''}</Text>
        </View>
        <View style={styles.headerRight}>
          {isAdmin && (
            <TouchableOpacity style={styles.addBtn} onPress={openCreateModal}>
              <Text style={styles.addBtnText}>+ Add</Text>
            </TouchableOpacity>
          )}
          <NotificationBell />
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search resources..."
          placeholderTextColor={theme.colors.muted}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity style={styles.clearBtn} onPress={() => setSearch('')}>
            <Text style={{ color: theme.colors.muted }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs (student only) */}
      {!isAdmin && (
        <View style={styles.tabRow}>
          {(['all', 'bookmarks'] as const).map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab === 'all' ? 'All Resources' : '🔖 Saved'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Category filter (only on "all" tab) */}
      {activeTab === 'all' && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContent}
        >
          {categoryAll.map(cat => {
            const isAll = cat === 'all';
            const active = isAll ? !activeCategory : activeCategory === cat;
            const color = isAll ? theme.colors.accent : (CATEGORY_COLORS[cat] || theme.colors.muted);
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.catChip, active && { backgroundColor: color, borderColor: color }]}
                onPress={() => setActiveCategory(isAll ? null : cat === activeCategory ? null : cat)}
              >
                {!isAll && <Text style={styles.catIcon}>{CATEGORY_ICONS[cat] || '🔗'}</Text>}
                <Text style={[styles.catLabel, active && { color: '#fff' }]}>
                  {isAll ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* List */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.accent} />
        </View>
      ) : (
        <FlatList
          data={resources}
          keyExtractor={item => item.resource_id}
          renderItem={renderResource}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.accent} />}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={styles.emptyIcon}>{activeTab === 'bookmarks' ? '🔖' : '🔍'}</Text>
              <Text style={styles.emptyText}>
                {activeTab === 'bookmarks' ? 'No saved resources yet.\nBrowse and bookmark resources to see them here.' : 'No resources found.'}
              </Text>
            </View>
          }
        />
      )}

      {/* Admin Create/Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingResource ? 'Edit Resource' : 'Add Resource'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={{ color: theme.colors.muted, fontSize: 20 }}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView>
              {[
                { key: 'title',       label: 'Title *',       placeholder: 'Canvas' },
                { key: 'url',         label: 'URL',           placeholder: 'https://...' },
                { key: 'description', label: 'Description',   placeholder: 'Brief description...', multiline: true },
                { key: 'category',    label: 'Category',      placeholder: 'academic, financial, health...' },
              ].map(field => (
                <View key={field.key} style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>{field.label}</Text>
                  <TextInput
                    style={[styles.fieldInput, field.multiline && { height: 80, textAlignVertical: 'top' }]}
                    placeholder={field.placeholder}
                    placeholderTextColor={theme.colors.muted}
                    value={(form as any)[field.key]}
                    onChangeText={v => setForm(f => ({ ...f, [field.key]: v }))}
                    multiline={field.multiline}
                    autoCapitalize="none"
                  />
                </View>
              ))}

              <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
                {saving
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={styles.saveBtnText}>{editingResource ? 'Save Changes' : 'Create Resource'}</Text>
                }
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: theme.colors.background },
  header:          { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 20, paddingTop: 56, paddingBottom: 12 },
  headerTitle:     { color: theme.colors.text, fontSize: 22, fontFamily: 'Georgia', fontWeight: '700' },
  headerSub:       { color: theme.colors.muted, fontSize: 13, marginTop: 2 },
  headerRight:     { flexDirection: 'row', alignItems: 'center', gap: 10 },
  addBtn:          { backgroundColor: theme.colors.primary, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
  addBtnText:      { color: '#fff', fontSize: 13, fontWeight: '700' },

  searchRow:       { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginBottom: 10 },
  searchInput:     { flex: 1, backgroundColor: theme.colors.surface, color: theme.colors.text, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, fontSize: 15, borderWidth: 1, borderColor: theme.colors.border },
  clearBtn:        { position: 'absolute', right: 14 },

  tabRow:          { flexDirection: 'row', marginHorizontal: 20, marginBottom: 10, backgroundColor: theme.colors.surface, borderRadius: 10, padding: 4 },
  tab:             { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  tabActive:       { backgroundColor: theme.colors.card },
  tabText:         { color: theme.colors.muted, fontSize: 13, fontWeight: '600' },
  tabTextActive:   { color: theme.colors.text },

  categoryScroll:  { maxHeight: 48, marginBottom: 8 },
  categoryContent: { paddingHorizontal: 20, gap: 8, alignItems: 'center' },
  catChip:         { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface, gap: 4 },
  catIcon:         { fontSize: 13 },
  catLabel:        { color: theme.colors.muted, fontSize: 12, fontWeight: '600' },

  list:            { padding: 16, paddingBottom: 40 },

  card:            { backgroundColor: theme.colors.card, borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: theme.colors.border },
  cardHeader:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  categoryBadge:   { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1, gap: 4 },
  categoryIcon:    { fontSize: 12 },
  categoryText:    { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  cardActions:     { flexDirection: 'row', gap: 6 },
  iconBtn:         { padding: 4 },
  iconBtnText:     { fontSize: 18 },
  bookmarkBtn:     { padding: 4 },

  resourceTitle:   { color: theme.colors.text, fontSize: 16, fontWeight: '700', marginBottom: 6 },
  resourceDesc:    { color: theme.colors.muted, fontSize: 13, lineHeight: 18, marginBottom: 6 },
  resourceUrl:     { color: theme.colors.blue, fontSize: 12 },

  centered:        { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
  emptyIcon:       { fontSize: 48, marginBottom: 12 },
  emptyText:       { color: theme.colors.muted, fontSize: 14, textAlign: 'center', lineHeight: 22 },

  // Modal
  modalOverlay:    { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalSheet:      { backgroundColor: theme.colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, maxHeight: '85%' },
  modalHeader:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle:      { color: theme.colors.text, fontSize: 18, fontFamily: 'Georgia', fontWeight: '700' },
  fieldGroup:      { marginBottom: 16 },
  fieldLabel:      { color: theme.colors.muted, fontSize: 12, fontWeight: '600', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  fieldInput:      { backgroundColor: theme.colors.card, color: theme.colors.text, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, borderWidth: 1, borderColor: theme.colors.border },
  saveBtn:         { backgroundColor: theme.colors.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 8, marginBottom: 20 },
  saveBtnText:     { color: '#fff', fontSize: 16, fontWeight: '700' },
});
