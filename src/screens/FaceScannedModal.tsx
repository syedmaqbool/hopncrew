import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { FONTS } from '../../src/theme/fonts';

type Props = {
  visible: boolean;
  onAllow: () => void;
  onDeny: () => void;
};

export default function FaceScannedModal({ visible, onAllow, onDeny }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>
            Do you want to allow “hop’n” to use face ID?
          </Text>
          <Text style={styles.subtitle}>
            This lets you use face ID to login to the app.
          </Text>
          <Pressable style={styles.primary} onPress={onAllow}>
            <Text style={styles.primaryText}>Allow</Text>
          </Pressable>
          <Pressable onPress={onDeny}>
            <Text style={styles.cancel}>Don’t Allow</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '80%',
    borderRadius: 32,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 15 },
    shadowRadius: 24,
    elevation: 12,
  },
  title: {
    fontSize: 22,
    fontFamily: FONTS.semibold,
    color: '#111',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: '#606060',
    textAlign: 'center',
    marginBottom: 24,
  },
  primary: {
    width: '100%',
    borderRadius: 26,
    backgroundColor: '#111',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  primaryText: {
    color: '#fff',
    fontFamily: FONTS.semibold,
    fontSize: 16,
  },
  cancel: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: '#111',
  },
});
