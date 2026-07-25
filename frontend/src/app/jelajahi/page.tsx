import { Suspense } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CityExploreViewContent from "../components/CityExploreView";

export const metadata = {
  title: "Jelajahi Event Sesuai Kota - Concer TIX",
  description:
    "Cari dan temukan tiket konser musik, festival, dan pertunjukan seni terbaik sesuai dengan kota atau wilayah pilihanmu di Indonesia.",
};

export default function JelajahiKotaPage() {
  return (
    <>
      <Navbar />
      <main>
        <Suspense
          fallback={
            <div style={{ backgroundColor: "#F7F9FB", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ textAlign: "center", color: "#5A6072" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "40px", color: "#1ABC9C", animation: "spin 1s linear infinite" }}>
                  sync
                </span>
                <p style={{ marginTop: "12px", fontSize: "14px", fontWeight: 600 }}>Memuat Halaman Jelajahi Kota...</p>
              </div>
            </div>
          }
        >
          <CityExploreViewContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
