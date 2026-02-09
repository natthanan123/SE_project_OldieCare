import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_MESSAGES } from '../../../constants/mockData';

export default function ChatDetailScreen({ route, navigation }) {
    const { name } = route.params;
    const [msg, setMsg] = useState('');
    const [messages, setMessages] = useState(MOCK_MESSAGES);

    const sendMessage = () => {
        if (!msg.trim()) return;
        const newMsg = { id: Date.now().toString(), text: msg, sender: 'me', time: 'Now' };
        setMessages([...messages, newMsg]);
        setMsg('');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{name}</Text>
                <View style={{ width: 40 }} />
            </View>

            <FlatList
                data={messages}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={[styles.bubble, item.sender === 'me' ? styles.myBubble : styles.otherBubble]}>
                        <Text style={[styles.msgText, item.sender === 'me' ? styles.myText : styles.otherText]}>
                            {item.text}
                        </Text>
                    </View>
                )}
                contentContainerStyle={styles.chatList}
            />

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} keyboardVerticalOffset={90}>
                <View style={styles.inputArea}>
                    <TouchableOpacity style={styles.actionBtn}>
                        <Ionicons name="add" size={26} color="#73C7FF" />
                    </TouchableOpacity>
                    <TextInput 
                        style={styles.input} 
                        placeholder="Type a message..." 
                        value={msg}
                        onChangeText={setMsg}
                        multiline
                    />
                    <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
                        <Ionicons name="send" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 60, paddingBottom: 15, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#EEE' },
    backBtn: { padding: 8 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    chatList: { padding: 20, paddingBottom: 30 },
    bubble: { maxWidth: '85%', padding: 14, borderRadius: 22, marginBottom: 12 },
    myBubble: { alignSelf: 'flex-end', backgroundColor: '#73C7FF', borderBottomRightRadius: 4 },
    otherBubble: { alignSelf: 'flex-start', backgroundColor: 'white', borderBottomLeftRadius: 4, elevation: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
    msgText: { fontSize: 15, lineHeight: 20 },
    myText: { color: 'white' },
    otherText: { color: '#444' },
    inputArea: { flexDirection: 'row', padding: 12, paddingBottom: Platform.OS === 'ios' ? 30 : 12, backgroundColor: 'white', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#EEE' },
    actionBtn: { padding: 8 },
    input: { flex: 1, backgroundColor: '#F3F4F6', borderRadius: 24, paddingHorizontal: 18, paddingVertical: 10, fontSize: 15, maxHeight: 100, marginHorizontal: 8 },
    sendBtn: { backgroundColor: '#73C7FF', width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' }
});