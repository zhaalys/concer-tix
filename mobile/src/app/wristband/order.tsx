import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/AppButton';
import { AppImage } from '@/components/AppImage';
import { FormInput } from '@/components/FormInput';
import { ScreenHeader } from '@/components/ScreenHeader';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { PAYMENT_GROUP_ORDER, PAYMENT_METHODS, WRISTBAND_UNIT_PRICE, WRISTBAND_VARIANTS } from '@/lib/content';
import { formatPhone, isValidPhone, phoneDigits } from '@/lib/format';
import { openSnap } from '@/lib/payment';
import type { WristbandOrder } from '@/lib/types';

type Stage = 'form' | 'payment' | 'creating' | 'done';

export default function WristbandOrderScreen() {
  const params = useLocalSearchParams<{ variant?: string; qty?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const variant = params.variant === 'with_qr' ? 'with_qr' : 'without_qr';
  const qty = Math.max(1, parseInt(params.qty ?? '1', 10) || 1);

  const [stage, setStage] = useState<Stage>('form');
  const [paymentMethod, setPaymentMethod] = useState<string>('bca_va');
  const [order, setOrder] = useState<WristbandOrder | null>(null);
  const [name, setName] = useState(user?.display_name ?? '');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  const total = useMemo(() => qty * WRISTBAND_UNIT_PRICE, [qty]);
  const phoneDigitsStr = phoneDigits(whatsapp);
  const phoneValid = isValidPhone(phoneDigitsStr);
  const canSubmitForm = !!name.trim() && phoneValid && !!address.trim();

  useEffect(() => {
    if (!user) {
      router.replace('/login?next=/wristband/order' as never);
    }
  }, [user, router]);

  const handlePhoneChange = (text: string) => {
    let digits = text.replace(/\D/g, '');
    if (digits.startsWith('62')) digits = digits.slice(2);
    else if (digits.startsWith('0')) digits = digits.slice(1);
    setWhatsapp(digits ? `+62 ${digits.slice(0, 13)}` : '');
  };

  const handlePlaceOrder = async () => {
    setStage('creating');
    setError('');
    try {
      const selectedMethod = PAYMENT_METHODS.find((m) => m.id === paymentMethod) ?? PAYMENT_METHODS[0];
      const res = await api.createWristbandOrder({
        variant,
        quantity: qty,
        customer_name: name.trim(),
        customer_whatsapp: formatPhone(phoneDigitsStr),
        shipping_address: address.trim(),
        user_id: user?.id ?? null,
      });

      // Handle Midtrans Snap Payment
      const tokenRes = await api.createWristbandPaymentToken(res.data.order_code);
      await openSnap(tokenRes.token);
      const paid = await api.updateWristbandOrderStatus(res.data.order_code, {
        status: 'paid',
        payment_method: selectedMethod.label,
      });

      setOrder(paid.data);
      setStage('done');
    } catch (e: any) {
      setError(e?.message || 'Terjadi kesalahan saat memproses pesanan.');
      setStage('payment');
    }
  };

  if (stage === 'creating') {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Order Wristband" />
        <ActivityIndicator color="#0E9375" size="large" style={{ marginTop: 60 }} />
        <ThemedText style={styles.loadingText}>Processing order & payment...</ThemedText>
      </View>
    );
  }

  if (stage === 'done' && order) {
    const waMsg = encodeURIComponent(
      `Halo Concer TIX! Saya telah melakukan pemesanan wristband:\n\n` +
        `Order Code: ${order.order_code}\n` +
        `Variant: ${WRISTBAND_VARIANTS[order.variant].label}\n` +
        `Quantity: ${order.quantity}\n` +
        `Total: Rp ${order.total_amount.toLocaleString('id-ID')}\n` +
        `Status: ${order.status === 'paid' ? 'Lunas' : 'Pending'}\n` +
        `Nama: ${order.customer_name}\n` +
        `WhatsApp: ${order.customer_whatsapp}\n` +
        `Alamat: ${order.shipping_address}\n\n` +
        `Mohon konfirmasi dan info pengiriman. Terima kasih.`
    );

    return (
      <View style={styles.container}>
        <ScreenHeader title="Order Wristband" />
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: 60 + insets.bottom }]}
          showsVerticalScrollIndicator={false}>
          <View style={styles.successWrap}>
            <View style={styles.lanyardContainer}>
              <AppImage src="/history_lanyard/lanyard_accept.png" style={styles.lanyardImgLarge} contentFit="contain" />
              <View style={styles.badgeTextOverlay}>
                <View style={styles.badgeSuccessHeader}>
                  <MaterialIcons name="check-circle" size={20} color="#0E9375" />
                  <ThemedText style={styles.badgeSuccessTitle}>PAYMENT SUCCESSFUL</ThemedText>
                </View>

                <View style={styles.badgeDivider} />

                <View style={styles.badgeRow}>
                  <ThemedText style={styles.badgeLabel}>Variant</ThemedText>
                  <ThemedText numberOfLines={1} style={styles.badgeValue}>
                    {WRISTBAND_VARIANTS[order.variant].label}
                  </ThemedText>
                </View>
                <View style={styles.badgeRow}>
                  <ThemedText style={styles.badgeLabel}>Order Code</ThemedText>
                  <ThemedText style={[styles.badgeValue, { fontFamily: 'monospace' }]}>
                    {order.order_code}
                  </ThemedText>
                </View>
                <View style={styles.badgeRow}>
                  <ThemedText style={styles.badgeLabel}>Quantity</ThemedText>
                  <ThemedText style={styles.badgeValue}>{order.quantity} pcs</ThemedText>
                </View>
                <View style={styles.badgeRow}>
                  <ThemedText style={styles.badgeLabel}>Total</ThemedText>
                  <ThemedText style={styles.badgeValueBold}>
                    Rp{order.total_amount.toLocaleString('id-ID')}
                  </ThemedText>
                </View>
              </View>
            </View>

            <Section label="Shipping Info">
              <DetailRow label="Nama" value={order.customer_name} />
              <DetailRow label="No. WhatsApp" value={order.customer_whatsapp} />
              <DetailRow label="Alamat" value={order.shipping_address} />
            </Section>

            <AppButton
              label="Send Invoice to WhatsApp"
              variant="dark"
              style={{ width: '100%' }}
              onPress={() => {
                Linking.openURL(`https://wa.me/6281316936289?text=${waMsg}`);
              }}
            />
            <AppButton label="My Orders" variant="outline" style={{ width: '100%' }} onPress={() => router.push('/tickets' as never)} />
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title="Order Wristband" subtitle={stage === 'payment' ? 'Pilih Metode Pembayaran' : 'Isi Data Pengiriman'} />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 120 + insets.bottom }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {stage === 'form' ? (
          <>
            <ThemedText style={styles.subtitle}>Complete your wristband order</ThemedText>

            <Section label="Order Detail">
              <DetailRow label="Variant" value={WRISTBAND_VARIANTS[variant].label} />
              <DetailRow label="Quantity" value={`${qty} pcs`} />
              <DetailRow label="Unit Price" value={`Rp${WRISTBAND_UNIT_PRICE.toLocaleString('id-ID')}/pcs`} />
            </Section>

            <View style={styles.totalRow}>
              <ThemedText style={styles.totalLabel}>Total</ThemedText>
              <ThemedText style={styles.totalValue}>Rp{total.toLocaleString('id-ID')}</ThemedText>
            </View>

            <ThemedText style={styles.shipTitle}>Shipping Information</ThemedText>
            <View style={styles.form}>
              <FormInput
                label="Nama Lengkap"
                placeholder="e.g. John Doe"
                value={name}
                onChangeText={setName}
                required
              />
              <FormInput
                label="No. WhatsApp *"
                placeholder="+62 8xxxxxxxxx"
                value={whatsapp}
                onChangeText={handlePhoneChange}
                keyboardType="phone-pad"
                error={
                  whatsapp
                    ? phoneValid
                      ? undefined
                      : 'Nomor tidak valid, minimal 10 digit setelah +62'
                    : undefined
                }
                valid={phoneValid ? `Tersimpan sebagai ${formatPhone(phoneDigitsStr)}` : undefined}
              />
              <FormInput
                label="Alamat Pengiriman"
                placeholder="e.g. Jl. Merdeka No. 1, Jakarta"
                value={address}
                onChangeText={setAddress}
                multiline
                numberOfLines={3}
                required
                style={styles.textarea}
              />
            </View>

            {error ? (
              <View style={styles.errorBox}>
                <ThemedText style={styles.errorText}>{error}</ThemedText>
              </View>
            ) : null}

            <View style={styles.actions}>
              <AppButton
                label="Lanjutkan ke Pembayaran"
                variant="dark"
                disabled={!canSubmitForm}
                onPress={() => setStage('payment')}
              />
              <Pressable
                onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
                style={({ pressed }) => [styles.back, pressed && styles.pressed]}>
                <ThemedText style={styles.backText}>Back</ThemedText>
              </Pressable>
            </View>
          </>
        ) : (
          <>
            <ThemedText style={styles.payTitle}>Metode Pembayaran</ThemedText>
            {PAYMENT_GROUP_ORDER.map((group) => (
              <View key={group} style={styles.payGroup}>
                <ThemedText style={styles.payGroupTitle}>{group}</ThemedText>
                <View style={styles.payGrid}>
                  {PAYMENT_METHODS.filter((m) => m.group === group).map((m) => {
                    const selected = paymentMethod === m.id;
                    return (
                      <Pressable
                        key={m.id}
                        onPress={() => setPaymentMethod(m.id)}
                        style={[styles.payCard, selected && styles.payCardSelected]}>
                        <AppImage src={m.image} style={styles.payLogo} contentFit="contain" />
                        <ThemedText style={[styles.payLabel, selected && styles.payLabelSelected]} numberOfLines={2}>
                          {m.label}
                        </ThemedText>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ))}
            <ThemedText style={styles.payFootnote}>Semua metode pembayaran tersedia melalui Midtrans Snap.</ThemedText>

            <View style={styles.totalCard}>
              <View style={styles.totalRow}>
                <ThemedText style={styles.totalLabel}>Total Bayar</ThemedText>
                <ThemedText style={styles.totalValue}>Rp{total.toLocaleString('id-ID')}</ThemedText>
              </View>
            </View>

            {error ? (
              <View style={styles.errorBox}>
                <ThemedText style={styles.errorText}>{error}</ThemedText>
              </View>
            ) : null}

            <View style={styles.actions}>
              <AppButton label="Bayar Sekarang" variant="dark" onPress={handlePlaceOrder} />
              <Pressable onPress={() => setStage('form')} style={({ pressed }) => [styles.back, pressed && styles.pressed]}>
                <ThemedText style={styles.backText}>Kembali ke Form</ThemedText>
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <ThemedText style={styles.sectionLabel}>{label}</ThemedText>
      {children}
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <ThemedText style={styles.detailLabel}>{label}</ThemedText>
      <ThemedText style={styles.detailValue}>{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 20,
    gap: 20,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 12,
    color: '#868E96',
    fontSize: 14,
  },
  subtitle: {
    fontSize: 14,
    color: '#495057',
  },
  section: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B0B0B0',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#495057',
  },
  detailValue: {
    fontSize: 14,
    color: '#1A1D2E',
    fontWeight: '500',
    flexShrink: 1,
    textAlign: 'right',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 15,
    color: '#495057',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1D2E',
  },
  shipTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B0B0B0',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  form: {
    gap: 14,
  },
  textarea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    padding: 10,
  },
  errorText: {
    fontSize: 13,
    color: '#DC2626',
  },
  actions: {
    gap: 12,
  },
  back: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  backText: {
    fontSize: 14,
    color: '#9B9B9B',
  },
  payTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1D2E',
  },
  payGroup: {
    gap: 10,
  },
  payGroupTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9B9B9B',
    textTransform: 'uppercase',
  },
  payGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  payCard: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EBEBEB',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    gap: 6,
  },
  payCardSelected: {
    borderColor: '#0E9375',
    borderWidth: 1.5,
    backgroundColor: '#F0FAF7',
  },
  payLogo: {
    width: 48,
    height: 28,
  },
  payLabel: {
    fontSize: 11,
    color: '#495057',
    textAlign: 'center',
  },
  payLabelSelected: {
    fontWeight: '700',
    color: '#0E9375',
  },
  payFootnote: {
    fontSize: 12,
    color: '#BDBDBD',
  },
  totalCard: {
    borderWidth: 1,
    borderColor: '#EBEBEB',
    borderRadius: 8,
    padding: 16,
  },
  successWrap: {
    alignItems: 'center',
    gap: 16,
  },
  lanyardContainer: {
    position: 'relative',
    width: '100%',
    maxWidth: 420,
    aspectRatio: 1,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lanyardImgLarge: {
    width: '100%',
    height: '100%',
  },
  badgeTextOverlay: {
    position: 'absolute',
    top: '47%',
    bottom: '7%',
    left: '11%',
    right: '11%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'center',
    gap: 5,
  },
  badgeSuccessHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  badgeSuccessTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1A1D2E',
    textAlign: 'center',
    letterSpacing: 0.4,
  },
  badgeDivider: {
    borderTopWidth: 1,
    borderTopColor: '#EBEBEB',
    borderStyle: 'dashed',
    marginVertical: 3,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  badgeLabel: {
    fontSize: 12,
    color: '#868E96',
  },
  badgeValue: {
    fontSize: 12,
    color: '#1A1D2E',
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'right',
  },
  badgeValueBold: {
    fontSize: 13,
    color: '#0E9375',
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.8,
  },
});
