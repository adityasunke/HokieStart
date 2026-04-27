import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';

export default function CampusScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🗺️</Text>
      <Text style={styles.title}>Campus Navigation</Text>
      <Text style={styles.sub}>Coming soon — Aditya's module</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' },
  emoji:     { fontSize: 56, marginBottom: 16 },
  title:     { color: theme.colors.text, fontSize: 20, fontFamily: 'Georgia', fontWeight: '700', marginBottom: 8 },
  sub:       { color: theme.colors.muted, fontSize: 14 },
});
