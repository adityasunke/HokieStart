import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { authAPI, profileAPI } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { theme } from '../../constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Error', 'Please fill in all fields');
    setLoading(true);
    try {
      const res = await authAPI.login({ email, password });
      const { token, role, user_id, email: userEmail } = res.data;
      const profileRes = await profileAPI.getMe();
      await setAuth(token, { user_id, role, email: userEmail, profile: profileRes.data.profile });
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('Login Failed', err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>H</Text>
        </View>
        <Text style={styles.title}>Welcome, Hokie</Text>
        <Text style={styles.subtitle}>Your Hokie Journey Starts Here.</Text>

        <Text style={styles.label}>VT Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="username@vt.edu"
          placeholderTextColor={theme.colors.muted}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <View style={styles.row}>
          <Text style={styles.label}>Password</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor={theme.colors.muted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginBtnText}>Log In</Text>}
        </TouchableOpacity>

        <Text style={styles.orText}>— OR —</Text>

        <View style={styles.footer}>
          <Text style={styles.footerText}>New to the Nest? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register' as any)}>
            <Text style={styles.signupText}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.hint}>Test: student@vt.edu / Student1234!</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: theme.colors.background },
  inner:        { flex: 1, padding: 28, justifyContent: 'center' },
  logoBox: {
    width: 64, height: 64, borderRadius: 16,
    backgroundColor: theme.colors.accent,
    justifyContent: 'center', alignItems: 'center',
    alignSelf: 'center', marginBottom: 16,
  },
  logoText:     { color: '#fff', fontSize: 34, fontFamily: 'Georgia' },
  title:        { color: theme.colors.text, fontSize: 24, fontFamily: 'Georgia', textAlign: 'center' },
  subtitle:     { color: theme.colors.muted, fontSize: 13, textAlign: 'center', marginBottom: 36 },
  label:        { color: theme.colors.text, fontSize: 13, marginBottom: 6 },
  input: {
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    borderRadius: 10, paddingHorizontal: 16,
    paddingVertical: 14, fontSize: 15,
    borderWidth: 1, borderColor: theme.colors.border, marginBottom: 14,
  },
  row:          { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  loginBtn: {
    backgroundColor: theme.colors.blue, borderRadius: 12,
    paddingVertical: 16, alignItems: 'center', marginTop: 4, marginBottom: 20,
  },
  loginBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  orText:       { color: theme.colors.muted, textAlign: 'center', marginBottom: 20 },
  footer:       { flexDirection: 'row', justifyContent: 'center' },
  footerText:   { color: theme.colors.muted, fontSize: 13 },
  signupText:   { color: theme.colors.accent, fontSize: 13, fontWeight: '600' },
  hint:         { color: theme.colors.border, fontSize: 11, textAlign: 'center', marginTop: 24 },
});
