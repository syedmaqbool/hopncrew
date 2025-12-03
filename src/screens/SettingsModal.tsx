// src/screens/SettingsScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FONTS } from '../../src/theme/fonts';

const INK = '#121212';
const TEXT = '#111111';
const CARD_BG = '#F4F3F2';
const CARD_BORDER = '#ECEAE7';

export default function SettingsScreen({ navigation }: any) {
  return (
    <View style={styles.screen}>
      {/* Faint map background */}
      <Image
        source={require('../../assets/backgrounds/signin.png')}
        style={styles.mapBg}
        resizeMode="cover"
      />

      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Pressable style={styles.roundBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="ellipsis-horizontal" size={20} color={TEXT} />
          </Pressable>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        {/* White sheet */}
        <View style={styles.sheet}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <SectionBlock
              label="Edit Profile"
              desc="Change name, profile picture"
              onPress={() => navigation.navigate('EditProfile')}
            />

            <SectionBlock
              label="Notifications"
              desc="Define what alerts & notifications you want to see"
              onPress={() => navigation.navigate('Notifications')}
            />

            <SectionBlock
              label="Policies"
              desc="View the privacy and cookie policy"
              onPress={() => navigation.navigate('PoliciesScreen')}
            />

            <SectionBlock
              label="Terms & Conditions"
              desc="View all the terms and conditions while booking"
              onPress={() => navigation.navigate('TermsScreen', { tab: 'terms' })}
            />

            <SectionBlock
              label="Account Settings"
              desc="Change your mobile number or delete your account"
              onPress={() => navigation.navigate('AccountSettings')}
            />
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

/* ---------- reusable block (black pill + grey card) ---------- */
function SectionBlock({
  label,
  desc,
  onPress,
}: {
  label: string;
  desc: string;
  onPress?: () => void;
}) {
  return (
    <View style={{ marginBottom: 28 }}>
      {/* black pill header */}
      <View style={styles.tabWrap}>
        <View style={styles.tabPill}>
          <Text style={styles.tabText}>{label}</Text>
        </View>
      </View>

      {/* description card */}
      <Pressable style={styles.card} onPress={onPress}>
        <Text style={styles.cardText}>{desc}</Text>
        <Ionicons name="chevron-forward" size={18} color="#777777" />
      </Pressable>
    </View>
  );
}

/* ---------------- styles ---------------- */
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mapBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '35%',
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 12,
  },
  roundBtn: {
    width: 48,
    height: 48,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    color: TEXT,
    fontFamily: FONTS.regular,
  },

  sheet: {
    flex: 1,
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 26,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 32,
  },

  tabWrap: {
    marginLeft: 10,
    marginBottom: 10,
  },
  tabPill: {
    backgroundColor: INK,
    borderRadius: 999,
    paddingHorizontal: 26,
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  tabText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: FONTS.semibold,
  },

  card: {
    marginTop: -4,
    backgroundColor: CARD_BG,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    paddingHorizontal: 18,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardText: {
    color: TEXT,
    fontSize: 16,
    flex: 1,
    fontFamily: FONTS.regular,
  },
});

export {};
