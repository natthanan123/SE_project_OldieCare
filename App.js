// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createStackNavigator } from '@react-navigation/stack';

// ✅ Import หน้า Login และ Navigator เดิมของคุณ
import LoginScreen from './src/screens/nurse/Login/LoginScreen'; 
import NurseStackNavigator from './src/navigation/NurseStackNavigator';

const RootStack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: 'white' }}> 
      <NavigationContainer>
        <RootStack.Navigator 
          initialRouteName="Login" // ✅ กำหนดให้หน้า Login ขึ้นก่อนเสมอ
          screenOptions={{ headerShown: false }}
        >
          {/* 1. หน้า Login */}
          <RootStack.Screen name="Login" component={LoginScreen} />

          {/* 2. หน้าหลักของพยาบาล (ที่รวม Tabs และหน้าย่อยอื่นๆ ไว้) */}
          <RootStack.Screen name="NurseMain" component={NurseStackNavigator} />
          
        </RootStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}