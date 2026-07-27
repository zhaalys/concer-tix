"use client";

import { useState } from "react";
import Link from "next/link";

interface Milestone {
  year: string;
  tagline: string;
  title: string;
  description: string;
  img: string;
  stats: { label: string; value: string }[];
  highlights: string[];
}

const MILESTONES: Milestone[] = [
  {
    year: "2023",
    tagline: "Awal Pengabdian Untuk Musik",
    title: "Langkah Awal: Lahirnya Concer TIX",
    description:
      "Concer TIX didirikan dengan satu misi sederhana: menghapuskan antrean tiket berjam-jam dan memberi pengalaman pembelian tiket yang transparan, instan, dan aman bagi penikmat musik independen di Indonesia.",
    img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
    stats: [
      { label: "Event Pertama", value: "25+" },
      { label: "Pengguna Awal", value: "15.000+" },
      { label: "Kota Jangkauan", value: "3 Kota" },
    ],
    highlights: [
      "Peluncuran versi beta platform ticketing web",
      "Kemitraan awal dengan 10+ penyelenggara festival indie",
      "Penerapan sistem QR code e-ticket pertama",
    ],
  },
  {
    year: "2024",
    tagline: "Ekspansi & Pertumbuhan Pesat",
    title: "Menjadi Pilihan Utama Festival Nasional",
    description:
      "Dengan meningkatnya kepercayaan promotor musik, Concer TIX melebarkan jangkauan ke pulau Jawa, Bali, dan Sumatera. Kami menjadi mitra ticketing resmi festival musik skala menengah hingga besar.",
    img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
    stats: [
      { label: "Tiket Terjual", value: "150.000+" },
      { label: "Partner Promotor", value: "120+" },
      { label: "Kota Jangkauan", value: "18 Kota" },
    ],
    highlights: [
      "Integrasi pengiriman E-Ticket instan via WhatsApp",
      "Dukungan teknologi gate management di lokasi event",
      "Penanganan penjualan tiket berkategori (VIP, Festival, CAT)",
    ],
  },
  {
    year: "2025",
    tagline: "Inovasi Gate System & Tiket Gelang",
    title: "Revolusi Gate Entry & Keamanan Tiket",
    description:
      "Kami meluncurkan sistem pemindaian tiket gelang super cepat (di bawah 2 detik per pengunjung) untuk menangani puluhan ribu penonton festival tanpa penumpukan di pintu masuk.",
    img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    stats: [
      { label: "Kecepatan Entry", value: "< 2 Detik" },
      { label: "Total Event", value: "650+" },
      { label: "Kepuasan Penonton", value: "99.4%" },
    ],
    highlights: [
      "Sistem pemindaian offline-sync di arena konser luar ruangan",
      "Dukungan verifikasi identitas anti-calo",
      "Dashboard analytics real-time untuk promotor acara",
    ],
  },
  {
    year: "2026",
    tagline: "Platform Tiket Konser #1 di Indonesia",
    title: "Masa Depan Hiburan & Konser Megah",
    description:
      "Kini Concer TIX dipercaya oleh lebih dari 500,000 penikmat musik dan ratusan promotor terkemuka. Kami terus berinovasi membawa pengalaman hiburan terbaik dari Sabang sampai Merauke.",
    img: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
    stats: [
      { label: "Penikmat Konser", value: "500.000+" },
      { label: "Kota Aktif", value: "45+ Kota" },
      { label: "Partner Promotor", value: "350+" },
    ],
    highlights: [
      "Peluncuran fitur 'Jelajahi Sesuai Kota' interaktif",
      "Kemitraan tur konser internasional dan festival musik akbar",
      "Sistem pembayaran terintegrasi instan dengan keamanan enkripsi mutakhir",
    ],
  },
];

const CORE_VALS = [
  {
    icon: "verified_user",
    title: "Keamanan 100% Guaranteed",
    desc: "Setiap e-ticket dilengkapi dengan enkripsi kode unik dan verifikasi sistem anti-calo resmi.",
  },
  {
    icon: "bolt",
    title: "Pengiriman Instan & WA Notification",
    desc: "Tiket langsung terkirim ke email dan WhatsApp Anda dalam hitungan detik setelah pembayaran.",
  },
  {
    icon: "sensors",
    title: "Gate Management Modern",
    desc: "Teknologi wristband scan dan pemindai QR offline untuk masuk venue tanpa antrean panjang.",
  },
  {
    icon: "handshake",
    title: "Dukungan Promotor 24/7",
    desc: "Dashboard laporan keuangan & penjualan transparan dengan tim teknis yang siap mendampingi di lokasi.",
  },
];

const TESTIMONIALS = [
  {
    name: "Rizky Ramadhan",
    role: "Promotor Festival Musik Jakarta",
    comment:
      "Concer TIX benar-benar mengubah cara kami mengelola 20.000 penonton. Gate entry sangat lancar tanpa kendala sinyal!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Siti Rahmawati",
    role: "Penikmat Konser Setia",
    comment:
      "Beli tiket konser favorit cuma butuh 1 menit! E-ticket langsung masuk WhatsApp dan scan di lokasi cepat banget.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Dimas Anggara",
    role: "Project Manager Boss Creator",
    comment:
      "Dashboard analytics Concer TIX sangat membantu kami memantau grafik penjualan tiket real-time dari hari ke hari.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
];

export default function OurJourneyView() {
  const [selectedYearIndex, setSelectedYearIndex] = useState(3); // Default 2026
  const activeMilestone = MILESTONES[selectedYearIndex];

  return (
    <div style={{ backgroundColor: "#F7F9FB", color: "#1A1D2E", minHeight: "100vh" }}>
      {/* Hero Banner Section */}
      <section
        style={{
          position: "relative",
          backgroundColor: "#064E3B",
          backgroundImage:
            "linear-gradient(135deg, #064E3B 0%, #0D1B3E 65%, #082E24 100%)",
          color: "#ffffff",
          padding: "72px 32px 64px",
          overflow: "hidden",
        }}
      >
        {/* Background decorative glow circle */}
        <div
          style={{
            position: "absolute",
            top: "-150px",
            right: "-150px",
            width: "550px",
            height: "550px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(26,188,156,0.22) 0%, rgba(0,0,0,0) 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: "1320px", margin: "0 auto", position: "relative", zIndex: 2 }}>
          {/* Breadcrumb */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              color: "rgba(255,255,255,0.7)",
              marginBottom: "24px",
              fontWeight: 500,
            }}
          >
            <Link href="/" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>
              Beranda
            </Link>
            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
              chevron_right
            </span>
            <span style={{ color: "#1ABC9C", fontWeight: 700 }}>Our Journey</span>
          </div>

          <div style={{ maxWidth: "820px", textAlign: "left" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "rgba(26, 188, 156, 0.18)",
                border: "1px solid rgba(26, 188, 156, 0.4)",
                padding: "6px 16px",
                borderRadius: "100px",
                color: "#1ABC9C",
                fontSize: "12px",
                fontWeight: 800,
                letterSpacing: "0.04em",
                marginBottom: "20px",
                textTransform: "uppercase",
              }}
            >
              ✨ REVOLUSI TIKETING & FESTIVAL INDONESIA
            </div>

            <h1
              style={{
                fontFamily: "'Hanken Grotesk', sans-serif",
                fontSize: "46px",
                fontWeight: 800,
                lineHeight: "1.15",
                letterSpacing: "-0.02em",
                marginBottom: "20px",
              }}
            >
              Mengukir Cerita di Setiap Panggung & <span style={{ color: "#1ABC9C" }}>Musik Indonesia</span>
            </h1>

            <p
              style={{
                fontSize: "17px",
                color: "rgba(255,255,255,0.85)",
                lineHeight: "1.65",
                marginBottom: "40px",
              }}
            >
              Perjalanan Concer TIX menghubungkan jutaan penikmat konser dengan festival impian mereka. Dari sebuah gagasan untuk menyederhanakan pemesanan tiket, hingga menjadi platform hiburan terpercaya di seluruh penjuru tanah air.
            </p>
          </div>

          {/* Key Metrics Counter Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "20px",
            }}
          >
            {[
              { label: "Tiket Terjual", val: "500.000+", icon: "confirmation_number" },
              { label: "Event & Festival", val: "1.200+", icon: "festival" },
              { label: "Kota Jangkauan", val: "45+ Kota", icon: "location_city" },
              { label: "Kepuasan Penonton", val: "99.8%", icon: "thumb_up" },
            ].map((metric, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  backdropFilter: "blur(14px)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "20px",
                  padding: "22px 24px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "14px",
                    backgroundColor: "#1ABC9C",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    flexShrink: 0,
                    boxShadow: "0 6px 16px rgba(26, 188, 156, 0.35)",
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "26px" }}>
                    {metric.icon}
                  </span>
                </div>
                <div>
                  <span
                    style={{
                      fontFamily: "'Hanken Grotesk', sans-serif",
                      fontSize: "26px",
                      fontWeight: 800,
                      color: "#ffffff",
                      lineHeight: 1.1,
                      display: "block",
                    }}
                  >
                    {metric.val}
                  </span>
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>
                    {metric.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Interactive Timeline Section */}
      <section style={{ maxWidth: "1320px", margin: "0 auto", padding: "64px 32px" }}>
        <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 40px" }}>
          <span
            style={{
              fontSize: "12px",
              fontWeight: 800,
              color: "#1ABC9C",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              display: "block",
              marginBottom: "8px",
            }}
          >
            KRONOLOGI & SEJARAH
          </span>
          <h2 className="section-heading" style={{ fontSize: "32px", marginBottom: "12px" }}>
            Jejak Perjalanan Dari Tahun ke Tahun
          </h2>
          <p style={{ fontSize: "15px", color: "#5A6072" }}>
            Pilih tahun di bawah ini untuk melihat milestone penting dalam sejarah perkembangan Concer TIX.
          </p>
        </div>

        {/* Year Selector Tabs */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "14px",
            marginBottom: "40px",
            overflowX: "auto",
            paddingBottom: "8px",
          }}
          className="hide-scrollbar"
        >
          {MILESTONES.map((m, idx) => {
            const isSelected = selectedYearIndex === idx;

            return (
              <button
                key={m.year}
                onClick={() => setSelectedYearIndex(idx)}
                style={{
                  padding: "12px 32px",
                  borderRadius: "100px",
                  fontSize: "15px",
                  fontWeight: 800,
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  border: isSelected ? "none" : "1.5px solid #DEE2E6",
                  backgroundColor: isSelected ? "#064E3B" : "#ffffff",
                  color: isSelected ? "#ffffff" : "#495057",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  boxShadow: isSelected ? "0 8px 24px rgba(6, 78, 59, 0.25)" : "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span style={{ color: isSelected ? "#1ABC9C" : "#868E96" }}>•</span>
                Tahun {m.year}
              </button>
            );
          })}
        </div>

        {/* Active Milestone Display Card */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "28px",
            border: "1px solid #E4E8F0",
            boxShadow: "0 12px 40px rgba(13, 27, 62, 0.06)",
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: 0,
          }}
        >
          {/* Left Visual Image */}
          <div style={{ position: "relative", minHeight: "360px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeMilestone.img}
              alt={activeMilestone.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(6,78,59,0.7) 100%)",
              }}
            />
            <div style={{ position: "absolute", bottom: "24px", left: "24px", right: "24px", color: "#ffffff" }}>
              <span
                style={{
                  backgroundColor: "#1ABC9C",
                  color: "#ffffff",
                  padding: "4px 12px",
                  borderRadius: "100px",
                  fontSize: "12px",
                  fontWeight: 800,
                }}
              >
                Tahun {activeMilestone.year}
              </span>
              <h3
                style={{
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  fontSize: "24px",
                  fontWeight: 800,
                  marginTop: "8px",
                  lineHeight: "1.25",
                }}
              >
                {activeMilestone.tagline}
              </h3>
            </div>
          </div>

          {/* Right Text Content */}
          <div style={{ padding: "40px 36px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#1ABC9C", marginBottom: "6px" }}>
              {activeMilestone.year} Milestone
            </span>
            <h3
              style={{
                fontFamily: "'Hanken Grotesk', sans-serif",
                fontSize: "28px",
                fontWeight: 800,
                color: "#1A1D2E",
                marginBottom: "16px",
                lineHeight: "1.25",
              }}
            >
              {activeMilestone.title}
            </h3>

            <p style={{ fontSize: "15px", color: "#5A6072", lineHeight: "1.65", marginBottom: "28px" }}>
              {activeMilestone.description}
            </p>

            {/* Stats row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "12px",
                backgroundColor: "#F8F9FA",
                padding: "16px",
                borderRadius: "16px",
                marginBottom: "28px",
                textAlign: "center",
              }}
            >
              {activeMilestone.stats.map((s, idx) => (
                <div key={idx}>
                  <span
                    style={{
                      fontFamily: "'Hanken Grotesk', sans-serif",
                      fontSize: "20px",
                      fontWeight: 800,
                      color: "#064E3B",
                      display: "block",
                    }}
                  >
                    {s.value}
                  </span>
                  <span style={{ fontSize: "11px", color: "#868E96", fontWeight: 600 }}>{s.label}</span>
                </div>
              ))}
            </div>

            {/* Highlights bullet list */}
            <div>
              <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#1A1D2E", marginBottom: "12px" }}>
                Pencapaian Utama:
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {activeMilestone.highlights.map((hl, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "18px", color: "#1ABC9C", flexShrink: 0 }}
                    >
                      check_circle
                    </span>
                    <span style={{ fontSize: "13.5px", color: "#495057", fontWeight: 500 }}>{hl}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section style={{ backgroundColor: "#ffffff", borderTop: "1px solid #E9ECEF", borderBottom: "1px solid #E9ECEF", padding: "64px 32px" }}>
        <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 48px" }}>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 800,
                color: "#1ABC9C",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "8px",
              }}
            >
              NILAI UTAMA
            </span>
            <h2 className="section-heading" style={{ fontSize: "32px", marginBottom: "12px" }}>
              Mengapa Concer TIX Dipercaya?
            </h2>
            <p style={{ fontSize: "15px", color: "#5A6072" }}>
              Komitmen penuh kami dalam memberikan standar terbaik bagi penyelenggara acara dan penonton konser.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "24px",
            }}
          >
            {CORE_VALS.map((val, idx) => (
              <div
                key={idx}
                className="card-hover"
                style={{
                  backgroundColor: "#F8F9FA",
                  borderRadius: "20px",
                  padding: "32px 24px",
                  border: "1px solid #E9ECEF",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "16px",
                    backgroundColor: "#064E3B",
                    color: "#1ABC9C",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "20px",
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>
                    {val.icon}
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: "'Hanken Grotesk', sans-serif",
                    fontSize: "18px",
                    fontWeight: 800,
                    color: "#1A1D2E",
                    marginBottom: "10px",
                  }}
                >
                  {val.title}
                </h3>
                <p style={{ fontSize: "14px", color: "#5A6072", lineHeight: "1.6", margin: 0 }}>
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={{ maxWidth: "1320px", margin: "0 auto", padding: "64px 32px" }}>
        <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 48px" }}>
          <span
            style={{
              fontSize: "12px",
              fontWeight: 800,
              color: "#1ABC9C",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              display: "block",
              marginBottom: "8px",
            }}
          >
            TESTIMONI
          </span>
          <h2 className="section-heading" style={{ fontSize: "32px", marginBottom: "12px" }}>
            Apa Kata Penonton & Promotor?
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
          }}
        >
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "20px",
                padding: "28px",
                border: "1px solid #E4E8F0",
                boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                {/* Rating Stars */}
                <div style={{ display: "flex", gap: "4px", color: "#FFD43B", marginBottom: "16px" }}>
                  {[...Array(t.rating)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                      star
                    </span>
                  ))}
                </div>
                <p style={{ fontSize: "14px", color: "#495057", lineHeight: "1.6", fontStyle: "italic", marginBottom: "24px" }}>
                  "{t.comment}"
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.avatar}
                  alt={t.name}
                  style={{ width: "44px", height: "44px", borderRadius: "50%", objectFit: "cover" }}
                />
                <div>
                  <h4 style={{ fontSize: "14px", fontWeight: 800, color: "#1A1D2E", margin: 0 }}>
                    {t.name}
                  </h4>
                  <span style={{ fontSize: "12px", color: "#868E96", fontWeight: 500 }}>{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 32px 80px" }}>
        <div
          style={{
            backgroundColor: "#064E3B",
            backgroundImage: "linear-gradient(135deg, #064E3B 0%, #0D1B3E 100%)",
            borderRadius: "28px",
            padding: "56px 40px",
            textAlign: "center",
            color: "#ffffff",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 20px 48px rgba(6, 78, 59, 0.25)",
          }}
        >
          <h2
            style={{
              fontFamily: "'Hanken Grotesk', sans-serif",
              fontSize: "36px",
              fontWeight: 800,
              marginBottom: "16px",
            }}
          >
            Siap Menikmati Keseruan Konser Selanjutnya?
          </h2>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.85)", maxWidth: "600px", margin: "0 auto 32px", lineHeight: "1.6" }}>
            Temukan ribuan event di berbagai kota pilihanmu atau bawa acara promosimu lebih jauh bersama Concer TIX!
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
            <Link href="/explore" style={{ textDecoration: "none" }}>
              <button
                style={{
                  backgroundColor: "#1ABC9C",
                  color: "#ffffff",
                  border: "none",
                  padding: "14px 32px",
                  borderRadius: "100px",
                  fontSize: "14px",
                  fontWeight: 800,
                  cursor: "pointer",
                  boxShadow: "0 6px 20px rgba(26,188,156,0.35)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#16A085")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1ABC9C")}
              >
                Explore All Events
              </button>
            </Link>
            <Link href="/register" style={{ textDecoration: "none" }}>
              <button
                style={{
                  backgroundColor: "transparent",
                  color: "#ffffff",
                  border: "1.5px solid rgba(255,255,255,0.3)",
                  padding: "14px 32px",
                  borderRadius: "100px",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#ffffff")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)")}
              >
                Daftar Akun Baru
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
