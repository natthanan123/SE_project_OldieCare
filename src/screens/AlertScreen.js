import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { COLORS } from '../theme/colors';
import { CheckCircle2 } from 'lucide-react-native';
import { getNotifications } from '../api/client';

export default function AlertScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getNotifications();
        setItems(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>การแจ้งเตือนล่าสุด</Text>
      {loading ? <ActivityIndicator /> : (
        <FlatList
          data={items}
          keyExtractor={(item, index) => String(item.id || index)}
          renderItem={({ item }) => (
            <View style={styles.alertCard}>
              <CheckCircle2 color={COLORS.success} size={20} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.msg}>{item.msg || item.message}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
// Styles อ้างอิงตามไฟล์เดิมของคุณ
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12, color: '#333' },
  alertCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 12, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#E0E7FF' },
  msg: { color: '#333', fontSize: 14 },
  time: { color: '#999', fontSize: 12, marginTop: 2 },
});
