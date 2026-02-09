// src/components/nurse/ElderCard.js
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function ElderCard({ name, age, conditions, image, onPress }) {
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress} 
      activeOpacity={0.7}
    >
      <View style={styles.row}>
        {/* ส่วนรูปภาพ: ถ้าไม่มี image ส่งมา จะใช้รูปจาก URL สำรองแทน */}
        <Image 
          source={image ? { uri: image } : { uri: 'https://via.placeholder.com/80' }} 
          style={styles.avatar} 
        />

        <View style={styles.infoContainer}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.age}>Age: {age} years</Text>

          <View style={styles.conditions}>
            {Array.isArray(conditions) && conditions.map((c, index) => (
              <View key={`${c}-${index}`} style={styles.tag}>
                <Text style={styles.tagText}>{c}</Text>
              </View>
            ))}
            {(!conditions || conditions.length === 0) && (
              <View style={[styles.tag, { backgroundColor: '#F5F5F5' }]}>
                <Text style={[styles.tagText, { color: '#999' }]}>None</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#eee',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333',
  },
  age: {
    color: '#777',
    fontSize: 14,
    marginTop: 2,
  },
  conditions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  tag: {
    backgroundColor: '#FDECEC',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
    marginTop: 6,
  },
  tagText: {
    fontSize: 12,
    color: '#E57373',
    fontWeight: '600',
  },
});