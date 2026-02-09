// src/services/chatService.js
import apiClient from './apiClient';

export const getChatList = async () => {
    const response = await apiClient.get('/chats'); // เรียกรายการแชททั้งหมด
    return response.data;
};

export const getMessages = async (chatId) => {
    const response = await apiClient.get(`/messages/${chatId}`); // เรียกข้อความในห้องแชทนั้น
    return response.data;
};

export const sendMessage = async (messageData) => {
    const response = await apiClient.post('/messages', messageData); // ส่งข้อความใหม่
    return response.data;
};