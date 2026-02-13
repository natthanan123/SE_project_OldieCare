import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '../theme/colors';
import { getReports } from '../api/client';

export default function ReportScreen() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getReports();
        if (mounted) setReports(data);
      } catch (e) {
        if (mounted) setError(e.message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) return <View style={styles.container}><ActivityIndicator color={COLORS.primary} /></View>;
  if (error) return <View style={styles.container}><Text style={{ color: 'red' }}>{error}</Text></View>;

  return (
    <View style={styles.container}>
      <FlatList
        data={reports}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={{color: COLORS.success, fontWeight: 'bold'}}>{item.status}</Text>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSub}>พยาบาล: {item.nurse} | {item.time}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: COLORS.textSub }}>ไม่มีรายงาน</Text>}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: COLORS.background },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 15, marginBottom: 15, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginVertical: 5 },
  cardSub: { color: COLORS.textSub, fontSize: 12 }
});
