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
  TextStyle,
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
  medium: Platform.select({ ios: 'BiennaleMedium', android: 'BiennaleMedium' }),
  semibold: Platform.select({
    ios: 'BiennaleSemiBold',
    android: 'BiennaleSemiBold',
  }),
  bold: Platform.select({ ios: 'BiennaleBold', android: 'BiennaleBold' }),
};

// TypeScript-safe defaultProps helper
function setDefaultFont(component: any, fontFamily: string) {
  component.defaultProps = component.defaultProps || {};
  component.defaultProps.style = [component.defaultProps.style, { fontFamily }];
}

setDefaultFont(Text as any, FONTS.regular!);
setDefaultFont(TextInput as any, FONTS.regular!);
// ---------------------------------------------------------------

// Map fontWeight -> Biennale variants and strip weight from styles
const originalTextRender = (Text as any).render;
(Text as any).render = function render(...args: any[]) {
  const origin = originalTextRender.apply(this, args);
  const props = origin?.props || {};
  const flattened: TextStyle = StyleSheet.flatten(props.style) || {};

  // Normalize weight to a string number when possible
  const weightRaw: any = flattened.fontWeight as any;
  const weight =
    typeof weightRaw === 'number'
      ? String(weightRaw)
      : typeof weightRaw === 'string'
      ? weightRaw
      : undefined;

  let computedFamily = flattened.fontFamily as string | undefined;
  if (!computedFamily) {
    if (weight === '700' || weight === '800' || weight === '900' || weight === 'bold') {
      computedFamily = FONTS.bold || 'BiennaleBold';
    } else if (weight === '600') {
      computedFamily = FONTS.semibold || 'BiennaleSemiBold';
    } else if (weight === '500') {
      computedFamily = FONTS.medium || 'BiennaleMedium';
    } else {
      computedFamily = FONTS.regular || 'BiennaleRegular';
    }
  }

  // Remove fontWeight to avoid conflicts with custom family
  const { fontWeight, ...rest } = flattened as any;
  const nextStyle = [rest, { fontFamily: computedFamily }];

  return React.cloneElement(origin, {
    ...props,
    style: nextStyle,
  });
};

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
