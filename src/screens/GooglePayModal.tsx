// src/screens/GooglePayModal.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'GooglePay'>;

const CARD_BG = '#F1F2F4';

export default function GooglePayModal({ navigation, route }: Props) {
  const email = route.params?.email ?? 'paula.lewis69@gmail.com';

  const remove = () => {
    Alert.alert('Remove Google Pay?', 'This account will be disconnected.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={styles.fill}>
      {/* Top 20% is semi-transparent; tap to dismiss */}
      <Pressable style={styles.topDismiss} onPress={() => navigation.goBack()} />

      {/* Bottom 80% sheet */}
      <SafeAreaView edges={['bottom']} style={styles.sheet}>
        {/* Header inside the sheet */}
        <View style={styles.header}>
          <Pressable style={styles.roundBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={18} color="#111" />
          </Pressable>
          <Text style={styles.title}>Google Pay</Text>
          <View style={{ width: 34 }} />
        </View>

        <View style={{ padding: 16 }}>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              Google Pay brings together everything you need and keeps your payment secure.
            </Text>

            <View style={styles.accountRow}>
              <View style={styles.gIconWrap}>
                <MaterialCommunityIcons name="google" size={18} color="#111" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.accountName}>Google Pay</Text>
                <Text style={styles.accountMail}>{email}</Text>
              </View>
              <Pressable style={styles.trashBtn} onPress={remove} hitSlop={10}>
                <Ionicons name="trash-outline" size={18} color="#fff" />
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  // transparent top 20%
  topDismiss: {
    height: '20%',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  // sheet occupies bottom 80%
  sheet: {
    height: '80%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },

  header: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  roundBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#EEE',
    alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: 16, color: '#111', fontFamily: 'BiennaleBold' },

  infoCard: { backgroundColor: CARD_BG, borderRadius: 18, padding: 12 },
  infoText: { color: '#222', lineHeight: 19, margin: 4 },

  accountRow: {
    marginTop: 12, flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 14, padding: 12, elevation: 1,
  },
  gIconWrap: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#F6F7F8', alignItems: 'center', justifyContent: 'center',
    marginRight: 10,
  },
  accountName: { color: '#111', fontFamily: 'BiennaleBold' },
  accountMail: { color: '#8C92A0', fontSize: 12 },
  trashBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#111', alignItems: 'center', justifyContent: 'center',
  },
});
