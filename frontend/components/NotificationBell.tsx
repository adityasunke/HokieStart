import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal,
  FlatList, ActivityIndicator, Alert,
} from 'react-native';
import { notificationsAPI } from '../services/api';
import { theme } from '../constants/theme';

interface Notification {
  notif_id: string;
  message: string;
  type: string;
  category: string;
  is_read: boolean;
  sent_at: string;
}

const TYPE_COLORS: Record<string, string> = {
  announcement: theme.colors.blue,
  alert:        theme.colors.error,
  reminder:     theme.colors.accent,
};

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [panelOpen, setPanelOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await notificationsAPI.getAll();
      const { notifications: notifs, disabled } = res.data;
      if (!disabled) {
        setNotifications(notifs);
        setUnreadCount(notifs.filter((n: Notification) => !n.is_read).length);
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markRead = async (notif: Notification) => {
    if (notif.is_read) return;
    try {
      await notificationsAPI.markRead(notif.notif_id);
      setNotifications(prev =>
        prev.map(n => n.notif_id === notif.notif_id ? { ...n, is_read: true } : n)
      );
      setUnreadCount(c => Math.max(0, c - 1));
    } catch {}
  };

  const dismiss = async (notif: Notification) => {
    try {
      await notificationsAPI.dismiss(notif.notif_id);
      setNotifications(prev => prev.filter(n => n.notif_id !== notif.notif_id));
      if (!notif.is_read) setUnreadCount(c => Math.max(0, c - 1));
    } catch {
      Alert.alert('Error', 'Could not dismiss notification');
    }
  };

  const markAllRead = async () => {
    const unread = notifications.filter(n => !n.is_read);
    await Promise.all(unread.map(n => notificationsAPI.markRead(n.notif_id)));
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return d.toLocaleDateString();
  };

  const renderNotification = ({ item }: { item: Notification }) => {
    const typeColor = TYPE_COLORS[item.type] || theme.colors.muted;
    return (
      <TouchableOpacity
        style={[styles.notifCard, !item.is_read && styles.notifUnread]}
        onPress={() => markRead(item)}
        activeOpacity={0.8}
      >
        <View style={styles.notifRow}>
          <View style={[styles.typeDot, { backgroundColor: typeColor }]} />
          <View style={styles.notifBody}>
            <Text style={styles.notifMessage}>{item.message}</Text>
            <View style={styles.notifMeta}>
              <Text style={[styles.notifType, { color: typeColor }]}>{item.type}</Text>
              <Text style={styles.notifTime}>{formatTime(item.sent_at)}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.dismissBtn} onPress={() => dismiss(item)}>
            <Text style={styles.dismissText}>✕</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <TouchableOpacity style={styles.bell} onPress={() => { setPanelOpen(true); fetchNotifications(); }}>
        <Text style={styles.bellIcon}>🔔</Text>
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>

      <Modal visible={panelOpen} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.panel}>
            <View style={styles.panelHeader}>
              <Text style={styles.panelTitle}>Notifications</Text>
              <View style={styles.panelActions}>
                {unreadCount > 0 && (
                  <TouchableOpacity onPress={markAllRead} style={styles.markAllBtn}>
                    <Text style={styles.markAllText}>Mark all read</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => setPanelOpen(false)}>
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>

            {loading ? (
              <ActivityIndicator color={theme.colors.accent} style={{ marginTop: 40 }} />
            ) : (
              <FlatList
                data={notifications}
                keyExtractor={item => item.notif_id}
                renderItem={renderNotification}
                contentContainerStyle={styles.notifList}
                ListEmptyComponent={
                  <View style={styles.emptyBox}>
                    <Text style={styles.emptyIcon}>🔔</Text>
                    <Text style={styles.emptyText}>No notifications</Text>
                  </View>
                }
              />
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  bell:         { position: 'relative', padding: 4 },
  bellIcon:     { fontSize: 24 },
  badge: {
    position: 'absolute', top: 0, right: 0,
    backgroundColor: theme.colors.error,
    borderRadius: 10, minWidth: 18, height: 18,
    justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText:    { color: '#fff', fontSize: 10, fontWeight: '700' },

  overlay:      { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  panel:        { backgroundColor: theme.colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '75%' },
  panelHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  panelTitle:   { color: theme.colors.text, fontSize: 18, fontFamily: 'Georgia', fontWeight: '700' },
  panelActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  markAllBtn:   {},
  markAllText:  { color: theme.colors.accent, fontSize: 13, fontWeight: '600' },
  closeText:    { color: theme.colors.muted, fontSize: 20 },

  notifList:    { padding: 16, paddingBottom: 40 },
  notifCard:    { backgroundColor: theme.colors.card, borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: theme.colors.border },
  notifUnread:  { borderColor: theme.colors.accent + '66' },
  notifRow:     { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  typeDot:      { width: 8, height: 8, borderRadius: 4, marginTop: 5, flexShrink: 0 },
  notifBody:    { flex: 1 },
  notifMessage: { color: theme.colors.text, fontSize: 14, lineHeight: 20, marginBottom: 6 },
  notifMeta:    { flexDirection: 'row', gap: 10 },
  notifType:    { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  notifTime:    { color: theme.colors.muted, fontSize: 11 },
  dismissBtn:   { padding: 4 },
  dismissText:  { color: theme.colors.muted, fontSize: 16 },

  emptyBox:     { alignItems: 'center', paddingTop: 48 },
  emptyIcon:    { fontSize: 48, marginBottom: 12 },
  emptyText:    { color: theme.colors.muted, fontSize: 14 },
});
