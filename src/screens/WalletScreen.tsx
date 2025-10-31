// src/screens/WalletScreen.tsx
import React, { useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import assets from '../../assets';
import AddMoneyModal from './AddMoneyModal';


type Txn = {
  id: string;         // e.g. "#8974"
  time: string;       // "8:19 AM"
  amount: number;     // positive = credit, negative = debit
};

type Section = { title: string; data: Txn[] };

const MINT = '#B9FBE7';

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

export default function WalletScreen() {
  const [sections] = useState<Section[]>(seed);
  const [showAdd, setShowAdd] = useState(false);
  const onAddMoney = () => setShowAdd(true);

  const balance = useMemo(() => {
    // you’d typically fetch this; demo sum here
    const sum = sections.flatMap(s => s.data).reduce((a, t) => a + t.amount, 0);
    return 486.24 + sum; // seed base
  }, [sections]);

  //   const onAddMoney = () => {
  //     // navigate to Add Money / Payment screen or show bottom sheet
  //     console.log('Add Money tapped');
  //   };

  const renderTxn = ({ item }: { item: Txn }) => {
    const amtStr = `${item.amount >= 0 ? '+' : '-'} $${Math.abs(item.amount).toFixed(2)}`;
    return (
      <View style={styles.txnRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.txnId}>{item.id}</Text>
          <Text style={styles.txnTime}>{item.time}</Text>
        </View>
        <Text style={[styles.txnAmt, { color: item.amount >= 0 ? '#0A7D29' : '#111' }]}>
          {amtStr}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.roundBtn} onPress={() => console.log('open drawer')}>
          <Image
            source={assets.images.hamIcon}// <-- **Direct require with correct path**
            style={{ width: 40, height: 40, borderRadius: 20 }}
          />
        </Pressable>
        <Text style={styles.headerTitle}>Wallet</Text>
        <View style={{ width: 34 }} />
      </View>

      {/* Balance card */}
      <View style={styles.balanceCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.balanceValue}>${balance.toFixed(2)}</Text>
          <Text style={styles.balanceLabel}>Available Balance</Text>
        </View>
        <Pressable style={styles.addBtn} onPress={onAddMoney}>
          <Ionicons name="add" size={18} color="#111" />
          <Text style={styles.addBtnText}>Add Money</Text>
        </Pressable>

        <AddMoneyModal
          visible={showAdd}
          onClose={() => setShowAdd(false)}
          onAdd={(amt) => {
            // TODO: call your API, then update balance/transactions locally
            console.log('add', amt);
          }}
        />
      </View>

      {/* Transactions */}
      <SectionList
        sections={sections}
        keyExtractor={(i) => i.id + i.time}
        renderItem={renderTxn}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionTitle}>{section.title}</Text>
        )}
        ItemSeparatorComponent={() => <View style={styles.rowDivider} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        stickySectionHeadersEnabled={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 8,
    paddingTop: 6,
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  roundBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: '#F3F4F5', alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { color: '#111', fontSize: 18, textAlign: 'left', fontFamily: 'BiennaleRegular' },

  balanceCard: {
    marginHorizontal: 16,
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  balanceValue: { color: '#fff', fontSize: 24, fontFamily: 'BiennaleBold' },
  balanceLabel: { color: '#B7BBC1', marginTop: 4, fontFamily: 'BiennaleRegular' },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 22,
  },
  addBtnText: { color: '#111', fontFamily: 'BiennaleBold' },

  sectionTitle: {
    marginTop: 16, marginBottom: 8, marginHorizontal: 4,
    color: '#6C7075', fontFamily: 'BiennaleBold',
  },

  txnRow: {
    backgroundColor: '#fff',
    paddingHorizontal: 14, paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1, borderColor: '#EFEFEF',
  },
  rowDivider: { height: 10 },

  txnId: { color: '#111', fontFamily: 'BiennaleBold' },
  txnTime: { color: '#9AA0A6', marginTop: 2, fontFamily: 'BiennaleRegular' },
  txnAmt: { fontFamily: 'BiennaleBold' },
});
