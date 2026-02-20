//src/screens/nurse/Schedules/AddTaskScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { addTask } from '../../../services/nurseService';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createActivity } from '../../../services/apiClient';

export default function AddTaskScreen({ route, navigation }) {
    // รับค่า ID และ ชื่อ จากหน้าที่กดมา
    const { elderId, elderName } = route.params || {};

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [showPicker, setShowPicker] = useState(null);

    // ฟังก์ชันย้อนกลับไปยัง Tab Schedules
    const forceNavigateToSchedulesTab = () => {
        navigation.navigate('MainTabs', {
            screen: 'Schedules',
        });
    };

    const handleSave = async () => {
        if (!title.trim()) {
            return Alert.alert("แจ้งเตือน", "กรุณากรอกหัวข้องาน");
        }

        try {
            // ✅ ส่งข้อมูลให้ตรงเป๊ะตาม router.post('/api/activity') ของเพื่อน
            await createActivity({
                elderly: elderId,          // ส่ง ID ผู้สูงอายุ
                topic: title,              // ใช้ 'topic' ตาม Schema ของเพื่อน
                description: description,
                startTime: formatTimeThai(startTime),
                endTime: formatTimeThai(endTime),
                date: new Date(),          // อย่าลืมส่งวันที่ปัจจุบันไปด้วย
                status: 'Upcoming'         // สถานะเริ่มต้น
            });

            Alert.alert("สำเร็จ", "บันทึกงานเรียบร้อยแล้ว", [
                { text: "ตกลง", onPress: forceNavigateToSchedulesTab }
            ]);
        } catch (error) {
            console.error("Add Task Error:", error);
            Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถบันทึกงานลงฐานข้อมูลได้");
        }
    };

    const formatTimeThai = (date) => {
        return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>เพิ่มงานใหม่</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.formCard}>
                <Text style={styles.label}>ข้อมูลผู้สูงอายุ</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: '#F0F0F0', color: '#666' }]}
                    value={elderName} // แสดงชื่อที่รับมาจากหน้าก่อนหน้า
                    editable={false}  // ✅ ล็อกไม่ให้แก้ไขชื่อ
                />

                <Text style={styles.label}>รายละเอียดงาน</Text>
                <Text style={styles.subLabel}>หัวข้องาน</Text>
                <TextInput
                    style={styles.input}
                    placeholder="เช่น พาไปเดินเล่น"
                    value={title}
                    onChangeText={setTitle}
                />
                
                <Text style={styles.subLabel}>รายละเอียดเพิ่มเติม</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="ระบุรายละเอียดเพิ่มเติม..."
                    multiline
                    numberOfLines={4}
                    value={description}
                    onChangeText={setDescription}
                />
            </View>

            <View style={styles.formCard}>
                <Text style={styles.label}>เวลาดำเนินการ</Text>
                <View style={styles.timeRow}>
                    <TouchableOpacity style={styles.timeInput} onPress={() => setShowPicker('start')}>
                        <Text style={styles.timeText}>เริ่ม: {formatTimeThai(startTime)}</Text>
                        <Ionicons name="time-outline" size={20} color="#2FA4E7" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.timeInput} onPress={() => setShowPicker('end')}>
                        <Text style={styles.timeText}>ถึง: {formatTimeThai(endTime)}</Text>
                        <Ionicons name="time-outline" size={20} color="#2FA4E7" />
                    </TouchableOpacity>
                </View>

                {showPicker && (
                    <DateTimePicker
                        value={showPicker === 'start' ? startTime : endTime}
                        mode="time"
                        is24Hour={true}
                        display="spinner"
                        onChange={(event, date) => {
                            setShowPicker(null);
                            if (date) {
                                if (showPicker === 'start') setStartTime(date);
                                else setEndTime(date);
                            }
                        }}
                    />
                )}
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={handleSave}>
                <Text style={styles.submitBtnText}>บันทึกข้อมูลงาน</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FDFDFD' },
    header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20, backgroundColor: 'white' },
    backBtn: { padding: 4 },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    formCard: { backgroundColor: 'white', margin: 16, padding: 16, borderRadius: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
    label: { fontSize: 16, fontWeight: 'bold', marginBottom: 12, color: '#333' },
    subLabel: { fontSize: 14, color: '#666', marginBottom: 8 },
    input: { backgroundColor: '#F9F9F9', borderWidth: 1, borderColor: '#EEE', borderRadius: 12, padding: 12, marginBottom: 16, color: '#333' },
    textArea: { height: 100, textAlignVertical: 'top' },
    timeRow: { flexDirection: 'row', justifyContent: 'space-between' },
    timeInput: { flex: 0.48, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#EEE', borderRadius: 12, padding: 12, backgroundColor: '#F9F9F9' },
    timeText: { color: '#333', fontWeight: '500', fontSize: 13 },
    submitBtn: { backgroundColor: '#2FA4E7', margin: 16, padding: 16, borderRadius: 16, alignItems: 'center', marginBottom: 40 },
    submitBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});