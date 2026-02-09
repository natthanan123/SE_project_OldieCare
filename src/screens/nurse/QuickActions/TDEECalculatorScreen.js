import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { calculateTDEE, saveDailyCalorieGoal } from '../../../utils/nutritionUtils';

export default function TDEECalculatorScreen({ navigation }) {
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [gender, setGender] = useState('Male');
    const [activity, setActivity] = useState('Sedentary');
    const [result, setResult] = useState(null);

    // รายการระดับกิจกรรมตามดีไซน์
    const activityLevels = [
        { id: 'Sedentary', label: 'นั่งทำงาน ไม่ค่อยออกกำลังกาย', desc: 'กิจกรรมน้อยมาก' },
        { id: 'Lightly Active', label: 'ออกกำลังกายเบาๆ 1-3 วัน/สัปดาห์', desc: 'กิจกรรมเบา' },
        { id: 'Moderately Active', label: 'ออกกำลังกายปานกลาง 3-5 วัน/สัปดาห์', desc: 'กิจกรรมปานกลาง' },
        { id: 'Very Active', label: 'ออกกำลังกายหนัก 6-7 วัน/สัปดาห์', desc: 'กิจกรรมมาก' },
    ];

    const handleCalculate = () => {
        if (!age || !weight || !height) {
            return Alert.alert("แจ้งเตือน", "กรุณากรอกข้อมูลพื้นฐานให้ครบถ้วน");
        }

        const tdee = calculateTDEE(gender, weight, height, age, activity);
        setResult(tdee);
    };

    const handleSaveGoal = async () => {
        if (result) {
            await saveDailyCalorieGoal(result);
            Alert.alert("สำเร็จ", `ตั้งค่าเป้าหมาย ${result} kcal เรียบร้อยแล้ว`, [
                { text: "ตกลง", onPress: () => navigation.goBack() }
            ]);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <View style={styles.headerTitleRow}>
                    <View style={styles.headerIconBg}>
                        <Ionicons name="calculator" size={20} color="white" />
                    </View>
                    <Text style={styles.headerTitle}>TDEE Calculator</Text>
                </View>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Banner: คำนวณแคลอรี่ */}
                <View style={styles.banner}>
                    <View style={styles.bannerIcon}>
                        <Ionicons name="heart" size={30} color="white" />
                    </View>
                    <View style={styles.bannerTextCol}>
                        <Text style={styles.bannerTitle}>คำนวณแคลอรี่</Text>
                        <Text style={styles.bannerSub}>สำหรับผู้สูงอายุ</Text>
                        <Text style={styles.bannerDesc}>คำนวณปริมาณแคลอรี่ที่ร่างกายต้องการต่อวัน (TDEE) เพื่อวางแผนการดูแลสุขภาพอย่างเหมาะสม</Text>
                    </View>
                </View>

                {/* ส่วนข้อมูลพื้นฐาน */}
                <View style={styles.sectionCard}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="person" size={18} color="#2FA4E7" />
                        <Text style={styles.sectionLabel}>ข้อมูลพื้นฐาน</Text>
                    </View>

                    <Text style={styles.inputLabel}>อายุ (ปี)</Text>
                    <TextInput style={styles.input} keyboardType="numeric" placeholder="เช่น 65" value={age} onChangeText={setAge} />

                    <Text style={styles.inputLabel}>เพศ</Text>
                    <View style={styles.genderRow}>
                        <TouchableOpacity 
                            style={[styles.genderBtn, gender === 'Male' && styles.activeGender]} 
                            onPress={() => setGender('Male')}
                        >
                            <Ionicons name="male" size={18} color={gender === 'Male' ? 'white' : '#666'} />
                            <Text style={[styles.genderText, gender === 'Male' && styles.activeGenderText]}>ชาย</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.genderBtn, gender === 'Female' && styles.activeGender]} 
                            onPress={() => setGender('Female')}
                        >
                            <Ionicons name="female" size={18} color={gender === 'Female' ? 'white' : '#666'} />
                            <Text style={[styles.genderText, gender === 'Female' && styles.activeGenderText]}>หญิง</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.row}>
                        <View style={{ flex: 1, marginRight: 10 }}>
                            <Text style={styles.inputLabel}>ส่วนสูง (ซม.)</Text>
                            <TextInput style={styles.input} keyboardType="numeric" placeholder="160" value={height} onChangeText={setHeight} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.inputLabel}>น้ำหนัก (กก.)</Text>
                            <TextInput style={styles.input} keyboardType="numeric" placeholder="60" value={weight} onChangeText={setWeight} />
                        </View>
                    </View>
                </View>

                {/* ระดับกิจกรรม */}
                <View style={styles.sectionCard}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="fitness" size={18} color="#2FA4E7" />
                        <Text style={styles.sectionLabel}>ระดับกิจกรรม</Text>
                    </View>

                    {activityLevels.map((item) => (
                        <TouchableOpacity 
                            key={item.id} 
                            style={[styles.activityItem, activity === item.id && styles.activeActivity]}
                            onPress={() => setActivity(item.id)}
                        >
                            <View style={[styles.radio, activity === item.id && styles.radioActive]}>
                                {activity === item.id && <View style={styles.radioInner} />}
                            </View>
                            <View style={styles.activityTextCol}>
                                <Text style={[styles.activityLabel, activity === item.id && styles.activeActivityText]}>{item.label}</Text>
                                <Text style={styles.activityDesc}>{item.desc}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* ผลลัพธ์และการบันทึก */}
                {result && (
                    <View style={styles.resultCard}>
                        <Text style={styles.resultTitle}>ผลการคำนวณ TDEE</Text>
                        <Text style={styles.resultValue}>{result} <Text style={styles.kcalUnit}>kcal/day</Text></Text>
                        <TouchableOpacity style={styles.saveBtn} onPress={handleSaveGoal}>
                            <Ionicons name="save-outline" size={20} color="white" />
                            <Text style={styles.saveBtnText}>บันทึกเป็นเป้าหมายรายวัน</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* ปุ่มคำนวณหลัก */}
                <TouchableOpacity style={styles.calcBtn} onPress={handleCalculate}>
                    <Ionicons name="calculator-outline" size={22} color="white" />
                    <Text style={styles.calcBtnText}>คำนวณแคลอรี่</Text>
                </TouchableOpacity>

                {/* ปุ่ม Quick Calculate ที่เพิ่มเข้ามาใหม่ */}
                <TouchableOpacity 
                    style={styles.quickBtn} 
                    onPress={() => navigation.navigate('QuickCalculate')}
                >
                    <Text style={styles.quickBtnText}>Quick Calculate</Text>
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F5F9' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 15, backgroundColor: 'white' },
    headerTitleRow: { flexDirection: 'row', alignItems: 'center' },
    headerIconBg: { backgroundColor: '#4C84FF', padding: 6, borderRadius: 8, marginRight: 10 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    scrollContent: { padding: 16 },
    
    banner: { backgroundColor: '#2FA4E7', borderRadius: 20, padding: 20, flexDirection: 'row', marginBottom: 20 },
    bannerIcon: { backgroundColor: 'rgba(255,255,255,0.2)', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    bannerTextCol: { flex: 1 },
    bannerTitle: { fontSize: 22, fontWeight: 'bold', color: 'white' },
    bannerSub: { fontSize: 14, color: 'white', marginBottom: 8 },
    bannerDesc: { fontSize: 11, color: 'rgba(255,255,255,0.8)', lineHeight: 16 },

    sectionCard: { backgroundColor: 'white', borderRadius: 20, padding: 20, marginBottom: 16, elevation: 2 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    sectionLabel: { fontSize: 16, fontWeight: 'bold', marginLeft: 10, color: '#333' },
    inputLabel: { fontSize: 13, color: '#666', marginBottom: 8 },
    input: { backgroundColor: '#F8F9FA', padding: 12, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#EEE' },
    row: { flexDirection: 'row' },
    
    genderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    genderBtn: { flex: 0.48, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#DDD' },
    activeGender: { backgroundColor: '#4C84FF', borderColor: '#4C84FF' },
    genderText: { marginLeft: 8, color: '#666', fontWeight: 'bold' },
    activeGenderText: { color: 'white' },

    activityItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 15, borderWidth: 1, borderColor: '#EEE', marginBottom: 10 },
    activeActivity: { borderColor: '#2FA4E7', backgroundColor: '#F0F9FF' },
    radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#DDD', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    radioActive: { borderColor: '#2FA4E7' },
    radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#2FA4E7' },
    activityTextCol: { flex: 1 },
    activityLabel: { fontSize: 14, fontWeight: '600', color: '#444' },
    activeActivityText: { color: '#2FA4E7' },
    activityDesc: { fontSize: 11, color: '#999', marginTop: 2 },

    resultCard: { backgroundColor: '#E1F5FE', borderRadius: 20, padding: 25, alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#B3E5FC' },
    resultTitle: { fontSize: 14, color: '#0288D1', fontWeight: 'bold', marginBottom: 10 },
    resultValue: { fontSize: 32, fontWeight: 'bold', color: '#01579B' },
    kcalUnit: { fontSize: 16, fontWeight: 'normal' },
    saveBtn: { flexDirection: 'row', backgroundColor: '#01579B', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 25, marginTop: 15, alignItems: 'center' },
    saveBtnText: { color: 'white', fontWeight: 'bold', marginLeft: 8 },

    calcBtn: { backgroundColor: '#4C84FF', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 18, borderRadius: 18, elevation: 4, marginBottom: 15 },
    calcBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16, marginLeft: 10 },
    
    // สไตล์สำหรับปุ่ม Quick Calculate
    quickBtn: { backgroundColor: '#2FA4E7', padding: 15, borderRadius: 15, alignItems: 'center', borderWidth: 1, borderColor: '#1A73E8' },
    quickBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});