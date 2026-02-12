import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert } from 'react-native';
import { useNurseHome } from '../../../hooks/nurse/useNurseHome';
import { getAssignedElderly } from '../../../services/apiClient'; 

import HeaderGreeting from '../../../components/nurse/HeaderGreeting';   
import SOSAlertCard from '../../../components/nurse/SOSAlertCard';
import ElderCard from '../../../components/nurse/ElderCard';
import QuickActionButton from '../../../components/nurse/QuickActionButton';
import LoadingView from '../../../components/common/LoadingView';
import ErrorView from '../../../components/common/ErrorView';
import { useFocusEffect } from '@react-navigation/native';

export default function NurseHomeScreen({ navigation }) {
  const { greeting, sosAlert, loading: hookLoading, taskCount, error: hookError } = useNurseHome();

  // 1. ID พยาบาลคงเดิมเพื่อการทดสอบ
  const NURSE_ID = "6989acf7f8bd7b80f2ac0a56"; 

  const [assignedElders, setAssignedElders] = useState([]);
  const [dbLoading, setDbLoading] = useState(true);

  const fetchMyPatients = async () => {
    try {
      setDbLoading(true);
      const data = await getAssignedElderly(NURSE_ID); 
      setAssignedElders(data);
      console.log("LOG รายชื่อผู้สูงอายุที่ได้รับมอบหมาย:", data); // ตรวจสอบที่ Terminal
    } catch (error) {
      console.error("Fetch Patients Error:", error);
      setAssignedElders([]);
    } finally {
      setDbLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMyPatients();
    }, [])
  );

  if (hookLoading || dbLoading) return <LoadingView />;
  if (hookError) return <ErrorView message={hookError} />;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.headerContainer}>
        <HeaderGreeting
          text={greeting || 'Good Morning!'}
          taskCount={taskCount || 0}
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
              // ✏️ แก้จาก elder.conditions เป็น elder.medicalConditions ตามใน MongoDB
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

// ... styles คงเดิมตามที่คุณส่งมา ...
const styles = StyleSheet.create({
  scrollContainer: { paddingBottom: 32, backgroundColor: '#F8F9FA' },
  headerContainer: {
    backgroundColor: '#2FA4E7',
    paddingVertical: 30,
    paddingHorizontal: 20,
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