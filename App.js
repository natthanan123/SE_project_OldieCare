// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NurseStackNavigator from './src/navigation/NurseStackNavigator';

export default function App() {
  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: 'white' }}> 
      <NavigationContainer>
        {/* ตรงนี้ห้ามมี View มาครอบแล้วใส่ style บีบพื้นที่เด็ดขาด */}
        <NurseStackNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}