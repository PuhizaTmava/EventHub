import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { colors, fonts } from '../utils/theme';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Gabim', 'Plotëso email dhe password.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Gabim', 'Password duhet të ketë të paktën 6 karaktere.');
      return;
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      Alert.alert('Gabim gjatë regjistrimit', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Krijo llogari</Text>

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
        placeholder="Password (min. 6 karaktere)"
        placeholderTextColor={colors.textTertiary}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Duke u regjistru...' : 'Regjistrohu'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>Ke llogari? Kyçu</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: colors.background },
  title: { fontSize: 28, textAlign: 'center', marginBottom: 32, color: colors.accent, fontFamily: fonts.extrabold, letterSpacing: -0.5 },
  input: {
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
  link: { textAlign: 'center', marginTop: 20, color: colors.accent, fontFamily: fonts.semibold },
});
