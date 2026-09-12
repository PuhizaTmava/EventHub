import { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth, firebaseConfig } from '../firebase/config';
import { colors, fonts } from '../utils/theme';

export default function PhoneLoginScreen({ navigation }) {
  const recaptchaVerifier = useRef(null);
  const [phone, setPhone] = useState('+16505551234');
  const [code, setCode] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  const [loading, setLoading] = useState(false);

  const sendCode = async () => {
    if (!phone.trim()) {
      Alert.alert('Gabim', 'Shkruaj numrin e telefonit (format nderkombetar, p.sh. +383...)');
      return;
    }
    setLoading(true);
    try {
      const provider = new PhoneAuthProvider(auth);
      const id = await provider.verifyPhoneNumber(phone.trim(), recaptchaVerifier.current);
      setVerificationId(id);
      Alert.alert('Kodi u dergua', 'Shkruaj kodin e verifikimit.');
    } catch (error) {
      Alert.alert('Gabim', error.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmCode = async () => {
    if (!code.trim()) {
      Alert.alert('Gabim', 'Shkruaj kodin e verifikimit.');
      return;
    }
    setLoading(true);
    try {
      const credential = PhoneAuthProvider.credential(verificationId, code.trim());
      await signInWithCredential(auth, credential);
    } catch (error) {
      Alert.alert('Gabim', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView style={styles.container}>
        <FirebaseRecaptchaVerifierModal ref={recaptchaVerifier} firebaseConfig={firebaseConfig} />

        <Text style={styles.title}>Kyçu me Telefon</Text>
        <Text style={styles.subtitle}>Për testim, përdor: +16505551234 (kodi: 123456)</Text>

        <TextInput
          style={styles.input}
          placeholder="+383 44 000 000"
          placeholderTextColor={colors.textTertiary}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          editable={!verificationId}
        />

        {!verificationId ? (
          <TouchableOpacity style={styles.button} onPress={sendCode} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Duke dërguar...' : 'Dërgo Kodin'}</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Kodi i verifikimit (123456)"
              placeholderTextColor={colors.textTertiary}
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
            />
            <TouchableOpacity style={styles.button} onPress={confirmCode} disabled={loading}>
              <Text style={styles.buttonText}>{loading ? 'Duke verifikuar...' : 'Verifiko dhe Kyçu'}</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.link}>Kthehu te Login</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: colors.background },
  title: { fontSize: 28, textAlign: 'center', marginBottom: 8, color: colors.accent, fontFamily: fonts.extrabold, letterSpacing: -0.5 },
  subtitle: { fontSize: 13, textAlign: 'center', color: colors.textTertiary, marginBottom: 28, fontFamily: fonts.medium },
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
  button: { backgroundColor: colors.accent, padding: 16, borderRadius: 18, alignItems: 'center', marginTop: 4 },
  buttonText: { color: '#fff', fontSize: 16, fontFamily: fonts.bold },
  link: { textAlign: 'center', marginTop: 24, color: colors.accent, fontFamily: fonts.semibold },
});
