import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { authAPI } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { theme } from '../../constants/theme';

export default function RegisterScreen() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({
    email: '', password: '', confirmPassword: '',
    name: '', major: '', graduation_year: '', role: 'student' as 'student' | 'admin',
  });
  const [loading, setLoading] = useState(false);
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleRegister = async () => {
    if (!form.email.endsWith('@vt.edu')) return Alert.alert('Invalid Email', 'Must use a @vt.edu email');
    if (form.password.length < 8) return Alert.alert('Weak Password', 'At least 8 characters required');
    if (form.password !== form.confirmPassword) return Alert.alert('Mismatch', 'Passwords do not match');
    setLoading(true);
    try {
      const res = await authAPI.register({
        email: form.email, password: form.password, role: form.role,
        name: form.name, major: form.major,
        graduation_year: parseInt(form.graduation_year) || null,
      });
      const { token, role, user_id, email } = res.data;
      await setAuth(token, { user_id, role, email });
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: theme.colors.background }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.logoBox}><Text style={styles.logoText}>H</Text></View>
        <Text style={styles.title}>Create Your Account</Text>

        <View style={styles.roleRow}>
          {(['student', 'admin'] as const).map(r => (
            <TouchableOpacity key={r} style={[styles.roleBtn, form.role === r && styles.roleBtnActive]} onPress={() => set('role', r)}>
              <Text style={[styles.roleBtnText, form.role === r && { color: '#fff' }]}>{r.charAt(0).toUpperCase() + r.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {[
          { k: 'name',            p: 'Full Name',                     kb: 'default' },
          { k: 'email',           p: 'VT Email (username@vt.edu)',    kb: 'email-address' },
          { k: 'major',           p: 'Major (e.g. Computer Science)', kb: 'default',       studentOnly: true },
          { k: 'graduation_year', p: 'Graduation Year (e.g. 2028)',   kb: 'numeric',        studentOnly: true },
          { k: 'password',        p: 'Password (min 8 chars)',        kb: 'default', secure: true },
          { k: 'confirmPassword', p: 'Confirm Password',              kb: 'default', secure: true },
        ].filter(f => !f.studentOnly || form.role === 'student').map(field => (
          <TextInput
            key={field.k}
            style={styles.input}
            placeholder={field.p}
            placeholderTextColor={theme.colors.muted}
            value={(form as any)[field.k]}
            onChangeText={v => set(field.k, v)}
            secureTextEntry={field.secure}
            autoCapitalize="none"
            keyboardType={field.kb as any}
          />
        ))}

        <TouchableOpacity style={styles.btn} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Create Account</Text>}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.back()}><Text style={styles.link}>Log In</Text></TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:     { padding: 28, paddingBottom: 60 },
  logoBox:       { width: 56, height: 56, borderRadius: 14, backgroundColor: theme.colors.accent, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 12, marginTop: 20 },
  logoText:      { color: '#fff', fontSize: 28, fontFamily: 'Georgia' },
  title:         { color: theme.colors.text, fontSize: 20, fontFamily: 'Georgia', textAlign: 'center', marginBottom: 24 },
  roleRow:       { flexDirection: 'row', marginBottom: 16, borderRadius: 10, overflow: 'hidden' },
  roleBtn:       { flex: 1, paddingVertical: 12, alignItems: 'center', backgroundColor: theme.colors.surface },
  roleBtnActive: { backgroundColor: theme.colors.primary },
  roleBtnText:   { color: theme.colors.muted, fontWeight: '600' },
  input:         { backgroundColor: theme.colors.surface, color: theme.colors.text, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, borderWidth: 1, borderColor: theme.colors.border, marginBottom: 12 },
  btn:           { backgroundColor: theme.colors.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  btnText:       { color: '#fff', fontSize: 16, fontWeight: '700' },
  footer:        { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText:    { color: theme.colors.muted, fontSize: 13 },
  link:          { color: theme.colors.accent, fontSize: 13, fontWeight: '600' },
});
