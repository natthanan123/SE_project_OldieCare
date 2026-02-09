// src/components/nurse/HeaderGreeting.js
import { View, Text, StyleSheet } from 'react-native';

export default function HeaderGreeting({ text, taskCount }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{text || 'Good Morning!'}</Text>
      <Text style={styles.subtitle}>You have {taskCount !== undefined ? taskCount : 0} tasks today</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2FA4E7',
    padding: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  title: {
    color: '#fff',
    fontSize: 24, // เพิ่มขนาดตัวอักษร
    fontWeight: 'bold',
    textAlign: 'center', // จัดให้อยู่ตรงกลาง
  },
  subtitle: {
    color: '#EAF6FD',
    marginTop: 8,
    fontSize: 16, // เพิ่มขนาดตัวอักษร
    textAlign: 'center', // จัดให้อยู่ตรงกลาง
  },
});