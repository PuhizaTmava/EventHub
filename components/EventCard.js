import { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { formatDate } from '../utils/dateUtils';
import { colors, fonts } from '../utils/theme';

function EventCard({ event, onPress, isFavorite, onToggleFavorite }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.92}>
      <View style={styles.imageWrapper}>
        {event.imageBase64 ? (
          <Image source={{ uri: event.imageBase64 }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Text style={styles.imagePlaceholderIcon}>🎉</Text>
          </View>
        )}

        <LinearGradient colors={['transparent', 'rgba(34,28,21,0.55)']} style={styles.gradientOverlay} />

        {event.eventDate ? (
          <View style={styles.dateBadge}>
            <Text style={styles.dateBadgeMonth}>
              {formatDate(event.eventDate).split(' ')[1]?.slice(0, 3).toUpperCase()}
            </Text>
            <Text style={styles.dateBadgeDay}>{formatDate(event.eventDate).split(' ')[0]}</Text>
          </View>
        ) : null}

        {onToggleFavorite && (
          <TouchableOpacity
            style={styles.favButton}
            onPress={onToggleFavorite}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={19} color={isFavorite ? '#ef4444' : '#fff'} />
          </TouchableOpacity>
        )}

        <View style={styles.titleOverlay}>
          <Text style={styles.titleOnImage} numberOfLines={2}>{event.title}</Text>
        </View>
      </View>

      <View style={styles.info}>
        {event.description ? (
          <Text style={styles.description} numberOfLines={2}>{event.description}</Text>
        ) : null}

        <View style={styles.footerRow}>
          <View style={styles.locationChip}>
            <Ionicons name="location-sharp" size={13} color={colors.accent} />
            <Text style={styles.locationText} numberOfLines={1}>
              {event.address
                ? event.address
                : typeof event.distanceKm === 'number'
                ? `${event.distanceKm.toFixed(1)} km`
                : 'N/A'}
            </Text>
          </View>

          <View style={styles.arrowCircle}>
            <Ionicons name="arrow-forward" size={14} color="#fff" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default memo(EventCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#785F46',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  imageWrapper: { width: '100%', height: 190, backgroundColor: colors.placeholderBg, position: 'relative' },
  image: { width: '100%', height: '100%' },
  imagePlaceholder: { justifyContent: 'center', alignItems: 'center' },
  imagePlaceholderIcon: { fontSize: 44 },
  gradientOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '65%' },
  dateBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: 'center',
    shadowColor: '#785F46',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  dateBadgeMonth: { fontSize: 10, fontFamily: fonts.mono, color: colors.accent, letterSpacing: 0.8 },
  dateBadgeDay: { fontSize: 16, fontFamily: fonts.extrabold, color: colors.textPrimary, lineHeight: 18 },
  favButton: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(34,28,21,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleOverlay: { position: 'absolute', bottom: 12, left: 16, right: 16 },
  titleOnImage: {
    fontSize: 19,
    fontFamily: fonts.extrabold,
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  info: { padding: 16, paddingTop: 12 },
  description: { fontSize: 13.5, fontFamily: fonts.regular, color: colors.textSecondary, marginBottom: 12, lineHeight: 19 },
  footerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    flexShrink: 1,
    marginRight: 10,
  },
  locationText: { fontSize: 12.5, fontFamily: fonts.bold, color: colors.accent, marginLeft: 4, flexShrink: 1 },
  arrowCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
