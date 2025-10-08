// src/screens/FareOptionsModal.tsx
import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, Pressable, ScrollView, TextInput, Switch, Image
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, FareQuote, SpecialRequestPayload } from '../navigation/types';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import assets from '../../assets';
type Props = NativeStackScreenProps<RootStackParamList, 'FareOptions'>;

const MINT = '#B9FBE7';

export default function FareOptionsModal({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const eta = route.params?.etaMinutes ?? 18;
  const quotes = route.params?.quotes ?? [];
  const [selectedId, setSelectedId] = useState<string>(quotes[0]?.id);
  const [payMethod, setPayMethod] = useState(route.params?.payMethod ?? 'Card');
  const [hasNote, setHasNote] = useState(false);
  const [special, setSpecial] = useState<SpecialRequestPayload>({
        caringPet: false, quietRide: false, note: '',
        });
  const [note, setNote] = useState('');

  const selected = useMemo(
    () => quotes.find(q => q.id === selectedId) ?? quotes[0],
    [quotes, selectedId]
  );

  const confirm = () => {
            if (!selected) return;
        navigation.navigate('ConfirmRequest', {
            quote: selected,
            payMethod,
            special: hasNote ? special : null,
        });
        };



 

  return (
    <View style={styles.fill}>
      {/* leave the map visible behind */}
      <Pressable style={styles.backdrop} onPress={() => navigation.goBack()} />

      <SafeAreaView edges={['bottom']} style={styles.sheetWrap}>
        {/* Top overlay (back & ETA) */}
        <View style={[styles.overlayTop, { paddingTop: insets.top + 6 }]}>
          <Pressable style={styles.roundBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={18} color="#111" />
          </Pressable>
          {/* <View style={styles.etaPill}>
            <Text style={styles.etaNum}>{eta}</Text>
            <Text style={styles.etaTxt}>Min</Text>
          </View> */}
        </View>

        {/* Bottom sheet */}
        <View style={styles.sheet}>
          <ScrollView
            contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.blurb}>
              “All ride options are powered by verified, insured professionals trained to limousine standards.”
            </Text>

            {/* Fare cards */}
            <View style={{ gap: 10, marginTop: 10 }}>
              {quotes.map(q => (
                <FareCard
                  key={q.id}
                  quote={q}
                  selected={q.id === selectedId}
                  onPress={() => setSelectedId(q.id)}
                />
              ))}
            </View>

            {/* Policy chips */}
            <ScrollView
            
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8, marginTop: 14,marginLeft: 50 }}
            >
              {[' - Waiting Time - No Show ->'].map((p) => (
                <Pressable onPress={() => { navigation.navigate('Policies', {
                onSelect: (id) => console.log('open policy details for', id),
                });}}>
                <View key={p} style={styles.chip}   >
                  <Text style={styles.chipTxt}>{p}</Text>
                </View>
                </Pressable>
              ))}
              {/* <Ionicons name="chevron-forward" size={18} color="#111" style={{ alignSelf: 'center' }} /> */}
            </ScrollView>

            {/* Payment row */}
            <Pressable style={styles.rowCard} onPress={() => { /* open payment picker later */ }}>
              <View style={styles.rowIcon}><Ionicons name="person-circle-outline" size={20} color="#111" /></View>
              <Text style={styles.rowMain}>{payMethod}</Text>
              <Ionicons name="chevron-forward" size={18} color="#111" />
            </Pressable>

            {/* Special request */}
            <View style={[styles.rowCard, { alignItems: 'center' }]}>
              <Ionicons name="sparkles-outline" size={18} color="#111" />
              <Text style={[styles.rowMain, { flex: 1, marginLeft: 10 }]}>I have special request</Text>
              <Switch
                    value={hasNote}
                    onValueChange={(v) => {
                        setHasNote(v);
                        if (v) {
                        navigation.navigate('SpecialRequest', {
                            initial: special,
                            onDone: (p) => { setSpecial(p); setHasNote(true); },
                            onCancel: () => setHasNote(false),
                        });
                        } else {
                        setSpecial({ caringPet: false, quietRide: false, note: '' });
                        }
                    }}
                    trackColor={{ true: MINT, false: '#E6E6E6' }}
                    thumbColor={hasNote ? '#111' : '#fff'}
                    />
            </View>

            {/* {hasNote && (
              <TextInput
                style={styles.noteBox}
                placeholder="Type your request for the driver…"
                placeholderTextColor="#9AA0A6"
                multiline
                value={note}
                onChangeText={setNote}
              />
            )} */}
          </ScrollView>

          {/* CTA */}
          <Pressable style={styles.cta} onPress={confirm} disabled={!selected}>
            <Text style={styles.ctaText}>Confirm and Request</Text>
            <View style={styles.ctaIcon}>
              <AntDesign name="arrowright" size={18} color="#111" />
            </View>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

/* -------- Fare card ---------- */
function FareCard({
  quote, selected, onPress,
}: { quote: FareQuote; selected?: boolean; onPress?: () => void; }) {
//  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    //  const nextScreen =() => {
    //     navigation.navigate('ConfirmRequest')
    //     };
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        selected && { borderColor: '#111', backgroundColor: ''   },
      ]}
    >
      {/* left price slab */}
      <View style={styles.priceSlab}>
        <Text style={styles.priceNow}>${quote.price}</Text>
        {!!quote.oldPrice && <Text style={styles.priceOld}>${quote.oldPrice}</Text>}
      </View>

      {/* right car tile */}
      <View style={styles.carTile} >
       
        <Text style={styles.tierTitle}>{quote.tier} {quote.seatText ? <Text style={styles.tierSub}>{quote.seatText}</Text> : null}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
          {quote.image ? (
            // eslint-disable-next-line react-native/no-inline-styles
            <View style={{ width: 88, height: 40 , overflow: 'hidden', borderRadius: 8 }}>
              {/* <Image source={quote.image} style={{ width: '100%', height: '100%' }} resizeMode="cover" /> */}
            </View>
          ) : (
            // <MaterialCommunityIcons name="car-estate" size={56} color="#111" />
              <Image source={assets.images.escaladeIcon} style={{ width: 168, height: 50 }} resizeMode="contain" />
            // <Image source={quote.image} style={{ width: 100, height: '100%' }} resizeMode="cover" /> 
          )}
        </View>
        
      </View>
    </Pressable>
  );
}

/* -------- styles ---------- */

const styles = StyleSheet.create({
  fill: { flex: 1 },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'transparent' },

  /* top overlay */
  overlayTop: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, paddingHorizontal: 12, flexDirection: 'row', justifyContent: 'space-between' },
  roundBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#EEE' },
  etaPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#111', borderRadius: 16, paddingHorizontal: 10, paddingVertical: 6 },
  etaNum: { color: '#fff', fontWeight: '800' },
  etaTxt: { color: '#fff' },

  sheetWrap: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },

  blurb: {
    color: '#111', fontSize: 12, fontWeight: '400', backgroundColor: '#F6F7F8', borderRadius: 12, padding: 5, lineHeight: 18,
  },

  card: {
    flexDirection: 'row',
    borderRadius: 16, borderWidth: 1, borderColor: '#EFEFEF', overflow: 'hidden', backgroundColor: '#EFEFEF',
  },
  priceSlab: {
    paddingHorizontal: 14, paddingVertical: 12, backgroundColor: '#EEEEEF', justifyContent: 'center', alignItems: 'center', flex: 1,
  },
  priceNow: { color: '#000', fontSize: 28, fontWeight: '800' },
  priceOld: { color: '#000', textDecorationLine: 'line-through', marginTop: 2 },

  carTile: {
    minWidth: 92, elevation: 2 , shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4,
    backgroundColor: '#fff', padding: 10, justifyContent: 'center', borderTopLeftRadius: 24, borderBottomLeftRadius: 24, 
  },
  tierTitle: { color: '#111', fontWeight: '800' , textAlign: 'center' },
  tierSub: { color: '#6C7075', fontWeight: '600' },

  chip: {
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, backgroundColor: '#F6F7F8', borderWidth: 1, borderColor: '#EEE',
  },
  chipTxt: { color: '#111', fontWeight: '700' },

  rowCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12,
    borderRadius: 12, borderWidth: 0, borderColor: '#EFEFEF', padding: 12, backgroundColor: '#fff',
  },
  rowIcon: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: '#F6F7F8', alignItems: 'center', justifyContent: 'center',
  },
  rowMain: { color: '#111', fontWeight: '700' },

  noteBox: {
    marginTop: 8, borderWidth: 1, borderColor: '#EFEFEF', borderRadius: 12, padding: 10, minHeight: 72, textAlignVertical: 'top', color: '#111',
  },

  cta: {
    margin: 16, height: 50, borderRadius: 28, backgroundColor: '#111',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  ctaText: { color: '#fff', fontWeight: '700' },
  ctaIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: MINT, alignItems: 'center', justifyContent: 'center' , position: 'absolute', right: 10, },

});
