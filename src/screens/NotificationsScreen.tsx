// src/screens/NotificationsScreen.tsx
import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Swipeable } from 'react-native-gesture-handler';

type Notice = {
  id: string;
  title: string;
  body: string;
  date: string;   // ISO date
};

const MINT = '#B9FBE7';

const seed: Notice[] = [
  { id: '1', title: 'Account and ride updates', body: 'Includes ride status notifications and updates related to riding on your account.', date: '2025-05-12' },
  { id: '2', title: 'Discounts and news', body: 'Includes special offers, recommendations, and product updates.', date: '2025-05-11' },
  { id: '3', title: 'Payment Declined', body: 'Update payment method or add new payment method.', date: '2025-05-10' },
  { id: '4', title: 'Cristine Emily', body: 'Latin words consectetur.', date: '2025-05-09' },
  { id: '5', title: 'Your ride successfully completed', body: "Hey John! Your ride 2017110987 has been successfully completed.", date: '2025-05-08' },
  { id: '6', title: 'Account and ride updates', body: 'Includes ride status notifications and updates related to riding on your account.', date: '2025-05-07' },
  { id: '7', title: 'Discounts and news', body: 'Includes special offers, recommendations, and product updates.', date: '2025-05-06' },
];

export default function NotificationsScreen() {
  const [items, setItems] = useState(seed);

  const onDelete = (id: string) => setItems(prev => prev.filter(n => n.id !== id));

  const grouped = useMemo(() => {
    // already in date order; you can sort if needed
    return items;
  }, [items]);

  const renderRightActions = (id: string) => (
    <Pressable style={styles.deletePane} onPress={() => onDelete(id)}>
      <Ionicons name="trash" size={22} color="#fff" />
    </Pressable>
  );

  const renderItem = ({ item }: { item: Notice }) => {
    const d = new Date(item.date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = d.toLocaleString('en-US', { month: 'short' });

    return (
      <Swipeable renderRightActions={() => renderRightActions(item.id)} overshootRight={false}>
        <View style={styles.card}>
          {/* date badge */}
          <View style={styles.dateCol}>
            <View style={styles.dateBadge}>
              <Text style={styles.day}>{day}</Text>
              <Text style={styles.mon}>{month}</Text>
            </View>
          </View>

          {/* content */}
          <View style={{ flex: 1 }}>
            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.body} numberOfLines={2}>{item.body}</Text>
          </View>
        </View>
        <View style={styles.separator} />
      </Swipeable>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* header */}
      <View style={styles.header}>
        <Pressable style={styles.roundBtn}><Ionicons name="ellipsis-horizontal" size={18} color="#111" /></Pressable>
        <Text style={styles.headerTitle}>Notifications</Text>
        <Pressable style={styles.roundBtn} onPress={() => setItems([])}>
          <Ionicons name="trash-outline" size={18} color="#111" />
        </Pressable>
      </View>

      <FlatList
        data={grouped}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 12, paddingBottom: 24 }}
        ItemSeparatorComponent={() => null}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 12, paddingBottom: 8, paddingTop: 6,
  },
  headerTitle: { color: '#111', fontSize: 18, fontFamily: 'BiennaleBold' },
  roundBtn: {
    width: 34, height: 34, borderRadius: 17, backgroundColor: '#F3F4F5',
    alignItems: 'center', justifyContent: 'center',
  },

  card: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  dateCol: { width: 64, alignItems: 'center' },
  dateBadge: {
    width: 52, borderRadius: 8, backgroundColor: '#F3F4F5',
    alignItems: 'center', justifyContent: 'center', paddingVertical: 6,
  },
  day: { color: '#111', fontFamily: 'BiennaleBold' },
  mon: { color: '#6C7075', fontSize: 12, fontFamily: 'BiennaleRegular' },

  title: { color: '#111', marginBottom: 4, fontFamily: 'BiennaleBold' },
  body: { color: '#6C7075', lineHeight: 18, fontFamily: 'BiennaleRegular' },

  separator: { height: 1, backgroundColor: '#EEE', marginLeft: 74, marginRight: 10 },

  deletePane: {
    width: 84, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#E53935', marginVertical: 6, borderTopRightRadius: 12, borderBottomRightRadius: 12,
  },
});
