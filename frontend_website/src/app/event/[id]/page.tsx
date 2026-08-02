import { Navbar, Footer } from "@/components";
import EventDetailView from "@/components/event/EventDetailView";
import { getAllEvents, getEventBySlug } from "@/lib/events";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateStaticParams() {
  const events = await getAllEvents();
  return events.map((e) => ({ id: e.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEventBySlug(id);
  if (!event) return { title: "Event Not Found" };
  return {
    title: `${event.title} - Concer TIX`,
    description: event.description.slice(0, 150),
  };
}

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEventBySlug(id);
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
