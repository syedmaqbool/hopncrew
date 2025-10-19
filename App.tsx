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
// ---------- GLOBAL FONT SETUP (runs before any render) ----------
const FONTS = {
  // If your font’s internal family is just "Biennale", change these to "Biennale"
  regular: Platform.select({
    ios: 'BiennaleRegular',
    android: 'BiennaleRegular',
  }),
  // Add these if you have the files; otherwise you can remove them where unused
  medium: Platform.select({ ios: 'BiennaleMedium', android: 'BiennaleMedium' }),
  bold: Platform.select({ ios: 'BiennaleBold', android: 'BiennaleBold' }),
};

// TypeScript-safe defaultProps helper
function setDefaultFont(component: any, fontFamily: string) {
  component.defaultProps = component.defaultProps || {};
  // Put previous styles first so icons/components that set their own fontFamily still win
  component.defaultProps.style = [component.defaultProps.style, { fontFamily }];
  // Optional: lock scaling off globally
  // component.defaultProps.allowFontScaling = false;
}

setDefaultFont(Text as any, FONTS.regular!);
setDefaultFont(TextInput as any, FONTS.regular!);
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

    <AuthProvider>
      <NavigationContainer>
        <AppGate />
      </NavigationContainer>
    </AuthProvider>
  );
}
export default App;
