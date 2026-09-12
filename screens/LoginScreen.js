import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import useGoogleAuth from '../hooks/useGoogleAuth';
import { colors, fonts } from '../utils/theme';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { request, promptAsync } = useGoogleAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Gabim', 'Plotëso email dhe password.');
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      Alert.alert('Gabim gjatë kyçjes', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>EventHub</Text>
      <Text style={styles.subtitle}>Kyçu në llogarinë tënde</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={colors.textTertiary}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={colors.textTertiary}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Duke u kyçur...' : 'Kyçu'}</Text>
      </TouchableOpacity>

      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>ose</Text>
        <View style={styles.line} />
      </View>

      <TouchableOpacity style={styles.secondaryButton} disabled={!request} onPress={() => promptAsync()}>
        <Text style={styles.secondaryButtonText}>Kyçu me Google</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.secondaryButton, { marginTop: 12 }]}
        onPress={() => navigation.navigate('PhoneLogin')}
      >
        <Text style={styles.secondaryButtonText}>Kyçu me Telefon</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>S'ke llogari? Regjistrohu</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: colors.background },
  title: { fontSize: 34, textAlign: 'center', marginBottom: 8, color: colors.accent, fontFamily: fonts.extrabold, letterSpacing: -0.5 },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 32, color: colors.textSecondary, fontFamily: fonts.medium },
  input: {
    borderWidth: 0,
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    color: colors.textPrimary,
    fontFamily: fonts.medium,
    shadowColor: '#785F46',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  button: { backgroundColor: colors.accent, padding: 17, borderRadius: 18, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontFamily: fonts.bold },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  line: { flex: 1, height: 1, backgroundColor: colors.divider },
  dividerText: { marginHorizontal: 12, color: colors.textTertiary, fontSize: 13, fontFamily: fonts.medium },
  secondaryButton: { backgroundColor: colors.card, padding: 16, borderRadius: 18, alignItems: 'center' },
  secondaryButtonText: { color: colors.textPrimary, fontSize: 16, fontFamily: fonts.semibold },
  link: { textAlign: 'center', marginTop: 20, color: colors.accent, fontFamily: fonts.semibold },
});
