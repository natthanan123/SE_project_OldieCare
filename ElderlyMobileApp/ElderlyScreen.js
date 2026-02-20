import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, SafeAreaView, Modal } from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';


//แบบจำลองก่อนนำไปดึงข้อมูลจริง
const mockElderlyData = {
  name: "คุณยาย มีปืน ในกางเกง",
  date: "วันศุกร์ที่ 20 กุมภาพันธ์ 2569",
  image: { uri: 'https://res.cloudinary.com/dpy0xskc5/image/upload/v1771526918/uploads/user-1771526916963-efizjm.jpg' },
  medications: [
    { name: "Amlodipine", dosage: "5 mg", frequency: "once daily" }
  ]
};

export default function ElderlyScreen({ navigation }) {
  // state:การ์ดไหนขยายอยู่
  const [activeCard, setActiveCard] = useState(null); 
  const [showCaregiverModal, setShowCaregiverModal] = useState(false);

  // ฟังก์ชันสลับการ์ด
  const toggleCard = (cardName) => {
    if (activeCard === cardName) {
      setActiveCard(null);
    } else {
      setActiveCard(cardName);
    }
  };


  // Components ส่วนประกอบย่อย
  const Header = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        <Image source={mockElderlyData.image} style={styles.profileImage} />
        <View>
          <Text style={styles.greetingText}>สวัสดีค่ะ</Text>
          <Text style={styles.nameText}>{mockElderlyData.name}</Text>
        </View>
      </View>
      <Text style={styles.dateText}>{mockElderlyData.date}</Text>
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

  //กิจกรรม
  const renderActivitiesCard = () => {
    const isExpanded = activeCard === 'activities';
    return (
      <View key="activities" style={styles.cardContainer}>
        {/* Header ของการ์ด */}
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
            <Text style={styles.menuSubtitle}>3 รายการ</Text>
          </View>
          <Ionicons name={isExpanded ? "chevron-down" : "chevron-forward"} size={24} color="#007AFF" />
        </TouchableOpacity>

        {/* เนื้อหาที่จะโชว์เมื่อขยาย (Dropdown Content) */}
        {isExpanded && (
          <View style={styles.expandedContent}>
            {/* Item 1 */}
            <View style={styles.activityItem}>
                <Text style={styles.timeText}>08:00 เช้า</Text>
                <View style={styles.activityCardContent}>
                    <View style={styles.activityIconCircle}>
                        <MaterialCommunityIcons name="food-variant" size={24} color="white" />
                    </View>
                    <View style={{flex:1}}>
                        <Text style={styles.actTitle}>ทานอาหารเช้า</Text>
                        <Text style={styles.actSub}>ข้าวมันไก่, ยาหลังอาหาร</Text>
                    </View>
                    <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
                </View>
            </View>
            {/* Item 2 */}
            <View style={styles.activityItem}>
                <Text style={styles.timeText}>15:00 บ่าย</Text>
                <View style={[styles.activityCardContent, {borderColor: '#007AFF', borderWidth: 1}]}>
                    <View style={[styles.activityIconCircle, {backgroundColor: '#007AFF'}]}>
                        <MaterialCommunityIcons name="arm-flex" size={24} color="white" />
                    </View>
                    <View style={{flex:1}}>
                        <Text style={styles.actTitle}>กายภาพบำบัด</Text>
                        <Text style={styles.actSub}>15 นาที (แขน, ขา)</Text>
                    </View>
                    <View style={styles.statusBadge}><Text style={styles.statusText}>กำลังทำ</Text></View>
                </View>
            </View>
            {/* Item 3 */}
            <View style={styles.activityItem}>
                <Text style={styles.timeText}>18:00 เย็น</Text>
                <View style={[styles.activityCardContent, {opacity: 0.6}]}>
                    <View style={[styles.activityIconCircle, {backgroundColor: '#1E88E5'}]}>
                        <MaterialCommunityIcons name="bed" size={24} color="white" />
                    </View>
                    <View style={{flex:1}}>
                        <Text style={styles.actTitle}>พักผ่อน</Text>
                        <Text style={styles.actSub}>ดูโทรทัศน์, ฟังเพลง</Text>
                    </View>
                    <View style={styles.radioEmpty} />
                </View>
            </View>
          </View>
        )}
      </View>
    );
  };

  //ยา
  const renderMedsCard = () => {
    const isExpanded = activeCard === 'meds';
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
            <Text style={styles.menuSubtitle}>มีรายการยาใหม่</Text>
          </View>
          <Ionicons name={isExpanded ? "chevron-down" : "chevron-forward"} size={24} color="#4CAF50" />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.expandedContent}>
            {mockElderlyData.medications.map((med, index) => (
              <View key={index} style={styles.medItem}>
                 <Text style={styles.timeText}>08:00 เช้า (หลังอาหาร)</Text>
                 <View style={styles.medCardContent}>
                      <View style={styles.medIconBig}>
                        <MaterialCommunityIcons name="pill" size={30} color="white" />
                      </View>
                      <View style={{flex:1}}>
                         <Text style={styles.medName}>{med.name}</Text>
                         <Text style={styles.medDosage}>{med.dosage} ({med.frequency})</Text>
                      </View>
                      <View style={styles.radioEmpty} />
                 </View>
             </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  //ผู้ดูแล
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

  //SOS
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

  // --- SOS Full Screen ---
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

  // --- Modal Caregiver ---
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

  // Main Logic
  const renderContent = () => {

    let sections = [
      { key: 'activities', component: renderActivitiesCard() },
      { key: 'meds', component: renderMedsCard() },
      { key: 'caregiver', component: renderCaregiverCard() },
      { key: 'sos', component: renderSOSCard() },
    ];

    //Activeให้ย้ายไปตัวแรกสุด
    if (activeCard && activeCard !== 'sos') {
      const activeIndex = sections.findIndex(s => s.key === activeCard);
      if (activeIndex > -1) {
        const activeItem = sections.splice(activeIndex, 1)[0];
        sections.unshift(activeItem);
      }
    }

    return sections.map(s => s.component);
  };

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
  // Header
  headerContainer: { backgroundColor: '#007AFF', paddingTop: 50, paddingBottom: 25, paddingHorizontal: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, marginBottom: 10 },
  headerContent: { flexDirection: 'row', alignItems: 'center' },
  profileImage: { width: 55, height: 55, borderRadius: 27.5, marginRight: 15, borderWidth: 2, borderColor: 'white' },
  greetingText: { color: 'rgba(255,255,255,0.9)', fontSize: 14 },
  nameText: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  dateText: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 8 },

  // Cards
  contentContainer: { padding: 20 },
  cardContainer: { marginBottom: 15 },
  menuCard: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 16, shadowColor: "#000", shadowOffset: {width:0, height:2}, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  expandedHeader: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0, marginBottom: 0 }, // ถ้าขยายอยู่ ลบโค้งล่างออก
  
  cardBlue: { backgroundColor: '#E3F2FD' },
  cardGreen: { backgroundColor: '#E8F5E9' },
  cardPurple: { backgroundColor: '#F3E5F5' },
  cardRed: { backgroundColor: '#FF3B30' },
  
  menuIconCircle: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  menuTextContainer: { flex: 1 },
  menuTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  menuSubtitle: { fontSize: 13, color: '#666', marginTop: 2 },

  // Expanded Content Area
  expandedContent: { backgroundColor: 'white', padding: 15, borderBottomLeftRadius: 16, borderBottomRightRadius: 16, marginBottom: 0, elevation: 2, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  
  // Activities Item Style
  activityItem: { marginBottom: 20 },
  timeText: { fontSize: 14, fontWeight: 'bold', color: '#555', marginBottom: 5 },
  activityCardContent: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 15, borderRadius: 15, borderWidth: 1, borderColor: '#eee' },
  activityIconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  actTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  actSub: { fontSize: 12, color: '#777' },
  statusBadge: { backgroundColor: '#007AFF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: 'white', fontSize: 10, fontWeight: 'bold' },

  // Meds Item Style
  medItem: { marginBottom: 15 },
  medCardContent: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F8E9', padding: 15, borderRadius: 15 },
  medIconBig: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  medName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  medDosage: { fontSize: 13, color: '#666' },
  takenTag: { backgroundColor: '#1565C0', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 5 },
  takenTagText: { color: 'white', fontSize: 12 },
  radioEmpty: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#ccc', backgroundColor: 'white' },

  // SOS Full Screen
  sosContainer: { flex: 1, backgroundColor: '#B71C1C', alignItems: 'center', justifyContent: 'center' },
  sosHeaderText: { color: 'white', fontSize: 24, letterSpacing: 2, marginBottom: 50, opacity: 0.9 },
  sosMainButton: { alignItems: 'center', justifyContent: 'center' },
  sosRipple1: { width: 280, height: 280, borderRadius: 140, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  sosRipple2: { width: 200, height: 200, borderRadius: 100, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 10, elevation: 10 },
  sosText: { color: '#B71C1C', fontSize: 40, fontWeight: 'bold' },
  sosWaitText: { color: 'white', textAlign: 'center', marginTop: 40, fontSize: 16, lineHeight: 24, opacity: 0.8 },
  sosCancelButton: { marginTop: 60, paddingVertical: 10, paddingHorizontal: 30, backgroundColor: 'white', borderRadius: 20 },
  sosCancelText: { color: '#B71C1C', fontSize: 16, fontWeight: 'bold' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: '#F3E5F5', borderRadius: 20, padding: 20 },
  modalHeader: { flexDirection: 'row', backgroundColor: '#9C27B0', padding: 15, borderRadius: 15, alignItems: 'center', marginBottom: 20 },
  modalTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  modalSub: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  modalQuestion: { fontSize: 18, textAlign: 'center', marginBottom: 25, color: '#333' },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 },
  actionCancel: { color: '#666', fontSize: 16 },
  actionConfirm: { color: '#9C27B0', fontSize: 16, fontWeight: 'bold' },

  // Bottom Nav
  bottomNav: { flexDirection: 'row', backgroundColor: 'white', paddingVertical: 10, paddingBottom: 20, justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: '#eee' },
  navItem: { alignItems: 'center' },
  navIconBg: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  activeNavBg: { backgroundColor: '#007AFF' },
  navText: { fontSize: 10, color: '#888' },
  activeNavText: { color: '#007AFF', fontWeight: 'bold' }
});