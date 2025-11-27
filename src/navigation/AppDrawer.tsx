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
import assets from '../../assets';

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
              <View style={styles.homeSearchBar}>
                <Image source={require('../../assets/icons/search-icon.png')} alt='search-icon' style={{width:24,height:24,position:'absolute',top:12,left:20}} />
                 <Text style={{ color: '#201E20000', fontFamily: FONTS.regular, fontSize: 16,position:'absolute',top:13,left:48 }}>
                              Where are you going?
                            </Text>
              </View>
              <View style={styles.homeRideCard}>
                <View style={styles.card}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <View>
                  <Image
                    source={assets.images.avatarMan}
                    style={{ width: 48, height: 48, borderRadius: 20,position:'absolute',top:-40 }}
                  />
                </View>
                <View>
                  <Text style={styles.cardTitle}>John</Text>
                  <Text style={styles.cardSub}>
                    Post on <Text style={styles.googleText}>Google</Text>
                  </Text>
                </View>
                <View>
                  <Image
                    source={assets.images.googleIcon}
                    style={{ width: 40, height: 40, borderRadius: 20 }}
                  />
                </View>
              </View>
              <Text numberOfLines={2} style={styles.cardBody}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit…
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  paddingHorizontal: 2,
                  marginTop: 10,
                  gap: 8,
                }}
              >
                <View style={styles.starsRow}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Image source={require('../../assets/icons/star-icon.png')} alt='star-icon' style={{width:20,height:20}} />
                    // <Ionicons
                    //   key={i}
                    //   name={i < p.stars ? 'star' : 'star-outline'}
                    //   size={14}
                    //   color="#FFC107"
                    // />
                  ))}
                </View>

                <Text style={styles.cardSubTwo}>15 November</Text>
              </View>
            </View>
              </View>
            </View>

            {/* menu button from home page */}
            <Pressable
              style={[styles.menuBtn, { top: 30 }]}
              onPress={() => navigation.closeDrawer()}
            >
              <Image
            source={assets.images.hamIcon}
            style={{ width: 44, height: 44, borderRadius: 20 }}
          />
              {/* <Ionicons name="menu" size={18} color="#111013" /> */}
            </Pressable>
            <Image source={require('../../assets/backgrounds/signin.png')} />
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  leftPane: {
    width: '65%',
    backgroundColor: '#111013',
  },
  rightPane: {
    width: '35%',
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
    height: '78%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  // two grey shadow layers behind
  shadowLayerBack: {
    position: 'absolute',
    top: 55,
    bottom: 55,
    right: 0,
    left: -10,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    // height:700,
    backgroundColor: '#FCFCFC',
    zIndex:4,
    opacity: .4
    // width:'99%'
  },
  shadowLayerMid: {
    position: 'absolute',
    top: 35,
    bottom: 35,
    right: 0,
    left: 0,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    // height:700,
    backgroundColor: '#FCFCFC',
    opacity: .4,
    zIndex:5
    // width:'99%'
  },

  // main white card that shows part of home screen
  homeCard: {
    position: 'absolute',
    top: 16,
    bottom: 16,
    right: 0,
    left: 10,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    zIndex:6
  },

  // top map area (just like in your screenshot)
  homeMapArea: {
    flex: 1,
    backgroundColor: '#F5EBDD', // warm map background
  },

  // bottom card area (search + ride block)
  homeBottomWrapper: {
    position: 'absolute',
    left: 20, // so only some of it shows in 22% width
    right: -60,
    bottom: 30,
    height: 250,
    // paddingHorizontal: 32,
    zIndex:99
  },
  homeSearchBar: {
    position:'relative',
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
    position:'relative',
    flex: 1,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    height: 76,
  },

  menuBtn: {
    position: 'absolute',
    right: 65,
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
    zIndex:99
  },

  card: {
    position:'absolute',
    marginTop: 20,
    width: 270,
    height: 106,
    padding: 18,
    marginRight: 12,
    borderRadius: 32,
    backgroundColor: '#fff',
    borderWidth: 0,
    borderColor: '#EFEFEF',
    elevation: 1,
    marginBottom: 16,
  },
  cardTitle: { color: '#201E20', fontFamily: FONTS.regular, fontSize: 16,position:'absolute',left:10,top:-25 },
  cardSub: { color: '#201E20', fontSize: 12, fontFamily: FONTS.regular, marginLeft:10 },
  cardSubTwo: { color: '#8D8E8F', fontSize: 13, fontFamily: FONTS.regular },
  cardBody: { marginTop: 10, color: '#444', fontFamily: FONTS.regular, fontSize: 14, paddingLeft:3 },
  starsRow: { flexDirection: 'row', gap: 4, marginTop: 0 },
  googleText: {
    color: '#1976D2',
    fontFamily: FONTS.regular,
    fontSize: 12,
  },
});
