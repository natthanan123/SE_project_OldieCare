// src/navigation/NurseTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

import NurseHomeScreen from '../screens/nurse/Home/NurseHomeScreen';
import SchedulesScreen from '../screens/nurse/Schedules/SchedulesScreen';
import MedsScreen from '../screens/nurse/Meds/MedsScreen';
import ChatScreen from '../screens/nurse/Chat/ChatScreen';
import ProfileScreen from '../screens/nurse/Profile/ProfileScreen';
import NurseTasksScreen from '../screens/nurse/Home/NurseTasksScreen';
import AddTaskScreen from '../screens/nurse/Schedules/AddTaskScreen';
// import AddMedScreen ออกไปไว้ใน Stack หลักแทน

const Tab = createBottomTabNavigator();

export default function NurseTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home-outline';
          else if (route.name === 'Schedules') iconName = 'calendar-outline';
          else if (route.name === 'Meds') iconName = 'medkit-outline';
          else if (route.name === 'Chat') iconName = 'chatbubble-outline';
          else if (route.name === 'Profile') iconName = 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        tabBarActiveTintColor: '#2FA4E7',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 88 : 65,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          paddingTop: 10,
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
        },
        tabBarItemStyle: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 2,
        },
      })}
    >
      <Tab.Screen name="Home" component={NurseHomeScreen} />
      <Tab.Screen name="Schedules" component={SchedulesScreen} />
      <Tab.Screen name="Meds" component={MedsScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />

      {/* หน้าที่ควรซ่อนไว้ใน Tab (เพื่อความสะดวกในการส่ง params จากหน้าที่มี Tab) */}
      <Tab.Screen
        name="NurseTasks"
        component={NurseTasksScreen}
        options={{ tabBarButton: () => null }}
      />
      
      <Tab.Screen
        name="AddTask"
        component={AddTaskScreen}
        options={{ tabBarButton: () => null }}
      />

      {/* แนะนำให้ย้าย AddMed ไปไว้ใน NurseStackNavigator เพื่อให้ซ่อน Tab Bar อัตโนมัติเมื่อเปิดหน้ากรอกข้อมูล */}
    </Tab.Navigator>
  );
}