"use client";
import { useState, useEffect } from "react";

const navLinks = [
  { label: "Beranda", href: "#", active: true },
  { label: "Jelajahi", href: "#" },
  { label: "Event Saya", href: "#" },
  { label: "Tentang", href: "#" },
];

const artistPlaceholders = [
  "Cari Sheila On 7...",
  "Cari Coldplay...",
  "Cari Hindia...",
  "Cari Bernadya...",
  "Cari Mahalini...",
  "Cari Tulus...",
  "Cari JKT48...",
  "Cari Bruno Mars...",
  "Cari Raisa...",
  "Cari Pamungkas...",
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [artistIndex, setArtistIndex] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setArtistIndex((prev) => (prev + 1) % artistPlaceholders.length);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Top Bar */}
      <div
        style={{
          backgroundColor: "#064E3B",
          height: "38px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "32px",
        }}
      >
        {["Our Journey", "Biaya", "Tiket Gelang", "FAQ!"].map((item) => (
          <a
            key={item}
            href="#"
            style={{
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: 500,
              textDecoration: "none",
              letterSpacing: "0.02em",
            }}
          >
            {item}
          </a>
        ))}
      </div>

      {/* Main Navbar */}
      <nav
        style={{
          backgroundColor: "#ffffff",
          position: "sticky",
          top: 0,
          zIndex: 100,
          borderBottom: "1px solid #E9ECEF",
          transition: "box-shadow 0.3s ease",
          boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.08)" : "none",
        }}
      >
        <div
          style={{
            maxWidth: "1320px",
            margin: "0 auto",
            padding: "0 32px",
            height: "76px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "32px",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo/tix_logo.png?v=3"
                alt="Concer TIX Logo"
                style={{
                  height: "100px",
                  width: "auto",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </a>
          </div>

          {/* Center: Pill Nav + Search */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, justifyContent: "center" }}>
            {/* Pill nav */}
            <div
              style={{
                display: "flex",
                backgroundColor: "#F1F3F5",
                borderRadius: "100px",
                padding: "4px",
                gap: "2px",
                flexShrink: 0,
              }}
            >
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  style={{
                    padding: "7px 18px",
                    borderRadius: "100px",
                    fontSize: "13px",
                    fontWeight: 600,
                    textDecoration: "none",
                    color: link.active ? "#ffffff" : "#5A6072",
                    backgroundColor: link.active ? "#1ABC9C" : "transparent",
                    transition: "all 0.2s ease",
                    letterSpacing: "-0.01em",
                    boxShadow: "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!link.active) {
                      e.currentTarget.style.color = "#1A1D2E";
                      e.currentTarget.style.backgroundColor = "#E9ECEF";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!link.active) {
                      e.currentTarget.style.color = "#5A6072";
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Search */}
            <div
              style={{
                position: "relative",
                flex: 1,
                maxWidth: "340px",
                marginLeft: "12px",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "18px",
                  color: searchFocused ? "#1ABC9C" : "#ADB5BD",
                  transition: "color 0.2s",
                }}
              >
                search
              </span>
              <style>{`.artist-search::placeholder { color: transparent; }`}</style>
              {!searchFocused && (
                <span
                  style={{
                    position: "absolute",
                    left: "44px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "13px",
                    color: "#868E96",
                    pointerEvents: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  Cari <span style={{ fontWeight: 700, color: "#1A1D2E" }}>{artistPlaceholders[artistIndex].replace("Cari ", "").replace("...", "")}</span>...
                </span>
              )}
              <input
                className="artist-search"
                type="text"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                style={{
                  width: "100%",
                  height: "40px",
                  paddingLeft: "44px",
                  paddingRight: "16px",
                  backgroundColor: searchFocused ? "#ffffff" : "#F1F3F5",
                  border: searchFocused ? "1.5px solid #1ABC9C" : "1.5px solid #E9ECEF",
                  borderRadius: "100px",
                  color: "#1A1D2E",
                  fontSize: "13px",
                  transition: "all 0.2s ease",
                  boxShadow: searchFocused ? "0 0 0 3px rgba(26,188,156,0.1)" : "none",
                }}
              />
            </div>
          </div>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
            <button
              style={{
                backgroundColor: "transparent",
                border: "1.5px solid #DEE2E6",
                color: "#495057",
                padding: "8px 20px",
                borderRadius: "100px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.borderColor = "#1ABC9C";
                b.style.color = "#1ABC9C";
              }}
              onMouseLeave={(e) => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.borderColor = "#DEE2E6";
                b.style.color = "#495057";
              }}
            >
              Masuk
            </button>
            <button
              style={{
                backgroundColor: "#1ABC9C",
                color: "#ffffff",
                padding: "8px 22px",
                borderRadius: "100px",
                fontSize: "13px",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
                letterSpacing: "-0.01em",
              }}
            >
              Buat Event
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
