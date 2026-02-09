import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// นำเข้าข้อมูล Mock ที่แยกไว้ในไฟล์ constants
import { MOCK_NURSE_PROFILE } from '../../../constants/mockData';

export default function ProfileScreen({ navigation }) {
    // เรียกใช้ข้อมูลจาก Mock Data
    const nurse = MOCK_NURSE_PROFILE;

    // Component ย่อยสำหรับเมนูแต่ละแถว เพื่อลดความซ้ำซ้อนของโค้ด
    const MenuItem = ({ icon, title, subtitle, onPress, showArrow = true }) => (
        <TouchableOpacity style={styles.menuItem} onPress={onPress}>
            <View style={styles.menuIconContainer}>
                <Ionicons name={icon} size={22} color="#73C7FF" />
            </View>
            <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>{title}</Text>
                {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
            </View>
            {showArrow && <Ionicons name="chevron-forward" size={20} color="#CCC" />}
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* ส่วนหัวโปรไฟล์ (Profile Header) */}
            <View style={styles.header}>
                <View style={styles.topActions}>
                    <Text style={styles.headerLabel}>Profile</Text>
                    <TouchableOpacity>
                        <Ionicons name="ellipsis-vertical" size={24} color="#333" />
                    </TouchableOpacity>
                </View>

                <View style={styles.profileInfo}>
                    <View style={styles.avatarWrapper}>
                        <Image source={{ uri: nurse.avatar }} style={styles.avatar} />
                        <TouchableOpacity style={styles.editAvatarBtn}>
                            <Ionicons name="camera" size={16} color="white" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.nurseName}>{nurse.name}</Text>
                    <Text style={styles.nurseRole}>{nurse.role}</Text>
                    <View style={styles.idBadge}>
                        <Text style={styles.idText}>ID: {nurse.id}</Text>
                    </View>
                </View>
            </View>

            {/* ส่วนสถิติ (Stats Cards) */}
            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{nurse.stats.exp}</Text>
                    <Text style={styles.statLabel}>Years Exp.</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{nurse.stats.patients}</Text>
                    <Text style={styles.statLabel}>Patients</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{nurse.stats.rating}</Text>
                    <Text style={styles.statLabel}>Rating</Text>
                </View>
            </View>

            {/* ส่วนข้อมูลติดต่อ (Contact Information) */}
            <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Contact Information</Text>
                <MenuItem 
                    icon="call-outline" 
                    title="Phone" 
                    subtitle={nurse.contact.phone} 
                    showArrow={false} 
                />
                <MenuItem 
                    icon="mail-outline" 
                    title="Email" 
                    subtitle={nurse.contact.email} 
                    showArrow={false} 
                />
                <MenuItem 
                    icon="calendar-outline" 
                    title="Next Shift" 
                    subtitle={nurse.contact.nextShift} 
                    showArrow={false} 
                />
            </View>

            {/* ส่วนเมนูการตั้งค่าและประวัติ (Settings & History) */}
            <View style={styles.sectionCard}>
                <MenuItem icon="time-outline" title="Work History" subtitle="View past assignments & shifts" />
                <MenuItem icon="person-outline" title="Account Settings" />
                <MenuItem icon="notifications-outline" title="Notifications" />
                <MenuItem icon="help-circle-outline" title="Help & Support" />
            </View>

            {/* ปุ่มออกจากระบบ (Logout) */}
            <TouchableOpacity 
                style={styles.logoutBtn}
                onPress={() => navigation.replace('Login')} // เปลี่ยนเป็นชื่อหน้า Login ของคุณ
            >
                <Ionicons name="log-out-outline" size={20} color="#FF5252" style={{ marginRight: 8 }} />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    header: { 
        backgroundColor: 'white', 
        paddingHorizontal: 20, 
        paddingTop: Platform.OS === 'ios' ? 60 : 40, 
        paddingBottom: 40, 
        borderBottomLeftRadius: 30, 
        borderBottomRightRadius: 30 
    },
    topActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    headerLabel: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    profileInfo: { alignItems: 'center' },
    avatarWrapper: { position: 'relative', marginBottom: 15 },
    avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#73C7FF' },
    editAvatarBtn: { 
        position: 'absolute', 
        bottom: 0, 
        right: 0, 
        backgroundColor: '#73C7FF', 
        width: 32, 
        height: 32, 
        borderRadius: 16, 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderWidth: 2, 
        borderColor: 'white' 
    },
    nurseName: { fontSize: 22, fontWeight: 'bold', color: '#333' },
    nurseRole: { fontSize: 14, color: '#73C7FF', marginVertical: 4 },
    idBadge: { backgroundColor: '#F0F2F5', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
    idText: { fontSize: 12, color: '#666' },
    
    statsContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: -25 },
    statCard: { 
        backgroundColor: 'white', 
        width: '30%', 
        paddingVertical: 15, 
        borderRadius: 20, 
        alignItems: 'center', 
        elevation: 6, 
        shadowColor: '#000', 
        shadowOpacity: 0.1, 
        shadowRadius: 10 
    },
    statValue: { fontSize: 18, fontWeight: 'bold', color: '#2FA4E7' },
    statLabel: { fontSize: 11, color: '#999', marginTop: 4 },

    sectionCard: { backgroundColor: 'white', marginHorizontal: 20, marginTop: 20, borderRadius: 24, padding: 10, elevation: 2 },
    sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#333', marginLeft: 15, marginTop: 10, marginBottom: 5 },
    
    menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 15 },
    menuIconContainer: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F0F9FF', justifyContent: 'center', alignItems: 'center' },
    menuTextContainer: { flex: 1, marginLeft: 15 },
    menuTitle: { fontSize: 15, fontWeight: '600', color: '#333' },
    menuSubtitle: { fontSize: 13, color: '#999', marginTop: 2 },

    logoutBtn: { 
        flexDirection: 'row', 
        backgroundColor: '#FFF5F5', 
        marginHorizontal: 20, 
        marginTop: 25, 
        padding: 18, 
        borderRadius: 20, 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderWidth: 1, 
        borderColor: '#FFE5E5' 
    },
    logoutText: { color: '#FF5252', fontWeight: 'bold', fontSize: 16 }
});