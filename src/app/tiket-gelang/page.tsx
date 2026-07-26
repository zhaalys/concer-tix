import { Navbar, Footer, WristbandView } from "@/components";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tiket Gelang Event & Festival - Concer TIX",
  description:
    "Cetak tiket gelang kustom berkualitas tinggi (Synthetic Tyvek, Woven Fabric, Vinyl Snap) terintegrasi 100% dengan aplikasi gate scanner Concer TIX.",
};

export default function TiketGelangPage() {
  return (
    <>
      <Navbar />
      <main>
        <WristbandView />
      </main>
      <Footer />
    </>
  );
}
