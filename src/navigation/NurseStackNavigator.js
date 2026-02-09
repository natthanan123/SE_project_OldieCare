import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NurseTabNavigator from './NurseTabNavigator'; 

// 1. Import หน้าต่างๆ เข้ามาให้ครบถ้วน
import CareReportScreen from '../screens/nurse/QuickActions/CareReportScreen';
import ChatDetailScreen from '../screens/nurse/Chat/ChatDetailScreen';
import AddMedScreen from '../screens/nurse/Meds/AddMedScreen';
import AddTaskScreen from '../screens/nurse/Schedules/AddTaskScreen';
import EmergencyScreen from '../screens/nurse/QuickActions/EmergencyScreen';
import MealsScreen from '../screens/nurse/QuickActions/Meals/MealsScreen';
//import TDEECalculatorScreen from '../screens/nurse/QuickActions/TDEECalculatorScreen';
import QuickCalculateScreen from '../screens/nurse/QuickActions/QuickCalculateScreen';

// ต้องเพิ่มบรรทัดนี้เพื่อแก้ ReferenceError
import TDEECalculatorScreen from '../screens/nurse/QuickActions/TDEECalculatorScreen'; 

const Stack = createStackNavigator();

export default function NurseStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={NurseTabNavigator} />

      <Stack.Screen 
        name="CareReport" 
        component={CareReportScreen} 
        options={{ headerShown: false }} 
      />

      <Stack.Screen name="ChatDetail" component={ChatDetailScreen} />
      <Stack.Screen name="AddMed" component={AddMedScreen} />
      <Stack.Screen name="AddTask" component={AddTaskScreen} />
      <Stack.Screen name="Emergency" component={EmergencyScreen} />
      <Stack.Screen name="Meals" component={MealsScreen} />
      
      {/* ตอนนี้ TDEECalculatorScreen ถูก Import มาแล้ว จะไม่ error */}
      <Stack.Screen name="TDEECalculator" component={TDEECalculatorScreen} />
      <Stack.Screen name="QuickCalculate" component={QuickCalculateScreen} />
    </Stack.Navigator>
  );
}