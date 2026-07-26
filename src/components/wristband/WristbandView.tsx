"use client";

import { useState } from "react";
import Link from "next/link";

interface MaterialOption {
  id: string;
  name: string;
  subtitle: string;
  desc: string;
  img: string;
  features: string[];
  bestFor: string;
  colorHex: string;
}

const MATERIALS: MaterialOption[] = [
  {
    id: "synthetic",
    name: "Synthetic Paper (Tyvek)",
    subtitle: "Tahan Air & Anti-Sobek 1 Day Event",
    desc: "Bahan kertas sintetis berkualitas tinggi yang tahan air dan tidak bisa disobek secara manual. Dilengkapi pengunci perekat sekali pakai yang rusak jika dipaksa lepas.",
    img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
    features: [
      "100% Tahan air & keringat",
      "Perekat tamper-evident sekali pakai",
      "Cetak barcode / QR code tajam",
      "Penomoran serial unik acak",
    ],
    bestFor: "Konser 1 Hari, Seminar, Workshop, & Exhibition",
    colorHex: "#1ABC9C",
  },
  {
    id: "woven",
    name: "Woven Fabric (Kain Tenun)",
    subtitle: "Premium Feel Untuk Festival Musik",
    desc: "Gelang bahan kain tenun bertekstur halus, sangat nyaman dipakai di pergelangan tangan selama berhari-hari. Menggunakan ring pengunci slide yang mengunci permanen.",
    img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
    features: [
      "Bahan kain tenun / polyester premium",
      "Ring pengunci slide anti-reuse",
      "Dapat ditambahi Chip RFID / NFC",
      "Tampilan estetik & merchandise-grade",
    ],
    bestFor: "Festival Musik 2-3 Hari, Summer Camp, & Rave Party",
    colorHex: "#064E3B",
  },
  {
    id: "vinyl",
    name: "Vinyl / PVC Premium Snap",
    subtitle: "Sangat Awet Untuk Multi-Day & VIP",
    desc: "Bahan plastik vinyl multi-lapis yang sangat tahan lama. Dilengkapi kancing snap lock plastik permanen yang hanya bisa dilepas dengan dipotong.",
    img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
    features: [
      "Material plastik vinyl tebal & lentur",
      "Kancing snap lock permanen",
      "Tahan cuaca ekstrem & air laut",
      "Warna kilap & mewah untuk VIP pass",
    ],
    bestFor: "Akses VIP Backstage, Waterpark, & Event Multi-Hari",
    colorHex: "#0D1B3E",
  },
];

const PALETTE_COLORS = [
  { name: "Emerald Green", hex: "#064E3B" },
  { name: "Electric Teal", hex: "#1ABC9C" },
  { name: "Midnight Navy", hex: "#0D1B3E" },
  { name: "Festival Gold", hex: "#FFD43B" },
  { name: "Neon Pink", hex: "#FF2E93" },
];

export default function WristbandView() {
  const [selectedMaterial, setSelectedMaterial] = useState<string>("synthetic");
  const [selectedColor, setSelectedColor] = useState<string>("#064E3B");
  const [customText, setCustomText] = useState<string>("CONCER TIX FESTIVAL 2026");
  const [showToast, setShowToast] = useState<boolean>(false);

  const currentMaterial = MATERIALS.find((m) => m.id === selectedMaterial) || MATERIALS[0];

  const handleRequestSample = (e: React.FormEvent) => {
    e.preventDefault();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  return (
    <div style={{ backgroundColor: "#F7F9FB", color: "#1A1D2E", minHeight: "100vh" }}>
      {/* Toast Notification */}
      {showToast && (
        <div
          style={{
            position: "fixed",
            bottom: "32px",
            right: "32px",
            backgroundColor: "#064E3B",
            color: "#ffffff",
            padding: "16px 24px",
            borderRadius: "16px",
            boxShadow: "0 12px 32px rgba(6,78,59,0.35)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          <span className="material-symbols-outlined" style={{ color: "#1ABC9C", fontSize: "24px" }}>
            check_circle
          </span>
          Permintaan sample & konsultasi tiket gelang berhasil dikirim! Tim kami akan menghubungi Anda.
        </div>
      )}

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
        {/* Background decorative glow */}
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
            <span style={{ color: "#1ABC9C", fontWeight: 700 }}>Tiket Gelang</span>
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
              ✨ SOLUSI INTEGRASI GATE ENTRY #1
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
              Tiket Gelang Event & Festival <span style={{ color: "#1ABC9C" }}>Bebas Pemalsuan</span>
            </h1>

            <p
              style={{
                fontSize: "17px",
                color: "rgba(255,255,255,0.85)",
                lineHeight: "1.65",
                marginBottom: "36px",
              }}
            >
              Cetak tiket gelang kustom berkualitas tinggi dengan barcode, QR code, atau RFID chip yang terintegrasi 100% langsung dengan aplikasi gate scanner Concer TIX. Aman, anti-sobek, dan tahan air!
            </p>

            {/* Quick Badges Ribbon */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
              {[
                { icon: "water_drop", text: "100% Waterproof" },
                { icon: "lock", text: "Single-Use Tamper Lock" },
                { icon: "qr_code_scanner", text: "Barcode & RFID Sync" },
                { icon: "palette", text: "Cetak Full Color" },
              ].map((badge, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    backgroundColor: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    padding: "8px 16px",
                    borderRadius: "100px",
                    fontSize: "13px",
                    fontWeight: 600,
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#1ABC9C" }}>
                    {badge.icon}
                  </span>
                  <span>{badge.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Wristband Previewer Simulator */}
      <section style={{ maxWidth: "1320px", margin: "0 auto", padding: "64px 32px 48px" }}>
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
            SIMULATOR INTERAKTIF
          </span>
          <h2 className="section-heading" style={{ fontSize: "32px", marginBottom: "12px" }}>
            Desain & Preview Tiket Gelang Anda
          </h2>
          <p style={{ fontSize: "15px", color: "#5A6072" }}>
            Pilih jenis bahan, warna pilihan, dan kustomisasi teks untuk melihat gambaran fisik tiket gelang acara Anda.
          </p>
        </div>

        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "28px",
            border: "1px solid #E4E8F0",
            boxShadow: "0 12px 40px rgba(13, 27, 62, 0.06)",
            padding: "40px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "40px",
            alignItems: "center",
          }}
        >
          {/* Controls Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Material Selector */}
            <div>
              <label style={{ fontSize: "14px", fontWeight: 700, color: "#1A1D2E", display: "block", marginBottom: "10px" }}>
                1. Pilih Bahan Tiket Gelang:
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {MATERIALS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMaterial(m.id)}
                    style={{
                      padding: "14px 18px",
                      borderRadius: "14px",
                      border: selectedMaterial === m.id ? "2px solid #1ABC9C" : "1.5px solid #DEE2E6",
                      backgroundColor: selectedMaterial === m.id ? "rgba(26, 188, 156, 0.06)" : "#ffffff",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: "14px", fontWeight: 700, margin: 0, color: "#1A1D2E" }}>{m.name}</h4>
                      <span style={{ fontSize: "12px", color: "#868E96" }}>{m.subtitle}</span>
                    </div>
                    {selectedMaterial === m.id && (
                      <span className="material-symbols-outlined" style={{ color: "#1ABC9C" }}>
                        check_circle
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Palette Selector */}
            <div>
              <label style={{ fontSize: "14px", fontWeight: 700, color: "#1A1D2E", display: "block", marginBottom: "10px" }}>
                2. Pilih Warna Dasar Gelang:
              </label>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {PALETTE_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setSelectedColor(c.hex)}
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "50%",
                      backgroundColor: c.hex,
                      border: selectedColor === c.hex ? "3px solid #1A1D2E" : "2px solid #ffffff",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                      cursor: "pointer",
                      transition: "transform 0.2s ease",
                      transform: selectedColor === c.hex ? "scale(1.15)" : "scale(1)",
                    }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Custom Text Input */}
            <div>
              <label style={{ fontSize: "14px", fontWeight: 700, color: "#1A1D2E", display: "block", marginBottom: "8px" }}>
                3. Tulis Nama Event / Konser Anda:
              </label>
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Contoh: JAKARTA MUSIC FEST 2026"
                style={{
                  width: "100%",
                  height: "46px",
                  padding: "0 16px",
                  borderRadius: "12px",
                  border: "1.5px solid #DEE2E6",
                  fontSize: "14px",
                  outline: "none",
                  fontWeight: 600,
                }}
              />
            </div>
          </div>

          {/* Real-Time Wristband Visual Canvas Display */}
          <div
            style={{
              backgroundColor: "#F8F9FA",
              borderRadius: "24px",
              padding: "40px 24px",
              border: "1.5px dashed #CED4DA",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              minHeight: "360px",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontWeight: 800,
                color: "#868E96",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                marginBottom: "24px",
              }}
            >
              PREVIEW FISIK GELANG (LIVE SIMULATION)
            </span>

            {/* Wristband Mockup Graphic */}
            <div
              style={{
                width: "100%",
                maxWidth: "480px",
                height: "80px",
                backgroundColor: selectedColor,
                borderRadius: "12px",
                boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 20px",
                color: "#ffffff",
                position: "relative",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.2)",
                transition: "all 0.3s ease",
              }}
            >
              {/* Material Texture Overlay Lines */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage:
                    selectedMaterial === "woven"
                      ? "repeating-linear-gradient(45deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 2px, transparent 2px, transparent 6px)"
                      : "radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px)",
                  backgroundSize: selectedMaterial === "woven" ? "12px 12px" : "16px 16px",
                  pointerEvents: "none",
                }}
              />

              {/* Left Brand & Event Name */}
              <div style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    backgroundColor: "rgba(255,255,255,0.25)",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    fontSize: "11px",
                    fontWeight: 900,
                    letterSpacing: "0.05em",
                  }}
                >
                  CONCER TIX
                </div>
                <div
                  style={{
                    fontFamily: "'Hanken Grotesk', sans-serif",
                    fontSize: "15px",
                    fontWeight: 800,
                    letterSpacing: "0.02em",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "200px",
                  }}
                >
                  {customText || "NAMA EVENT ANDA"}
                </div>
              </div>

              {/* Right Barcode & Lock Mockup */}
              <div style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", gap: "14px" }}>
                {/* Barcode Mock Graphic */}
                <div
                  style={{
                    backgroundColor: "#ffffff",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", gap: "2px", height: "24px" }}>
                    {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2].map((w, i) => (
                      <div key={i} style={{ width: `${w}px`, backgroundColor: "#000000", height: "100%" }} />
                    ))}
                  </div>
                  <span style={{ fontSize: "7px", color: "#000000", fontWeight: 700, marginTop: "2px" }}>#CTX-9821</span>
                </div>

                {/* Safety Lock Mechanism Graphic */}
                <div
                  style={{
                    width: "28px",
                    height: "36px",
                    borderRadius: "6px",
                    backgroundColor: selectedMaterial === "vinyl" ? "#0D1B3E" : "#ffffff",
                    border: "1.5px solid rgba(0,0,0,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                  }}
                  title="Safety Tamper Lock"
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "16px", color: selectedMaterial === "vinyl" ? "#1ABC9C" : "#064E3B" }}
                  >
                    lock
                  </span>
                </div>
              </div>
            </div>

            {/* Material Detail Badge */}
            <div style={{ marginTop: "24px", textAlign: "center" }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#064E3B" }}>
                {currentMaterial.name}
              </span>
              <p style={{ fontSize: "12px", color: "#868E96", marginTop: "4px", margin: 0 }}>
                {currentMaterial.bestFor}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Materials Showcase Cards */}
      <section style={{ maxWidth: "1320px", margin: "0 auto", padding: "32px 32px 64px" }}>
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
            KATALOG SPESIFIKASI
          </span>
          <h2 className="section-heading" style={{ fontSize: "32px", marginBottom: "12px" }}>
            Pilihan Bahan Sesuai Kebutuhan Event
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "28px",
          }}
        >
          {MATERIALS.map((m) => (
            <div
              key={m.id}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "24px",
                border: "1px solid #E4E8F0",
                boxShadow: "0 8px 30px rgba(0,0,0,0.03)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ position: "relative", height: "200px" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.img} alt={m.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.7) 100%)" }} />
                  <span
                    style={{
                      position: "absolute",
                      bottom: "16px",
                      left: "20px",
                      backgroundColor: "#1ABC9C",
                      color: "#ffffff",
                      fontSize: "12px",
                      fontWeight: 800,
                      padding: "4px 12px",
                      borderRadius: "100px",
                    }}
                  >
                    {m.name}
                  </span>
                </div>

                <div style={{ padding: "28px 24px 20px" }}>
                  <h3 style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: "20px", fontWeight: 800, color: "#1A1D2E", marginBottom: "8px" }}>
                    {m.subtitle}
                  </h3>
                  <p style={{ fontSize: "14px", color: "#5A6072", lineHeight: "1.6", marginBottom: "20px" }}>
                    {m.desc}
                  </p>

                  <div style={{ borderTop: "1px solid #F1F3F5", paddingTop: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                    {m.features.map((feat, idx) => (
                      <div key={idx} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#1ABC9C" }}>
                          check_circle
                        </span>
                        <span style={{ fontSize: "13px", color: "#495057", fontWeight: 500 }}>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ padding: "0 24px 24px" }}>
                <div style={{ backgroundColor: "#F8F9FA", padding: "12px 16px", borderRadius: "12px", fontSize: "12px", color: "#064E3B", fontWeight: 700 }}>
                  📍 Rekomendasi: {m.bestFor}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Free Sample & Quote Request Form Section */}
      <section style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 32px 80px" }}>
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "28px",
            border: "1px solid #E4E8F0",
            boxShadow: "0 12px 40px rgba(13, 27, 62, 0.06)",
            padding: "48px 40px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "40px",
          }}
        >
          <div>
            <span style={{ fontSize: "12px", fontWeight: 800, color: "#1ABC9C", letterSpacing: "0.05em" }}>
              MINTA SAMPLE GRATIS
            </span>
            <h2
              style={{
                fontFamily: "'Hanken Grotesk', sans-serif",
                fontSize: "34px",
                fontWeight: 800,
                color: "#1A1D2E",
                margin: "8px 0 16px",
                lineHeight: 1.2,
              }}
            >
              Ingin Melihat & Memegang Fisik Sample Tiket Gelang?
            </h2>
            <p style={{ fontSize: "15px", color: "#5A6072", lineHeight: "1.65", marginBottom: "28px" }}>
              Kami dapat mengirimkan paket fisik sampel gelang (Synthetic, Woven Fabric, dan Vinyl) secara GRATIS ke alamat kantor / rumah Anda untuk diuji sebelum cetak massal.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                { title: "Pengiriman Sample H+1", desc: "Sample gelang fisik dikirim langsung via kurir ekspres." },
                { title: "Konsultasi Desain & Layout Barcode", desc: "Tim grafis kami siap membuatkan mock-up gratis." },
                { title: "Jaminan Garansi Integrasi Gate Scanner", desc: "Barcode dijamin 100% terbaca di scanner lokasi." },
              ].map((item, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      backgroundColor: "rgba(26,188,156,0.15)",
                      color: "#1ABC9C",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                      verified
                    </span>
                  </div>
                  <div>
                    <h4 style={{ fontSize: "14px", fontWeight: 700, margin: 0, color: "#1A1D2E" }}>{item.title}</h4>
                    <p style={{ fontSize: "13px", color: "#868E96", margin: "2px 0 0" }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleRequestSample} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#1A1D2E", marginBottom: "6px" }}>
                Nama Lengkap / Promotor:
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Faishal (Maju Bersama Event)"
                style={{
                  width: "100%",
                  height: "46px",
                  padding: "0 16px",
                  borderRadius: "12px",
                  border: "1.5px solid #DEE2E6",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#1A1D2E", marginBottom: "6px" }}>
                No. WhatsApp Aktif:
              </label>
              <input
                type="tel"
                required
                placeholder="081234567890"
                style={{
                  width: "100%",
                  height: "46px",
                  padding: "0 16px",
                  borderRadius: "12px",
                  border: "1.5px solid #DEE2E6",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#1A1D2E", marginBottom: "6px" }}>
                Estimasi Kuota Gelang & Kota Pengiriman:
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: 3.000 Pcs - Bandung"
                style={{
                  width: "100%",
                  height: "46px",
                  padding: "0 16px",
                  borderRadius: "12px",
                  border: "1.5px solid #DEE2E6",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
            </div>

            <button
              type="submit"
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
                boxShadow: "0 6px 20px rgba(6, 78, 59, 0.25)",
                transition: "all 0.2s ease",
                marginTop: "10px",
              }}
            >
              Minta Paket Sample Gratis
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
