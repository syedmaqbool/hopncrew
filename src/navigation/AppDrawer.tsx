import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Animated,
} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import HomeScreen from '../screens/HomeScreen';
import { FONTS } from '../theme/fonts';

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
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        overlayColor: 'transparent',
        drawerStyle: {
          width: '100%',
          backgroundColor: 'transparent',
        },
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
    </Drawer.Navigator>
  );
}

/* ---------------- Custom Drawer ---------------- */

function CustomDrawerContent(props: any) {
  const { auth, signOut } = useAuth();
  const { navigation } = props;
  const insets = useSafeAreaInsets();

  const name = auth?.user
    ? `${auth.user.first_name ?? ''} ${auth.user.last_name ?? ''}`.trim() ||
      auth.user.email
    : 'Guest';

  // animation for right 3-layer stack
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const openSub = navigation.addListener('drawerOpen', () => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 320,
        useNativeDriver: true,
      }).start();
    });

    const closeSub = navigation.addListener('drawerClose', () => {
      Animated.timing(anim, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }).start();
    });

    Animated.timing(anim, {
      toValue: 1,
      duration: 320,
      useNativeDriver: true,
    }).start();

    return () => {
      openSub?.();
      closeSub?.();
    };
  }, [anim, navigation]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  const scale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 1],
  });

  const opacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const Row = ({
    icon,
    label,
    right,
    text,
    onPress,
  }: {
    icon: React.ReactNode;
    label: string;
    right?: React.ReactNode;
    text?: string;
    onPress: () => void;
  }) => (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={styles.rowIcon}>{icon}</View>
      <Text style={styles.rowText}>
        {label}
        {text ? ` (${text})` : ''}
      </Text>
      {!!right && <View style={{ marginLeft: 'auto' }}>{right}</View>}
    </Pressable>
  );

  return (
    // full dark sheet behind everything
    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#111013' }}>
      {/* LEFT: sidebar (78%) */}
      <View style={styles.leftPane}>
        <DrawerContentScrollView
          {...props}
          style={{ backgroundColor: '#111013' }}
          contentContainerStyle={{
            paddingBottom: 20,
            paddingTop: insets.top + 10,
          }}
        >
          {/* Profile */}
          <View style={{ paddingHorizontal: 10, paddingBottom: 4 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Pressable
                style={styles.avatarWrapper}
                onPress={() => {
                  navigation.navigate('EditProfile', {
                    initial: {
                      name: 'Maqbool',
                      email: 'maqbool@urapptech.com',
                      dial: '+1',
                      phone: '1234567890',
                      whatsappSame: true,
                      referral: '456789',
                      avatarUrl: '',
                    },
                    onSave: () => {},
                  });
                }}
              >
                <Image
                  source={{
                    uri: auth?.user?.profile_picture
                      ? auth.user.profile_picture
                      : 'https://www.gravatar.com/avatar?d=mp',
                  }}
                  style={styles.avatar}
                />
              </Pressable>

              <View>
                <Text style={styles.name}>{name}</Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={14} color="#FFDC4A" />
                  <Text style={styles.rating}>4.2</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Main items */}
          <View style={{ paddingHorizontal: 18, paddingTop: 20 }}>
            <Row
              icon={
                <Image
                  source={require('../../assets/icons/sidebar-home-icon.png')}
                  style={styles.menuIconImg}
                />
              }
              label="Home"
              onPress={() => {
                navigation.closeDrawer();
                navigation.getParent()?.navigate('RideSelection');
              }}
            />
            <Row
              icon={
                <Image
                  source={require('../../assets/icons/sidebar-rides-icon.png')}
                  style={styles.menuIconImg}
                />
              }
              label="My Rides"
              onPress={() => navigation.getParent()?.navigate('MyRides')}
            />
            <Row
              icon={
                <Image
                  source={require('../../assets/icons/sidebar-wallet-icon.png')}
                  style={styles.menuIconImg}
                />
              }
              label="Wallet"
              text="$345.20"
              onPress={() => navigation.navigate('Wallet')}
            />
            <Row
              icon={
                <Image
                  source={require('../../assets/icons/sidebar-pay-icon.png')}
                  style={styles.menuIconImg}
                />
              }
              label="Payment"
              onPress={() => navigation.navigate('Payment')}
            />
            <Row
              icon={
                <Image
                  source={require('../../assets/icons/sidebar-loyal-icon.png')}
                  style={styles.menuIconImg}
                />
              }
              label="Loyalty Program"
              onPress={() =>
                navigation.navigate('RideDetails', {
                  ride: {
                    id: 'item.id',
                    status: 'Upcoming',
                    whenLabel: 'Today, 5:19 PM',
                    from: 'Toronto Pearson Airport - T 1',
                    to: 'Hamill Avenue San Diego, CA 929',
                    distanceKm: 12.5,
                    timeLabel: '30 - 40 min',
                    fare: 256,
                    driver: {
                      name: 'Jonas',
                      rating: 4.2,
                      carPlate: 'ERS 8579',
                      carModel: 'Toyota Camry',
                    },
                  },
                  onCancel: (id: string) => console.log('cancel ride', id),
                })
              }
            />
            <Row
              icon={
                <Image
                  source={require('../../assets/icons/sidebar-notify-icon.png')}
                  style={styles.menuIconImg}
                />
              }
              label="Notifications"
              onPress={() => navigation.navigate('Notifications')}
            />
            <Row
              icon={
                <Image
                  source={require('../../assets/icons/sidebar-help-icon.png')}
                  style={styles.menuIconImg}
                />
              }
              label="Help Center"
              onPress={() => navigation.navigate('HelpCenter')}
            />
            <Row
              icon={
                <Image
                  source={require('../../assets/icons/sidebar-setting-icon.png')}
                  style={styles.menuIconImg}
                />
              }
              label="Settings"
              onPress={() => navigation.navigate('Settings')}
            />

            {/* Divider */}
            <View style={styles.hr} />

            {/* Secondary */}
            <Pressable
              style={styles.linkRow}
              onPress={async () => {
                await signOut();
                navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
              }}
            >
              <Text style={styles.link}>Logout</Text>
            </Pressable>
            <Pressable style={styles.linkRow}>
              <Text style={styles.link}>Refer a Friend</Text>
            </Pressable>
            <Pressable style={styles.linkRow}>
              <Text style={styles.link}>Share this App</Text>
            </Pressable>
            <Pressable style={styles.linkRow}>
              <Text style={styles.link}>Rate the App</Text>
            </Pressable>

            <Pressable style={styles.driverRow}>
              <Text style={styles.driverTxt}>Become a Driver</Text>
            </Pressable>

            {/* Social */}
            <View style={styles.socialRow}>
              <Image
                source={require('../../assets/icons/fb-bg-icon.png')}
                style={styles.socialIcon}
              />
              <Image
                source={require('../../assets/icons/linke-bg-icon.png')}
                style={styles.socialIcon}
              />
              <Image
                source={require('../../assets/icons/insta-bg-icon.png')}
                style={styles.socialIcon}
              />
              <Image
                source={require('../../assets/icons/twitter-bg-icon.png')}
                style={styles.socialIcon}
              />
            </View>
          </View>
        </DrawerContentScrollView>
      </View>

      {/* RIGHT: 22% – 3 stacked layers with side home view */}
      <View style={styles.rightPane}>
        <Animated.View
          style={[
            styles.previewWrapper,
            {
              opacity,
              transform: [{ translateX }, { scale }],
            },
          ]}
        >
          {/* back grey layer */}
          <View style={styles.shadowLayerBack} />
          {/* middle grey layer */}
          <View style={styles.shadowLayerMid} />
          {/* top white card with home preview */}
          <View style={styles.homeCard}>
            {/* map-ish area */}
            <View style={styles.homeMapArea} />

            {/* bottom card (search + ride) */}
            <View style={styles.homeBottomWrapper}>
              <View style={styles.homeSearchBar} />
              <View style={styles.homeRideCard} />
            </View>

            {/* menu button from home page */}
            <Pressable
              style={[styles.menuBtn, { top: insets.top + 18 }]}
              onPress={() => navigation.closeDrawer()}
            >
              <Ionicons name="menu" size={18} color="#111013" />
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  leftPane: {
    width: '78%',
    backgroundColor: '#111013',
  },
  rightPane: {
    width: '22%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  // profile
  avatarWrapper: { padding: 4 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  name: {
    color: '#FCFCFC',
    fontFamily: FONTS.semibold,
    fontSize: 22,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    columnGap: 6,
  },
  rating: {
    color: '#FCFCFC',
    fontFamily: FONTS.regular,
    fontSize: 14,
  },

  // menu rows
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  rowIcon: {
    width: 30,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIconImg: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  rowText: {
    color: '#FCFCFC',
    fontSize: 18,
    fontFamily: FONTS.regular,
  },
  hr: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#3F3C3C',
    marginTop: 24,
    marginBottom: 10,
    marginLeft: 46,
  },

  linkRow: { paddingVertical: 6 },
  link: {
    color: '#B4B4B4',
    fontSize: 16,
    fontFamily: FONTS.regular,
    lineHeight: 22,
  },
  driverRow: { paddingVertical: 10 },
  driverTxt: {
    color: '#FFDC4A',
    fontSize: 16,
    fontFamily: FONTS.regular,
  },

  socialRow: {
    marginTop: 18,
    flexDirection: 'row',
    gap: 14,
  },
  socialIcon: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
  },

  // right stack
  previewWrapper: {
    width: '100%',
    height: '92%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  // two grey shadow layers behind
  shadowLayerBack: {
    position: 'absolute',
    top: 40,
    bottom: 40,
    right: 0,
    left: 30,
    borderTopLeftRadius: 40,
    borderBottomLeftRadius: 40,
    backgroundColor: '#3E3D41',
    opacity: 0.9,
  },
  shadowLayerMid: {
    position: 'absolute',
    top: 28,
    bottom: 28,
    right: -10,
    left: 20,
    borderTopLeftRadius: 40,
    borderBottomLeftRadius: 40,
    backgroundColor: '#66656A',
    opacity: 0.9,
  },

  // main white card that shows part of home screen
  homeCard: {
    position: 'absolute',
    top: 16,
    bottom: 16,
    right: -20,
    left: 10,
    borderTopLeftRadius: 40,
    borderBottomLeftRadius: 40,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },

  // top map area (just like in your screenshot)
  homeMapArea: {
    flex: 1,
    backgroundColor: '#F5EBDD', // warm map background
  },

  // bottom card area (search + ride block)
  homeBottomWrapper: {
    position: 'absolute',
    left: -40, // so only some of it shows in 22% width
    right: 40,
    bottom: -16,
    height: 170,
    paddingHorizontal: 32,
  },
  homeSearchBar: {
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FFFFFF',
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  homeRideCard: {
    flex: 1,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  menuBtn: {
    position: 'absolute',
    right: 22,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
});
