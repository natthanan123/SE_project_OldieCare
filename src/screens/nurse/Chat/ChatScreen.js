import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MOCK_CHATS } from '../../../constants/mockData'; // ดึงข้อมูลที่แยกไว้มาใช้

export default function ChatScreen({ navigation }) {
    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.chatItem} 
            onPress={() => navigation.navigate('ChatDetail', { name: item.name })}
        >
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.chatContent}>
                <View style={styles.chatHeader}>
                    <Text style={styles.chatName}>{item.name}</Text>
                    <Text style={styles.chatTime}>{item.time}</Text>
                </View>
                <View style={styles.msgRow}>
                    <Text style={styles.lastMsg} numberOfLines={1}>{item.lastMsg}</Text>
                    {item.unread > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{item.unread}</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Messages</Text>
            </View>
            <FlatList
                data={MOCK_CHATS}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listPadding}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },
    header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 24, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
    headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#333' },
    listPadding: { paddingBottom: 20 },
    chatItem: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 15, alignItems: 'center' },
    avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#EEE' },
    chatContent: { flex: 1, marginLeft: 15 },
    chatHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    chatName: { fontSize: 17, fontWeight: '700', color: '#333' },
    chatTime: { fontSize: 12, color: '#AAA' },
    msgRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    lastMsg: { fontSize: 14, color: '#777', flex: 1, marginRight: 10 },
    badge: { backgroundColor: '#FF5252', borderRadius: 10, minWidth: 20, height: 20, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 6 },
    badgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' }
});