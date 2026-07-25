import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PricingView from "../components/PricingView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Biaya & Paket Promotor - Concer TIX",
  description:
    "Skema biaya platform Concer TIX transparan 2.5% + Rp 2.000 per tiket. Event gratis 100% tanpa biaya komisi!",
};

export default function BiayaPage() {
  return (
    <>
      <Navbar />
      <main>
        <PricingView />
      </main>
      <Footer />
    </>
  );
}
