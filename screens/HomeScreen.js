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
        <ActivityIndicator size="large" color="#6366f1" />
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
        <Ionicons name="search" size={18} color="#9ca3af" />
        <TextInput
          style={styles.searchInput}
          placeholder="Kërko evente..."
          placeholderTextColor="#9ca3af"
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
  container: { flex: 1, backgroundColor: '#fafafa', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fafafa' },
  header: { marginBottom: 14, paddingTop: 4 },
  greeting: { fontSize: 13, color: '#9ca3af', marginBottom: 2 },
  headerTitle: { fontSize: 24, fontWeight: '800', fontFamily: 'Poppins_800ExtraBold', color: '#111' },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  searchInput: { flex: 1, paddingVertical: 12, marginLeft: 8, fontSize: 15, color: '#111' },
  list: { flexGrow: 1, paddingBottom: 20 },
  emptyBox: { alignItems: 'center', marginTop: 60 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  empty: { textAlign: 'center', color: '#9ca3af', fontSize: 15, lineHeight: 22 },
});
