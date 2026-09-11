import { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatDate } from '../utils/dateUtils';

function EventCard({ event, onPress, isFavorite, onToggleFavorite }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imageWrapper}>
        {event.imageBase64 ? (
          <Image source={{ uri: event.imageBase64 }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Text style={styles.imagePlaceholderIcon}>🎉</Text>
          </View>
        )}

        {event.eventDate ? (
          <View style={styles.dateBadge}>
            <Text style={styles.dateBadgeText}>{formatDate(event.eventDate)}</Text>
          </View>
        ) : null}

        {onToggleFavorite && (
          <TouchableOpacity
            style={styles.favButton}
            onPress={onToggleFavorite}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={18}
              color={isFavorite ? '#ef4444' : '#fff'}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{event.title}</Text>
        {event.description ? (
          <Text style={styles.description} numberOfLines={1}>
            {event.description}
          </Text>
        ) : null}

        <View style={styles.locationRow}>
          <Ionicons name="location-sharp" size={14} color="#6366f1" />
          <Text style={styles.locationText} numberOfLines={1}>
            {event.address
              ? event.address
              : typeof event.distanceKm === 'number'
              ? `${event.distanceKm.toFixed(1)} km larg`
              : 'Lokacioni i panjohur'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default memo(EventCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginBottom: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  imageWrapper: { width: '100%', height: 160, backgroundColor: '#eef0ff' },
  image: { width: '100%', height: '100%' },
  imagePlaceholder: { justifyContent: 'center', alignItems: 'center' },
  imagePlaceholderIcon: { fontSize: 40 },
  dateBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  dateBadgeText: { fontSize: 12, fontWeight: '700', fontFamily: 'Poppins_700Bold', color: '#374151' },
  favButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: { padding: 14 },
  title: { fontSize: 17, fontWeight: '700', fontFamily: 'Poppins_700Bold', color: '#111', marginBottom: 3 },
  description: { fontSize: 13, color: '#6b7280', marginBottom: 8 },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  locationText: { fontSize: 13, color: '#6366f1', fontWeight: '600', fontFamily: 'Poppins_600SemiBold', marginLeft: 4, flexShrink: 1 },
});
