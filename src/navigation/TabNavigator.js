import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, ClipboardList, MessageSquare, Bell } from 'lucide-react-native';
import { COLORS } from '../theme/colors';

import HomeScreen from '../screens/HomeScreen';
import ReportScreen from '../screens/ReportScreen';
import ChatScreen from '../screens/ChatScreen';
import ChatDetailScreen from '../screens/ChatDetailScreen';
import AlertScreen from '../screens/AlertScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

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
        options={({ route }) => ({
          title: route.params?.name || 'รายละเอียด'
        })}
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
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'หน้าหลัก',
          tabBarIcon: ({ color }) => <Home color={color} />
        }}
      />

      <Tab.Screen
        name="Report"
        component={ReportScreen}
        options={{
          title: 'รายงาน',
          tabBarIcon: ({ color }) => <ClipboardList color={color} />
        }}
      />

      <Tab.Screen
        name="Chat"
        component={ChatStack}
        options={{
          title: 'แชท',
          tabBarIcon: ({ color }) => <MessageSquare color={color} />,
          headerShown: false
        }}
      />

      <Tab.Screen
        name="Alert"
        component={AlertScreen}
        options={{
          title: 'แจ้งเตือน',
          tabBarIcon: ({ color }) => <Bell color={color} />
        }}
      />
    </Tab.Navigator>
  );
}
