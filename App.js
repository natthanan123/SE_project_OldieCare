import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ElderlyScreen from './ElderlyMobileApp/ElderlyScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Elderly"
        screenOptions={{
          headerShown: false, // ซ่อน header ด้านบน
        }}
      >
        <Stack.Screen name="Elderly" component={ElderlyScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
