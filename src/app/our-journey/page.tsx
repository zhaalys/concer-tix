import { Navbar, Footer, OurJourneyView } from "@/components";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Journey - Concer TIX",
  description:
    "The story of Concer TIX — from the beginning to becoming Indonesia's leading concert ticketing platform.",
};

export default function OurJourneyPage() {
  return (
    <>
      <Navbar />
      <main style={{ backgroundColor: "#ffffff" }}>
        <OurJourneyView />
      </main>
      <Footer />
    </>
  );
}
