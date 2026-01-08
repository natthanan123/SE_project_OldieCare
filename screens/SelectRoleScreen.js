import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function SelectRoleScreen({ navigation }) {
    return (
        <LinearGradient
            colors={['#FFF3B0', '#FFE082', '#FFD54F']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.container}
        >

            {/* Back Button */}
            <TouchableOpacity
                style={styles.backBtn}
                onPress={() => navigation.navigate('Welcome')}
            >
                <Text style={styles.backText}>‹</Text>
            </TouchableOpacity>


            {/* Caregiver */}
            <TouchableOpacity
                style={styles.roleContainer}
                onPress={() => navigation.navigate('Caregiver')}
                activeOpacity={0.8}
            >
                <View style={styles.imageCircle}>
                    <Image
                        source={require('../assets/caregiver.png')}
                        style={styles.roleImage}
                        resizeMode="contain"
                    />
                </View>
                <Text style={styles.roleText}>ผู้ดูแล</Text>
            </TouchableOpacity>

            {/* Elderly */}
            <TouchableOpacity
                style={styles.roleContainer}
                onPress={() => navigation.navigate('Elderly')}
                activeOpacity={0.8}
            >
                <View style={styles.imageCircle}>
                    <Image
                        source={require('../assets/elderly.png')}
                        style={styles.roleImage}
                        resizeMode="contain"
                    />
                </View>
                <Text style={styles.roleText}>ผู้สูงอายุ</Text>
            </TouchableOpacity>

        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    roleContainer: {
        alignItems: 'center',
        marginVertical: 30,
    },

    imageCircle: {
        width: 180,
        height: 180,
        borderRadius: 70,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },

    roleImage: {
        width: 120,
        height: 120,
    },

    roleText: {
        fontSize: 60,
        fontWeight: '500',
        color: '#000',
    },

    backBtn: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 10,
    },

    backText: {
        fontSize: 42,
        color: '#000',
    },

});
