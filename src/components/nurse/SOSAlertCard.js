// src/components/nurse/SOSAlertCard.js
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function SOSAlertCard({ elderName, room, onRespond }) {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.title}>SOS Alert</Text>
        <Text style={styles.text}>{elderName} - Room {room}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={onRespond}>
        <Text style={styles.buttonText}>Respond</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FF5B5B',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
  },
  text: {
    color: '#fff',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FF5B5B',
    fontWeight: 'bold',
  },
});