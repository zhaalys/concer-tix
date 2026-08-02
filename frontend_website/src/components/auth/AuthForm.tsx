"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface AuthFormProps {
  initialMode?: "login" | "register";
}

export default function AuthForm({ initialMode = "login" }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [step, setStep] = useState<"email" | "password" | "register" | "register_password">(initialMode === "register" ? "register" : "email");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (step === "email" && email) {
      setStep("password");
      return;
    }
    setIsLoading(true);
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setIsLoading(false);
    if (signInError) {
      setError(signInError.message === "Invalid login credentials" ? "Email atau password salah" : signInError.message);
      return;
    }
    if (data?.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle();
      if (profile?.role === "admin" || profile?.role === "super_admin") {
        router.push("/admin");
        return;
      }
    }
    router.push("/");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: name.trim() || email.split("@")[0] } },
    });
    setIsLoading(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    router.push("/login?check_email=true");
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin + "/auth/callback" } });
  };

  const isLogin = step === "password" || step === "email";

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
            {isLogin ? "Welcome back!" : "Create an account"}
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
            {isLogin ? "Please log in to continue to your account." : "Sign up to get started with your account."}
          </p>

          {error && (
            <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "8px", padding: "10px 14px", marginBottom: "16px", fontSize: "13px", color: "#DC2626" }}>
              {error}
            </div>
          )}

          {step === "register" ? (
            <form onSubmit={(e) => { e.preventDefault(); if (name.trim() && email.trim()) { setStep("register_password"); } }} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#0F172A", marginBottom: "6px", textAlign: "left" }}>Name</label>
                <input type="text" required placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)}
                  style={{ width: "100%", height: "42px", padding: "0 14px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "14px", color: "#111827", boxSizing: "border-box", outline: "none" }}
                  onFocus={(e) => (e.target.style.borderColor = "#0F766E")} onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#0F172A", marginBottom: "6px", textAlign: "left" }}>Email</label>
                <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
                  style={{ width: "100%", height: "42px", padding: "0 14px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "14px", color: "#111827", boxSizing: "border-box", outline: "none" }}
                  onFocus={(e) => (e.target.style.borderColor = "#0F766E")} onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")} />
              </div>
              <button type="submit" disabled={!name.trim() || !email.trim()}
                style={{ width: "100%", height: "42px", backgroundColor: "#0F766E", color: "#ffffff", borderRadius: "8px", border: "none", fontSize: "13px", fontWeight: 600, cursor: !name.trim() || !email.trim() ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginTop: "6px", opacity: !name.trim() || !email.trim() ? 0.5 : 1 }}>
                Continue
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "4px" }}>
                <div style={{ flex: 1, height: "1px", backgroundColor: "#E5E7EB" }} />
                <span style={{ fontSize: "12px", color: "#94A3B8" }}>or</span>
                <div style={{ flex: 1, height: "1px", backgroundColor: "#E5E7EB" }} />
              </div>

              <button type="button" onClick={handleGoogleLogin}
                style={{ width: "100%", height: "42px", backgroundColor: "#ffffff", color: "#374151", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "13px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Google
              </button>

              <div style={{ textAlign: "center", marginTop: "4px" }}>
                <span style={{ fontSize: "13px", color: "#64748B" }}>Already have an account? </span>
                <button type="button" onClick={() => { setStep("email"); setError(""); }} style={{ fontSize: "13px", color: "#0F766E", background: "none", border: "none", cursor: "pointer", fontWeight: 600, padding: 0 }}>
                  Log In
                </button>
              </div>
            </form>
          ) : step === "register_password" ? (
            <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 500, color: "#374151" }}>Password</label>
                  <button type="button" onClick={() => setStep("register")} style={{ fontSize: "12px", color: "#0F766E", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                    Change Email
                  </button>
                </div>
                <input type="password" required placeholder="Min. 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus
                  style={{ width: "100%", height: "42px", padding: "0 14px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "14px", color: "#111827", boxSizing: "border-box", outline: "none" }}
                  onFocus={(e) => (e.target.style.borderColor = "#0F766E")} onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")} />
              </div>
              <button type="submit" disabled={isLoading || password.length < 6}
                style={{ width: "100%", height: "42px", backgroundColor: "#0F766E", color: "#ffffff", borderRadius: "8px", border: "none", fontSize: "13px", fontWeight: 600, cursor: isLoading || password.length < 6 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginTop: "6px", opacity: isLoading || password.length < 6 ? 0.5 : 1 }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0B5E57")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0F766E")}>
                {isLoading ? "Creating account..." : "Create Account"}
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "4px" }}>
                <div style={{ flex: 1, height: "1px", backgroundColor: "#E5E7EB" }} />
                <span style={{ fontSize: "12px", color: "#94A3B8" }}>or</span>
                <div style={{ flex: 1, height: "1px", backgroundColor: "#E5E7EB" }} />
              </div>

              <button type="button" onClick={handleGoogleLogin}
                style={{ width: "100%", height: "42px", backgroundColor: "#ffffff", color: "#374151", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "13px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Google
              </button>

              <div style={{ textAlign: "center", marginTop: "4px" }}>
                <span style={{ fontSize: "13px", color: "#64748B" }}>Already have an account? </span>
                <button type="button" onClick={() => { setStep("email"); setError(""); }} style={{ fontSize: "13px", color: "#0F766E", background: "none", border: "none", cursor: "pointer", fontWeight: 600, padding: 0 }}>
                  Log In
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#0F172A", marginBottom: "6px", textAlign: "left" }}>Email</label>
                <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
                  style={{ width: "100%", height: "42px", padding: "0 14px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "14px", color: "#111827", boxSizing: "border-box", outline: "none" }}
                  onFocus={(e) => (e.target.style.borderColor = "#0F766E")} onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")} />
              </div>

              {step === "password" && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <label style={{ fontSize: "13px", fontWeight: 500, color: "#374151" }}>Password</label>
                    <button type="button" onClick={() => setStep("email")} style={{ fontSize: "12px", color: "#0F766E", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                      Change Email
                    </button>
                  </div>
                  <input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus
                    style={{ width: "100%", height: "42px", padding: "0 14px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "14px", color: "#111827", boxSizing: "border-box", outline: "none" }}
                    onFocus={(e) => (e.target.style.borderColor = "#0F766E")} onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")} />
                </div>
              )}

              <button type="submit" disabled={isLoading}
                style={{ width: "100%", height: "42px", backgroundColor: "#0F766E", color: "#ffffff", borderRadius: "8px", border: "none", fontSize: "13px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginTop: "6px" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0B5E57")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0F766E")}>
                {isLoading ? "Processing..." : step === "email" ? "Continue" : "Log In"}
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "4px" }}>
                <div style={{ flex: 1, height: "1px", backgroundColor: "#E5E7EB" }} />
                <span style={{ fontSize: "12px", color: "#94A3B8" }}>or</span>
                <div style={{ flex: 1, height: "1px", backgroundColor: "#E5E7EB" }} />
              </div>

              <button type="button" onClick={handleGoogleLogin}
                style={{ width: "100%", height: "42px", backgroundColor: "#ffffff", color: "#374151", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "13px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Google
              </button>

              <div style={{ textAlign: "center", marginTop: "4px" }}>
                <span style={{ fontSize: "13px", color: "#64748B" }}>Don&apos;t have an account? </span>
                <button type="button" onClick={() => { setStep("register"); setError(""); }} style={{ fontSize: "13px", color: "#0F766E", background: "none", border: "none", cursor: "pointer", fontWeight: 600, padding: 0 }}>
                  Sign Up
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
