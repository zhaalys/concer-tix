"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { usePublicEvents } from "@/lib/usePublicEvents";
import type { EventData } from "@/lib/eventsData";

const CATEGORIES = ["All", "Music Concert", "Festival", "Arts & Culture", "Pop & Rock", "Indie & Alternative"];

const CITIES = [
  { id: "semua", name: "All Cities", img: null, label: "" },
  { id: "jabodetabek", name: "Jabodetabek", img: "/image_kota/jabodetabek.png", label: "DKI Jakarta & Sekitar" },
  { id: "jawa_barat", name: "West Java", img: "/image_kota/jawa_barat.png", label: "Bandung, Bogor, Cirebon" },
  { id: "jawa_tengah", name: "Central Java & DIY", img: "/image_kota/jawa_tengah.png", label: "Yogyakarta, Semarang, Solo" },
  { id: "jawa_timur", name: "East Java", img: "/image_kota/jawa_timur.png", label: "Surabaya, Malang, Banyuwangi" },
  { id: "bali", name: "Bali", img: null, label: "Denpasar, Kuta, Ubud" },
  { id: "sumatera", name: "Sumatera", img: "/image_kota/sumatera.png", label: "Medan, Palembang, Padang" },
  { id: "kalimantan", name: "Kalimantan", img: "/image_kota/kalimantan.png", label: "Balikpapan, Samarinda, Pontianak" },
  { id: "indonesia_timur", name: "Eastern Indonesia", img: "/image_kota/indonesia_timur.png", label: "Makassar, Manado, Ambon" },
];

type EventItem = EventData & { badge?: string };

function EventCard({ event }: { event: EventItem }) {
  const isLongTitle = event.title.length > 28;

  return (
    <Link
      href={`/event/${event.id}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: "none" }}
    >
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid #E9ECEF",
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ position: "relative", overflow: "hidden" }}>
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
        {event.badge && (
          <span
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              backgroundColor: event.isHot ? "#1ABC9C" : "#1A1D2E",
              color: "#ffffff",
              fontSize: "10px",
              fontWeight: 700,
              padding: "3px 10px",
              borderRadius: "100px",
              letterSpacing: "0.03em",
              textTransform: "uppercase",
            }}
          >
            {event.badge}
          </span>
        )}
      </div>

      <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ overflow: "hidden", width: "100%", marginBottom: "10px" }}>
          {isLongTitle ? (
            <div
              style={{
                display: "inline-flex",
                whiteSpace: "nowrap",
                animation: "cardTitleTicker 14s linear infinite",
              }}
            >
              <span style={{ fontSize: "15px", fontWeight: 800, color: "#1A1D2E", paddingRight: "32px", letterSpacing: "-0.01em" }}>
                {event.title}
              </span>
              <span style={{ fontSize: "15px", fontWeight: 800, color: "#1A1D2E", paddingRight: "32px", letterSpacing: "-0.01em" }}>
                {event.title}
              </span>
            </div>
          ) : (
            <h3
              style={{
                fontSize: "15px",
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

        <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "10px" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "14px", color: "#6C757D", fontVariationSettings: "'FILL' 1" }}>
            calendar_month
          </span>
          <span style={{ fontSize: "12px", fontWeight: 600, color: "#6C757D" }}>{event.date}</span>
        </div>

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

        <div style={{ borderTop: "1px dashed #E2E8F0", margin: "14px 0 12px" }} />

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={event.organizer === "Live Nation Asia" ? "/logo/tix_logo.png?v=3" : "/logo/tix_logo.png?v=3"}
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
    </Link>
  );
}

export default function JelajahiView() {
  const searchParams = useSearchParams();
  const { events, loading } = usePublicEvents();
  const kotaParam = searchParams.get("kota") || "";
  const genreParam = searchParams.get("genre") || "";
  const categoryParam = searchParams.get("category") || "";
  const queryParam = searchParams.get("q") || "";

  const resolveInitialCity = () => {
    if (!kotaParam) return "semua";
    const lower = kotaParam.toLowerCase();
    const match = CITIES.find(
      (c) => c.id === lower || c.name.toLowerCase() === lower ||
        (lower === "jabodetabek" && c.id === "jabodetabek") ||
        (lower === "jawa barat" && c.id === "jawa_barat") ||
        (lower === "jawa tengah" && c.id === "jawa_tengah") ||
        (lower === "jawa timur" && c.id === "jawa_timur") ||
        (lower === "sumatera" && c.id === "sumatera") ||
        (lower === "kalimantan" && c.id === "kalimantan") ||
        (lower === "indonesia timur" && c.id === "indonesia_timur")
    );
    return match ? match.id : "semua";
  };

  const [selectedCity, setSelectedCity] = useState(resolveInitialCity);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "All");
  const [sortBy, setSortBy] = useState<"popular" | "price_low" | "price_high">("popular");

  const currentCityData = useMemo(() => CITIES.find((c) => c.id === selectedCity) ?? CITIES[0], [selectedCity]);

  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      if (selectedCity !== "semua" && ev.city !== selectedCity) return false;
      if (selectedCategory !== "All" && ev.category !== selectedCategory) return false;
      if (queryParam.trim()) {
        const q = queryParam.toLowerCase();
        if (
          !ev.title.toLowerCase().includes(q) &&
          !ev.location.toLowerCase().includes(q) &&
          !ev.cityLabel.toLowerCase().includes(q) &&
          !ev.organizer.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "price_low") return a.numericPrice - b.numericPrice;
      if (sortBy === "price_high") return b.numericPrice - a.numericPrice;
      return (b.isHot ? 1 : 0) - (a.isHot ? 1 : 0);
    });
  }, [selectedCity, selectedCategory, queryParam, sortBy, events]);

  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>
      <style>{`
        @keyframes cardTitleTicker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <div style={{ maxWidth: "1320px", margin: "0 auto", padding: "40px 32px 80px" }}>

        {/* City Header — tampil kalau ada kota dipilih */}
        {selectedCity !== "semua" && currentCityData && (
          <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "32px", padding: "20px 0" }}>
            {currentCityData.img && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentCityData.img}
                alt={currentCityData.name}
                style={{
                  width: "120px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  flexShrink: 0,
                }}
              />
            )}
            <div>
              <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#1A1D2E", letterSpacing: "-0.02em", margin: 0 }}>
                {currentCityData.name}
              </h1>
              {currentCityData.label && (
                <p style={{ fontSize: "13px", color: "#868E96", margin: "4px 0 0", fontWeight: 500 }}>
                  {currentCityData.label}
                </p>
              )}
            </div>
          </div>
        )}
        <section style={{ marginBottom: "28px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#ffffff",
              padding: "10px 0",
            }}
          >
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                borderRadius: "8px",
                border: "1.5px solid #E4E8F0",
                backgroundColor: "#ffffff",
                color: "#1A1D2E",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                filter_list
              </span>
              Filter
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                border: "1.5px solid #E4E8F0",
                backgroundColor: "#ffffff",
                color: "#1A1D2E",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="popular">Sort: Most Popular</option>
              <option value="price_low">Sort: Lowest Price</option>
              <option value="price_high">Sort: Highest Price</option>
            </select>
          </div>
        </section>

        <section>
          {loading && events.length === 0 ? (
            <div style={{ padding: "80px 32px", textAlign: "center" }}>
              <p style={{ fontSize: "15px", fontWeight: 500, color: "#868E96", margin: 0 }}>Memuat event...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div
              style={{
                padding: "80px 32px",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: "15px", fontWeight: 500, color: "#868E96", margin: 0 }}>No results</p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "24px",
              }}
            >
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
