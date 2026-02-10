import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { COLORS } from '../theme';
import { CheckCircle2 } from 'lucide-react-native';
import { getNotifications } from '../api/client';

export default function AlertScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getNotifications();
        if (mounted) setItems(data);
      } catch (e) {
        if (mounted) setError(e.message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>การแจ้งเตือนล่าสุด</Text>
      {loading && <ActivityIndicator color={COLORS.primary} />}
      {error && !loading && <Text style={{ color: 'red' }}>{error}</Text>}
      {!loading && !error && (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={styles.alertCard}>
              <CheckCircle2 color={COLORS.success} size={20} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.msg}>{item.msg}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={{ color: COLORS.textSub }}>ยังไม่มีการแจ้งเตือน</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  alertCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 15, borderRadius: 15, marginBottom: 10, borderWidth: 1, borderColor: COLORS.border },
  msg: { fontSize: 14, color: COLORS.textMain },
  time: { fontSize: 11, color: COLORS.textSub, marginTop: 5 }
});
