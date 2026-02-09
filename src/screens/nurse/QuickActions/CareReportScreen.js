import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// ดึงข้อมูลรายงานย้อนหลังมาแสดง
import { MOCK_CARE_REPORTS } from '../../../constants/mockData';

export default function CareReportScreen({ route, navigation }) {
    // รับข้อมูลผู้สูงอายุ (ถ้ามี) หรือใช้ค่า Default
    const { elderName = 'Margaret Thompson', room = '204' } = route.params || {};
    const [selectedMood, setSelectedMood] = useState('Neutral');
    const [note, setNote] = useState('');

    // รายการอารมณ์ที่แก้ไขชื่อไอคอนให้ถูกต้องแล้ว (กำจัด Warning: meh-outline)
    const moods = [
        { label: 'Excellent', icon: 'happy-outline' },
        { label: 'Good', icon: 'happy' },
        { label: 'Neutral', icon: 'happy-outline' }, // ใช้ happy-outline แทน meh-outline ที่ไม่มีในระบบ
        { label: 'Sad', icon: 'sad-outline' },
        { label: 'Distressed', icon: 'sad' },
    ];

    const handleSubmit = () => {
        if (!note.trim()) {
            return Alert.alert("แจ้งเตือน", "กรุณากรอกบันทึกการดูแลก่อนส่งรายงาน");
        }
        
        Alert.alert(
            "สำเร็จ", 
            "ส่งรายงานการดูแลให้ญาติเรียบร้อยแล้ว", 
            [{ text: "ตกลง", onPress: () => navigation.goBack() }]
        );
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* ส่วนหัวสีฟ้า (Header) */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Care Report</Text>
                <TouchableOpacity>
                    <Ionicons name="notifications-outline" size={24} color="#FFF" />
                </TouchableOpacity>
            </View>

            {/* การ์ดข้อมูลผู้สูงอายุ */}
            <View style={styles.patientCard}>
                <Image 
                    source={{ uri: 'https://i.pravatar.cc/150?u=margaret' }} 
                    style={styles.patientAvatar} 
                />
                <View style={styles.patientInfo}>
                    <Text style={styles.patientName}>{elderName}</Text>
                    <Text style={styles.patientMeta}>Room {room} • Age 78</Text>
                    <Text style={styles.lastReport}>Last report: 2 hours ago</Text>
                </View>
            </View>

            <View style={styles.content}>
                {/* ส่วนเลือกอารมณ์ (Current Mood) */}
                <Text style={styles.sectionLabel}>Current Mood</Text>
                <View style={styles.moodRow}>
                    {moods.map((m) => (
                        <TouchableOpacity 
                            key={m.label} 
                            style={[
                                styles.moodItem, 
                                selectedMood === m.label && styles.activeMoodItem
                            ]}
                            onPress={() => setSelectedMood(m.label)}
                        >
                            <Ionicons 
                                name={m.icon} 
                                size={26} 
                                color={selectedMood === m.label ? '#73C7FF' : '#999'} 
                            />
                            <Text style={[
                                styles.moodText, 
                                selectedMood === m.label && styles.activeMoodText
                            ]}>
                                {m.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* ส่วนกรอกบันทึก (Care Notes) */}
                <Text style={styles.sectionLabel}>Care Notes</Text>
                <TextInput
                    style={styles.textArea}
                    placeholder="Enter observations, activities, medications administered, or any concerns..."
                    multiline
                    numberOfLines={6}
                    value={note}
                    onChangeText={setNote}
                    textAlignVertical="top"
                    // ป้องกัน Auto-fill และการจำค่าเก่า
                    autoCorrect={false}
                    spellCheck={false}
                    autoComplete="off"
                />

                {/* ส่วนเพิ่มรูปภาพ */}
                <Text style={styles.sectionLabel}>Add Photos (Optional)</Text>
                <TouchableOpacity style={styles.photoUpload}>
                    <Ionicons name="camera-outline" size={32} color="#CCC" />
                    <Text style={styles.photoUploadText}>Tap to add photo</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                    <Text style={styles.submitBtnText}>Submit Care Report</Text>
                </TouchableOpacity>

                {/* ส่วนแสดงประวัติรายงานล่าสุด */}
                <Text style={styles.sectionLabel}>Recent Reports</Text>
                {MOCK_CARE_REPORTS.map((report) => (
                    <View key={report.id} style={styles.historyCard}>
                        <View style={styles.historyHeader}>
                            <View style={styles.moodBadge}>
                                <Ionicons name="happy-outline" size={16} color="#73C7FF" />
                                <Text style={styles.moodBadgeText}>{report.mood} mood</Text>
                            </View>
                            <Text style={styles.historyTime}>{report.time}</Text>
                        </View>
                        <Text style={styles.historyNote}>{report.note}</Text>
                        <Text style={styles.historyBy}>By: {report.by}</Text>
                    </View>
                ))}
            </View>
            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    header: { 
        backgroundColor: '#73C7FF', 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingHorizontal: 20, 
        paddingTop: Platform.OS === 'ios' ? 60 : 40, 
        paddingBottom: 20 
    },
    backBtn: { padding: 4 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: 'white' },
    patientCard: { 
        backgroundColor: '#73C7FF', 
        flexDirection: 'row', 
        paddingHorizontal: 20, 
        paddingBottom: 40, 
        borderBottomLeftRadius: 30, 
        borderBottomRightRadius: 30 
    },
    patientAvatar: { width: 70, height: 70, borderRadius: 35, borderWidth: 3, borderColor: 'rgba(255,255,255,0.3)' },
    patientInfo: { marginLeft: 15, justifyContent: 'center' },
    patientName: { fontSize: 20, fontWeight: 'bold', color: 'white' },
    patientMeta: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
    lastReport: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 4 },
    content: { padding: 20, marginTop: -20 },
    sectionLabel: { fontSize: 16, fontWeight: 'bold', color: '#333', marginTop: 24, marginBottom: 12 },
    moodRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        backgroundColor: 'white', 
        padding: 10, 
        borderRadius: 20, 
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10
    },
    moodItem: { alignItems: 'center', flex: 1, paddingVertical: 10, borderRadius: 15, borderWidth: 1, borderColor: 'transparent' },
    activeMoodItem: { backgroundColor: '#F0F9FF', borderColor: '#73C7FF' },
    moodText: { fontSize: 10, color: '#999', marginTop: 5 },
    activeMoodText: { color: '#73C7FF', fontWeight: 'bold' },
    textArea: { 
        backgroundColor: 'white', 
        borderRadius: 20, 
        padding: 15, 
        height: 140, 
        elevation: 2, 
        fontSize: 15, 
        color: '#333',
        borderWidth: 1,
        borderColor: '#F0F0F0'
    },
    photoUpload: { 
        backgroundColor: 'white', 
        borderRadius: 20, 
        height: 100, 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderStyle: 'dashed', 
        borderWidth: 2, 
        borderColor: '#DDD' 
    },
    photoUploadText: { color: '#AAA', fontSize: 12, marginTop: 5 },
    submitBtn: { 
        backgroundColor: '#73C7FF', 
        padding: 18, 
        borderRadius: 20, 
        alignItems: 'center', 
        marginTop: 30, 
        elevation: 4,
        shadowColor: '#73C7FF',
        shadowOpacity: 0.3,
        shadowRadius: 10
    },
    submitBtnText: { color: 'white', fontWeight: 'bold', fontSize: 17 },
    historyCard: { backgroundColor: 'white', borderRadius: 20, padding: 16, marginBottom: 15, elevation: 1 },
    historyHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    moodBadge: { flexDirection: 'row', alignItems: 'center' },
    moodBadgeText: { fontSize: 12, fontWeight: 'bold', color: '#333', marginLeft: 6 },
    historyTime: { fontSize: 11, color: '#AAA' },
    historyNote: { fontSize: 14, color: '#555', lineHeight: 20 },
    historyBy: { fontSize: 11, color: '#CCC', marginTop: 10 }
});