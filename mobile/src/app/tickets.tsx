import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

export default function TicketsScreen() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'cancelled'>('active');
  const [selectedQrTicket, setSelectedQrTicket] = useState<string | null>(null);

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: '#FFFFFF' }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      {/* Title */}
      <View style={styles.headerTitleContainer}>
        <ThemedText type="headlineXl" style={{ color: theme.text }}>
          Tiket Saya
        </ThemedText>
        <ThemedText type="bodyMd" style={{ color: theme.textSecondary }}>
          Akses E-Ticket QR Code dan riwayat pemesanan acara kamu.
        </ThemedText>
      </View>

      {/* Segmented Filter Tabs */}
      <View style={[styles.tabSegmentContainer, { backgroundColor: '#F4F6FC' }]}>
        <Pressable
          onPress={() => setActiveTab('active')}
          style={[
            styles.segmentBtn,
            activeTab === 'active' && styles.activeSegmentBtn,
          ]}>
          <ThemedText
            type="labelMd"
            style={{ color: activeTab === 'active' ? '#0e3ec7' : theme.textSecondary }}>
            Aktif (1)
          </ThemedText>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab('completed')}
          style={[
            styles.segmentBtn,
            activeTab === 'completed' && styles.activeSegmentBtn,
          ]}>
          <ThemedText
            type="labelMd"
            style={{ color: activeTab === 'completed' ? '#0e3ec7' : theme.textSecondary }}>
            Selesai (2)
          </ThemedText>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab('cancelled')}
          style={[
            styles.segmentBtn,
            activeTab === 'cancelled' && styles.activeSegmentBtn,
          ]}>
          <ThemedText
            type="labelMd"
            style={{ color: activeTab === 'cancelled' ? '#0e3ec7' : theme.textSecondary }}>
            Dibatalkan (0)
          </ThemedText>
        </Pressable>
      </View>

      {/* Active Tab View */}
      {activeTab === 'active' && (
        <View style={styles.ticketsList}>
          <View style={[styles.ticketCard, { backgroundColor: '#FFFFFF' }]}>
            <View style={styles.ticketHeader}>
              <View style={styles.statusBadge}>
                <ThemedText style={styles.statusText}>Aktif • E-Ticket Ready</ThemedText>
              </View>
              <ThemedText type="labelMd" style={{ color: theme.textSecondary }}>
                #ARTX-99821
              </ThemedText>
            </View>

            <ThemedText type="headlineLg" style={[styles.eventTitle, { color: theme.text }]}>
              Sound of Downtown Vol. 5
            </ThemedText>

            <View style={styles.infoRow}>
              <MaterialIcons name="event" size={16} color="#0e3ec7" />
              <ThemedText type="bodyMd" style={{ color: theme.textSecondary }}>
                Jumat, 28 Agustus 2026 • 15:00 WIB
              </ThemedText>
            </View>

            <View style={styles.infoRow}>
              <MaterialIcons name="location-on" size={16} color="#0e3ec7" />
              <ThemedText type="bodyMd" style={{ color: theme.textSecondary }}>
                Lapangan Pussenif, Bandung
              </ThemedText>
            </View>

            <View style={styles.infoRow}>
              <MaterialIcons name="confirmation-number" size={16} color="#0e3ec7" />
              <ThemedText type="bodyMd" style={{ color: theme.textSecondary }}>
                Kategori: Festival A (1 Tiket)
              </ThemedText>
            </View>

            {/* QR Section */}
            <Pressable
              onPress={() => setSelectedQrTicket('Sound of Downtown Vol. 5')}
              style={({ pressed }) => [
                styles.qrPreviewBox,
                { backgroundColor: '#F4F6FC' },
                pressed && styles.pressed,
              ]}>
              <MaterialIcons name="qr-code-2" size={64} color="#0b1a3d" />
              <View style={styles.qrTextCol}>
                <ThemedText type="headlineMd" style={{ color: '#0e3ec7' }}>
                  Lihat Kode QR
                </ThemedText>
                <ThemedText type="labelMd" style={{ color: theme.textSecondary }}>
                  Ketuk untuk memperbesar barcode saat check-in
                </ThemedText>
              </View>
            </Pressable>
          </View>
        </View>
      )}

      {/* Completed Tab View */}
      {activeTab === 'completed' && (
        <View style={styles.ticketsList}>
          <View style={[styles.ticketCard, { backgroundColor: '#FFFFFF', opacity: 0.85 }]}>
            <View style={styles.ticketHeader}>
              <View style={[styles.statusBadge, { backgroundColor: 'rgba(68, 70, 84, 0.1)' }]}>
                <ThemedText style={[styles.statusText, { color: '#444654' }]}>Selesai</ThemedText>
              </View>
              <ThemedText type="labelMd" style={{ color: theme.textSecondary }}>
                #ARTX-88123
              </ThemedText>
            </View>
            <ThemedText type="headlineLg" style={{ color: theme.text }}>
              Jakarta Contemporary Art Expo
            </ThemedText>
            <ThemedText type="bodyMd" style={{ color: theme.textSecondary }}>
              15 Agustus 2026 • Galeri Nasional, Jakarta
            </ThemedText>
          </View>

          <View style={[styles.ticketCard, { backgroundColor: '#FFFFFF', opacity: 0.85 }]}>
            <View style={styles.ticketHeader}>
              <View style={[styles.statusBadge, { backgroundColor: 'rgba(68, 70, 84, 0.1)' }]}>
                <ThemedText style={[styles.statusText, { color: '#444654' }]}>Selesai</ThemedText>
              </View>
              <ThemedText type="labelMd" style={{ color: theme.textSecondary }}>
                #ARTX-77410
              </ThemedText>
            </View>
            <ThemedText type="headlineLg" style={{ color: theme.text }}>
              Java Jazz Festival 2025
            </ThemedText>
            <ThemedText type="bodyMd" style={{ color: theme.textSecondary }}>
              02 Juni 2025 • JIExpo Kemayoran, Jakarta
            </ThemedText>
          </View>
        </View>
      )}

      {/* Cancelled Tab View */}
      {activeTab === 'cancelled' && (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="confirmation-number" size={48} color={theme.outline} />
          <ThemedText type="headlineMd" style={{ color: theme.textSecondary }}>
            Tidak ada tiket yang dibatalkan
          </ThemedText>
        </View>
      )}

      {/* QR Code Modal Popup */}
      <Modal
        visible={!!selectedQrTicket}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedQrTicket(null)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setSelectedQrTicket(null)}>
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <ThemedText type="headlineLg" style={{ color: '#0b1a3d', textAlign: 'center' }}>
              {selectedQrTicket}
            </ThemedText>
            <ThemedText type="bodyMd" style={{ color: '#444654', textAlign: 'center', marginBottom: 12 }}>
              Tunjukkan kode QR ini ke petugas pintu masuk lokasi event
            </ThemedText>
            
            <View style={styles.qrLargeBox}>
              <MaterialIcons name="qr-code-2" size={180} color="#0b1a3d" />
            </View>

            <Pressable
              onPress={() => setSelectedQrTicket(null)}
              style={styles.closeBtn}>
              <ThemedText type="labelMd" style={{ color: '#FFFFFF', fontWeight: '700' }}>
                Tutup
              </ThemedText>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 90,
    gap: 16,
    backgroundColor: '#FFFFFF',
  },
  headerTitleContainer: {
    gap: 4,
    marginTop: 4,
  },
  tabSegmentContainer: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 12,
    gap: 4,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeSegmentBtn: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  ticketsList: {
    gap: 14,
  },
  ticketCard: {
    borderRadius: 18,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  ticketHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadge: {
    backgroundColor: 'rgba(0, 135, 90, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    color: '#00875a',
    fontSize: 11,
    fontWeight: '700',
  },
  eventTitle: {
    marginVertical: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  qrPreviewBox: {
    marginTop: 8,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  qrTextCol: {
    flex: 1,
    gap: 2,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    gap: 8,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(11, 26, 61, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  qrLargeBox: {
    padding: 16,
    backgroundColor: '#F4F6FC',
    borderRadius: 16,
    marginVertical: 8,
  },
  closeBtn: {
    backgroundColor: '#0e3ec7',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  pressed: {
    opacity: 0.8,
  },
});
