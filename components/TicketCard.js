import { View, Text, StyleSheet } from 'react-native';
import { formatDate } from '../utils/dateUtils';

// Gjeneron nje "barkod" fals (vetem dekorativ) bazuar ne kodin e tiketes
function generateBarWidths(code) {
  return code.split('').map((ch) => (ch.charCodeAt(0) % 3) + 1);
}

export default function TicketCard({ ticket }) {
  const barWidths = generateBarWidths(ticket.ticketCode || 'TCK000000');

  return (
    <View style={styles.card}>
      <View style={styles.topSection}>
        {ticket.eventDate ? (
          <Text style={styles.dateText}>{formatDate(ticket.eventDate)}</Text>
        ) : null}
        <Text style={styles.title} numberOfLines={2}>{ticket.eventTitle}</Text>
      </View>

      <View style={styles.dividerRow}>
        <View style={styles.notchLeft} />
        <View style={styles.dashedLine} />
        <View style={styles.notchRight} />
      </View>

      <View style={styles.bottomSection}>
        <Text style={styles.idLabel}>TICKET ID</Text>
        <Text style={styles.idValue}>{ticket.ticketCode}</Text>
        <View style={styles.barcodeRow}>
          {barWidths.map((w, i) => (
            <View key={i} style={[styles.bar, { width: w }]} />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  topSection: { padding: 20, paddingBottom: 16 },
  dateText: {
    color: '#6366f1',
    fontWeight: '700', fontFamily: 'Poppins_700Bold',
    fontFamily: 'Poppins_700Bold',
    fontSize: 12,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: { fontSize: 19, fontWeight: '800', fontFamily: 'Poppins_800ExtraBold', color: '#111' },
  dividerRow: { height: 24, justifyContent: 'center' },
  dashedLine: {
    marginHorizontal: 24,
    borderTopWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#e5e7eb',
  },
  notchLeft: {
    position: 'absolute',
    left: -12,
    top: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fafafa',
  },
  notchRight: {
    position: 'absolute',
    right: -12,
    top: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fafafa',
  },
  bottomSection: { padding: 20, paddingTop: 4 },
  idLabel: { fontSize: 11, color: '#9ca3af', fontWeight: '700', fontFamily: 'Poppins_700Bold', letterSpacing: 1, marginBottom: 4 },
  idValue: { fontSize: 15, fontWeight: '700', fontFamily: 'Poppins_700Bold', color: '#111', marginBottom: 16 },
  barcodeRow: { flexDirection: 'row', alignItems: 'flex-end', height: 40 },
  bar: { height: '100%', backgroundColor: '#111', marginRight: 2, borderRadius: 1 },
});
