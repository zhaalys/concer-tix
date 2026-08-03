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
import { PAYMENT_METHODS, SUPPORT_WHATSAPP, TICKET_ISSUE_MSG } from '@/lib/content';
import { formatDateFull, formatPrice, formatWhatsAppTime } from '@/lib/format';
import { openSnap } from '@/lib/payment';
import type { Order } from '@/lib/types';

export default function OrderNotaScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.getOrderByCode(code ?? '');
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

  const attendee = order?.attendees?.[0];
  const isPaid = order?.status === 'paid';

  const handlePay = async () => {
    if (!order) return;
    setPaying(true);
    setPayError('');
    try {
      const orderId = `${order.order_code}-${Date.now()}`;
      const tokenRes = await api.createPaymentToken({
        orderId,
        amount: order.total_amount,
        name: attendee?.booker_name || attendee?.full_name || user?.display_name || 'User',
        email: attendee?.email || user?.email || '',
        category: { id: order.items?.[0]?.ticket_label || 'Reguler', label: order.items?.[0]?.ticket_label || 'Reguler' },
        enabledPayments: PAYMENT_METHODS.map((m) => m.snapKey),
      });
      await openSnap(tokenRes.token);
      await api.updateOrderStatus(order.order_code, {
        status: 'paid',
        payment_method: 'midtrans',
        payment_token: orderId,
      });
      await load();
    } catch (e: any) {
      setPayError(e?.message || 'Pembayaran gagal. Silakan coba lagi.');
    } finally {
      setPaying(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Invoice" />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 120 + insets.bottom }]} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator color="#0E9375" style={{ marginVertical: 48 }} />
        ) : !order ? (
          <ThemedText style={styles.notFound}>Order tidak ditemukan.</ThemedText>
        ) : (
          <>
            <View style={styles.headerRow}>
              <ThemedText style={styles.invoiceTitle}>Invoice</ThemedText>
              <View style={[styles.statusBadge, isPaid ? styles.statusPaid : styles.statusOther]}>
                <ThemedText style={[styles.statusText, isPaid ? styles.statusTextPaid : styles.statusTextOther]}>
                  {order.status}
                </ThemedText>
              </View>
            </View>
            <ThemedText style={styles.mono}>{order.order_code}</ThemedText>
            <ThemedText style={styles.createdAt}>{formatWhatsAppTime(order.created_at)}</ThemedText>

            <Section label="Event">
              <ThemedText style={styles.eventTitle}>{order.event?.title}</ThemedText>
              <ThemedText style={styles.eventMeta}>
                {order.event?.event_date} • {order.event?.event_time}
              </ThemedText>
              <ThemedText style={styles.eventMeta}>{order.event?.location}</ThemedText>
            </Section>

            <Section label="Tickets">
              {order.items.map((item) => (
                <View key={item.ticket_label} style={styles.row}>
                  <ThemedText style={styles.rowLabel}>
                    {item.ticket_label} × {item.quantity}
                  </ThemedText>
                  <ThemedText style={styles.rowValue}>{formatPrice(item.subtotal)}</ThemedText>
                </View>
              ))}
              <View style={styles.divider} />
              <View style={styles.row}>
                <ThemedText style={styles.totalLabel}>Total</ThemedText>
                <ThemedText style={styles.totalValue}>{formatPrice(order.total_amount)}</ThemedText>
              </View>
            </Section>

            {order.payment_method && (
              <Section label="Payment">
                <ThemedText style={styles.eventMeta}>{order.payment_method}</ThemedText>
                {order.paid_at && <ThemedText style={styles.createdAt}>{formatDateFull(order.paid_at)}</ThemedText>}
              </Section>
            )}

            {attendee && (
              <Section label="Detail Tiket">
                {attendee.full_name && <DetailRow label="Nama" value={attendee.full_name} />}
                {attendee.booker_name && <DetailRow label="Pemesan" value={attendee.booker_name} />}
                {attendee.email && <DetailRow label="Email" value={attendee.email} />}
                {attendee.whatsapp && <DetailRow label="WhatsApp" value={attendee.whatsapp} />}
                {attendee.identity_type && (
                  <DetailRow
                    label="Identitas"
                    value={`${attendee.identity_type.toUpperCase()} — ${attendee.identity_number}`}
                  />
                )}
                {attendee.gender && <DetailRow label="Gender" value={attendee.gender === 'male' ? 'Laki-laki' : 'Perempuan'} />}
                {attendee.age != null && <DetailRow label="Usia" value={String(attendee.age)} />}
                {attendee.domicile && <DetailRow label="Domisili" value={attendee.domicile} />}
              </Section>
            )}

            {payError && (
              <View style={styles.errorBox}>
                <ThemedText style={styles.errorText}>{payError}</ThemedText>
              </View>
            )}

            <View style={styles.actions}>
              {isPaid ? (
                <AppButton
                  label="View E-Ticket"
                  variant="dark"
                  onPress={() => router.push(`/my-tickets/${order.order_code}/qr` as never)}
                />
              ) : (
                <>
                  <AppButton
                    label={paying ? 'Processing...' : 'Pay Now'}
                    loading={paying}
                    variant="dark"
                    onPress={handlePay}
                  />
                  <Pressable
                    onPress={() =>
                      Linking.openURL(
                        `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(TICKET_ISSUE_MSG(order.order_code, order.event?.title ?? ''))}`
                      )
                    }
                    style={({ pressed }) => [styles.report, pressed && styles.pressed]}>
                    <ThemedText style={styles.reportText}>Report</ThemedText>
                  </Pressable>
                </>
              )}
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
  invoiceTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#37352F',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusPaid: {
    backgroundColor: '#EBECEC',
  },
  statusOther: {
    backgroundColor: '#F5F5F5',
  },
  statusText: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  statusTextPaid: {
    color: '#37352F',
  },
  statusTextOther: {
    color: '#9B9B9B',
  },
  mono: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#9B9B9B',
  },
  createdAt: {
    fontSize: 13,
    color: '#A0A0A0',
  },
  section: {
    gap: 6,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9B9B9B',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#37352F',
  },
  eventMeta: {
    fontSize: 14,
    color: '#6B6B6B',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  rowLabel: {
    fontSize: 14,
    color: '#37352F',
  },
  rowValue: {
    fontSize: 14,
    color: '#37352F',
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: '#F1F3F5',
    marginVertical: 4,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#37352F',
  },
  totalValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#37352F',
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
