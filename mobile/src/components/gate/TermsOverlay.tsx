import { Image } from 'expo-image';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/AppButton';
import { ThemedText } from '@/components/themed-text';
import { resolveImage } from '@/lib/assets';

const TERMS_SECTIONS: { title: string; body: string }[] = [
  {
    title: 'Penerimaan Ketentuan',
    body: 'Dengan menekan tombol "Saya Setuju & Lanjut", Anda menyatakan telah membaca, memahami, dan menyetujui seluruh Syarat & Ketentuan serta Kebijakan Privasi Concer TIX. Jika Anda tidak setuju, mohon tidak menggunakan aplikasi ini.',
  },
  {
    title: 'Akun Pengguna',
    body: 'Anda wajib memberikan data yang benar dan bertanggung jawab penuh atas keamanan akun, termasuk email dan kata sandi. Akun tidak dapat dipindahtangankan kepada pihak lain.',
  },
  {
    title: 'Pembelian Tiket',
    body: 'Tiket yang dibeli bersifat final dan tidak dapat ditukar atau dikembalikan kecuali diatur lain oleh kebijakan penyelenggara. Pastikan data pemesan benar sebelum melakukan pembayaran.',
  },
  {
    title: 'Pembayaran',
    body: 'Pembayaran dilakukan melalui penyedia pembayaran yang bekerja sama dengan Concer TIX. Concer TIX tidak menyimpan data kartu pembayaran Anda.',
  },
  {
    title: 'Penggunaan Aplikasi',
    body: 'Dilarang menggunakan aplikasi untuk aktivitas yang melanggar hukum, termasuk namun tidak terbatas pada penjualan ulang tiket dengan harga tidak wajar, peretasan, dan penyalahgunaan data pengguna lain.',
  },
  {
    title: 'Privasi Data',
    body: 'Data pribadi Anda digunakan untuk memproses transaksi dan meningkatkan layanan. Kami tidak akan membagikan data Anda kepada pihak ketiga tanpa persetujuan, kecuali diwajibkan oleh hukum.',
  },
  {
    title: 'Perubahan Ketentuan',
    body: 'Concer TIX dapat memperbarui Syarat & Ketentuan sewaktu-waktu. Perubahan akan berlaku setelah diperbarui di aplikasi ini.',
  },
];

const NOTION_TEXT = '#37352F';
const NOTION_SECONDARY = '#787774';
const NOTION_BORDER = '#E9E9E7';

export function TermsOverlay({ onAccept }: { onAccept: () => void }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.overlay}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 28, paddingBottom: Math.max(insets.bottom, 16) + 28 },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.doc}>
          <Image source={resolveImage('/logo/tix_logo.png')} style={styles.logo} contentFit="contain" />

          <View style={styles.headerBlock}>
            <ThemedText style={styles.title}>Syarat &amp; Ketentuan</ThemedText>
            <ThemedText style={styles.meta}>Concer TIX — Terakhir diperbarui 4 Agustus 2026</ThemedText>
          </View>

          <View style={styles.divider} />

          <View style={styles.callout}>
            <ThemedText style={styles.calloutText}>
              Mohon baca dengan cermat. Dengan melanjutkan, Anda setuju untuk terikat pada seluruh ketentuan
              di bawah ini.
            </ThemedText>
          </View>

          <View style={styles.sections}>
            {TERMS_SECTIONS.map((section, index) => (
              <View key={section.title} style={styles.section}>
                <View style={styles.sectionHeader}>
                  <ThemedText style={styles.sectionNumber}>{index + 1}</ThemedText>
                  <ThemedText style={styles.sectionTitle}>{section.title}</ThemedText>
                </View>
                <ThemedText style={styles.sectionBody}>{section.body}</ThemedText>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          <ThemedText style={styles.footnote}>
            Ketentuan ini efektif berlaku sejak Anda menyetujui dan menggunakan aplikasi Concer TIX.
          </ThemedText>

          <AppButton label="Saya Setuju & Lanjut" onPress={onAccept} style={styles.accept} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1000,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flexGrow: 1,
  },
  doc: {
    width: '100%',
    maxWidth: 620,
    alignSelf: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    width: 110,
    height: 42,
    marginBottom: 32,
  },
  headerBlock: {
    gap: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: NOTION_TEXT,
    letterSpacing: -0.5,
    lineHeight: 38,
  },
  meta: {
    fontSize: 13,
    color: NOTION_SECONDARY,
  },
  divider: {
    height: 1,
    backgroundColor: NOTION_BORDER,
    marginVertical: 24,
  },
  callout: {
    backgroundColor: '#F7F6F3',
    borderWidth: 1,
    borderColor: NOTION_BORDER,
    borderRadius: 4,
    padding: 14,
  },
  calloutText: {
    fontSize: 15,
    lineHeight: 23,
    color: NOTION_TEXT,
  },
  sections: {
    marginTop: 24,
    gap: 28,
  },
  section: {
    gap: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 12,
  },
  sectionNumber: {
    fontSize: 17,
    fontWeight: '700',
    color: '#9B9A97',
    width: 20,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: NOTION_TEXT,
  },
  sectionBody: {
    fontSize: 15,
    lineHeight: 24,
    color: '#4A4A46',
  },
  footnote: {
    fontSize: 13,
    color: NOTION_SECONDARY,
    lineHeight: 20,
    marginBottom: 20,
  },
  accept: {
    height: 48,
    borderRadius: 6,
    backgroundColor: '#2383E2',
  },
});
