import { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { getEvents } from '../utils/eventService';
import { getFavoriteEventIds, addFavorite, removeFavorite } from '../utils/favoritesService';
import EventCard from '../components/EventCard';

export default function CalendarScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        setLoading(true);
        try {
          const [data, favIds] = await Promise.all([getEvents(), getFavoriteEventIds(user.uid)]);
          if (active) {
            setEvents(data);
            setFavoriteIds(favIds);
          }
        } finally {
          if (active) setLoading(false);
        }
      })();
      return () => { active = false; };
    }, [user.uid])
  );

  const markedDates = useMemo(() => {
    const marks = {};
    events.forEach((e) => {
      if (e.eventDate) {
        marks[e.eventDate] = { marked: true, dotColor: '#6366f1' };
      }
    });
    if (selectedDate) {
      marks[selectedDate] = { ...(marks[selectedDate] || {}), selected: true, selectedColor: '#6366f1' };
    }
    return marks;
  }, [events, selectedDate]);

  const eventsOnDate = useMemo(() => {
    if (!selectedDate) return [];
    return events.filter((e) => e.eventDate === selectedDate);
  }, [events, selectedDate]);

  const handleToggleFavorite = async (eventId) => {
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
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#6366f1" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Text style={styles.headerTitle}>Calendar</Text>

      <Calendar
        markedDates={markedDates}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        theme={{
          selectedDayBackgroundColor: '#6366f1',
          todayTextColor: '#6366f1',
          dotColor: '#6366f1',
          arrowColor: '#6366f1',
          textDayFontWeight: '500',
        }}
        style={styles.calendar}
      />

      <View style={styles.listSection}>
        {!selectedDate ? (
          <Text style={styles.hint}>Zgjedh një datë për të parë eventet.</Text>
        ) : eventsOnDate.length === 0 ? (
          <Text style={styles.hint}>S'ka evente në këtë datë.</Text>
        ) : (
          <FlatList
            data={eventsOnDate}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <EventCard
                event={item}
                isFavorite={favoriteIds.includes(item.id)}
                onToggleFavorite={() => handleToggleFavorite(item.id)}
                onPress={() => navigation.navigate('EventDetail', { event: item })}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fafafa' },
  headerTitle: { fontSize: 24, fontWeight: '800', fontFamily: 'Poppins_800ExtraBold', color: '#111', marginBottom: 14 },
  calendar: { borderRadius: 16, marginBottom: 16, elevation: 1 },
  listSection: { flex: 1 },
  hint: { textAlign: 'center', color: '#9ca3af', marginTop: 30, fontSize: 14 },
});
