// src/screens/PaymentBreakdownModal.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FONTS } from '../../src/theme/fonts';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, PaymentRow } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentBreakdown'>;

const MINT = '#B9FBE7';

export default function PaymentBreakdownModal({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const {
    title = 'Payment',
    rows,
    footnote = 'Toll hwy and other costs may apply',
    currency = 'USD',
    locale = 'en-US',
  } = route.params;

  const fmtMoney = (v: number) =>
    new Intl.NumberFormat(locale, { style: 'currency', currency }).format(v);

  const renderValue = (row: PaymentRow) => {
    if (typeof row.value === 'number') {
      const money = row.money ?? true;
      return <Text style={[styles.val, row.bold && styles.valBold]}>{money ? fmtMoney(row.value) : String(row.value)}</Text>;
    }
    return <Text style={[styles.val, row.bold && styles.valBold]}>{row.value}</Text>;
  };

  return (
    <View style={{ flex: 1 }}>
      {/* dim but keep map visible */}
      <Pressable style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.1)' }]} onPress={() => navigation.goBack()} />

      <SafeAreaView edges={['bottom']} style={styles.wrap}>
        <View style={[styles.sheet, { paddingTop: insets.top + 6 }]}>
          {/* header */}
          <View style={styles.header}>
            <Text style={styles.h1}>{title}</Text>
            <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
              <Ionicons name="close" size={18} color="#111" />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}>
            <View style={styles.table}>
              {rows.map((r, idx) => (
                <View key={idx} style={styles.row}>
                  <Text style={styles.label}>{r.label}</Text>
                  {renderValue(r)}
                </View>
              ))}
            </View>

            <View style={styles.noteRow}>
              <Ionicons name="information-circle-outline" size={14} color="#9AA0A6" />
              <Text style={styles.noteTxt}>{footnote}</Text>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    maxHeight: '85%',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  h1: { color: '#111', fontSize: 18, fontFamily: FONTS.bold },

  table: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  row: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEE',
  },
  label: { color: '#111', fontFamily: FONTS.regular },
  val: { color: '#111', fontFamily: FONTS.bold },
  valBold: { fontFamily: FONTS.bold },

  noteRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 },
  noteTxt: { color: '#9AA0A6', fontFamily: FONTS.regular },

  chip: {
    alignSelf: 'flex-start',
    backgroundColor: MINT, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14,
  },
});
