import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
// ✅ นำเข้าฟังก์ชันที่เชื่อมต่อกับ Backend
import { addMedication } from '../../../services/nurseService'; 

export default function AddMedScreen({ route, navigation }) {
    // 1. รับค่า Params ที่ส่งมาจากหน้า NurseHomeScreen หรือ MedsScreen
    const { elderId, elderName } = route.params || {};

    // 2. สร้าง State
    const [patientName, setPatientName] = useState(elderName || ''); // ถ้ามีชื่อส่งมา ให้ใช้ชื่อนั้นเลย
    const [name, setName] = useState('');
    const [dosage, setDosage] = useState('1');
    const [unit, setUnit] = useState('Tablet');
    const [time, setTime] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    const commonUnits = ['Tablet', 'Capsule', 'Sachet', 'CC', 'Spoon'];

    // 3. ใช้ useEffect เพื่ออัปเดตชื่อผู้สูงอายุหาก Params เปลี่ยนแปลง
    useEffect(() => {
        if (elderName) {
            setPatientName(elderName);
        }
    }, [elderName]);

    const handleSave = async () => {
        // ตรวจสอบความครบถ้วน
        if (!name.trim() || !dosage.trim()) {
            return Alert.alert("แจ้งเตือน", "กรุณากรอกชื่อยาและจำนวนให้ครบถ้วน");
        }

        try {
            // ✅ ส่งข้อมูลให้ตรงกับ Schema ใน MongoDB
            await addMedication({
                elderly: elderId, // ส่ง ID เพื่อใช้เชื่อมโยงข้อมูล
                name: name,       // ชื่อยา เช่น "horse pill"
                quantity: Number(dosage), // จำนวนเป็นตัวเลข
                unit: unit,       // หน่วย เช่น "Capsule"
                time: time.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false }), // รูปแบบ 18:00
                status: 'Upcoming' // ค่าเริ่มต้น
            });

            Alert.alert(
                "สำเร็จ", 
                "บันทึกข้อมูลยาเรียบร้อยแล้ว",
                [{ text: "ตกลง", onPress: () => navigation.goBack() }]
            );
            
        } catch (error) {
            console.error("Add Med Error:", error);
            Alert.alert("Error", "ไม่สามารถบันทึกข้อมูลยาได้");
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add Medication</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.formCard}>
                <Text style={styles.label}>Elder Name</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: '#F0F0F0', color: '#666' }]} 
                    value={patientName}
                    editable={false} // ✅ ล็อกชื่อไว้ ไม่ให้แก้ไขหากส่งมาจากหน้าการ์ด
                />

                <Text style={styles.label}>Medication Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. Paracetamol"
                    value={name}
                    onChangeText={setName}
                />

                <Text style={styles.label}>Quantity</Text>
                <View style={styles.dosageRow}>
                    <TextInput
                        style={[styles.input, styles.dosageInput]}
                        placeholder="0"
                        value={dosage}
                        onChangeText={setDosage}
                        keyboardType="numeric"
                    />
                    <View style={styles.unitDisplay}>
                        <Text style={styles.unitDisplayText}>{unit}</Text>
                    </View>
                </View>

                <View style={styles.tagContainer}>
                    {commonUnits.map((u) => (
                        <TouchableOpacity 
                            key={u} 
                            style={[styles.tag, unit === u && styles.tagActive]}
                            onPress={() => setUnit(u)}
                        >
                            <Text style={[styles.tagText, unit === u && styles.tagTextActive]}>{u}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.label}>Schedule Time</Text>
                <TouchableOpacity style={styles.timeInput} onPress={() => setShowPicker(true)}>
                    <Text style={styles.timeText}>
                        {time.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false })} น.
                    </Text>
                    <Ionicons name="time-outline" size={22} color="#73C7FF" />
                </TouchableOpacity>

                {showPicker && (
                    <DateTimePicker
                        value={time}
                        mode="time"
                        is24Hour={true}
                        display="spinner"
                        onChange={(event, date) => {
                            setShowPicker(false);
                            if (date) setTime(date);
                        }}
                    />
                )}
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={handleSave}>
                <Text style={styles.submitBtnText}>Confirm & Save</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9F9F9' },
    header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20, backgroundColor: 'white' },
    backBtn: { padding: 4 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    formCard: { backgroundColor: 'white', margin: 16, padding: 20, borderRadius: 24, elevation: 4 },
    label: { fontSize: 14, fontWeight: 'bold', color: '#555', marginBottom: 8 },
    input: { backgroundColor: '#F5F5F5', borderRadius: 15, padding: 15, marginBottom: 18, fontSize: 16, borderWidth: 1, borderColor: '#EEE', color: '#333' },
    dosageRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    dosageInput: { flex: 1, marginBottom: 0, textAlign: 'center', fontWeight: 'bold', fontSize: 20 },
    unitDisplay: { backgroundColor: '#E3F2FD', padding: 15, borderRadius: 15, marginLeft: 10, minWidth: 90, alignItems: 'center' },
    unitDisplayText: { color: '#1976D2', fontWeight: 'bold' },
    tagContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
    tag: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, backgroundColor: '#F0F0F0', marginRight: 8, marginBottom: 8 },
    tagActive: { backgroundColor: '#73C7FF' },
    tagText: { fontSize: 13, color: '#666' },
    tagTextActive: { color: 'white', fontWeight: 'bold' },
    timeInput: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 15, padding: 15 },
    timeText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    submitBtn: { backgroundColor: '#73C7FF', margin: 16, padding: 20, borderRadius: 20, alignItems: 'center' },
    submitBtnText: { color: 'white', fontWeight: 'bold', fontSize: 18 }
});