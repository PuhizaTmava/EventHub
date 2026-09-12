import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, saveUserProfile } from '../utils/userService';
import useImagePicker from '../hooks/useImagePicker';
import { colors, fonts } from '../utils/theme';

export default function ProfileScreen() {
  const { user, isAdmin } = useAuth();
  const { imageBase64, setImageBase64, pickImage } = useImagePicker([1, 1]);

  const [username, setUsername] = useState('');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const profile = await getUserProfile(user.uid);
        if (profile) {
          setUsername(profile.username || '');
          if (profile.photoBase64) setImageBase64(profile.photoBase64);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handlePickPhoto = async () => {
    const base64 = await pickImage();
    if (base64) {
      try {
        await saveUserProfile(user.uid, { photoBase64: base64 });
      } catch (error) {
        Alert.alert('Gabim', 'S\'u arrit të ruhej foto.');
      }
    }
  };

  const handleSaveUsername = async () => {
    if (!username.trim()) {
      Alert.alert('Gabim', 'Username s\'mund të jetë bosh.');
      return;
    }
    setSaving(true);
    try {
      await saveUserProfile(user.uid, { username: username.trim() });
      setEditing(false);
    } catch (error) {
      Alert.alert('Gabim', error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Dil', 'A je i sigurt që don të dalësh?', [
      { text: 'Anulo', style: 'cancel' },
      { text: 'Dil', style: 'destructive', onPress: async () => await signOut(auth) },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={colors.accent} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.avatarWrapper} onPress={handlePickPhoto}>
        {imageBase64 ? (
          <Image source={{ uri: imageBase64 }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(username || user?.email)?.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <View style={styles.cameraBadge}>
          <Ionicons name="camera" size={14} color="#fff" />
        </View>
      </TouchableOpacity>

      {editing ? (
        <View style={styles.usernameEditRow}>
          <TextInput
            style={styles.usernameInput}
            value={username}
            onChangeText={setUsername}
            placeholder="Shkruaj username"
            placeholderTextColor={colors.textTertiary}
            autoFocus
          />
          <TouchableOpacity onPress={handleSaveUsername} disabled={saving}>
            <Ionicons name="checkmark-circle" size={28} color={colors.success} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.usernameRow} onPress={() => setEditing(true)}>
          <Text style={styles.username}>{username || 'Vendos username'}</Text>
          <Ionicons name="pencil" size={15} color={colors.textTertiary} />
        </TouchableOpacity>
      )}

      <Text style={styles.email}>{user?.email}</Text>
      {isAdmin && (
        <View style={styles.adminBadge}>
          <Text style={styles.adminBadgeText}>👑 Admin</Text>
        </View>
      )}

      <View style={styles.divider} />

      <View style={styles.aboutBox}>
        <Text style={styles.aboutTitle}>Rreth EventHub</Text>
        <Text style={styles.aboutText}>
          EventHub është një aplikacion për krijimin dhe menaxhimin e
          eventeve/aktiviteteve me lokacion. Projekt për lëndën e Mobile
          Programming.
        </Text>
        <Text style={styles.version}>Versioni 1.0.0</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Dil (Logout)</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 24, alignItems: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  avatarWrapper: { marginTop: 20, marginBottom: 16 },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: { width: 90, height: 90, borderRadius: 45 },
  avatarText: { color: '#fff', fontSize: 34, fontFamily: fonts.bold },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  usernameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  username: { fontSize: 19, color: colors.textPrimary, fontFamily: fonts.bold },
  usernameEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
    width: '100%',
    justifyContent: 'center',
  },
  usernameInput: {
    borderBottomWidth: 1.5,
    borderColor: colors.accent,
    fontSize: 17,
    paddingVertical: 4,
    minWidth: 160,
    textAlign: 'center',
    color: colors.textPrimary,
    fontFamily: fonts.medium,
  },
  email: { fontSize: 13, color: colors.textTertiary, marginBottom: 10, fontFamily: fonts.medium },
  adminBadge: {
    backgroundColor: '#FCEFD8',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
  },
  adminBadgeText: { fontSize: 12, color: '#8A5A16', fontFamily: fonts.bold },
  divider: { width: '100%', height: 1, backgroundColor: colors.divider, marginVertical: 12 },
  aboutBox: { width: '100%', marginBottom: 30 },
  aboutTitle: { fontSize: 16, color: colors.textPrimary, marginBottom: 8, fontFamily: fonts.semibold },
  aboutText: { fontSize: 14, color: colors.textSecondary, lineHeight: 20, marginBottom: 8, fontFamily: fonts.regular },
  version: { fontSize: 12, color: colors.textTertiary, fontFamily: fonts.mono },
  logoutButton: {
    backgroundColor: colors.danger,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 18,
    marginTop: 'auto',
  },
  logoutText: { color: '#fff', fontSize: 16, fontFamily: fonts.semibold },
});
