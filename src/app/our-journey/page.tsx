import { Navbar, Footer, OurJourneyView } from "@/components";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Journey - Concer TIX",
  description:
    "Pelajari perjalanan Concer TIX dari tahun ke tahun dalam membangun platform ticketing konser dan festival #1 di Indonesia.",
};

export default function OurJourneyPage() {
  return (
    <>
      <Navbar />
      <main>
        <OurJourneyView />
      </main>
      <Footer />
    </>
  );
}
