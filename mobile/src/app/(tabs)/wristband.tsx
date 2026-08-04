import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/AppButton';
import { AppImage } from '@/components/AppImage';
import { ThemedText } from '@/components/themed-text';
import { WRISTBAND_DESCRIPTION, WRISTBAND_PRODUCTION_TIME, WRISTBAND_UNIT_PRICE, WRISTBAND_VARIANTS, type WristbandVariant } from '@/lib/content';

export default function WristbandScreen() {
  const router = useRouter();
  const [variant, setVariant] = useState<WristbandVariant>('without_qr');
  const [thumb, setThumb] = useState(0);
  const [qty, setQty] = useState(1);

  const v = WRISTBAND_VARIANTS[variant];
  const total = qty * WRISTBAND_UNIT_PRICE;

  const selectVariant = (key: WristbandVariant) => {
    if (key !== variant) {
      setVariant(key);
      setThumb(0);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingBottom: 100 }]}
      showsVerticalScrollIndicator={false}>
      <AppImage src="/banner/banner_4.png" style={styles.banner} radius={16} />

      {/* Product card */}
      <View style={styles.card}>
        {/* Main preview */}
        <View style={styles.preview}>
          <AppImage src={v.images[thumb]} style={styles.previewImg} contentFit="contain" />
        </View>

        {/* Thumbnails */}
        <View style={styles.thumbRow}>
          {v.images.map((img, i) => (
            <Pressable
              key={img}
              onPress={() => setThumb(i)}
              style={({ pressed }) => [
                styles.thumbWrap,
                i === thumb && styles.thumbWrapActive,
                pressed && styles.pressed,
              ]}>
              <AppImage src={img} style={styles.thumbImg} contentFit="cover" />
            </Pressable>
          ))}
        </View>

        {/* QR variant */}
        <View style={styles.variantBlock}>
          <ThemedText style={styles.label}>QR Code</ThemedText>
          <View style={styles.variantRow}>
            {(Object.keys(WRISTBAND_VARIANTS) as WristbandVariant[]).map((key) => {
              const active = variant === key;
              return (
                <Pressable
                  key={key}
                  onPress={() => selectVariant(key)}
                  style={[styles.variantPill, active && styles.variantPillActive]}>
                  <ThemedText style={[styles.variantText, active && styles.variantTextActive]}>
                    {WRISTBAND_VARIANTS[key].label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>

      {/* Description */}
      <View style={styles.card}>
        <ThemedText style={styles.label}>Description</ThemedText>
        <View style={styles.bulletList}>
          {WRISTBAND_DESCRIPTION.map((item) => (
            <View key={item} style={styles.bulletRow}>
              <View style={styles.bullet} />
              <ThemedText style={styles.bulletText}>{item}</ThemedText>
            </View>
          ))}
        </View>
      </View>

      {/* Quantity + Summary */}
      <View style={styles.card}>
        <View style={styles.qtyRow}>
          <ThemedText style={styles.label}>Print Quantity</ThemedText>
          <View style={styles.qtyControl}>
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
        </View>

        <View style={styles.divider} />

        <View style={styles.summaryRow}>
          <ThemedText style={styles.summaryLabel}>Production Time</ThemedText>
          <ThemedText style={styles.summaryValue}>{WRISTBAND_PRODUCTION_TIME}</ThemedText>
        </View>
        <View style={styles.summaryRow}>
          <ThemedText style={styles.summaryLabel}>Price per Wristband</ThemedText>
          <ThemedText style={styles.summaryValue}>Rp{WRISTBAND_UNIT_PRICE.toLocaleString('id-ID')}/pcs</ThemedText>
        </View>
      </View>

      <View style={styles.totalRow}>
        <View style={{ flex: 1 }}>
          <ThemedText style={styles.totalLabel}>Total Price</ThemedText>
          <ThemedText style={styles.totalHint}>Rp{WRISTBAND_UNIT_PRICE.toLocaleString('id-ID')} × {qty} pcs</ThemedText>
        </View>
        <ThemedText style={styles.totalValue}>Rp{total.toLocaleString('id-ID')}</ThemedText>
        <AppButton
          label="Order Now"
          icon="shopping-cart"
          style={{ marginLeft: 10, height: 38, paddingHorizontal: 14 }}
          onPress={() => router.push(`/wristband/order?variant=${variant}&qty=${qty}` as never)}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FB',
  },
  content: {
    padding: 16,
    gap: 14,
  },
  banner: {
    width: '100%',
    aspectRatio: 2103 / 748,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    gap: 14,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#495057',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  preview: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 10,
    backgroundColor: '#F7F9FB',
    overflow: 'hidden',
  },
  previewImg: {
    width: '100%',
    height: '100%',
  },
  thumbRow: {
    flexDirection: 'row',
    gap: 10,
  },
  thumbWrap: {
    width: 68,
    height: 68,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E9ECEF',
    overflow: 'hidden',
  },
  thumbWrapActive: {
    borderColor: '#0E9375',
  },
  thumbImg: {
    width: '100%',
    height: '100%',
  },
  variantBlock: {
    gap: 10,
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
  bulletList: {
    gap: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0E9375',
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    color: '#495057',
    lineHeight: 19,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DEE2E6',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  qtyBtnText: {
    fontSize: 16,
    color: '#0E9375',
    fontWeight: '700',
  },
  qtyValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1D2E',
    minWidth: 24,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F3F5',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#868E96',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1D2E',
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
  },
  totalLabel: {
    fontSize: 12,
    color: '#495057',
  },
  totalHint: {
    fontSize: 10,
    color: '#868E96',
    marginTop: 2,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0E9375',
    marginLeft: 10,
  },
  pressed: {
    opacity: 0.7,
  },
});
