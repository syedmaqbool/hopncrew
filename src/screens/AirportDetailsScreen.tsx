// src/screens/AirportDetailsScreen.tsx
import React, { useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, AirportPOI } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'AirportDetails'>;

const fallbackData: AirportPOI[] = Array.from({ length: 12 }).map((_, i) => ({
  id: String(i + 1),
  title: 'Bank Privat',
  subtitle: 'Mykhailivska St. 48, Kiev, UA',
}));

export default function AirportDetailsScreen({ navigation, route }: Props) {
  const items = useMemo<AirportPOI[]>(
    () => route.params?.items ?? fallbackData,
    [route.params?.items]
  );
  const screenTitle = route.params?.title ?? 'Airport details';

  const renderItem = ({ item }: { item: AirportPOI }) => (
    <Pressable
      style={styles.row}
      onPress={() => {
        // route.params?.onPick?.(item);
        // navigation.goBack();
        navigation.navigate('Trip');
      }}
    >
      <View style={styles.pin}>
        <Ionicons name="location-outline" size={16} color="#111" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.subtitle} numberOfLines={1}>{item.subtitle}</Text>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.hBtn}>
          <Ionicons name="chevron-back" size={18} color="#111" />
        </Pressable>
        <Text style={styles.hTitle}>{screenTitle}</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Rounded scrollable card */}
      <View style={styles.card}>
        <FlatList
          data={items}
          keyExtractor={(it) => it.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          contentContainerStyle={{ paddingVertical: 8 }}
          showsVerticalScrollIndicator
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },

  header: {
    height: 56,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#F2F2F2', alignItems: 'center', justifyContent: 'center',
  },
  hTitle: { fontSize: 16, fontWeight: '700', color: '#111' },

  card: {
    flex: 1,
    margin: 16,
    borderRadius: 18,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    paddingHorizontal: 10,
    // subtle shadow
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingRight: 6,
  },
  pin: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#F6F7F8',
    alignItems: 'center', justifyContent: 'center',
  },
  title: { color: '#111', fontWeight: '700' },
  subtitle: { color: '#8A8A8A', marginTop: 2, fontSize: 12 },
  sep: { height: 1, backgroundColor: '#F0F0F0' },
});
