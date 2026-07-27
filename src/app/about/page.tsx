import { Navbar, Footer } from "@/components";
import AboutView from "@/components/about/AboutView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About: Concer TIX",
  description:
    "Learn about Concer TIX, Indonesia's professional ticketing partner for concerts, festivals, and live events.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main style={{ backgroundColor: "#ffffff" }}>
        <AboutView />
      </main>
      <Footer />
    </>
  );
}
