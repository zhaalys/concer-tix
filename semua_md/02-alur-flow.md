# Alur & Workflow Lengkap ConcerTIX

---

## 1. Alur Pembeli (End-to-End)

```
┌─────────────┐
│   GUEST     │
│  (Browse)   │
└──────┬──────┘
       ▼
┌─────────────┐
│ Cari Event  │ ← Search, Filter Kategori/Kota/Tanggal
└──────┬──────┘
       ▼
┌─────────────┐
│ Lihat Detail│ ← Poster, Deskripsi, Venue, Harga, Syarat
│   Event     │
└──────┬──────┘
       ▼
┌─────────────┐
│Pilih Tiket  │ ← GA / VIP / VVIP / Early Bird / Flash Sale
│& Jumlah     │
└──────┬──────┘
       ▼
┌─────────────────┐
│Isi Data Diri    │ ← Nama, Email, No HP, KTP (opsional)
│(Belum Login?)   │ ← Jika belum: daftar/login dulu
└──────┬──────────┘
       ▼
┌─────────────────┐
│Pilih Metode     │ ← QRIS, VA, E-Wallet, Kartu, Indomaret
│Pembayaran       │
└──────┬──────────┘
       ▼
┌─────────────────┐
│   PEMBAYARAN    │ ← Redirect ke payment gateway
│   BERHASIL?     │
└───┬─────────┬───┘
    │ YA      │ TIDAK
    ▼         ▼
┌────────┐ ┌────────┐
│E-Tiket │ │Timeout/│
│Dikirim │ │Gagal   │
│Email/WA│ │→ Bayar │
└───┬────┘ │  Ulang │
    ▼      └────────┘
┌────────────┐
│ Simpan     │ ← Download PDF / Screenshot QR
│ E-Tiket    │
└──────┬─────┘
       ▼
┌────────────┐
│ Datang ke  │ ← Bawa e-tiket (HP atau cetak)
│   Event    │
└──────┬─────┘
       ▼
┌────────────┐
│ Scan QR di │ ← Gate Keeper scan → Valid → Check-in
│    Gate    │
└──────┬─────┘
       ▼
┌────────────┐
│  MASUK     │ ← Enjoy the event!
│   EVENT    │
└────────────┘
```

---

## 2. Alur Event Creator

```
┌──────────────────┐
│  DAFTAR SEBAGAI  │ ← Isi data, verifikasi email/HP
│  EVENT CREATOR   │
└────────┬─────────┘
         ▼
┌──────────────────┐
│   ADMIN REVIEW   │ ← Admin approve/reject akun
│   & APPROVE      │
└────────┬─────────┘
         ▼
┌──────────────────┐
│  BUAT EVENT BARU │ ← Isi judul, deskripsi, kategori
└────────┬─────────┘
         ▼
┌──────────────────┐
│  UPLOAD MEDIA    │ ← Poster, Banner, Video trailer
└────────┬─────────┘
         ▼
┌──────────────────┐
│  ATUR JENIS      │ ← GA, VIP, VVIP, Early Bird, Group
│  TIKET           │
└────────┬─────────┘
         ▼
┌──────────────────┐
│  ATUR HARGA &    │ ← Per kategori, kuota per kategori
│  KUOTA           │
└────────┬─────────┘
         ▼
┌──────────────────┐
│  ATUR JADWAL     │ ← Pre-sale → General Sale → Flash Sale
│  PENJUALAN       │
└────────┬─────────┘
         ▼
┌──────────────────┐
│  SET LOKASI/     │ ← Venue, Alamat, Google Maps
│  VENUE           │
└────────┬─────────┘
         ▼
┌──────────────────┐
│  SET SYARAT &    │ ← Aturan event, refund policy
│  KETENTUAN       │
└────────┬─────────┘
         ▼
┌──────────────────┐
│  PUBLISH EVENT   │ ← Submit untuk review admin
└────────┬─────────┘
         ▼
┌──────────────────┐
│  ADMIN APPROVE   │ ← Event tampil di platform
│  EVENT           │
└────────┬─────────┘
         ▼
┌──────────────────┐
│  MONITOR         │ ← Dashboard real-time penjualan
│  PENJUALAN       │
└────────┬─────────┘
         ▼
┌──────────────────┐
│  TERIMA DANA     │ ← Dana masuk ke saldo creator
└────────┬─────────┘
         ▼
┌──────────────────┐
│  TARIK DANA      │ ← Request → Admin Review → Transfer
│  (WITHDRAW)      │
└──────────────────┘
```

---

## 3. Alur Admin

```
┌──────────────────┐
│  LOGIN ADMIN     │
│  PANEL           │
└────────┬─────────┘
         ▼
┌──────────────────┐     ┌──────────────────┐
│  DASHBOARD       │────→│ Lihat Overview   │
│  OVERVIEW        │     │ Total Event/User │
└────────┬─────────┘     │ Transaksi/Hari   │
         │               └──────────────────┘
         ▼
┌──────────────────┐
│  REVIEW EVENT    │ ← Event baru masuk queue
│  BARU            │
└───┬──────────┬───┘
    │          │
    ▼          ▼
┌────────┐ ┌────────┐
│APPROVE │ │ REJECT │ ← Kirim alasan ke Creator
└────┬───┘ └────────┘
     ▼
┌──────────────────┐
│  MONITOR         │ ← Semua transaksi, user baru
│  TRANSAKSI       │
└────────┬─────────┘
         ▼
┌──────────────────┐
│  HANDLE          │ ← Komplain dari pembeli/creator
│  KOMPLAIN        │
└────────┬─────────┘
         ▼
┌──────────────────┐
│  PROSES REFUND   │ ← Review request → Approve/Reject
└────────┬─────────┘
         ▼
┌──────────────────┐
│  BUAT LAPORAN    │ ← Harian, Mingguan, Bulanan
└──────────────────┘
```

---

## 4. Alur Gate Keeper / Validator

```
┌──────────────────┐
│  BUKA APLIKASI   │ ← Login dengan akun gate keeper
│  SCANNER         │
└────────┬─────────┘
         ▼
┌──────────────────┐
│  PILIH EVENT     │ ← Jika handle beberapa event
│  (jika perlu)    │
└────────┬─────────┘
         ▼
┌──────────────────┐
│  SCAN QR CODE    │ ← Arahkan kamera ke QR tiket
│  TIKET           │
└────────┬─────────┘
         ▼
┌──────────────────┐
│  SISTEM VALIDASI │ ← Cek: Valid? Already Used? Expired?
└───┬──────┬───┬───┘
    │      │   │
    ▼      ▼   ▼
┌──────┐┌──────┐┌────────┐
│VALID ││USED  ││INVALID │
│✅    ││❌    ││❌      │
│Check-││Tolak ││Cek     │
│ in   ││      ││Manual  │
└──┬───┘└──────┘└────────┘
   ▼
┌──────────────────┐
│  CATAT KEHADIRAN │ ← Attendance tracker
└──────────────────┘

MODE OFFLINE:
- Scanner tetap bisa scan tanpa internet
- Data tersimpan lokal
- Saat ada internet → Sync ke server
```

---

## 5. Alur Refund

```
┌──────────────────┐
│  USER REQUEST    │ ← User klik "Request Refund" di "Event Saya"
│  REFUND          │
└────────┬─────────┘
         ▼
┌──────────────────┐
│  ISI ALASAN      │ ← Pilih alasan + upload bukti (opsional)
│  REFUND          │
└────────┬─────────┘
         ▼
┌──────────────────┐
│  CS REVIEW       │ ← CS cek apakah memenuhi syarat
└───┬──────────┬───┘
    │          │
    ▼          ▼
┌────────┐ ┌────────┐
│PROSES  ││TOLAK   │
│LANJUT  ││REFUND  │← Kirim alasan penolakan
└────┬───┘└────────┘
     ▼
┌──────────────────┐
│  ADMIN APPROVE   │ ← Admin final approve
└───┬──────────┬───┘
    │          │
    ▼          ▼
┌────────┐ ┌────────┐
│APPROVE ││ REJECT │
└────┬───┘└────────┘
     ▼
┌──────────────────┐
│  DANA DIKEMBALI  │ ← Ke rekening/e-wallet user
│  KE USER         │   (sesuai metode bayar awal)
└────────┬─────────┘
         ▼
┌──────────────────┐
│  USER DAPAT      │ ← Email/WA notifikasi refund
│  NOTIFIKASI      │
└──────────────────┘
```

---

## 6. Alur Penarikan Dana (Withdraw)

```
┌──────────────────┐
│  CREATOR REQUEST │ ← Klik "Tarik Dana" di dashboard
│  WITHDRAW        │
└────────┬─────────┘
         ▼
┌──────────────────┐
│  MASUKKAN JUMLAH │ ← Minimal Rp 100.000
│  & REKENING      │
└────────┬─────────┘
         ▼
┌──────────────────┐
│  ADMIN REVIEW    │ ← Cek saldo, validitas
└───┬──────────┬───┘
    │          │
    ▼          ▼
┌────────┐ ┌────────┐
│APPROVE ││ REJECT │
└────┬───┘└────────┘
     ▼
┌──────────────────┐
│  FINANCE PROSES  │ ← Transfer via bank
└────────┬─────────┘
         ▼
┌──────────────────┐
│  DANA MASUK      │ ← 1-3 hari kerja
│  KE REKENING     │
└────────┬─────────┘
         ▼
┌──────────────────┐
│  NOTIFIKASI      │ ← Email/WA ke Creator
└──────────────────┘
```

---

## 7. Alur Pembayaran (Detail)

```
┌──────────────────┐
│  USER PILIH      │
│  METODE BAYAR    │
└──┬───┬───┬───┬───┘
   │   │   │   │
   ▼   ▼   ▼   ▼
┌───┐┌───┐┌───┐┌──────┐
│QR ││VA ││E- ││Kartu │
│IS ││   ││Wal││Kredit│
└─┬─┘└─┬─┘└─┬─┘└──┬───┘
  │    │    │     │
  ▼    ▼    ▼     ▼
┌────────────────────┐
│  PAYMENT GATEWAY   │ ← Midtrans / Xendit
│  MEMPROSES         │
└────────┬───────────┘
         ▼
┌────────────────────┐
│  STATUS BAYAR?     │
└───┬────────────┬───┘
    │            │
    ▼            ▼
┌────────┐  ┌────────┐
│SUCCESS │  │ FAILED │
└────┬───┘  └────┬───┘
     │           │
     ▼           ▼
┌──────────┐  ┌──────────┐
│WEBHOOK   │  │USER      │
│CALLBACK  │  │NOTIFIKASI│
│KE SERVER │  │GAGAL     │
└────┬─────┘  │→ BAYAR   │
     │        │  ULANG   │
     ▼        └──────────┘
┌──────────────┐
│UPDATE STATUS │
│ORDER → PAID  │
└────┬─────────┘
     ▼
┌──────────────┐
│GENERATE      │
│E-TIKET (QR)  │
└────┬─────────┘
     ▼
┌──────────────┐
│KIRIM E-TIKET │
│EMAIL + WA    │
└──────────────┘
```

---

## 8. Alur Notifikasi

```
┌─────────────────────────────────────────┐
│              TRIGGER NOTIFIKASI          │
└──────┬──────┬──────┬──────┬──────┬──────┘
       │      │      │      │      │
       ▼      ▼      ▼      ▼      ▼
    ┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐
    │Order ││Pembay││Refund││Event ││Promo │
    │Baru  ││aran  ││Diteri││Baru  ││Flash │
    │      ││Sukses││ma    ││      ││Sale  │
    └──┬───┘└──┬───┘└──┬───┘└──┬───┘└──┬───┘
       │       │       │       │       │
       ▼       ▼       ▼       ▼       ▼
    ┌──────────────────────────────────────┐
    │          KIRIM KE:                   │
    │  • Email (Notifikasi)                │
    │  • WhatsApp (Pesan Instan)           │
    │  • Push Notification (Browser)       │
    │  • In-App Notification               │
    └──────────────────────────────────────┘
```

---

## 9. Ringkasan Semua Alur

| Alur | Pihak Utama | Output |
|------|-------------|--------|
| Pembelian Tiket | Pembeli → Payment Gateway → E-Tiket | Tiket digital (QR) |
| Buat Event | Creator → Admin Review → Publish | Event live di platform |
| Validasi Tiket | Gate Keeper → Scan QR → Check-in | Attendance tercatat |
| Refund | User → CS → Admin → Finance | Dana dikembalikan |
| Penarikan Dana | Creator → Admin → Finance → Transfer | Dana ke rekening |
| Pembayaran | User → Payment Gateway → Callback | Status order updated |
| Notifikasi | System → Email/WA/Push | User terima info |
