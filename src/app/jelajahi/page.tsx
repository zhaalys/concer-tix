import { Navbar, Footer, JelajahiView } from "@/components";
import { Suspense } from "react";

export const metadata = {
  title: "Jelajahi Event Sesuai Kota - Concer TIX",
  description: "Cari dan temukan tiket konser musik, festival, dan pertunjukan seni terbaik sesuai kota pilihanmu di Indonesia.",
};

export default function JelajahiPage() {
  return (
    <>
      <Navbar />
      <main>
        <Suspense fallback={<div style={{ minHeight: "100vh", backgroundColor: "#F4F6FB" }} />}>
          <JelajahiView />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
