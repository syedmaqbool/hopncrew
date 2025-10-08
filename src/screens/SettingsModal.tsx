// src/screens/SettingsModal.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

const MINT = '#EDE8DF';  // faint map bg tint (optional)
const INK  = '#121212';

export default function SettingsModal({ navigation }: any) {
  return (
    <View style={styles.wrap}>
      {/* dim background, tap to close */}
      <Pressable style={styles.backdrop} onPress={() => navigation.goBack()} />

      {/* bottom sheet */}
      <SafeAreaView edges={['bottom']} style={styles.sheet}>
        {/* header row */}
        <View style={styles.headerRow}>
          <Pressable style={styles.roundBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="ellipsis-horizontal" size={16} color="#111" />
          </Pressable>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={{ width: 32 }} />
        </View>

        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: 24, gap: 18 }}
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
            onPress={() => navigation.navigate('Policies')}
          />

          <SectionBlock
            label="Terms & Conditions"
            desc="View all the terms and conditions while booking"
            onPress={() => navigation.navigate('Policies', { tab: 'terms' })}
          />

          <SectionBlock
            label="Account Settings"
            desc="Change your mobile number or delete your account"
            onPress={() => navigation.navigate('AccountSettings')}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

/* ---------- one reusable section card with the black “tab” header ---------- */
function SectionBlock({
  label, desc, onPress,
}: { label: string; desc: string; onPress?: () => void }) {
  return (
    <View>
      {/* black rounded header “tab” */}
      <View style={styles.tabWrap}>
        <View style={styles.tabPill}>
          <Text style={styles.tabText}>{label}</Text>
        </View>
        {/* the right “ear” to match the design notch */}
        {/* <View style={styles.tabEar} /> */}
      </View>

      {/* card */}
      <Pressable style={styles.card} onPress={onPress}>
        <Text style={styles.cardText}>{desc}</Text>
        <Ionicons name="chevron-forward" size={18} color="#777" />
      </Pressable>
    </View>
  );
}

/* ---------------- styles ---------------- */
const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },

  sheet: {
    height: '78%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    overflow: 'hidden',
  },

  headerRow: {
    paddingTop: 8,
    paddingHorizontal: 14,
    paddingBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  roundBtn: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: '#F3F3F4',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#111' },

  /* section header (black pill + “ear”) */
  tabWrap: { height: 50, marginLeft: 8, flexDirection: 'row', alignItems: 'center' },
  tabPill: {
    backgroundColor: INK,
    borderRadius: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 40,
    borderBottomRightRadius: 0,
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  tabText: { color: '#fff', fontWeight: '800', fontSize: 12 },
  tabEar: {
    width: 28,
    height: 24,
    marginLeft: -2,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 18,
    backgroundColor: INK,
  },

  card: {
    marginTop: -10, // so the pill sits “on” the card
    backgroundColor: '#F4F3F2',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#ECEAE7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardText: { color: '#111', flex: 1, fontWeight: '600' },
});
