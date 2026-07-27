"use client";
import { useState } from "react";
import Link from "next/link";

const cities = [
  { icon: "location_city", name: "DKI Jakarta", count: 126, img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Monas_-_front.jpg/320px-Monas_-_front.jpg", color: "#3B5BDB" },
  { icon: "temple_hindu", name: "Bali", count: 54, img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Tanah_Lot_Bali_Indonesia_Pura-Tanah-Lot-01.jpg/320px-Tanah_Lot_Bali_Indonesia_Pura-Tanah-Lot-01.jpg", color: "#FF6B2C" },
  { icon: "apartment", name: "Bandung", count: 83, img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Gedung_Sate%2C_Bandung%2C_2013.jpg/320px-Gedung_Sate%2C_Bandung%2C_2013.jpg", color: "#7950F2" },
  { icon: "domain", name: "Surabaya", count: 61, img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Surabaya_city_montage.jpg/320px-Surabaya_city_montage.jpg", color: "#2F9E44" },
  { icon: "location_on", name: "Yogyakarta", count: 45, img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Borobudur-temple-4149815_1280.jpg/320px-Borobudur-temple-4149815_1280.jpg", color: "#1098AD" },
];

function CityCard({ city }: { city: typeof cities[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/jelajahi?kota=${encodeURIComponent(city.name)}`}
      style={{
        position: "relative",
        borderRadius: "16px",
        overflow: "hidden",
        cursor: "pointer",
        flex: 1,
        minWidth: "160px",
        textDecoration: "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Background */}
      <div
        style={{
          height: "180px",
          backgroundColor: city.color + "18",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* City emoji/icon as background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.4s ease",
            transform: hovered ? "scale(1.1)" : "scale(1)",
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: "72px",
              color: city.color,
              opacity: 0.25,
              fontVariationSettings: "'FILL' 1",
            }}
          >
            {city.icon}
          </span>
        </div>

        {/* Overlay on hover */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: city.color,
            opacity: hovered ? 0.15 : 0,
            transition: "opacity 0.3s ease",
          }}
        />

        {/* Bottom content */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "14px 16px",
            backgroundColor: "rgba(0,0,0,0.4)",
          }}
        >
          <h3
            style={{
              fontFamily: "'Hanken Grotesk', sans-serif",
              fontSize: "16px",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.02em",
              marginBottom: "2px",
            }}
          >
            {city.name}
          </h3>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "#868E96", fontWeight: 500 }}>
            {city.count}+ Events
          </span>
        </div>
      </div>

      {/* Bottom action */}
      <div
        style={{
          backgroundColor: hovered ? city.color : "#ffffff",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "none",
          borderLeft: `1px solid ${hovered ? city.color : "#E4E8F0"}`,
          borderRight: `1px solid ${hovered ? city.color : "#E4E8F0"}`,
          borderBottom: `1px solid ${hovered ? city.color : "#E4E8F0"}`,
          borderBottomLeftRadius: "16px",
          borderBottomRightRadius: "16px",
          transition: "all 0.2s ease",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            fontWeight: 700,
            color: hovered ? "#ffffff" : city.color,
            transition: "color 0.2s",
          }}
        >
          View Events
        </span>
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: "16px",
            color: hovered ? "#ffffff" : city.color,
            transition: "color 0.2s",
          }}
        >
          arrow_forward
        </span>
      </div>
    </Link>
  );
}

export default function CitiesSection() {
  return (
    <section style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 32px 64px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h2 className="section-heading">Explore Events in Your City</h2>
        </div>
        <Link
          href="/jelajahi"
          style={{ fontSize: "13px", fontWeight: 600, color: "#3B5BDB", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}
        >
          All Cities
          <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>chevron_right</span>
        </Link>
      </div>

      <div style={{ display: "flex", gap: "16px" }}>
        {cities.map((city) => (
          <CityCard key={city.name} city={city} />
        ))}
      </div>
    </section>
  );
}
