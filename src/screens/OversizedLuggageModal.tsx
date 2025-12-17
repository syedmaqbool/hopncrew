// src/screens/OversizedLuggageModal.tsx
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import assets from '../../assets';
import { FONTS } from '../../src/theme/fonts';
import type {
  OversizedItemCounts,
  OversizedKind,
  RootStackParamList,
} from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'OversizedLuggage'>;

const MINT = '#B9FBE7';
const CATALOG: { id: OversizedKind; title: string; icon: any }[] = [
  { id: 'bicycles', title: 'Bicycles', icon: assets.images.cycleIcon },
  { id: 'golf', title: 'Golf Bags', icon: assets.images.golfIcon },
  { id: 'snowboard', title: 'Snowboard Bags', icon: assets.images.snowIcon },
  { id: 'ski', title: 'Ski Bags', icon: assets.images.skiIcon },
  { id: 'surfboard', title: 'Surfboards', icon: assets.images.surfIcon },
  { id: 'sports', title: 'Sports equipment', icon: assets.images.sportsIcon },
  { id: 'hockey', title: 'Hockey bags', icon: assets.images.hockyIcon },
  { id: 'music', title: 'Musical instruments', icon: assets.images.musicIcon },
];

export default function OversizedLuggageModal({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const [counts, setCounts] = useState<OversizedItemCounts>({
    ...(route.params?.initial ?? {}),
  });

  const inc = (k: OversizedKind) =>
    setCounts(c => ({ ...c, [k]: (c[k] ?? 0) + 1 }));
  const dec = (k: OversizedKind) =>
    setCounts(c => ({ ...c, [k]: Math.max(0, (c[k] ?? 0) - 1) }));

  const exit = (emit = true) => {
    if (emit) route.params?.onDone?.(counts);
    navigation.goBack(); // returns to AddLuggage
  };

  return (
    <View style={styles.fill}>
      {/* DIM BACKDROP */}
      <Pressable style={styles.backdrop} onPress={() => exit(true)} />

      <KeyboardAvoidingView
        style={styles.fill}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
      >
        <SafeAreaView edges={['bottom']} style={styles.sheetWrap}>
          <View style={styles.sheet}>
            {/* top bar */}
            <View style={styles.topBar}>
               {/* Scan row */}
                      <View style={{width:30}} />
                        <View style={styles.scanSection}>
                          <Pressable
                            style={styles.camBtn}
                          >
                            <Image
                              source={require('../../assets/icons/camera-bg-icon.png')}
                              style={{ width: 56, height: 56 }}
                              resizeMode="contain"
                            />
                          </Pressable>
              
                          <View style={styles.scanLabelRow}>
                            <Text style={styles.scanText}>Scan Bag size</Text>
                            {/* <Ionicons
                              name="information-circle-outline"
                              size={16}
                              color="#111"
                              onPress={() =>
                                navigation.navigate('LuggageScanInfo', {
                                  onStartScan: () => {},
                                })
                              }
                            /> */}
                            <Pressable onPress={() =>
                                navigation.navigate('LuggageScanInfo', {
                                  onStartScan: () => {},
                                })
                              }>
                            <Image source={require('../../assets/icons/info-icon.png')} alt='info' style={{width:19.5,height:19.5}} />
                            </Pressable>
                          </View>
                        </View>
              {/* <View style={styles.scanHeader}>
                <View style={styles.camMint}>
                  <Ionicons name="camera-outline" size={18} color="#111" />
                </View>
                <Text style={styles.scanText}>Scan Bag size</Text>
                <Ionicons
                  name="information-circle-outline"
                  size={18}
                  color="#9AA0A6"
                  onPress={() => navigation.navigate('LuggageScanInfo')}
                />
              </View> */}
              <Pressable style={styles.close} onPress={() => exit(true)}>
                <Ionicons name="close" size={28} color="#8D8E8F" />
              </Pressable>
            </View>

            {/* grid */}
            <FlatList
              data={CATALOG}
              keyExtractor={it => it.id}
              numColumns={2}
              columnWrapperStyle={{ gap: 12, marginBottom: 4 }}
              contentContainerStyle={{ paddingVertical: 6 }}
              renderItem={({ item }) => {
                const val = counts[item.id] ?? 0;
                return (
                  <View style={styles.card}>
                    <View style={styles.cardTop}>
                      <Text style={styles.cardTitle} numberOfLines={2}>
                        {item.title}
                      </Text>
                      <Image
                        source={item.icon}
                        style={{ width: 40, height: 40, resizeMode: 'contain' }}
                      />
                    </View>
                    <View style={styles.stepper}>
                      <Pressable
                        style={styles.stepBtn}
                        onPress={() => dec(item.id)}
                      >
                        <Image source={require('../../assets/icons/minus-icon.png')} alt='minus' style={{width:40,height:40}} />
                        {/* <AntDesign name="minus" size={14} color="#111" /> */}
                      </Pressable>
                      <Text style={styles.stepVal}>{val}</Text>
                      <Pressable
                        style={[styles.stepBtn, styles.stepBtnDark]}
                        onPress={() => inc(item.id)}
                      >
                         <Image source={require('../../assets/icons/plus-bg-black-icon.png')} alt='plus' style={{width:40,height:40}} />
                        {/* <AntDesign name="plus" size={14} color="#fff" /> */}
                      </Pressable>
                    </View>
                  </View>
                );
              }}
              showsVerticalScrollIndicator={false}
            />

            {/* bottom CTA */}
            <Pressable style={styles.cta} onPress={() => exit(true)}>
              <Text style={styles.ctaText}>`
                +Date&Time
                 </Text>
                 <AntDesign style={{paddingTop:-4}} name="arrowright" size={20} color="#fff" />
              <View style={styles.ctaIcon}>
                <Image source={require('../../assets/icons/date-time-icon.png')} alt='calendar' style={{width:44,height:44}} />
                {/* <Ionicons name="calendar-outline" size={18} color="#111" /> */}
              </View>
            </Pressable>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
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

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  close: {
    width: 32,
    height: 32,
    borderRadius: 16,
    // backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  scanHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  camMint: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: MINT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanText: { color: '#111', fontFamily: FONTS.semibold, fontSize: 16,marginRight:4 },

  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CFCDCD',
    borderRadius: 24,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
    height: 128,
    width: 183,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 6,
    marginBottom: 10,
  },
  cardTitle: { color: '#201E20', maxWidth: 90, fontFamily: FONTS.regular,fontSize:16 },

  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    justifyContent: 'center',
  },
  stepBtn: {
    width: 30,
    height: 30,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepBtnDark: { backgroundColor: '#111' },
  stepVal: { width: 24, textAlign: 'center', color: '#111', fontFamily: FONTS.regular, fontSize:32 },

  cta: {
    marginVertical: 14,
     height: 56,
    borderRadius: 28,
    backgroundColor: '#111',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  ctaText: { color: '#FCFCFC', fontFamily: FONTS.semibold, fontSize: 17 },
  ctaIcon: {
   width: 44,
    height: 44,
    borderRadius: 15,
    // backgroundColor: MINT,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    margin: 3,
    right: 8,
  },
  scanLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  scanSection: { alignItems: 'center', justifyContent: 'center', marginVertical: 2 },
  camBtn: {
    // width: 36,
    // height: 36,
    // borderRadius: 18,
    // backgroundColor: MINT,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
