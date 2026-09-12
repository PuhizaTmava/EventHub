import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import TicketCard from '../components/TicketCard';
import { colors, fonts } from '../utils/theme';

export default function TicketDetailScreen({ route, navigation }) {
  const { ticket } = route.params;

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <View style={styles.successBox}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark" size={32} color="#fff" />
        </View>
        <Text style={styles.successTitle}>Tiketa u ble me sukses!</Text>
      </View>

      <TicketCard ticket={ticket} />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Main', { screen: 'TicketsTab' })}
      >
        <Text style={styles.buttonText}>Shiko krejt tiketat</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Main')}>
        <Text style={styles.secondaryButtonText}>Kthehu te Home</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20 },
  successBox: { alignItems: 'center', marginBottom: 24, marginTop: 12 },
  successIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  successTitle: { fontSize: 18, color: colors.textPrimary, fontFamily: fonts.extrabold },
  button: {
    backgroundColor: colors.accent,
    padding: 17,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: '#fff', fontSize: 16, fontFamily: fonts.bold },
  secondaryButton: { padding: 14, alignItems: 'center', marginTop: 4 },
  secondaryButtonText: { color: colors.accent, fontSize: 15, fontFamily: fonts.semibold },
});
