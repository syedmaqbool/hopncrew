// src/screens/LuggageScanInfoModal.tsx
import React from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FONTS } from '../../src/theme/fonts';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'LuggageScanInfo'>;

const MINT = '#B9FBE7';

export default function LuggageScanInfoModal({ navigation, route }: Props) {
  const start = () => {
    route.params?.onStartScan?.();
    navigation.navigate('ScanBagSize');
  };

  return (
    <View style={styles.fill}>
      {/* DIM BACKDROP */}
      <Pressable style={styles.backdrop} onPress={() => navigation.goBack()} />

      <SafeAreaView edges={['bottom']} style={styles.sheetWrap}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Add Luggage</Text>
            <Pressable style={styles.close} onPress={() => navigation.goBack()}>
              <Ionicons name="close" size={24} color="#8D8E8F" />
            </Pressable>
          </View>

          <Step
            title="Choose a bag type"
            body="Select from the large (overhead) or small (under seat) cabin bag options."
          />
          <Sep />
          <Step
            title="Find an open space"
            body="Point your phone camera at the ground to detect the floor."
          />
          <Sep />
          <Step
            title="Locate the sizing cage"
            body="Move your phone around to find the cage."
          />
          <Sep />
          <Step
            title="Check your bag size"
            body="Move your phone again to place the cage over your bag to see if it fits the permitted cabin dimensions."
          />
          <Sep />
          <Pressable style={styles.cta} onPress={start}>
            <Text style={styles.ctaText}>Scan now</Text>
            <View style={styles.ctaIcon}>
              <Image
                              source={require('../../assets/icons/camera-bg-icon.png')}
                              style={{ width: 44, height: 44 }}
                              resizeMode="contain"
                            />
              {/* <Ionicons name="camera-outline" size={18} color="#111" /> */}
            </View>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

function Step({ title, body }: { title: string; body: string }) {
  return (
    <View style={stepStyles.wrap}>
      <View style={stepStyles.bullet} />
      <View style={{ flex: 1 }}>
        <Text style={stepStyles.title}>{title}</Text>
        <Text style={stepStyles.body}>{body}</Text>
      </View>
    </View>
  );
}
function Sep() {
  return <View style={styles.stepDivider} />;
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  // DIMMED
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },

  sheetWrap: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 22,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 10,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 16,
    marginHorizontal: 6,
  },
  title: { color: '#201E20', fontSize: 20, fontFamily: FONTS.semibold },
  close: {
    width: 32,
    height: 32,
    borderRadius: 16,
    // backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cta: {
    marginVertical: 14,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#111',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  ctaText: { color: '#FCFCFC', fontFamily: FONTS.semibold, fontSize: 17 },
  ctaIcon: {
    width: 40,
    // height: 30,
    borderRadius: 15,
    // backgroundColor: MINT,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
  },
  stepDivider: {
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dotted',
    marginVertical: 14,
    width: '100%',
    alignSelf: 'stretch',
  },
});
const stepStyles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'flex-start' },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  title: { color: '#201E20', fontFamily: FONTS.semibold,fontSize:16 },
  body: { color: '#8D8E8F', marginTop: 4,letterSpacing:.2, lineHeight: 24, fontFamily: FONTS.regular,fontSize:16 },
});
