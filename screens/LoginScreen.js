import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen({ navigation }) {
    return (
        <LinearGradient
            colors={['#FFF3B0', '#FFE082', '#FFD54F']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.container}
        >

            <Image
                source={require('../assets/login.png')}
                style={styles.topImage}
                resizeMode="contain"
            />

            {/* Title */}
            <Text style={styles.title}>Login</Text>

            {/* Email */}
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#555"
                keyboardType="email-address"
            />

            {/* Password */}
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#555"
                secureTextEntry
            />

            {/* Login Button */}
            <TouchableOpacity
                style={styles.button}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('SelectRole')}
            >
                <Text style={styles.buttonText}>ยืนยัน</Text>
            </TouchableOpacity>

            {/* Forgot Password */}
            <View style={styles.bottomRow}>
                <TouchableOpacity>
                    <Text style={[styles.linkText, { marginRight: 12 }]}>ลืมรหัส</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                    <Text style={[styles.linkText, styles.signupLink]}>ยังไม่มีบัญชี? Sign up</Text>
                </TouchableOpacity>
            </View>


        </LinearGradient>
    );
}

const styles = StyleSheet.create({

    topImage: {
        width: 400,
        height: 400,
        marginTop: 50,
        marginBottom: 20,
    },

    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: 24,
    },

    title: {
        fontSize: 60,
        fontWeight: '400',
        //marginTop: 0,
        marginBottom: 20,
    },

    input: {
        width: '90%',
        backgroundColor: '#FFF',
        borderRadius: 35,
        paddingVertical: 16,
        paddingHorizontal: 20,
        fontSize: 20,
        marginBottom: 14,

        borderWidth: 1,
        borderColor: '#000',
    },

    button: {
        backgroundColor: '#FFD54F',
        width: '40%',
        paddingVertical: 18,
        borderRadius: 40,
        alignItems: 'center',
        marginTop: 10,

        borderWidth: 1,
        borderColor: '#000',
    },

    buttonText: {
        fontSize: 22,
        fontWeight: '500',
    },

    forgotText: {
        marginTop: 16,
        fontSize: 18,
        textDecorationLine: 'underline',
    },

    signupText: {
        marginTop: 10,
        fontSize: 18,
        textDecorationLine: 'underline',
    },

    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '90%',
        marginTop: 16,
    },

    linkText: {
        fontSize: 16,
        color: '#1565C0',
        textDecorationLine: 'underline',
    },

    signupLink: {
        color: '#0D47A1',
        fontWeight: '500',
    },

});
