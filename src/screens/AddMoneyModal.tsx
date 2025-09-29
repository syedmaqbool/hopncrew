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
              <Ionicons name="close" size={18} color="#111" />
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
              <Ionicons name="add" size={18} color="#111" />
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
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  sheetWrap: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    gap: 12,
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 16, fontWeight: '800', color: '#111' },
  closeBtn: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: '#F2F3F4',
    alignItems: 'center', justifyContent: 'center',
  },
  input: {
    height: 44,
    borderWidth: 1, borderColor: '#E6E6E6',
    borderRadius: 22, paddingHorizontal: 14,
    color: '#111', backgroundColor: '#fff',
  },
  cta: {
    height: 50, borderRadius: 28, backgroundColor: '#111',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  ctaText: { color: '#fff', fontWeight: '700' },
  ctaIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: MINT, alignItems: 'center', justifyContent: 'center' },
  cancel: { alignItems: 'center', paddingVertical: 8 },
  cancelText: { color: '#6C7075', fontWeight: '600' },
});
