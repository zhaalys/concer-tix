import { Navbar, Footer, WristbandView } from "@/components";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wristband Ticket - Concer TIX",
  description: "Wristband tickets for events and festivals by Concer TIX.",
};

export default function TiketGelangPage() {
  return (
    <>
      <Navbar />
      <main style={{ backgroundColor: "#ffffff" }}>
        <WristbandView />
      </main>
      <Footer />
    </>
  );
}
