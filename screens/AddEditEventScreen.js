import { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  View,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import useLocation from '../hooks/useLocation';
import useImagePicker from '../hooks/useImagePicker';
import { addEvent, updateEvent, deleteEvent } from '../utils/eventService';
import { useAuth } from '../context/AuthContext';
import { formatDate, toISODate } from '../utils/dateUtils';
import { colors, fonts } from '../utils/theme';

export default function AddEditEventScreen({ navigation, route }) {
  const existingEvent = route.params?.event;
  const isEditing = !!existingEvent;

  const { user, isAdmin } = useAuth();
  const { location, errorMsg, loading: locationLoading } = useLocation();
  const { imageBase64, setImageBase64, pickImage } = useImagePicker();

  const [title, setTitle] = useState(existingEvent?.title || '');
  const [description, setDescription] = useState(existingEvent?.description || '');
  const [address, setAddress] = useState(existingEvent?.address || '');
  const [eventDate, setEventDate] = useState(
    existingEvent?.eventDate ? new Date(existingEvent.eventDate) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [saving, setSaving] = useState(false);

  useState(() => {
    if (existingEvent?.imageBase64) {
      setImageBase64(existingEvent.imageBase64);
    }
  });

  if (!isAdmin) {
    return (
      <SafeAreaView style={styles.blockedContainer}>
        <Text style={styles.blockedIcon}>🔒</Text>
        <Text style={styles.blockedText}>Vetëm administratorët mund të shtojnë/editojnë evente.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Kthehu</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Gabim', 'Titulli i eventit është i domosdoshëm.');
      return;
    }

    const todayISO = toISODate(new Date());
    if (toISODate(eventDate) < todayISO) {
      Alert.alert('Gabim', 'S\'mund të krijosh event me datë në të kaluarën.');
      return;
    }

    setSaving(true);
    try {
      if (isEditing) {
        await updateEvent(existingEvent.id, {
          title: title.trim(),
          description: description.trim(),
          address: address.trim(),
          eventDate: toISODate(eventDate),
          imageBase64: imageBase64 || null,
        });
      } else {
        if (!location) {
          Alert.alert('Gabim', 'S\'u arrit të merret lokacioni. Provo prapë.');
          setSaving(false);
          return;
        }
        await addEvent({
          title: title.trim(),
          description: description.trim(),
          address: address.trim(),
          eventDate: toISODate(eventDate),
          imageBase64: imageBase64 || null,
          location: { latitude: location.latitude, longitude: location.longitude },
          createdBy: user.uid,
          createdByEmail: user.email,
        });
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Gabim', error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEvent = () => {
    Alert.alert('Fshij Eventin', 'A je i sigurt që don me e fshi këtë event? Kjo s\'kthehet mbrapa.', [
      { text: 'Anulo', style: 'cancel' },
      {
        text: 'Fshij',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteEvent(existingEvent.id);
            navigation.goBack();
          } catch (error) {
            Alert.alert('Gabim', error.message);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {imageBase64 ? (
            <Image source={{ uri: imageBase64 }} style={styles.previewImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderIcon}>📷</Text>
              <Text style={styles.imagePlaceholderText}>Shto foto</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Titulli i eventit *</Text>
        <TextInput
          style={styles.input}
          placeholder="p.sh. Koncert Jazz"
          placeholderTextColor={colors.textTertiary}
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Data</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={18} color={colors.accent} />
            <Text style={styles.dateText}>{formatDate(toISODate(eventDate))}</Text>
          </View>
        </TouchableOpacity>
        {showDatePicker && (
          <View>
            <DateTimePicker
              value={eventDate}
              mode="date"
              minimumDate={new Date()}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selected) => {
                if (Platform.OS === 'android') setShowDatePicker(false);
                if (selected) setEventDate(selected);
              }}
            />
            {Platform.OS === 'ios' && (
              <TouchableOpacity style={styles.doneButton} onPress={() => setShowDatePicker(false)}>
                <Text style={styles.doneButtonText}>Gati</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <Text style={styles.label}>Përshkrimi</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Detaje rreth eventit..."
          placeholderTextColor={colors.textTertiary}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Adresa (manuale)</Text>
        <TextInput
          style={styles.input}
          placeholder="p.sh. Sheshi Nëna Terezë, Prishtinë"
          placeholderTextColor={colors.textTertiary}
          value={address}
          onChangeText={setAddress}
        />

        {!isEditing && (
          <View style={styles.locationBox}>
            <Text style={styles.label}>Koordinatat GPS (automatike)</Text>
            {locationLoading ? (
              <View style={styles.locationRow}>
                <ActivityIndicator size="small" color={colors.accent} />
                <Text style={styles.locationText}> Duke marrë lokacionin...</Text>
              </View>
            ) : errorMsg ? (
              <Text style={styles.errorText}>{errorMsg}</Text>
            ) : (
              <Text style={styles.locationText}>
                📍 {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
              </Text>
            )}
          </View>
        )}

        <TouchableOpacity style={[styles.button, saving && styles.buttonDisabled]} onPress={handleSave} disabled={saving}>
          <Text style={styles.buttonText}>
            {saving ? 'Duke ruajtur...' : isEditing ? 'Përditëso Event' : 'Ruaj Event'}
          </Text>
        </TouchableOpacity>

        {isEditing && (
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteEvent}>
            <Ionicons name="trash-outline" size={18} color={colors.danger} />
            <Text style={styles.deleteButtonText}>Fshij Eventin</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { padding: 20 },
  imagePicker: {
    width: '100%',
    height: 180,
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 24,
    backgroundColor: colors.placeholderBg,
  },
  previewImage: { width: '100%', height: '100%' },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#DCCFBD',
    borderStyle: 'dashed',
    borderRadius: 22,
  },
  imagePlaceholderIcon: { fontSize: 32, marginBottom: 6 },
  imagePlaceholderText: { color: colors.accent, fontFamily: fonts.semibold },
  label: { fontSize: 13, color: colors.textSecondary, marginBottom: 8, fontFamily: fonts.bold, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    fontSize: 16,
    color: colors.textPrimary,
    fontFamily: fonts.medium,
    shadowColor: '#785F46',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  dateRow: { flexDirection: 'row', alignItems: 'center' },
  dateText: { fontSize: 16, color: colors.textPrimary, marginLeft: 8, fontFamily: fonts.medium },
  doneButton: { alignSelf: 'flex-end', marginTop: -10, marginBottom: 16 },
  doneButtonText: { color: colors.accent, fontFamily: fonts.bold, fontSize: 15 },
  textArea: { height: 100, textAlignVertical: 'top' },
  locationBox: { marginBottom: 24 },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  locationText: { fontSize: 15, color: colors.accent, fontFamily: fonts.medium },
  errorText: { fontSize: 14, color: colors.danger, fontFamily: fonts.medium },
  button: { backgroundColor: colors.accent, padding: 17, borderRadius: 18, alignItems: 'center', marginTop: 8 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontFamily: fonts.bold },
  deleteButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 14, padding: 14, gap: 6 },
  deleteButtonText: { color: colors.danger, fontFamily: fonts.bold, fontSize: 15 },
  blockedContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30, backgroundColor: colors.background },
  blockedIcon: { fontSize: 40, marginBottom: 16 },
  blockedText: { fontSize: 16, textAlign: 'center', color: colors.textSecondary, marginBottom: 24, fontFamily: fonts.medium },
  backButton: { backgroundColor: colors.accent, paddingVertical: 12, paddingHorizontal: 28, borderRadius: 14 },
  backButtonText: { color: '#fff', fontFamily: fonts.bold },
});
