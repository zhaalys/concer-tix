import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppImage } from '@/components/AppImage';
import { ScreenHeader } from '@/components/ScreenHeader';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import type { Order } from '@/lib/types';

const qrSize = 140;

export default function ETicketScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTataCara, setShowTataCara] = useState(true);

  useEffect(() => {
    let active = true;
    api
      .getOrderByCode(code ?? '')
      .then((res) => {
        if (active) setOrder(res.data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [code, user]);

  const attendee = order?.attendees?.[0];
  const ticketCode = attendee?.ticket_code || (order?.order_code ? `TIX-${order.order_code}-1` : (code ?? 'TIX-ORD-DEMO-1'));
  const qrData = JSON.stringify({
    code: ticketCode,
    event: order?.event?.title || 'Sound of Downtown Vol. 5',
    holder: attendee?.full_name || 'Penonton',
    category: order?.items?.[0]?.ticket_label || 'Festival A (Standing)',
  });

  return (
    <View style={styles.container}>
      <ScreenHeader title="E-Ticket" />
      {loading ? (
        <ActivityIndicator color="#0E9375" style={{ marginTop: 60 }} />
      ) : !order ? (
        <ThemedText style={styles.notFound}>No ticket data found.</ThemedText>
      ) : (
        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 60 + insets.bottom }]} showsVerticalScrollIndicator={false}>
          <View style={styles.lanyardWrap}>
            <AppImage src="/history_lanyard/lanyard_history.png" style={styles.lanyard} contentFit="contain" />
            <View style={styles.qrOverlay}>
              <View style={styles.qrBox}>
                <QRCode value={qrData} size={qrSize} backgroundColor="transparent" />
              </View>
            </View>
          </View>
          <View style={styles.infoCard}>
            <ThemedText style={styles.infoTitle}>{order.event?.title}</ThemedText>
            <ThemedText style={styles.infoMeta}>
              {order.event?.event_date} • {order.event?.event_time}
            </ThemedText>
            <ThemedText style={styles.infoMeta}>{order.event?.location}</ThemedText>
            <View style={styles.divider} />
            <ThemedText style={styles.holder}>Holder: {attendee?.full_name}</ThemedText>
            <ThemedText style={styles.code}>Code: {ticketCode}</ThemedText>
            <ThemedText style={styles.code}>Category: {order.items?.[0]?.ticket_label}</ThemedText>
          </View>
        </ScrollView>
      )}

      <Modal visible={showTataCara} transparent animationType="fade" onRequestClose={() => setShowTataCara(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowTataCara(false)}>
          <AppImage src="/scan_qr/tata_cara.png" style={styles.tataCara} contentFit="contain" />
          <Pressable onPress={() => setShowTataCara(false)} style={styles.closeBtn} hitSlop={8}>
            <ThemedText style={styles.closeText}>✕</ThemedText>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
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
  notFound: {
    fontSize: 14,
    color: '#868E96',
    textAlign: 'center',
    marginTop: 40,
  },
  lanyardWrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 420,
    aspectRatio: 1,
    alignSelf: 'center',
  },
  lanyard: {
    width: '100%',
    height: '100%',
  },
  qrOverlay: {
    position: 'absolute',
    top: '52%',
    alignSelf: 'center',
  },
  qrBox: {
    backgroundColor: '#FFFFFF',
    padding: 6,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  infoCard: {
    backgroundColor: '#F8FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F3F5',
    padding: 16,
    gap: 4,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1D2E',
  },
  infoMeta: {
    fontSize: 13,
    color: '#495057',
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    marginVertical: 8,
  },
  holder: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1D2E',
  },
  code: {
    fontSize: 13,
    color: '#495057',
    fontFamily: 'monospace',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  tataCara: {
    width: '90%',
    aspectRatio: 3 / 4,
  },
  closeBtn: {
    position: 'absolute',
    top: 48,
    right: 20,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
