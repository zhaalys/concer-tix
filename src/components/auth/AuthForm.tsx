"use client";

import { useState } from "react";
import Link from "next/link";

interface AuthFormProps {
  initialMode?: "login" | "register";
}

export default function AuthForm({ initialMode = "login" }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"email" | "password">("email");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === "email" && email) {
      setStep("password");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = "/";
    }, 1000);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        backgroundColor: "#ffffff",
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
        overflow: "hidden",
      }}
    >
      <style>{`
        @media (max-width: 900px) {
          .auth-left-video {
            display: none !important;
          }
          .auth-right-container {
            width: 100% !important;
            padding: 32px 24px !important;
          }
        }
      `}</style>

      <div
        className="auth-left-video"
        style={{
          width: "50%",
          height: "100vh",
          position: "relative",
          backgroundColor: "#050B14",
          overflow: "hidden",
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        >
          <source src="/video_log_res/3d_tix_concer.mp4" type="video/mp4" />
        </video>
      </div>

      <div
        className="auth-right-container"
        style={{
          width: "50%",
          height: "100vh",
          backgroundColor: "#ffffff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px 32px",
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        <div
          style={{
            maxWidth: "360px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              marginBottom: "40px",
            }}
          >
            <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo/tix_logo.png?v=3"
                alt="Concer TIX Logo"
                style={{
                  height: "54px",
                  width: "auto",
                  objectFit: "contain",
                }}
              />
            </Link>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#F3F4F6",
                padding: "6px 14px",
                borderRadius: "100px",
                fontSize: "12px",
                fontWeight: 600,
                color: "#374151",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "linear-gradient(180deg, #EF4444 50%, #ffffff 50%)",
                  border: "1px solid #E5E7EB",
                  display: "inline-block",
                }}
              />
              <span>ID</span>
            </div>
          </div>

          <h2
            style={{
              fontSize: "24px",
              fontWeight: 600,
              color: "#0F172A",
              margin: "0 0 6px",
              letterSpacing: "-0.02em",
              textAlign: "left",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Welcome back!
          </h2>
          <p
            style={{
              fontSize: "14px",
              fontWeight: 400,
              color: "#64748B",
              margin: "0 0 28px",
              textAlign: "left",
              lineHeight: 1.4,
              letterSpacing: "-0.01em",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Please log in to continue to your account.
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#0F172A",
                  marginBottom: "6px",
                  textAlign: "left",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                Email
              </label>
              <input
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  height: "42px",
                  padding: "0 14px",
                  borderRadius: "8px",
                  border: "1px solid #E5E7EB",
                  fontSize: "14px",
                  color: "#111827",
                  backgroundColor: "#ffffff",
                  boxSizing: "border-box",
                  outline: "none",
                  transition: "border-color 0.15s ease",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#0F766E")}
                onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
              />
            </div>

            {step === "password" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <label
                    style={{
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "#374151",
                    }}
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setStep("email")}
                    style={{
                      fontSize: "12px",
                      color: "#0F766E",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    Change Email
                  </button>
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                  style={{
                    width: "100%",
                    height: "42px",
                    padding: "0 14px",
                    borderRadius: "8px",
                    border: "1px solid #E5E7EB",
                    fontSize: "14px",
                    color: "#111827",
                    backgroundColor: "#ffffff",
                    boxSizing: "border-box",
                    outline: "none",
                    transition: "border-color 0.15s ease",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#0F766E")}
                  onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                height: "42px",
                backgroundColor: "#0F766E",
                color: "#ffffff",
                borderRadius: "8px",
                border: "none",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                marginTop: "6px",
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0B5E57")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0F766E")}
            >
              {isLoading ? (
                <span>Processing...</span>
              ) : (
                <span>{step === "email" ? "Continue" : "Log In"}</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
