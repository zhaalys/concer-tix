"use client";
import Link from "next/link";

const cities = [
  { img: "/image_kota/jabodetabek.png", name: "Jabodetabek" },
  { img: "/image_kota/jawa_barat.png", name: "Jawa Barat" },
  { img: "/image_kota/jawa_tengah.png", name: "Jawa Tengah" },
  { img: "/image_kota/jawa_timur.png", name: "Jawa Timur" },
  { img: "/image_kota/kalimantan.png", name: "Kalimantan" },
  { img: "/image_kota/sumatera.png", name: "Sumatera" },
  { img: "/image_kota/indonesia_timur.png", name: "Indonesia Timur" },
];

export default function CitiesGrid() {
  return (
    <section
      style={{
        maxWidth: "1320px",
        margin: "0 auto",
        padding: "30px 32px 50px",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h2 className="section-heading">Temukan Event Menarik di Kotamu!</h2>
        </div>
        <Link
          href="/jelajahi"
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#1ABC9C",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          Lihat Semua Kota
          <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>
            chevron_right
          </span>
        </Link>
      </div>

      {/* Row */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          overflowX: "auto",
        }}
        className="hide-scrollbar"
      >
        {cities.map((city, i) => (
          <Link
            key={i}
            href={`/jelajahi?kota=${encodeURIComponent(city.name)}`}
            style={{
              flexShrink: 0,
              width: "150px",
              cursor: "pointer",
              textAlign: "center",
              textDecoration: "none",
              transition: "transform 0.2s ease",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={city.img}
              alt={city.name}
              style={{
                width: "150px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "12px",
                display: "block",
              }}
            />
            <span
              style={{
                display: "block",
                marginTop: "8px",
                fontSize: "13px",
                fontWeight: 600,
                color: "#1A1D2E",
              }}
            >
              {city.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

