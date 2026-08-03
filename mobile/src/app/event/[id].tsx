import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

// Mock Event Database
const EVENT_DATABASE: Record<
  string,
  {
    title: string;
    category: string;
    date: string;
    time: string;
    openGate: string;
    venue: string;
    address: string;
    imageUrl: string;
    organizer: string;
    description: string;
    lineup: { name: string; time: string; image: string }[];
    facilities: string[];
    tiers: { id: string; name: string; price: number; stock: string; desc: string }[];
  }
> = {
  'sound-of-downtown': {
    title: 'Sound of Downtown Vol. 5',
    category: 'MUSIK FESTIVAL',
    date: 'Jumat, 28 Agustus 2026',
    time: '15:00 - 23:00 WIB',
    openGate: '14:00 WIB',
    venue: 'Lapangan Pussenif, Bandung',
    address: 'Jl. Supratman No. 60, Cibeunying Kaler, Kota Bandung, Jawa Barat',
    imageUrl:
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1000',
    organizer: 'Artatix Promotindo',
    description:
      'Sound of Downtown Vol. 5 menghadirkan festival musik terbesar tahun ini di Bandung dengan tata panggung audio-visual kelas dunia, bazaar kuliner hits, dan penampilan spesial musisi tanah air.',
    lineup: [
      { name: 'Sheila on 7', time: '21:30 WIB', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=300' },
      { name: 'Tulus', time: '20:00 WIB', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=300' },
      { name: 'Hindia', time: '18:30 WIB', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=300' },
      { name: 'Reality Club', time: '16:45 WIB', image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&q=80&w=300' },
    ],
    facilities: ['Area Parkir', 'ATM Center', 'Food Court', 'Pos Kesehatan', 'Toilet', 'Merch Store'],
    tiers: [
      { id: 'vip', name: 'VIP Front Stage', price: 350000, stock: 'Tersisa 12', desc: 'Akses barisan terdepan + Jalur Fast Track' },
      { id: 'fest-a', name: 'Festival A (Standing)', price: 185000, stock: 'Tersedia', desc: 'Area berdiri dekat panggung utama' },
      { id: 'fest-b', name: 'Festival B (Tribun)', price: 125000, stock: 'Tersedia', desc: 'Area tribun duduk dengan pandangan luas' },
    ],
  },
  'evt-1': {
    title: 'Jakarta Contemporary Art Expo',
    category: 'PAMERAN SENI',
    date: 'Sabtu, 15 Agustus 2026',
    time: '10:00 - 20:00 WIB',
    openGate: '10:00 WIB',
    venue: 'Galeri Nasional Indonesia',
    address: 'Jl. Medan Merdeka Timur No. 14, Gambir, Jakarta Pusat',
    imageUrl:
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=1000',
    organizer: 'Ruang Seni Jakarta',
    description:
      'Pameran seni kontemporer internasional yang menampilkan 100+ karya lukis, instalasi digital, dan patung dari seniman terkemuka Asia Tenggara.',
    lineup: [
      { name: 'Raden Saleh Gallery', time: 'All Day', image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=300' },
      { name: 'Digital Art Workshop', time: '14:00 WIB', image: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&q=80&w=300' },
    ],
    facilities: ['AC Hall', 'Spot Foto Instagrammable', 'Guide Tour', 'Cafeteria', 'Toilet'],
    tiers: [
      { id: 'regular', name: 'Tiket Reguler', price: 75000, stock: 'Tersedia', desc: 'Akses masuk seluruh galeri pameran' },
      { id: 'student', name: 'Tiket Pelajar/Mahasiswa', price: 45000, stock: 'Tersedia', desc: 'Wajib tunjukkan Kartu Pelajar saat masuk' },
    ],
  },
  'evt-2': {
    title: 'Masterclass: Coffee Brewing',
    category: 'WORKSHOP',
    date: 'Minggu, 02 September 2026',
    time: '10:00 - 16:00 WIB',
    openGate: '09:30 WIB',
    venue: 'Kopi Kenangan Academy',
    address: 'Jl. Senopati No. 45, Kebayoran Baru, Jakarta Selatan',
    imageUrl:
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=1000',
    organizer: 'Indonesian Barista Guild',
    description:
      'Pelajari teknik penyeduhan manual brew (V60, Aeropress, French Press) langsung dari Juara Barista Indonesia. Termasuk sertifikat dan bebatuan biji kopi pilihan.',
    lineup: [
      { name: 'Yoshua Tan (World Barista Champ)', time: '10:30 WIB', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=300' },
    ],
    facilities: ['Alat Seduh Lengkap', 'Biji Kopi Specialty', 'Sertifikat Resmi', 'Lunch Provided'],
    tiers: [
      { id: 'workshop-pass', name: 'Full Workshop Pass', price: 450000, stock: 'Tersisa 5', desc: 'Termasuk Starter Kit Biji Kopi 250g + Sertifikat' },
    ],
  },
  'evt-3': {
    title: 'Indo E-Sport Championship',
    category: 'OLAHRAGA & GAME',
    date: 'Minggu, 20 Oktober 2026',
    time: '11:00 - 22:00 WIB',
    openGate: '10:00 WIB',
    venue: 'ICE BSD Hall 3A',
    address: 'Jl. BSD Grand Boulevard No. 1, Pagedangan, Tangerang',
    imageUrl:
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1000',
    organizer: 'IESPA Digital Event',
    description:
      'Babak Grand Final kompetisi E-Sports nasional Mobile Legends & Valorant terbesar tahun ini. Saksikan tim pro idamanmu secara langsung!',
    lineup: [
      { name: 'EVOS Esports vs RRQ', time: '14:00 WIB', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=300' },
      { name: 'Grand Final Valorant', time: '19:00 WIB', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=300' },
    ],
    facilities: ['Free High-Speed Wi-Fi', 'Gaming Booth', 'Cosplay Competition', 'Food Arena'],
    tiers: [
      { id: 'free-pass', name: 'General Admission', price: 0, stock: 'Gratis', desc: 'Akses masuk gratis (Wajib Registrasi QR)' },
      { id: 'vip-gamer', name: 'VIP Seating & Goodie Bag', price: 150000, stock: 'Tersedia', desc: 'Kursi VIP depan panggung + Jersey Exclusive' },
    ],
  },
};

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const theme = useTheme();

  // Fallback to default event if ID not matched
  const eventKey = (id && EVENT_DATABASE[id]) ? id : 'sound-of-downtown';
  const event = EVENT_DATABASE[eventKey];

  const [selectedTierId, setSelectedTierId] = useState(event.tiers[0].id);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const selectedTier = event.tiers.find((t) => t.id === selectedTierId) || event.tiers[0];
  const totalPrice = selectedTier.price * ticketQuantity;

  const handleOpenMap = () => {
    const query = encodeURIComponent(`${event.venue}, ${event.address}`);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
  };

  const handleConfirmPayment = () => {
    setShowCheckoutModal(false);
    const msg = `Pembelian ${ticketQuantity}x ${selectedTier.name} (${event.title}) sebesar Rp ${totalPrice.toLocaleString('id-ID')} BERHASIL! Tiket langsung dapat diakses di menu Tiket Saya.`;

    if (typeof window !== 'undefined' && window.alert) {
      window.alert(msg);
      router.push('/tickets');
    } else {
      Alert.alert('Transaksi Berhasil!', msg, [
        { text: 'Buka Tiket Saya', onPress: () => router.push('/tickets') },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      {/* Fixed Top Bar */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.circleBtn}>
          <MaterialIcons name="arrow-back" size={20} color="#0b1a3d" />
        </Pressable>

        <View style={styles.topRightGroup}>
          <Pressable onPress={() => setIsLiked(!isLiked)} style={styles.circleBtn}>
            <MaterialIcons
              name={isLiked ? 'favorite' : 'favorite-border'}
              size={20}
              color={isLiked ? '#ba1a1a' : '#0b1a3d'}
            />
          </Pressable>

          <Pressable
            onPress={() => {
              if (typeof window !== 'undefined' && window.alert) {
                window.alert(`Link event ${event.title} telah disalin!`);
              } else {
                Alert.alert('Bagikan', `Link event ${event.title} disalin!`);
              }
            }}
            style={styles.circleBtn}>
            <MaterialIcons name="share" size={20} color="#0b1a3d" />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Hero Image Banner */}
        <View style={styles.bannerContainer}>
          <Image source={{ uri: event.imageUrl }} style={styles.bannerImage} contentFit="cover" />
        </View>

        {/* Content Section */}
        <View style={styles.mainContent}>
          {/* Badges */}
          <View style={styles.badgeRow}>
            <View style={styles.categoryBadge}>
              <ThemedText style={styles.categoryBadgeText}>{event.category}</ThemedText>
            </View>
            <View style={styles.verifiedBadge}>
              <MaterialIcons name="verified" size={14} color="#00875a" />
              <ThemedText style={styles.verifiedBadgeText}>PROMOTOR TERVERIFIKASI</ThemedText>
            </View>
          </View>

          {/* Event Title */}
          <ThemedText type="headlineXl" style={{ color: theme.text, marginTop: 4 }}>
            {event.title}
          </ThemedText>

          {/* Info Card: Date & Venue */}
          <View style={[styles.infoCard, { backgroundColor: '#F4F6FC' }]}>
            <View style={styles.infoCardRow}>
              <View style={styles.iconCircle}>
                <MaterialIcons name="event" size={20} color="#0e3ec7" />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText type="headlineMd" style={{ color: theme.text }}>
                  {event.date}
                </ThemedText>
                <ThemedText type="bodyMd" style={{ color: theme.textSecondary }}>
                  {event.time} • Open Gate: {event.openGate}
                </ThemedText>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoCardRow}>
              <View style={styles.iconCircle}>
                <MaterialIcons name="location-on" size={20} color="#0e3ec7" />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText type="headlineMd" style={{ color: theme.text }}>
                  {event.venue}
                </ThemedText>
                <ThemedText type="bodyMd" style={{ color: theme.textSecondary, marginBottom: 6 }}>
                  {event.address}
                </ThemedText>

                <Pressable onPress={handleOpenMap} style={styles.mapBtn}>
                  <MaterialIcons name="map" size={16} color="#0e3ec7" />
                  <ThemedText type="labelMd" style={{ color: '#0e3ec7', fontWeight: '700' }}>
                    Petunjuk Arah Google Maps
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Organizer Info */}
          <View style={styles.organizerBox}>
            <View style={styles.orgIconBox}>
              <MaterialIcons name="business" size={22} color="#0e3ec7" />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText type="headlineMd" style={{ color: theme.text }}>
                {event.organizer}
              </ThemedText>
              <ThemedText type="labelMd" style={{ color: theme.textSecondary }}>
                Official Event Partner Artatix
              </ThemedText>
            </View>
            <Pressable
              onPress={() => {
                if (typeof window !== 'undefined' && window.alert) {
                  window.alert(`Menghubungi panitia ${event.organizer}...`);
                }
              }}
              style={styles.contactBtn}>
              <ThemedText type="labelMd" style={{ color: '#0e3ec7', fontWeight: '700' }}>
                Kontak
              </ThemedText>
            </Pressable>
          </View>

          {/* Description Section */}
          <View style={styles.sectionContainer}>
            <ThemedText type="headlineMd" style={{ color: theme.text }}>
              Tentang Acara Ini
            </ThemedText>
            <ThemedText type="bodyMd" style={{ color: theme.textSecondary, lineHeight: 22 }}>
              {event.description}
            </ThemedText>
          </View>

          {/* Guest Star / Lineup Grid */}
          {event.lineup.length > 0 && (
            <View style={styles.sectionContainer}>
              <ThemedText type="headlineMd" style={{ color: theme.text }}>
                Lineup & Bintang Tamu
              </ThemedText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.lineupScroll}>
                {event.lineup.map((artist, idx) => (
                  <View key={idx} style={styles.artistCard}>
                    <Image source={{ uri: artist.image }} style={styles.artistImage} contentFit="cover" />
                    <ThemedText type="headlineMd" style={{ color: theme.text, fontSize: 14, textAlign: 'center' }}>
                      {artist.name}
                    </ThemedText>
                    <ThemedText type="labelMd" style={{ color: '#0e3ec7', textAlign: 'center' }}>
                      {artist.time}
                    </ThemedText>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Facilities */}
          <View style={styles.sectionContainer}>
            <ThemedText type="headlineMd" style={{ color: theme.text }}>
              Fasilitas Lokasi Acara
            </ThemedText>
            <View style={styles.facilityGrid}>
              {event.facilities.map((fac, idx) => (
                <View key={idx} style={styles.facilityTag}>
                  <MaterialIcons name="check-circle" size={16} color="#00875a" />
                  <ThemedText type="labelMd" style={{ color: theme.text }}>
                    {fac}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>

          {/* Ticket Tier Selection */}
          <View style={styles.sectionContainer}>
            <ThemedText type="headlineMd" style={{ color: theme.text }}>
              Pilih Kategori Tiket
            </ThemedText>

            <View style={styles.tierContainer}>
              {event.tiers.map((tier) => {
                const isSelected = selectedTierId === tier.id;

                return (
                  <Pressable
                    key={tier.id}
                    onPress={() => setSelectedTierId(tier.id)}
                    style={[
                      styles.tierCard,
                      {
                        backgroundColor: isSelected ? 'rgba(14, 62, 199, 0.05)' : '#FFFFFF',
                        borderColor: isSelected ? '#0e3ec7' : 'rgba(0,0,0,0.08)',
                      },
                    ]}>
                    <View style={styles.tierHeader}>
                      <View style={styles.tierLeftRow}>
                        <MaterialIcons
                          name={isSelected ? 'radio-button-checked' : 'radio-button-unchecked'}
                          size={20}
                          color={isSelected ? '#0e3ec7' : theme.outline}
                        />
                        <View>
                          <ThemedText type="headlineMd" style={{ color: theme.text }}>
                            {tier.name}
                          </ThemedText>
                          <ThemedText type="labelMd" style={{ color: theme.textSecondary }}>
                            {tier.desc}
                          </ThemedText>
                        </View>
                      </View>

                      <ThemedText type="priceTag" style={{ color: '#0e3ec7' }}>
                        {tier.price === 0 ? 'Gratis' : `Rp ${tier.price.toLocaleString('id-ID')}`}
                      </ThemedText>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Quantity Selector */}
          <View style={styles.quantityRow}>
            <View>
              <ThemedText type="headlineMd" style={{ color: theme.text }}>
                Jumlah Tiket
              </ThemedText>
              <ThemedText type="labelMd" style={{ color: theme.textSecondary }}>
                Maksimal 5 tiket per pesanan
              </ThemedText>
            </View>

            <View style={styles.counterBox}>
              <Pressable
                onPress={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                style={[styles.counterBtn, { backgroundColor: '#F4F6FC' }]}>
                <MaterialIcons name="remove" size={18} color="#0b1a3d" />
              </Pressable>

              <ThemedText type="headlineMd" style={{ color: theme.text, paddingHorizontal: 12 }}>
                {ticketQuantity}
              </ThemedText>

              <Pressable
                onPress={() => setTicketQuantity(Math.min(5, ticketQuantity + 1))}
                style={[styles.counterBtn, { backgroundColor: '#F4F6FC' }]}>
                <MaterialIcons name="add" size={18} color="#0b1a3d" />
              </Pressable>
            </View>
          </View>

          {/* Terms & Conditions */}
          <View style={[styles.termsBox, { backgroundColor: '#F4F6FC' }]}>
            <ThemedText type="headlineMd" style={{ color: theme.text, marginBottom: 4 }}>
              Syarat & Ketentuan Pembelian
            </ThemedText>
            <ThemedText type="bodyMd" style={{ color: theme.textSecondary, fontSize: 13, lineHeight: 18 }}>
              • Tiket yang sudah dibeli bersifat non-refundable (tidak dapat dikembalikan).{'\n'}
              • Wajib membawa e-ktp / tanda pengenal resmi saat penukaran wristband.{'\n'}
              • Dilarang membawa senjata tajam, kamera profesional, & makanan dari luar.
            </ThemedText>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Action Bar */}
      <View style={[styles.bottomActionBar, { backgroundColor: '#FFFFFF' }]}>
        <View>
          <ThemedText type="labelMd" style={{ color: theme.textSecondary }}>
            Total Pembayaran ({ticketQuantity} Tiket)
          </ThemedText>
          <ThemedText type="headlineXl" style={{ color: '#0e3ec7' }}>
            {totalPrice === 0 ? 'Gratis' : `Rp ${totalPrice.toLocaleString('id-ID')}`}
          </ThemedText>
        </View>

        <Pressable
          onPress={() => setShowCheckoutModal(true)}
          style={({ pressed }) => [styles.checkoutBtn, pressed && styles.pressed]}>
          <ThemedText type="labelMd" style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 15 }}>
            Beli Tiket Sekarang
          </ThemedText>
        </Pressable>
      </View>

      {/* Checkout Summary Modal */}
      <Modal
        visible={showCheckoutModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCheckoutModal(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowCheckoutModal(false)}>
          <View style={styles.modalSheet} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <ThemedText type="headlineLg" style={{ color: '#0b1a3d' }}>
                Konfirmasi Pesanan
              </ThemedText>
              <Pressable onPress={() => setShowCheckoutModal(false)}>
                <MaterialIcons name="close" size={24} color="#444654" />
              </Pressable>
            </View>

            <View style={styles.summaryBox}>
              <ThemedText type="headlineMd" style={{ color: '#0b1a3d' }}>
                {event.title}
              </ThemedText>
              <ThemedText type="bodyMd" style={{ color: '#444654' }}>
                {event.date} • {event.venue}
              </ThemedText>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryRow}>
                <ThemedText type="bodyMd" style={{ color: '#444654' }}>
                  Kategori: {selectedTier.name} ({ticketQuantity}x)
                </ThemedText>
                <ThemedText type="headlineMd" style={{ color: '#0b1a3d' }}>
                  Rp {totalPrice.toLocaleString('id-ID')}
                </ThemedText>
              </View>

              <View style={styles.summaryRow}>
                <ThemedText type="bodyMd" style={{ color: '#444654' }}>
                  Biaya Layanan & Pajak
                </ThemedText>
                <ThemedText type="bodyMd" style={{ color: '#00875a', fontWeight: '700' }}>
                  GRATIS
                </ThemedText>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryRow}>
                <ThemedText type="headlineLg" style={{ color: '#0b1a3d' }}>
                  Total Bayar
                </ThemedText>
                <ThemedText type="headlineXl" style={{ color: '#0e3ec7' }}>
                  Rp {totalPrice.toLocaleString('id-ID')}
                </ThemedText>
              </View>
            </View>

            {/* Payment Method Option */}
            <View style={styles.paymentMethodBox}>
              <MaterialIcons name="qr-code-scanner" size={24} color="#0e3ec7" />
              <View style={{ flex: 1 }}>
                <ThemedText type="headlineMd" style={{ color: '#0b1a3d' }}>
                  Metode Pembayaran: QRIS Instant
                </ThemedText>
                <ThemedText type="labelMd" style={{ color: '#444654' }}>
                  BCA, Mandiri, GoPay, OVO, ShopeePay
                </ThemedText>
              </View>
              <MaterialIcons name="check-circle" size={20} color="#00875a" />
            </View>

            <Pressable onPress={handleConfirmPayment} style={styles.confirmPayBtn}>
              <ThemedText type="headlineMd" style={{ color: '#FFFFFF' }}>
                Bayar Rp {totalPrice.toLocaleString('id-ID')}
              </ThemedText>
            </Pressable>
          </View>
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
  topBar: {
    position: 'absolute',
    top: 12,
    left: 16,
    right: 16,
    zIndex: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  circleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  topRightGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  bannerContainer: {
    width: '100%',
    height: 260,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  mainContent: {
    padding: 18,
    gap: 18,
    backgroundColor: '#FFFFFF',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    backgroundColor: 'rgba(14, 62, 199, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryBadgeText: {
    color: '#0e3ec7',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 135, 90, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  verifiedBadgeText: {
    color: '#00875a',
    fontSize: 10,
    fontWeight: '700',
  },
  infoCard: {
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  infoCardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(14, 62, 199, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  mapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  organizerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  orgIconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(14, 62, 199, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(14, 62, 199, 0.08)',
  },
  sectionContainer: {
    gap: 10,
  },
  lineupScroll: {
    gap: 12,
    paddingVertical: 4,
  },
  artistCard: {
    width: 110,
    alignItems: 'center',
    gap: 4,
  },
  artistImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 4,
  },
  facilityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  facilityTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F4F6FC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  tierContainer: {
    gap: 10,
  },
  tierCard: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
  },
  tierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tierLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  counterBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  termsBox: {
    padding: 14,
    borderRadius: 14,
    gap: 4,
  },
  bottomActionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  checkoutBtn: {
    backgroundColor: '#0e3ec7',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
    shadowColor: '#0e3ec7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 26, 61, 0.6)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 22,
    gap: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryBox: {
    backgroundColor: '#F4F6FC',
    borderRadius: 16,
    padding: 16,
    gap: 6,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
    marginVertical: 6,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentMethodBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#0e3ec7',
    backgroundColor: 'rgba(14, 62, 199, 0.04)',
  },
  confirmPayBtn: {
    backgroundColor: '#0e3ec7',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
});
