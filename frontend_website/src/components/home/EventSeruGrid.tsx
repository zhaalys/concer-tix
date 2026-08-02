"use client";

import { useState, useEffect } from "react";

const events = [
  {
    id: "ev-1",
    img: "/image_concer/banner_concer_1.png",
    title: "Hillsong Worship Nights Asia Tour 2024",
    price: "Rp 850.000",
    date: "11 Sep 2026",
    organizer: "Live Nation Asia",
    organizerLogo: "/logo/tix_logo.png?v=3",
  },
  {
    id: "ev-2",
    img: "/image_concer/banner_concer_1.png",
    title: "Latihan Pestapora Makassar",
    price: "Rp 225.000",
    date: "26 Jul 2026",
    organizer: "Boss Creator",
    organizerLogo: "/logo/tix_logo.png?v=3",
  },
  {
    id: "ev-3",
    img: "/image_concer/banner_concer_1.png",
    title: "VIXTAPE KONEKT Showcase",
    price: "Rp 125.000",
    date: "25–26 Jul 2026",
    organizer: "VINDES Media",
    organizerLogo: "/logo/tix_logo.png?v=3",
  },
  {
    id: "ev-4",
    img: "/image_concer/banner_concer_1.png",
    title: "Joyland Sessions 2026",
    price: "Rp 588.000",
    date: "Nov 2026",
    organizer: "Plainsong Live",
    organizerLogo: "/logo/tix_logo.png?v=3",
  },
  {
    id: "ev-5",
    img: "/image_concer/banner_concer_1.png",
    title: "Soundrenaline 2026 Jakarta",
    price: "Rp 450.000",
    date: "15 Dec 2026",
    organizer: "Ravel Entertainment",
    organizerLogo: "/logo/tix_logo.png?v=3",
  },
  {
    id: "ev-11",
    img: "/image_concer/banner_concer_1.png",
    title: "Festival Indie Jakarta",
    price: "Rp 180.000",
    date: "1 Aug 2026",
    organizer: "Kompas Event",
    organizerLogo: "/logo/tix_logo.png?v=3",
  },
  {
    id: "ev-7",
    img: "/image_concer/banner_concer_1.png",
    title: "Ancol Aquathlon 2026",
    price: "Rp 250.000",
    date: "23 Aug 2026",
    organizer: "JakLingko",
    organizerLogo: "/logo/tix_logo.png?v=3",
  },
  {
    id: "ev-8",
    img: "/image_concer/banner_concer_1.png",
    title: "Home Sweet Loan The Musical",
    price: "Rp 350.000",
    date: "Every Sat & Sun",
    organizer: "Tix ID",
    organizerLogo: "/logo/tix_logo.png?v=3",
  },
];

function EventCard({ event }: { event: (typeof events)[0] }) {
  const isLongTitle = event.title.length > 24;

  return (
    <div
      onClick={() => window.open(`/event/${event.id}`, "_blank")}
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid #E9ECEF",
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Image area */}
      <div style={{ overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={event.img}
          alt={event.title}
          style={{
            width: "100%",
            aspectRatio: "16/10",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>

      {/* Content */}
      <div style={{ padding: "12px 12px", display: "flex", flexDirection: "column", flex: 1 }}>
        {/* Title */}
        <div style={{ overflow: "hidden", width: "100%", marginBottom: "10px" }}>
          {isLongTitle ? (
            <div
              style={{
                display: "inline-flex",
                whiteSpace: "nowrap",
                animation: "cardTitleTicker 14s linear infinite",
              }}
            >
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: 800,
                  color: "#1A1D2E",
                  paddingRight: "32px",
                  letterSpacing: "-0.01em",
                }}
              >
                {event.title}
              </span>
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: 800,
                  color: "#1A1D2E",
                  paddingRight: "32px",
                  letterSpacing: "-0.01em",
                }}
              >
                {event.title}
              </span>
            </div>
          ) : (
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 800,
                color: "#1A1D2E",
                letterSpacing: "-0.01em",
                margin: 0,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {event.title}
            </h3>
          )}
        </div>

        {/* Date */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "16px", color: "#6C757D", fontVariationSettings: "'FILL' 1" }}
          >
            calendar_month
          </span>
          <span style={{ fontSize: "12px", fontWeight: 600, color: "#6C757D" }}>
            {event.date}
          </span>
        </div>

        {/* Price */}
        <div>
          <p
            style={{
              fontSize: "17px",
              fontWeight: 800,
              color: "#1A1D2E",
              fontFamily: "'Hanken Grotesk', sans-serif",
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            {event.price}
          </p>
        </div>

        {/* Dashed divider */}
        <div
          style={{
            borderTop: "1px dashed #E2E8F0",
            margin: "14px 0 12px",
          }}
        />

        {/* Organizer bottom section */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={event.organizerLogo}
            alt={event.organizer}
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              objectFit: "contain",
              backgroundColor: "#ffffff",
              border: "1px solid #E2E8F0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              display: "block",
            }}
          />
          <span
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#4A5568",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {event.organizer}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function EventSeruGrid() {
  const [gridCols, setGridCols] = useState(4);
  useEffect(() => {
    const updateCols = () => {
      const w = window.innerWidth;
      if (w < 768) setGridCols(2);
      else if (w < 1024) setGridCols(2);
      else setGridCols(4);
    };
    updateCols();
    window.addEventListener("resize", updateCols);
    return () => window.removeEventListener("resize", updateCols);
  }, []);

  const isMobile = gridCols === 2;

  return (
    <section className="event-seru-section">
      <style>{`
        .event-seru-section {
          max-width: 1320px;
          margin: 0 auto;
          padding: 8px 32px 48px;
        }
        @media (max-width: 767px) {
          .event-seru-section {
            padding: 8px 12px 32px !important;
          }
        }
        @keyframes cardTitleTicker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h2 className="section-heading">Top Events For You</h2>
        </div>
        <a
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
          See All
          <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>
            chevron_right
          </span>
        </a>
      </div>

      {/* Responsive Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
          gap: isMobile ? "10px" : "20px",
        }}
      >
        {events.map((ev, i) => (
          <EventCard key={i} event={ev} />
        ))}
      </div>
    </section>
  );
}
