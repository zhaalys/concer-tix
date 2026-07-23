# Fitur Pendukung (Gate Keeper, CS, Marketing, Finance)

---

## 1. Gate Keeper / Ticket Validator

### 1.1 Aplikasi Scanner
- Login dengan akun Gate Keeper
- Pilih event (jika handle beberapa event)
- Mode: Online / Offline

### 1.2 Scan Tiket
- Buka kamera untuk scan QR Code
- Validasi otomatis:
  - Valid → Check-in berhasil, tampilkan nama & kategori
  - Already Used → Tiket sudah dipakai, tampilkan waktu check-in sebelumnya
  - Invalid → Tiket tidak valid / tidak dikenali
  - Expired → Tiket sudah kedaluwarsa
- Detail tampilan setelah scan:
  - Nama pembeli
  - Kategori tiket
  - Nomor urut
  - Status (Baru / Already Used)

### 1.3 Manual Check-in
- Input nomor pesanan manual
- Input email pembeli
- Verifikasi manual

### 1.4 Attendance Tracker
- Jumlah yang sudah check-in
- Jumlah tiket total
- Persentase kehadiran
- Export data kehadiran

### 1.5 Offline Mode
- Scan tanpa internet
- Data tersimpan di local storage
- Saat online → Auto-sync ke server
- Conflict resolution (jika ada double scan)

---

## 2. Customer Service (CS)

### 2.1 Dashboard CS
- Tiket support masuk (pending, on progress, resolved)
- Quick response templates
- Statistik response time

### 2.2 Cari Tiket/Pesanan
- Cari dengan ID pesanan
- Cari dengan email pembeli
- Cari dengan nama event
- Lihat detail lengkap pesanan

### 2.3 Handle Komplain
- Kategori komplain:
  - Pembayaran berhasil tapi tiket tidak masuk
  - E-tiket tidak bisa discan
  - Event dibatalkan
  - Refund
  - Salah beli tiket
  - Pertanyaan umum
- Catat komplain
- Berikan solusi / escalate ke admin
- Update status komplain
- Kirim notifikasi ke user

### 2.4 Proses Refund
- Review request refund dari user
- Cek syarat & ketentuan refund
- Approve / Reject
- Proses pengembalian dana
- Notifikasi ke user & creator

### 2.5 Kirim Notifikasi
- Kirim email manual ke user
- Kirim WhatsApp manual ke user
- Gunakan template yang sudah ada

---

## 3. Tim Marketing

### 3.1 Kelola Konten Homepage
- Upload/edit banner promosi
- Atur urutan tampilan
- Atur jadwal tampil
- Target: Semua user / Segment tertentu

### 3.2 Kelola Social Media
- Post Instagram (feed, story, reels)
- Post TikTok
- Post Twitter/X
- Post Facebook
- Schedule post
- Analytics engagement

### 3.3 Buat Campaign
- Campaign promosi event
- Campaign promo kode diskon
- Campaign early bird
- Campaign referral

### 3.4 Newsletter
- Kirim email newsletter ke user
- Segmentasi: Semua user / User aktif / User baru / etc
- Template email
- Schedule kirim
- Open rate & click rate analytics

### 3.5 Program Referral
- Buat kode referral
- Atur reward (diskon, cashback)
- Tracking penggunaan referral
- Leaderboard referral

### 3.6 Placement Iklan
- Jual space iklan di homepage
- Jual space di email newsletter
- Jual placement di social media
- Harga & paket berbeda

---

## 4. Tim Finance

### 4.1 Dashboard Keuangan
- Total revenue platform
- Total komisi terkumpul
- Total refund
- Total penarikan dana creator
- Saldo perlu settlement

### 4.2 Laporan Transaksi
- Transaksi per hari
- Transaksi per event
- Transaksi per metode pembayaran
- Breakdown: Tiket + Admin Fee + Pajak

### 4.3 Proses Penarikan Dana
- Daftar request withdraw dari creator
- Review: Cek saldo, validitas rekening
- Approve / Reject
- Proses transfer bank
- Update status

### 4.4 Proses Refund
- Daftar refund yang perlu diproses
- Proses pengembalian dana ke user
- Cek metode asal pembayaran
- Update status refund

### 4.5 Kelola Pajak
- Hitung PPN (Pajak Pertambahan Nilai)
- Hitung Pajak Hiburan Daerah (jika ada)
- Laporan pajak bulanan
- Export SPT

### 4.6 Export Data
- Export laporan transaksi (CSV/Excel)
- Export laporan keuangan (PDF)
- Export data untuk akuntansi

---

## 5. Reseller / Agen Tiket

### 5.1 Terima Kode Tiket
- Terima kode/link dari Event Creator
- Batas kuota penjualan

### 5.2 Jual Tiket
- Jual ke pembeli offline
- Terima pembayaran cash/transfer
- Input data pembeli
- Cetak tiket fisik (opsional)

### 5.3 Validasi
- Cek status tiket yang dijual
- Laporkan penjualan ke Creator
