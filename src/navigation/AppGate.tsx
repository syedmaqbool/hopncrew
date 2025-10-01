// src/navigation/AppGate.tsx
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import RootNavigator from './RootNavigator';

export default function AppGate() {
  const { bootstrapped, auth } = useAuth();

  if (!bootstrapped) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return <RootNavigator initialRoute={auth ? 'App' : 'Login'} />;
}
