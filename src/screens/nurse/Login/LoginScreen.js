import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Alert, KeyboardAvoidingView, Platform,
  TouchableWithoutFeedback, Keyboard, ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser } from '../../../services/apiClient'; 

export default function LoginScreen({ navigation }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert('แจ้งเตือน', 'กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    try {
      setLoading(true);
      const response = await loginUser({
        identifier: identifier.trim(),
        password: password
      });

      if (response && response.token) {
        // เก็บข้อมูลลงเครื่อง (ใช้ Key userId เป็นกลาง)
        await AsyncStorage.setItem('token', response.token);
        await AsyncStorage.setItem('userId', response.user._id);
        await AsyncStorage.setItem('nurseId', response.user._id); // เก็บเผื่อไว้สำหรับหน้า Nurse เดิม
        await AsyncStorage.setItem('userName', response.user.name);

        const role = response.user?.role;

        //  แยกหน้าตาม Role 
        if (role === 'nurse' || role === 'caregiver') {
          navigation.replace('NurseMain');
        } else if (role === 'relative') {
          navigation.replace('RelativeTabs'); // เตรียมหน้าไว้สำหรับญาติ
        } else if (role === 'elderly') {
          navigation.replace('ElderlyMain');  // เตรียมหน้าไว้สำหรับคนแก่
        } else if (role === 'admin') {
          navigation.replace('AdminTabs');
        } else {
          Alert.alert('Error', 'บทบาทผู้ใช้ไม่ถูกต้อง');
        }
      }
    } catch (error) {
      // ดึง Message จาก Server มาโชว์ ถ้าไม่มีให้ใช้ข้อความ Default
      const errorMsg = error.response?.data?.message || 'เชื่อมต่อล้มเหลว ตรวจสอบข้อมูลอีกครั้ง';
      Alert.alert('Login Failed', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <LinearGradient
          colors={['#6CD0FF', '#CCFBFF', '#FFFFFF']} 
          style={styles.container}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            
            <View style={styles.card}>
              <Text style={styles.title}>Login</Text>
              <Text style={styles.subtitle}>ยินดีต้อนรับเข้าสู่ระบบ OldieCare</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email or Username</Text>
                <TextInput
                  style={styles.input}
                  placeholder="กรอกชื่อผู้ใช้หรืออีเมล"
                  placeholderTextColor="#A1A1AA"
                  value={identifier}
                  onChangeText={setIdentifier}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="กรอกรหัสผ่าน"
                  placeholderTextColor="#A1A1AA"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity
                style={[styles.button, loading && { opacity: 0.7 }]}
                onPress={handleLogin}
                disabled={loading}
              >
                <LinearGradient
                  colors={['#6FC3F7', '#4A90E2']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>
                    {loading ? 'กำลังเข้าสู่ระบบ...' : 'SIGN IN'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <Text style={styles.footerText}>OldieCare v1.0.2</Text>

          </ScrollView>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

// ... styles คงเดิมตามที่คุณชอบ ...
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 25 },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 30, padding: 30,
    shadowColor: "#6FC3F7", shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2, shadowRadius: 20, elevation: 10,
  },
  title: { fontSize: 32, fontWeight: '800', color: '#3064AE', textAlign: 'center', marginBottom: 5 },
  subtitle: { fontSize: 15, color: '#64748B', textAlign: 'center', marginBottom: 30 },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '700', color: '#3064AE', marginBottom: 8, marginLeft: 5 },
  input: {
    backgroundColor: '#F8FAFC', borderRadius: 15, padding: 16,
    fontSize: 16, color: '#334155', borderWidth: 1.5, borderColor: '#E2E8F0',
  },
  button: { marginTop: 10, borderRadius: 15, overflow: 'hidden' },
  buttonGradient: { padding: 18, alignItems: 'center' },
  buttonText: { fontSize: 16, fontWeight: '800', color: '#FFF', letterSpacing: 1.2 },
  footerText: { textAlign: 'center', color: '#3064AE', marginTop: 30, fontSize: 12, opacity: 0.6 }
});