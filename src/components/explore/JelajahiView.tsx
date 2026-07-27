"use client";

import { useState, useMemo } from "react";

const CATEGORIES = ["Semua", "Konser Musik", "Festival", "Seni & Budaya", "Pop & Rock", "Indie & Alternative"];

const CITIES = [
  { id: "semua", name: "Semua Kota" },
  { id: "jabodetabek", name: "Jabodetabek" },
  { id: "jawa_barat", name: "Jawa Barat" },
  { id: "jawa_tengah", name: "Jawa Tengah & DIY" },
  { id: "jawa_timur", name: "Jawa Timur" },
  { id: "bali", name: "Bali" },
  { id: "sumatera", name: "Sumatera" },
  { id: "kalimantan", name: "Kalimantan" },
  { id: "indonesia_timur", name: "Indonesia Timur" },
];

const ALL_EVENTS = [
  { id: "ev-1", title: "Hillsong Worship Nights Asia Tour 2026", city: "jabodetabek", cityLabel: "Jabodetabek", location: "GBK Basketball Hall, Jakarta", category: "Konser Musik", price: "Rp 850.000", numericPrice: 850000, date: "11 Sep 2026", img: "/image_concer/banner_concer_1.png", organizer: "Live Nation Asia", isHot: true },
  { id: "ev-2", title: "Latihan Pestapora Makassar", city: "indonesia_timur", cityLabel: "Indonesia Timur", location: "Celebes Convention Center", category: "Festival", price: "Rp 225.000", numericPrice: 225000, date: "26 Jul 2026", img: "/image_concer/banner_concer_1.png", organizer: "Boss Creator", isHot: true },
  { id: "ev-3", title: "VIXTAPE KONEKT Showcase Band", city: "jabodetabek", cityLabel: "Jabodetabek", location: "Bengkel Space SCBD, Jakarta", category: "Indie & Alternative", price: "Rp 125.000", numericPrice: 125000, date: "25–26 Jul 2026", img: "/image_concer/banner_concer_1.png", organizer: "VINDES Media", isHot: false },
  { id: "ev-4", title: "Joyland Sessions 2026 Bali", city: "bali", cityLabel: "Bali", location: "Peninsula Island Nusa Dua", category: "Festival", price: "Rp 588.000", numericPrice: 588000, date: "14-16 Nov 2026", img: "/image_concer/banner_concer_1.png", organizer: "Plainsong Live", isHot: true },
  { id: "ev-5", title: "Soundrenaline 2026 Jakarta", city: "jabodetabek", cityLabel: "Jabodetabek", location: "Ancol Circuit Carnival", category: "Festival", price: "Rp 450.000", numericPrice: 450000, date: "15 Des 2026", img: "/image_concer/banner_concer_1.png", organizer: "Ravel Entertainment", isHot: true },
  { id: "ev-6", title: "Bandung Indie Nation Fest 2026", city: "jawa_barat", cityLabel: "Jawa Barat", location: "Gedung Sate Open Park, Bandung", category: "Indie & Alternative", price: "Rp 180.000", numericPrice: 180000, date: "15 Agus 2026", img: "/image_concer/banner_concer_1.png", organizer: "Kreatif Bandung", isHot: false },
  { id: "ev-7", title: "Jogja Jazz & Heritage Night", city: "jawa_tengah", cityLabel: "Jawa Tengah & DIY", location: "Candi Prambanan, Yogyakarta", category: "Seni & Budaya", price: "Rp 320.000", numericPrice: 320000, date: "28 Agus 2026", img: "/image_concer/banner_concer_1.png", organizer: "Jogja Cultural Fest", isHot: false },
  { id: "ev-8", title: "Surabaya Pop Sound Wave", city: "jawa_timur", cityLabel: "Jawa Timur", location: "Grand City Exhibition Hall", category: "Pop & Rock", price: "Rp 210.000", numericPrice: 210000, date: "05 Sep 2026", img: "/image_concer/banner_concer_1.png", organizer: "Surabaya Event Org", isHot: false },
  { id: "ev-9", title: "Sumatera Rockfest Palembang", city: "sumatera", cityLabel: "Sumatera", location: "PTC Open Stage, Palembang", category: "Pop & Rock", price: "Rp 195.000", numericPrice: 195000, date: "19 Sep 2026", img: "/image_concer/banner_concer_1.png", organizer: "Palembang Music Fest", isHot: false },
  { id: "ev-10", title: "Borneo Music Tour Balikpapan", city: "kalimantan", cityLabel: "Kalimantan", location: "BSCC Dome Balikpapan", category: "Konser Musik", price: "Rp 260.000", numericPrice: 260000, date: "03 Okt 2026", img: "/image_concer/banner_concer_1.png", organizer: "Borneo Live Event", isHot: false },
  { id: "ev-11", title: "Ancol Summer Beach Party", city: "jabodetabek", cityLabel: "Jabodetabek", location: "Symphony of the Sea, Ancol", category: "Festival", price: "Rp 175.000", numericPrice: 175000, date: "22 Agus 2026", img: "/image_concer/banner_concer_1.png", organizer: "Tix Experience", isHot: true },
  { id: "ev-12", title: "Malang Music Camp 2026", city: "jawa_timur", cityLabel: "Jawa Timur", location: "Coban Rondo Outdoor Arena", category: "Indie & Alternative", price: "Rp 150.000", numericPrice: 150000, date: "10 Okt 2026", img: "/image_concer/banner_concer_1.png", organizer: "Malang Creative", isHot: false },
];

type EventItem = typeof ALL_EVENTS[0] & { badge?: string };

function EventCard({ event }: { event: EventItem }) {
  const isLongTitle = event.title.length > 28;

  return (
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
  );
}

export default function JelajahiView() {
  const [selectedCity, setSelectedCity] = useState("semua");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"terpopuler" | "harga_rendah" | "harga_tinggi">("terpopuler");

  const filteredEvents = useMemo(() => {
    return ALL_EVENTS.filter((ev) => {
      if (selectedCity !== "semua" && ev.city !== selectedCity) return false;
      if (selectedCategory !== "Semua" && ev.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
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
      if (sortBy === "harga_rendah") return a.numericPrice - b.numericPrice;
      if (sortBy === "harga_tinggi") return b.numericPrice - a.numericPrice;
      return (b.isHot ? 1 : 0) - (a.isHot ? 1 : 0);
    });
  }, [selectedCity, selectedCategory, searchQuery, sortBy]);

  return (
    <div style={{ backgroundColor: "#F4F6FB", minHeight: "100vh" }}>
      <style>{`
        @keyframes cardTitleTicker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <div style={{ maxWidth: "1320px", margin: "0 auto", padding: "40px 32px 80px" }}>



        <section style={{ marginBottom: "28px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#F4F6FB",
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
              <option value="terpopuler">Urutkan: Terpopuler</option>
              <option value="harga_rendah">Urutkan: Harga Terendah</option>
              <option value="harga_tinggi">Urutkan: Harga Tertinggi</option>
            </select>
          </div>
        </section>

        <section>
          {filteredEvents.length === 0 ? (
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "20px",
                border: "1px solid #E9ECEF",
                padding: "64px 32px",
                textAlign: "center",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#CED4DA", display: "block", marginBottom: "16px" }}>
                search_off
              </span>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#1A1D2E", marginBottom: "8px" }}>Tidak ada event ditemukan</h3>
              <p style={{ fontSize: "14px", color: "#5A6072" }}>Coba ubah filter atau kata kunci pencarian</p>
              <button
                onClick={() => {
                  setSelectedCity("semua");
                  setSelectedCategory("Semua");
                  setSearchQuery("");
                }}
                style={{
                  marginTop: "20px",
                  padding: "10px 24px",
                  backgroundColor: "#1ABC9C",
                  color: "#ffffff",
                  borderRadius: "10px",
                  border: "none",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Reset Filter
              </button>
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
