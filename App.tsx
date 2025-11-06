/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

<<<<<<< HEAD
import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View, ActivityIndicator } from 'react-native';
=======
if (__DEV__) {
  require('./src/services/reactotronConfig');
  require('./src/services/axios-tron');
}

import { NewAppScreen } from '@react-native/new-app-screen';
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  Text,
  TextInput,
  Platform,
  View,
  ActivityIndicator,
} from 'react-native';
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
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
<<<<<<< HEAD



function App() {
  const isDarkMode = useColorScheme() === 'dark';
 useEffect(() => {
=======
// import assets from '../../assets';
import { FONTS } from './src/theme/fonts';

// TypeScript-safe defaultProps helper
function setDefaultFont(component: any, fontFamily: string) {
  component.defaultProps = component.defaultProps || {};
  component.defaultProps.style = [{ fontFamily }, component.defaultProps.style];
}

setDefaultFont(Text as any, FONTS.regular);
setDefaultFont(TextInput as any, FONTS.regular);
// ---------------------------------------------------------------

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  useEffect(() => {
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
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
<<<<<<< HEAD


=======
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
  );
}
export default App;
