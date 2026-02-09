// src/constants/mockData.js

export const MOCK_CHATS = [
    { 
        id: '1', 
        name: 'John Doe', 
        lastMsg: 'ขอบคุณมากครับที่ช่วยดูแลคุณแม่', 
        time: '10:30', 
        avatar: 'https://i.pravatar.cc/150?u=john',
        unread: 2 
    },
    { 
        id: '2', 
        name: 'Sarah Wilson', 
        lastMsg: 'รบกวนฝากดูเรื่องยามื้อเย็นด้วยนะคะ', 
        time: 'Yesterday', 
        avatar: 'https://i.pravatar.cc/150?u=sarah',
        unread: 0
    },
];

export const MOCK_MESSAGES = [
    { id: '1', text: 'สวัสดีครับ วันนี้คุณแม่ทานข้าวได้เยอะไหมครับ?', sender: 'other', time: '10:00' },
    { id: '2', text: 'วันนี้ท่านทานได้ปกติเลยค่ะ เดินเล่นในสวนได้นานกว่าเดิมด้วย', sender: 'me', time: '10:05' },
    { id: '3', text: 'ฝากดูเรื่องยาหลังอาหารด้วยนะคร้าบ', sender: 'other', time: '10:10' },
];

export const MOCK_NURSE_PROFILE = {
    name: 'Sarah Johnson',
    role: 'Registered Nurse',
    id: 'RN-2024-0156',
    avatar: 'https://i.pravatar.cc/150?u=sarah_j',
    stats: {
        exp: '5.2',
        patients: '847',
        rating: '4.9'
    },
    contact: {
        phone: '+1 (555) 123-4567',
        email: 'sarah.johnson@eldercare.com',
        nextShift: 'Tomorrow, 7:00 AM'
    }
};

export const MOCK_CARE_REPORTS = [
    { id: '1', mood: 'Excellent', moodIcon: 'happy', note: 'วันนี้ยิ้มแย้มแจ่มใส ทานข้าวได้หมดจานครับ', time: '2h ago', by: 'Sarah Johnson, RN' },
    { id: '2', mood: 'Neutral', moodIcon: 'meh', note: 'นอนหลับพักผ่อนได้ปกติ มีบ่นปวดหัวเล็กน้อยตอนบ่าย', time: '6h ago', by: 'Maria Rodriguez, CNA' },
];

export const MOCK_EMERGENCIES = [
    {
        id: '1',
        type: 'ACTIVE',
        elderName: 'Margaret Thompson',
        room: '302-B, West Wing',
        status: 'SOS BUTTON PRESSED',
        time: '2 min ago',
        avatar: 'https://i.pravatar.cc/150?u=margaret',
        priority: 'high'
    },
    {
        id: '2',
        type: 'ACTIVE',
        elderName: 'Dorothy Chen',
        room: '215-A, East Wing',
        status: 'FALL DETECTED',
        time: '5 min ago',
        avatar: 'https://i.pravatar.cc/150?u=dorothy',
        priority: 'high'
    },
    {
        id: '3',
        type: 'RESPONDING',
        elderName: 'Robert Williams',
        room: '108-C, North Wing',
        status: 'ABNORMAL HEART RATE',
        time: '12 min ago',
        avatar: 'https://i.pravatar.cc/150?u=robert',
        responder: 'Nurse Sarah Johnson',
        eta: '2 minutes',
        priority: 'medium'
    }
];

export const MOCK_INGREDIENTS_DB = {
    'Rice': { kcal: 3.65, protein: 0.07, carbs: 0.80, fat: 0.01, category: 'Carbohydrate' },
    'Minced Pork': { kcal: 2.42, protein: 0.17, carbs: 0, fat: 0.19, category: 'Protein' },
    'Boiled Egg': { kcal: 1.55, protein: 0.13, carbs: 0.01, fat: 0.11, category: 'Protein' },
    'Salmon': { kcal: 2.08, protein: 0.20, carbs: 0, fat: 0.13, category: 'Protein' },
    'Broccoli': { kcal: 0.34, protein: 0.028, carbs: 0.07, fat: 0.004, category: 'Veggies' }
}