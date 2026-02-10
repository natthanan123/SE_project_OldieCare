import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme';

export const HealthCard = ({ label, value, unit }) => (
  <View style={styles.card}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value} <Text style={styles.unit}>{unit}</Text></Text>
  </View>
);

const styles = StyleSheet.create({
  card: { 
    width: '48%', 
    backgroundColor: COLORS.white, 
    padding: 15, 
    borderRadius: 15,
    borderWidth: 1,           
    borderColor: COLORS.border,
    elevation: 2, 
    marginBottom: 10
  },
  label: { color: COLORS.textSub, fontSize: 12, fontWeight: '500' },
  value: { fontSize: 18, fontWeight: 'bold', marginTop: 5, color: COLORS.textMain },
  unit: { fontSize: 12, fontWeight: 'normal', color: '#666' }
});