import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'WhyChooseUs'>;

const MINT = '#B9FBE7';

const FEATURES: { icon: string; title: string; sub: string }[] = [
  { icon: 'shield-check-outline', title: 'Guaranteed', sub: '20+ years of reliable pickup' },
  { icon: 'lock-outline', title: 'Flat Fixed Rate', sub: 'No surge or per km/minute charges' },
  { icon: 'clock-outline', title: 'Cancellation & Changes', sub: 'Up to 1 hour before pickup' },
  { icon: 'checkbox-multiple-marked-outline', title: 'Square hold funds', sub: 'Charge after drop-off' },
  { icon: 'baby-carriage', title: 'FREE child car seats', sub: '' },
  { icon: 'hand-truck', title: 'Luggage assistance', sub: '' },
];

export default function WhyChooseUsModal({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();

  const close = () => {
    route.params?.onClose?.();
    navigation.goBack();
  };

  return (
    <View style={styles.fill}>
      {/* tap outside to dismiss */}
      <Pressable style={styles.backdrop} onPress={close} />

      <SafeAreaView edges={['bottom']} style={styles.panelWrap}>
        <View style={[styles.panel, { paddingTop: insets.top + 8 }]}>
          {/* Top right Close */}
          <Pressable style={styles.closeBtn} onPress={close} hitSlop={10}>
            <Text style={styles.closeTxt}>Close</Text>
          </Pressable>

          <ScrollView
            contentContainerStyle={{ padding: 16, paddingBottom: 28 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Brand pill */}
            <View style={styles.brandPill}>
              <Text style={styles.brandText}>hop’n™</Text>
            </View>

            {/* Big heading */}
            <Text style={styles.h1}>
              More Than A{'\n'}Ride. Why{'\n'}Choose us?
            </Text>

            {/* Feature list */}
            <View style={{ marginTop: 6 }}>
              {FEATURES.map((f, idx) => (
                <View key={idx} style={styles.row}>
                  <View style={styles.rowIcon}>
                    <MaterialCommunityIcons name={f.icon as any} size={22} color="#111" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.rowTitle}>{f.title}</Text>
                    {!!f.sub && <Text style={styles.rowSub}>{f.sub}</Text>}
                  </View>
                </View>
              ))}
            </View>

            {/* Info cards */}
            <View style={{ gap: 10, marginTop: 10, backgroundColor: MINT }}>
              <InfoCard
                title="Flight Delayed? No Problem:"
                body="Hop’n tracks your flight and adjusts your pickup time automatically. Whether it’s a flight delay or baggage hold-up, we’ve got you covered. Simply choose “By flight arrival” and let your captain ensure a smooth pickup experience"
              />
              <InfoCard
                title="Enjoy Unlimited Wait Time:"
                body="Lost baggage? Customs or immigration delays? No worries—your driver will wait as long as needed"
              />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

function InfoCard({ title, body }: { title: string; body: string }) {
  return (
    <View style={cardStyles.wrap}>
      {/* <View style={cardStyles.badge}>
        <Ionicons name="information-circle-outline" size={16} color="#111" />
      </View> */}
      <Text style={cardStyles.title}>{title}</Text>
      <Text style={cardStyles.body}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1,padding:20 },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.15)' },

  panelWrap: { flex: 1 },
  panel: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderRadius: 24,
    overflow: 'hidden',
  },

  closeBtn: { position: 'absolute', right: 14, top: 40, zIndex: 2 },
  closeTxt: { color: '#9AA0A6', fontFamily: 'BiennaleBold' },

  brandPill: {
    alignSelf: 'flex-start',
    backgroundColor: MINT,
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 10,
    width: 140,
    textAlign: 'center',
  },
  brandText: {  fontSize: 20, color: '#111', textAlign: 'center', fontFamily: 'BiennaleBold' },

  h1: { fontSize: 38, color: '#111', lineHeight: 46, marginBottom: 12, fontFamily: 'BiennaleBold' },

  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  rowIcon: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#F6F7F8', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#EEE',
  },
  rowTitle: { color: '#111', fontFamily: 'BiennaleBold' },
  rowSub: { color: '#666', marginTop: 2, fontFamily: 'BiennaleRegular' },

});

const cardStyles = StyleSheet.create({
  wrap: {
    backgroundColor: MINT,
    borderRadius: 12,
    padding: 12,
  },
  badge: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    marginBottom: 6,
    borderWidth: 1, borderColor: '#DDF6EE',
  },
  title: { color: '#111', marginBottom: 4, fontFamily: 'BiennaleBold' },
  body: { color: '#233', lineHeight: 18, fontFamily: 'BiennaleRegular' },
});
