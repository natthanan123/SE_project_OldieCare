import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../theme/colors';
import { login } from '../api/client';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email) {
      Alert.alert('แจ้งเตือน', 'กรุณากรอกอีเมล');
      return;
    }

    try {
      setLoading(true);
      const response = await login(email.trim());

      if (response && response.success) {
        navigation.replace('MainTabs');
      } else {
        Alert.alert('ผิดพลาด', response?.message || 'ไม่พบอีเมลในระบบ');
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ ตรวจสอบ IP ใน config.js'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
  <KeyboardAvoidingView
  style={{ flex: 1 }}
  behavior={Platform.OS === 'ios' ? 'padding' : undefined}
>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <LinearGradient
          colors={[COLORS.primary, '#6CC8FF', '#9EDCFF']}
          style={styles.container}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentInsetAdjustmentBehavior="automatic"
          >
            <Image
              source={require('../../assets/login.png')}
              style={styles.topImage}
              resizeMode="contain"
            />

            <Text style={styles.title}>Relative Login</Text>

            <TextInput
              style={styles.input}
              placeholder="กรอกอีเมลญาติ"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'กำลังเข้าสู่ระบบ…' : 'ยืนยัน'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  topImage: {
    width: 220,
    height: 220,
    marginBottom: 20
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 12,
    color: '#fff'
  },
  input: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 25,
    padding: 15,
    fontSize: 18,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  button: {
    backgroundColor: COLORS.primary,
    width: '100%',
    padding: 18,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginBottom: 40
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff'
  }
});
