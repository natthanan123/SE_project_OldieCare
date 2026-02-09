import React from 'react'; // แนะนำให้ import React ไว้เสมอ
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useNurseHome } from '../../../hooks/nurse/useNurseHome';

import HeaderGreeting from '../../../components/nurse/HeaderGreeting';
import SOSAlertCard from '../../../components/nurse/SOSAlertCard';
import ElderCard from '../../../components/nurse/ElderCard';
import QuickActionButton from '../../../components/nurse/QuickActionButton';
import LoadingView from '../../../components/common/LoadingView';
import ErrorView from '../../../components/common/ErrorView';

export default function NurseHomeScreen({ navigation }) {
  const { greeting, sosAlert, elders, loading, taskCount, error } = useNurseHome();

  if (loading) return <LoadingView />;
  if (error) return <ErrorView message={error} />;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.headerContainer}>
        <HeaderGreeting
          text={greeting || 'Good Morning!'}
          taskCount={taskCount || 0}
        />
      </View>

      {/* Render SOS Alert เฉพาะเมื่อมีข้อมูลจริง */}
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
          <Text style={styles.sectionTitle}>Elderies</Text>
          <Text style={styles.taskText}>{taskCount || 0} Tasks</Text>
        </View>
      </View>

      <View>
        {Array.isArray(elders) && elders.map((elder) => (
          <ElderCard
            key={elder.id}
            name={elder.name || ''}
            age={elder.age || ''}
            conditions={elder.conditions || []}
            // เพิ่มบรรทัดนี้เพื่อให้กดได้
            onPress={() => navigation.navigate('NurseTasks', {
              elderId: elder.id,
              elderName: elder.name
            })}
          />
        ))}
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
  scrollContainer: {
    paddingBottom: 32,
  },
  headerContainer: {
    backgroundColor: '#2FA4E7',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  sectionMargin: {
    marginTop: 16,
    paddingHorizontal: 16, // เพิ่ม padding เพื่อความสวยงาม
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333',
  },
  taskText: {
    color: '#2FA4E7',
    fontSize: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});