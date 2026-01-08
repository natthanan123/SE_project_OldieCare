import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
} from 'react-native';

export default function WelcomeScreen({ navigation }) {
    return (
        <LinearGradient
            colors={['#FFF3B0', '#FFE082', '#FFD54F']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.container}
        >

            {/* Logo / App Name */}
            <View style={styles.logoContainer}>
                <Text style={styles.logoText}>Oldie Care</Text>
            </View>

            {/* Illustration */}
            <Image
                source={require('../assets/welcome1.png')}
                style={styles.image}
                resizeMode="contain"
            />

            {/* Welcome Text */}
            <Text style={styles.welcomeText}>Welcome</Text>

            {/* Buttons */}
            <TouchableOpacity 
                style={styles.button}
                onPress={() => navigation.navigate('Login')}
                >
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.button}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('SignUp')}
                >
                <Text style={styles.buttonText}>Sign up</Text>
            </TouchableOpacity>

            <TouchableOpacity>
                <Text style={styles.forgotText}>ลืมรหัส</Text>
            </TouchableOpacity>

        </LinearGradient>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFE9A0',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },

    logoContainer: {
        backgroundColor: '#FFD54F',
        paddingHorizontal: 28,
        paddingVertical: 10,
        borderRadius: 40,
        marginBottom: 20,
    },

    logoText: {
        fontSize: 75,
        fontWeight: '400',
        color: '#000',
    },

    image: {
        width: 320,
        height: 320,
        marginBottom: 20,
    },

    welcomeText: {
        fontSize: 60,
        fontWeight: '350',
        marginBottom: 20,
    },

    button: {
        backgroundColor: '#FFD54F',
        width: '60%',
        paddingVertical: 18,
        borderRadius: 35,
        alignItems: 'center',
        marginBottom: 12,


        borderWidth: 1,
        borderColor: '#000',
    },

    buttonText: {
        fontSize: 35,
        fontWeight: '350',
    },

    forgotText: {
        marginTop: 10,
        fontSize: 30,
        textDecorationLine: 'underline',
    },
});
