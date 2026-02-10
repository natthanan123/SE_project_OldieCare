import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { COLORS } from '../theme';
import { getThreads } from '../api/client';

export default function ChatScreen({ navigation }) {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getThreads();
        if (mounted) setThreads(data);
      } catch (e) {
        if (mounted) setError(e.message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => navigation.navigate('ChatDetail', { name: item.name, role: item.role, threadId: item.id })}
    >
      <View style={styles.avatarPlaceholder}>
        <Text style={{color: COLORS.primary}}>{(item.name || '?').charAt(0)}</Text>
      </View>
      <View style={styles.chatInfo}>
        <View style={styles.row}>
          <Text style={styles.nameText}>{item.name}</Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
        <Text style={styles.roleText}>{item.role}</Text>
        <Text numberOfLines={1} style={styles.lastMsg}>{item.lastMsg}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading && <Text style={{ padding: 16 }}>Loading…</Text>}
      {error && !loading && <Text style={{ padding: 16, color: 'red' }}>{error}</Text>}
      {!loading && !error && (
        <FlatList
          data={threads}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={{ padding: 16, color: COLORS.textSub }}>No conversations</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  chatItem: { flexDirection: 'row', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', alignItems: 'center' },
  avatarPlaceholder: { width: 55, height: 55, borderRadius: 27.5, backgroundColor: '#E1F5FE', justifyContent: 'center', alignItems: 'center' },
  chatInfo: { flex: 1, marginLeft: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  nameText: { fontSize: 16, fontWeight: 'bold', color: COLORS.textMain },
  timeText: { fontSize: 12, color: COLORS.textSub },
  roleText: { fontSize: 12, color: COLORS.primary, fontWeight: '600', marginBottom: 2 },
  lastMsg: { fontSize: 14, color: COLORS.textSub },
});
