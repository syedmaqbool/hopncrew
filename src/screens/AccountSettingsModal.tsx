// src/screens/AccountSettingsModal.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'AccountSettings'>;

export default function AccountSettingsModal({ navigation }: Props) {
  const onDelete = () => {
    Alert.alert(
      'Delete account?',
      'This action is permanent. Are you sure you want to continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {/* call your API, then: */ navigation.goBack(); } },
      ],
    );
  };

  return (
    <View style={styles.wrap}>
      {/* dim background; tap to dismiss */}
      <Pressable style={styles.backdrop} onPress={() => navigation.goBack()} />

      <SafeAreaView edges={['bottom']} style={styles.sheet}>
        {/* header */}
        <View style={styles.header}>
          <Pressable style={styles.roundBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={18} color="#111" />
          </Pressable>
          <Text style={styles.title}>Account Settings</Text>
          <View style={{ width: 32 }} />
        </View>

        {/* card with 3 rows */}
        <View style={styles.card}>
          <Row
            title="Emergency Contacts"
            subtitle="Save contact will be called"
            onPress={() => navigation.navigate('EmergencyContacts')}
          />
          <Divider />
          <Row
            title="Favourite Address"
            subtitle="Your favourite address list"
            onPress={() => navigation.navigate('FavouriteAddresses')}
          />
          <Divider />
          <Row
            title="Favourite Drivers"
            subtitle="Your favourite drivers list"
            onPress={() => navigation.navigate('FavouriteDrivers')}
          />
        </View>

        {/* delete link */}
        <Pressable onPress={onDelete} style={{ marginTop: 24, alignItems: 'center' }}>
          <Text style={styles.delete}>Delete your Account</Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

function Row({ title, subtitle, onPress }: { title: string; subtitle: string; onPress?: () => void }) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowSub}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#8C8C8C" />
    </Pressable>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },

  sheet: {
    height: '70%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 14,
    paddingBottom: 18,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 8,
  },
  roundBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#F3F3F4', alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: 16, fontWeight: '800', color: '#111' },

  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#EDEDED',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
  },

  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  rowTitle: { color: '#111', fontSize: 14, fontWeight: '700' },
  rowSub: { color: '#8C8C8C', marginTop: 2 },

  divider: { height: 1, backgroundColor: '#EFEFEF' },

  delete: { color: '#E53935', fontWeight: '700' },
});
