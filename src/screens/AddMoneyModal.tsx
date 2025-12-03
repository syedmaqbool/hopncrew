// src/screens/AddMoneyModal.tsx
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FONTS } from '../../src/theme/fonts';

const MINT = '#B9FBE7';

export default function AddMoneyModal({
  visible,
  onClose,
  onAdd,
}: {
  visible: boolean;
  onClose: () => void;
  onAdd: (amount: number) => void;
}) {
  const [amount, setAmount] = useState<string>('');

  const submit = () => {
    const val = Number(amount);
    if (!isFinite(val) || val <= 0) return; // ignore invalid
    onAdd(val);
    setAmount('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      {/* backdrop */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.sheetWrap}
      >
        <View style={styles.sheet}>
          {/* header */}
          <View style={styles.header}>
            <Text style={styles.title}>Enter Amount</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={26} color="#8D8E8F" />
            </Pressable>
          </View>

          {/* input */}
          <TextInput
            style={styles.input}
            placeholder="Enter here"
            placeholderTextColor="#9AA0A6"
            inputMode="decimal"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
            returnKeyType="done"
            onSubmitEditing={submit}
          />

          {/* CTA */}
          <Pressable
            onPress={submit}
            style={[styles.cta, (!amount || Number(amount) <= 0) && { opacity: 0.5 }]}
            disabled={!amount || Number(amount) <= 0}
          >
            <Text style={styles.ctaText}>Add</Text>
            <View style={styles.ctaIcon}>
              <Ionicons name="add" size={24} color="#111" />
            </View>
          </Pressable>

          {/* cancel */}
          <Pressable style={styles.cancel} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.65)' },
  sheetWrap: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 40,
    gap: 12,
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 20, color: '#111', fontFamily: FONTS.semibold },
  closeBtn: {
    width: 44, height: 44, borderRadius: 15,
    alignItems: 'center', justifyContent: 'center',
  },
  input: {
    height: 50,
    borderWidth: .5, borderColor: '#8D8E8F',
    borderRadius: 22, paddingHorizontal: 14,
    color: '#201E20', backgroundColor: '#fff',marginVertical:18
  },
  cta: {
    height: 56, borderRadius: 32, backgroundColor: '#201E20',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  ctaText: { color: '#FCFCFC', fontFamily: FONTS.semibold,fontSize:17 },
  ctaIcon: { width: 44, height: 44, borderRadius: 24, backgroundColor: MINT, alignItems: 'center', justifyContent: 'center', position: 'absolute', right: 8, },
  cancel: { alignItems: 'center', paddingVertical: 8 },
  cancelText: { color: '#201E20', fontFamily: FONTS.semibold,fontSize:17 },
});
