// src/components/nurse/TaskItem.js
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TaskItem({ title, time, completed, onToggle, type }) {
  const getIcon = () => {
    switch(type) {
      case 'med': return { name: 'checkmark-circle', color: '#4CAF50' };
      case 'vital': return { name: 'heart', color: '#2FA4E7' };
      default: return { name: 'fitness', color: '#2FA4E7' };
    }
  };

  const iconData = getIcon();

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View style={[styles.iconBadge, { backgroundColor: completed ? '#E8F5E9' : '#E3F2FD' }]}>
          <Ionicons name={iconData.name} size={20} color={completed ? '#4CAF50' : iconData.color} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, completed && styles.completedText]}>{title}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={onToggle}>
        <Ionicons 
          name={completed ? "checkbox" : "square-outline"} 
          size={24} 
          color={completed ? "#4CAF50" : "#ccc"} 
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  leftSection: { flexDirection: 'row', alignItems: 'center' },
  iconBadge: { padding: 8, borderRadius: 10, marginRight: 12 },
  textContainer: { justifyContent: 'center' },
  title: { fontSize: 15, fontWeight: '600', color: '#333' },
  completedText: { textDecorationLine: 'line-through', color: '#aaa' },
  time: { fontSize: 12, color: '#888' },
});