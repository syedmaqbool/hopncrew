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

type Props = NativeStackScreenProps<RootStackParamList, 'Payment'>;

const TEXT = '#201E20';
const BORDER = '#EFEFEF';
const BG_SOFT = '#F6F7F8';
const MINT = '#B9FBE7';

export default function PaymentScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const isSmall = width < 360;

  const [profile, setProfile] = useState<'personal' | 'business'>('personal');

  const openMenu = () => navigation.goBack();

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      {/* MAP / BACKGROUND */}
      <Image
        source={assets.images.mapBg || require('../../assets/backgrounds/signin.png')}
        style={styles.mapBg}
        resizeMode="cover"
      />

      <SafeAreaView style={{ flex: 1 }}>
        {/* HEADER */}
        <View style={styles.header}>
          <Pressable style={styles.menuBtn} onPress={openMenu}>
            <Image
              source={assets.images.hamIcon}
              style={{ width: 48, height: 48, borderRadius: 24 }}
            />
          </Pressable>

          <Text style={styles.headerTitle}>Payment</Text>
        </View>

        {/* WHITE PANEL */}
        <View style={styles.contentPanel}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 32 }}
          >
            {/* PAYMENT METHODS CARD + TAB */}
            <View style={styles.methodsWrapper}>
              <View style={styles.methodsCard}>
                {/* top tiles */}
                <View style={styles.tilesWrap}>
                  <MethodTile
                    title="Cash"
                    icon={
                      <Image source={require('../../assets/icons/pay-cash-icon.png')} alt='pay-cash' style={{height:24,width:40}} />
                      
                    }
                    onPress={() => navigation.navigate('PaymentCash')}
                  />
                  <MethodTile
                    title="Credit Cards"
                    icon={
                      <Image source={require('../../assets/icons/pay-card-icon.png')} alt='pay-cash' style={{height:27,width:40}} />
                    }
                    onPress={() => navigation.navigate('PaymentCredit')}
                  />
                </View>

                {/* Google Pay / Apple Pay */}
                <View style={styles.listCard}>
                  <PaymentRow
                    icon={
                      <Image source={require('../../assets/icons/gpay-icon.png')} alt='pay-cash' style={{height:22,width:22}} />
                    }
                    title="Google Pay"
                    subtitle="paula.lewis69@gmail.com"
                    onPress={() => navigation.navigate('PaymentGoogle')}
                  />
                  <View style={styles.divider} />
                  <PaymentRow
                    icon={
                      <Image source={require('../../assets/icons/apay-icon.png')} alt='pay-cash' style={{height:27,width:22}} />
                    }
                    title="Apple Pay"
                    subtitle="paula.lewis69@gmail.com"
                    onPress={() => navigation.navigate('PaymentApple')}
                  />
                </View>
              </View>

              {/* Black tab overlapping */}
              <View style={styles.sectionPill}>
                <Text style={styles.sectionPillText}>Payment Methods</Text>
              </View>
            </View>

            {/* Add payment method CTA */}
            <Pressable
              style={styles.addBtn}
              onPress={() => navigation.navigate('AddPaymentMethod')}
            >
              <Text style={styles.addBtnText}>Add Payment Method</Text>
              <View style={styles.addBtnIcon}>
                <Ionicons name="add" size={28} color={TEXT} />
              </View>
            </Pressable>

            {/* Ride Profiles */}
            <Text
              style={[
                styles.blockTitle,
                isSmall && { marginTop: 20, marginBottom: 12 },
              ]}
            >
              Ride Profiles
            </Text>

            <View style={styles.profileRow}>
              <ProfileTile
                title="Personal"
                // active={profile === 'personal'}
                icon={
                      <Image source={require('../../assets/icons/pay-person-icon.png')} alt='pay-cash' style={{height:28,width:26}} />
                }
                onPress={() => navigation.navigate('PaymentPersonal')}
              />
              <ProfileTile
                title="Business"
                // active={profile === 'business'}
                icon={
                      <Image source={require('../../assets/icons/pay-business-icon.png')} alt='pay-cash' style={{height:22,width:23}} />
                }
                onPress={() => navigation.navigate('PaymentBusinessScreen')}
              />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
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
  if (onPress) {
    return (
      <Pressable style={styles.tile} onPress={onPress}>
        <View style={styles.tileIcon}>{icon}</View>
        <Text style={styles.tileText}>{title}</Text>
      </Pressable>
    );
  }
  return (
    <View style={styles.tile}>
      <View style={styles.tileIcon}>{icon}</View>
      <Text style={styles.tileText}>{title}</Text>
    </View>
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
    <Pressable onPress={onPress}>
    <View style={styles.row}>
      <View style={styles.rowIcon}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        {!!subtitle && <Text style={styles.rowSub}>{subtitle}</Text>}
      </View>
    </View>
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
        active && { borderColor: TEXT, backgroundColor: '#FFFFFF' },
      ]}
    >
      <View style={styles.profileIconWrap}>{icon}</View>
      <Text style={styles.profileText}>{title}</Text>
    </Pressable>
  );
}

/* ---------- styles ---------- */

const styles = StyleSheet.create({
  mapBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '35%',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.select({ ios: 4, android: 10 }),
    paddingBottom: 10,
    gap:12,
    justifyContent: 'flex-start',
  },
  menuBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  headerTitle: {
    fontSize: 18,
    color: TEXT,
    fontFamily: FONTS.regular,
  },

  contentPanel: {
    flex: 1,
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  methodsWrapper: {
    marginBottom: 26,
    marginTop:52,
  },
  methodsCard: {
    backgroundColor: "#EFEFEF",
    borderRadius: 26,
    paddingHorizontal: 16,
    paddingTop: 20, // space for pill
    paddingBottom: 16,
  },

  sectionPill: {
    position: 'absolute',
    top: -52,
    left: 16,
    paddingHorizontal: 18,
    paddingVertical: 17.5,
    backgroundColor: TEXT,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    width:194,
  },
  sectionPillText: {
    color: '#FFFFFF',
    fontFamily: FONTS.semibold,
    fontSize: 18,
    lineHeight:18
  },

  tilesWrap: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },

  tile: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent:'center',
    // paddingVertical: 18,
    height:120,
    width:169
  },
  tileIcon: {
    marginBottom: 10,
  },
  tileText: {
    fontSize: 18,
    color: TEXT,
    fontFamily: FONTS.regular,
  },

  listCard: {
    // backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: BORDER,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height:72,
    // paddingVertical:10,
    marginVertical:7,
    backgroundColor:'#FCFCFC',
    borderRadius:18
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  rowTitle: {
    fontSize: 18,
    color: TEXT,
    fontFamily: FONTS.regular,
  },
  rowSub: {
    fontSize: 14,
    color: '#8D8E8F',
    marginTop: 2,
    fontFamily: FONTS.regular,
  },

  addBtn: {
    marginTop: 0,
    height: 56,
    borderRadius: 30,
    backgroundColor: TEXT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 26,
  },
  addBtnText: {
    color: '#F2F2F7',
    fontFamily: FONTS.regular,
    lineHeight:22,
    fontSize: 18,
  },
  addBtnIcon: {
    position: 'absolute',
    right: 6,
    width: 46,
    height: 46,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: TEXT,
  },

  blockTitle: {
    fontSize: 18,
    color: TEXT,
    lineHeight:18,
    fontFamily: FONTS.semibold,
    marginBottom: 14,
  },

  profileRow: {
    flexDirection: 'row',
    gap: 18,
  },
  profileTile: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: "#EFEFEF",
    borderWidth: 1,
    borderColor: '#CFCDCD',
    alignItems: 'center',
    paddingVertical: 20,
  },
  profileIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileText: {
    fontSize: 18,
    color: "#282828",
    fontFamily: FONTS.semibold,
  },
});
