/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View, ActivityIndicator } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from './src/context/AuthContext';

import AppDrawer from './src/navigation/AppDrawer';

import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import RNBootSplash from 'react-native-bootsplash';
import AppGate from './src/navigation/AppGate'; // uses useAuth *inside* component



function App() {
  const isDarkMode = useColorScheme() === 'dark';
 useEffect(() => {
    RNBootSplash.hide({ fade: true }); // hide after your app mounts (or after async init)
  }, []);
  return (
    // <NavigationContainer>
    //   <RootNavigator />
    // </NavigationContainer>

    <AuthProvider>
      <NavigationContainer>
        <AppGate />
      </NavigationContainer>
    </AuthProvider>


  );
}
export default App;
