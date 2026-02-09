import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// ดึงข้อมูลวัตถุดิบมาจากไฟล์รวม Mock
import { MOCK_INGREDIENTS_DB } from '../../../constants/mockData';

export default function QuickCalculateScreen({ navigation }) {
    const [grams, setGrams] = useState('');
    const [selectedItem, setSelectedItem] = useState('Rice');
    const [totalKcal, setTotalKcal] = useState(0);

    // รายการหมวดหมู่ไอคอนสำหรับแสดงผล
    const categories = [
        { icon: 'fitness', color: '#73C7FF' },
        { icon: 'restaurant', color: '#FFA726' },
        { icon: 'water', color: '#FFD54F' },
        { icon: 'leaf', color: '#66BB6A' },
        { icon: 'nutrition', color: '#EF5350' },
    ];

    // ฟังก์ชันการคำนวณและสะสมค่าแคลอรี
    const handleAddIngredient = () => {
        if (!grams || isNaN(grams) || parseFloat(grams) <= 0) {
            return Alert.alert("ข้อมูลไม่ถูกต้อง", "กรุณากรอกจำนวนกรัมเป็นตัวเลข");
        }

        // ดึงค่า Base Kcal ต่อ 1 กรัมจาก Mock
        const baseKcal = MOCK_INGREDIENTS_DB[selectedItem]?.kcal || 0;
        const calculatedKcal = baseKcal * parseFloat(grams);
        
        // อัปเดตยอดรวมสะสม
        setTotalKcal(prev => prev + calculatedKcal);
        
        // ล้างช่องกรอกเพื่อให้พร้อมสำหรับรายการถัดไป
        setGrams('');
    };

    return (
        <View style={styles.container}>
            {/* Blue Header Section ตามดีไซน์ Figma */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Quick Cal Calculator</Text>
                    <Text style={styles.headerSub}>Enter ingredients to calculate calories</Text>
                </View>
            </View>

            {/* ส่วน Input การ์ดหลัก */}
            <View style={styles.content}>
                <View style={styles.card}>
                    <View style={styles.cardTop}>
                        <Text style={styles.label}>Ingredient</Text>
                        <TouchableOpacity onPress={() => { setTotalKcal(0); setGrams(''); }}>
                            <Ionicons name="close-circle" size={24} color="#FF5252" />
                        </TouchableOpacity>
                    </View>

                    {/* ไอคอนหมวดหมู่สารอาหาร */}
                    <View style={styles.iconRow}>
                        {categories.map((cat, index) => (
                            <View key={index} style={[styles.iconCircle, { backgroundColor: cat.color + '15' }]}>
                                <Ionicons name={cat.icon} size={20} color={cat.color} />
                            </View>
                        ))}
                    </View>

                    {/* Dropdown เลือกวัตถุดิบ (Mock ว่าเลือก Rice อยู่) */}
                    <TouchableOpacity style={styles.dropdown}>
                        <Text style={styles.dropdownText}>{selectedItem}</Text>
                        <Ionicons name="chevron-down" size={20} color="#CCC" />
                    </TouchableOpacity>

                    <Text style={styles.label}>Grams</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="0" 
                        keyboardType="numeric" 
                        value={grams}
                        onChangeText={setGrams}
                        placeholderTextColor="#CCC"
                    />

                    {/* ปุ่ม Add Ingredient เพื่อคำนวณค่าสะสม */}
                    <TouchableOpacity style={styles.addBtn} onPress={handleAddIngredient}>
                        <Ionicons name="add" size={24} color="white" />
                        <Text style={styles.addBtnText}>Add Ingredient</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Floating Result Bar ด้านล่าง */}
            <View style={styles.resultBar}>
                <View style={styles.resultTextCol}>
                    <Text style={styles.resultLabel}>Total Calories</Text>
                    <Text style={styles.resultValue}>{Math.round(totalKcal)} kcal</Text>
                </View>
                <View style={styles.fireIconBg}>
                    <Ionicons name="flame" size={32} color="white" />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    // Header Style
    header: { 
        backgroundColor: '#2FA4E7', 
        paddingHorizontal: 20, 
        paddingTop: Platform.OS === 'ios' ? 60 : 40, 
        height: 200, 
        borderBottomLeftRadius: 0, 
        borderBottomRightRadius: 0 
    },
    backBtn: { marginBottom: 20 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: 'white' },
    headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 5 },
    
    // Content Card
    content: { paddingHorizontal: 20 },
    card: { 
        backgroundColor: 'white', 
        borderRadius: 25, 
        padding: 20, 
        marginTop: -50, 
        elevation: 8, 
        shadowColor: '#000', 
        shadowOpacity: 0.1, 
        shadowRadius: 10 
    },
    cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    label: { fontSize: 15, fontWeight: '600', color: '#333', marginBottom: 10 },
    
    iconRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
    iconCircle: { width: 46, height: 46, borderRadius: 23, justifyContent: 'center', alignItems: 'center' },
    
    dropdown: { 
        borderWidth: 1, 
        borderColor: '#EEE', 
        borderRadius: 12, 
        padding: 15, 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginBottom: 20 
    },
    dropdownText: { fontSize: 16, color: '#333' },
    
    input: { borderBottomWidth: 1, borderBottomColor: '#EEE', fontSize: 26, paddingVertical: 12, marginBottom: 30, fontWeight: 'bold', color: '#333' },
    
    addBtn: { 
        backgroundColor: '#73C7FF', 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 16, 
        borderRadius: 16, 
        elevation: 2 
    },
    addBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16, marginLeft: 10 },
    
    // Bottom Result Bar
    resultBar: { 
        position: 'absolute', 
        bottom: 40, 
        left: 20, 
        right: 20, 
        backgroundColor: '#2FA4E7', 
        borderRadius: 20, 
        padding: 20, 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        elevation: 10 
    },
    resultTextCol: { flex: 1 },
    resultLabel: { color: 'white', fontSize: 14, opacity: 0.9 },
    resultValue: { color: 'white', fontSize: 34, fontWeight: 'bold', marginTop: 4 },
    fireIconBg: { backgroundColor: 'rgba(255,255,255,0.25)', padding: 12, borderRadius: 18 }
});