// src/screens/PaymentScreen.tsx
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

type Props = NativeStackScreenProps<RootStackParamList, 'Payment'>;

const MINT = '#B9FBE7';

export default function PaymentScreen({ navigation }: Props) {
  const [profile, setProfile] = useState<'personal' | 'business'>('personal');

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.roundBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={18} color="#111" />
        </Pressable>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 28 }}>
        {/* Section label pill */}
        <View style={styles.sectionPill}>
          <Text style={styles.sectionPillText}>Payment Methods</Text>
        </View>

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
          </View>
        </Pressable>

        {/* Ride Profiles */}
        <Text style={styles.blockTitle}>Ride Profiles</Text>
        <View style={styles.tilesWrap}>
          <ProfileTile
            title="Personal"
            active={profile === 'personal'}
            icon={<Ionicons name="person-circle-outline" size={26} color="#111" />}
            onPress={() => setProfile('personal')}
          />
          <ProfileTile
            title="Business"
            active={profile === 'business'}
            icon={<Ionicons name="briefcase-outline" size={24} color="#111" />}
            onPress={() => setProfile('business')}
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
}: {
  title: string;
  icon: React.ReactNode;
  onPress?: () => void;
}) {
  return (
    <Pressable style={styles.tile} onPress={onPress}>
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
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress?: () => void;
}) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
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
}: {
  title: string;
  icon: React.ReactNode;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.profileTile,
        active && { borderColor: '#111', backgroundColor: '#fff' },
      ]}
    >
      <View style={styles.profileIconWrap}>{icon}</View>
      <Text style={styles.profileText}>{title}</Text>
    </Pressable>
  );
}

/* ---------- styles ---------- */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F7F6F3' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 8,
    justifyContent: 'space-between',
  },
  roundBtn: {
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

  tile: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EDEDED',
  },
  tileIcon: {
    width: 48, height: 48, borderRadius: 12,
    backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center',
    marginBottom: 10,
  },
  tileText: { color: '#111', fontWeight: '700' },

  listCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
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
});
