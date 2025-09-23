import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 👉 screens (replace placeholders with your actual ones)
import HomeScreen from '../screens/HomeScreen';
// You can add real screens later:
const Placeholder = ({ title }: { title: string }) => (
  <View style={{ flex: 1, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ color: '#fff', fontSize: 18 }}>{title}</Text>
  </View>
);

export type AppDrawerParamList = {
  Home: undefined;
  MyRides: undefined;
  Wallet: undefined;
  Payment: undefined;
  Loyalty: undefined;
  Notifications: undefined;
  HelpCenter: undefined;
  Settings: undefined;
};

const Drawer = createDrawerNavigator<AppDrawerParamList>();

export default function AppDrawer() {
  return (
    <Drawer.Navigator
    // sceneContainerStyle={{ backgroundColor: 'transparent' }}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',              // overlay over current screen
        overlayColor: 'rgba(0,0,0,0.2)',  // light dim on the main screen
        drawerStyle: {
          width: '78%',
          backgroundColor: '#0F0F0F',
        },
       
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      {/* <Drawer.Screen name="MyRides" component={() => <Placeholder title="My Rides" />} />
      <Drawer.Screen name="Wallet" component={() => <Placeholder title="Wallet" />} />
      <Drawer.Screen name="Payment" component={() => <Placeholder title="Payment Methods" />} />
      <Drawer.Screen name="Loyalty" component={() => <Placeholder title="Loyalty Program" />} />
      <Drawer.Screen name="Notifications" component={() => <Placeholder title="Notifications" />} />
      <Drawer.Screen name="HelpCenter" component={() => <Placeholder title="Help Center" />} />
      <Drawer.Screen name="Settings" component={() => <Placeholder title="Settings" />} /> */}
    </Drawer.Navigator>
  );
}

/* ---------------- Custom Drawer ---------------- */

function CustomDrawerContent(props: any) {
  const { navigation } = props;
  const insets = useSafeAreaInsets();

  const Row = ({
    icon,
    label,
    right,
    onPress,
  }: {
    icon: React.ReactNode;
    label: string;
    right?: React.ReactNode;
    onPress: () => void;
  }) => (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={styles.rowIcon}>{icon}</View>
      <Text style={styles.rowText}>{label}</Text>
      {!!right && <View style={{ marginLeft: 'auto' }}>{right}</View>}
    </Pressable>
  );

  return (
    <DrawerContentScrollView
      {...props}
      style={{ backgroundColor: '#0F0F0F' }}
      contentContainerStyle={{ paddingBottom: insets.bottom + 12 }}
    >
      {/* Profile */}
      <View style={{ paddingHorizontal: 16, paddingTop: insets.top + 8, paddingBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/100?img=5' }}
            style={{ width: 44, height: 44, borderRadius: 22 }}
          />
          <View>
            <Text style={styles.name}>Paula Lewis</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="star" size={12} color="#FFC400" />
              <Text style={styles.rating}>4.2</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Main items */}
      <View style={{ paddingHorizontal: 8 }}>
        <Row
          icon={<Ionicons name="home-outline" size={18} color="#fff" />}
          label="Home"
          onPress={() => navigation.navigate('Home')}
        />
        <Row
          icon={<Ionicons name="car-outline" size={18} color="#fff" />}
          label="My Rides"
          onPress={() => navigation.getParent()?.navigate('SaveFavorite')}
        />
        {/* navigation.dispatch(DrawerActions.toggleDrawer()); */}
        <Row
          icon={<Ionicons name="wallet-outline" size={18} color="#fff" />}
          label="Wallet"
          right={<Text style={styles.muted}>$345.20</Text>}
          onPress={() => navigation.navigate('Wallet')}
        />
        <Row
          icon={<Ionicons name="card-outline" size={18} color="#fff" />}
          label="Payment"
          onPress={() => navigation.navigate('Payment')}
        />
        <Row
          icon={<MaterialCommunityIcons name="crown-outline" size={18} color="#fff" />}
          label="Loyalty Program"
          onPress={() => navigation.navigate('Loyalty')}
        />
        <Row
          icon={<Ionicons name="notifications-outline" size={18} color="#fff" />}
          label="Notifications"
          onPress={() => navigation.navigate('Notifications')}
        />
        <Row
          icon={<Ionicons name="help-circle-outline" size={18} color="#fff" />}
          label="Help Center"
          onPress={() => navigation.navigate('HelpCenter')}
        />
        <Row
          icon={<Ionicons name="settings-outline" size={18} color="#fff" />}
          label="Settings"
          onPress={() => navigation.navigate('Settings')}
        />

        {/* Divider */}
        <View style={styles.hr} />

        {/* Secondary actions */}
        <Pressable style={styles.linkRow} onPress={() => { /* share / refer flow */ }}>
          <Text style={styles.link}>Refer a Friend</Text>
        </Pressable>
        <Pressable style={styles.linkRow} onPress={() => { /* share */ }}>
          <Text style={styles.link}>Share this App</Text>
        </Pressable>
        <Pressable style={styles.linkRow} onPress={() => { /* Store review */ }}>
          <Text style={styles.link}>Rate the App</Text>
        </Pressable>

        <Pressable style={styles.driverRow} onPress={() => { /* open driver onboarding */ }}>
          <Text style={styles.driverTxt}>Become a Driver</Text>
        </Pressable>

        {/* Social */}
        <View style={styles.socialRow}>
          <FontAwesome name="facebook" size={16} color="#bbb" />
          <FontAwesome name="linkedin" size={16} color="#bbb" />
          <FontAwesome name="instagram" size={16} color="#bbb" />
          <FontAwesome name="twitter" size={16} color="#bbb" />
        </View>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  name: { color: '#fff', fontWeight: '800', fontSize: 16 },
  rating: { color: '#bbb', fontWeight: '700', fontSize: 12 },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  rowIcon: {
    width: 34, height: 34, borderRadius: 17, marginRight: 10,
    backgroundColor: '#1B1B1B', alignItems: 'center', justifyContent: 'center',
  },
  rowText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  muted: { color: '#B4B4B4', fontWeight: '700' },

  hr: { height: 1, backgroundColor: '#222', marginVertical: 12, marginHorizontal: 8 },

  linkRow: { paddingVertical: 8, paddingHorizontal: 8 },
  link: { color: '#B4B4B4', fontSize: 14 },

  driverRow: { paddingVertical: 10, paddingHorizontal: 8 },
  driverTxt: { color: '#B9FBE7', fontSize: 14, fontWeight: '800' },

  socialRow: {
    marginTop: 14, flexDirection: 'row', gap: 14, paddingHorizontal: 8,
  },
});
