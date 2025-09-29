/**
 * @format
 */
import 'react-native-get-random-values'
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// AppRegistry.registerComponent(appName, () => App);

AppRegistry.registerComponent(appName, () => () => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <App />
  </GestureHandlerRootView>
));
