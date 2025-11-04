/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

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
import assets from '../../assets';
import { FONTS } from './src/theme/fonts';

// pk.eyJ1IjoiYWlycG9ydC1saW1vMTIiLCJhIjoiY21oY3d3MW55MjNraTJscTN0YmJnZ3gzdCJ9.OJcjgZ3fYiZpkNu_ntdCoA

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
    RNBootSplash.hide({ fade: true }); // hide after your app mounts (or after async init)
  }, []);
  return (
    // <NavigationContainer>
    //   <RootNavigator />
    // </NavigationContainer>
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <AppGate />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
export default App;
