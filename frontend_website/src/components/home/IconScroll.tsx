"use client";

import { useRef, useState, useEffect } from "react";

const items = [
  { src: "/icon/fastfood.png", label: "Food Court" },
  { src: "/icon/localparking.png", label: "Parkir Luas" },
  { src: "/icon/wifi.png", label: "Wi-Fi" },
  { src: "/icon/toilet.png", label: "Toilet" },
  { src: "/icon/kursiroda.png", label: "Akses Kursi Roda" },
  { src: "/icon/ac.png", label: "AC" },
  { src: "/icon/securty.png", label: "Keamanan" },
  { src: "/icon/sound.png", label: "Sound System" },
  { src: "/icon/vip.png", label: "VIP Seats" },
  { src: "/icon/merch.png", label: "Merchandise" },
  { src: "/icon/atm.png", label: "ATM" },
  { src: "/icon/poskesehatan.png", label: "Pos Kesehatan" },
];

export default function IconScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 4);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows);
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, []);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 300 : -300, behavior: "smooth" });
  };

  return (
    <section style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 32px 48px", position: "relative" }}>
      <div
        ref={scrollRef}
        style={{
          display: "flex",
          gap: "48px",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          paddingBottom: "8px",
        }}
        className="hide-scrollbar"
      >
        {items.map((item) => (
          <div
            key={item.label}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              flexShrink: 0,
              scrollSnapAlign: "start",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.src} alt={item.label} style={{ width: "56px", height: "56px", objectFit: "contain" }} />
            <span style={{ fontSize: "11px", fontWeight: 600, color: "#495057", textAlign: "center", whiteSpace: "nowrap" }}>{item.label}</span>
          </div>
        ))}
      </div>

      {showLeft && (
        <div
          onClick={() => scroll("left")}
          style={{
            position: "absolute",
            left: "32px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "#ffffff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 2,
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "#1A1D2E", fontWeight: 700 }}>
            chevron_left
          </span>
        </div>
      )}

      {showRight && (
        <div
          onClick={() => scroll("right")}
          style={{
            position: "absolute",
            right: "32px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "#ffffff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 2,
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "#1A1D2E", fontWeight: 700 }}>
            chevron_right
          </span>
        </div>
      )}
    </section>
  );
}
