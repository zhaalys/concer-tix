import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { AppButton } from '@/components/AppButton';
import { AppImage } from '@/components/AppImage';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { SUPPORT_WHATSAPP, TICKET_ISSUE_MSG, WRISTBAND_ISSUE_MSG } from '@/lib/content';
import { formatPrice } from '@/lib/format';
import { openSnap } from '@/lib/payment';
import type { Order, WristbandOrder } from '@/lib/types';

export default function TicketsScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [wristbandOrders, setWristbandOrders] = useState<WristbandOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [payingCode, setPayingCode] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const [o, w] = await Promise.all([
        api.getOrderHistory(user.id),
        api.getWristbandOrderHistory(user.id),
      ]);
      setOrders(o.data);
      setWristbandOrders(w.data);
    } catch (e: any) {
      setError(e?.message || 'Gagal memuat data. Pastikan server backend berjalan.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      router.replace('/login?next=/tickets' as never);
      return;
    }
    load();
  }, [user, load, router]);

  const handlePayWristband = async (order: WristbandOrder) => {
    setPayingCode(order.order_code);
    try {
      const res = await api.createWristbandPaymentToken(order.order_code);
      await openSnap(res.token);
      await api.updateWristbandOrderStatus(order.order_code, { status: 'paid' });
      await load();
      router.push(`/my-tickets/wristband/${order.order_code}` as never);
    } catch {
      alert('Pembayaran gagal.');
    } finally {
      setPayingCode(null);
    }
  };

  if (!user) return <View style={styles.container} />;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
      showsVerticalScrollIndicator={false}>
      <ThemedText style={styles.pageTitle}>My Tickets</ThemedText>

      {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}

      {loading ? (
        <ActivityIndicator color="#0E9375" style={{ marginVertical: 40 }} />
      ) : orders.length === 0 && wristbandOrders.length === 0 ? (
        <View style={styles.empty}>
          <MaterialIcons name="confirmation-number" size={40} color="#CED4DA" />
          <ThemedText style={styles.emptyText}>Belum ada tiket</ThemedText>
        </View>
      ) : (
        <>
          {orders.map((order) => (
            <Pressable
              key={order.id}
              onPress={() => router.push(`/my-tickets/${order.order_code}` as never)}
              style={({ pressed }) => [styles.orderCard, pressed && styles.pressed]}>
              <View style={styles.cardHeader}>
                <AppImage src={order.event?.image_url} style={styles.cardImg} radius={8} />
                <View style={styles.cardInfo}>
                  <ThemedText numberOfLines={2} style={styles.cardTitle}>
                    {order.event?.title}
                  </ThemedText>
                  <ThemedText style={styles.cardMeta}>
                    {order.event?.event_date} • {order.event?.location}
                  </ThemedText>
                  <ThemedText style={styles.cardTotal}>Total: {formatPrice(order.total_amount)}</ThemedText>
                  <View style={styles.chips}>
                    {order.items.map((item) => (
                      <View key={item.ticket_label} style={styles.chip}>
                        <ThemedText style={styles.chipText}>
                          {item.ticket_label} x{item.quantity}
                        </ThemedText>
                      </View>
                    ))}
                  </View>
                </View>
                <View style={styles.cardStatus}>
                  <ThemedText style={order.status === 'paid' ? styles.statusPaid : styles.statusOther}>
                    {order.status}
                  </ThemedText>
                  <ThemedText style={styles.orderCode}>{order.order_code}</ThemedText>
                </View>
              </View>
              <Pressable
                onPress={() =>
                  Linking.openURL(
                    `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(TICKET_ISSUE_MSG(order.order_code, order.event?.title ?? ''))}`
                  )
                }
                style={({ pressed }) => [styles.reportLink, pressed && styles.pressed]}>
                <ThemedText style={styles.reportText}>Laporkan Kesalahan</ThemedText>
              </Pressable>
            </Pressable>
          ))}

          {wristbandOrders.length > 0 && (
            <>
              <ThemedText style={styles.sectionTitle}>Wristband Orders</ThemedText>
              {wristbandOrders.map((order) => (
                <View key={order.id} style={styles.orderCard}>
                  <Pressable
                    onPress={() => router.push(`/my-tickets/wristband/${order.order_code}` as never)}
                    style={({ pressed }) => [styles.cardHeader, pressed && styles.pressed]}>
                    <AppImage
                      src={order.variant === 'with_qr' ? '/tiket_version/gelang_kain_qr_1.png' : '/tiket_version/gelang_kain_1.png'}
                      style={styles.cardImg}
                      radius={8}
                    />
                    <View style={styles.cardInfo}>
                      <ThemedText style={styles.cardTitle}>
                        Wristband {order.variant === 'with_qr' ? 'With QR' : 'Without QR'}
                      </ThemedText>
                      <ThemedText style={styles.cardMeta}>
                        Qty: {order.quantity} • {order.customer_name}
                      </ThemedText>
                      <ThemedText style={styles.cardTotal}>Total: {formatPrice(order.total_amount)}</ThemedText>
                    </View>
                    <View style={styles.cardStatus}>
                      <ThemedText style={order.status === 'paid' ? styles.statusPaid : styles.statusOther}>
                        {order.status}
                      </ThemedText>
                      <ThemedText style={styles.orderCode}>{order.order_code}</ThemedText>
                    </View>
                  </Pressable>
                  {order.status === 'pending' && (
                    <AppButton
                      label={payingCode === order.order_code ? '...' : 'Pay Now'}
                      loading={payingCode === order.order_code}
                      variant="outline"
                      style={styles.payNow}
                      onPress={() => handlePayWristband(order)}
                    />
                  )}
                  <Pressable
                    onPress={() =>
                      Linking.openURL(
                        `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(WRISTBAND_ISSUE_MSG(order.order_code))}`
                      )
                    }
                    style={({ pressed }) => [styles.reportLink, pressed && styles.pressed]}>
                    <ThemedText style={styles.reportText}>Laporkan Kesalahan</ThemedText>
                  </Pressable>
                </View>
              ))}
            </>
          )}
        </>
      )}
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
    paddingBottom: 90,
    gap: 12,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1D2E',
    marginBottom: 4,
  },
  error: {
    color: '#DC2626',
    fontSize: 13,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#868E96',
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    padding: 12,
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 10,
  },
  cardImg: {
    width: 80,
    height: 80,
  },
  cardInfo: {
    flex: 1,
    gap: 3,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1D2E',
  },
  cardMeta: {
    fontSize: 12,
    color: '#868E96',
  },
  cardTotal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1D2E',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 2,
  },
  chip: {
    backgroundColor: '#F1F3F5',
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  chipText: {
    fontSize: 11,
    color: '#495057',
  },
  cardStatus: {
    alignItems: 'flex-end',
    gap: 2,
  },
  statusPaid: {
    fontSize: 11,
    fontWeight: '600',
    color: '#37352F',
    textTransform: 'uppercase',
  },
  statusOther: {
    fontSize: 11,
    fontWeight: '600',
    color: '#868E96',
    textTransform: 'uppercase',
  },
  orderCode: {
    fontSize: 11,
    color: '#ADB5BD',
  },
  reportLink: {
    alignSelf: 'flex-end',
  },
  reportText: {
    fontSize: 11,
    color: '#868E96',
    textDecorationLine: 'underline',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1D2E',
    marginTop: 8,
  },
  payNow: {
    height: 38,
  },
  pressed: {
    opacity: 0.8,
  },
});
