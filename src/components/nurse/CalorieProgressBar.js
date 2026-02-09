import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

export default function CalorieProgressBar({ consumed, target, label = "Daily Calories" }) {
  // คำนวณเปอร์เซ็นต์ (ไม่ให้เกิน 100%)
  const progress = Math.min((consumed / target) * 100, 100);
  const isOverLimit = consumed > target;

  return (
    <View style={styles.container}>
      <View style={styles.textRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.valueText}>
          <Text style={styles.consumedText}>{consumed}</Text>
          <Text style={styles.targetText}> / {target} kcal</Text>
        </Text>
      </View>
      
      {/* Background Bar */}
      <View style={styles.barBackground}>
        {/* Progress Bar */}
        <View 
          style={[
            styles.barProgress, 
            { width: `${progress}%` },
            isOverLimit && { backgroundColor: '#FF5252' } // เปลี่ยนเป็นสีแดงถ้ากินเกิน
          ]} 
        />
      </View>
      
      {isOverLimit && (
        <Text style={styles.warningText}>Exceeded daily target!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 10, width: '100%' },
  textRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#555' },
  valueText: { fontSize: 14 },
  consumedText: { fontSize: 18, fontWeight: 'bold', color: '#2FA4E7' },
  targetText: { color: '#999' },
  barBackground: { height: 12, backgroundColor: '#E0E0E0', borderRadius: 6, overflow: 'hidden' },
  barProgress: { height: '100%', backgroundColor: '#2FA4E7', borderRadius: 6 },
  warningText: { color: '#FF5252', fontSize: 11, marginTop: 4, textAlign: 'right' }
});