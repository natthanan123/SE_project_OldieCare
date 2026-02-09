import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { MOCK_INGREDIENTS_DB } from '../../../../constants/mockData';
import CalorieProgressBar from '../../../../components/nurse/CalorieProgressBar'; // นำเข้า Chart Bar
import { checkAndResetDailyStats } from '../../../../utils/nutritionUtils'; // นำเข้าตัว Reset เที่ยงคืน

export default function MealsScreen({ navigation }) {
    const [selectedMeal, setSelectedMeal] = useState('Breakfast');
    const [selectedCategory, setSelectedCategory] = useState('Carbohydrate');
    const [tempIngredient, setTempIngredient] = useState('Rice');
    const [addedItems, setAddedItems] = useState([]);
    
    // State สำหรับแคลอรีสะสมและเป้าหมาย (TDEE)
    const [totalConsumed, setTotalConsumed] = useState(0);
    const [dailyGoal, setDailyGoal] = useState(1200); 

    // ระบบตรวจสอบการรีเซ็ตค่าตอนเที่ยงคืน
    useFocusEffect(
        useCallback(() => {
            checkAndResetDailyStats(setTotalConsumed);
        }, [])
    );

    const nutritionCategories = [
        { label: 'Protein', icon: 'fitness', color: '#73C7FF', category: 'Protein' },
        { label: 'Carbs', icon: 'restaurant', color: '#FFA726', category: 'Carbohydrate' },
        { label: 'Fat', icon: 'water', color: '#FFD54F', category: 'Fat' },
        { label: 'Veggies', icon: 'leaf', color: '#66BB6A', category: 'Veggies' },
        { label: 'Fruits', icon: 'nutrition', color: '#EF5350', category: 'Fruits' },
    ];

    const filteredIngredients = Object.keys(MOCK_INGREDIENTS_DB).filter(
        key => MOCK_INGREDIENTS_DB[key].category === selectedCategory
    );

    // คำนวณสารอาหารจากรายการที่เพิ่มในหน้าจอ
    const calculateCurrentMeal = () => {
        return addedItems.reduce((acc, item) => {
            const base = MOCK_INGREDIENTS_DB[item.name];
            acc.kcal += base.kcal * item.grams;
            acc.p += base.protein * item.grams;
            acc.c += base.carbs * item.grams;
            acc.f += base.fat * item.grams;
            return acc;
        }, { kcal: 0, p: 0, c: 0, f: 0 });
    };

    const mealTotals = calculateCurrentMeal();

    const handleAddIngredient = () => {
        const newItem = { id: Date.now(), name: tempIngredient, grams: 100 };
        setAddedItems([...addedItems, newItem]);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Meal Planning</Text>
                <View style={styles.dateBadge}>
                    <Text style={styles.dateText}>Today</Text>
                    <Ionicons name="calendar-outline" size={16} color="#73C7FF" />
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* 1. Progress Bar: แสดงภาพรวมแคลอรีของวัน */}
                <View style={styles.topProgressCard}>
                    <CalorieProgressBar 
                        consumed={totalConsumed + mealTotals.kcal} 
                        target={dailyGoal} 
                        label="Daily Calorie Intake" 
                    />
                </View>

                {/* ส่วนเลือกมื้ออาหาร */}
                <View style={styles.mealTabs}>
                    {['Breakfast', 'Lunch', 'Dinner'].map(m => (
                        <TouchableOpacity 
                            key={m} 
                            style={[styles.mealTab, selectedMeal === m && styles.activeTab]} 
                            onPress={() => setSelectedMeal(m)}
                        >
                            <Text style={[styles.tabText, selectedMeal === m && styles.activeTabText]}>{m}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* เพิ่มวัตถุดิบ */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Add Ingredient</Text>
                    <View style={styles.iconRow}>
                        {nutritionCategories.map(cat => (
                            <TouchableOpacity key={cat.label} style={styles.iconItem} onPress={() => setSelectedCategory(cat.category)}>
                                <View style={[styles.iconCircle, { backgroundColor: cat.color + '15' }, selectedCategory === cat.category && { borderColor: cat.color, borderWidth: 1 }]}>
                                    <Ionicons name={cat.icon} size={20} color={cat.color} />
                                </View>
                                <Text style={styles.iconLabel}>{cat.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={styles.chipsContainer}>
                        {filteredIngredients.map(name => (
                            <TouchableOpacity key={name} style={[styles.chip, tempIngredient === name && styles.activeChip]} onPress={() => setTempIngredient(name)}>
                                <Text style={[styles.chipText, tempIngredient === name && { color: 'white' }]}>{name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <TouchableOpacity style={styles.addBtn} onPress={handleAddIngredient}>
                        <Ionicons name="add" size={24} color="white" /><Text style={styles.addBtnText}>Add Ingredient</Text>
                    </TouchableOpacity>
                </View>

                {/* รายการอาหาร */}
                {addedItems.map(item => (
                    <View key={item.id} style={styles.itemCard}>
                        <View style={styles.itemHeader}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <TouchableOpacity onPress={() => setAddedItems(addedItems.filter(i => i.id !== item.id))}>
                                <Ionicons name="trash" size={20} color="#EF5350" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.counterRow}>
                            <View style={styles.counter}>
                                <TouchableOpacity onPress={() => setAddedItems(addedItems.map(i => i.id === item.id ? {...i, grams: Math.max(0, i.grams - 10)} : i))}><Ionicons name="remove" size={20} /></TouchableOpacity>
                                <Text style={styles.countValue}>{item.grams} g</Text>
                                <TouchableOpacity onPress={() => setAddedItems(addedItems.map(i => i.id === item.id ? {...i, grams: i.grams + 10} : i))}><Ionicons name="add" size={20} /></TouchableOpacity>
                            </View>
                            <Text style={styles.itemKcal}>{(MOCK_INGREDIENTS_DB[item.name].kcal * item.grams).toFixed(0)} kcal</Text>
                        </View>
                    </View>
                ))}

                {/* สรุปสารอาหาร */}
                <View style={styles.summaryCard}>
                    <Text style={styles.sectionTitle}>Meal Summary</Text>
                    <View style={styles.totalCalRow}>
                        <Text style={styles.totalCalLabel}>Meal Calories</Text>
                        <Text style={styles.totalCalValue}>{mealTotals.kcal.toFixed(0)} kcal</Text>
                    </View>
                    <View style={styles.nutriGrid}>
                        <View style={styles.nutriItem}><Text style={styles.nutriLabel}>Protein</Text><Text style={styles.nutriVal}>{mealTotals.p.toFixed(1)}g</Text></View>
                        <View style={styles.nutriItem}><Text style={styles.nutriLabel}>Carbs</Text><Text style={styles.nutriVal}>{mealTotals.c.toFixed(1)}g</Text></View>
                        <View style={styles.nutriItem}><Text style={styles.nutriLabel}>Fat</Text><Text style={styles.nutriVal}>{mealTotals.f.toFixed(1)}g</Text></View>
                    </View>
                </View>

                <TouchableOpacity style={styles.saveBtn} onPress={() => Alert.alert("Saved", "Meal plan recorded.")}>
                    <Text style={styles.saveBtnText}>Save Meal Plan</Text>
                </TouchableOpacity>
                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 15, backgroundColor: 'white' },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    dateBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F9FF', padding: 8, borderRadius: 10 },
    dateText: { color: '#73C7FF', fontWeight: 'bold', fontSize: 12, marginRight: 4 },
    scrollContent: { padding: 16 },
    topProgressCard: { backgroundColor: 'white', padding: 20, borderRadius: 20, marginBottom: 15, elevation: 2 },
    mealTabs: { flexDirection: 'row', backgroundColor: '#F0F0F0', borderRadius: 12, padding: 4, marginBottom: 20 },
    mealTab: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
    activeTab: { backgroundColor: '#73C7FF' },
    tabText: { color: '#888', fontWeight: 'bold' },
    activeTabText: { color: 'white' },
    sectionCard: { backgroundColor: 'white', borderRadius: 20, padding: 15, marginBottom: 15, elevation: 1 },
    sectionTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 15 },
    iconRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    iconItem: { alignItems: 'center' },
    iconCircle: { width: 45, height: 45, borderRadius: 22.5, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
    iconLabel: { fontSize: 10, color: '#666' },
    chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15 },
    chip: { backgroundColor: '#F5F5F5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginRight: 8, marginBottom: 8 },
    activeChip: { backgroundColor: '#73C7FF' },
    chipText: { fontSize: 12, color: '#666' },
    addBtn: { backgroundColor: '#73C7FF', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 14, borderRadius: 12 },
    addBtnText: { color: 'white', fontWeight: 'bold', marginLeft: 8 },
    itemCard: { backgroundColor: 'white', borderRadius: 18, padding: 15, marginBottom: 15, borderLeftWidth: 4, borderLeftColor: '#73C7FF', elevation: 1 },
    itemHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    itemName: { fontWeight: 'bold', fontSize: 16 },
    counterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    counter: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FA', borderRadius: 10 },
    countValue: { marginHorizontal: 10, fontWeight: 'bold' },
    itemKcal: { fontSize: 18, fontWeight: 'bold', color: '#73C7FF' },
    summaryCard: { backgroundColor: '#F0F9FF', borderRadius: 20, padding: 20, marginBottom: 15 },
    totalCalRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#D1E9FF', paddingTop: 10, marginBottom: 15 },
    totalCalLabel: { fontSize: 16, fontWeight: 'bold' },
    totalCalValue: { fontSize: 22, fontWeight: 'bold', color: '#006699' },
    nutriGrid: { flexDirection: 'row', justifyContent: 'space-around' },
    nutriItem: { alignItems: 'center' },
    nutriLabel: { fontSize: 11, color: '#666' },
    nutriVal: { fontWeight: 'bold' },
    saveBtn: { backgroundColor: '#006699', padding: 18, borderRadius: 14, alignItems: 'center' },
    saveBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});