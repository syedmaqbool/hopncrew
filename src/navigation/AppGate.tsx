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

<<<<<<< HEAD
=======
  // After auth, land inside the app (Home). Ride selection is accessible from Home.
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
  return <RootNavigator initialRoute={auth ? 'App' : 'Login'} />;
}
