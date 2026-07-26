# Fitur Lengkap untuk Admin Platform

---

## 1. Dashboard Admin

### 1.1 Overview
- Total event aktif
- Total user (pembeli + creator)
- Total transaksi hari ini
- Total pendapatan platform
- Event pending review
- Komplain pending
- Grafik transaksi harian/mingguan/bulanan

### 1.2 Quick Stats
- User baru hari ini
- Event baru hari ini
- Tiket terjual hari ini
- Refund pending

---

## 2. Kelola User

### 2.1 Daftar User
- Semua user (pembeli, creator, admin, gate keeper)
- Filter: Role, Status, Tanggal daftar, Kota
- Search by: Nama, Email, No HP
- Detail: Profil, Riwayat, Status akun

### 2.2 Aksi User
- Lihat detail akun
- Aktifkan/nonaktifkan akun
- Blokir/unblock akun
- Hapus akun
- Ubah role (admin only)
- Reset password
- Kirim notifikasi

### 2.3 Verifikasi Creator
- Review aplikasi Event Creator baru
- Lihat data KTP/NIK
- Approve / Reject + alasan

---

## 3. Kelola Event

### 3.1 Review Event Baru
- Daftar event pending review
- Lihat detail event
- Cek kelengkapan data
- Approve / Reject + alasan
- Request perubahan

### 3.2 Semua Event
- Daftar semua event
- Filter: Status, Kategori, Kota, Tanggal
- Search by: Judul event
- Detail: Info, Tiket, Penjualan

### 3.3 Aksi Event
- Edit event (override creator)
- Unpublish event
- Hapus event
- Tandai sebagai "Event Unggulan" / "Featured"
- Tambah ke kategori trending
- Catatan internal

---

## 4. Kelola Transaksi

### 4.1 Semua Transaksi
- Daftar semua order
- Filter: Status, Tanggal, Metode bayar, Event
- Detail: Order, Pembeli, Tiket, Pembayaran

### 4.2 Status Order
- Pending (belum bayar)
- Paid (sudah bayar)
- Used (tiket sudah dipakai)
- Refunded (sudah refund)
- Expired (waktu habis)
- Cancelled (dibatalkan)

### 4.3 Aksi Transaksi
- Lihat detail
- Batalkan order
- Proses refund
- Kirim ulang e-tiket
- Catatan internal

---

## 5. Kelola Refund

### 5.1 Request Refund
- Daftar request refund pending
- Detail: User, Event, Alasan, Bukti
- History komunikasi dengan user

### 5.2 Proses Refund
- Review alasan
- Approve / Reject + alasan
- Proses pengembalian dana
- Notifikasi ke user & creator

---

## 6. Kelola Kategori

- Daftar semua kategori event
- Tambah kategori baru
- Edit nama kategori
- Ubah icon/warna kategori
- Atur urutan tampil
- Aktifkan/nonaktifkan kategori

---

## 7. Kelola Konten Homepage

### 7.1 Banner
- Upload/banner promosi
- Atur urutan tampil
- Atur jadwal tampil
- Link tujuan

### 7.2 Featured Events
- Pilih event unggulan
- Atur posisi tampil
- Atur jadwal tampil

### 7.3 Kategori Populer
- Atur kategori yang tampil di homepage
- Atur urutan

---

## 8. Kelola Promo Platform

### 8.1 Buat Promo Global
- Kode promo umum (berlaku untuk semua event)
- Diskon: Persen / Nominal
- Kuota total
- Berlaku untuk: Semua user / User baru / Segment tertentu
- Berlaku untuk: Semua event / Event tertentu
- Tanggal berlaku

### 8.2 Kelola Promo
- Edit, Aktifkan, Nonaktifkan, Hapus
- Lihat statistik penggunaan
- Lihat total diskon yang diberikan

---

## 9. Laporan

### 9.1 Laporan Harian
- Total transaksi
- Total pendapatan
- Total komisi platform
- User baru
- Event baru
- Refund

### 9.2 Laporan Mingguan/Bulanan
- Grafik trend
- Perbandingan dengan periode sebelumnya
- Top event by penjualan
- Top kategori
- Top kota

### 9.3 Laporan Keuangan
- Total revenue
- Komisi platform
- Pajak
- Refund total
- Net income

### 9.4 Export
- Export ke CSV
- Export ke PDF
- Export ke Excel

---

## 10. Kelola Admin

### 10.1 Daftar Admin (Super Admin)
- Semua admin
- Role: Super Admin, Admin, CS, Marketing, Finance
- Status aktif/nonaktif

### 10.2 Aksi Admin
- Tambah admin baru
- Edit role
- Aktifkan/nonaktifkan
- Hapus akun
- Reset password

---

## 11. Audit Log

- Semua aksi admin tercatat
- Waktu, Admin, Aksi, Detail
- Filter: Admin, Aksi, Tanggal
- Tidak bisa dihapus

---

## 12. Pengaturan Platform

### 12.1 Komisi
- Atur persentase komisi per event
- Komisi default
- Komisi per kategori event

### 12.2 Metode Pembayaran
- Aktifkan/nonaktifkan metode bayar
- Atur minimal transaksi per metode
- Konfigurasi Payment Gateway

### 12.3 Email Template
- Template konfirmasi order
- Template e-tiket
- Template refund
- Template promosi

### 12.4 Umum
- Nama platform
- Logo
- Favicon
- URL website
- Info kontak
- Syarat & Ketentuan
- Kebijakan Privasi
