import { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { getUserTickets } from '../utils/ticketsService';
import TicketCard from '../components/TicketCard';
import { colors, fonts } from '../utils/theme';

export default function TicketsScreen() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        setLoading(true);
        try {
          const data = await getUserTickets(user.uid);
          if (active) setTickets(data);
        } finally {
          if (active) setLoading(false);
        }
      })();
      return () => { active = false; };
    }, [user.uid])
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
      <Text style={styles.headerTitle}>My Tickets</Text>
      <FlatList
        data={tickets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TicketCard ticket={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>🎟️</Text>
            <Text style={styles.empty}>Ende s'ke tiketa të blera.</Text>
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
  empty: { textAlign: 'center', color: colors.textTertiary, fontSize: 15, fontFamily: fonts.medium },
});
