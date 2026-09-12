import { View, Text, StyleSheet } from 'react-native';
import { formatDate } from '../utils/dateUtils';
import { colors, fonts } from '../utils/theme';

function generateBarWidths(code) {
  return code.split('').map((ch) => (ch.charCodeAt(0) % 3) + 1);
}

export default function TicketCard({ ticket }) {
  const barWidths = generateBarWidths(ticket.ticketCode || 'TCK000000');

  return (
    <View style={styles.card}>
      <View style={styles.topSection}>
        <View style={styles.headRow}>
          {ticket.eventDate ? (
            <Text style={styles.dateText}>{formatDate(ticket.eventDate)}</Text>
          ) : <View />}
          <View style={styles.validBadge}>
            <Text style={styles.validBadgeText}>VALID</Text>
          </View>
        </View>
        <Text style={styles.title} numberOfLines={2}>{ticket.eventTitle}</Text>
      </View>

      <View style={styles.dividerRow}>
        <View style={styles.notchLeft} />
        <View style={styles.dashedLine} />
        <View style={styles.notchRight} />
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.barcodeBox}>
          <View style={styles.barcodeRow}>
            {barWidths.map((w, i) => (
              <View key={i} style={[styles.bar, { width: w }]} />
            ))}
          </View>
        </View>
        <Text style={styles.idValue}>{ticket.ticketCode}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.accent,
    borderRadius: 26,
    marginBottom: 18,
    overflow: 'hidden',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 5,
  },
  topSection: { padding: 20, paddingBottom: 16 },
  headRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 },
  dateText: { color: '#C9D8FF', fontFamily: fonts.mono, fontSize: 11, letterSpacing: 1 },
  validBadge: { backgroundColor: '#fff', borderRadius: 999, paddingHorizontal: 9, paddingVertical: 4 },
  validBadgeText: { color: '#1F3A8A', fontFamily: fonts.bold, fontSize: 11 },
  title: { fontSize: 20, fontFamily: fonts.extrabold, color: '#fff', lineHeight: 25 },
  dividerRow: { height: 1 },
  dashedLine: { height: 1, backgroundColor: 'rgba(255,255,255,0.35)' },
  notchLeft: { display: 'none' },
  notchRight: { display: 'none' },
  bottomSection: { padding: 20, paddingTop: 20, alignItems: 'center' },
  barcodeBox: {
    width: '100%',
    height: 64,
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  barcodeRow: { flexDirection: 'row', alignItems: 'flex-end', height: 44, width: '85%' },
  bar: { height: '100%', backgroundColor: colors.textPrimary, marginRight: 2, borderRadius: 1 },
  idValue: { fontSize: 13, fontFamily: fonts.mono, color: '#D4E0FF', letterSpacing: 2 },
});
