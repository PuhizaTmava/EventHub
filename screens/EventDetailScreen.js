import { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { addFavorite, removeFavorite, getFavoriteEventIds } from '../utils/favoritesService';
import { purchaseTicket } from '../utils/ticketsService';
import { formatDate } from '../utils/dateUtils';
import { colors, fonts } from '../utils/theme';

export default function EventDetailScreen({ route, navigation }) {
  const { event } = route.params;
  const { user, isAdmin } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    (async () => {
      const ids = await getFavoriteEventIds(user.uid);
      setIsFavorite(ids.includes(event.id));
    })();
  }, []);

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await removeFavorite(user.uid, event.id);
        setIsFavorite(false);
      } else {
        await addFavorite(user.uid, event.id);
        setIsFavorite(true);
      }
    } catch (error) {
      Alert.alert('Gabim', error.message);
    }
  };

  const handleBuyTicket = async () => {
    setBuying(true);
    try {
      const ticket = await purchaseTicket(user.uid, event);
      navigation.navigate('TicketDetail', { ticket });
    } catch (error) {
      Alert.alert('Gabim', error.message);
    } finally {
      setBuying(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageWrapper}>
          {event.imageBase64 ? (
            <Image source={{ uri: event.imageBase64 }} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]}>
              <Text style={{ fontSize: 50 }}>🎉</Text>
            </View>
          )}
          <TouchableOpacity style={styles.favButton} onPress={toggleFavorite}>
            <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={22} color={isFavorite ? '#ef4444' : '#fff'} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{event.title}</Text>

          {event.eventDate ? (
            <View style={styles.row}>
              <Ionicons name="calendar" size={16} color={colors.accent} />
              <Text style={styles.rowText}>{formatDate(event.eventDate)}</Text>
            </View>
          ) : null}

          {event.address || typeof event.distanceKm === 'number' ? (
            <View style={styles.row}>
              <Ionicons name="location-sharp" size={16} color={colors.accent} />
              <Text style={styles.rowText}>
                {event.address || `${event.distanceKm.toFixed(1)} km larg`}
              </Text>
            </View>
          ) : null}

          {event.description ? (
            <>
              <Text style={styles.sectionTitle}>Rreth eventit</Text>
              <Text style={styles.description}>{event.description}</Text>
            </>
          ) : null}

          <TouchableOpacity style={styles.buyButton} onPress={handleBuyTicket} disabled={buying}>
            <Ionicons name="ticket" size={18} color="#fff" />
            <Text style={styles.buyButtonText}>{buying ? 'Duke blerë...' : 'Blej Tiketën'}</Text>
          </TouchableOpacity>

          {isAdmin && (
            <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('AddEditEvent', { event })}>
              <Ionicons name="create-outline" size={18} color={colors.accent} />
              <Text style={styles.editButtonText}>Edito Eventin</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  imageWrapper: { width: '100%', height: 240, backgroundColor: colors.placeholderBg },
  image: { width: '100%', height: '100%' },
  imagePlaceholder: { justifyContent: 'center', alignItems: 'center' },
  favButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(34,28,21,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: { padding: 20 },
  title: { fontSize: 24, color: colors.textPrimary, marginBottom: 12, fontFamily: fonts.extrabold, letterSpacing: -0.5 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  rowText: { fontSize: 14, color: colors.textSecondary, marginLeft: 8, fontFamily: fonts.medium },
  sectionTitle: { fontSize: 12, color: colors.textTertiary, marginTop: 16, marginBottom: 6, fontFamily: fonts.mono, textTransform: 'uppercase', letterSpacing: 1 },
  description: { fontSize: 15, color: colors.textSecondary, lineHeight: 22, fontFamily: fonts.regular },
  buyButton: {
    flexDirection: 'row',
    backgroundColor: colors.accent,
    padding: 16,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 26,
    gap: 8,
  },
  buyButtonText: { color: '#fff', fontSize: 16, fontFamily: fonts.bold },
  editButton: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    padding: 14,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 8,
  },
  editButtonText: { color: colors.accent, fontSize: 15, fontFamily: fonts.bold },
});
