import { Navbar, Footer } from "@/components";
import CheckoutView from "@/components/event/CheckoutView";
import { ALL_EVENTS } from "@/lib/eventsData";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = ALL_EVENTS.find((e) => e.id === id);
  if (!event) return { title: "Checkout - Concer TIX" };
  return { title: `Checkout: ${event.title} - Concer TIX` };
}

export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = ALL_EVENTS.find((e) => e.id === id);
  if (!event) notFound();

  return (
    <>
      <Navbar />
      <main>
        <CheckoutView event={event} />
      </main>
      <Footer />
    </>
  );
}
