import { useState, useCallback, useEffect, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { getEvents } from '../utils/eventService';
import { getDistanceKm } from '../utils/distance';
import { getFavoriteEventIds, addFavorite, removeFavorite } from '../utils/favoritesService';
import useLocation from '../hooks/useLocation';
import EventCard from '../components/EventCard';
import { colors, fonts } from '../utils/theme';

export default function HomeScreen({ navigation }) {
  const { user, isAdmin } = useAuth();
  const { location: myLocation } = useLocation();
  const [events, setEvents] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [data, favIds] = await Promise.all([getEvents(), getFavoriteEventIds(user.uid)]);
      setEvents(data);
      setFavoriteIds(favIds);
    } catch (error) {
      Alert.alert('Gabim', 'S\'u arrit të ngarkohen eventet.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadData);
    return unsubscribe;
  }, [navigation]);

  const sortedEvents = useMemo(() => {
    let list = events;

    if (myLocation) {
      list = list
        .map((event) => ({
          ...event,
          distanceKm: event.location ? getDistanceKm(myLocation, event.location) : null,
        }))
        .sort((a, b) => {
          if (a.distanceKm === null) return 1;
          if (b.distanceKm === null) return -1;
          return a.distanceKm - b.distanceKm;
        });
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((e) => e.title?.toLowerCase().includes(q));
    }

    return list;
  }, [events, myLocation, search]);

  const handleToggleFavorite = useCallback(
    async (eventId) => {
      const isFav = favoriteIds.includes(eventId);
      try {
        if (isFav) {
          await removeFavorite(user.uid, eventId);
          setFavoriteIds((prev) => prev.filter((id) => id !== eventId));
        } else {
          await addFavorite(user.uid, eventId);
          setFavoriteIds((prev) => [...prev, eventId]);
        }
      } catch (error) {
        Alert.alert('Gabim', error.message);
      }
    },
    [favoriteIds, user.uid]
  );

  const renderItem = useCallback(
    ({ item }) => (
      <EventCard
        event={item}
        isFavorite={favoriteIds.includes(item.id)}
        onToggleFavorite={() => handleToggleFavorite(item.id)}
        onPress={() => navigation.navigate('EventDetail', { event: item })}
      />
    ),
    [favoriteIds, handleToggleFavorite, navigation]
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={colors.accent} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Mirësevjen 👋</Text>
        <Text style={styles.headerTitle}>Upcoming Events</Text>
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color={colors.textTertiary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Kërko evente..."
          placeholderTextColor={colors.textTertiary}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={sortedEvents}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>🎈</Text>
            <Text style={styles.empty}>
              {search
                ? 'S\'ka rezultate për këtë kërkim.'
                : `Ende s'ka evente.${isAdmin ? '\nShtoje me butonin "+" poshtë.' : ''}`}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  header: { marginBottom: 14, paddingTop: 4 },
  greeting: { fontSize: 13, color: colors.textTertiary, marginBottom: 2, fontFamily: fonts.medium },
  headerTitle: { fontSize: 26, color: colors.textPrimary, fontFamily: fonts.extrabold, letterSpacing: -0.5 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 18,
    paddingHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#785F46',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  searchInput: { flex: 1, paddingVertical: 14, marginLeft: 10, fontSize: 15, color: colors.textPrimary, fontFamily: fonts.medium },
  list: { flexGrow: 1, paddingBottom: 20 },
  emptyBox: { alignItems: 'center', marginTop: 60 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  empty: { textAlign: 'center', color: colors.textTertiary, fontSize: 15, lineHeight: 22, fontFamily: fonts.medium },
});
