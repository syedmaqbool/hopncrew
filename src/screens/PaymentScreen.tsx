// src/screens/PaymentScreen.tsx
<<<<<<< HEAD
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
=======
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { RootStackParamList } from '../navigation/types';
import assets from '../../assets';
import { FONTS } from '../../src/theme/fonts';
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)

type Props = NativeStackScreenProps<RootStackParamList, 'Payment'>;

const MINT = '#B9FBE7';
<<<<<<< HEAD

export default function PaymentScreen({ navigation }: Props) {
  const [profile, setProfile] = useState<'personal' | 'business'>('personal');

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.roundBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={18} color="#111" />
=======
const TEXT = '#111';
const BORDER = '#EFEFEF';
const BG_SOFT = '#F6F7F8';

export default function PaymentScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const isSmall = width < 360;
  const isTablet = width >= 768;

  const [profile, setProfile] = useState<'personal' | 'business'>('personal');

  const tilePaddingV = isSmall ? 16 : 22;
  const rowPaddingV = isSmall ? 12 : 14;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.roundBtn}
          onPress={() => navigation.goBack()}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={18} color={TEXT} />
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
        </Pressable>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 34 }} />
      </View>

<<<<<<< HEAD
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 28 }}>
        {/* Section label pill */}
=======
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 28,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Section pill */}
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
        <View style={styles.sectionPill}>
          <Text style={styles.sectionPillText}>Payment Methods</Text>
        </View>

<<<<<<< HEAD
        {/* Top tiles: Cash / Credit Cards */}
        <View style={styles.tilesWrap}>
          <MethodTile
            title="Cash"
            icon={<MaterialCommunityIcons name="cash-100" size={28} color="#111" />}
            onPress={() => {}}
          />
          <MethodTile
            title="Credit Cards"
            icon={<MaterialCommunityIcons name="credit-card-outline" size={28} color="#111" />}
            onPress={() => navigation.navigate('CreditCards')}


          />
        </View>

        {/* Google Pay / Apple Pay rows */}
        <View style={styles.listCard}>
          <PaymentRow
            icon={<AntDesign name="google" size={18} color="#111" />}
            title="Google Pay"
            subtitle="paula.lewis69@gmail.com"
            onPress={() => {navigation.navigate('GooglePay', { email: 'paula.lewis69@gmail.com' });}}
          />
          <View style={styles.divider} />
          <PaymentRow
            icon={<AntDesign name="apple1" size={18} color="#111" />}
            title="Apple Pay"
            subtitle="paula.lewis69@gmail.com"
            onPress={() => {{navigation.navigate('GooglePay', { email: 'paula.lewis69@gmail.com' });}}}
          />
        </View>

        {/* Add payment method CTA */}
        <Pressable style={styles.addBtn} onPress={() =>  navigation.navigate('AddPaymentMethod')}>
          <Text style={styles.addBtnText}>Add Payment Method</Text>
          <View style={styles.addBtnIcon}>
            <Ionicons name="add" size={18} color="#111" />
=======
        <View
          style={{
            backgroundColor: BG_SOFT,
            marginBottom: 12,
            paddingHorizontal: 16,
            paddingTop: 12,
            borderRadius: 24,
          }}
        >
          {/* Top tiles: Cash / Credit Cards */}
          <View style={styles.tilesWrap}>
            <MethodTile
              title="Cash"
              icon={
                <Image
                  source={assets.images.dollarIcon}
                  style={{ width: 40, height: 30, resizeMode: 'contain' }}
                />
              }
              onPress={() => {}}
              paddingV={tilePaddingV}
            />

            <MethodTile
              title="Credit Cards"
              icon={
                <MaterialCommunityIcons
                  name="credit-card-outline"
                  size={28}
                  color={TEXT}
                />
              }
              onPress={() => navigation.navigate('CreditCards')}
              paddingV={tilePaddingV}
            />
          </View>

          {/* Google Pay / Apple Pay */}
          <View style={styles.listCard}>
            <PaymentRow
              icon={<AntDesign name="google" size={18} color={TEXT} />}
              title="Google Pay"
              subtitle="paula.lewis69@gmail.com"
              onPress={() =>
                navigation.navigate('GooglePay', {
                  email: 'paula.lewis69@gmail.com',
                })
              }
              paddingV={rowPaddingV}
            />
            <View style={styles.divider} />
            <PaymentRow
              icon={<AntDesign name="apple1" size={18} color={TEXT} />}
              title="Apple Pay"
              subtitle="paula.lewis69@gmail.com"
              onPress={() =>
                navigation.navigate('ApplePay', {
                  email: 'paula.lewis69@gmail.com',
                })
              }
              paddingV={rowPaddingV}
            />
          </View>
        </View>

        {/* Add payment method CTA */}
        <Pressable
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddPaymentMethod')}
          accessibilityRole="button"
          hitSlop={8}
        >
          <Text style={styles.addBtnText}>Add Payment Method</Text>
          <View style={styles.addBtnIcon}>
            <Ionicons name="add" size={18} color={TEXT} />
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
          </View>
        </Pressable>

        {/* Ride Profiles */}
<<<<<<< HEAD
        <Text style={styles.blockTitle}>Ride Profiles</Text>
=======
        <Text style={[styles.blockTitle, isSmall && { marginBottom: 8 }]}>
          Ride Profiles
        </Text>

>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
        <View style={styles.tilesWrap}>
          <ProfileTile
            title="Personal"
            active={profile === 'personal'}
<<<<<<< HEAD
            icon={<Ionicons name="person-circle-outline" size={26} color="#111" />}
            onPress={() => setProfile('personal')}
=======
            icon={<Ionicons name="person-circle-outline" size={26} color={TEXT} />}
            onPress={() => setProfile('personal')}
            paddingV={isSmall ? 14 : 18}
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
          />
          <ProfileTile
            title="Business"
            active={profile === 'business'}
<<<<<<< HEAD
            icon={<Ionicons name="briefcase-outline" size={24} color="#111" />}
            onPress={() => setProfile('business')}
=======
            icon={<Ionicons name="briefcase-outline" size={24} color={TEXT} />}
            onPress={() => setProfile('business')}
            paddingV={isSmall ? 14 : 18}
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- small components ---------- */
function MethodTile({
  title,
  icon,
  onPress,
<<<<<<< HEAD
=======
  paddingV = 22,
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
}: {
  title: string;
  icon: React.ReactNode;
  onPress?: () => void;
<<<<<<< HEAD
}) {
  return (
    <Pressable style={styles.tile} onPress={onPress}>
=======
  paddingV?: number;
}) {
  return (
    <Pressable style={[styles.tile, { paddingVertical: paddingV }]} onPress={onPress}>
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
      <View style={styles.tileIcon}>{icon}</View>
      <Text style={styles.tileText}>{title}</Text>
    </Pressable>
  );
}

function PaymentRow({
  icon,
  title,
  subtitle,
  onPress,
<<<<<<< HEAD
=======
  paddingV = 14,
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress?: () => void;
<<<<<<< HEAD
}) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
=======
  paddingV?: number;
}) {
  return (
    <Pressable style={[styles.row, { paddingVertical: paddingV }]} onPress={onPress}>
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
      <View style={styles.rowIcon}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        {!!subtitle && <Text style={styles.rowSub}>{subtitle}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={18} color="#B6BAC0" />
    </Pressable>
  );
}

function ProfileTile({
  title,
  icon,
  active,
  onPress,
<<<<<<< HEAD
=======
  paddingV = 18,
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
}: {
  title: string;
  icon: React.ReactNode;
  active?: boolean;
  onPress?: () => void;
<<<<<<< HEAD
=======
  paddingV?: number;
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.profileTile,
<<<<<<< HEAD
        active && { borderColor: '#111', backgroundColor: '#fff' },
      ]}
=======
        { paddingVertical: paddingV },
        active && { borderColor: TEXT, backgroundColor: '#fff' },
      ]}
      accessibilityRole="button"
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
    >
      <View style={styles.profileIconWrap}>{icon}</View>
      <Text style={styles.profileText}>{title}</Text>
    </Pressable>
  );
}

/* ---------- styles ---------- */
const styles = StyleSheet.create({
<<<<<<< HEAD
  safe: { flex: 1, backgroundColor: '#F7F6F3' },
=======
  safe: { flex: 1, backgroundColor: '#FFF' },
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
<<<<<<< HEAD
    paddingTop: 6,
=======
    paddingTop: Platform.select({ ios: 6, android: 8 }),
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
    paddingBottom: 8,
    justifyContent: 'space-between',
  },
  roundBtn: {
<<<<<<< HEAD
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#EEE',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { color: '#111', fontWeight: '800', fontSize: 18 },

  sectionPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#111',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12,
  },
  sectionPillText: { color: '#fff', fontWeight: '800' },

  tilesWrap: { flexDirection: 'row', gap: 12, marginBottom: 14 },
=======
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { color: TEXT, fontSize: 18, fontFamily: FONTS.bold },

  sectionPill: {
    alignSelf: 'flex-start',
    backgroundColor: TEXT,
    borderTopLeftRadius: 23,
    borderTopRightRadius: 23,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    marginLeft: 8,
  },
  sectionPillText: { color: '#fff', fontFamily: FONTS.regular },

  tilesWrap: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)

  tile: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
<<<<<<< HEAD
    paddingVertical: 22,
=======
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EDEDED',
  },
  tileIcon: {
<<<<<<< HEAD
    width: 48, height: 48, borderRadius: 12,
    backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center',
    marginBottom: 10,
  },
  tileText: { color: '#111', fontWeight: '700' },
=======
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  tileText: { color: TEXT, fontFamily: FONTS.medium },
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)

  listCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
<<<<<<< HEAD
    borderColor: '#EFEFEF',
    overflow: 'hidden',
    marginBottom: 14,
  },
  divider: { height: 1, backgroundColor: '#EFEFEF' },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 12, paddingVertical: 14,
  },
  rowIcon: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: '#F5F6F7', alignItems: 'center', justifyContent: 'center',
  },
  rowTitle: { color: '#111', fontWeight: '800' },
  rowSub: { color: '#9AA0A6', fontSize: 12, marginTop: 2 },

  addBtn: {
    height: 50, borderRadius: 28, backgroundColor: '#111',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    marginBottom: 18,
  },
  addBtnText: { color: '#fff', fontWeight: '700' },
  addBtnIcon: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: MINT, alignItems: 'center', justifyContent: 'center',
  },

  blockTitle: { color: '#6C7075', fontWeight: '800', marginBottom: 10 },

  profileTile: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EDEDED',
    paddingVertical: 18,
    alignItems: 'center',
  },
  profileIconWrap: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
  },
  profileText: { color: '#111', fontWeight: '700' },
=======
    borderColor: BORDER,
    overflow: 'hidden',
    marginBottom: 14,
  },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: BORDER },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    marginBottom: 0,
  },
  rowIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F5F6F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: { color: TEXT, fontFamily: FONTS.bold },
  rowSub: { color: '#9AA0A6', fontSize: 12, marginTop: 2, fontFamily: FONTS.regular },

  addBtn: {
    height: 50,
    borderRadius: 28,
    backgroundColor: TEXT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 18,
  },
  addBtnText: { color: '#fff', fontFamily: FONTS.bold },
  addBtnIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: MINT,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
  },

  blockTitle: { color: TEXT, marginBottom: 10, fontFamily: FONTS.semibold },

  profileTile: {
    flex: 1,
    backgroundColor: BG_SOFT,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CFCDCD',
    alignItems: 'center',
  },
  profileIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  profileText: { color: TEXT, fontFamily: FONTS.bold },
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
});
