import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // เพิ่มตัวนี้
import { Home, ClipboardList, MessageSquare, Bell } from 'lucide-react-native';
import { COLORS } from '../theme';

import HomeScreen from '../screens/HomeScreen';
import ReportScreen from '../screens/ReportScreen';
import ChatScreen from '../screens/ChatScreen';
import ChatDetailScreen from '../screens/ChatDetailScreen'; // หน้าคุยที่คุณจะสร้าง
import AlertScreen from '../screens/AlertScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// สร้าง Stack สำหรับ Chat โดยเฉพาะ
function ChatStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen 
        name="ChatList" 
        component={ChatScreen} 
        options={{ title: 'ข้อความ' }} 
      />
      <Stack.Screen 
        name="ChatDetail" 
        component={ChatDetailScreen} 
        options={({ route }) => ({ title: route.params.name })} 
      />
    </Stack.Navigator>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator 
      screenOptions={{ 
        tabBarActiveTintColor: COLORS.primary,
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: '#fff',
      }}
    >
      <Tab.Screen name="หน้าหลัก" component={HomeScreen} options={{ tabBarIcon: ({color}) => <Home color={color}/> }} />
      <Tab.Screen name="รายงาน" component={ReportScreen} options={{ tabBarIcon: ({color}) => <ClipboardList color={color}/> }} />
      
      {/* เปลี่ยนจาก ChatScreen ปกติ เป็น ChatStack */}
      <Tab.Screen 
        name="แชท" 
        component={ChatStack} 
        options={{ 
          tabBarIcon: ({color}) => <MessageSquare color={color}/>,
          headerShown: false // ปิด header ของ tab เพราะเราใช้ header ของ stack แทน
        }} 
      />
      
      <Tab.Screen name="แจ้งเตือน" component={AlertScreen} options={{ tabBarIcon: ({color}) => <Bell color={color}/> }} />
    </Tab.Navigator>
  );
}