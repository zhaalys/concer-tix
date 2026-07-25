"use client";
import { useState } from "react";

export default function PromoBanner() {
  const [emailFocused, setEmailFocused] = useState(false);

  return (
    <section style={{ backgroundColor: "#F1F4FF", padding: "64px 0", borderTop: "1px solid #E4E8F0" }}>
      <div style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 32px" }}>
        <div
          style={{
            position: "relative",
            borderRadius: "28px",
            overflow: "hidden",
            backgroundColor: "#0D1B3E",
            padding: "64px 72px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "48px",
          }}
        >
          {/* Left: Text */}
          <div style={{ position: "relative", zIndex: 2, maxWidth: "560px" }}>
            <h2
              style={{
                fontFamily: "'Hanken Grotesk', sans-serif",
                fontSize: "40px",
                fontWeight: 900,
                color: "#ffffff",
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                marginBottom: "16px",
              }}
            >
              Jadikan Event-mu
              <br />
              <span
                style={{
                  color: "#FF6B2C",
                }}
              >
                Luar Biasa!
              </span>
            </h2>
            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.6)", lineHeight: "26px" }}>
              Manajemen tiket profesional, promosi tertarget, dan analitik real-time dalam satu platform.
            </p>

            {/* Feature bullets */}
            <div style={{ display: "flex", gap: "24px", marginTop: "28px" }}>
              {["Setup 5 menit", "Tanpa biaya awal", "Laporan real-time"].map((feature) => (
                <div key={feature} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div
                    style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      backgroundColor: "rgba(64,192,87,0.2)",
                      border: "1px solid #40C057",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "11px", color: "#40C057", fontVariationSettings: "'FILL' 1" }}>
                      check
                    </span>
                  </div>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.75)" }}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: CTA card */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              backgroundColor: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "20px",
              padding: "32px",
              flexShrink: 0,
              width: "360px",
            }}
          >
            <p style={{ fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "8px" }}>
              Mulai gratis, upgrade kapan saja
            </p>
            <h3
              style={{
                fontFamily: "'Hanken Grotesk', sans-serif",
                fontSize: "22px",
                fontWeight: 800,
                color: "#ffffff",
                letterSpacing: "-0.02em",
                marginBottom: "24px",
              }}
            >
              Buat Event Pertamamu
            </h3>

            {/* Email input */}
            <div style={{ marginBottom: "12px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  backgroundColor: "rgba(255,255,255,0.08)",
                  border: `1px solid ${emailFocused ? "#3B5BDB" : "rgba(255,255,255,0.15)"}`,
                  borderRadius: "12px",
                  padding: "12px 16px",
                  transition: "border-color 0.2s",
                  boxShadow: emailFocused ? "0 0 0 3px rgba(59,91,219,0.2)" : "none",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "rgba(255,255,255,0.4)" }}>
                  mail
                </span>
                <input
                  type="email"
                  placeholder="Email kamu..."
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  style={{
                    flex: 1,
                    backgroundColor: "transparent",
                    border: "none",
                    color: "#ffffff",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            <button
              style={{
                width: "100%",
                padding: "14px",
                backgroundColor: "#FF6B2C",
                color: "#ffffff",
                border: "none",
                borderRadius: "12px",
                fontSize: "15px",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 6px 24px rgba(255,107,44,0.4)",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
              onMouseEnter={(e) => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.transform = "translateY(-2px)";
                b.style.boxShadow = "0 10px 32px rgba(255,107,44,0.55)";
              }}
              onMouseLeave={(e) => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.transform = "translateY(0)";
                b.style.boxShadow = "0 6px 24px rgba(255,107,44,0.4)";
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px", fontVariationSettings: "'FILL' 1" }}>
                confirmation_number
              </span>
              Buat Event Sekarang
            </button>

            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textAlign: "center", marginTop: "12px" }}>
              Tidak perlu kartu kredit. Tersedia untuk semua skala event.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
