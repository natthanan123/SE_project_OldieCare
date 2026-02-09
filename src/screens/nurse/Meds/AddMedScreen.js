import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import { addMed } from '../../../services/nurseService'; 

export default function AddMedScreen({ route, navigation }) {
    // 1. สร้าง State สำหรับเก็บข้อมูล
    const [patientName, setPatientName] = useState('');
    const [name, setName] = useState('');
    const [dosage, setDosage] = useState('1');
    const [unit, setUnit] = useState('Tablet');
    const [time, setTime] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    const commonUnits = ['Tablet', 'Capsule', 'Sachet', 'CC', 'Spoon'];

    // ฟังก์ชันสำหรับล้างค่าในช่องกรอกทั้งหมด
    const clearForm = () => {
        setPatientName('');
        setName('');
        setDosage('1');
        setUnit('Tablet');
        setTime(new Date());
    };

    // ล้างค่าเมื่อหน้าจอถูกเปิดใหม่ และจัดการ Cleanup Params อย่างปลอดภัย
    useFocusEffect(
        useCallback(() => {
            clearForm();
            
            return () => {
                // ตรวจสอบว่าหน้าจอยังอยู่ใน Focus ก่อนสั่งแก้ Params เพื่อป้องกัน SET_PARAMS Error
                if (navigation.isFocused()) {
                    try {
                        navigation.setParams({ 
                            elderName: undefined, 
                            elderId: undefined, 
                            med: undefined, 
                            isEdit: false 
                        });
                    } catch (e) {
                        // ข้ามการทำ setParams หาก Navigator ปิดหน้าไปแล้ว
                    }
                }
            };
        }, [navigation])
    );

    const handleSave = async () => {
        // ตรวจสอบความครบถ้วนก่อนบันทึก
        if (!patientName.trim() || !name.trim() || !dosage.trim()) {
            return Alert.alert("แจ้งเตือน", "กรุณากรอกข้อมูลให้ครบถ้วน\n(ชื่อผู้สูงอายุ, ชื่อยา และจำนวน)");
        }

        try {
            await addMed({
                elderId: 'manual_entry',
                elderName: patientName,
                name: name,
                dose: `${dosage} ${unit}`,
                time: time.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false }),
                status: 'Upcoming'
            });

            // ล้างค่าหลังจากบันทึกสำเร็จและย้อนกลับอย่างปลอดภัย
            Alert.alert(
                "สำเร็จ", 
                "บันทึกข้อมูลเรียบร้อยแล้ว",
                [
                    { 
                        text: "ตกลง", 
                        onPress: () => {
                            clearForm(); 
                            // ใช้ goBack() แทน navigate('Meds') เพื่อป้องกัน Error เรื่อง Navigator ระดับเดียวกัน
                            navigation.goBack(); 
                        } 
                    }
                ]
            );
            
        } catch (error) {
            Alert.alert("Error", "ไม่สามารถบันทึกข้อมูลได้");
        }
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header: ใช้ goBack() เพื่อย้อนกลับไปหน้าเดิมที่เปิดมา */}
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
                    style={styles.input} 
                    placeholder="Enter elder name"
                    value={patientName}
                    onChangeText={setPatientName}
                    // ป้องกัน Keyboard จำค่าเก่า (Auto-fill) ตามต้องการ
                    autoCorrect={false}
                    spellCheck={false}
                    autoComplete="off"
                />

                <Text style={styles.label}>Medication Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. Paracetamol"
                    value={name}
                    onChangeText={setName}
                    autoCorrect={false}
                    spellCheck={false}
                    autoComplete="off"
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

                {/* ปุ่มเลือกหน่วยแบบรวดเร็ว */}
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
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
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
    formCard: { backgroundColor: 'white', margin: 16, padding: 20, borderRadius: 24, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
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
    submitBtn: { backgroundColor: '#73C7FF', margin: 16, padding: 20, borderRadius: 20, alignItems: 'center', elevation: 2 },
    submitBtnText: { color: 'white', fontWeight: 'bold', fontSize: 18 }
});