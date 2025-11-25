// src/screens/PaymentBreakdownModal.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FONTS } from '../../src/theme/fonts';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, PaymentRow } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentBreakdown'>;

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
      return (
        <Text style={[styles.val, row.bold && styles.valBold]}>
          {money ? fmtMoney(row.value) : String(row.value)}
        </Text>
      );
    }
    return (
      <Text style={[styles.val, row.bold && styles.valBold]}>
        {row.value}
      </Text>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {/* --- Dim Background (tap to close) --- */}
      <Pressable
        style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.25)' }]}
        onPress={() => navigation.goBack()}
      />

      {/* --- Bottom Sheet --- */}
      <SafeAreaView edges={['bottom']} style={styles.wrap}>
        <View style={[styles.sheet, { paddingTop: 10 }]}>
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.h1}>{title}</Text>
            <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
              <Ionicons name="close" size={26} color="#8D8E8F" />
            </Pressable>
          </View>

          {/* Rows */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 26 }}
          >
            {rows.map((row, index) => {
              const isLast = index === rows.length - 1;
              return (
                <View
                  key={index}
                  style={[styles.row, !isLast && styles.rowDivider]}
                >
                  <Text style={styles.label}>{row.label}</Text>
                  {renderValue(row)}
                </View>
              );
            })}

            {/* Footnote */}
            <View style={styles.noteRow}>
              {/* <Ionicons
                name="information-circle-outline"
                size={13}
                color="#8F9398"
              /> */}
              <Text style={styles.noteTxt}>{footnote}</Text>
              <View style={{position:'absolute', right:100,top:-15}}>
              <Image source={require('../../assets/icons/info-icon.png')} alt='info' style={{height:18, width:18}} />
              </View>
            </View>
          </ScrollView>

        </View>
      </SafeAreaView>
    </View>
  );
}

/* ========================= STYLES ========================= */

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    maxHeight: '85%',
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 10,
  },

  /* Header */
  header: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  h1: {
    fontSize: 24,
    color: '#000000',
    fontFamily: FONTS.semibold,
  },

  /* Row List */
  row: {
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#CFCDCD',
  },

  label: {
    fontSize: 16,
    color: '#201E20',
    fontFamily: FONTS.regular,
  },
  val: {
    fontSize: 18,
    color: '#201E20',
    fontFamily: FONTS.semibold,
  },
  valBold: {
    fontFamily: FONTS.bold,
  },

  /* Footnote */
  noteRow: {
    position:'relative',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 30,
  },
  noteTxt: {
    fontSize: 14,
    color: '#201E20',
    fontFamily: FONTS.regular,
  },
});
