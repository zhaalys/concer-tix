import { Navbar, Footer } from "@/components";
import CheckoutView from "@/components/event/CheckoutView";
import { getEventBySlug } from "@/lib/events";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEventBySlug(id);
  if (!event) return { title: "Checkout - Concer TIX" };
  return { title: `Checkout: ${event.title} - Concer TIX` };
}

export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEventBySlug(id);
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
