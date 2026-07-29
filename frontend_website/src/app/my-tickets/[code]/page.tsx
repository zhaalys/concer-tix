import ETicketPage from "@/components/ticket/ETicketPage";
import { getTickets } from "@/lib/ticketStore";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const ticket = getTickets().find((t) => t.ticketCode === code);
  if (!ticket) return { title: "E-Tiket - Concer TIX" };
  return { title: `E-Ticket: ${ticket.eventTitle} - Concer TIX` };
}

export default async function ETicketRoute({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const ticket = getTickets().find((t) => t.ticketCode === decodeURIComponent(code));
  if (!ticket) notFound();

  return <ETicketPage ticket={ticket} />;
}
