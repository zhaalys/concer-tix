"use client";
import { useState } from "react";

const featured = [
  {
    img: "https://lh3.googleusercontent.com/aida/AP1WRLvVjojdRTUPPX-srA_XfZ_pi64ZXv653hvor4OlljRkmrs50Yh88OdCED1crl13cEiJyM1GqfAfZodMG5zh48bk0-5KOxU7tsvEVemIiQHSzKzeYI6d1Qe6HWKpMwBRarW_5Lf_RtVCWjSBGML3F_UbR4NSriIrST5GoALYgIhPf2Dq7QGF1Dh6-2ykABWPKSyOpPmTQbnMvqVsNpQ_MP44mmPCpyxt17hDNrrA8bBpQhuJDgf6tWNZxQwR",
    label: "Populer",
    title: "Home Sweet Loan The Musical",
    desc: "Pertunjukan teater musikal yang menyentuh hati",
    date: "Setiap Sab & Min",
    price: "Rp 350.000",
    color: "#7950F2",
    span: "big",
  },
  {
    img: "https://lh3.googleusercontent.com/aida/AP1WRLt4twpyinTDPRivMBonQnHMVJA8Vccc2Q-cJg5QcM8INxNurX0H6IsF98zjbWLzQa0rTEyB32rnhHgJxoCvQN8jVqd8rviKchOZavW45QtgNN42f09gsGcbat3jN2ocoMVH0SOumqpgU5S_pMQ90l6o5alxIiPqIPHUGuNo3DwvMXyzPlcwWNuSd8cRtyxgKpozWDPLwZ8gK7kF-gQ0w7xtOpLUFg93wrVC1UqUZyWVXVggse-XYXxrr1MZ",
    label: "Trending",
    title: "Festival Indie Jakarta",
    desc: "Jelajahi musik indie lokal terbaik",
    date: "1 Agustus 2026",
    price: "Rp 180.000",
    color: "#20C997",
    span: "small",
  },
  {
    img: "https://lh3.googleusercontent.com/aida/AP1WRLs65BmVCTKYYZzAApSGPqR_bkrUJ-BVcXyyjY-V1JMFH2MNKPwQzxAPhdpGVOuGVV5WBPJE3zq95n0BIQC6FNlJ0sKWr3LrWdSR_epugTSAOdJCNqcYkqJj_5ftkaskK_dnjP6igH6K-Gz-kgOSzxbrDGIRe4yNQ2QGsMQbcJpqV8WqK9ddeQAZ0mXHT1ZGbP-_s_ZRSteF2tlP-pi52UGL5js-XOzGqPXVHvQRF7kdypfqVi-mUUxCxEU",
    label: "Baru",
    title: "Ancol Aquathlon 2026",
    desc: "Kompetisi triathlon di tepi pantai",
    date: "23 Agustus 2026",
    price: "Rp 250.000",
    color: "#FF6B2C",
    span: "small",
  },
];

function TrendingCard({
  item,
  big,
}: {
  item: (typeof featured)[0];
  big: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        position: "relative",
        borderRadius: "16px",
        overflow: "hidden",
        cursor: "pointer",
        height: big ? "100%" : "calc(50% - 10px)",
        minHeight: big ? "400px" : "195px",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.img}
        alt={item.title}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: "transform 0.5s ease",
          transform: hovered ? "scale(1.06)" : "scale(1)",
        }}
      />

      {/* Gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.6)",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: big ? "28px" : "16px",
        }}
      >
        <h3
          style={{
            fontFamily: "'Hanken Grotesk', sans-serif",
            fontSize: big ? "22px" : "15px",
            fontWeight: 800,
            color: "#ffffff",
            marginBottom: "4px",
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
          }}
        >
          {item.title}
        </h3>
        {big && (
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.65)", marginBottom: "16px" }}>
            {item.desc}
          </p>
        )}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", fontVariationSettings: "'FILL' 1" }}
            >
              calendar_today
            </span>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>
              {item.date}
            </span>
          </div>
          <span
            style={{
              fontFamily: "'Hanken Grotesk', sans-serif",
              fontSize: big ? "16px" : "13px",
              fontWeight: 800,
              color: "#ffffff",
              backgroundColor: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
              padding: "4px 12px",
              borderRadius: "100px",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            {item.price}
          </span>
        </div>

        {/* Hover CTA */}
        {hovered && (
          <button
            style={{
              marginTop: "14px",
              width: "100%",
              padding: "10px",
              backgroundColor: item.color,
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "16px", fontVariationSettings: "'FILL' 1" }}>
              confirmation_number
            </span>
            Pesan Tiket
          </button>
        )}
      </div>
    </div>
  );
}

export default function TrendingSection() {
  return (
    <section
      style={{
        backgroundColor: "#ffffff",
        padding: "64px 0",
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid #E9ECEF",
        borderBottom: "1px solid #E9ECEF",
      }}
    >

      <div style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 32px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <h2
              style={{
                fontFamily: "'Hanken Grotesk', sans-serif",
                fontSize: "22px",
                fontWeight: 800,
                color: "#1A1D2E",
                letterSpacing: "-0.02em",
              }}
            >
              Lagi Trending
            </h2>
          </div>
          <a
            href="#"
            style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#8892A4",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#3B5BDB")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#8892A4")}
          >
            Lihat Semua
            <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>chevron_right</span>
          </a>
        </div>

        {/* Bento grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "auto",
            gap: "20px",
            height: "420px",
          }}
        >
          <TrendingCard item={featured[0]} big={true} />
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <TrendingCard item={featured[1]} big={false} />
            <TrendingCard item={featured[2]} big={false} />
          </div>
        </div>
      </div>
    </section>
  );
}
