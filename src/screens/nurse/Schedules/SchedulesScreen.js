// src/screens/nurse/Schedules/SchedulesScreen.js
import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useIsFocused } from '@react-navigation/native'; // ✅ เพิ่ม useIsFocused
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNurseTasks } from '../../../hooks/nurse/useNurseTasks';
import { deleteTask } from '../../../services/nurseService';
import LoadingView from '../../../components/common/LoadingView';

export default function SchedulesScreen({ route, navigation }) {
  const isFocused = useIsFocused(); // ✅ ตรวจสอบว่าหน้าจอกำลังแสดงอยู่หรือไม่

  // ✅ 1. ตรวจสอบ Params อย่างเข้มงวด: ถ้าไม่ได้โฟกัส หรือไม่มี Id ให้เป็น null เสมอ
  const elderId = isFocused ? (route.params?.elderId || null) : null;
  const elderNameFromParam = isFocused ? (route.params?.elderName || null) : null;

  const isIndividualMode = !!elderId;

  // ✅ 2. แสดง Title ให้ถูกต้องตามโหมด
  const displayTitle = useMemo(() => {
    if (!isFocused) return 'Schedule';
    return isIndividualMode ? `Schedule: ${elderNameFromParam}` : 'All Schedules';
  }, [isFocused, isIndividualMode, elderNameFromParam]);

  const { tasks, loading, loadTasks } = useNurseTasks(elderId);

  useFocusEffect(
    useCallback(() => {
      loadTasks();

      // ✅ 3. Cleanup: เมื่อออกจากหน้าจอ บังคับล้าง Params ทันที
      return () => {
        navigation.setParams({ elderId: undefined, elderName: undefined });
      };
    }, [loadTasks, navigation])
  );

  const getCurrentDate = () => {
    const now = new Date();
    const options = { month: 'short', day: 'numeric' };
    return `Today, ${now.toLocaleDateString('en-US', options)}`;
  };

  const getStatusColor = (item) => {
    if (item.completed) return '#E0E0E0';
    if (item.title?.toLowerCase().includes('vital')) return '#4CAF50';
    return '#2FA4E7';
  };

  const handleDelete = (taskId) => {
    Alert.alert("ลบงาน", "คุณต้องการลบงานนี้ใช่หรือไม่?", [
      { text: "ยกเลิก", style: "cancel" },
      {
        text: "ลบ",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteTask(taskId);
            loadTasks();
          } catch (error) {
            Alert.alert("Error", "ไม่สามารถลบงานได้ในขณะนี้");
          }
        }
      }
    ]);
  };

  const renderRightActions = (item) => (
    <View style={styles.swipeActionsContainer}>
      <TouchableOpacity
        style={[styles.swipeActionBtn, { backgroundColor: '#FFC107' }]}
        onPress={() => navigation.navigate('AddTask', {
          task: item,
          isEdit: true,
          elderId,
          elderName: isIndividualMode ? elderNameFromParam : ''
        })}
      >
        <Ionicons name="pencil" size={20} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.swipeActionBtn, { backgroundColor: '#FF5252' }]}
        onPress={() => handleDelete(item.id)}
      >
        <Ionicons name="trash" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );

  if (loading && !tasks.length) return <LoadingView />;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            {isIndividualMode ? (
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#333" />
              </TouchableOpacity>
            ) : <View style={{ width: 24 }} />}

            <Text style={styles.headerTitle}>{displayTitle}</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.dateSelector}>
            <Ionicons name="calendar-outline" size={16} color="#2FA4E7" />
            <Text style={styles.dateText}>{getCurrentDate()}</Text>
          </View>
        </View>

        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Swipeable renderRightActions={() => renderRightActions(item)}>
              <View style={[styles.taskCard, { borderColor: getStatusColor(item) + '40' }]}>
                <View style={[styles.statusLine, { backgroundColor: getStatusColor(item) }]} />

                <View style={styles.cardInfo}>
                  <View style={styles.timeRow}>
                    <Text style={styles.timeText}>
                      {item.time} {item.endTime ? `- ${item.endTime}` : ''}
                    </Text>
                    <Text style={[styles.statusLabel, { color: getStatusColor(item) }]}>
                      {item.completed ? 'Completed' : 'Upcoming'}
                    </Text>
                  </View>

                  <Text style={styles.taskTitle}>{item.title}</Text>

                  <View style={styles.elderInfo}>
                    <Ionicons name="person-outline" size={14} color="#999" />
                    {/* ✅ แสดงชื่อผู้สูงอายุที่ดึงมาจากข้อมูล Task แต่ละใบ */}
                    <Text style={styles.elderName}>
                      {item.elderName}
                    </Text>
                  </View>
                </View>
              </View>
            </Swipeable>
          )}
        />

        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('AddTask', {
            elderId: isIndividualMode ? elderId : null,
            elderName: isIndividualMode ? elderNameFromParam : ''
          })}
        >
          <Ionicons name="add" size={32} color="white" />
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
} const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDFDFD' },
  header: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 15, backgroundColor: 'white' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor: '#F5F9FF',
    paddingVertical: 8,
    borderRadius: 10,
    width: 140,
    alignSelf: 'center'
  },
  dateText: { marginLeft: 6, color: '#333', fontWeight: '600', fontSize: 13 },
  listContent: { padding: 20, paddingBottom: 100 },
  taskCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    height: 110,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  statusLine: { width: 4, height: '100%' },
  cardInfo: { flex: 1, padding: 15, justifyContent: 'center' },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  timeText: { fontSize: 12, color: '#999', fontWeight: '500' },
  statusLabel: { fontSize: 11, fontWeight: 'bold' },
  taskTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  elderInfo: { flexDirection: 'row', alignItems: 'center' },
  elderName: { fontSize: 12, color: '#999', marginLeft: 5 },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 40 },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#73C7FF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  swipeActionsContainer: { flexDirection: 'row', width: 120, marginBottom: 16, marginLeft: 10 },
  swipeActionBtn: { flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 16, marginLeft: 8 },
});