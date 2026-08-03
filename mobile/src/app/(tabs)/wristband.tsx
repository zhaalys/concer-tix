import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/AppButton';
import { AppImage } from '@/components/AppImage';
import { ThemedText } from '@/components/themed-text';
import { WRISTBAND_DESCRIPTION, WRISTBAND_PRODUCTION_TIME, WRISTBAND_UNIT_PRICE, WRISTBAND_VARIANTS, type WristbandVariant } from '@/lib/content';

export default function WristbandScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [variant, setVariant] = useState<WristbandVariant>('without_qr');
  const [qty, setQty] = useState(1);

  const v = WRISTBAND_VARIANTS[variant];
  const total = qty * WRISTBAND_UNIT_PRICE;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingBottom: 40 + insets.bottom }]}
      showsVerticalScrollIndicator={false}>
      <AppImage src="/banner/banner_4.png" style={styles.banner} radius={20} />

      <View style={styles.body}>
        <ThemedText style={styles.sectionLabel}>QR CODE</ThemedText>
        <View style={styles.variantRow}>
          {(Object.keys(WRISTBAND_VARIANTS) as WristbandVariant[]).map((key) => {
            const active = variant === key;
            return (
              <Pressable
                key={key}
                onPress={() => setVariant(key)}
                style={[styles.variantPill, active && styles.variantPillActive]}>
                <ThemedText style={[styles.variantText, active && styles.variantTextActive]}>
                  {WRISTBAND_VARIANTS[key].label}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.imageRow}>
          {v.images.map((img) => (
            <AppImage key={img} src={img} style={styles.variantImg} contentFit="contain" />
          ))}
        </View>

        <ThemedText style={styles.sectionLabel}>Description</ThemedText>
        <View style={styles.bulletList}>
          {WRISTBAND_DESCRIPTION.map((item) => (
            <View key={item} style={styles.bulletRow}>
              <View style={styles.bullet} />
              <ThemedText style={styles.bulletText}>{item}</ThemedText>
            </View>
          ))}
        </View>

        <ThemedText style={styles.sectionLabel}>Print Quantity</ThemedText>
        <View style={styles.qtyRow}>
          <Pressable
            onPress={() => setQty((q) => Math.max(1, q - 1))}
            style={({ pressed }) => [styles.qtyBtn, pressed && styles.pressed]}>
            <ThemedText style={styles.qtyBtnText}>−</ThemedText>
          </Pressable>
          <ThemedText style={styles.qtyValue}>{qty}</ThemedText>
          <Pressable
            onPress={() => setQty((q) => q + 1)}
            style={({ pressed }) => [styles.qtyBtn, pressed && styles.pressed]}>
            <ThemedText style={styles.qtyBtnText}>+</ThemedText>
          </Pressable>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoBox}>
            <ThemedText style={styles.infoLabel}>Production Time</ThemedText>
            <ThemedText style={styles.infoValue}>{WRISTBAND_PRODUCTION_TIME}</ThemedText>
          </View>
          <View style={styles.infoBox}>
            <ThemedText style={styles.infoLabel}>Price per Wristband</ThemedText>
            <ThemedText style={styles.infoValue}>Rp{WRISTBAND_UNIT_PRICE.toLocaleString('id-ID')}/pcs</ThemedText>
          </View>
        </View>

        <View style={styles.totalRow}>
          <ThemedText style={styles.totalLabel}>Total Price</ThemedText>
          <ThemedText style={styles.totalValue}>Rp{total.toLocaleString('id-ID')}</ThemedText>
        </View>

        <AppButton
          label="Order Now"
          onPress={() => router.push(`/wristband/order?variant=${variant}&qty=${qty}` as never)}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 16,
    gap: 16,
  },
  banner: {
    width: '100%',
    height: 160,
  },
  body: {
    gap: 14,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#495057',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  variantRow: {
    flexDirection: 'row',
    gap: 10,
  },
  variantPill: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#DEE2E6',
  },
  variantPillActive: {
    backgroundColor: '#E6F7F4',
    borderColor: '#0E9375',
  },
  variantText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#495057',
  },
  variantTextActive: {
    color: '#0E9375',
  },
  imageRow: {
    flexDirection: 'row',
    gap: 8,
  },
  variantImg: {
    flex: 1,
    aspectRatio: 1,
  },
  bulletList: {
    gap: 6,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bullet: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#0E9375',
  },
  bulletText: {
    fontSize: 13,
    color: '#495057',
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  qtyBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DEE2E6',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  qtyBtnText: {
    fontSize: 20,
    color: '#0E9375',
    fontWeight: '700',
  },
  qtyValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1D2E',
    minWidth: 30,
    textAlign: 'center',
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  infoBox: {
    flex: 1,
    backgroundColor: '#F7F9FB',
    borderRadius: 10,
    padding: 12,
    gap: 4,
  },
  infoLabel: {
    fontSize: 11,
    color: '#868E96',
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1D2E',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  totalLabel: {
    fontSize: 14,
    color: '#495057',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0E9375',
  },
  pressed: {
    opacity: 0.7,
  },
});
