import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';

export function HealthCard({ label, value, unit }) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <Text style={styles.value}>{String(value ?? '')}</Text>
        {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 12,
  },
  label: { color: COLORS.textSub, fontSize: 13, marginBottom: 6 },
  row: { flexDirection: 'row', alignItems: 'flex-end' },
  value: { fontSize: 24, fontWeight: '700', color: COLORS.textMain },
  unit: { marginLeft: 4, fontSize: 14, color: COLORS.textSub, marginBottom: 3 },
});
