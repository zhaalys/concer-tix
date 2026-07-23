# Stakeholder & Role Lengkap ConcerTIX

## Ringkasan

ConcerTIX memiliki **13 role** yang masing-masing memiliki hak akses dan kebutuhan berbeda.

---

## 1. Guest (Pengunjung Belum Login)

**Siapa:** Orang yang mengakses website tanpa akun.

**Bisa:**
- Melihat homepage
- Mencari event
- Melihat detail event
- Melihat kategori & trending
- Melihat event berdasarkan kota
- Melihat harga tiket

**Tidak Bisa:**
- Membeli tiket
- Menyimpan ke wishlist
- Membuat event

---

## 2. Pembeli Tiket (User Biasa)

**Siapa:** User yang sudah daftar & login, membeli tiket.

**Bisa:**
- Semua yang Guest bisa
- Membeli tiket (pilih kategori, jumlah, bayar)
- Melihat e-tiket / tiket digital
- Menyimpan event ke wishlist
- Melihat riwayat pembelian
- Request refund
- Mengakses "Event Saya"
- Mengubah profil
- Memberikan review/rating

**Data:**
- Nama lengkap, Email, No HP (WA), Foto profil
- Riwayat pembelian, Wishlist

---

## 3. Event Creator (Penyelenggara Event)

**Siapa:** Pihak yang membuat event & menjual tiket. Bisa individu, komunitas, management artis, atau EO profesional.

**Bisa:**
- Daftar sebagai Event Creator
- Buat event baru
- Atur jenis tiket (GA, VIP, VVIP, Early Bird, dll)
- Atur harga & kuota tiket
- Atur jadwal penjualan (pre-sale, general sale, flash sale)
- Upload poster/banner event
- Pilih lokasi/venue
- Atur syarat & ketentuan event
- Dashboard penjualan real-time
- Laporan keuangan
- Data pembeli
- Batalkan event
- Proses refund (jika diizinkan admin)
- Tarik dana (withdraw)
- Kelola kode promo/voucher
- Undang sponsor
- Kirim notifikasi ke pembeli
- Download data pembeli (export)
- Buat tiket undangan (invitation ticket)
- On-the-spot ticketing

**Data:**
- Nama/organisasi, Email, No HP
- NIK (verifikasi), Rekening bank
- NPWP (opsional)
- Daftar event, Riwayat penjualan, Saldo tersedia

---

## 4. Admin Platform (Admin Biasa)

**Siapa:** Karyawan ConcerTIX yang mengelola operasional harian.

**Bisa:**
- Dashboard keseluruhan
- Review & approve event baru
- Review & approve Event Creator baru
- Monitor semua transaksi
- Monitor jumlah user baru
- Handle komplain/refund
- Hubungi user via WA/Email
- Kelola kategori event
- Kelola banner/promo homepage
- Buat & kelola promo/kode diskon
- Laporan harian/mingguan/bulanan
- Blokir akun yang melanggar

---

## 5. Super Admin

**Siapa:** Pemilik/level tertinggi ConcerTIX.

**Bisa:**
- Semua yang Admin bisa
- Kelola akun Admin (tambah/hapus/ubah role)
- Atur komisi/biaya admin
- Atur metode pembayaran
- Lihat seluruh laporan keuangan
- Tarik dana ke rekening perusahaan
- Atur kebijakan platform
- Hapus event
- Hapus akun user
- Ubah pengaturan sistem
- Lihat audit log
- Export laporan keuangan

---

## 6. Artis / Penampil (Performer)

**Siapa:** Artis/band/penampil yang tampil di event.

**Bisa (akun khusus):**
- Lihat jumlah tiket terjual
- Lihat data demografi pembeli
- Lihat schedule event
- Download laporan penjualan
- Hubungi Event Creator

**Catatan:** Tidak semua event melibatkan Artis langsung. Data bisa diinput oleh Event Creator.

---

## 7. Gate Keeper / Ticket Validator

**Siapa:** Panitia/relawan yang validasi tiket di lokasi event.

**Bisa:**
- Scan QR Code tiket
- Lihat status tiket (valid/invalid/already used)
- Check-in manual (jika QR error)
- Lihat data pembeli (nama, kategori tiket)
- Catat jumlah hadir (attendance)

**Tidak Bisa:**
- Batalkan tiket
- Ubah data tiket
- Akses data pembeli lain selain yang discan

**Perangkat:** Smartphone/tablet dengan aplikasi scanner, QR scanner, Koneksi internet (atau offline mode dengan sync)

---

## 8. Customer Service (CS)

**Siapa:** Tim support yang bantu user & Event Creator.

**Bisa:**
- Cari tiket dengan ID pesanan
- Lihat status pesanan
- Bantu proses refund
- Handle komplain
- Kirim email/notifikasi ke user
- Catat tiket masuk/laporan (ticketing system)
- Ubah data pesanan (kondisi tertentu)
- Bantu reset password

---

## 9. Tim Marketing

**Siapa:** Tim yang mengelola promosi platform & event unggulan.

**Bisa:**
- Kelola konten homepage (banner, trending, promo)
- Kelola social media platform
- Buat promo/kode diskon
- Kelola placement iklan event
- Kirim newsletter ke user
- Kelola program referral
- Buat campaign marketing

---

## 10. Tim Finance

**Siapa:** Tim keuangan yang kelola alur dana platform.

**Bisa:**
- Lihat laporan transaksi harian
- Proses penarikan dana Event Creator
- Proses refund
- Hitung komisi platform
- Kelola pajak
- Buat laporan keuangan
- Export data transaksi

---

## 11. Sponsor

**Siapa:** Pihak ketiga yang sponsori event (brand, perusahaan).

**Bisa:**
- Lihat event yang bisa disponsori
- Ajukan sponsorship ke Event Creator
- Logo/brand ditampilkan di halaman event
- Lihat laporan penjualan event (opsional)

**Catatan:** Tidak punya akses langsung ke sistem. Interaksi via email/meeting.

---

## 12. Reseller / Agen Tiket

**Siapa:** Pihak ketiga yang jual tiket atas nama Event Creator.

**Bisa:**
- Terima kode tiket dari Event Creator
- Jual tiket ke pembeli
- Cetak tiket fisik (opsional)
- Validasi tiket yang dijual

**Catatan:** Tidak punya akses ke dashboard. Transaksi offline atau link khusus.

---

## 13. Payment Gateway Partner

**Siapa:** Mitra pembayaran (Midtrans, Xendit, DOKU, dll).

**Dilakukan:**
- Proses pembayaran dari pembeli
- Kirim notifikasi pembayaran berhasil/gagal
- Proses refund
- Kirim data transaksi ke platform
- Kelola settlement dana

**Integrasi:** Webhook/callback, API transaksi, API cek status, API refund

---

## Ringkasan Role vs Akses

| Role | Login | Beli Tiket | Buat Event | Admin Panel | Validasi | Tarik Dana |
|------|:-----:|:----------:|:----------:|:-----------:|:--------:|:----------:|
| Guest | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Pembeli | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Event Creator | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Admin | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Super Admin | ✅ | ❌ | ❌ | ✅ Full | ❌ | ✅ |
| Artis | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Gate Keeper | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| CS | ✅ | ❌ | ❌ | ✅ Limited | ❌ | ❌ |
| Marketing | ✅ | ❌ | ❌ | ✅ Content | ❌ | ❌ |
| Finance | ✅ | ❌ | ❌ | ✅ Finance | ❌ | ✅ |
| Sponsor | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Reseller | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Payment Gateway | N/A | N/A | N/A | N/A | N/A | N/A |
