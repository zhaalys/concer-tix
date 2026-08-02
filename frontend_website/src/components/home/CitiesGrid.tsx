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
    <section className="cities-grid-section">
      <style>{`
        .cities-grid-section {
          max-width: 1320px;
          margin: 0 auto;
          padding: 30px 32px 50px;
        }
        .city-grid-item {
          flex-shrink: 0;
          width: 150px;
        }
        .city-grid-img {
          width: 150px;
          height: 100px;
          object-fit: cover;
          border-radius: 12px;
          display: block;
        }
        @media (max-width: 767px) {
          .cities-grid-section {
            padding: 16px 16px 36px !important;
          }
          .city-grid-item {
            width: 125px !important;
          }
          .city-grid-img {
            width: 125px !important;
            height: 84px !important;
          }
        }
      `}</style>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h2 className="section-heading">Find Exciting Events Near You!</h2>
        </div>
        <Link
          href="/explore"
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
          See All Cities
          <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>
            chevron_right
          </span>
        </Link>
      </div>

      {/* Row */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          overflowX: "auto",
        }}
        className="hide-scrollbar"
      >
        {cities.map((city, i) => (
          <Link
            key={i}
            href={`/explore?kota=${encodeURIComponent(city.name)}`}
            className="city-grid-item"
            style={{
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
              className="city-grid-img"
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
