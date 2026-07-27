import { Navbar, Footer, JelajahiView } from "@/components";
import { Suspense } from "react";

export const metadata = {
  title: "Explore Events by City - Concer TIX",
  description: "Find the best concert, festival, and arts event tickets by city across Indonesia.",
};

export default function ExplorePage() {
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
