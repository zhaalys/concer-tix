import { Navbar, Footer } from "@/components";
import EventDetailView from "@/components/event/EventDetailView";
import { ALL_EVENTS } from "@/lib/eventsData";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return ALL_EVENTS.map((e) => ({ id: e.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = ALL_EVENTS.find((e) => e.id === id);
  if (!event) return { title: "Event Not Found" };
  return {
    title: `${event.title} - Concer TIX`,
    description: event.description.slice(0, 150),
  };
}

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = ALL_EVENTS.find((e) => e.id === id);
  if (!event) notFound();

  return (
    <>
      <Navbar />
      <main>
        <EventDetailView event={event} />
      </main>
      <Footer />
    </>
  );
}
