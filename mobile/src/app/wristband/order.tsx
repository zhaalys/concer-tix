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
import { FormInput } from '@/components/FormInput';
import { ScreenHeader } from '@/components/ScreenHeader';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { WRISTBAND_INVOICE_MSG, WRISTBAND_UNIT_PRICE, WRISTBAND_VARIANTS } from '@/lib/content';
import { formatPhone, isValidPhone, phoneDigits } from '@/lib/format';
import type { WristbandOrder } from '@/lib/types';

type Stage = 'form' | 'creating' | 'done';

export default function WristbandOrderScreen() {
  const params = useLocalSearchParams<{ variant?: string; qty?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const variant = params.variant === 'with_qr' ? 'with_qr' : 'without_qr';
  const qty = Math.max(1, parseInt(params.qty ?? '1', 10) || 1);

  const [stage, setStage] = useState<Stage>('form');
  const [order, setOrder] = useState<WristbandOrder | null>(null);
  const [name, setName] = useState(user?.display_name ?? '');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  const total = useMemo(() => qty * WRISTBAND_UNIT_PRICE, [qty]);
  const phoneDigitsStr = phoneDigits(whatsapp);
  const phoneValid = isValidPhone(phoneDigitsStr);
  const canSubmit = !!name.trim() && phoneValid && !!address.trim();

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
      const res = await api.createWristbandOrder({
        variant,
        quantity: qty,
        customer_name: name.trim(),
        customer_whatsapp: formatPhone(phoneDigitsStr),
        shipping_address: address.trim(),
        user_id: user?.id ?? null,
      });
      setOrder(res.data);
      setStage('done');
    } catch (e: any) {
      setError(e?.message || 'Terjadi kesalahan');
      setStage('form');
    }
  };

  if (stage === 'creating') {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Order Wristband" />
        <ActivityIndicator color="#0E9375" style={{ marginTop: 60 }} />
        <ThemedText style={styles.loadingText}>Creating order...</ThemedText>
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
          <View style={styles.headerRow}>
            <ThemedText style={styles.mono}>{order.order_code}</ThemedText>
            <View
              style={[
                styles.statusBadge,
                order.status === 'paid' ? styles.statusPaid : styles.statusPending,
              ]}>
              <ThemedText
                style={[
                  styles.statusText,
                  order.status === 'paid' ? styles.statusTextPaid : styles.statusTextPending,
                ]}>
                {order.status === 'paid' ? 'Paid' : 'Pending'}
              </ThemedText>
            </View>
          </View>
          <ThemedText style={styles.createdAt}>{new Date(order.created_at).toLocaleString()}</ThemedText>

          <Section label="Order Detail">
            <DetailRow label="Variant" value={WRISTBAND_VARIANTS[order.variant].label} />
            <DetailRow label="Quantity" value={String(order.quantity)} />
            {order.payment_method && <DetailRow label="Payment" value={order.payment_method} />}
          </Section>

          <View style={styles.totalRow}>
            <ThemedText style={styles.totalLabel}>Total</ThemedText>
            <ThemedText style={styles.totalValue}>Rp{order.total_amount.toLocaleString('id-ID')}</ThemedText>
          </View>

          <Section label="Shipping">
            <DetailRow label="Nama" value={order.customer_name} />
            <DetailRow label="No. WhatsApp" value={order.customer_whatsapp} />
            <DetailRow label="Alamat" value={order.shipping_address} />
          </Section>

          <ThemedText style={styles.doneMsg}>
            {order.status === 'paid'
              ? 'Payment confirmed. We will process your order shortly.'
              : 'Please complete your payment using the instructions shown. Status will update once confirmed.'}
          </ThemedText>

          <AppButton
            label="Send Invoice to WhatsApp"
            variant="dark"
            onPress={() => {
              Linking.openURL(`https://wa.me/6281316936289?text=${waMsg}`);
            }}
          />
          <AppButton label="My Orders" variant="outline" onPress={() => router.push('/tickets' as never)} />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title="Order Wristband" />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 120 + insets.bottom }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <ThemedText style={styles.subtitle}>Complete your wristband order</ThemedText>

        <Section label="Order Detail">
          <DetailRow label="Variant" value={WRISTBAND_VARIANTS[variant].label} />
          <DetailRow label="Quantity" value={String(qty)} />
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
          <AppButton label="Place Order" variant="dark" disabled={!canSubmit} onPress={handlePlaceOrder} />
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
            style={({ pressed }) => [styles.back, pressed && styles.pressed]}>
            <ThemedText style={styles.backText}>Back</ThemedText>
          </Pressable>
        </View>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mono: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#1A1D2E',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusPaid: {
    backgroundColor: '#EEEEEE',
  },
  statusPending: {
    backgroundColor: '#FFF3D6',
  },
  statusText: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  statusTextPaid: {
    color: '#37352F',
  },
  statusTextPending: {
    color: '#B45309',
  },
  createdAt: {
    fontSize: 13,
    color: '#A0A0A0',
  },
  doneMsg: {
    fontSize: 13,
    color: '#6B6B6B',
    lineHeight: 19,
  },
  pressed: {
    opacity: 0.8,
  },
});
