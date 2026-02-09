// src/hooks/nurse/useNurseChat.js
import { useState, useEffect } from 'react';
import * as chatService from '../../services/chatService';

export const useNurseChat = (chatId = null) => {
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadChatList = async () => {
        setLoading(true);
        try {
            const data = await chatService.getChatList();
            setChats(data);
        } catch (error) { console.error(error); }
        setLoading(false);
    };

    // เพิ่มฟังก์ชันอื่นๆ เช่น loadMessages, sendNewMessage...
    return { chats, messages, loading, loadChatList };
};