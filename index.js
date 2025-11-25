/**
 * @format
 */
import 'react-native-get-random-values'
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { v4 as uuidv4 } from 'uuid';

// 👇 minimal crypto shim for libs that expect crypto.randomUUID()
if (typeof global.crypto === 'undefined') {
  // @ts-ignore
  global.crypto = {};
}

// @ts-ignore
if (typeof global.crypto.randomUUID !== 'function') {
  // @ts-ignore
  global.crypto.randomUUID = uuidv4;
}

// AppRegistry.registerComponent(appName, () => App);

AppRegistry.registerComponent(appName, () => () => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <App />
  </GestureHandlerRootView>
));
