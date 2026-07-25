import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import OurJourneyView from "../components/OurJourneyView";
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
