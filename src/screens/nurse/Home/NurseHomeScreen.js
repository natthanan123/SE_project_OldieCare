import React, { useState, useCallback } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useNurseHome } from '../../../hooks/nurse/useNurseHome';
// ✅ นำเข้า API สำหรับดึงกิจกรรมและยา
import { getAssignedElderly, getActivities, getMedications } from '../../../services/apiClient'; 

import HeaderGreeting from '../../../components/nurse/HeaderGreeting';   
import SOSAlertCard from '../../../components/nurse/SOSAlertCard';
import ElderCard from '../../../components/nurse/ElderCard';
import QuickActionButton from '../../../components/nurse/QuickActionButton';
import LoadingView from '../../../components/common/LoadingView';
import ErrorView from '../../../components/common/ErrorView';
import { useFocusEffect } from '@react-navigation/native';

export default function NurseHomeScreen({ navigation }) {
  const { greeting, sosAlert, loading: hookLoading, error: hookError } = useNurseHome();

  // ID พยาบาลสำหรับการทดสอบ
  const NURSE_ID = "698df967cbae21794053e7cc"; 

  const [assignedElders, setAssignedElders] = useState([]);
  const [totalPendingTasks, setTotalPendingTasks] = useState(0); 
  const [dbLoading, setDbLoading] = useState(true);

  const fetchHomeData = async () => {
    try {
      setDbLoading(true);
      
      // ✅ 1. ดึงข้อมูลพื้นฐานทั้งหมดพร้อมกันเพื่อประสิทธิภาพ
      const [eldersData, allActivities, allMeds] = await Promise.all([
        getAssignedElderly(NURSE_ID),
        getActivities(),
        getMedications()
      ]);

      setAssignedElders(eldersData);

      // ✅ 2. คำนวณจำนวนงานรวมที่ "ยังทำไม่เสร็จ"
      const myElderIds = eldersData.map(e => e._id);
      
      // นับงานทั่วไปที่ไม่ใช่ 'Completed'
      const pendingActivitiesCount = allActivities.filter(task => 
        myElderIds.includes(task.elderly) && task.status !== 'Completed'
      ).length;

      // นับงานป้อนยาที่ไม่ใช่ 'Taken'
      const pendingMedsCount = allMeds.filter(med => 
        myElderIds.includes(med.elderly) && med.status !== 'Taken'
      ).length;

      // รวมจำนวนงานทั้งหมด
      setTotalPendingTasks(pendingActivitiesCount + pendingMedsCount);

    } catch (error) {
      console.error("Fetch Home Data Error:", error);
      setAssignedElders([]);
    } finally {
      setDbLoading(false);
    }
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
        {/* ✅ แสดงจำนวนงานรวมที่คำนวณได้จริงจาก MongoDB */}
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
              key={elder._id} 
              name={elder.name || 'Unknown'}
              age={elder.age || 'N/A'}
              conditions={elder.medicalConditions || []} 
              onPress={() => navigation.navigate('NurseTasks', {
                elderId: elder._id,
                elderName: elder.name
              })}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>ไม่มีรายชื่อผู้สูงอายุที่ได้รับมอบหมาย</Text>
            <Text style={styles.emptySubText}>ID: {NURSE_ID}</Text>
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