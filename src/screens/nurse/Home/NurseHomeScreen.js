import React, { useState, useCallback } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useNurseHome } from '../../../hooks/nurse/useNurseHome';
import { getAssignedElderly, getActivities, getMedications } from '../../../services/apiClient'; 

import HeaderGreeting from '../../../components/nurse/HeaderGreeting';   
import SOSAlertCard from '../../../components/nurse/SOSAlertCard';
import ElderCard from '../../../components/nurse/ElderCard';
import QuickActionButton from '../../../components/nurse/QuickActionButton';
import LoadingView from '../../../components/common/LoadingView';
import ErrorView from '../../../components/common/ErrorView';
import { useFocusEffect } from '@react-navigation/native';
// ✅ นำเข้า AsyncStorage เพื่อดึง ID ที่เก็บไว้ตอน Login
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NurseHomeScreen({ navigation }) {
  const { greeting, sosAlert, loading: hookLoading, error: hookError } = useNurseHome();

  const [assignedElders, setAssignedElders] = useState([]);
  const [totalPendingTasks, setTotalPendingTasks] = useState(0); 
  const [dbLoading, setDbLoading] = useState(true);
  // ✅ เพิ่ม state เพื่อเก็บ Nurse ID จริงๆ ที่ดึงมาจากเครื่อง
  const [activeNurseId, setActiveNurseId] = useState('');

  const fetchHomeData = async () => {
    try {
      setDbLoading(true);
      
      // ✅ 1. ดึง Nurse ID จาก AsyncStorage (ที่บันทึกไว้ตอน Login สำเร็จ)
      const savedId = await AsyncStorage.getItem('nurseId');
      setActiveNurseId(savedId || 'Unknown');

      if (!savedId) {
        console.error("No Nurse ID found in storage");
        setDbLoading(false);
        return;
      }

      // ✅ 2. ดึงรายชื่อผู้สูงอายุโดยใช้ ID จริงจากระบบ Login
      const eldersData = await getAssignedElderly(savedId);
      setAssignedElders(eldersData);

      // ดึง ID ทั้งหมดของผู้สูงอายุที่เราดูแล
      const myElderIds = eldersData.map(e => e.id || e._id);
      
      // ✅ 3. ดึงงานกิจกรรมและงานป้อนยามาคำนวณจำนวนงานค้าง
      const allActivities = await getActivities();

      const pendingActivitiesCount = allActivities.filter(task => 
        myElderIds.includes(task.elderly) && task.status !== 'Completed'
      ).length;

      let pendingMedsCount = 0;
      for (const elderId of myElderIds) {
          const meds = await getMedications(elderId); 
          const unpaid = meds.filter(m => m.status !== 'Taken').length;
          pendingMedsCount += unpaid;
      }

      setTotalPendingTasks(pendingActivitiesCount + pendingMedsCount);

    } catch (error) {
      console.error("Fetch Home Data Error:", error);
      setAssignedElders([]);
    } finally {
      setDbLoading(false);
    }
  };

  const handleElderPress = (elder) => {
    const id = elder.id || elder._id;
    if (!id) return;
    navigation.navigate('NurseTasks', {
      elderId: id,
      elderName: elder.name
    });
  };

  useFocusEffect(
    useCallback(() => {
      fetchHomeData();
    }, [])
  );

  if (hookLoading || dbLoading) return <LoadingView />;
  if (hookError) return <ErrorView message={hookError} />;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.headerContainer}>
        <HeaderGreeting
          text={greeting || 'Good Morning!'}
          taskCount={totalPendingTasks}
        />
      </View>

      {sosAlert && (
        <View style={styles.sectionMargin}>
          <SOSAlertCard
            elderName={sosAlert.elderName || ''}
            room={sosAlert.room || ''}
            onRespond={() => navigation.navigate('Emergency')}
          />
        </View>
      )}

      <View style={styles.sectionMargin}>
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>My Patients</Text>
          <Text style={styles.taskText}>{assignedElders.length} Persons</Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        {assignedElders.length > 0 ? (
          assignedElders.map((elder) => (
            <ElderCard
              key={elder.id || elder._id} 
              name={elder.name || 'Unknown'}
              age={elder.age || 'N/A'}
              conditions={elder.conditions || []} 
              onPress={() => handleElderPress(elder)} 
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>ไม่มีรายชื่อผู้สูงอายุที่ได้รับมอบหมาย</Text>
            {/* ✅ แสดง ID จริงที่ใช้ดึงข้อมูล (ช่วยในการ Debug) */}
            <Text style={styles.emptySubText}>Nurse ID: {activeNurseId}</Text>
          </View>
        )}
      </View>

      <View style={styles.sectionMargin}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <QuickActionButton
            label="Care Report"
            icon="document-text-outline"
            onPress={() => navigation.navigate('CareReport')}
          />
          <QuickActionButton
            label="Emergency"
            icon="warning-outline"
            onPress={() => navigation.navigate('Emergency')}
          />
          <QuickActionButton
            label="Calculate"
            icon="calculator-outline"
            onPress={() => navigation.navigate('Calculate')}
          />
        </View>
      </View>
    </ScrollView>
  );
}

// ... styles เหมือนเดิม ...
const styles = StyleSheet.create({
  scrollContainer: { paddingBottom: 32, backgroundColor: '#F8F9FA' },
  headerContainer: {
    backgroundColor: '#2FA4E7',
    paddingVertical: 10,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  sectionMargin: { marginTop: 24, paddingHorizontal: 16 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontWeight: 'bold', fontSize: 18, color: '#333' },
  taskText: { color: '#2FA4E7', fontWeight: '600' },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 12 },
  emptyContainer: { 
    padding: 30, 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    borderRadius: 20, 
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#EEE',
    borderStyle: 'dashed'
  },
  emptyText: { color: '#999', fontSize: 15 },
  emptySubText: { color: '#CCC', fontSize: 12, marginTop: 5 }
});