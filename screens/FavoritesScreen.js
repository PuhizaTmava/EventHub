import { useState, useCallback, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { getEvents } from '../utils/eventService';
import { getFavoriteEventIds, removeFavorite } from '../utils/favoritesService';
import { getDistanceKm } from '../utils/distance';
import useLocation from '../hooks/useLocation';
import EventCard from '../components/EventCard';
import { colors, fonts } from '../utils/theme';

export default function FavoritesScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const { location: myLocation } = useLocation();
  const [favEvents, setFavEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        setLoading(true);
        try {
          const [allEvents, favIds] = await Promise.all([getEvents(), getFavoriteEventIds(user.uid)]);
          if (active) setFavEvents(allEvents.filter((e) => favIds.includes(e.id)));
        } finally {
          if (active) setLoading(false);
        }
      })();
      return () => { active = false; };
    }, [user.uid])
  );

  const eventsWithDistance = useMemo(() => {
    if (!myLocation) return favEvents;
    return favEvents.map((event) => ({
      ...event,
      distanceKm: event.location ? getDistanceKm(myLocation, event.location) : null,
    }));
  }, [favEvents, myLocation]);

  const handleToggleFavorite = async (eventId) => {
    try {
      await removeFavorite(user.uid, eventId);
      setFavEvents((prev) => prev.filter((e) => e.id !== eventId));
    } catch (error) {
      Alert.alert('Gabim', error.message);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={colors.accent} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Text style={styles.headerTitle}>Favorites</Text>
      <FlatList
        data={eventsWithDistance}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            isFavorite
            onToggleFavorite={() => handleToggleFavorite(item.id)}
            onPress={() => navigation.navigate('EventDetail', { event: item })}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>❤️</Text>
            <Text style={styles.empty}>Ende s'ke evente favorite.{'\n'}Shtyp zemrën te ndonjë event!</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  headerTitle: { fontSize: 26, color: colors.textPrimary, marginBottom: 16, fontFamily: fonts.extrabold, letterSpacing: -0.5 },
  list: { flexGrow: 1, paddingBottom: 20 },
  emptyBox: { alignItems: 'center', marginTop: 60 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  empty: { textAlign: 'center', color: colors.textTertiary, fontSize: 15, lineHeight: 22, fontFamily: fonts.medium },
});
