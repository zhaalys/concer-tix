import WristbandNotaView from "@/components/ticket/WristbandNotaView";
import { notFound } from "next/navigation";

async function getWristbandOrder(code: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/wristband-orders/${encodeURIComponent(code)}`,
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
  const order = await getWristbandOrder(decodeURIComponent(code));
  if (!order) return { title: "Wristband Order - Concer TIX" };
  return { title: `Wristband Order: ${order.order_code} - Concer TIX` };
}

export default async function WristbandNotaRoute({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const order = await getWristbandOrder(decodeURIComponent(code));
  if (!order) notFound();

  return <WristbandNotaView order={order} />;
}
