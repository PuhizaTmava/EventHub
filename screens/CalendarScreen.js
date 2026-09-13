import { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { getEvents } from '../utils/eventService';
import { getFavoriteEventIds, addFavorite, removeFavorite } from '../utils/favoritesService';
import { getDistanceKm } from '../utils/distance';
import useLocation from '../hooks/useLocation';
import EventCard from '../components/EventCard';
import { colors, fonts } from '../utils/theme';

export default function CalendarScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { location: myLocation } = useLocation();
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

  const eventsWithDistance = useMemo(() => {
    if (!myLocation) return events;
    return events.map((event) => ({
      ...event,
      distanceKm: event.location ? getDistanceKm(myLocation, event.location) : null,
    }));
  }, [events, myLocation]);

  const markedDates = useMemo(() => {
    const marks = {};
    events.forEach((e) => {
      if (e.eventDate) {
        marks[e.eventDate] = { marked: true, dotColor: colors.accent };
      }
    });
    if (selectedDate) {
      marks[selectedDate] = { ...(marks[selectedDate] || {}), selected: true, selectedColor: colors.accent };
    }
    return marks;
  }, [events, selectedDate]);

  const eventsOnDate = useMemo(() => {
    if (!selectedDate) return [];
    return eventsWithDistance.filter((e) => e.eventDate === selectedDate);
  }, [eventsWithDistance, selectedDate]);

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
        <ActivityIndicator size="large" color={colors.accent} />
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
          selectedDayBackgroundColor: colors.accent,
          todayTextColor: colors.accent,
          dotColor: colors.accent,
          arrowColor: colors.accent,
          textDayFontFamily: fonts.medium,
          textMonthFontFamily: fonts.bold,
          textDayHeaderFontFamily: fonts.semibold,
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
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  headerTitle: { fontSize: 26, color: colors.textPrimary, marginBottom: 14, fontFamily: fonts.extrabold, letterSpacing: -0.5 },
  calendar: { borderRadius: 20, marginBottom: 16, elevation: 1 },
  listSection: { flex: 1 },
  hint: { textAlign: 'center', color: colors.textTertiary, marginTop: 30, fontSize: 14, fontFamily: fonts.medium },
});
