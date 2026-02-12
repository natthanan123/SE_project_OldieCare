// src/screens/nurse/Home/NurseTasksScreen.js
import React, { useState, useCallback } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNurseTasks } from '../../../hooks/nurse/useNurseTasks';
import { useNurseHome } from '../../../hooks/nurse/useNurseHome';

// ✅ นำเข้า getMedications เพิ่มเติม
import { getActivities, updateActivityStatus, getMedications } from '../../../services/apiClient'; 

import TaskItem from '../../../components/nurse/TaskItem';
import HeaderGreeting from '../../../components/nurse/HeaderGreeting';
import SOSAlertCard from '../../../components/nurse/SOSAlertCard';
import QuickActionButton from '../../../components/nurse/QuickActionButton';
import LoadingView from '../../../components/common/LoadingView';
import { useFocusEffect } from '@react-navigation/native';

export default function NurseTasksScreen({ route, navigation }) {
  const { elderId, elderName } = route.params; 
  const { loading: initialLoading } = useNurseTasks(elderId);
  const { sosAlert } = useNurseHome();

  const [activities, setActivities] = useState([]);
  const [meds, setMeds] = useState([]); // ✅ เพิ่ม State สำหรับเก็บข้อมูลยา
  const [dbLoading, setDbLoading] = useState(true);

  // ฟังก์ชันโหลดข้อมูลทั้ง Activities และ Medications
  const loadDataFromApi = async () => {
    try {
      setDbLoading(true);
      // ✅ ดึงข้อมูลพร้อมกันจากทั้ง 2 คอลเลกชัน
      const [activitiesData, medsData] = await Promise.all([
        getActivities(),
        getMedications()
      ]);
      
      // กรองเฉพาะของผู้สูงอายุคนนี้
      const elderTasks = activitiesData.filter(item => item.elderly === elderId);
      const elderMeds = medsData.filter(item => item.elderly === elderId);
      
      setActivities(elderTasks);
      setMeds(elderMeds);
    } catch (error) {
      console.error("Load Data Error:", error);
      Alert.alert("Error", "ไม่สามารถดึงข้อมูลจากเซิร์ฟเวอร์ได้");
    } finally {
      setDbLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadDataFromApi();
    }, [elderId])
  );

  const handleToggleTask = async (taskId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
      await updateActivityStatus(taskId, newStatus);
      setActivities(prev => 
        prev.map(task => 
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      Alert.alert("Error", "ไม่สามารถอัปเดตสถานะกิจกรรมได้");
    }
  };

  // ✅ ค้นหายาตัวถัดไปที่สถานะยังไม่ใช่ 'Taken' (อ้างอิงสถานะจาก MongoDB ของคุณ)
  const nextMedication = meds.find(m => m.status !== 'Taken');

  if (initialLoading || dbLoading) return <LoadingView />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <HeaderGreeting text={`Tasks for ${elderName}`} taskCount={activities.length} />
      </View>

      <View style={styles.content}>
        {sosAlert && (
          <SOSAlertCard
            elderName={sosAlert.elderName}
            room={sosAlert.room}
            onRespond={() => navigation.navigate('Emergency')}
          />
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Tasks</Text>
          <Text style={styles.taskCount}>{activities.length} Tasks</Text>
        </View>

        <View style={styles.card}>
          {activities.length > 0 ? (
            activities.map(task => (
              <TaskItem 
                key={task._id} 
                title={task.topic} 
                time={task.startTime || '--:--'} 
                completed={task.status === 'Completed'}
                onToggle={() => handleToggleTask(task._id, task.status)} 
              />
            ))
          ) : (
            <Text style={styles.emptyText}>ไม่มีรายการงานสำหรับคุณ {elderName}</Text>
          )}
          
          <TouchableOpacity
            style={styles.viewAllBtn}
            onPress={() => navigation.navigate('Schedules', { elderId, elderName })}
          >
            <Text style={styles.viewAllText}>View All Schedules</Text>
          </TouchableOpacity>
        </View>

        {/* ✅ Medication Reminder ที่ดึงข้อมูลจาก meds state */}
        <View style={styles.reminderCard}>
          <View style={styles.reminderHeader}>
            <Ionicons name="medkit" size={20} color="white" />
            <Text style={styles.reminderTitle}>Medication Reminder</Text>
          </View>
          <Text style={styles.reminderSub}>
            {nextMedication ? "Next dose scheduled" : "All medications taken"}
          </Text>
          <View style={styles.medRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.medName}>
                {nextMedication ? nextMedication.name : 'Completed'}
              </Text>
              <Text style={styles.medDetail}>
                {nextMedication 
                  ? `${nextMedication.quantity} ${nextMedication.unit}` 
                  : 'No pending doses for today'}
              </Text>
            </View>
            <Text style={styles.medTime}>{nextMedication?.time || '--:--'}</Text>
          </View>
          <TouchableOpacity
            style={styles.manageBtn}
            onPress={() => navigation.navigate('Meds', { elderId, elderName })}
          >
            <Text style={styles.manageBtnText}>Manage Medications</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 24 }}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <QuickActionButton
              label="Care Report"
              icon="document-text-outline"
              onPress={() => navigation.navigate('CareReport', { elderName, elderId })}
            />
            <QuickActionButton
              label="Emergency"
              icon="warning-outline"
              onPress={() => navigation.navigate('Emergency')}
            />
            <QuickActionButton
              label="Calculate"
              icon="calculator-outline"
              onPress={() => navigation.navigate('TDEECalculator', { elderlyId: elderId, elderName: elderName })}
            />
            <QuickActionButton
              label="Meals"
              icon="restaurant-outline"
              onPress={() => navigation.navigate('Meals')}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { backgroundColor: '#2FA4E7', paddingBottom: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  backButton: { marginTop: 44, marginLeft: 16, marginBottom: 8 },
  content: { padding: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  taskCount: { color: '#2FA4E7', fontWeight: '600' },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 16, elevation: 3 },
  viewAllBtn: { backgroundColor: '#E3F2FD', padding: 12, borderRadius: 12, alignItems: 'center', marginTop: 12 },
  viewAllText: { color: '#2FA4E7', fontWeight: 'bold' },
  emptyText: { textAlign: 'center', color: '#999', padding: 20 },
  reminderCard: { backgroundColor: '#9C27B0', borderRadius: 20, padding: 20, marginTop: 20 },
  reminderHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  reminderTitle: { color: 'white', fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
  reminderSub: { color: '#E1BEE7', fontSize: 12, marginBottom: 16 },
  medRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  medName: { color: 'white', fontWeight: 'bold', fontSize: 17 },
  medTime: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  medDetail: { color: '#E1BEE7', fontSize: 14, marginTop: 4 },
  manageBtn: { backgroundColor: 'white', padding: 12, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  manageBtnText: { color: '#9C27B0', fontWeight: 'bold' },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 8 },
});