"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
      }}
    >
      {/* Left Panel - Video */}
      <div
        style={{
          flex: "1 1 50%",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        >
          <source src="/vidio_log_res/3d_tix_concer.mp4" type="video/mp4" />
        </video>

        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(26,188,156,0.25) 0%, rgba(0,0,0,0.65) 100%)",
          }}
        />

        {/* Logo */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src="/logo/tix_logo.png?v=3"
            alt="TIX"
            style={{
              height: "90px",
              width: "auto",
              filter: "drop-shadow(0 4px 24px rgba(26,188,156,0.45))",
            }}
          />
        </div>

        {/* Floating dots */}
        <div
          style={{
            position: "absolute",
            top: "32px",
            right: "32px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="auth-float-dot"
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "rgba(26,188,156,0.6)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Right Panel - Form */}
      <div
        style={{
          flex: "1 1 50%",
          backgroundColor: "#ffffff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "48px 56px",
          position: "relative",
          overflow: "auto",
        }}
      >
        {/* Back to home */}
        <button
          onClick={() => router.push("/")}
          style={{
            position: "absolute",
            top: "24px",
            left: "24px",
            border: "none",
            background: "none",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 600,
            color: "#868E96",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 12px",
            borderRadius: "8px",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#F1F3F5";
            e.currentTarget.style.color = "#1A1D2E";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#868E96";
          }}
        >
          &#8592; Kembali
        </button>

        {/* Tab Switcher */}
        <div
          style={{
            display: "flex",
            backgroundColor: "#F1F3F5",
            borderRadius: "14px",
            padding: "4px",
            marginBottom: "32px",
          }}
        >
          {(["login", "register"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: "11px 0",
                borderRadius: "11px",
                border: "none",
                fontSize: "14px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.25s ease",
                backgroundColor: activeTab === tab ? "#1ABC9C" : "transparent",
                color: activeTab === tab ? "#ffffff" : "#868E96",
                boxShadow:
                  activeTab === tab ? "0 4px 12px rgba(26,188,156,0.3)" : "none",
              }}
            >
              {tab === "login" ? "Masuk" : "Daftar"}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {activeTab === "login" ? (
            <LoginForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
          ) : (
            <RegisterForm
              fullName={fullName}
              setFullName={setFullName}
              email={email}
              setEmail={setEmail}
              phone={phone}
              setPhone={setPhone}
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              showConfirmPassword={showConfirmPassword}
              setShowConfirmPassword={setShowConfirmPassword}
            />
          )}
        </div>

        {/* Social Login */}
        <div style={{ marginTop: "24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{ flex: 1, height: "1px", backgroundColor: "#E9ECEF" }}
            />
            <span
              style={{ fontSize: "12px", color: "#ADB5BD", fontWeight: 600 }}
            >
              ATAU
            </span>
            <div
              style={{ flex: 1, height: "1px", backgroundColor: "#E9ECEF" }}
            />
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <SocialButton icon="G" label="Google" color="#EA4335" />
            <SocialButton icon="f" label="Facebook" color="#1877F2" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ======================== LOGIN FORM ======================== */
function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
}: {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        flex: 1,
      }}
    >
      <div style={{ marginBottom: "4px" }}>
        <h2
          style={{
            fontSize: "24px",
            fontWeight: 800,
            color: "#1A1D2E",
            marginBottom: "6px",
            fontFamily: "'Hanken Grotesk', 'Inter', sans-serif",
          }}
        >
          Selamat Datang Kembali!
        </h2>
        <p style={{ fontSize: "14px", color: "#868E96", fontWeight: 500 }}>
          Masuk untuk beli tiket event favoritmu
        </p>
      </div>

      <InputField
        label="Email"
        type="email"
        placeholder="Masukkan email kamu"
        value={email}
        onChange={setEmail}
        icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        }
      />

      <div>
        <InputField
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Masukkan password"
          value={password}
          onChange={setPassword}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          }
          suffix={
            <button
              onClick={() => setShowPassword(!showPassword)}
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
                fontSize: "12px",
                color: "#1ABC9C",
                fontWeight: 600,
                padding: "2px 6px",
              }}
            >
              {showPassword ? "Sembunyikan" : "Tampilkan"}
            </button>
          }
        />
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "6px",
          }}
        >
          <a
            href="#"
            style={{
              fontSize: "12px",
              color: "#1ABC9C",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Lupa Password?
          </a>
        </div>
      </div>

      <button
        style={{
          width: "100%",
          padding: "14px 0",
          borderRadius: "14px",
          border: "none",
          backgroundColor: "#1ABC9C",
          color: "#ffffff",
          fontSize: "15px",
          fontWeight: 700,
          cursor: "pointer",
          transition: "all 0.2s ease",
          marginTop: "auto",
          boxShadow: "0 4px 16px rgba(26,188,156,0.35)",
          letterSpacing: "-0.01em",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#17a88a";
          e.currentTarget.style.boxShadow =
            "0 6px 24px rgba(26,188,156,0.45)";
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#1ABC9C";
          e.currentTarget.style.boxShadow =
            "0 4px 16px rgba(26,188,156,0.35)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        Masuk
      </button>
    </div>
  );
}

/* ======================== REGISTER FORM ======================== */
function RegisterForm({
  fullName,
  setFullName,
  email,
  setEmail,
  phone,
  setPhone,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
}: {
  fullName: string;
  setFullName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (v: boolean) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        flex: 1,
      }}
    >
      <div style={{ marginBottom: "2px" }}>
        <h2
          style={{
            fontSize: "24px",
            fontWeight: 800,
            color: "#1A1D2E",
            marginBottom: "6px",
            fontFamily: "'Hanken Grotesk', 'Inter', sans-serif",
          }}
        >
          Buat Akun Baru
        </h2>
        <p style={{ fontSize: "14px", color: "#868E96", fontWeight: 500 }}>
          Daftar untuk mulai beli tiket event seru
        </p>
      </div>

      <InputField
        label="Nama Lengkap"
        type="text"
        placeholder="Masukkan nama lengkap"
        value={fullName}
        onChange={setFullName}
        icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        }
      />

      <div style={{ display: "flex", gap: "10px" }}>
        <div style={{ flex: 1 }}>
          <InputField
            label="Email"
            type="email"
            placeholder="Email kamu"
            value={email}
            onChange={setEmail}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            }
          />
        </div>
        <div style={{ flex: 1 }}>
          <InputField
            label="No. Telepon"
            type="tel"
            placeholder="08xxx"
            value={phone}
            onChange={setPhone}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
              </svg>
            }
          />
        </div>
      </div>

      <InputField
        label="Password"
        type={showPassword ? "text" : "password"}
        placeholder="Buat password baru"
        value={password}
        onChange={setPassword}
        icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        }
        suffix={
          <button
            onClick={() => setShowPassword(!showPassword)}
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
              fontSize: "12px",
              color: "#1ABC9C",
              fontWeight: 600,
              padding: "2px 6px",
            }}
          >
            {showPassword ? "Sembunyikan" : "Tampilkan"}
          </button>
        }
      />

      <InputField
        label="Konfirmasi Password"
        type={showConfirmPassword ? "text" : "password"}
        placeholder="Ulangi password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        }
        suffix={
          <button
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
              fontSize: "12px",
              color: "#1ABC9C",
              fontWeight: 600,
              padding: "2px 6px",
            }}
          >
            {showConfirmPassword ? "Sembunyikan" : "Tampilkan"}
          </button>
        }
      />

      <button
        style={{
          width: "100%",
          padding: "14px 0",
          borderRadius: "14px",
          border: "none",
          backgroundColor: "#1ABC9C",
          color: "#ffffff",
          fontSize: "15px",
          fontWeight: 700,
          cursor: "pointer",
          transition: "all 0.2s ease",
          marginTop: "auto",
          boxShadow: "0 4px 16px rgba(26,188,156,0.35)",
          letterSpacing: "-0.01em",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#17a88a";
          e.currentTarget.style.boxShadow =
            "0 6px 24px rgba(26,188,156,0.45)";
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#1ABC9C";
          e.currentTarget.style.boxShadow =
            "0 4px 16px rgba(26,188,156,0.35)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        Daftar Sekarang
      </button>
    </div>
  );
}

/* ======================== SHARED COMPONENTS ======================== */
function InputField({
  label,
  type,
  placeholder,
  value,
  onChange,
  icon,
  suffix,
}: {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ReactNode;
  suffix?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: "13px",
          fontWeight: 700,
          color: "#495057",
          marginBottom: "6px",
          letterSpacing: "0.01em",
        }}
      >
        {label}
      </label>
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
      >
        <span
          style={{
            position: "absolute",
            left: "14px",
            color: focused ? "#1ABC9C" : "#ADB5BD",
            transition: "color 0.2s",
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
          }}
        >
          {icon}
        </span>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            padding: suffix ? "12px 8px 12px 42px" : "12px 14px 12px 42px",
            borderRadius: "12px",
            border: focused ? "1.5px solid #1ABC9C" : "1.5px solid #E9ECEF",
            backgroundColor: focused ? "#FAFFFE" : "#F8F9FA",
            fontSize: "14px",
            color: "#1A1D2E",
            transition: "all 0.2s ease",
            boxShadow: focused ? "0 0 0 3px rgba(26,188,156,0.1)" : "none",
            fontWeight: 500,
          }}
        />
        {suffix && (
          <div
            style={{
              position: "absolute",
              right: "8px",
            }}
          >
            {suffix}
          </div>
        )}
      </div>
    </div>
  );
}

function SocialButton({
  icon,
  label,
  color,
}: {
  icon: string;
  label: string;
  color: string;
}) {
  return (
    <button
      style={{
        flex: 1,
        padding: "11px 0",
        borderRadius: "12px",
        border: "1.5px solid #E9ECEF",
        backgroundColor: "#ffffff",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        fontSize: "13px",
        fontWeight: 600,
        color: "#495057",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.boxShadow = `0 4px 12px ${color}22`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#E9ECEF";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <span style={{ fontSize: "16px", fontWeight: 800, color }}>
        {icon}
      </span>
      {label}
    </button>
  );
}
