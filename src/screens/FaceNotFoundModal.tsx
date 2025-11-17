import React from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { FONTS } from '../../src/theme/fonts';

type Props = {
  visible: boolean;
  onTryAgain: () => void;
  onLinkPress: () => void;
  onCancel: () => void;
};

export default function FaceNotFoundModal({
  visible,
  onTryAgain,
  onLinkPress,
  onCancel,
}: Props) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.iconPlaceholder}>
            <Image
              source={require('../../assets/icons/face-scanner-icon.png')}
              alt="face-scanner"
            />
          </View>
          <Text style={styles.title}>Face Not Recognised</Text>
          <Pressable onPress={onLinkPress}>
            <Text style={styles.link}>Try Again</Text>
          </Pressable>
          <Pressable style={styles.primary} onPress={onTryAgain}>
            <Text style={styles.primaryText}>Try Face ID Again</Text>
          </Pressable>
          <Pressable onPress={onCancel}>
            <Text style={styles.cancel}>Cancel</Text>
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
    borderRadius: 28,
    backgroundColor: '#fff',
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
  },
  iconPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 45,
    // borderWidth: 1,
    // borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 36,
  },
  title: {
    fontSize: 20,
    fontFamily: FONTS.semibold,
    color: '#111',
    marginBottom: 8,
  },
  link: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: '#6086C1',
    textDecorationLine: 'underline',
    marginBottom: 22,
  },
  primary: {
    width: '100%',
    backgroundColor: '#111',
    borderRadius: 26,
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
