import React, { useCallback } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNurseTasks } from '../../../hooks/nurse/useNurseTasks';
import { useNurseHome } from '../../../hooks/nurse/useNurseHome';
import TaskItem from '../../../components/nurse/TaskItem';
import HeaderGreeting from '../../../components/nurse/HeaderGreeting';
import SOSAlertCard from '../../../components/nurse/SOSAlertCard';
import QuickActionButton from '../../../components/nurse/QuickActionButton';
import LoadingView from '../../../components/common/LoadingView';
import { useFocusEffect } from '@react-navigation/native';

export default function NurseTasksScreen({ route, navigation }) {
  const { elderId, elderName } = route.params;
  const { tasks, loading, loadTasks, toggleTaskStatus } = useNurseTasks(elderId);
  const { sosAlert } = useNurseHome();

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [loadTasks])
  );

  const nextMedication = tasks.find(t => t.type === 'med' && !t.completed);

  if (loading) return <LoadingView />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <HeaderGreeting text={`Tasks for ${elderName}`} taskCount={null} />
      </View>

      <View style={styles.content}>
        {sosAlert && (
          <View style={{ marginBottom: 20 }}>
            <SOSAlertCard
              elderName={sosAlert.elderName || ''}
              room={sosAlert.room || ''}
              onRespond={() => navigation.navigate('Emergency')}
            />
          </View>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Tasks</Text>
          <Text style={styles.taskCount}>{tasks.length} Tasks</Text>
        </View>

        <View style={styles.card}>
          {tasks.map(task => (
            <TaskItem key={task.id} {...task} onToggle={() => toggleTaskStatus(task.id)} />
          ))}
          <TouchableOpacity
            style={styles.viewAllBtn}
            onPress={() => navigation.navigate('Schedules', { elderId, elderName })}
          >
            <Text style={styles.viewAllText}>View All Tasks</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.reminderCard}>
          <View style={styles.reminderHeader}>
            <Ionicons name="medkit" size={20} color="white" />
            <Text style={styles.reminderTitle}>Medication Reminder</Text>
          </View>
          <Text style={styles.reminderSub}>
            {nextMedication ? "Next dose scheduled" : "No pending medication"}
          </Text>

          <View style={styles.medRow}>
            <View>
              <Text style={styles.medName}>{elderName}</Text>
              <Text style={styles.medDetail}>{nextMedication?.title || 'All completed'}</Text>
            </View>
            <Text style={styles.medTime}>{nextMedication?.time || '--:--'}</Text>
          </View>

          {/* แก้ไข: ส่งทั้ง elderId และ elderName ไปยังหน้า Meds */}
          <TouchableOpacity
            style={styles.manageBtn}
            onPress={() => navigation.navigate('Meds', {
              elderId: elderId,
              elderName: elderName // ต้องมั่นใจว่าส่งชื่อไปด้วย
            })}
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
              onPress={() => navigation.navigate('CareReport', { 
                elderName: elderName,
                elderId: elderId 
              })}
            />
            <QuickActionButton 
              label="Emergency" 
              icon="warning-outline" 
              onPress={() => navigation.navigate('Emergency')} 
            />
            <QuickActionButton 
              label="Calculate" 
              con="calculator-outline" 
              onPress={() => navigation.navigate('TDEECalculator')} 
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
  reminderCard: { backgroundColor: '#9C27B0', borderRadius: 20, padding: 20, marginTop: 20 },
  reminderHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  reminderTitle: { color: 'white', fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
  reminderSub: { color: '#E1BEE7', fontSize: 12, marginBottom: 16 },
  medRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  medName: { color: 'white', fontWeight: 'bold', fontSize: 17 },
  medTime: { color: 'white', fontSize: 14 },
  medDetail: { color: '#E1BEE7', fontSize: 14, marginTop: 4 },
  manageBtn: { backgroundColor: 'white', padding: 12, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  manageBtnText: { color: '#9C27B0', fontWeight: 'bold' },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 8 },
});