import ETicketPage from "@/components/ticket/ETicketPage";
import type { TicketData } from "@/lib/ticketStore";
import { notFound } from "next/navigation";

async function getOrder(code: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders/${encodeURIComponent(code)}`,
      { cache: "no-store" }
    );
    const json = await res.json();
    return json.success ? json.data : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const order = await getOrder(decodeURIComponent(code));
  if (!order) return { title: "E-Ticket - Concer TIX" };
  return { title: `E-Ticket: ${order.event?.title || "Event"} - Concer TIX` };
}

export default async function QrRoute({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const order = await getOrder(decodeURIComponent(code));
  if (!order) notFound();

  const ticket: TicketData = {
    ticketCode: order.attendees?.[0]?.ticket_code || order.order_code,
    orderId: order.order_code,
    eventTitle: order.event?.title || "Event",
    eventDate: order.event?.event_date || "",
    eventTime: order.event?.event_time || "",
    eventLocation: order.event?.location || "",
    category: order.items?.[0]?.ticket_label || "",
    price: order.total_amount || 0,
    holderName: order.attendees?.[0]?.full_name || "",
    email: order.attendees?.[0]?.email || "",
    purchasedAt: order.created_at || "",
    paymentMethod: order.payment_method || "",
    status: order.status === "paid" ? "success" : "pending",
  };

  return <ETicketPage ticket={ticket} />;
}
