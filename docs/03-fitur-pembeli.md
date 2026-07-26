# Fitur Lengkap untuk Pembeli Tiket

---

## 1. Autentikasi

### 1.1 Registrasi
- Daftar dengan Email
- Daftar dengan Nomor HP (OTP)
- Daftar dengan Google OAuth
- Daftar dengan Apple ID
- Verifikasi Email (link)
- Verifikasi HP (OTP via WA/SMS)

### 1.2 Login
- Login dengan Email + Password
- Login dengan HP + OTP
- Login dengan Google
- Login dengan Apple
- "Ingat saya" (remember me)
- Lupa password → Reset via email/HP

---

## 2. Homepage & Discovery

### 2.1 Homepage
- Hero Banner (carousel event unggulan)
- Kategori Populer (Konser, Festival, Teater, dll)
- Event Seru Untukmu (personalized)
- Lagi Trending
- Event Minggu Ini
- Jelajahi Berdasarkan Kota
- Promo Banner
- Search bar

### 2.2 Pencarian (Search)
- Full-text search event
- Auto-suggest / autocomplete
- Search by: judul event, nama artis, venue, kota
- Riwayat pencarian
- Pencarian populer

### 2.3 Filter & Sort
- Filter Kategori (Konser, Festival, Olahraga, dll)
- Filter Kota/Provinsi
- Filter Tanggal (hari ini, minggu ini, bulan ini, custom)
- Filter Harga (range)
- Filter Status (upcoming, ongoing, sold out)
- Sort: Terdekat, Terbaru, Termurah, Terpopuler

---

## 3. Detail Event

### 3.1 Informasi Event
- Poster/Banner event
- Judul event
- Deskripsi event (rich text)
- Kategori event
- Tanggal & waktu event
- Tanggal & waktu event berakhir (multi-day)
- Lokasi/Venue (dengan Google Maps)
- Nama penyelenggara (Event Creator)
- Syarat & Ketentuan
- Kebijakan refund
- FAQ event

### 3.2 Pilihan Tiket
- Daftar kategori tiket (GA, VIP, VVIP, dll)
- Harga per kategori
- Kuota tersisa per kategori
- Badge: "Laku Keras", "Terbatas", "Hampir Habis"
- Early Bird / Flash Sale price
- Group ticket (minimal pembelian)
- Multi-day pass

### 3.3 Aksi
- "Beli Tiket" → Masuk flow pembelian
- "Wishlist" → Simpan event
- "Share" → Bagikan ke social media / WhatsApp
- "Lihat Semua Event dari Creator ini"

---

## 4. Pembelian Tiket

### 4.1 Pilih Tiket
- Pilih kategori tiket
- Pilih jumlah tiket (max limit per transaksi)
- Lihat subtotal
- Input kode promo (opsional)
- Lihat rincian harga (tiket + admin fee + promo)

### 4.2 Isi Data Diri
- Nama lengkap (wajib)
- Email (wajib)
- Nomor HP/WhatsApp (wajib)
- Nomor KTP/Paspor (opsional, sesuai event)
- Data tambahan (custom field dari creator)
- Jika beli > 1 tiket: data untuk setiap tiket

### 4.3 Pilih Metode Pembayaran
- QRIS (scan dari mobile banking/e-wallet)
- Virtual Account (BCA, Mandiri, BRI, BNI, dll)
- E-Wallet (GoPay, OVO, Dana, ShopeePay)
- Kartu Kredit (Visa, Mastercard, JCB)
- Kartu Debit
- Transfer Bank (manual)
- Bayar di Indomaret/Alfamart

### 4.4 Konfirmasi & Bayar
- Ringkasan pesanan
- Total yang harus dibayar
- Countdown timer pembayaran (biasanya 30-60 menit)
- Redirect ke payment gateway
- Status pembayaran: Diproses → Berhasil / Gagal

### 4.5 E-Tiket
- QR Code unik per tiket
- Barcode
- Detail: Nama, Event, Tanggal, Kategori, Nomor Urut
- Download sebagai PDF
- Download sebagai Image (screenshot)
- Share via WhatsApp / Email
- Simpan ke Apple Wallet / Google Wallet (opsional)

---

## 5. Event Saya (My Events)

### 5.1 Daftar Tiket
- Tiket aktif (akan datang)
- Tiket sudah digunakan (completed)
- Tiket kedaluwarsa (expired)
- Tiket dibatalkan (cancelled)

### 5.2 Detail Tiket
- QR Code tiket
- Info event
- Info pembelian
- Status tiket
- Download tiket

### 5.3 Aksi
- Batalkan tiket → Request refund
- Lihat jalan ke venue (Google Maps)
- Hubungi CS

---

## 6. Wishlist

- Daftar event yang disimpan
- Notifikasi jika event yang di-wishlist mulai jual
- Hapus dari wishlist
- Beli langsung dari wishlist

---

## 7. Riwayat Pembelian

- Semua transaksi (sukses, gagal, refund)
- Detail transaksi
- Invoice/receipt
- Re-buy (beli lagi event yang sama)

---

## 8. Profil & Pengaturan

### 8.1 Profil
- Foto profil
- Nama lengkap
- Email
- Nomor HP
- Alamat (opsional)
- Tanggal lahir (opsional)

### 8.2 Pengaturan
- Ubah password
- Ubah email
- Ubah nomor HP
- Hapus akun
- Bahasa (ID/EN)
- Notifikasi (aktifkan/nonaktifkan)

---

## 9. Review & Rating

- Beri rating event (1-5 bintang)
- Tulis ulasan
- Upload foto (opsional)
- Lihat review dari user lain
- Hapus/ubah review sendiri

---

## 10. Notifikasi

- Email: Konfirmasi order, E-tiket, Refund, Promo
- WhatsApp: E-tiket, Reminder event
- Push Notification: Event baru, Promo, Reminder
- In-App: Semua notifikasi
