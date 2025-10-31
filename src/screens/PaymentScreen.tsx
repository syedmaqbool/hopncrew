// src/screens/PaymentScreen.tsx
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { RootStackParamList } from '../navigation/types';
import assets from '../../assets';

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

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 28, }}>
        {/* Section label pill */}
        <View style={styles.sectionPill}>
          <Text style={styles.sectionPillText}>Payment Methods</Text>
        </View>
        <View style={{ backgroundColor: '#efefef', marginBottom: 12, paddingHorizontal: 16, paddingTop: 12, borderRadius: 24, }}>
          {/* Top tiles: Cash / Credit Cards */}
          <View style={styles.tilesWrap}>
            <MethodTile
              title="Cash"
              icon={<Image
                source={assets.images.dollarIcon}// <-- **Direct require with correct path**
                style={{ width: '40', height: '30', resizeMode: 'contain', maxWidth: '100%' }}
              />
              }
              onPress={() => { }}
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
              onPress={() => { navigation.navigate('GooglePay', { email: 'paula.lewis69@gmail.com' }); }}
            />
            <View style={styles.divider} />
            <PaymentRow
              icon={<AntDesign name="apple1" size={18} color="#111" />}
              title="Apple Pay"
              subtitle="paula.lewis69@gmail.com"
              onPress={() => { { navigation.navigate('GooglePay', { email: 'paula.lewis69@gmail.com' }); } }}
            />
          </View>
        </View>


        {/* Add payment method CTA */}
        <Pressable style={styles.addBtn} onPress={() => navigation.navigate('AddPaymentMethod')}>
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
  safe: { flex: 1, backgroundColor: '#FFF' },

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
  headerTitle: { color: '#111', fontSize: 18, fontFamily: 'BiennaleBold' },

  sectionPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#111',
    borderTopLeftRadius: 23,
    borderTopRightRadius: 23,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 0,
    marginLeft: 15,
  },
  sectionPillText: { color: '#fff', fontFamily: 'BiennaleRegular' },

  tilesWrap: { flexDirection: 'row', gap: 12, marginBottom: 14,  },

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
  tileText: { color: '#111', fontFamily: 'BiennaleMedium' },

  listCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    overflow: 'hidden',
    marginBottom: 14,
  },
  divider: { height: 7, backgroundColor: '#EFEFEF' },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 12, paddingVertical: 14, marginBottom: 2,
  },
  rowIcon: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: '#F5F6F7', alignItems: 'center', justifyContent: 'center',
  },
  rowTitle: { color: '#111', fontFamily: 'BiennaleBold' },
  rowSub: { color: '#9AA0A6', fontSize: 12, marginTop: 2 },

  addBtn: {
    height: 50, borderRadius: 28, backgroundColor: '#111',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    marginBottom: 18,
  },
  addBtnText: { color: '#fff', fontFamily: 'BiennaleBold' },
  addBtnIcon: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: MINT, alignItems: 'center', justifyContent: 'center', position: 'absolute', right: 10,
  },

  blockTitle: { color: '#111', marginBottom: 10, fontFamily: 'BiennaleSemiBold' },

  profileTile: {
    flex: 1,
    backgroundColor: '#efefef',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CFCDCD',
    paddingVertical: 18,
    alignItems: 'center',
  },
  profileIconWrap: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
  },
  profileText: { color: '#111', fontFamily: 'BiennaleBold' },
});
