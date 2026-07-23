# Database Schema ConcerTIX

---

## 1. users
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID/INT | Primary Key |
| name | VARCHAR(255) | Nama lengkap |
| email | VARCHAR(255) | Email (unique) |
| phone | VARCHAR(20) | No HP |
| password | VARCHAR(255) | Hashed password |
| role | ENUM | guest, pembeli, creator, admin, super_admin, gate_keeper, cs, marketing, finance |
| avatar | TEXT | URL foto profil |
| email_verified_at | TIMESTAMP | Waktu verifikasi email |
| phone_verified_at | TIMESTAMP | Waktu verifikasi HP |
| status | ENUM | active, inactive, banned |
| google_id | VARCHAR(255) | Google OAuth ID |
| apple_id | VARCHAR(255) | Apple OAuth ID |
| created_at | TIMESTAMP | Waktu daftar |
| updated_at | TIMESTAMP | Waktu update terakhir |

---

## 2. creator_profiles
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID/INT | Primary Key |
| user_id | UUID/INT | FK → users |
| organization_name | VARCHAR(255) | Nama organisasi/EO |
| description | TEXT | Deskripsi |
| ktp_number | VARCHAR(20) | Nomor KTP |
| ktp_image | TEXT | Foto KTP |
| npwp | VARCHAR(20) | Nomor NPWP (opsional) |
| bank_name | VARCHAR(50) | Nama bank |
| bank_account_number | VARCHAR(30) | Nomor rekening |
| bank_account_name | VARCHAR(255) | Nama pemilik rekening |
| status | ENUM | pending, approved, rejected |
| rejection_reason | TEXT | Alasan penolakan |
| balance | DECIMAL(15,2) | Saldo tersedia |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

---

## 3. events
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID/INT | Primary Key |
| creator_id | UUID/INT | FK → creator_profiles |
| title | VARCHAR(255) | Judul event |
| slug | VARCHAR(255) | URL slug (unique) |
| description | TEXT | Deskripsi (rich text) |
| category_id | UUID/INT | FK → categories |
| banner_image | TEXT | URL banner utama |
| poster_image | TEXT | URL poster |
| video_url | TEXT | URL video trailer |
| start_date | TIMESTAMP | Tanggal & waktu mulai |
| end_date | TIMESTAMP | Tanggal & waktu selesai |
| doors_open | TIME | Jam pintu buka |
| venue_name | VARCHAR(255) | Nama venue |
| venue_address | TEXT | Alamat venue |
| city | VARCHAR(100) | Kota |
| province | VARCHAR(100) | Provinsi |
| latitude | DECIMAL(10,8) | GPS latitude |
| longitude | DECIMAL(11,8) | GPS longitude |
| status | ENUM | draft, pending_review, published, cancelled, completed |
| rejection_reason | TEXT | Alasan ditolak admin |
| terms_conditions | TEXT | Syarat & ketentuan |
| refund_policy | TEXT | Kebijakan refund |
| min_age | INT | Usia minimum (opsional) |
| is_featured | BOOLEAN | Event unggulan |
| total_tickets_sold | INT | Total tiket terjual |
| views | INT | Jumlah dilihat |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

---

## 4. event_categories
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID/INT | Primary Key |
| name | VARCHAR(100) | Nama kategori |
| slug | VARCHAR(100) | URL slug |
| icon | VARCHAR(50) | Material icon name |
| color | VARCHAR(7) | Hex color |
| sort_order | INT | Urutan tampil |
| is_active | BOOLEAN | Aktif/tidak |
| created_at | TIMESTAMP | |

---

## 5. ticket_categories
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID/INT | Primary Key |
| event_id | UUID/INT | FK → events |
| name | VARCHAR(100) | Nama kategori tiket (GA, VIP, dll) |
| description | TEXT | Benefit deskripsi |
| price | DECIMAL(12,2) | Harga |
| original_price | DECIMAL(12,2) | Harga sebelum diskon (opsional) |
| quota | INT | Total kuota |
| sold | INT | Terjual |
| min_purchase | INT | Minimal pembelian (untuk group) |
| max_purchase | INT | Maksimal per transaksi |
| sale_start | TIMESTAMP | Mulai dijual |
| sale_end | TIMESTAMP | Berhenti dijual |
| is_active | BOOLEAN | Aktif/tidak |
| sort_order | INT | Urutan |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

---

## 6. orders
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID/INT | Primary Key |
| order_number | VARCHAR(20) | Nomor pesanan (unique) |
| user_id | UUID/INT | FK → users |
| event_id | UUID/INT | FK → events |
| subtotal | DECIMAL(12,2) | Total harga tiket |
| admin_fee | DECIMAL(12,2) | Biaya admin |
| discount | DECIMAL(12,2) | Diskon dari promo |
| tax | DECIMAL(12,2) | Pajak |
| total | DECIMAL(12,2) | Total bayar |
| promo_code | VARCHAR(50) | Kode promo (opsional) |
| status | ENUM | pending, paid, used, refunded, expired, cancelled |
| payment_method | VARCHAR(50) | Metode bayar |
| paid_at | TIMESTAMP | Waktu bayar |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

---

## 7. order_items
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID/INT | Primary Key |
| order_id | UUID/INT | FK → orders |
| ticket_category_id | UUID/INT | FK → ticket_categories |
| buyer_name | VARCHAR(255) | Nama pembeli tiket ini |
| buyer_email | VARCHAR(255) | Email pembeli |
| buyer_phone | VARCHAR(20) | HP pembeli |
| buyer_id_number | VARCHAR(30) | KTP/Paspor (opsional) |
| custom_fields | JSON | Data custom dari creator |
| price | DECIMAL(12,2) | Harga saat beli |
| created_at | TIMESTAMP | |

---

## 8. e_tickets
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID/INT | Primary Key |
| order_item_id | UUID/INT | FK → order_items |
| ticket_code | VARCHAR(50) | Kode tiket unik |
| qr_code | TEXT | QR Code (base64/URL) |
| barcode | TEXT | Barcode |
| status | ENUM | active, used, cancelled |
| checked_in_at | TIMESTAMP | Waktu check-in |
| checked_in_by | UUID/INT | FK → users (gate keeper) |
| created_at | TIMESTAMP | |

---

## 9. payments
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID/INT | Primary Key |
| order_id | UUID/INT | FK → orders |
| gateway | VARCHAR(50) | midtrans, xendit, dll |
| gateway_transaction_id | VARCHAR(100) | ID dari gateway |
| amount | DECIMAL(12,2) | Jumlah bayar |
| status | ENUM | pending, success, failed, expired |
| payment_type | VARCHAR(50) | Jenis pembayaran (bank_transfer, e_wallet, dll) |
| va_number | VARCHAR(30) | Virtual Account (opsional) |
| qr_string | TEXT | QR string (opsional) |
| callback_data | JSON | Data dari webhook |
| paid_at | TIMESTAMP | Waktu pembayaran berhasil |
| expires_at | TIMESTAMP | Batas waktu bayar |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

---

## 10. reviews
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID/INT | Primary Key |
| user_id | UUID/INT | FK → users |
| event_id | UUID/INT | FK → events |
| rating | INT | 1-5 |
| comment | TEXT | Ulasan |
| images | JSON | Array URL foto |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

---

## 11. promos
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID/INT | Primary Key |
| code | VARCHAR(50) | Kode promo (unique) |
| description | TEXT | Deskripsi |
| type | ENUM | percentage, fixed_amount |
| value | DECIMAL(12,2) | Nilai diskon |
| min_purchase | DECIMAL(12,2) | Minimal belanja |
| max_discount | DECIMAL(12,2) | Maks diskon (untuk percentage) |
| quota | INT | Kuota penggunaan |
| used_count | INT | Sudah dipakai |
| event_id | UUID/INT | FK → events (NULL = semua event) |
| creator_id | UUID/INT | FK → creator_profiles (NULL = dari platform) |
| start_date | TIMESTAMP | Mulai berlaku |
| end_date | TIMESTAMP | Berakhir |
| is_active | BOOLEAN | Aktif/tidak |
| created_by | UUID/INT | FK → users (admin/creator) |
| created_at | TIMESTAMP | |

---

## 12. wishlists
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID/INT | Primary Key |
| user_id | UUID/INT | FK → users |
| event_id | UUID/INT | FK → events |
| created_at | TIMESTAMP | |

---

## 13. refunds
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID/INT | Primary Key |
| order_id | UUID/INT | FK → orders |
| user_id | UUID/INT | FK → users |
| reason | TEXT | Alasan refund |
| evidence | JSON | Array URL bukti |
| amount | DECIMAL(12,2) | Jumlah refund |
| status | ENUM | pending, approved, rejected, processed |
| admin_note | TEXT | Catatan admin |
| processed_by | UUID/INT | FK → users (admin) |
| processed_at | TIMESTAMP | Waktu diproses |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

---

## 14. withdrawals
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID/INT | Primary Key |
| creator_id | UUID/INT | FK → creator_profiles |
| amount | DECIMAL(15,2) | Jumlah penarikan |
| bank_name | VARCHAR(50) | Nama bank |
| bank_account_number | VARCHAR(30) | Nomor rekening |
| bank_account_name | VARCHAR(255) | Nama pemilik |
| status | ENUM | pending, approved, rejected, transferred |
| admin_note | TEXT | Catatan admin |
| processed_by | UUID/INT | FK → users (admin) |
| processed_at | TIMESTAMP | Waktu diproses |
| transferred_at | TIMESTAMP | Waktu transfer |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

---

## 15. sponsors
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID/INT | Primary Key |
| event_id | UUID/INT | FK → events |
| name | VARCHAR(255) | Nama sponsor |
| logo | TEXT | URL logo |
| website | TEXT | Website sponsor |
| tier | ENUM | platinum, gold, silver, bronze |
| created_at | TIMESTAMP | |

---

## 16. notifications
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID/INT | Primary Key |
| user_id | UUID/INT | FK → users |
| type | VARCHAR(50) | order, payment, refund, promo, event |
| title | VARCHAR(255) | Judul notifikasi |
| message | TEXT | Isi notifikasi |
| data | JSON | Data tambahan |
| is_read | BOOLEAN | Sudah dibaca |
| channel | ENUM | email, whatsapp, push, in_app |
| sent_at | TIMESTAMP | Waktu terkirim |
| created_at | TIMESTAMP | |

---

## 17. banners
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID/INT | Primary Key |
| title | VARCHAR(255) | Judul banner |
| image | TEXT | URL gambar |
| link | TEXT | Link tujuan |
| position | ENUM | hero, sidebar, footer |
| sort_order | INT | Urutan |
| start_date | TIMESTAMP | Mulai tampil |
| end_date | TIMESTAMP | Berhenti tampil |
| is_active | BOOLEAN | Aktif/tidak |
| created_by | UUID/INT | FK → users |
| created_at | TIMESTAMP | |

---

## 18. audit_logs
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID/INT | Primary Key |
| user_id | UUID/INT | FK → users (admin) |
| action | VARCHAR(100) | Aksi yang dilakukan |
| entity_type | VARCHAR(50) | Tipe entity (event, user, order, dll) |
| entity_id | UUID/INT | ID entity |
| details | JSON | Detail perubahan |
| ip_address | VARCHAR(45) | IP address |
| created_at | TIMESTAMP | |

---

## Relasi

```
users ──────┬──── creator_profiles ──── events ────┬──── ticket_categories
            │                                       │
            ├──── orders ──────────────────────────┤
            │       │                               ├──── reviews
            │       ├──── order_items               │
            │       │       │                       ├──── sponsors
            │       │       └──── e_tickets         │
            │       │                               │
            │       └──── payments                  │
            │                                       │
            ├──── wishlists ─────────── events      │
            │                                       │
            ├──── refunds ────── orders             │
            │                                       │
            ├──── notifications                     │
            │                                       │
            └──── audit_logs                        │
                                                   │
creator_profiles ───── withdrawals                  │
                                                   │
promos ───── events (optional)                      │
                                                   │
banners (independent)                               │
                                                   │
event_categories ───── events
```
