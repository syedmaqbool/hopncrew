// screens/SpecialRequestModal.tsx
import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Pressable, TextInput, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, SpecialRequestPayload } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'SpecialRequest'>;
const MINT = '#B9FBE7';

export default function SpecialRequestModal({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const [caringPet, setCaringPet] = useState(route.params?.initial?.caringPet ?? false);
  const [quietRide, setQuietRide] = useState(route.params?.initial?.quietRide ?? false);
  const [note, setNote] = useState(route.params?.initial?.note ?? '');
  const scrollRef = useRef<ScrollView>(null);

  const done = () => {
    const payload: SpecialRequestPayload = { caringPet, quietRide, note: note.trim() };
    route.params?.onDone?.(payload);
    navigation.goBack();
  };
  const cancel = () => {
    route.params?.onCancel?.();
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1 }}>
      {/* keep map visible; tap outside to close */}
      <Pressable style={StyleSheet.absoluteFillObject} onPress={cancel} />

      <KeyboardAvoidingView
        style={{ flex: 1, justifyContent: 'flex-end' }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}  // 👈 important
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 8 : 0} // header offset
      >
        <SafeAreaView edges={['bottom']} style={{ justifyContent: 'flex-end' }}>
          <View style={styles.sheet}>
            {/* header */}
            <View style={styles.header}>
              <Text style={styles.title}>Special Request</Text>
              <Pressable onPress={cancel} style={styles.close}>
                <Ionicons name="close" size={18} color="#111" />
              </Pressable>
            </View>
            <Text style={styles.sub}>Let driver know more about your requests</Text>

            <ScrollView
              ref={scrollRef}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 16 }}
              showsVerticalScrollIndicator={false}
            >

            {/* checkboxes */}
            <View style={styles.checkboxRow}>
              <Check label="Caring pet?" checked={caringPet} onToggle={() => setCaringPet(v => !v)} />
              <Check label="Quiet Ride" checked={quietRide} onToggle={() => setQuietRide(v => !v)} />
            </View>

            {/* note */}
            <Text style={styles.label}>Enter any instruction</Text>
            <TextInput
              style={styles.note}
              placeholder="Type your note…"
              placeholderTextColor="#9AA0A6"
              multiline
              value={note}
              onChangeText={setNote}
              textAlignVertical="top"
            />
            </ScrollView>
            {/* CTA */}
            <Pressable style={styles.cta} onPress={done}>
              <Text style={styles.ctaText}>Done</Text>
              <View style={styles.ctaIcon}>
                <AntDesign name="arrowright" size={18} color="#111" />
              </View>
            </Pressable>

            <Pressable onPress={cancel} style={{ alignSelf: 'center', marginTop: 10 }}>
              <Text style={{ color: '#777', fontWeight: '600' }}>Cancel</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}

function Check({ label, checked, onToggle }:{
  label: string; checked: boolean; onToggle: () => void;
}) {
  return (
    <Pressable onPress={onToggle} style={styles.checkWrap} hitSlop={8}>
      <Ionicons name={checked ? 'checkbox-outline' : 'square-outline'} size={18} color="#111" />
      <Text style={styles.checkLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 18,
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { color: '#111', fontWeight: '800', fontSize: 16 },
  close: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F2F2F2', alignItems: 'center', justifyContent: 'center' },

  sub: { color: '#666', marginTop: 6, marginBottom: 10 },
  checkboxRow: { flexDirection: 'row', gap: 18, marginBottom: 10 },
  checkWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkLabel: { color: '#111', fontWeight: '600' },

  label: { color: '#111', fontWeight: '700', marginTop: 6, marginBottom: 6 },
  note: {
    minHeight: 90, borderWidth: 1, borderColor: '#EFEFEF', borderRadius: 12,
    padding: 10, color: '#111', backgroundColor: '#fff',
  },

  cta: {
    marginTop: 14, height: 48, borderRadius: 28, backgroundColor: '#111',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  ctaText: { color: '#fff', fontWeight: '700' },
  ctaIcon: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: MINT,
    alignItems: 'center', justifyContent: 'center',position: 'absolute', right: 10,
  },
});
