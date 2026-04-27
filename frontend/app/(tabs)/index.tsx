import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { theme } from '../../constants/theme';
import NotificationBell from '../../components/NotificationBell';

export default function HomeScreen() {
  const { user } = useAuthStore();
  const router = useRouter();
  const name = user?.profile?.display_name || user?.profile?.name || 'Hokie';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.name}>{name} 🦃</Text>
        </View>
        <NotificationBell />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your First Semester</Text>
        <Text style={styles.cardSub}>VT Class of {user?.profile?.graduation_year || '20XX'}</Text>
        <Text style={styles.cardBody}>Explore resources, manage tasks, and navigate campus — all in one place.</Text>
      </View>

      <Text style={styles.sectionTitle}>Quick Access</Text>
      <View style={styles.grid}>
        {[
          { label: 'Resources', emoji: '📚', route: '/(tabs)/academic' },
          { label: 'Campus Map', emoji: '🗺️', route: '/(tabs)/campus' },
          { label: 'Community', emoji: '💬', route: '/(tabs)/forum' },
          { label: 'Profile', emoji: '👤', route: '/(tabs)/profile' },
        ].map(item => (
          <TouchableOpacity key={item.label} style={styles.gridItem} onPress={() => router.push(item.route as any)}>
            <Text style={styles.gridEmoji}>{item.emoji}</Text>
            <Text style={styles.gridLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: theme.colors.background },
  content:      { padding: 20, paddingTop: 56 },
  header:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  greeting:     { color: theme.colors.muted, fontSize: 14 },
  name:         { color: theme.colors.text, fontSize: 24, fontFamily: 'Georgia', fontWeight: '700' },
  card: {
    backgroundColor: theme.colors.primary, borderRadius: 16,
    padding: 20, marginBottom: 28,
  },
  cardTitle:    { color: '#fff', fontSize: 18, fontFamily: 'Georgia', fontWeight: '700', marginBottom: 4 },
  cardSub:      { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 10 },
  cardBody:     { color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 20 },
  sectionTitle: { color: theme.colors.text, fontSize: 16, fontWeight: '700', marginBottom: 14 },
  grid:         { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gridItem: {
    width: '47%', backgroundColor: theme.colors.card, borderRadius: 14,
    padding: 20, alignItems: 'center', borderWidth: 1, borderColor: theme.colors.border,
  },
  gridEmoji:    { fontSize: 32, marginBottom: 8 },
  gridLabel:    { color: theme.colors.text, fontSize: 14, fontWeight: '600' },
});
