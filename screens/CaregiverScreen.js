import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function CaregiverScreen({ navigation }) {
    return (
        <LinearGradient
            colors={['#FFF3B0', '#FFE082', '#FFD54F']}
            style={styles.container}
        >
            {/* Header */}
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backText}>‹</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.centerTitle}>
                <Text style={styles.centerTitleText}>ผู้ดูแล</Text>
            </View>


            {/* List */}
            <ScrollView showsVerticalScrollIndicator={false}>
                <CareCard image={require('../assets/old1.png')} />
                <CareCard image={require('../assets/old2.png')} />
                <CareCard image={require('../assets/old3.png')} />
                <CareCard image={require('../assets/old4.png')} />

                {/* Add */}
                <View style={styles.addRow}>
                    <TouchableOpacity style={styles.iconBtn}>
                        <Text style={styles.iconText}>＋</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn}>
                        <Text style={styles.iconText}>🗑</Text>
                    </TouchableOpacity>
                </View>

                {/* Quick Calculate */}
                <TouchableOpacity style={styles.quickBtn}>
                    <Text style={styles.quickText}>Quick Calculate</Text>
                </TouchableOpacity>
            </ScrollView>
        </LinearGradient>
    );
}

/* ================= Components ================= */

function CareCard({ image }) {
    return (
        <View style={styles.card}>
            <Image source={image} style={styles.avatar} />

            <View style={styles.cardContent}>
                <View style={styles.row}>
                    <SmallBtn text="ยา" />
                    <SmallBtn text="อาหาร" />
                </View>

                <View style={styles.row}>
                    <SmallBtn text="แจ้งเตือน" />
                    <SmallBtn text="แจ้งเตือน" />
                </View>
            </View>
        </View>
    );
}

function SmallBtn({ text }) {
    return (
        <TouchableOpacity style={styles.smallBtn}>
            <Text style={styles.smallText}>{text}</Text>
        </TouchableOpacity>
    );
}


/* ================= Styles ================= */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 40,
    },

    header: {
        position: 'relative',
        marginBottom: 10,
    },

    backBtn: {
        position: 'absolute',
        left: 0,
    },

    backText: {
        fontSize: 42,
    },

    centerTitle: {
        alignSelf: 'center',
        backgroundColor: '#FFD54F',
        paddingHorizontal: 40,
        paddingVertical: 14,
        borderRadius: 40,
        marginBottom: 20,
    },

    centerTitleText: {
        fontSize: 42,
        fontWeight: '500',
    },

    headerBadge: {
        backgroundColor: '#FFD54F',
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 30,
    },

    headerText: {
        fontSize: 32,
        fontWeight: '500',
    },

    card: {
        flexDirection: 'row',
        backgroundColor: '#FFD54F',
        borderRadius: 30,
        padding: 18,
        marginBottom: 16,
        alignItems: 'center',
    },

    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginRight: 16,
    },

    cardContent: {
        flex: 1,
        justifyContent: 'center',
    },

    row: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 8,
    },

    smallBtn: {
        flex: 1,
        minHeight: 46,
        backgroundColor: '#FFF',
        borderRadius: 22,
        borderWidth: 1,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },

    smallText: {
        fontSize: 18,
        fontWeight: '500',
    },

    addRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginVertical: 10,
    },

    iconBtn: {
        marginLeft: 10,
    },

    iconText: {
        fontSize: 26,
    },

    quickBtn: {
        backgroundColor: '#FFD54F',
        paddingVertical: 22,
        borderRadius: 40,
        alignItems: 'center',
        marginVertical: 20,
        borderWidth: 1,
        borderColor: '#000',
    },

    quickText: {
        fontSize: 28,
        fontWeight: '500',
    },
});
