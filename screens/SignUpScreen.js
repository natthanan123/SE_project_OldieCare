import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function SignUpScreen({ navigation }) {
    return (
        <LinearGradient
            colors={['#FFF3B0', '#FFE082', '#FFD54F']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.container}
        >

            {/* Title */}
            <View style={styles.titleContainer}>
                <Text style={styles.title}>ลงทะเบียน</Text>
            </View>


            {/* Input Fields */}
            <TextInput
                style={styles.input}
                placeholder="Full name"
                placeholderTextColor="#555"
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#555"
                keyboardType="email-address"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#555"
                secureTextEntry
            />

            <TextInput
                style={styles.input}
                placeholder="Confirm password"
                placeholderTextColor="#555"
                secureTextEntry
            />

            {/* Sign up Button */}
            <TouchableOpacity
                style={styles.button}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('Welcome')}
            >
                <Text style={styles.buttonText}>ยืนยัน</Text>
            </TouchableOpacity>

            {/* Back to Login */}
            <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
            >
                <Text style={styles.loginText}>
                    มีบัญชีอยู่แล้ว? Login
                </Text>
            </TouchableOpacity>

        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },

    title: {
        fontSize: 48,
        fontWeight: '500',
        marginBottom: 25,
    },

    titleContainer: {
        backgroundColor: '#FFD54F',
        paddingHorizontal: 28,
        paddingVertical: 10,
        borderRadius: 28,

        position: 'absolute',
        top: 100,
    },


    input: {
        width: '90%',
        backgroundColor: '#FFF',
        borderRadius: 35,
        paddingVertical: 16,
        paddingHorizontal: 40,
        fontSize: 25,
        marginBottom: 20,

        borderWidth: 1,
        borderColor: '#000',
    },

    button: {
        backgroundColor: '#FFD54F',
        width: '55%',
        paddingVertical: 18,
        borderRadius: 40,
        alignItems: 'center',
        marginTop: 10,

        borderWidth: 1,
        borderColor: '#000',
    },

    buttonText: {
        fontSize: 30,
        fontWeight: '500',
    },

    loginText: {
        marginTop: 20,
        fontSize: 20,
        textDecorationLine: 'underline',
    },
});
