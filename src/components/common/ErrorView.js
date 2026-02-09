// src/components/common/ErrorView.js
import { View, Text } from 'react-native';

export default function ErrorView({ message }) {
  return (
    <View>
      <Text>{message}</Text>
    </View>
  );
}