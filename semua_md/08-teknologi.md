# Tech Stack & Integrasi ConcerTIX

---

## 1. Tech Stack Saat Ini

### Frontend
| Teknologi | Versi | Keterangan |
|-----------|-------|------------|
| Next.js | 16.2.11 | React framework |
| React | 19.2.4 | UI library |
| TypeScript | ^5 | Type safety |
| Tailwind CSS | ^4 | Utility-first CSS |

### Backend
| Teknologi | Versi | Keterangan |
|-----------|-------|------------|
| Node.js | - | Runtime |
| Express.js | ^5.2.1 | Web framework |

---

## 2. Tech Stack yang Direkomendasikan

### Database
| Opsi | Keterangan |
|------|------------|
| **PostgreSQL** | Recommended - Relational, JSON support, scalable |
| MySQL | Alternatif - lebih sederhana |

### ORM
| Opsi | Keterangan |
|------|------------|
| **Prisma** | Recommended - Type-safe, migration, auto-generate |
| Sequelize | Alternatif |

### Authentication
| Opsi | Keterangan |
|------|------------|
| **JWT + bcrypt** | Stateless auth, refresh token |
| NextAuth.js | Jika pakai Next.js API routes |
| Google OAuth | Login dengan Google |
| Apple Sign In | Login dengan Apple |

---

## 3. Integrasi Payment Gateway

### Midtrans (Recommended)
| Fitur | Endpoint |
|-------|----------|
| Buat transaksi | `POST /v2/charge` |
| Cek status | `GET /v2/{order_id}/status` |
| Refund | `POST /v2/{order_id}/refund` |
| Webhook | Callback URL untuk notifikasi |

### Xendit (Alternatif)
| Fitur | Endpoint |
|-------|----------|
| Buat transaksi | `POST /v2/invoices` |
| Cek status | `GET /v2/invoices/{id}` |
| Refund | `POST /v2/refunds` |
| Webhook | Callback URL untuk notifikasi |

### Metode Pembayaran yang Didukung
- **QRIS** - QR Code Indonesia Standard
- **Virtual Account** - BCA, Mandiri, BRI, BNI, CIMB, dll
- **E-Wallet** - GoPay, OVO, Dana, ShopeePay
- **Kartu Kredit/Debit** - Visa, Mastercard, JCB
- **Convenience Store** - Indomaret, Alfamart

---

## 4. Integrasi Email Service

### Opsi
| Service | Keterangan |
|---------|------------|
| **Resend** | Recommended - Simple, modern |
| SendGrid | Alternatif - lebih banyak fitur |
| Nodemailer | Self-hosted option |
| AWS SES | Enterprise solution |

### Email yang Dikirim
- Konfirmasi registrasi
- Verifikasi email
- Konfirmasi order
- E-Tiket (attachment QR)
- Notifikasi refund
- Reminder event
- Newsletter promosi

---

## 5. Integrasi WhatsApp

### Opsi
| Service | Keterangan |
|---------|------------|
| **Wablas** | Popular di Indonesia |
| Fonnte | Alternatif |
| WA Business API (Official) | Official dari Meta |

### Pesan yang Dikirim
- E-Tiket via WhatsApp
- Konfirmasi order
- Reminder event
- Notifikasi refund
- Balasan komplain CS

---

## 6. Integrasi Storage

### Opsi
| Service | Keterangan |
|---------|------------|
| **Cloudinary** | Recommended - Image optimization |
| AWS S3 | Enterprise |
| Google Cloud Storage | Enterprise |

### File yang Disimpan
- Poster & Banner event
- Foto profil user
- Logo sponsor
- Bukti refund
- KTP/NIK (verifikasi)
- E-Tiket PDF

---

## 7. QR Code Generator

### Package
| Package | Keterangan |
|---------|------------|
| `qrcode` | Node.js QR generator |
| `qrcode.react` | React component QR |

### Penggunaan
- Generate QR Code per tiket
- Unique code per order_item
- Embedded dalam e-tiket
- Scan oleh Gate Keeper

---

## 8. Integrasi Maps

### Opsi
| Service | Keterangan |
|---------|------------|
| **Google Maps** | Recommended |
| Mapbox | Alternatif |

### Penggunaan
- Tampilkan lokasi venue
- Directions ke venue
- Geocoding alamat
- Search lokasi

---

## 9. Integrasi Analytics

### Opsi
| Service | Keterangan |
|---------|------------|
| **Google Analytics** | Free, standard |
| Mixpanel | Event tracking |
| Hotjar | Heatmap & session recording |

### Metric yang Dilacak
- Page views
- Event views
- Conversion rate (view → buy)
- User behavior
- Revenue tracking

---

## 10. Arsitektur Sistem

```
┌──────────────────────────────────────────────────────┐
│                    FRONTEND                          │
│              Next.js 16 + React 19                   │
│         (SSR/SSG, Client Components)                 │
└──────────────────────┬───────────────────────────────┘
                       │ API Calls (REST/GraphQL)
                       ▼
┌──────────────────────────────────────────────────────┐
│                    BACKEND                           │
│              Express.js + Node.js                    │
│         (API, Auth, Business Logic)                  │
└───┬──────────┬──────────┬──────────┬────────────────┘
    │          │          │          │
    ▼          ▼          ▼          ▼
┌───────┐ ┌───────┐ ┌───────┐ ┌───────────┐
│  DB   │ │Payment│ │ Email │ │WhatsApp   │
│Postgre│ │Gateway│ │Service│ │Service    │
│ SQL   │ │Midtrans│ │Resend │ │Wablas     │
└───────┘ └───────┘ └───────┘ └───────────┘
    │          │          │          │
    ▼          ▼          ▼          ▼
┌──────────────────────────────────────────────────────┐
│                   EXTERNAL SERVICES                  │
│  - Cloudinary (Storage)                              │
│  - Google Maps (Location)                            │
│  - Google Analytics (Tracking)                       │
└──────────────────────────────────────────────────────┘
```

---

## 11. Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/concertix

# Auth
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

# Payment Gateway (Midtrans)
MIDTRANS_SERVER_KEY=your_server_key
MIDTRANS_CLIENT_KEY=your_client_key
MIDTRANS_IS_PRODUCTION=false

# Email (Resend)
RESEND_API_KEY=your_api_key
EMAIL_FROM=noreply@concertix.com

# WhatsApp (Wablas)
WABLAS_API_KEY=your_api_key
WABLAS_URL=https://wablas.com/api

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google Maps
GOOGLE_MAPS_API_KEY=your_api_key

# Google Analytics
GA_MEASUREMENT_ID=G-XXXXXXXXXX

# App
NEXT_PUBLIC_API_URL=http://localhost:3001
NODE_ENV=development
```

---

## 12. API Structure

```
/api
├── /auth
│   ├── POST /register
│   ├── POST /login
│   ├── POST /logout
│   ├── POST /refresh-token
│   ├── POST /forgot-password
│   ├── POST /reset-password
│   ├── POST /verify-email
│   └── POST /verify-phone
│
├── /users
│   ├── GET /profile
│   ├── PUT /profile
│   ├── PUT /password
│   └── DELETE /account
│
├── /events
│   ├── GET / (list, filter, search)
│   ├── GET /:id (detail)
│   ├── POST / (create - creator)
│   ├── PUT /:id (update - creator)
│   ├── DELETE /:id (delete - creator/admin)
│   ├── POST /:id/submit-review (submit for admin review)
│   └── GET /:id/tickets (ticket categories)
│
├── /orders
│   ├── POST / (create order)
│   ├── GET /:id (detail)
│   ├── GET /my-orders (user's orders)
│   ├── POST /:id/cancel
│   └── POST /:id/refund
│
├── /payments
│   ├── POST /process
│   ├── GET /status/:orderId
│   └── POST /callback (webhook from gateway)
│
├── /e-tickets
│   ├── GET /:orderId (get e-tickets)
│   └── POST /validate (gate keeper scan)
│
├── /creator
│   ├── GET /dashboard
│   ├── GET /events (my events)
│   ├── GET /orders (my event orders)
│   ├── GET /withdrawals
│   ├── POST /withdrawals
│   └── GET /reports
│
├── /admin
│   ├── GET /dashboard
│   ├── GET /users
│   ├── PUT /users/:id/status
│   ├── GET /events (all, pending)
│   ├── PUT /events/:id/approve
│   ├── PUT /events/:id/reject
│   ├── GET /orders (all)
│   ├── GET /refunds (pending)
│   ├── PUT /refunds/:id/approve
│   ├── GET /reports
│   ├── POST /banners
│   └── POST /promos
│
├── /reviews
│   ├── POST / (create)
│   ├── GET /event/:eventId
│   └── DELETE /:id
│
├── /wishlists
│   ├── POST / (add)
│   ├── GET / (list)
│   └── DELETE /:eventId (remove)
│
└── /notifications
    ├── GET / (list)
    ├── PUT /:id/read
    └── PUT /read-all
```
