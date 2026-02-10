import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../theme';
import { HealthCard } from '../components/HealthCard';
import { MedItem } from '../components/MedItem';
import { User, Bell } from 'lucide-react-native';
import { getHomeSummary } from '../api/client';

export default function HomeScreen({ navigation }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getHomeSummary();
        if (mounted) setSummary(data);
      } catch (e) {
        if (mounted) setError(e.message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const calPercent = useMemo(() => {
    if (!summary) return 0;
    const max = summary.calTargetMax || 1;
    return Math.max(0, Math.min(100, Math.round((summary.calories / max) * 100)));
  }, [summary]);

  const lastUpdateText = useMemo(() => {
    if (!summary?.updatedAt) return null;
    try {
      const d = new Date(summary.updatedAt);
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      return `${hh}:${mm}`;
    } catch {
      return null;
    }
  }, [summary]);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView style={styles.container} bounces={false} showsVerticalScrollIndicator={false}>
          <View style={styles.headerBlue}>
            <View style={styles.headerTopRow}>
              <View>
                <Text style={styles.headerTitle}>Relative</Text>
                <Text style={styles.headerSub}>Family Dashboard</Text>
              </View>
              <TouchableOpacity style={styles.notiIcon} onPress={() => navigation.navigate('เนเธเนเธเน€เธ•เธทเธญเธ')}>
                <Bell size={22} color="#fff" />
                <View style={styles.redDot} />
              </TouchableOpacity>
            </View>
            <View style={styles.profileCard}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>ญาติ</Text>
              </View>
              <View style={{ marginLeft: 15, flex: 1 }}>
                <Text style={styles.nameText}>ข้อมูลผู้ป่วย</Text>
                <Text style={styles.ageText}>อายุ —</Text>
                <Text style={styles.statusText}>โ— สถานะดูแล</Text>
              </View>
            </View>
          </View>

          <View style={styles.body}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>สรุปสุขภาพ</Text>
              {lastUpdateText ? (
                <Text style={styles.updateText}>อัปเดตล่าสุด: {lastUpdateText}</Text>
              ) : null}
            </View>

            {loading && (
              <View style={{ paddingVertical: 24 }}><ActivityIndicator color={COLORS.primary} /></View>
            )}
            {error && !loading && <Text style={{ color: 'red' }}>{error}</Text>}

            {!!summary && (
              <>
                <View style={styles.statsRow}>
                  <HealthCard label="Cal" value={String(summary.calories)} unit="Kcal" />
                  <HealthCard label="Temp" value={String(summary.temp)} unit="°C" />
                </View>
                <View style={styles.statsRow}>
                  <HealthCard label="TDEE" value={String(summary.tdee)} unit="Kcal" />
                  <HealthCard label="Pressure" value={String(summary.pressure)} unit="mmHg" />
                </View>

                <View style={styles.caloriesCard}>
                  <Text style={styles.sectionTitleSmall}>พลังงานที่ได้รับวันนี้</Text>
                  <View style={styles.progressRow}>
                    <View style={styles.iconCircle}><User size={16} color={COLORS.primary} /></View>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: `${calPercent}%`, backgroundColor: '#F2A2A2' }]} />
                    </View>
                  </View>
                  <Text style={styles.progressTarget}>
                    {summary.calTargetMin} - {summary.calTargetMax} kcal
                  </Text>
                </View>

                <Text style={styles.sectionTitle}>การรับประทานยา</Text>
                {summary.meds.length === 0 ? (
                  <Text style={{ color: COLORS.textSub, marginVertical: 8 }}>ไม่มีรายการยา</Text>
                ) : (
                  summary.meds.map((item) => (
                    <MedItem key={item.id} name={item.name} time={item.time} status={item.status} />
                  ))
                )}

                <View style={styles.sosBanner}>
                  <Text style={styles.sosTitle}>SOS Status</Text>
                  <Text style={styles.sosSub}>—</Text>
                </View>
                <View style={{ height: 40 }} />
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerBlue: { backgroundColor: COLORS.primary, paddingHorizontal: 25, paddingTop: 0, paddingBottom: 75 },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 0, marginBottom: 10 },
  headerTitle: { fontSize: 32, fontWeight: 'bold', color: '#fff', lineHeight: 38 },
  headerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: -4 },
  notiIcon: { padding: 10, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 14, position: 'relative' },
  redDot: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF5A5F', borderWidth: 1.5, borderColor: COLORS.primary },
  profileCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 18, borderRadius: 24, elevation: 10, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, position: 'absolute', bottom: -35, left: 20, right: 20, zIndex: 10 },
  avatarCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#E1F5FE', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 18 },
  nameText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  ageText: { color: '#888', fontSize: 13 },
  statusText: { color: COLORS.success, fontWeight: '700', fontSize: 13, marginTop: 2 },
  body: { paddingHorizontal: 20, paddingTop: 60, backgroundColor: '#fff', borderTopLeftRadius: 35, borderTopRightRadius: 35 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 15 },
  sectionTitle: { fontSize: 19, fontWeight: 'bold', color: '#333' },
  updateText: { fontSize: 11, color: '#AAA' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  caloriesCard: { backgroundColor: '#F0F7FF', padding: 18, borderRadius: 24, marginVertical: 12, borderWidth: 1, borderColor: '#D1E9FF' },
  sectionTitleSmall: { fontSize: 15, fontWeight: 'bold', marginBottom: 12, color: '#444' },
  progressRow: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  progressBarBg: { flex: 1, height: 10, backgroundColor: '#E0E0E0', borderRadius: 5, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 5 },
  progressTarget: { textAlign: 'right', fontSize: 11, color: '#777', marginTop: 8 },
  sosBanner: { backgroundColor: COLORS.danger, padding: 20, borderRadius: 24, marginTop: 10 },
  sosTitle: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  sosSub: { color: 'rgba(255,255,255,0.9)', fontSize: 14 },
});
