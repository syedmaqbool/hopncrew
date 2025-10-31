// src/screens/AddPaymentMethodModal.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'AddPaymentMethod'>;

export default function AddPaymentMethodModal({ navigation }: Props) {
  return (
    <View style={styles.wrap}>
      {/* dim background; tap to dismiss */}
      <Pressable style={styles.backdrop} onPress={() => navigation.goBack()} />

      {/* bottom sheet */}
      <SafeAreaView edges={['bottom']} style={styles.sheet}>
        {/* header */}
        <View style={styles.header}>
          <Text style={styles.title}>Add Payment Method</Text>
          <Pressable onPress={() => navigation.goBack()} style={styles.closeBtn}>
            <Ionicons name="close" size={18} color="#111" />
          </Pressable>
        </View>

        {/* options */}
        <View style={{ padding: 14, gap: 10 }}>
          <RowButton
            icon={<MaterialCommunityIcons name="credit-card-outline" size={18} color="#fff" />}
            label="Credit Card"
            onPress={() => navigation.navigate('CreditCards')}
          />
          <RowButton
            icon={<MaterialCommunityIcons name="google" size={18} color="#fff" />}
            label="Google Pay"
            onPress={() => navigation.navigate('GooglePay', { email: 'paula.lewis69@gmail.com' })}
          />
          <RowButton
            icon={<MaterialCommunityIcons name="apple" size={18} color="#fff" />}
            label="Apple Pay"
            onPress={() => navigation.navigate('GooglePay', { email: 'paula.lewis69@gmail.com' })}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

function RowButton({
  icon, label, onPress,
}: { icon: React.ReactNode; label: string; onPress: () => void }) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={styles.rowIcon}>{icon}</View>
      <Text style={styles.rowText}>{label}</Text>
      <AntDesign name="right" size={16} color="#fff" />
    </Pressable>
  );
}

const MINT = '#B9FBE7';

const styles = StyleSheet.create({
  fill: { flex: 1 },

   wrap: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },

  // ~45% height sheet; adjust if you want taller
  sheet: {
    height: '45%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },

  header: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: 16, color: '#111', fontFamily: 'BiennaleBold' },
  closeBtn: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: '#F3F3F4',
    alignItems: 'center', justifyContent: 'center',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#111',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  rowIcon: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: MINT,
    alignItems: 'center', justifyContent: 'center',
  },
  rowText: { flex: 1, color: '#fff', fontFamily: 'BiennaleBold' },
});
