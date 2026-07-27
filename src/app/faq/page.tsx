import { Navbar, Footer, FAQView } from "@/components";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ - Concer TIX",
  description: "Frequently asked questions about Concer TIX tickets, wristbands, and events.",
};

export default function FAQPage() {
  return (
    <>
      <Navbar />
      <main>
        <FAQView />
      </main>
      <Footer />
    </>
  );
}
