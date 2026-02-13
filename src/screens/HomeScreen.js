import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../theme/colors';
import { HealthCard } from '../components/HealthCard';
import { MedItem } from '../components/MedItem';
import { Bell, Calendar, ClipboardList, LogOut } from 'lucide-react-native';
import { getHomeSummary, getActivities } from '../api/client';

export default function HomeScreen({ navigation }) {
  const [summary, setSummary] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [summaryData, activityData] = await Promise.all([
        getHomeSummary(),
        getActivities()
      ]);

      setSummary(summaryData);
      setActivities(activityData);
    } catch (e) {
      console.error('Error loading home data:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleLogout = () => {
    Alert.alert(
      "ออกจากระบบ",
      "คุณต้องการออกจากระบบหรือไม่?",
      [
        { text: "ยกเลิก", style: "cancel" },
        {
          text: "ออกจากระบบ",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('patientId');

            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }]
            });
          }
        }
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>

        <ScrollView
          style={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
            />
          }
        >

          {/* HEADER */}
          <View style={styles.headerBlue}>
            <View style={styles.headerTopRow}>
              <View>
                <Text style={styles.headerTitle}>
                  {summary?.profile?.name || 'OldieCare'}
                </Text>

                {summary?.profile?.age && (
                  <Text style={styles.headerSub}>
                    อายุ {summary.profile.age} ปี
                  </Text>
                )}
              </View>

              <View style={{ flexDirection: 'row', gap: 10 }}>

                {/* 🔔 ปุ่มแจ้งเตือน */}
                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={() => navigation.navigate('Alert')}
                >
                  <Bell size={22} color="#fff" />
                </TouchableOpacity>

                {/* 🚪 ปุ่มออกจากระบบ */}
                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={handleLogout}
                >
                  <LogOut size={22} color="#fff" />
                </TouchableOpacity>

              </View>
            </View>
          </View>

          {/* BODY */}
          <View style={styles.body}>
            {loading ? (
              <ActivityIndicator
                size="large"
                color={COLORS.primary}
                style={{ marginTop: 50 }}
              />
            ) : (
              <>
                {/* HEALTH SUMMARY */}
                <View style={styles.sectionHeader}>
                  <ClipboardList size={20} color={COLORS.primary} />
                  <Text style={styles.sectionTitle}>สรุปสุขภาพ</Text>
                </View>

                <View style={styles.statsRow}>
                  <HealthCard
                    label="Cal"
                    value={String(summary?.calories || 0)}
                    unit="Kcal"
                  />
                  <HealthCard
                    label="Temp"
                    value={String(summary?.temp || 0)}
                    unit="°C"
                  />
                </View>

                {/* ACTIVITIES */}
                <View style={[styles.sectionHeader, { marginTop: 20 }]}>
                  <Calendar size={20} color={COLORS.primary} />
                  <Text style={styles.sectionTitle}>กิจกรรมจากพยาบาล</Text>
                </View>

                {activities.length > 0 ? (
                  activities.map((item, index) => (
                    <View key={item.id || index} style={styles.activityCard}>
                      <View style={styles.activityMain}>
                        <Text style={styles.activityTopic}>
                          {item.topic}
                        </Text>

                        <View
                          style={[
                            styles.statusTag,
                            {
                              backgroundColor:
                                item.status === 'Pending'
                                  ? '#FFFBEB'
                                  : '#F0FDF4'
                            }
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusText,
                              {
                                color:
                                  item.status === 'Pending'
                                    ? '#D97706'
                                    : COLORS.success
                              }
                            ]}
                          >
                            {item.status}
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.activityTime}>
                        {item.startTime} - {item.endTime}
                      </Text>

                      {item.description && (
                        <Text style={styles.activityDesc}>
                          {item.description}
                        </Text>
                      )}
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyBox}>
                    <Text style={styles.emptyText}>
                      ยังไม่มีบันทึกกิจกรรมสำหรับวันนี้
                    </Text>
                  </View>
                )}

                {/* MEDICATIONS */}
                <View style={[styles.sectionHeader, { marginTop: 20 }]}>
                  <Text style={styles.sectionTitle}>การรับยา</Text>
                </View>

                {summary?.meds?.length > 0 ? (
                  summary.meds.map((item, index) => (
                    <MedItem
                      key={index}
                      name={item.name}
                      time={item.time}
                      status={item.status}
                    />
                  ))
                ) : (
                  <Text style={styles.emptyText}>
                    ไม่มีรายการยา
                  </Text>
                )}

              </>
            )}
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fe'
  },

  headerBlue: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 25
  },

  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff'
  },

  headerSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600'
  },

  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center'
  },

  body: {
    padding: 16,
    marginTop: -15,
    backgroundColor: '#f8f9fe',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A'
  },

  statsRow: {
    flexDirection: 'row',
    gap: 12
  },

  activityCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2
  },

  activityMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },

  activityTopic: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    flex: 1
  },

  activityTime: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 4
  },

  activityDesc: {
    fontSize: 13,
    color: '#666',
    marginTop: 6,
    lineHeight: 18
  },

  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },

  statusText: {
    fontSize: 11,
    fontWeight: '800'
  },

  emptyBox: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#CCC'
  },

  emptyText: {
    color: '#999',
    fontSize: 14
  }
});
