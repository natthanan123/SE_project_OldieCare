import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { addTask } from '../../../services/nurseService';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';

export default function AddTaskScreen({ route, navigation }) {
    // 1. ตั้งค่า State ให้เป็นค่าว่างเริ่มต้นทุกครั้งเพื่อแก้ Auto-fill
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [showPicker, setShowPicker] = useState(null); 
    const [patientName, setPatientName] = useState('');

    // 2. ใช้ useFocusEffect เพื่อล้างค่าทิ้งทันทีที่หน้าจอถูกเปิด (Double Check)
    useFocusEffect(
        useCallback(() => {
            setTitle('');
            setDescription('');
            setPatientName('');
            setStartTime(new Date());
            setEndTime(new Date());
        }, [])
    );

    // 3. ฟังก์ชันย้อนกลับ: บังคับไปที่ Tab 'Schedules' เท่านั้น
    const forceNavigateToSchedulesTab = () => {
        // ใช้ navigate ไปที่ Navigator ตัวแม่ (MainTabs) แล้วเจาะจง Screen ลูก (Schedules)
        // วิธีนี้จะทำให้ Tab Bar ด้านล่างเปลี่ยนเป็นสีฟ้าที่เมนู Schedules ทันที
        navigation.navigate('MainTabs', {
            screen: 'Schedules',
        });
    };

    const handleSave = async () => {
        if (!title.trim() || !patientName.trim()) {
            return Alert.alert("แจ้งเตือน", "กรุณากรอกข้อมูลให้ครบถ้วน");
        }

        try {
            await addTask({
                elderName: patientName,
                title: title,
                description: description,
                time: formatTimeThai(startTime),
                endTime: formatTimeThai(endTime),
                type: 'general',
                completed: false
            });

            Alert.alert("สำเร็จ", "บันทึกงานเรียบร้อยแล้ว", [
                { text: "ตกลง", onPress: forceNavigateToSchedulesTab }
            ]);
        } catch (error) {
            Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถบันทึกงานได้");
        }
    };

    const formatTimeThai = (date) => {
        return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
                {/* ปุ่มย้อนกลับต้องเรียกใช้ฟังก์ชันบังคับไปที่ Tab Schedules */}
                <TouchableOpacity onPress={forceNavigateToSchedulesTab} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>กรอกข้อมูลงาน</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.formCard}>
                <Text style={styles.label}>ข้อมูลผู้สูงอายุ</Text>
                <TextInput
                    style={styles.input}
                    placeholder="ระบุชื่อผู้สูงอายุ"
                    value={patientName}
                    onChangeText={setPatientName}
                    // ปิด Auto-fill แบบเด็ดขาดด้วย props เหล่านี้
                    autoCorrect={false}
                    spellCheck={false}
                    autoComplete="off"
                    textContentType="none"
                    importantForAutofill="no"
                />

                <Text style={styles.label}>รายละเอียดงาน</Text>
                <Text style={styles.subLabel}>หัวข้องาน</Text>
                <TextInput
                    style={styles.input}
                    placeholder="เช่น พาไปเดินเล่น"
                    value={title}
                    onChangeText={setTitle}
                    autoCorrect={false}
                    autoComplete="off"
                />
                
                <Text style={styles.subLabel}>รายละเอียดเพิ่มเติม</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="ระบุรายละเอียดเพิ่มเติม..."
                    multiline
                    numberOfLines={4}
                    value={description}
                    onChangeText={setDescription}
                    autoCorrect={false}
                />
            </View>

            <View style={styles.formCard}>
                <Text style={styles.label}>เวลา (รูปแบบ 24 ชม.)</Text>
                <View style={styles.timeRow}>
                    <TouchableOpacity style={styles.timeInput} onPress={() => setShowPicker('start')}>
                        <Text style={styles.timeText}>{formatTimeThai(startTime)}</Text>
                        <Ionicons name="time-outline" size={20} color="#333" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.timeInput} onPress={() => setShowPicker('end')}>
                        <Text style={styles.timeText}>{formatTimeThai(endTime)}</Text>
                        <Ionicons name="time-outline" size={20} color="#333" />
                    </TouchableOpacity>
                </View>

                {showPicker && (
                    <DateTimePicker
                        value={showPicker === 'start' ? startTime : endTime}
                        mode="time"
                        is24Hour={true}
                        display={Platform.OS === 'android' ? 'spinner' : 'default'}
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
                <Text style={styles.submitBtnText}>ดำเนินการต่อ</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9F9F9' },
    header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20, backgroundColor: 'white' },
    backBtn: { padding: 4 },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    formCard: { backgroundColor: 'white', margin: 16, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#EEE' },
    label: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
    subLabel: { fontSize: 14, color: '#666', marginBottom: 8 },
    input: { backgroundColor: '#FDFDFD', borderWidth: 1, borderColor: '#DDD', borderRadius: 12, padding: 12, marginBottom: 16, color: '#333' },
    textArea: { height: 100, textAlignVertical: 'top' },
    timeRow: { flexDirection: 'row', justifyContent: 'space-between' },
    timeInput: { flex: 0.48, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#DDD', borderRadius: 12, padding: 12 },
    timeText: { color: '#333', fontWeight: '500' },
    submitBtn: { backgroundColor: '#7B61FF', margin: 16, padding: 16, borderRadius: 16, alignItems: 'center', marginBottom: 40 },
    submitBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});