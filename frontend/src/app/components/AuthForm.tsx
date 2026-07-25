"use client";

import { useState } from "react";
import Link from "next/link";

interface AuthFormProps {
  initialMode?: "login" | "register";
}

export default function AuthForm({ initialMode = "login" }: AuthFormProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    rememberMe: false,
    agreeTerms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMsg("");

    setTimeout(() => {
      setIsLoading(false);
      if (mode === "login") {
        setSuccessMsg("Berhasil masuk! Mengalihkan ke Beranda...");
      } else {
        setSuccessMsg("Akun berhasil dibuat! Silakan masuk.");
      }
    }, 1200);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#F4F6FB",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Background Decorative Glow Elements */}
      <div
        style={{
          position: "absolute",
          top: "-100px",
          right: "-100px",
          width: "450px",
          height: "450px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(26,188,156,0.15) 0%, rgba(255,255,255,0) 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-120px",
          left: "-120px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(6,78,59,0.12) 0%, rgba(255,255,255,0) 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Main Container Card */}
      <div
        style={{
          width: "100%",
          maxWidth: "1060px",
          backgroundColor: "#ffffff",
          borderRadius: "28px",
          boxShadow: "0 24px 64px rgba(13, 27, 62, 0.08), 0 4px 16px rgba(0,0,0,0.02)",
          display: "flex",
          overflow: "hidden",
          border: "1px solid #E9ECEF",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Left Side: Brand Visual Hero */}
        <div
          style={{
            flex: "1",
            background: "linear-gradient(145deg, #064E3B 0%, #083C2F 50%, #0A2E25 100%)",
            padding: "48px 40px",
            color: "#ffffff",
            display: "none",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            overflow: "hidden",
          }}
          className="auth-hero-panel"
        >
          {/* Overlay pattern & glow */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage:
                "radial-gradient(rgba(26,188,156,0.2) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
              opacity: 0.6,
            }}
          />

          {/* Top Info */}
          <div style={{ position: "relative", zIndex: 2 }}>
            <Link href="/" style={{ textDecoration: "none", display: "inline-block" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  backgroundColor: "rgba(255,255,255,0.12)",
                  backdropFilter: "blur(12px)",
                  padding: "8px 16px",
                  borderRadius: "100px",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "#ffffff",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                  arrow_back
                </span>
                Kembali ke Beranda
              </div>
            </Link>

            <div style={{ marginTop: "48px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: "rgba(26,188,156,0.25)",
                  color: "#1ABC9C",
                  padding: "6px 14px",
                  borderRadius: "100px",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  marginBottom: "16px",
                  border: "1px solid rgba(26,188,156,0.4)",
                }}
              >
                ✨ PLATFORM TIKET KONSER #1
              </div>
              <h2
                style={{
                  fontSize: "32px",
                  fontWeight: 800,
                  lineHeight: 1.25,
                  letterSpacing: "-0.02em",
                  marginBottom: "16px",
                }}
              >
                Rasakan Sensasi Konser Impianmu Bersama <span style={{ color: "#1ABC9C" }}>Concer TIX</span>
              </h2>
              <p
                style={{
                  fontSize: "15px",
                  color: "rgba(255,255,255,0.8)",
                  lineHeight: 1.6,
                  maxWidth: "420px",
                }}
              >
                Akses ribuan event musik, wahana, dan festival seru di seluruh Indonesia. Transaksi aman, instan, dan 100% e-ticket resmi!
              </p>
            </div>
          </div>

          {/* Middle Floating Feature Cards */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              margin: "32px 0",
            }}
          >
            {[
              { icon: "confirmation_number", title: "E-Ticket Instan", desc: "Langsung kirim ke email & WhatsApp kamu" },
              { icon: "verified_user", title: "Garansi 100% Keamanan", desc: "Sistem pembayaran terenkripsi & resmi" },
              { icon: "local_offer", title: "Promo & Cashback Harian", desc: "Diskon khusus member Concer TIX" },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  backgroundColor: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(8px)",
                  padding: "12px 18px",
                  borderRadius: "16px",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    backgroundColor: "#1ABC9C",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    flexShrink: 0,
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                    {item.icon}
                  </span>
                </div>
                <div>
                  <h4 style={{ fontSize: "14px", fontWeight: 700, margin: 0, color: "#ffffff" }}>
                    {item.title}
                  </h4>
                  <p style={{ fontSize: "12px", margin: 0, color: "rgba(255,255,255,0.7)" }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Footer Quote */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              borderTop: "1px solid rgba(255,255,255,0.15)",
              paddingTop: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: "14px",
                  color: "#064E3B",
                }}
              >
                TIX
              </div>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>
                50,000+ Penikmat Konser
              </span>
            </div>
            <span style={{ fontSize: "13px", color: "#1ABC9C", fontWeight: 700 }}>
              ★ 4.9/5 Rating
            </span>
          </div>
        </div>

        {/* Right Side: Auth Form Container */}
        <div
          style={{
            flex: "1",
            padding: "48px 40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            maxWidth: "520px",
            margin: "0 auto",
            width: "100%",
          }}
        >
          {/* Logo Header */}
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <Link href="/" style={{ textDecoration: "none", display: "inline-block" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo/tix_logo.png?v=3"
                alt="Concer TIX Logo"
                style={{
                  height: "85px",
                  width: "auto",
                  objectFit: "contain",
                  display: "block",
                  margin: "0 auto 8px",
                }}
              />
            </Link>
            <p style={{ fontSize: "14px", color: "#5A6072", margin: 0 }}>
              {mode === "login"
                ? "Selamat datang kembali! Silakan masuk ke akun Anda."
                : "Buat akun baru untuk mulai memesan tiket event impian Anda."}
            </p>
          </div>

          {/* Mode Switcher Pill */}
          <div
            style={{
              backgroundColor: "#F1F3F5",
              padding: "5px",
              borderRadius: "100px",
              display: "flex",
              marginBottom: "28px",
              border: "1px solid #E9ECEF",
            }}
          >
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setSuccessMsg("");
              }}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "100px",
                fontSize: "14px",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                backgroundColor: mode === "login" ? "#ffffff" : "transparent",
                color: mode === "login" ? "#064E3B" : "#5A6072",
                boxShadow: mode === "login" ? "0 4px 12px rgba(0,0,0,0.06)" : "none",
                transition: "all 0.2s ease",
              }}
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setSuccessMsg("");
              }}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "100px",
                fontSize: "14px",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                backgroundColor: mode === "register" ? "#ffffff" : "transparent",
                color: mode === "register" ? "#064E3B" : "#5A6072",
                boxShadow: mode === "register" ? "0 4px 12px rgba(0,0,0,0.06)" : "none",
                transition: "all 0.2s ease",
              }}
            >
              Daftar
            </button>
          </div>

          {/* Success Banner Notice */}
          {successMsg && (
            <div
              style={{
                backgroundColor: "#E6F4EA",
                color: "#137333",
                border: "1px solid #CEEAD6",
                padding: "12px 16px",
                borderRadius: "12px",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                check_circle
              </span>
              {successMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {/* Register: Full Name */}
            {mode === "register" && (
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#1A1D2E",
                    marginBottom: "6px",
                  }}
                >
                  Nama Lengkap
                </label>
                <div style={{ position: "relative" }}>
                  <span
                    className="material-symbols-outlined"
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "20px",
                      color: "#ADB5BD",
                    }}
                  >
                    person
                  </span>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Contoh: Faishal Kenzi"
                    value={formData.name}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      height: "46px",
                      paddingLeft: "44px",
                      paddingRight: "16px",
                      borderRadius: "12px",
                      border: "1.5px solid #DEE2E6",
                      fontSize: "14px",
                      color: "#1A1D2E",
                      backgroundColor: "#F8F9FA",
                      transition: "all 0.2s ease",
                      outline: "none",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#1ABC9C";
                      e.target.style.backgroundColor = "#ffffff";
                      e.target.style.boxShadow = "0 0 0 3px rgba(26,188,156,0.15)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#DEE2E6";
                      e.target.style.backgroundColor = "#F8F9FA";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#1A1D2E",
                  marginBottom: "6px",
                }}
              >
                Alamat Email / No. HP
              </label>
              <div style={{ position: "relative" }}>
                <span
                  className="material-symbols-outlined"
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "20px",
                    color: "#ADB5BD",
                  }}
                >
                  mail
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="nama@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    height: "46px",
                    paddingLeft: "44px",
                    paddingRight: "16px",
                    borderRadius: "12px",
                    border: "1.5px solid #DEE2E6",
                    fontSize: "14px",
                    color: "#1A1D2E",
                    backgroundColor: "#F8F9FA",
                    transition: "all 0.2s ease",
                    outline: "none",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#1ABC9C";
                    e.target.style.backgroundColor = "#ffffff";
                    e.target.style.boxShadow = "0 0 0 3px rgba(26,188,156,0.15)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#DEE2E6";
                    e.target.style.backgroundColor = "#F8F9FA";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Register: WhatsApp Phone */}
            {mode === "register" && (
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#1A1D2E",
                    marginBottom: "6px",
                  }}
                >
                  No. WhatsApp / Handphone
                </label>
                <div style={{ position: "relative" }}>
                  <span
                    className="material-symbols-outlined"
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "20px",
                      color: "#ADB5BD",
                    }}
                  >
                    call
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="081234567890"
                    value={formData.phone}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      height: "46px",
                      paddingLeft: "44px",
                      paddingRight: "16px",
                      borderRadius: "12px",
                      border: "1.5px solid #DEE2E6",
                      fontSize: "14px",
                      color: "#1A1D2E",
                      backgroundColor: "#F8F9FA",
                      transition: "all 0.2s ease",
                      outline: "none",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#1ABC9C";
                      e.target.style.backgroundColor = "#ffffff";
                      e.target.style.boxShadow = "0 0 0 3px rgba(26,188,156,0.15)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#DEE2E6";
                      e.target.style.backgroundColor = "#F8F9FA";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#1A1D2E",
                  }}
                >
                  Kata Sandi
                </label>
                {mode === "login" && (
                  <a
                    href="#"
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#1ABC9C",
                      textDecoration: "none",
                    }}
                  >
                    Lupa Kata Sandi?
                  </a>
                )}
              </div>
              <div style={{ position: "relative" }}>
                <span
                  className="material-symbols-outlined"
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "20px",
                    color: "#ADB5BD",
                  }}
                >
                  lock
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    height: "46px",
                    paddingLeft: "44px",
                    paddingRight: "44px",
                    borderRadius: "12px",
                    border: "1.5px solid #DEE2E6",
                    fontSize: "14px",
                    color: "#1A1D2E",
                    backgroundColor: "#F8F9FA",
                    transition: "all 0.2s ease",
                    outline: "none",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#1ABC9C";
                    e.target.style.backgroundColor = "#ffffff";
                    e.target.style.boxShadow = "0 0 0 3px rgba(26,188,156,0.15)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#DEE2E6";
                    e.target.style.backgroundColor = "#F8F9FA";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#868E96",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Register: Confirm Password */}
            {mode === "register" && (
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#1A1D2E",
                    marginBottom: "6px",
                  }}
                >
                  Konfirmasi Kata Sandi
                </label>
                <div style={{ position: "relative" }}>
                  <span
                    className="material-symbols-outlined"
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "20px",
                      color: "#ADB5BD",
                    }}
                  >
                    lock_reset
                  </span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    required
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      height: "46px",
                      paddingLeft: "44px",
                      paddingRight: "44px",
                      borderRadius: "12px",
                      border: "1.5px solid #DEE2E6",
                      fontSize: "14px",
                      color: "#1A1D2E",
                      backgroundColor: "#F8F9FA",
                      transition: "all 0.2s ease",
                      outline: "none",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#1ABC9C";
                      e.target.style.backgroundColor = "#ffffff";
                      e.target.style.boxShadow = "0 0 0 3px rgba(26,188,156,0.15)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#DEE2E6";
                      e.target.style.backgroundColor = "#F8F9FA";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#868E96",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                      {showConfirmPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Checkbox Options */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="checkbox"
                id={mode === "login" ? "rememberMe" : "agreeTerms"}
                name={mode === "login" ? "rememberMe" : "agreeTerms"}
                checked={mode === "login" ? formData.rememberMe : formData.agreeTerms}
                onChange={handleChange}
                style={{
                  width: "18px",
                  height: "18px",
                  accentColor: "#1ABC9C",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              />
              <label
                htmlFor={mode === "login" ? "rememberMe" : "agreeTerms"}
                style={{ fontSize: "13px", color: "#5A6072", cursor: "pointer", userSelect: "none" }}
              >
                {mode === "login" ? (
                  "Ingat saya di perangkat ini"
                ) : (
                  <span>
                    Saya menyetujui <a href="#" style={{ color: "#1ABC9C", fontWeight: 600, textDecoration: "none" }}>Syarat & Ketentuan</a> Concer TIX
                  </span>
                )}
              </label>
            </div>

            {/* Action Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                height: "48px",
                backgroundColor: "#1ABC9C",
                color: "#ffffff",
                borderRadius: "100px",
                border: "none",
                fontSize: "15px",
                fontWeight: 700,
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "all 0.25s ease",
                boxShadow: "0 8px 20px rgba(26, 188, 156, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginTop: "6px",
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = "#16A085";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 12px 24px rgba(26, 188, 156, 0.4)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = "#1ABC9C";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(26, 188, 156, 0.3)";
                }
              }}
            >
              {isLoading ? (
                <>
                  <span
                    style={{
                      width: "18px",
                      height: "18px",
                      border: "2px solid #ffffff",
                      borderTopColor: "transparent",
                      borderRadius: "50%",
                      display: "inline-block",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <span>{mode === "login" ? "Masuk ke Akun" : "Daftar Sekarang"}</span>
                  <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                    arrow_forward
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Social Login Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: "24px 0 20px",
            }}
          >
            <div style={{ flex: 1, height: "1px", backgroundColor: "#E9ECEF" }} />
            <span
              style={{
                fontSize: "12px",
                color: "#868E96",
                padding: "0 12px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Atau masuk dengan
            </span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#E9ECEF" }} />
          </div>

          {/* Social Login Buttons */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <button
              type="button"
              style={{
                height: "44px",
                backgroundColor: "#ffffff",
                border: "1.5px solid #DEE2E6",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                fontSize: "13px",
                fontWeight: 600,
                color: "#495057",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#ADB5BD";
                e.currentTarget.style.backgroundColor = "#F8F9FA";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#DEE2E6";
                e.currentTarget.style.backgroundColor = "#ffffff";
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.25v3.15C3.27 21.37 7.36 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.25C.45 8.21 0 10.04 0 12s.45 3.79 1.25 5.39l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.27 2.63 1.25 6.61l4.03 3.15c.95-2.85 3.6-4.96 6.72-4.96z"
                />
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              style={{
                height: "44px",
                backgroundColor: "#ffffff",
                border: "1.5px solid #DEE2E6",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                fontSize: "13px",
                fontWeight: 600,
                color: "#495057",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#ADB5BD";
                e.currentTarget.style.backgroundColor = "#F8F9FA";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#DEE2E6";
                e.currentTarget.style.backgroundColor = "#ffffff";
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Facebook</span>
            </button>
          </div>

          {/* Footer Back Link for Mobile */}
          <div style={{ marginTop: "28px", textAlign: "center" }} className="mobile-home-link">
            <Link
              href="/"
              style={{
                fontSize: "13px",
                color: "#5A6072",
                textDecoration: "none",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                arrow_back
              </span>
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @media (min-width: 900px) {
          .auth-hero-panel {
            display: flex !important;
          }
          .mobile-home-link {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
