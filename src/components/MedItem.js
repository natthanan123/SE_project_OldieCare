import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';

function badgeColor(status) {
  switch ((status || '').toLowerCase()) {
    case 'taken':
    case 'done':
      return COLORS.success;
    case 'missed':
    case 'late':
      return COLORS.danger;
    default:
      return COLORS.warning;
  }
}

export function MedItem({ name, time, status }) {
  const color = badgeColor(status);
  return (
    <View style={styles.item}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{name || 'Medication'}</Text>
        <Text style={styles.time}>{time || '-'}</Text>
      </View>
      <View style={[styles.badge, { backgroundColor: color }]}> 
        <Text style={styles.badgeText}>{(status || 'pending').toUpperCase()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  name: { fontSize: 16, fontWeight: '600', color: COLORS.textMain },
  time: { fontSize: 13, color: COLORS.textSub, marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  badgeText: { color: COLORS.white, fontWeight: '700', fontSize: 12 },
});
