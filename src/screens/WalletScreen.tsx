// src/screens/WalletScreen.tsx
import React, { useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import assets from '../../assets';
import AddMoneyModal from './AddMoneyModal';
import { FONTS } from '../../src/theme/fonts';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Txn = {
  id: string;   // "#8974"
  time: string; // "8:19 AM"
  amount: number;
};

type Section = { title: string; data: Txn[] };

type Props = NativeStackScreenProps<RootStackParamList, 'Wallet'>;

const seed: Section[] = [
  {
    title: 'Today',
    data: [
      { id: '#8974', time: '8:19 AM', amount: 18.27 },
      { id: '#8973', time: '7:44 PM', amount: -24.36 },
    ],
  },
  {
    title: 'May 14, 2024',
    data: [
      { id: '#8974', time: '8:19 AM', amount: 18.27 },
      { id: '#8973', time: '3:24 PM', amount: -27.39 },
      { id: '#8972', time: '6:38 PM', amount: 41.16 },
    ],
  },
  {
    title: 'May 13, 2024',
    data: [
      { id: '#8974', time: '8:19 AM', amount: 18.27 },
      { id: '#8973', time: '3:24 PM', amount: -27.39 },
    ],
  },
];

export default function WalletScreen({ navigation }: Props) {
  const [sections] = useState<Section[]>(seed);
  const [showAdd, setShowAdd] = useState(false);

  const balance = useMemo(() => {
    const sum = sections.flatMap(s => s.data).reduce((a, t) => a + t.amount, 0);
    return 486.24 + sum;
  }, [sections]);

  const openMenu = () => navigation.goBack();
  const onAddMoney = () => setShowAdd(true);

  return (
    <SafeAreaView style={styles.safe}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable style={styles.menuBtn} onPress={openMenu}>
          <Image
            source={assets.images.hamIcon}
            style={{ width: 48, height: 48, borderRadius: 24 }}
          />
        </Pressable>

        <Text style={styles.headerTitle}>Wallet</Text>

        <View style={{ width: 48 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* BALANCE CARD */}
        <View style={styles.balanceCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.balanceValue}>${balance.toFixed(2)}</Text>
            <Text style={styles.balanceLabel}>Available Balance</Text>
          </View>

          <Pressable style={styles.addBtn} onPress={onAddMoney}>
            <View style={{width:48,height:48,flexDirection:'row',alignItems:'center',justifyContent:'center',backgroundColor:'#EFEFEF',borderRadius:32,left:1}}>
            <Ionicons name="add" size={24} color="#201E20" />
            </View>
            <Text style={styles.addBtnText}>Add Money</Text>
          </Pressable>
        </View>

        {/* SECTIONS */}
        {sections.map(section => (
          <View key={section.title} style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>{section.title}</Text>

            <View style={styles.sectionCard}>
              {section.data.map((item, index) => {
                const isLast = index === section.data.length - 1;
                const amtStr = `${item.amount >= 0 ? '+' : '-'} $${Math.abs(
                  item.amount,
                ).toFixed(2)}`;

                return (
                  <View key={item.id + item.time}>
                    <View style={styles.txnRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.txnId}>{item.id}</Text>
                        <Text style={styles.txnTime}>{item.time}</Text>
                      </View>
                      <Text
                        style={styles.txnAmt}
                      >
                        {amtStr}
                      </Text>
                    </View>

                    {!isLast && <View style={styles.innerDivider} />}
                  </View>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* ADD MONEY MODAL */}
      <AddMoneyModal
        visible={showAdd}
        onClose={() => setShowAdd(false)}
        onAdd={amt => {
          console.log('add', amt);
        }}
      />
    </SafeAreaView>
  );
}

/* ---------------- styles ---------------- */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 12,
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
    color: '#201E20',
    fontFamily: FONTS.regular,
  },
  
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  
  balanceCard: {
    marginTop: 14,
    borderRadius: 20,
    backgroundColor: '#111111',
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceValue: {
    color: '#FCFCFC',
    fontSize: 24,
    fontFamily: FONTS.semibold,
  },
  balanceLabel: {
    marginTop: 2,
    color: '#8D8E8F',
    fontSize: 15,
    fontFamily: FONTS.regular,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    height:48,
    width:155,
    // paddingHorizontal: 18,
    // paddingVertical: 10,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
  },
  addBtnText: {
    marginLeft: 10,
    color: '#201E20',
    fontFamily: FONTS.regular,
    fontSize: 16,
  },

  sectionBlock: {
    marginTop: 26,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#201E20',
    fontFamily: FONTS.regular,
    marginBottom: 10,
  },

  sectionCard: {
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#CFCDCD',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 12,
  },

  txnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  innerDivider: {
    height: .3,
    backgroundColor: '#8D8E8F',
  },

  txnId: {
    fontSize: 16,
    color: '#524E4E',
    fontFamily: FONTS.regular,
  },
  txnTime: {
    marginTop: 2,
    fontSize: 15,
    color: '#8D8E8F',
    fontFamily: FONTS.regular,
  },
  txnAmt: {
    fontSize: 16,
    fontFamily: FONTS.semibold,
    color:'#524E4E'
  },
});
