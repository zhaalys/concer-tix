"use client";
import { useState } from "react";

const upcomingEvents = [
  {
    month: "JUL",
    day: 23,
    dayName: "Kamis",
    title: "Science Show for Kids",
    venue: "Cinema 88 Hall",
    city: "Jakarta Pusat",
    time: "10:00 WIB",
    category: "Edukasi",
    color: "#1098AD",
    img: "https://lh3.googleusercontent.com/aida/AP1WRLuXNlzljEHXYiY2Em4WKBVtv0UYZFBiGOyXFzhcqj5JhLzbXKb96sCzFKz6mSYxI_IGIPDMtkBrc5CemCDU99ZQLmL-SxONRxbH9B1OVnmkDqBNr4bfN1R2bUJA0Z-ukWi5ZiWkPQx_HCOVE_C8m_aT4MsbWK6xjRIj7xnMrwa7fkViYQQSPiDpQ44bKm2HsJ_kAeYFFuovqHLKPI90ZwYvEb2RrKoaeFAgv2WdgZE4OquhbQUmBbSISWGi",
    price: "Rp 75.000",
    available: true,
  },
  {
    month: "JUL",
    day: 25,
    dayName: "Sabtu",
    title: "VIXTAPE KONEKT Showcase",
    venue: "The Brickhall",
    city: "Jakarta Selatan",
    time: "19:00 WIB",
    category: "Konser",
    color: "#FF6B2C",
    img: "https://lh3.googleusercontent.com/aida/AP1WRLttVZEb3yxrJtEdg2m5W0-tE7XuwlYIKEK_b7XzKCKc5a9Erfxmqf_M8XrsaRVnY5xD09NfljONk1FZTtv2MUfgnQer41qRmO2FBmw9vt-5wdHr89nWrKYBnjbzYOqGMLBg_cKvxeS8ZgMxT_edzak9lveev0DGZyf2O3IxO0_0bCmNNva7YqEqa3Ov9Os7rx4itzPX4FDfXo83NHSQUI-lAGi-3ozgTqkhxbhsTMzAeKC_xMvnH2_EWWQ",
    price: "Rp 125.000",
    available: true,
  },
  {
    month: "JUL",
    day: 28,
    dayName: "Selasa",
    title: "Jakarta Boxing Open Vol. 5",
    venue: "Bengkel Hall",
    city: "Jakarta Selatan",
    time: "15:00 WIB",
    category: "Olahraga",
    color: "#2F9E44",
    img: "https://lh3.googleusercontent.com/aida/AP1WRLtj_CmDLUeVwYkV_M2u4TiR_Xc80HtMEp2JeAa8t6dhnmWmQgJdwH1oDJPlXDsSKUwsT4Otpx7is_12DZ8X3Ny67AjVCNlfd412X90VTJCQQikLG213zKPgWhs9tyeBOMoO6ozLghqXGceZa85RX0JeguQfA59IUsl5bIoBkwAKOP86Umdg-wnnDvIw95yN3B6q68imqKqu10HM1AvbXx8uN6ll-oIefBa4_BvM4mED7OmjrJYWVKuDJRM",
    price: "Rp 100.000",
    available: false,
  },
];

export default function Event2Go() {
  return (
    <section
      style={{
        maxWidth: "1320px",
        margin: "0 auto",
        padding: "64px 32px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "340px 1fr",
          gap: "28px",
          alignItems: "start",
        }}
      >
        {/* Left: Promo card */}
        <div
          style={{
            backgroundColor: "#0D1B3E",
            borderRadius: "24px",
            padding: "36px 32px",
            position: "relative",
            overflow: "hidden",
            color: "#ffffff",
          }}
        >
          {/* Content */}
          <div style={{ position: "relative", zIndex: 2 }}>
            <h2
              style={{
                fontFamily: "'Hanken Grotesk', sans-serif",
                fontSize: "28px",
                fontWeight: 900,
                lineHeight: 1.15,
                letterSpacing: "-0.03em",
                marginBottom: "14px",
              }}
            >
              Jangan Sampai
              <br />
              <span style={{ color: "#FF6B2C" }}>Ketinggalan!</span>
            </h2>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: "22px", marginBottom: "28px" }}>
              Event seru di sekitar kamu, pesan tiket sebelum habis terjual.
            </p>

            {/* Stats row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginBottom: "28px",
              }}
            >
              {[
                { num: "3", label: "Event Minggu Ini" },
                { num: "12K+", label: "Tiket Terjual" },
              ].map(({ num, label }) => (
                <div
                  key={label}
                  style={{
                    backgroundColor: "rgba(255,255,255,0.07)",
                    borderRadius: "12px",
                    padding: "14px",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'Hanken Grotesk', sans-serif",
                      fontSize: "22px",
                      fontWeight: 900,
                      color: "#FF6B2C",
                      lineHeight: 1,
                      marginBottom: "4px",
                    }}
                  >
                    {num}
                  </p>
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <button
              style={{
                width: "100%",
                padding: "13px",
                backgroundColor: "#3B5BDB",
                color: "#ffffff",
                border: "none",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: "0 6px 24px rgba(59,91,219,0.4)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 10px 32px rgba(59,91,219,0.5)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 24px rgba(59,91,219,0.4)";
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px", fontVariationSettings: "'FILL' 1" }}>
                explore
              </span>
              Jelajahi Semua Event
            </button>
          </div>
        </div>

        {/* Right: Event list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ marginBottom: "4px" }}>
            <h2 className="section-heading">Jadwal Event Terdekat</h2>
          </div>
          {upcomingEvents.map((ev, i) => (
            <EventListItem key={i} ev={ev} />
          ))}
        </div>
      </div>
    </section>
  );
}

function EventListItem({ ev }: { ev: (typeof upcomingEvents)[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        padding: "16px",
        backgroundColor: hovered ? "#ffffff" : "#FAFBFE",
        borderRadius: "16px",
        border: `1px solid ${hovered ? ev.color + "44" : "#E4E8F0"}`,
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: hovered ? "0 8px 32px rgba(13,27,62,0.08)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Date block */}
      <div
        style={{
          width: "60px",
          height: "66px",
          backgroundColor: hovered ? ev.color : "#F1F3F5",
          borderRadius: "12px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "background-color 0.2s ease",
        }}
      >
        <span
          style={{
            fontSize: "10px",
            fontWeight: 700,
            color: hovered ? "rgba(255,255,255,0.7)" : "#8892A4",
            letterSpacing: "0.06em",
            marginBottom: "2px",
            transition: "color 0.2s",
          }}
        >
          {ev.month}
        </span>
        <span
          style={{
            fontFamily: "'Hanken Grotesk', sans-serif",
            fontSize: "24px",
            fontWeight: 900,
            color: hovered ? "#ffffff" : "#1A1D2E",
            lineHeight: 1,
            letterSpacing: "-0.03em",
            transition: "color 0.2s",
          }}
        >
          {ev.day}
        </span>
        <span
          style={{
            fontSize: "9px",
            fontWeight: 600,
            color: hovered ? "rgba(255,255,255,0.6)" : "#ADB5BD",
            marginTop: "1px",
            transition: "color 0.2s",
          }}
        >
          {ev.dayName}
        </span>
      </div>

      {/* Thumbnail */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={ev.img}
        alt={ev.title}
        style={{
          width: "72px",
          height: "66px",
          borderRadius: "10px",
          objectFit: "cover",
          flexShrink: 0,
        }}
      />

      {/* Info */}
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
          <span
            style={{
              backgroundColor: ev.color + "18",
              color: ev.color,
              padding: "2px 8px",
              borderRadius: "100px",
              fontSize: "10px",
              fontWeight: 700,
            }}
          >
            {ev.category}
          </span>
        </div>
        <h4
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "#1A1D2E",
            marginBottom: "4px",
            letterSpacing: "-0.01em",
          }}
        >
          {ev.title}
        </h4>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "12px", color: "#8892A4" }}>
            🕐 {ev.time}
          </span>
          <span style={{ fontSize: "12px", color: "#8892A4" }}>
            📍 {ev.venue}, {ev.city}
          </span>
        </div>
      </div>

      {/* Price + action */}
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <p
          style={{
            fontFamily: "'Hanken Grotesk', sans-serif",
            fontSize: "15px",
            fontWeight: 800,
            color: "#0D1B3E",
            letterSpacing: "-0.02em",
            marginBottom: "6px",
          }}
        >
          {ev.price}
        </p>
        {ev.available ? (
          <button
            style={{
              padding: "6px 16px",
              backgroundColor: hovered ? ev.color : "#EDF2FF",
              color: hovered ? "#fff" : "#3B5BDB",
              border: "none",
              borderRadius: "100px",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            Pesan
          </button>
        ) : (
          <span
            style={{
              padding: "6px 16px",
              backgroundColor: "#FFF5F5",
              color: "#FA5252",
              borderRadius: "100px",
              fontSize: "11px",
              fontWeight: 700,
              display: "inline-block",
            }}
          >
            Habis
          </span>
        )}
      </div>
    </div>
  );
}
