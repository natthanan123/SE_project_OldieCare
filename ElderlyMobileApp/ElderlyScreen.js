import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, SafeAreaView, Modal, ActivityIndicator } from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function ElderlyScreen({ navigation }) {
  // state: การ์ดไหนขยายอยู่ และสถานะ Modal
  const [activeCard, setActiveCard] = useState(null); 
  const [showCaregiverModal, setShowCaregiverModal] = useState(false);

  // State สำหรับเก็บข้อมูลจาก Backend
  const [elderlyData, setElderlyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🟢 ฟังก์ชันดึงข้อมูล API 3 เส้น (พร้อมรอเพื่อนแก้ Backend)
  useEffect(() => {
    const fetchElderlyData = async () => {
      try {
        const elderlyId = "69975b08e870b34c438a7404"; // ID คุณยายมีปืน

        const [profileRes, medsRes, actRes] = await Promise.all([
          fetch(`https://se-project-oldiecare.onrender.com/api/users/elderly/${elderlyId}`),
          fetch(`https://se-project-oldiecare.onrender.com/api/medication?elderlyId=${elderlyId}&t=${Date.now()}`),
          fetch(`https://se-project-oldiecare.onrender.com/api/activity?elderlyId=${elderlyId}&t=${Date.now()}`)
        ]);

        const profileData = await profileRes.json();
        const medsData = await medsRes.json();
        const actData = await actRes.json();

        // ดักจับรูปแบบข้อมูลกิจกรรม
        let activitiesList = [];
        if (Array.isArray(actData)) {
            activitiesList = actData;
        } else if (actData && Array.isArray(actData.data)) {
            activitiesList = actData.data;
        }

        setElderlyData({
          name: profileData.userId?.name || "ไม่ระบุชื่อ",
          date: "วันศุกร์ที่ 20 กุมภาพันธ์ 2569", 
          image: profileData.userId?.profileImage 
            ? { uri: profileData.userId.profileImage } 
            : require('../assets/OldProfile.jpg'),
          medications: Array.isArray(medsData) ? medsData : [],
          activities: activitiesList
        });

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchElderlyData();
  }, []);

  // 🟢 ฟังก์ชันเปิด/ปิดการ์ด
  const toggleCard = (cardName) => {
    if (activeCard === cardName) {
      setActiveCard(null);
    } else {
      setActiveCard(cardName);
    }
  };

  // 🟢 Header
  const Header = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        <Image source={elderlyData.image} style={styles.profileImage} />
        <View>
          <Text style={styles.greetingText}>สวัสดีค่ะ</Text>
          <Text style={styles.nameText}>{elderlyData.name}</Text>
        </View>
      </View>
      <Text style={styles.dateText}>{elderlyData.date}</Text>
    </View>
  );

  const BottomNav = () => (
    <View style={styles.bottomNav}>
      <TouchableOpacity style={styles.navItem} onPress={() => setActiveCard('activities')}>
        <View style={[styles.navIconBg, activeCard === 'activities' && styles.activeNavBg]}>
             <FontAwesome5 name="clipboard-list" size={20} color={activeCard === 'activities' ? "white" : "#888"} />
        </View>
        <Text style={[styles.navText, activeCard === 'activities' && styles.activeNavText]}>กิจกรรม</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.navItem} onPress={() => setActiveCard('meds')}>
        <View style={[styles.navIconBg, activeCard === 'meds' && styles.activeNavBg]}>
            <MaterialCommunityIcons name="pill" size={24} color={activeCard === 'meds' ? "white" : "#888"} />
        </View>
        <Text style={[styles.navText, activeCard === 'meds' && styles.activeNavText]}>ยา</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => setActiveCard('sos')}>
        <View style={[styles.navIconBg, activeCard === 'sos' && {backgroundColor: '#FF3B30'}]}>
            <MaterialCommunityIcons name="phone" size={24} color={activeCard === 'sos' ? "white" : "#888"} />
        </View>
        <Text style={[styles.navText, activeCard === 'sos' && {color: '#FF3B30'}]}>SOS</Text>
      </TouchableOpacity>
    </View>
  );

  // 🟢 การ์ดกิจกรรม
  const renderActivitiesCard = () => {
    const isExpanded = activeCard === 'activities';
    const acts = elderlyData.activities || [];

    return (
      <View key="activities" style={styles.cardContainer}>
        <TouchableOpacity 
          style={[styles.menuCard, styles.cardBlue, isExpanded && styles.expandedHeader]} 
          onPress={() => toggleCard('activities')}
          activeOpacity={0.9}
        >
          <View style={[styles.menuIconCircle, isExpanded && {backgroundColor: '#007AFF'}]}>
            <FontAwesome5 name="clipboard-list" size={24} color={isExpanded ? "white" : "#007AFF"} />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuTitle}>กิจกรรมวันนี้</Text>
            <Text style={styles.menuSubtitle}>{acts.length > 0 ? `${acts.length} รายการ` : 'ไม่มีกิจกรรม'}</Text>
          </View>
          <Ionicons name={isExpanded ? "chevron-down" : "chevron-forward"} size={24} color="#007AFF" />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.expandedContent}>
            {acts.length > 0 ? (
              acts.map((act, index) => (
                <View key={index} style={styles.activityItem}>
                    <Text style={styles.timeText}>{act.startTime || "เวลาไม่ระบุ"}</Text>
                    <View style={styles.activityCardContent}>
                        <View style={styles.activityIconCircle}>
                            <MaterialCommunityIcons name="clipboard-text" size={24} color="white" />
                        </View>
                        <View style={{flex:1}}>
                            <Text style={styles.actTitle}>{act.topic || "กิจกรรม"}</Text>
                            <Text style={styles.actSub}>{act.description || "-"}</Text>
                        </View>
                        <View style={styles.radioEmpty} />
                    </View>
                </View>
              ))
            ) : (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <Text style={{ color: '#888', fontSize: 16 }}>วันนี้ไม่มีกิจกรรมที่ต้องทำค่ะ 🌟</Text>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  // 🟢 การ์ดยา
  const renderMedsCard = () => {
    const isExpanded = activeCard === 'meds';
    const meds = elderlyData.medications || [];

    return (
      <View key="meds" style={styles.cardContainer}>
        <TouchableOpacity 
          style={[styles.menuCard, styles.cardGreen, isExpanded && styles.expandedHeader]} 
          onPress={() => toggleCard('meds')}
          activeOpacity={0.9}
        >
          <View style={[styles.menuIconCircle, isExpanded && {backgroundColor: '#4CAF50'}]}>
            <MaterialCommunityIcons name="pill" size={28} color={isExpanded ? "white" : "#4CAF50"} />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuTitle}>ยาของฉัน</Text>
            <Text style={styles.menuSubtitle}>{meds.length > 0 ? `มีรายการยา ${meds.length} รายการ` : 'ไม่มียาที่ต้องทาน'}</Text>
          </View>
          <Ionicons name={isExpanded ? "chevron-down" : "chevron-forward"} size={24} color="#4CAF50" />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.expandedContent}>
            {meds.length > 0 ? (
              meds.map((med, index) => (
                <View key={index} style={styles.medItem}>
                   <Text style={styles.timeText}>{med.time || "08:00 เช้า"} ({med.frequency || "-"})</Text>
                   <View style={styles.medCardContent}>
                        <View style={styles.medIconBig}>
                          <MaterialCommunityIcons name="pill" size={30} color="white" />
                        </View>
                        <View style={{flex:1}}>
                           <Text style={styles.medName}>{med.name}</Text>
                           <Text style={styles.medDosage}>{med.dosage?.amount || med.quantity || ''} {med.dosage?.unit || med.unit || ''}</Text>
                        </View>
                        <View style={styles.radioEmpty} />
                   </View>
               </View>
              ))
            ) : (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <Text style={{ color: '#888', fontSize: 16 }}>วันนี้ไม่มียาที่ต้องทานค่ะ แข็งแรงมาก! 💪</Text>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  const renderCaregiverCard = () => (
    <View key="caregiver" style={styles.cardContainer}>
      <TouchableOpacity style={[styles.menuCard, styles.cardPurple]} onPress={() => setShowCaregiverModal(true)}>
        <View style={styles.menuIconCircle}>
          <FontAwesome5 name="user-nurse" size={24} color="#9C27B0" />
        </View>
        <View style={styles.menuTextContainer}>
          <Text style={styles.menuTitle}>เรียกผู้ดูแล</Text>
          <Text style={styles.menuSubtitle}>Sarah Johnson</Text>
        </View>
        <Ionicons name="notifications" size={24} color="#9C27B0" />
      </TouchableOpacity>
    </View>
  );

  const renderSOSCard = () => (
    <View key="sos" style={styles.cardContainer}>
      <TouchableOpacity style={[styles.menuCard, styles.cardRed]} onPress={() => setActiveCard('sos')}>
        <View style={[styles.menuIconCircle, {backgroundColor: 'white'}]}>
          <MaterialCommunityIcons name="phone-in-talk" size={24} color="#FF3B30" />
        </View>
        <View style={styles.menuTextContainer}>
          <Text style={[styles.menuTitle, {color: 'white'}]}>ฉุกเฉิน SOS</Text>
          <Text style={[styles.menuSubtitle, {color: 'rgba(255,255,255,0.8)'}]}>กดเพื่อขอความช่วยเหลือ</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const SOSFullView = () => (
    <View style={styles.sosContainer}>
        <Text style={styles.sosHeaderText}>EMERGENCY</Text>
        <TouchableOpacity style={styles.sosMainButton} activeOpacity={0.8} onPress={() => alert('ส่งสัญญาณแล้ว!')}>
            <View style={styles.sosRipple1}>
                <View style={styles.sosRipple2}>
                    <Text style={styles.sosText}>SOS</Text>
                </View>
            </View>
        </TouchableOpacity>
        <Text style={styles.sosWaitText}>โปรดรอสักครู่{"\n"}ขณะนี้เรากำลังส่งขอความช่วยเหลืออยู่</Text>
        <TouchableOpacity style={styles.sosCancelButton} onPress={() => setActiveCard(null)}>
             <Text style={styles.sosCancelText}>ยกเลิก</Text>
        </TouchableOpacity>
    </View>
  );

  const CaregiverModal = () => (
    <Modal animationType="fade" transparent={true} visible={showCaregiverModal} onRequestClose={() => setShowCaregiverModal(false)}>
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                    <FontAwesome5 name="user-nurse" size={24} color="white" />
                    <View style={{marginLeft: 15}}>
                        <Text style={styles.modalTitle}>เรียกผู้ดูแล</Text>
                        <Text style={styles.modalSub}>Sarah Johnson</Text>
                    </View>
                </View>
                <Text style={styles.modalQuestion}>ต้องการเรียกผู้ดูแลใช่หรือไม่ ?</Text>
                <View style={styles.modalActions}>
                    <TouchableOpacity onPress={() => setShowCaregiverModal(false)}><Text style={styles.actionCancel}>ยกเลิก</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => { setShowCaregiverModal(false); alert('เรียกแล้ว'); }}><Text style={styles.actionConfirm}>ใช่</Text></TouchableOpacity>
                </View>
            </View>
        </View>
    </Modal>
  );

  const renderContent = () => {
    let sections = [
      { key: 'activities', component: renderActivitiesCard() },
      { key: 'meds', component: renderMedsCard() },
      { key: 'caregiver', component: renderCaregiverCard() },
      { key: 'sos', component: renderSOSCard() },
    ];

    if (activeCard && activeCard !== 'sos') {
      const activeIndex = sections.findIndex(s => s.key === activeCard);
      if (activeIndex > -1) {
        const activeItem = sections.splice(activeIndex, 1)[0];
        sections.unshift(activeItem);
      }
    }

    return sections.map(s => s.component);
  };

  // 🟢 หน้าจอ Loading
  if (isLoading || !elderlyData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAFAFA' }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10, color: '#555' }}>กำลังดึงข้อมูลคุณยาย...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      {activeCard === 'sos' ? (
          <SOSFullView /> 
      ) : (
        <>
            <Header />
            <ScrollView style={styles.contentContainer}>
               {renderContent()}
               <View style={{height: 100}} /> 
            </ScrollView>
            <BottomNav />
            <CaregiverModal />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  headerContainer: { backgroundColor: '#007AFF', paddingTop: 50, paddingBottom: 25, paddingHorizontal: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, marginBottom: 10 },
  headerContent: { flexDirection: 'row', alignItems: 'center' },
  profileImage: { width: 55, height: 55, borderRadius: 27.5, marginRight: 15, borderWidth: 2, borderColor: 'white' },
  greetingText: { color: 'rgba(255,255,255,0.9)', fontSize: 14 },
  nameText: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  dateText: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 8 },
  contentContainer: { padding: 20 },
  cardContainer: { marginBottom: 15 },
  menuCard: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 16, shadowColor: "#000", shadowOffset: {width:0, height:2}, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  expandedHeader: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0, marginBottom: 0 },
  cardBlue: { backgroundColor: '#E3F2FD' },
  cardGreen: { backgroundColor: '#E8F5E9' },
  cardPurple: { backgroundColor: '#F3E5F5' },
  cardRed: { backgroundColor: '#FF3B30' },
  menuIconCircle: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  menuTextContainer: { flex: 1 },
  menuTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  menuSubtitle: { fontSize: 13, color: '#666', marginTop: 2 },
  expandedContent: { backgroundColor: 'white', padding: 15, borderBottomLeftRadius: 16, borderBottomRightRadius: 16, marginBottom: 0, elevation: 2, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  activityItem: { marginBottom: 20 },
  timeText: { fontSize: 14, fontWeight: 'bold', color: '#555', marginBottom: 5 },
  activityCardContent: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 15, borderRadius: 15, borderWidth: 1, borderColor: '#eee' },
  activityIconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  actTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  actSub: { fontSize: 12, color: '#777' },
  statusBadge: { backgroundColor: '#007AFF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  medItem: { marginBottom: 15 },
  medCardContent: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F8E9', padding: 15, borderRadius: 15 },
  medIconBig: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  medName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  medDosage: { fontSize: 13, color: '#666' },
  takenTag: { backgroundColor: '#1565C0', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 5 },
  takenTagText: { color: 'white', fontSize: 12 },
  radioEmpty: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#ccc', backgroundColor: 'white' },
  sosContainer: { flex: 1, backgroundColor: '#B71C1C', alignItems: 'center', justifyContent: 'center' },
  sosHeaderText: { color: 'white', fontSize: 24, letterSpacing: 2, marginBottom: 50, opacity: 0.9 },
  sosMainButton: { alignItems: 'center', justifyContent: 'center' },
  sosRipple1: { width: 280, height: 280, borderRadius: 140, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  sosRipple2: { width: 200, height: 200, borderRadius: 100, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 10, elevation: 10 },
  sosText: { color: '#B71C1C', fontSize: 40, fontWeight: 'bold' },
  sosWaitText: { color: 'white', textAlign: 'center', marginTop: 40, fontSize: 16, lineHeight: 24, opacity: 0.8 },
  sosCancelButton: { marginTop: 60, paddingVertical: 10, paddingHorizontal: 30, backgroundColor: 'white', borderRadius: 20 },
  sosCancelText: { color: '#B71C1C', fontSize: 16, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: '#F3E5F5', borderRadius: 20, padding: 20 },
  modalHeader: { flexDirection: 'row', backgroundColor: '#9C27B0', padding: 15, borderRadius: 15, alignItems: 'center', marginBottom: 20 },
  modalTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  modalSub: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  modalQuestion: { fontSize: 18, textAlign: 'center', marginBottom: 25, color: '#333' },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 },
  actionCancel: { color: '#666', fontSize: 16 },
  actionConfirm: { color: '#9C27B0', fontSize: 16, fontWeight: 'bold' },
  bottomNav: { flexDirection: 'row', backgroundColor: 'white', paddingVertical: 10, paddingBottom: 20, justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: '#eee' },
  navItem: { alignItems: 'center' },
  navIconBg: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  activeNavBg: { backgroundColor: '#007AFF' },
  navText: { fontSize: 10, color: '#888' },
  activeNavText: { color: '#007AFF', fontWeight: 'bold' }
});