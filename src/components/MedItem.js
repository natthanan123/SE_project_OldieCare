import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme';

export const MedItem = ({ name, time, status }) => {
  const isTaken = status === 'taken';
  return (
    <View style={[styles.card, isTaken ? styles.takenBorder : styles.pendingBorder]}>
      <View>
        <Text style={[styles.name, isTaken && { color: COLORS.success }]}>{name}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>
      <View style={[styles.dot, { backgroundColor: isTaken ? COLORS.success : COLORS.warning }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: 15, 
    borderRadius: 15, 
    backgroundColor: COLORS.white,
    borderWidth: 1,
    marginBottom: 10,
    borderColor: COLORS.border
  },
  takenBorder: { borderColor: COLORS.success, backgroundColor: '#F0FFF4' },
  pendingBorder: { borderColor: COLORS.border },
  name: { fontWeight: 'bold', color: COLORS.textMain },
  time: { fontSize: 12, color: COLORS.textSub },
  dot: { width: 10, height: 10, borderRadius: 5 }
});