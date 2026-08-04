import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
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
import { ScreenHeader } from '@/components/ScreenHeader';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { SUPPORT_WHATSAPP, WRISTBAND_INVOICE_MSG, WRISTBAND_ISSUE_MSG, WRISTBAND_VARIANTS } from '@/lib/content';
import { formatDateFull } from '@/lib/format';
import { openSnap } from '@/lib/payment';
import type { WristbandOrder } from '@/lib/types';

export default function WristbandNotaScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [order, setOrder] = useState<WristbandOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.getWristbandOrderByCode(code ?? '');
      setOrder(res.data);
    } catch {
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      router.replace('/login' as never);
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, user, router]);

  const handlePay = async () => {
    if (!order) return;
    setPaying(true);
    try {
      const tokenRes = await api.createWristbandPaymentToken(order.order_code);
      await openSnap(tokenRes.token);
      await api.updateWristbandOrderStatus(order.order_code, { status: 'paid' });
      await load();
    } catch {
      alert('Pembayaran gagal.');
    } finally {
      setPaying(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Wristband Order" />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 120 + insets.bottom }]} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator color="#0E9375" style={{ marginVertical: 48 }} />
        ) : !order ? (
          <ThemedText style={styles.notFound}>Order tidak ditemukan.</ThemedText>
        ) : (
          <>
            <View style={styles.headerRow}>
              <ThemedText style={styles.mono}>{order.order_code}</ThemedText>
              <View style={[styles.statusBadge, order.status === 'paid' ? styles.statusPaid : styles.statusPending]}>
                <ThemedText style={[styles.statusText, order.status === 'paid' ? styles.statusTextPaid : styles.statusTextPending]}>
                  {order.status}
                </ThemedText>
              </View>
            </View>
            <ThemedText style={styles.createdAt}>{order.created_at ? formatDateFull(order.created_at) : ''}</ThemedText>

            <Section label="Order Detail">
              <DetailRow label="Variant" value={WRISTBAND_VARIANTS[order.variant as keyof typeof WRISTBAND_VARIANTS]?.label ?? order.variant} />
              <DetailRow label="Quantity" value={String(order.quantity)} />
              <DetailRow label="Unit Price" value={`Rp${order.unit_price.toLocaleString('id-ID')}`} />
            </Section>

            <View style={styles.totalRow}>
              <ThemedText style={styles.totalLabel}>Total</ThemedText>
              <ThemedText style={styles.totalValue}>Rp{order.total_amount.toLocaleString('id-ID')}</ThemedText>
            </View>

            {order.payment_method ? (
              <Section label="Payment">
                <ThemedText style={styles.metaText}>{order.payment_method}</ThemedText>
                {order.paid_at ? <ThemedText style={styles.createdAt}>{formatDateFull(order.paid_at)}</ThemedText> : null}
              </Section>
            ) : null}

            <Section label="Shipping">
              <DetailRow label="Nama" value={order.customer_name} />
              <DetailRow label="No. WhatsApp" value={order.customer_whatsapp} />
              <DetailRow label="Alamat" value={order.shipping_address} />
            </Section>

            <View style={styles.actions}>
              {order.status === 'pending' ? (
                <>
                  <AppButton
                    label={paying ? 'Processing...' : 'Continue Payment'}
                    loading={paying}
                    variant="dark"
                    onPress={handlePay}
                  />
                  <Pressable
                    onPress={() =>
                      Linking.openURL(
                        `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(WRISTBAND_ISSUE_MSG(order.order_code))}`
                      )
                    }
                    style={({ pressed }) => [styles.report, pressed && styles.pressed]}>
                    <ThemedText style={styles.reportText}>Report an Issue</ThemedText>
                  </Pressable>
                </>
              ) : (
                <Pressable
                  onPress={() =>
                    Linking.openURL(
                      `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(WRISTBAND_INVOICE_MSG(order))}`
                    )
                  }
                  style={({ pressed }) => [styles.report, pressed && styles.pressed]}>
                  <ThemedText style={styles.reportText}>Send Invoice to WhatsApp</ThemedText>
                </Pressable>
              )}
              <AppButton label="My Orders" variant="outline" onPress={() => router.push('/tickets' as never)} />
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
    padding: 24,
    gap: 20,
  },
  notFound: {
    fontSize: 14,
    color: '#868E96',
    textAlign: 'center',
    marginTop: 24,
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
    color: '#A0A0A0',
  },
  detailValue: {
    fontSize: 14,
    color: '#37352F',
    flexShrink: 1,
    textAlign: 'right',
  },
  metaText: {
    fontSize: 14,
    color: '#37352F',
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
  actions: {
    gap: 12,
  },
  report: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    paddingVertical: 12,
  },
  reportText: {
    fontSize: 14,
    color: '#37352F',
  },
  pressed: {
    opacity: 0.8,
  },
});
