"use client";

import { useState } from "react";
import Link from "next/link";

export default function PricingView() {
  const [eventType, setEventType] = useState<"paid" | "free">("paid");
  
  // Interactive Calculator State
  const [ticketPrice, setTicketPrice] = useState<number>(150000);
  const [ticketVolume, setTicketVolume] = useState<number>(1000);

  // Fee calculation: 2.5% + Rp 2.000 per ticket
  const grossRevenue = ticketPrice * ticketVolume;
  const platformFeePerTicket = eventType === "free" ? 0 : ticketPrice * 0.025 + 2000;
  const totalPlatformFee = platformFeePerTicket * ticketVolume;
  const netRevenue = Math.max(0, grossRevenue - totalPlatformFee);

  // FAQ State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Kapan dana hasil penjualan tiket saya cair?",
      a: "Pencairan dana (settlement) dilakukan secara cepat H+1 setelah klaim diajukan melalui dashboard promotor, atau H+0 untuk promotor berstatus Verified Partner.",
    },
    {
      q: "Siapa yang menanggung biaya komisi platform?",
      a: "Secara fleksibel, Anda sebagai promotor dapat memilih apakah biaya platform (2.5% + Rp 2.000) dipotong dari harga tiket Anda atau dibebankan kepada pembeli tiket sebagai Biaya Layanan saat checkout.",
    },
    {
      q: "Apakah ada biaya tersembunyi atau biaya pendaftaran?",
      a: "Sama sekali tidak ada! Pembuatan akun dan pendaftaran event di Concer TIX 100% gratis. Anda hanya membayar komisi saat ada tiket berbayar yang berhasil terjual.",
    },
    {
      q: "Bagaimana jika event saya gratis (tanpa HTM)?",
      a: "Untuk event gratis (seminar komunitas, konser amal, workshop non-profit), Concer TIX memberikan komisi 0% (Gratis Sepenuhnya) tanpa batas kuota e-ticket!",
    },
    {
      q: "Apakah termasuk pemindai QR dan gate entry di lokasi?",
      a: "Ya! Semua paket berbayar sudah termasuk akses ke aplikasi Concer TIX Scanner untuk memindai tiket gelang / e-ticket di pintu masuk venue menggunakan HP Android/iOS.",
    },
  ];

  return (
    <div style={{ backgroundColor: "#F7F9FB", color: "#1A1D2E", minHeight: "100vh" }}>
      {/* Hero Section */}
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
        {/* Decorative background glow */}
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
            <span style={{ color: "#1ABC9C", fontWeight: 700 }}>Biaya & Paket</span>
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
              💎 SKEMA BIAYA TRANSPARAN & ADIL
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
              Biaya Hemat, Solusi Ticketing <span style={{ color: "#1ABC9C" }}>Konser Kelas Dunia</span>
            </h1>

            <p
              style={{
                fontSize: "17px",
                color: "rgba(255,255,255,0.85)",
                lineHeight: "1.65",
                marginBottom: "36px",
              }}
            >
              Tanpa biaya pendaftaran, tanpa biaya bulanan tersembunyi. Anda hanya bayar komisi kecil saat ada tiket yang berhasil terjual. Event gratis? 100% Bebas Biaya!
            </p>

            {/* Event Type Toggle Pill */}
            <div
              style={{
                display: "inline-flex",
                backgroundColor: "rgba(255, 255, 255, 0.12)",
                backdropFilter: "blur(12px)",
                padding: "6px",
                borderRadius: "100px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <button
                type="button"
                onClick={() => setEventType("paid")}
                style={{
                  padding: "10px 24px",
                  borderRadius: "100px",
                  fontSize: "14px",
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: eventType === "paid" ? "#1ABC9C" : "transparent",
                  color: "#ffffff",
                  transition: "all 0.2s ease",
                  boxShadow: eventType === "paid" ? "0 4px 14px rgba(26, 188, 156, 0.4)" : "none",
                }}
              >
                🎟️ Event Berbayar (HTM)
              </button>
              <button
                type="button"
                onClick={() => setEventType("free")}
                style={{
                  padding: "10px 24px",
                  borderRadius: "100px",
                  fontSize: "14px",
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: eventType === "free" ? "#1ABC9C" : "transparent",
                  color: "#ffffff",
                  transition: "all 0.2s ease",
                  boxShadow: eventType === "free" ? "0 4px 14px rgba(26, 188, 156, 0.4)" : "none",
                }}
              >
                🎁 Event Gratis (Rp 0)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards Section */}
      <section style={{ maxWidth: "1320px", margin: "0 auto", padding: "64px 32px 48px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "28px",
            alignItems: "stretch",
          }}
        >
          {/* Package 1: Komunitas & Starter */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "28px",
              padding: "40px 32px",
              border: "1px solid #E4E8F0",
              boxShadow: "0 8px 30px rgba(0,0,0,0.03)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 800,
                  color: "#868E96",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                KOMUNITAS & INDIE
              </span>
              <h3 style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: "24px", fontWeight: 800, margin: "8px 0 16px" }}>
                Starter (Gratis)
              </h3>
              <p style={{ fontSize: "14px", color: "#5A6072", lineHeight: "1.6", marginBottom: "24px" }}>
                Ideal untuk event komunitas, workshop, pertunjukan amal, dan acara sekolah tanpa tiket berbayar.
              </p>

              <div style={{ marginBottom: "28px" }}>
                <span style={{ fontSize: "40px", fontWeight: 800, color: "#064E3B", fontFamily: "'Hanken Grotesk', sans-serif" }}>
                  Rp 0
                </span>
                <span style={{ fontSize: "14px", color: "#868E96", fontWeight: 600 }}> / tiket terjual</span>
              </div>

              <div style={{ borderTop: "1px solid #F1F3F5", paddingTop: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  "Komisi Platform 0%",
                  "E-Ticket QR via WhatsApp & Email",
                  "Formulir Data Pembeli Kustom",
                  "Aplikasi Pemindai QR Scanner",
                  "Laporan Penjualan Real-Time",
                ].map((feat, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#1ABC9C" }}>
                      check_circle
                    </span>
                    <span style={{ fontSize: "13.5px", color: "#495057", fontWeight: 500 }}>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link href="/register" style={{ textDecoration: "none", marginTop: "36px" }}>
              <button
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "100px",
                  fontSize: "14px",
                  fontWeight: 700,
                  border: "1.5px solid #064E3B",
                  backgroundColor: "transparent",
                  color: "#064E3B",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Buat Event Gratis
              </button>
            </Link>
          </div>

          {/* Package 2: Pro Promoter (RECOMMENDED) */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "28px",
              padding: "40px 32px",
              border: "2px solid #1ABC9C",
              boxShadow: "0 16px 48px rgba(26, 188, 156, 0.15)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Featured Badge */}
            <div
              style={{
                position: "absolute",
                top: "20px",
                right: "-32px",
                backgroundColor: "#1ABC9C",
                color: "#ffffff",
                fontSize: "11px",
                fontWeight: 800,
                padding: "6px 40px",
                transform: "rotate(45deg)",
                letterSpacing: "0.05em",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
            >
              POPULER
            </div>

            <div>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 800,
                  color: "#1ABC9C",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                KONSER & FESTIVAL
              </span>
              <h3 style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: "24px", fontWeight: 800, margin: "8px 0 16px", color: "#064E3B" }}>
                Pro Promoter
              </h3>
              <p style={{ fontSize: "14px", color: "#5A6072", lineHeight: "1.6", marginBottom: "24px" }}>
                Pilihan tepat untuk konser musik, wahana, dan festival dengan sistem penjualan tiket otomatis & instan.
              </p>

              <div style={{ marginBottom: "28px" }}>
                <span style={{ fontSize: "38px", fontWeight: 800, color: "#064E3B", fontFamily: "'Hanken Grotesk', sans-serif" }}>
                  2.5%
                </span>
                <span style={{ fontSize: "18px", fontWeight: 700, color: "#1ABC9C" }}> + Rp 2.000</span>
                <span style={{ fontSize: "13px", color: "#868E96", fontWeight: 600, display: "block" }}>
                  per tiket terjual (Bisa dibebankan ke pembeli)
                </span>
              </div>

              <div style={{ borderTop: "1px solid #F1F3F5", paddingTop: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  "Semua Fitur Paket Starter",
                  "Pengiriman E-Ticket Instant via WA & Email",
                  "Pencairan Dana (Settlement) Cepat H+1",
                  "Dukungan Tiket Gelang (Wristband Barcode)",
                  "Sistem Voucher & Kode Promo Diskon",
                  "Dashboard Keuangan & Grafik Penjualan",
                ].map((feat, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#1ABC9C" }}>
                      check_circle
                    </span>
                    <span style={{ fontSize: "13.5px", color: "#1A1D2E", fontWeight: 600 }}>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link href="/register" style={{ textDecoration: "none", marginTop: "36px" }}>
              <button
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "100px",
                  fontSize: "14px",
                  fontWeight: 800,
                  border: "none",
                  backgroundColor: "#064E3B",
                  color: "#ffffff",
                  cursor: "pointer",
                  boxShadow: "0 6px 20px rgba(6, 78, 59, 0.3)",
                  transition: "all 0.2s ease",
                }}
              >
                Mulai Event Pro
              </button>
            </Link>
          </div>

          {/* Package 3: Enterprise & Mega Festival */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "28px",
              padding: "40px 32px",
              border: "1px solid #E4E8F0",
              boxShadow: "0 8px 30px rgba(0,0,0,0.03)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 800,
                  color: "#0D1B3E",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                TUR KONSER & STADION
              </span>
              <h3 style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: "24px", fontWeight: 800, margin: "8px 0 16px" }}>
                Enterprise Mega
              </h3>
              <p style={{ fontSize: "14px", color: "#5A6072", lineHeight: "1.6", marginBottom: "24px" }}>
                Solusi terlengkap untuk tur konser internasional, festival puluhan ribu penonton, dan dukungan tim fisik di lapangan.
              </p>

              <div style={{ marginBottom: "28px" }}>
                <span style={{ fontSize: "36px", fontWeight: 800, color: "#0D1B3E", fontFamily: "'Hanken Grotesk', sans-serif" }}>
                  Custom Rate
                </span>
                <span style={{ fontSize: "13px", color: "#868E96", fontWeight: 600, display: "block" }}>
                  Diskon volume khusus event &gt; 10.000 tiket
                </span>
              </div>

              <div style={{ borderTop: "1px solid #F1F3F5", paddingTop: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  "Semua Fitur Paket Pro",
                  "Dedicated Tim Teknis & On-Site Gate Officer",
                  "Sistem Tiket Gelang RFID / Turnstile Integration",
                  "Pencairan Dana Instan H+0",
                  "Custom Branding E-Ticket & Portal Pembelian",
                  "Dedicated Account Manager 24/7",
                ].map((feat, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#1ABC9C" }}>
                      check_circle
                    </span>
                    <span style={{ fontSize: "13.5px", color: "#495057", fontWeight: 500 }}>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link href="/register" style={{ textDecoration: "none", marginTop: "36px" }}>
              <button
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "100px",
                  fontSize: "14px",
                  fontWeight: 700,
                  border: "1.5px solid #0D1B3E",
                  backgroundColor: "transparent",
                  color: "#0D1B3E",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Hubungi Tim Sales
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Revenue & Fee Calculator Section */}
      <section style={{ maxWidth: "1320px", margin: "0 auto", padding: "32px 32px 64px" }}>
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "28px",
            border: "1px solid #E4E8F0",
            boxShadow: "0 12px 40px rgba(13, 27, 62, 0.06)",
            padding: "48px 40px",
          }}
        >
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
              KALKULATOR INTERAKTIF
            </span>
            <h2 className="section-heading" style={{ fontSize: "32px", marginBottom: "12px" }}>
              Hitung Estimasi Pendapatan Bersih Anda
            </h2>
            <p style={{ fontSize: "15px", color: "#5A6072" }}>
              Gunakan simulasi interaktif di bawah ini untuk melihat perkiraan omzet kotor dan pendapatan bersih yang Anda terima.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "40px",
              alignItems: "center",
            }}
          >
            {/* Input Controls */}
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              {/* Input 1: Harga Tiket */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <label style={{ fontSize: "14px", fontWeight: 700, color: "#1A1D2E" }}>
                    Harga Tiket Per Orang (HTM):
                  </label>
                  <span style={{ fontSize: "16px", fontWeight: 800, color: "#064E3B" }}>
                    Rp {ticketPrice.toLocaleString("id-ID")}
                  </span>
                </div>
                <input
                  type="range"
                  min={10000}
                  max={2000000}
                  step={10000}
                  value={ticketPrice}
                  onChange={(e) => setTicketPrice(Number(e.target.value))}
                  style={{
                    width: "100%",
                    accentColor: "#1ABC9C",
                    height: "8px",
                    cursor: "pointer",
                  }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#868E96", marginTop: "6px" }}>
                  <span>Rp 10.000</span>
                  <span>Rp 2.000.000</span>
                </div>
              </div>

              {/* Input 2: Kuota Tiket Terjual */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <label style={{ fontSize: "14px", fontWeight: 700, color: "#1A1D2E" }}>
                    Estimasi Jumlah Tiket Terjual:
                  </label>
                  <span style={{ fontSize: "16px", fontWeight: 800, color: "#064E3B" }}>
                    {ticketVolume.toLocaleString("id-ID")} Tiket
                  </span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={20000}
                  step={50}
                  value={ticketVolume}
                  onChange={(e) => setTicketVolume(Number(e.target.value))}
                  style={{
                    width: "100%",
                    accentColor: "#1ABC9C",
                    height: "8px",
                    cursor: "pointer",
                  }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#868E96", marginTop: "6px" }}>
                  <span>50 Tiket</span>
                  <span>20.000 Tiket</span>
                </div>
              </div>
            </div>

            {/* Results Display Card */}
            <div
              style={{
                backgroundColor: "#064E3B",
                backgroundImage: "linear-gradient(135deg, #064E3B 0%, #0D1B3E 100%)",
                borderRadius: "24px",
                padding: "36px 32px",
                color: "#ffffff",
                boxShadow: "0 12px 32px rgba(6, 78, 59, 0.25)",
              }}
            >
              <span style={{ fontSize: "12px", fontWeight: 800, color: "#1ABC9C", letterSpacing: "0.05em" }}>
                ESTIMASI HASIL BERSIH PROMOTOR
              </span>
              <h3
                style={{
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  fontSize: "36px",
                  fontWeight: 800,
                  color: "#ffffff",
                  margin: "8px 0 24px",
                  lineHeight: 1.1,
                }}
              >
                Rp {netRevenue.toLocaleString("id-ID")}
              </h3>

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>
                  <span>Total Omzet Kotor:</span>
                  <strong style={{ color: "#ffffff" }}>Rp {grossRevenue.toLocaleString("id-ID")}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>
                  <span>Estimasi Biaya Concer TIX:</span>
                  <strong style={{ color: "#1ABC9C" }}>- Rp {totalPlatformFee.toLocaleString("id-ID")}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>
                  <span>Biaya Per Tiket:</span>
                  <strong style={{ color: "#ffffff" }}>Rp {platformFeePerTicket.toLocaleString("id-ID")} / tiket</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 32px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
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
            PERTANYAAN UMUM
          </span>
          <h2 className="section-heading" style={{ fontSize: "32px", marginBottom: "12px" }}>
            Pertanyaan Yang Sering Diajukan
          </h2>
          <p style={{ fontSize: "15px", color: "#5A6072" }}>
            Temukan jawaban lengkap seputar sistem komisi dan pencairan dana di Concer TIX.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;

            return (
              <div
                key={idx}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "16px",
                  border: "1px solid #E4E8F0",
                  overflow: "hidden",
                  transition: "all 0.2s ease",
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  style={{
                    width: "100%",
                    padding: "20px 24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "#1A1D2E",
                  }}
                >
                  <span>{faq.q}</span>
                  <span
                    className="material-symbols-outlined"
                    style={{
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                      color: "#1ABC9C",
                    }}
                  >
                    expand_more
                  </span>
                </button>

                {isOpen && (
                  <div
                    style={{
                      padding: "0 24px 20px",
                      fontSize: "14px",
                      color: "#5A6072",
                      lineHeight: "1.65",
                      borderTop: "1px solid #F8F9FA",
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
