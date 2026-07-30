import NotaView from "@/components/ticket/NotaView";
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
  if (!order) return { title: "Invoice - Concer TIX" };
  return { title: `Invoice: ${order.event?.title || "Event"} - Concer TIX` };
}

export default async function InvoiceRoute({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const order = await getOrder(decodeURIComponent(code));
  if (!order) notFound();

  return <NotaView order={order} />;
}
