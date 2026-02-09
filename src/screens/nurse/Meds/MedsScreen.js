import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import { getMeds, updateMedStatus, deleteMed } from '../../../services/nurseService';
import LoadingView from '../../../components/common/LoadingView';

export default function MedsScreen({ route, navigation }) {
    const elderId = route.params?.elderId || null;
    const elderName = route.params?.elderName || '';
    const [meds, setMeds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    const showBackButton = !!elderId;

    const loadData = async () => {
        setLoading(true);
        const data = await getMeds(elderId);
        setMeds(data);
        setLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
            return () => navigation.setParams({ elderId: undefined });
        }, [elderId])
    );

    // ฟังก์ชันกดยืนยันการทานยา
    const handleMarkAsTaken = async (medId) => {
        await updateMedStatus(medId, 'Taken');
        loadData(); // รีโหลดเพื่ออัปเดตเปอร์เซ็นต์ทันที
    };

    // ฟังก์ชันลบยา
    const handleDeleteMed = (medId) => {
        Alert.alert("ลบข้อมูลยา", "คุณต้องการลบรายการยานี้ใช่หรือไม่?", [
            { text: "ยกเลิก", style: "cancel" },
            {
                text: "ลบ",
                style: "destructive",
                onPress: async () => {
                    await deleteMed(medId);
                    loadData();
                }
            }
        ]);
    };

    // Swipe Actions (เหมือนหน้า Schedule)
    const renderRightActions = (item) => (
        <View style={styles.swipeActionsContainer}>
            <TouchableOpacity
                style={[styles.swipeActionBtn, { backgroundColor: '#FFC107' }]}
                onPress={() => navigation.navigate('AddMed', { med: item, isEdit: true })}
            >
                <Ionicons name="pencil" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.swipeActionBtn, { backgroundColor: '#FF5252' }]}
                onPress={() => handleDeleteMed(item.id)}
            >
                <Ionicons name="trash" size={20} color="white" />
            </TouchableOpacity>
        </View>
    );

    const totalMeds = meds.length;
    const takenMeds = meds.filter(m => m.status === 'Taken').length;
    const progressPercent = totalMeds > 0 ? Math.round((takenMeds / totalMeds) * 100) : 0;

    const getCurrentDate = () => {
        const now = new Date();
        const options = { month: 'short', day: 'numeric' };
        return `Today, ${now.toLocaleDateString('en-US', options)}`;
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Taken': return { color: '#4CAF50', bg: '#E8F5E9', border: '#4CAF50' };
            case 'Missed': return { color: '#F44336', bg: '#FFEBEE', border: '#F44336' };
            default: return { color: '#FFB300', bg: '#FFF8E1', border: '#FFB300' };
        }
    };

    if (loading) return <LoadingView />;

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.topRow}>
                        {showBackButton ? (
                            <TouchableOpacity onPress={() => navigation.navigate('NurseTasks', { elderId, elderName })}>
                                <Ionicons name="arrow-back" size={24} color="#333" />
                            </TouchableOpacity>
                        ) : <View style={{ width: 24 }} />}
                        <Text style={styles.headerTitle}>Medication Management</Text>
                        <View style={{ width: 24 }} />
                    </View>
                    <Text style={styles.headerDate}>{getCurrentDate()}</Text>

                    <View style={styles.progressCard}>
                        <View>
                            <Text style={styles.progressTitle}>Today's Progress</Text>
                            <Text style={styles.progressSub}>{takenMeds} of {totalMeds} taken</Text>
                        </View>
                        <View style={styles.progressCircle}>
                            <Text style={styles.progressPercent}>{progressPercent}%</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.filterRow}>
                    {['All', 'Upcoming', 'Taken', 'Missed'].map(f => (
                        <TouchableOpacity 
                            key={f} 
                            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
                            onPress={() => setFilter(f)}
                        >
                            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <FlatList
                    data={meds.filter(m => filter === 'All' || m.status === filter)}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => {
                        const style = getStatusStyle(item.status);
                        return (
                            <Swipeable renderRightActions={() => renderRightActions(item)}>
                                <View style={[styles.medCard, { borderColor: style.border + '40' }]}>
                                    <View style={styles.cardHeader}>
                                        <View>
                                            <Text style={styles.medName}>{item.name}</Text>
                                            <Text style={styles.medDose}>{item.dose}</Text>
                                        </View>
                                        <View style={[styles.statusBadge, { backgroundColor: style.bg }]}>
                                            <Text style={[styles.statusText, { color: style.color }]}>{item.status}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.timeRow}>
                                        <Ionicons name="time-outline" size={16} color="#666" />
                                        <Text style={styles.timeText}>{item.time}</Text>
                                        {!elderId && <Text style={styles.ownerText}> • {item.elderName}</Text>}
                                    </View>

                                    {item.status !== 'Taken' ? (
                                        <TouchableOpacity 
                                            style={[styles.confirmBtn, { backgroundColor: style.color }]}
                                            onPress={() => handleMarkAsTaken(item.id)}
                                        >
                                            <Ionicons name="checkmark-circle-outline" size={20} color="white" />
                                            <Text style={styles.confirmBtnText}>Confirm Intake</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <View style={styles.completedTag}>
                                            <Ionicons name="checkmark-done" size={18} color="#4CAF50" />
                                            <Text style={styles.completedText}>Dose Completed</Text>
                                        </View>
                                    )}
                                </View>
                            </Swipeable>
                        );
                    }}
                />

                <TouchableOpacity 
                    style={styles.fab}
                    onPress={() => navigation.navigate('AddMed', { 
                      elderId: route.params?.elderId,
                      elderName: route.params?.elderName 
                    })}
                >
                    <Ionicons name="add" size={32} color="white" />
                </TouchableOpacity>
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FDFDFD' },
    header: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20, backgroundColor: 'white' },
    topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    headerDate: { fontSize: 13, color: '#999', textAlign: 'center', marginVertical: 10 },
    progressCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F0F7FF', padding: 20, borderRadius: 24 },
    progressSub: { fontSize: 20, fontWeight: 'bold', color: '#2FA4E7' },
    progressCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#73C7FF', justifyContent: 'center', alignItems: 'center' },
    progressPercent: { color: 'white', fontWeight: 'bold' },
    filterRow: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 15 },
    filterBtn: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 12, backgroundColor: '#F0F0F0', marginRight: 10 },
    filterBtnActive: { backgroundColor: '#73C7FF' },
    filterText: { color: '#666', fontWeight: '600' },
    filterTextActive: { color: 'white' },
    list: { paddingHorizontal: 20, paddingBottom: 100 },
    medCard: { backgroundColor: 'white', borderRadius: 20, padding: 16, marginBottom: 16, borderWidth: 1, elevation: 2 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
    medName: { fontSize: 17, fontWeight: 'bold' },
    statusBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 10 },
    timeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
    timeText: { fontSize: 14, fontWeight: '600', marginLeft: 5 },
    ownerText: { color: '#73C7FF', fontWeight: 'bold' },
    confirmBtn: { flexDirection: 'row', padding: 12, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginTop: 15 },
    confirmBtnText: { color: 'white', fontWeight: 'bold', marginLeft: 8 },
    completedTag: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 15, backgroundColor: '#F8F8F8', padding: 10, borderRadius: 15 },
    completedText: { color: '#4CAF50', fontWeight: 'bold', marginLeft: 5 },
    fab: { position: 'absolute', bottom: 30, right: 20, backgroundColor: '#73C7FF', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 },
    swipeActionsContainer: { flexDirection: 'row', width: 120, marginBottom: 16, marginLeft: 10 },
    swipeActionBtn: { flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 20, marginLeft: 8 }
});