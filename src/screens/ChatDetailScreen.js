import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { COLORS } from '../theme';
import { Send } from 'lucide-react-native';
import { getMessages, sendMessage } from '../api/client';

export default function ChatDetailScreen({ route }) {
  const { name, threadId } = route.params;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getMessages(threadId);
        if (mounted) setMessages(data);
      } catch (e) {
        if (mounted) setError(e.message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [threadId]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    const optimistic = { id: String(Date.now()), text, sender: 'me' };
    setMessages((prev) => [...prev, optimistic]);
    try {
      const saved = await sendMessage(threadId, text);
      // replace optimistic id if backend returned a canonical id
      setMessages((prev) => prev.map((m) => (m.id === optimistic.id ? saved : m)));
    } catch (e) {
      // revert optimistic on failure
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      setError(e.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
      style={styles.container}
    >
      {loading && <Text style={{ padding: 16 }}>Loading…</Text>}
      {error && !loading && <Text style={{ padding: 16, color: 'red' }}>{error}</Text>}

      {!loading && (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20 }}
          renderItem={({ item }) => (
            <View style={[styles.msgBox, item.sender === 'me' ? styles.myMsg : styles.otherMsg]}>
              <Text style={{ color: item.sender === 'me' ? '#FFF' : '#333' }}>{item.text}</Text>
            </View>
          )}
        />
      )}

      <View style={styles.inputBar}>
        <TextInput
          style={styles.textInput}
          placeholder="พิมพ์ข้อความ..."
          value={input}
          onChangeText={setInput}
          editable={!loading}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend} disabled={loading}>
          <Send size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FE' },
  msgBox: { padding: 12, borderRadius: 15, marginBottom: 10, maxWidth: '80%' },
  myMsg: { alignSelf: 'flex-end', backgroundColor: COLORS.primary, borderBottomRightRadius: 2 },
  otherMsg: { alignSelf: 'flex-start', backgroundColor: '#FFF', borderBottomLeftRadius: 2, elevation: 1 },
  inputBar: { flexDirection: 'row', padding: 15, backgroundColor: '#FFF', alignItems: 'center' },
  textInput: { flex: 1, backgroundColor: '#F0F2F5', borderRadius: 20, paddingHorizontal: 15, height: 40, marginRight: 10 },
  sendBtn: { backgroundColor: COLORS.primary, width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }
});
