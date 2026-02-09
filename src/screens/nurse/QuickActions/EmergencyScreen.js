import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_EMERGENCIES } from '../../../constants/mockData';

export default function EmergencyScreen({ navigation }) {
    
    const handleRespond = (name) => {
        Alert.alert("Confirm Response", `Are you responding to ${name}?`, [
            { text: "Cancel", style: "cancel" },
            { text: "Confirm", onPress: () => console.log("Responding to", name) }
        ]);
    };

    const EmergencyCard = ({ item }) => {
        const isActive = item.type === 'ACTIVE';
        
        return (
            <View style={[styles.card, !isActive && styles.respondingCard]}>
                {/* Card Header */}
                <View style={[styles.cardHeader, !isActive && styles.respondingHeader]}>
                    <View style={styles.headerStatus}>
                        <View style={[styles.statusDot, !isActive && styles.respondingDot]} />
                        <Text style={styles.headerLabel}>{item.type}</Text>
                    </View>
                    <Text style={styles.timeLabel}>{item.time}</Text>
                </View>

                {/* Card Content */}
                <View style={styles.cardBody}>
                    <View style={styles.profileRow}>
                        <Image source={{ uri: item.avatar }} style={styles.avatar} />
                        <View style={styles.info}>
                            <Text style={styles.name}>{item.elderName}</Text>
                            <View style={styles.locationRow}>
                                <Ionicons name="location" size={14} color="#F44336" />
                                <Text style={styles.roomText}>{item.room}</Text>
                            </View>
                            <View style={[styles.statusBadge, !isActive && styles.statusBadgeYellow]}>
                                <Ionicons 
                                    name={item.status.includes('HEART') ? "heart" : "warning"} 
                                    size={14} 
                                    color={isActive ? "#F44336" : "#FF9800"} 
                                />
                                <Text style={[styles.statusText, !isActive && styles.statusTextYellow]}>
                                    {item.status}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {isActive ? (
                        /* Active Actions */
                        <TouchableOpacity 
                            style={styles.respondBtn} 
                            onPress={() => handleRespond(item.elderName)}
                        >
                            <Ionicons name="hand-right" size={20} color="white" />
                            <Text style={styles.respondBtnText}>Respond Now</Text>
                        </TouchableOpacity>
                    ) : (
                        /* Responding Info */
                        <View style={styles.responderBox}>
                            <Ionicons name="person" size={16} color="#FF9800" />
                            <View style={{ marginLeft: 8 }}>
                                <Text style={styles.responderText}>{item.responder} responding</Text>
                                <Text style={styles.etaText}>ETA: {item.eta}</Text>
                            </View>
                        </View>
                    )}

                    {/* Secondary Actions */}
                    <View style={styles.actionRow}>
                        <TouchableOpacity style={styles.secondaryBtn}>
                            <Ionicons name="call" size={18} color="#333" />
                            <Text style={styles.secondaryBtnText}>Call</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.secondaryBtn}>
                            <Ionicons name="chatbubble" size={18} color="#333" />
                            <Text style={styles.secondaryBtnText}>Chat</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Red Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Emergency Alerts</Text>
                <Text style={styles.headerSub}>3 Active Emergencies</Text>
            </View>

            {/* Warning Banner */}
            <View style={styles.banner}>
                <View style={styles.bannerIcon}>
                    <Ionicons name="alert-circle" size={20} color="#F44336" />
                </View>
                <Text style={styles.bannerText}>Immediate attention required for critical alerts</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {MOCK_EMERGENCIES.map((item) => (
                    <EmergencyCard key={item.id} item={item} />
                ))}
                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    header: { 
        backgroundColor: '#D32F2F', 
        paddingHorizontal: 20, 
        paddingTop: Platform.OS === 'ios' ? 60 : 40, 
        paddingBottom: 25 
    },
    backBtn: { marginBottom: 15 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: 'white' },
    headerSub: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
    
    banner: { 
        backgroundColor: '#FFEBEE', 
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: 12, 
        marginHorizontal: 16, 
        marginTop: -15, 
        borderRadius: 12,
        zIndex: 1
    },
    bannerIcon: { backgroundColor: '#FFCDD2', padding: 4, borderRadius: 10, marginRight: 10 },
    bannerText: { fontSize: 12, color: '#D32F2F', fontWeight: '500' },

    scrollContent: { padding: 16, paddingTop: 25 },
    
    card: { 
        backgroundColor: 'white', 
        borderRadius: 20, 
        marginBottom: 20, 
        overflow: 'hidden', 
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        borderWidth: 2,
        borderColor: '#D32F2F'
    },
    respondingCard: { borderColor: '#FF9800' },
    
    cardHeader: { 
        backgroundColor: '#D32F2F', 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        paddingHorizontal: 15, 
        paddingVertical: 8 
    },
    respondingHeader: { backgroundColor: '#FF9800' },
    
    headerStatus: { flexDirection: 'row', alignItems: 'center' },
    statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'white', marginRight: 6 },
    respondingDot: { backgroundColor: 'white' },
    headerLabel: { color: 'white', fontWeight: 'bold', fontSize: 12 },
    timeLabel: { color: 'rgba(255,255,255,0.9)', fontSize: 12 },

    cardBody: { padding: 15 },
    profileRow: { flexDirection: 'row', marginBottom: 15 },
    avatar: { width: 60, height: 60, borderRadius: 30 },
    info: { marginLeft: 15, flex: 1 },
    name: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    roomText: { color: '#666', fontSize: 13, marginLeft: 4 },
    
    statusBadge: { 
        backgroundColor: '#FFEBEE', 
        flexDirection: 'row', 
        alignItems: 'center', 
        alignSelf: 'flex-start', 
        paddingHorizontal: 10, 
        paddingVertical: 5, 
        borderRadius: 12, 
        marginTop: 10 
    },
    statusBadgeYellow: { backgroundColor: '#FFF3E0' },
    statusText: { color: '#D32F2F', fontSize: 11, fontWeight: 'bold', marginLeft: 5 },
    statusTextYellow: { color: '#FF9800' },

    respondBtn: { 
        backgroundColor: '#D32F2F', 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 15, 
        borderRadius: 15, 
        marginBottom: 12 
    },
    respondBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16, marginLeft: 10 },

    responderBox: { 
        backgroundColor: '#FFF3E0', 
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: 12, 
        borderRadius: 12, 
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#FFE0B2'
    },
    responderText: { fontSize: 13, fontWeight: 'bold', color: '#855600' },
    etaText: { fontSize: 12, color: '#B08900' },

    actionRow: { flexDirection: 'row', justifyContent: 'space-between' },
    secondaryBtn: { 
        backgroundColor: '#F5F7FA', 
        flex: 0.48, 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 12, 
        borderRadius: 12 
    },
    secondaryBtnText: { marginLeft: 8, fontWeight: '600', color: '#333' }
});