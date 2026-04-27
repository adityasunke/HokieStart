import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { authAPI } from '../../services/api';
import { theme } from '../../constants/theme';

export default function ProfileScreen() {
  const { user, clearAuth } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out', style: 'destructive',
        onPress: async () => {
          try { await authAPI.logout(); } catch {}
          await clearAuth();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const name = user?.profile?.display_name || user?.profile?.name || 'Hokie';

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
      </View>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.email}>{user?.email}</Text>

      <View style={styles.badge}>
        <Text style={styles.badgeText}>{user?.role === 'admin' ? '⚙️ Admin' : '🎓 Student'}</Text>
      </View>

      {user?.profile?.major && (
        <Text style={styles.detail}>{user.profile.major} · Class of {user.profile.graduation_year}</Text>
      )}

      <Text style={styles.sectionNote}>Full profile management coming soon — Aryan's module</Text>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: theme.colors.background, alignItems: 'center', paddingTop: 80, padding: 24 },
  avatar:      { width: 88, height: 88, borderRadius: 44, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  avatarText:  { color: '#fff', fontSize: 36, fontFamily: 'Georgia', fontWeight: '700' },
  name:        { color: theme.colors.text, fontSize: 22, fontFamily: 'Georgia', fontWeight: '700', marginBottom: 4 },
  email:       { color: theme.colors.muted, fontSize: 14, marginBottom: 12 },
  badge:       { backgroundColor: theme.colors.card, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6, borderWidth: 1, borderColor: theme.colors.border, marginBottom: 10 },
  badgeText:   { color: theme.colors.text, fontSize: 13, fontWeight: '600' },
  detail:      { color: theme.colors.muted, fontSize: 13, marginBottom: 32 },
  sectionNote: { color: theme.colors.border, fontSize: 12, textAlign: 'center', marginBottom: 32 },
  logoutBtn:   { backgroundColor: theme.colors.error, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 40, alignItems: 'center' },
  logoutText:  { color: '#fff', fontSize: 15, fontWeight: '700' },
});
