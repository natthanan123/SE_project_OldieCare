import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from './screens/WelcomeScreen';
import SignUpScreen from './screens/SignUpScreen';
import LoginScreen from './screens/LoginScreen';
import SelectRoleScreen from './screens/SelectRoleScreen';
import CaregiverScreen from './screens/CaregiverScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false, // ซ่อน header ด้านบน
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SelectRole" component={SelectRoleScreen} />
        <Stack.Screen name="Caregiver" component={CaregiverScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
