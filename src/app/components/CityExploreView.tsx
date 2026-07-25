"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// Data Kota & Region
export interface CityData {
  id: string;
  name: string;
  region: string;
  img: string;
  banner: string;
  tagline: string;
  eventCount: number;
  popularVenues: string[];
  color: string;
}

export const CITIES_LIST: CityData[] = [
  {
    id: "jabodetabek",
    name: "Jabodetabek",
    region: "DKI Jakarta & Sekitar",
    img: "/image_kota/jabodetabek.png",
    banner: "https://images.unsplash.com/photo-1555899434-94d1368aa7af?auto=format&fit=crop&w=1200&q=80",
    tagline: "Pusat konser megah internasional dan festival terbesar di Indonesia",
    eventCount: 42,
    popularVenues: ["GBK Main Stadium", "Beach City International Stadium", "JIExpo Kemayoran", "Indomilk Arena"],
    color: "#3B5BDB",
  },
  {
    id: "jawa_barat",
    name: "Jawa Barat",
    region: "Bandung, Bogor, Cirebon",
    img: "/image_kota/jawa_barat.png",
    banner: "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&w=1200&q=80",
    tagline: "Rumah bagi musisi indie, festival musik alam, dan konser kreatif",
    eventCount: 28,
    popularVenues: ["Gedung Sate", "Sabuga ITB", "Lapangan Jaswita Bandung", "Bogor Rainfield"],
    color: "#7950F2",
  },
  {
    id: "jawa_tengah",
    name: "Jawa Tengah & DIY",
    region: "Yogyakarta, Semarang, Solo",
    img: "/image_kota/jawa_tengah.png",
    banner: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1200&q=80",
    tagline: "Perpaduan konser musik bernuansa budaya, seni pertunjukan, dan festival unik",
    eventCount: 24,
    popularVenues: ["Candi Prambanan", "De Tjolomadoe Solo", "PRPP Semarang", "JOGJA Expo Center"],
    color: "#1098AD",
  },
  {
    id: "jawa_timur",
    name: "Jawa Timur",
    region: "Surabaya, Malang, Banyuwangi",
    img: "/image_kota/jawa_timur.png",
    banner: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80",
    tagline: "Energi festival musik yang membara dan pertunjukan musik rock hingga pop",
    eventCount: 19,
    popularVenues: ["Grand City Convention Surabaya", "Jatim Park Malang", "Gelora Pancasila", "Lapangan Rampal"],
    color: "#2F9E44",
  },
  {
    id: "bali",
    name: "Bali & Nusa Tenggara",
    region: "Denpasar, Kuta, Ubud, Mataram",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Tanah_Lot_Bali_Indonesia_Pura-Tanah-Lot-01.jpg/320px-Tanah_Lot_Bali_Indonesia_Pura-Tanah-Lot-01.jpg",
    banner: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
    tagline: "Festival musik internasional di tepi pantai dan pertunjukan seni tropis",
    eventCount: 16,
    popularVenues: ["GWK Cultural Park", "Peninsula Island Nusa Dua", "Savaya Bali", "Atlas Beach Fest"],
    color: "#FF6B2C",
  },
  {
    id: "sumatera",
    name: "Sumatera",
    region: "Medan, Palembang, Padang, Lampung",
    img: "/image_kota/sumatera.png",
    banner: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80",
    tagline: "Pesta musik musisi nasional dan konser lintas genre khas pulau Sumatera",
    eventCount: 15,
    popularVenues: ["Lapangan Benteng Medan", "PTC Mall Palembang", "GOR Prayoga Padang", "GSG Unila"],
    color: "#E03131",
  },
  {
    id: "kalimantan",
    name: "Kalimantan",
    region: "Pontianak, Samarinda, Balikpapan, Banjarmasin",
    img: "/image_kota/kalimantan.png",
    banner: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    tagline: "Semarak pertunjukan panggung musik luar ruangan dan tur musisi papan atas",
    eventCount: 12,
    popularVenues: ["BSCC Dome Balikpapan", "Convention Hall Samarinda", "Stadion Sultan Agung", "Pontianak Convention Center"],
    color: "#F59F00",
  },
  {
    id: "indonesia_timur",
    name: "Indonesia Timur",
    region: "Makassar, Manado, Ambon, Jayapura",
    img: "/image_kota/indonesia_timur.png",
    banner: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80",
    tagline: "Gemuruh pertunjukan musik penuh talenta dan tur tur nasional di wilayah timur",
    eventCount: 14,
    popularVenues: ["Celebes Convention Center Makassar", "Karebosi Link", "Lapangan Lapangan Sparta Manado"],
    color: "#1864AB",
  },
];

// Interface Event Data
export interface EventItem {
  id: string;
  title: string;
  cityName: string; // Jabodetabek, Jawa Barat, etc.
  citySlug: string;
  specificLocation: string;
  category: "Konser Musik" | "Festival" | "Seni & Budaya" | "Pop & Rock" | "Indie & Alternative";
  price: string;
  numericPrice: number;
  date: string;
  time: string;
  badge?: string;
  img: string;
  organizer: string;
  organizerLogo: string;
  isHot?: boolean;
}

export const ALL_EVENTS: EventItem[] = [
  {
    id: "ev-1",
    title: "Hillsong Worship Nights Asia Tour 2026",
    cityName: "Jabodetabek",
    citySlug: "jabodetabek",
    specificLocation: "GBK Basketball Hall, Jakarta",
    category: "Konser Musik",
    price: "Rp 850.000",
    numericPrice: 850000,
    date: "11 Sep 2026",
    time: "19:00 WIB",
    badge: "Selling Fast",
    img: "/image_concer/benner_concer_1.png",
    organizer: "Live Nation Asia",
    organizerLogo: "/logo/tix_logo.png?v=3",
    isHot: true,
  },
  {
    id: "ev-2",
    title: "Latihan Pestapora Makassar",
    cityName: "Indonesia Timur",
    citySlug: "indonesia_timur",
    specificLocation: "Celebes Convention Center, Makassar",
    category: "Festival",
    price: "Rp 225.000",
    numericPrice: 225000,
    date: "26 Jul 2026",
    time: "15:00 WITA",
    badge: "Presale 2",
    img: "/image_concer/benner_concer_1.png",
    organizer: "Boss Creator",
    organizerLogo: "/logo/tix_logo.png?v=3",
    isHot: true,
  },
  {
    id: "ev-3",
    title: "VIXTAPE KONEKT Showcase Band",
    cityName: "Jabodetabek",
    citySlug: "jabodetabek",
    specificLocation: "Bengkel Space SCBD, Jakarta",
    category: "Indie & Alternative",
    price: "Rp 125.000",
    numericPrice: 125000,
    date: "25–26 Jul 2026",
    time: "18:30 WIB",
    badge: "Limited Seats",
    img: "/image_concer/benner_concer_1.png",
    organizer: "VINDES Media",
    organizerLogo: "/logo/tix_logo.png?v=3",
  },
  {
    id: "ev-4",
    title: "Joyland Sessions 2026 Bali",
    cityName: "Bali & Nusa Tenggara",
    citySlug: "bali",
    specificLocation: "Peninsula Island Nusa Dua, Bali",
    category: "Festival",
    price: "Rp 588.000",
    numericPrice: 588000,
    date: "14-16 Nov 2026",
    time: "14:00 WITA",
    badge: "Early Bird",
    img: "/image_concer/benner_concer_1.png",
    organizer: "Plainsong Live",
    organizerLogo: "/logo/tix_logo.png?v=3",
    isHot: true,
  },
  {
    id: "ev-5",
    title: "Soundrenaline 2026 Jakarta",
    cityName: "Jabodetabek",
    citySlug: "jabodetabek",
    specificLocation: "Ancol Circuit Carnival, Jakarta",
    category: "Festival",
    price: "Rp 450.000",
    numericPrice: 450000,
    date: "15 Des 2026",
    time: "13:00 WIB",
    badge: "Hot Deal",
    img: "/image_concer/benner_concer_1.png",
    organizer: "Ravel Entertainment",
    organizerLogo: "/logo/tix_logo.png?v=3",
    isHot: true,
  },
  {
    id: "ev-6",
    title: "Bandung Indie Nation Fest 2026",
    cityName: "Jawa Barat",
    citySlug: "jawa_barat",
    specificLocation: "Gedung Sate Open Park, Bandung",
    category: "Indie & Alternative",
    price: "Rp 180.000",
    numericPrice: 180000,
    date: "15 Agus 2026",
    time: "16:00 WIB",
    badge: "Special Event",
    img: "/image_concer/benner_concer_1.png",
    organizer: "Kreatif Bandung",
    organizerLogo: "/logo/tix_logo.png?v=3",
  },
  {
    id: "ev-7",
    title: "Jogja Jazz & Heritage Night",
    cityName: "Jawa Tengah & DIY",
    citySlug: "jawa_tengah",
    specificLocation: "Candi Prambanan Open Stage, Yogyakarta",
    category: "Seni & Budaya",
    price: "Rp 320.000",
    numericPrice: 320000,
    date: "28 Agus 2026",
    time: "19:30 WIB",
    badge: "Official Ticket",
    img: "/image_concer/benner_concer_1.png",
    organizer: "Jogja Cultural Fest",
    organizerLogo: "/logo/tix_logo.png?v=3",
  },
  {
    id: "ev-8",
    title: "Surabaya Pop Sound Wave",
    cityName: "Jawa Timur",
    citySlug: "jawa_timur",
    specificLocation: "Grand City Exhibition Hall, Surabaya",
    category: "Pop & Rock",
    price: "Rp 210.000",
    numericPrice: 210000,
    date: "05 Sep 2026",
    time: "18:00 WIB",
    badge: "New Release",
    img: "/image_concer/benner_concer_1.png",
    organizer: "Surabaya Event Organizer",
    organizerLogo: "/logo/tix_logo.png?v=3",
  },
  {
    id: "ev-9",
    title: "Sumatera Rockfest Palembang",
    cityName: "Sumatera",
    citySlug: "sumatera",
    specificLocation: "PTC Open Stage, Palembang",
    category: "Pop & Rock",
    price: "Rp 195.000",
    numericPrice: 195000,
    date: "19 Sep 2026",
    time: "17:00 WIB",
    badge: "Presale 1",
    img: "/image_concer/benner_concer_1.png",
    organizer: "Palembang Music Fest",
    organizerLogo: "/logo/tix_logo.png?v=3",
  },
  {
    id: "ev-10",
    title: "Borneo Music Tour Balikpapan",
    cityName: "Kalimantan",
    citySlug: "kalimantan",
    specificLocation: "BSCC Dome Balikpapan",
    category: "Konser Musik",
    price: "Rp 260.000",
    numericPrice: 260000,
    date: "03 Okt 2026",
    time: "19:00 WITA",
    badge: "Limited Tickets",
    img: "/image_concer/benner_concer_1.png",
    organizer: "Borneo Live Event",
    organizerLogo: "/logo/tix_logo.png?v=3",
  },
  {
    id: "ev-11",
    title: "Ancol Summer Beach Party",
    cityName: "Jabodetabek",
    citySlug: "jabodetabek",
    specificLocation: "Symphony of the Sea, Ancol, Jakarta",
    category: "Festival",
    price: "Rp 175.000",
    numericPrice: 175000,
    date: "22 Agus 2026",
    time: "15:00 WIB",
    badge: "Trending",
    img: "/image_concer/benner_concer_1.png",
    organizer: "Tix Experience",
    organizerLogo: "/logo/tix_logo.png?v=3",
  },
  {
    id: "ev-12",
    title: "Malang Music Camp 2026",
    cityName: "Jawa Timur",
    citySlug: "jawa_timur",
    specificLocation: "Coban Rondo Outdoor Arena, Malang",
    category: "Indie & Alternative",
    price: "Rp 150.000",
    numericPrice: 150000,
    date: "10 Okt 2026",
    time: "14:00 WIB",
    badge: "Eco Fest",
    img: "/image_concer/benner_concer_1.png",
    organizer: "Malang Creative Community",
    organizerLogo: "/logo/tix_logo.png?v=3",
  },
];

export default function CityExploreViewContent() {
  const searchParams = useSearchParams();
  const initialKota = searchParams.get("kota") || "semua";

  const [selectedCitySlug, setSelectedCitySlug] = useState<string>(initialKota);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [sortBy, setSortBy] = useState<"terpopuler" | "harga_rendah" | "harga_tinggi">("terpopuler");

  // Modal State
  const [activeModalEvent, setActiveModalEvent] = useState<EventItem | null>(null);
  const [ticketQty, setTicketQty] = useState(1);
  const [selectedTier, setSelectedTier] = useState<"Festival" | "CAT 1" | "VIP">("Festival");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Format active city data
  const currentCityObj = useMemo(() => {
    return CITIES_LIST.find((c) => c.id === selectedCitySlug || c.name.toLowerCase() === selectedCitySlug.toLowerCase());
  }, [selectedCitySlug]);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return ALL_EVENTS.filter((ev) => {
      // Filter Kota
      if (selectedCitySlug !== "semua") {
        const matchesSlug = ev.citySlug.toLowerCase() === selectedCitySlug.toLowerCase();
        const matchesName = ev.cityName.toLowerCase() === selectedCitySlug.toLowerCase();
        if (!matchesSlug && !matchesName) return false;
      }

      // Filter Kategori
      if (selectedCategory !== "Semua" && ev.category !== selectedCategory) {
        return false;
      }

      // Filter Search Query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchTitle = ev.title.toLowerCase().includes(q);
        const matchVenue = ev.specificLocation.toLowerCase().includes(q);
        const matchCity = ev.cityName.toLowerCase().includes(q);
        const matchOrganizer = ev.organizer.toLowerCase().includes(q);
        if (!matchTitle && !matchVenue && !matchCity && !matchOrganizer) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "harga_rendah") return a.numericPrice - b.numericPrice;
      if (sortBy === "harga_tinggi") return b.numericPrice - a.numericPrice;
      return (b.isHot ? 1 : 0) - (a.isHot ? 1 : 0);
    });
  }, [selectedCitySlug, selectedCategory, searchQuery, sortBy]);

  // Price calculations for modal
  const tierMultiplier = selectedTier === "VIP" ? 1.8 : selectedTier === "CAT 1" ? 1.35 : 1;
  const unitPrice = activeModalEvent ? Math.round(activeModalEvent.numericPrice * tierMultiplier) : 0;
  const totalPrice = unitPrice * ticketQty;

  const handleCheckout = () => {
    if (!activeModalEvent) return;
    const msg = `Sukses! ${ticketQty}x Tiket (${selectedTier}) untuk ${activeModalEvent.title} ditambahkan ke Keranjang.`;
    setActiveModalEvent(null);
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div style={{ backgroundColor: "#F7F9FB", minHeight: "100vh", paddingBottom: "80px", position: "relative" }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 1000,
            backgroundColor: "#064E3B",
            color: "#ffffff",
            padding: "16px 24px",
            borderRadius: "14px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "14px",
            fontWeight: 600,
            animation: "slideUp 0.3s ease-out",
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "22px", color: "#20C997" }}>
            check_circle
          </span>
          {toastMessage}
        </div>
      )}

      {/* Dynamic Hero Banner */}
      <section
        style={{
          position: "relative",
          backgroundColor: "#0D1B3E",
          backgroundImage: currentCityObj
            ? `linear-gradient(180deg, rgba(13, 27, 62, 0.88) 0%, rgba(13, 27, 62, 0.96) 100%), url(${currentCityObj.banner})`
            : "linear-gradient(135deg, #0D1B3E 0%, #1A2D5A 50%, #064E3B 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#ffffff",
          padding: "56px 32px 48px",
          transition: "background 0.5s ease",
          boxShadow: "inset 0 -20px 40px rgba(0,0,0,0.3)",
        }}
      >
        <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
          {/* Breadcrumb navigation */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              color: "rgba(255,255,255,0.7)",
              marginBottom: "20px",
              fontWeight: 500,
            }}
          >
            <Link href="/" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>
              Beranda
            </Link>
            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
              chevron_right
            </span>
            <span style={{ color: "#1ABC9C", fontWeight: 600 }}>Jelajahi Kota</span>
            {currentCityObj && (
              <>
                <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
                  chevron_right
                </span>
                <span style={{ color: "#ffffff", fontWeight: 700 }}>{currentCityObj.name}</span>
              </>
            )}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: "24px",
            }}
          >
            <div style={{ maxWidth: "720px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: "rgba(26, 188, 156, 0.15)",
                  border: "1px solid rgba(26, 188, 156, 0.4)",
                  padding: "6px 14px",
                  borderRadius: "100px",
                  color: "#1ABC9C",
                  fontSize: "12px",
                  fontWeight: 700,
                  marginBottom: "16px",
                  letterSpacing: "0.03em",
                  textTransform: "uppercase",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                  location_on
                </span>
                {currentCityObj ? currentCityObj.region : "Seluruh Wilayah Indonesia"}
              </div>

              <h1
                style={{
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  fontSize: "40px",
                  fontWeight: 800,
                  lineHeight: "1.15",
                  letterSpacing: "-0.02em",
                  marginBottom: "12px",
                }}
              >
                {currentCityObj ? (
                  <>
                    Jelajahi Event di <span style={{ color: "#1ABC9C" }}>{currentCityObj.name}</span>
                  </>
                ) : (
                  <>
                    Temukan Konser & Event <span style={{ color: "#1ABC9C" }}>Sesuai Kotamu</span>
                  </>
                )}
              </h1>

              <p
                style={{
                  fontSize: "16px",
                  color: "rgba(255,255,255,0.85)",
                  lineHeight: "1.6",
                  marginBottom: "24px",
                }}
              >
                {currentCityObj
                  ? currentCityObj.tagline
                  : "Pilih wilayah atau kota favoritmu di bawah ini untuk melihat ribuan konser musik, festival, dan pertunjukan seni seru terdekat."}
              </p>

              {/* Quick Venue Badges for selected city */}
              {currentCityObj && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>
                    Venue Populer:
                  </span>
                  {currentCityObj.popularVenues.map((venue, idx) => (
                    <span
                      key={idx}
                      style={{
                        backgroundColor: "rgba(255,255,255,0.12)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        padding: "4px 12px",
                        borderRadius: "100px",
                        fontSize: "12px",
                        fontWeight: 500,
                        color: "#E9ECEF",
                      }}
                    >
                      {venue}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Total Event Counter Card */}
            <div
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "20px",
                padding: "20px 28px",
                minWidth: "240px",
                display: "flex",
                alignItems: "center",
                gap: "18px",
              }}
            >
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "16px",
                  backgroundColor: "#1ABC9C",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 20px rgba(26, 188, 156, 0.4)",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "28px", color: "#ffffff" }}>
                  confirmation_number
                </span>
              </div>
              <div>
                <span
                  style={{
                    fontFamily: "'Hanken Grotesk', sans-serif",
                    fontSize: "32px",
                    fontWeight: 800,
                    lineHeight: 1,
                    display: "block",
                    color: "#ffffff",
                  }}
                >
                  {filteredEvents.length}
                </span>
                <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>
                  Event Siap Dipesan
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div style={{ maxWidth: "1320px", margin: "0 auto", padding: "40px 32px" }}>
        {/* City Filter Horizontal Slider / Grid */}
        <section style={{ marginBottom: "40px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <div>
              <h2 className="section-heading" style={{ fontSize: "22px", marginBottom: "4px" }}>
                Pilih Kota / Wilayah
              </h2>
              <p style={{ fontSize: "14px", color: "#5A6072", margin: 0 }}>
                Klik pada salah satu wilayah untuk menyaring event secara instan
              </p>
            </div>

            {selectedCitySlug !== "semua" && (
              <button
                onClick={() => setSelectedCitySlug("semua")}
                style={{
                  backgroundColor: "#E9ECEF",
                  border: "none",
                  color: "#495057",
                  padding: "8px 16px",
                  borderRadius: "100px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#DEE2E6")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#E9ECEF")}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                  restart_alt
                </span>
                Tampilkan Semua Kota
              </button>
            )}
          </div>

          {/* Region Buttons */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              gap: "16px",
            }}
          >
            {/* "Semua Kota" Button */}
            <div
              onClick={() => setSelectedCitySlug("semua")}
              style={{
                backgroundColor: selectedCitySlug === "semua" ? "#1ABC9C" : "#ffffff",
                color: selectedCitySlug === "semua" ? "#ffffff" : "#1A1D2E",
                borderRadius: "16px",
                padding: "16px",
                cursor: "pointer",
                border: selectedCitySlug === "semua" ? "2px solid #1ABC9C" : "1px solid #E4E8F0",
                boxShadow: selectedCitySlug === "semua" ? "0 10px 24px rgba(26, 188, 156, 0.25)" : "0 2px 8px rgba(0,0,0,0.03)",
                textAlign: "center",
                transition: "all 0.25s ease",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "115px",
              }}
            >
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "12px",
                  backgroundColor: selectedCitySlug === "semua" ? "rgba(255,255,255,0.2)" : "#F1F3F5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "8px",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "24px", color: selectedCitySlug === "semua" ? "#ffffff" : "#1ABC9C" }}>
                  public
                </span>
              </div>
              <span style={{ fontSize: "14px", fontWeight: 700, display: "block" }}>Semua Kota</span>
              <span style={{ fontSize: "11px", opacity: 0.8, marginTop: "2px" }}>{ALL_EVENTS.length} Event</span>
            </div>

            {/* Individual Cities */}
            {CITIES_LIST.map((city) => {
              const isSelected = selectedCitySlug === city.id || selectedCitySlug.toLowerCase() === city.name.toLowerCase();

              return (
                <div
                  key={city.id}
                  onClick={() => setSelectedCitySlug(city.id)}
                  style={{
                    position: "relative",
                    borderRadius: "16px",
                    overflow: "hidden",
                    cursor: "pointer",
                    border: isSelected ? `2px solid ${city.color}` : "1px solid #E4E8F0",
                    boxShadow: isSelected ? `0 10px 24px ${city.color}33` : "0 2px 8px rgba(0,0,0,0.03)",
                    transition: "all 0.25s ease",
                    transform: isSelected ? "translateY(-4px)" : "none",
                    height: "115px",
                  }}
                >
                  {/* Image Background */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={city.img}
                    alt={city.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      filter: isSelected ? "brightness(0.75)" : "brightness(0.65)",
                    }}
                  />

                  {/* Gradient Overlay */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: `linear-gradient(180deg, rgba(0,0,0,0.1) 0%, ${city.color}CC 100%)`,
                      opacity: isSelected ? 0.95 : 0.7,
                      transition: "opacity 0.2s ease",
                    }}
                  />

                  {/* Content */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      padding: "12px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      color: "#ffffff",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <span
                        style={{
                          backgroundColor: "rgba(0,0,0,0.4)",
                          backdropFilter: "blur(4px)",
                          padding: "2px 8px",
                          borderRadius: "100px",
                          fontSize: "10px",
                          fontWeight: 700,
                        }}
                      >
                        {city.eventCount}+ Event
                      </span>
                    </div>

                    <div>
                      <h4
                        style={{
                          fontFamily: "'Hanken Grotesk', sans-serif",
                          fontSize: "14px",
                          fontWeight: 800,
                          margin: 0,
                          lineHeight: "1.2",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {city.name}
                      </h4>
                      <p style={{ fontSize: "10px", margin: 0, opacity: 0.85, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {city.region}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Filter Toolbar (Search, Category Filter, Sorting) */}
        <section
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "20px",
            padding: "24px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
            border: "1px solid #E4E8F0",
            marginBottom: "32px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Top row: Search Bar & Sort selector */}
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
              {/* Search Bar */}
              <div
                style={{
                  position: "relative",
                  flex: 1,
                  minWidth: "280px",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    position: "absolute",
                    left: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#868E96",
                    fontSize: "20px",
                  }}
                >
                  search
                </span>
                <input
                  type="text"
                  placeholder="Cari konser, festival, atau nama venue di kotamu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    height: "46px",
                    paddingLeft: "48px",
                    paddingRight: searchQuery ? "40px" : "16px",
                    borderRadius: "12px",
                    border: "1.5px solid #DEE2E6",
                    fontSize: "14px",
                    outline: "none",
                    backgroundColor: "#F8F9FA",
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#1ABC9C";
                    e.currentTarget.style.backgroundColor = "#ffffff";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#DEE2E6";
                    e.currentTarget.style.backgroundColor = "#F8F9FA";
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    style={{
                      position: "absolute",
                      right: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: "#868E96",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                      close
                    </span>
                  </button>
                )}
              </div>

              {/* Sorting options */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#5A6072", whiteSpace: "nowrap" }}>
                  Urutkan:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  style={{
                    height: "44px",
                    padding: "0 16px",
                    borderRadius: "12px",
                    border: "1.5px solid #DEE2E6",
                    backgroundColor: "#ffffff",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#1A1D2E",
                    cursor: "pointer",
                    outline: "none",
                  }}
                >
                  <option value="terpopuler">Terpopuler & Hot Deal</option>
                  <option value="harga_rendah">Harga: Terendah ke Tertinggi</option>
                  <option value="harga_tinggi">Harga: Tertinggi ke Terendah</option>
                </select>
              </div>
            </div>

            {/* Bottom row: Category Filter Pills */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", overflowX: "auto", paddingBottom: "4px" }} className="hide-scrollbar">
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#5A6072", whiteSpace: "nowrap", marginRight: "4px" }}>
                Kategori:
              </span>
              {["Semua", "Konser Musik", "Festival", "Seni & Budaya", "Pop & Rock", "Indie & Alternative"].map((cat) => {
                const isActive = selectedCategory === cat;

                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: "8px 18px",
                      borderRadius: "100px",
                      fontSize: "13px",
                      fontWeight: 600,
                      border: isActive ? "none" : "1px solid #DEE2E6",
                      backgroundColor: isActive ? "#1ABC9C" : "#ffffff",
                      color: isActive ? "#ffffff" : "#495057",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      transition: "all 0.2s ease",
                      boxShadow: isActive ? "0 4px 12px rgba(26,188,156,0.3)" : "none",
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Event List Section */}
        <section>
          {/* Header info */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
            <div>
              <h3 className="section-heading" style={{ fontSize: "20px" }}>
                {selectedCitySlug === "semua" ? "Daftar Semua Event di Indonesia" : `Event di ${currentCityObj?.name || selectedCitySlug}`}
              </h3>
              <p style={{ fontSize: "13px", color: "#5A6072", margin: 0 }}>
                Menampilkan {filteredEvents.length} event pilihan
              </p>
            </div>
          </div>

          {/* Event Cards Grid */}
          {filteredEvents.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "24px",
              }}
            >
              {filteredEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="card-hover"
                  onClick={() => {
                    setActiveModalEvent(ev);
                    setTicketQty(1);
                    setSelectedTier("Festival");
                  }}
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "18px",
                    overflow: "hidden",
                    border: "1px solid #E9ECEF",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    cursor: "pointer",
                  }}
                >
                  {/* Top Badge */}
                  {ev.badge && (
                    <span
                      style={{
                        position: "absolute",
                        top: "14px",
                        left: "14px",
                        zIndex: 2,
                        backgroundColor: "#1ABC9C",
                        color: "#ffffff",
                        padding: "4px 12px",
                        borderRadius: "100px",
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: "0.02em",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      }}
                    >
                      {ev.badge}
                    </span>
                  )}

                  {/* Image container */}
                  <div style={{ position: "relative", height: "170px", overflow: "hidden" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={ev.img}
                      alt={ev.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: "10px",
                        right: "12px",
                        backgroundColor: "rgba(13, 27, 62, 0.8)",
                        backdropFilter: "blur(6px)",
                        color: "#ffffff",
                        padding: "3px 10px",
                        borderRadius: "8px",
                        fontSize: "11px",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: "14px", color: "#FFD43B" }}>
                        star
                      </span>
                      {ev.category}
                    </div>
                  </div>

                  {/* Body content */}
                  <div style={{ padding: "18px", display: "flex", flexDirection: "column", flex: 1 }}>
                    {/* Location Badge */}
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "8px" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "15px", color: "#1ABC9C" }}>
                        location_on
                      </span>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "#1ABC9C" }}>
                        {ev.specificLocation}
                      </span>
                    </div>

                    {/* Title */}
                    <h4
                      style={{
                        fontFamily: "'Hanken Grotesk', sans-serif",
                        fontSize: "16px",
                        fontWeight: 800,
                        color: "#1A1D2E",
                        marginBottom: "12px",
                        lineHeight: "1.35",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {ev.title}
                    </h4>

                    {/* Date and Time */}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "16px" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#868E96" }}>
                        calendar_month
                      </span>
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "#5A6072" }}>
                        {ev.date} • {ev.time}
                      </span>
                    </div>

                    <div style={{ marginTop: "auto" }}>
                      {/* Dashed divider */}
                      <div style={{ borderTop: "1px dashed #E2E8F0", marginBottom: "14px" }} />

                      {/* Footer price & CTA button */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                          <span style={{ fontSize: "11px", color: "#8892A4", display: "block", fontWeight: 500 }}>
                            Mulai dari
                          </span>
                          <span
                            style={{
                              fontFamily: "'Hanken Grotesk', sans-serif",
                              fontSize: "17px",
                              fontWeight: 800,
                              color: "#1A1D2E",
                            }}
                          >
                            {ev.price}
                          </span>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveModalEvent(ev);
                            setTicketQty(1);
                            setSelectedTier("Festival");
                          }}
                          style={{
                            backgroundColor: "#1ABC9C",
                            color: "#ffffff",
                            border: "none",
                            padding: "9px 18px",
                            borderRadius: "100px",
                            fontSize: "12px",
                            fontWeight: 700,
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#16A085")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1ABC9C")}
                        >
                          Beli Tiket
                          <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
                            arrow_forward
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "20px",
                padding: "60px 32px",
                textAlign: "center",
                border: "1px solid #E4E8F0",
                maxWidth: "600px",
                margin: "40px auto",
              }}
            >
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  backgroundColor: "#FFF9DB",
                  color: "#F59F00",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "36px" }}>
                  search_off
                </span>
              </div>
              <h4 style={{ fontSize: "18px", fontWeight: 800, color: "#1A1D2E", marginBottom: "8px" }}>
                Tidak Ada Event Ditemukan
              </h4>
              <p style={{ fontSize: "14px", color: "#5A6072", marginBottom: "24px", lineHeight: "1.5" }}>
                Maaf, belum ada event yang cocok dengan kriteria pencarian atau kategori yang Anda pilih untuk wilayah ini.
              </p>
              <button
                onClick={() => {
                  setSelectedCitySlug("semua");
                  setSelectedCategory("Semua");
                  setSearchQuery("");
                }}
                style={{
                  backgroundColor: "#1ABC9C",
                  color: "#ffffff",
                  border: "none",
                  padding: "10px 24px",
                  borderRadius: "100px",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Reset Semua Filter
              </button>
            </div>
          )}
        </section>
      </div>

      {/* Ticket Selection Modal */}
      {activeModalEvent && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999,
            backgroundColor: "rgba(13, 27, 62, 0.65)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setActiveModalEvent(null)}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "24px",
              maxWidth: "560px",
              width: "100%",
              overflow: "hidden",
              boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
              animation: "modalFadeIn 0.25s ease-out",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Image */}
            <div style={{ position: "relative", height: "180px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeModalEvent.img}
                alt={activeModalEvent.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%)",
                }}
              />
              <button
                onClick={() => setActiveModalEvent(null)}
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  color: "#ffffff",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                  close
                </span>
              </button>

              <div style={{ position: "absolute", bottom: "16px", left: "20px", right: "20px", color: "#ffffff" }}>
                <span
                  style={{
                    backgroundColor: "#1ABC9C",
                    padding: "3px 10px",
                    borderRadius: "100px",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                  }}
                >
                  {activeModalEvent.category}
                </span>
                <h3
                  style={{
                    fontFamily: "'Hanken Grotesk', sans-serif",
                    fontSize: "20px",
                    fontWeight: 800,
                    marginTop: "6px",
                    lineHeight: "1.25",
                  }}
                >
                  {activeModalEvent.title}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "24px" }}>
              {/* Venue & Time info */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className="material-symbols-outlined" style={{ color: "#1ABC9C", fontSize: "18px" }}>
                    location_on
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#1A1D2E" }}>
                    {activeModalEvent.specificLocation} ({activeModalEvent.cityName})
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className="material-symbols-outlined" style={{ color: "#868E96", fontSize: "18px" }}>
                    calendar_month
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: 500, color: "#5A6072" }}>
                    {activeModalEvent.date} • {activeModalEvent.time}
                  </span>
                </div>
              </div>

              {/* Tier Selection */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ fontSize: "13px", fontWeight: 700, color: "#1A1D2E", display: "block", marginBottom: "10px" }}>
                  Pilih Tipe Tiket:
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                  {(["Festival", "CAT 1", "VIP"] as const).map((tier) => {
                    const isSelected = selectedTier === tier;
                    const mult = tier === "VIP" ? 1.8 : tier === "CAT 1" ? 1.35 : 1;
                    const priceVal = Math.round(activeModalEvent.numericPrice * mult);

                    return (
                      <button
                        key={tier}
                        onClick={() => setSelectedTier(tier)}
                        style={{
                          padding: "12px 10px",
                          borderRadius: "14px",
                          border: isSelected ? "2px solid #1ABC9C" : "1.5px solid #E9ECEF",
                          backgroundColor: isSelected ? "rgba(26,188,156,0.06)" : "#ffffff",
                          textAlign: "center",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <span style={{ fontSize: "13px", fontWeight: 700, color: isSelected ? "#1ABC9C" : "#1A1D2E", display: "block" }}>
                          {tier}
                        </span>
                        <span style={{ fontSize: "11px", color: "#5A6072", marginTop: "2px", display: "block" }}>
                          Rp {priceVal.toLocaleString("id-ID")}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Picker */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#1A1D2E" }}>Jumlah Tiket:</span>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <button
                    onClick={() => setTicketQty((q) => Math.max(1, q - 1))}
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "50%",
                      border: "1.5px solid #DEE2E6",
                      backgroundColor: "#F8F9FA",
                      fontSize: "16px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    -
                  </button>
                  <span style={{ fontSize: "16px", fontWeight: 800, color: "#1A1D2E", minWidth: "20px", textAlign: "center" }}>
                    {ticketQty}
                  </span>
                  <button
                    onClick={() => setTicketQty((q) => Math.min(5, q + 1))}
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "50%",
                      border: "1.5px solid #DEE2E6",
                      backgroundColor: "#F8F9FA",
                      fontSize: "16px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Divider & Total */}
              <div style={{ borderTop: "1px dashed #E2E8F0", paddingTop: "16px", marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <span style={{ fontSize: "12px", color: "#8892A4", display: "block" }}>Total Pembayaran:</span>
                  <span
                    style={{
                      fontFamily: "'Hanken Grotesk', sans-serif",
                      fontSize: "22px",
                      fontWeight: 800,
                      color: "#1ABC9C",
                    }}
                  >
                    Rp {totalPrice.toLocaleString("id-ID")}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  style={{
                    backgroundColor: "#1ABC9C",
                    color: "#ffffff",
                    border: "none",
                    padding: "12px 28px",
                    borderRadius: "100px",
                    fontSize: "14px",
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "0 6px 18px rgba(26,188,156,0.35)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#16A085")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1ABC9C")}
                >
                  Lanjut Pembayaran
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
