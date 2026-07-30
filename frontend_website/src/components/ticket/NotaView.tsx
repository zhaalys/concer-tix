"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface NotaOrder {
  order_code: string;
  status: string;
  total_amount: number;
  payment_method: string | null;
  paid_at: string | null;
  created_at: string;
  event: {
    title: string;
    event_date: string;
    event_time: string;
    location: string;
    slug: string;
  } | null;
  items: Array<{
    ticket_label: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
  }>;
  attendees: Array<{
    ticket_code: string;
    full_name: string;
    email: string;
    whatsapp: string;
    identity_type: string | null;
    identity_number: string | null;
    booker_name: string | null;
    gender: string | null;
    age: number | null;
    domicile: string | null;
  }>;
}

function fmt(d: string) {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
}

function Hr() {
  return <div style={{ height: "1px", backgroundColor: "#EEEEEE", margin: "20px 0" }} />;
}

export default function NotaView({ order }: { order: NotaOrder }) {
  const router = useRouter();
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState("");
  const firstAttendee = order.attendees?.[0];
  const ev = order.event;

  const handlePayNow = async () => {
    if (!ev?.slug) return;
    setPayLoading(true);
    setPayError("");
    try {
      const category = order.items?.[0]?.ticket_label || "Reguler";
      const payRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/payment/token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: `${order.order_code}-${Date.now()}`,
            amount: order.total_amount,
            name: firstAttendee?.full_name || "Guest",
            email: (firstAttendee?.email || "guest@example.com").trim(),
            category: { label: category },
            enabledPayments: ["bca_va", "bni_va", "bri_va", "echannel", "gopay", "shopeepay", "qris", "indomaret", "alfamart"],
          }),
        }
      );
      const payData = await payRes.json();
      if (!payData.success) throw new Error(payData.message);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).snap.pay(payData.token, {
        onSuccess: async (result: Record<string, unknown>) => {
          await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders/${order.order_code}/status`,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                status: "paid",
                payment_method: String(result.payment_type || "").replace(/_/g, " "),
                payment_token: result.order_id,
              }),
            }
          );
          window.location.reload();
        },
        onPending: () => setPayLoading(false),
        onError: () => { setPayError("Pembayaran gagal. Silakan coba lagi."); setPayLoading(false); },
        onClose: () => setPayLoading(false),
      });
    } catch (err) {
      setPayError(err instanceof Error ? err.message : "Terjadi kesalahan");
      setPayLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ffffff", fontFamily: "ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif", color: "#37352F" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "60px 24px 120px" }}>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.02em" }}>Invoice</span>
            <span style={{
              fontSize: "12px", padding: "1px 8px", borderRadius: "3px",
              color: order.status === "paid" ? "#37352F" : "#9B9B9B",
              backgroundColor: order.status === "paid" ? "#EBECEC" : "#F5F5F5",
            }}>
              {order.status === "paid" ? "Paid" : order.status}
            </span>
          </div>
          <p style={{ fontSize: "14px", color: "#9B9B9B", margin: 0, fontFamily: "monospace" }}>{order.order_code}</p>
          <p style={{ fontSize: "13px", color: "#A0A0A0", margin: "2px 0 0" }}>{fmt(order.created_at)}</p>
        </div>

        {/* Event */}
        <div style={{ marginBottom: "24px" }}>
          <p style={{ fontSize: "12px", fontWeight: 600, color: "#9B9B9B", margin: "0 0 6px" }}>Event</p>
          <p style={{ fontSize: "15px", fontWeight: 600, color: "#37352F", margin: "0 0 2px" }}>{ev?.title || "-"}</p>
          <p style={{ fontSize: "14px", color: "#6B6B6B", margin: "0 0 1px" }}>{ev?.event_date} {ev?.event_time ? `• ${ev.event_time}` : ""}</p>
          <p style={{ fontSize: "14px", color: "#6B6B6B", margin: 0 }}>{ev?.location}</p>
        </div>

        <div style={{ height: "1px", backgroundColor: "#EEEEEE", marginBottom: "24px" }} />

        {/* Tickets */}
        <div style={{ marginBottom: "24px" }}>
          <p style={{ fontSize: "12px", fontWeight: 600, color: "#9B9B9B", margin: "0 0 8px" }}>Tickets</p>
          {order.items.map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}>
              <span style={{ fontSize: "14px", color: "#37352F" }}>{item.ticket_label} &times; {item.quantity}</span>
              <span style={{ fontSize: "14px", color: "#37352F" }}>Rp{item.subtotal.toLocaleString("id-ID")}</span>
            </div>
          ))}
          <div style={{ borderTop: "1px solid #EEEEEE", marginTop: "6px", paddingTop: "8px", display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#37352F" }}>Total</span>
            <span style={{ fontSize: "15px", fontWeight: 700, color: "#37352F" }}>Rp{order.total_amount.toLocaleString("id-ID")}</span>
          </div>
        </div>

        <div style={{ height: "1px", backgroundColor: "#EEEEEE", marginBottom: "24px" }} />

        {/* Payment */}
        {order.payment_method && (
          <div style={{ marginBottom: "24px" }}>
            <p style={{ fontSize: "12px", fontWeight: 600, color: "#9B9B9B", margin: "0 0 6px" }}>Payment</p>
            <p style={{ fontSize: "14px", color: "#37352F", margin: "0 0 1px" }}>{order.payment_method}</p>
            {order.paid_at && <p style={{ fontSize: "13px", color: "#A0A0A0", margin: 0 }}>{fmt(order.paid_at)}</p>}
          </div>
        )}

        {order.payment_method && <div style={{ height: "1px", backgroundColor: "#EEEEEE", marginBottom: "24px" }} />}

        {/* Ticket Holder */}
        {firstAttendee && (
          <div style={{ marginBottom: "24px" }}>
            <p style={{ fontSize: "12px", fontWeight: 600, color: "#9B9B9B", margin: "0 0 6px" }}>Detail Tiket</p>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <tbody>
                <Row label="Nama" value={firstAttendee.full_name} />
                {firstAttendee.booker_name && <Row label="Pemesan" value={firstAttendee.booker_name} />}
                <Row label="Email" value={firstAttendee.email} />
                <Row label="WhatsApp" value={firstAttendee.whatsapp} />
                {firstAttendee.identity_type && <Row label="Identitas" value={`${firstAttendee.identity_type.toUpperCase()} — ${firstAttendee.identity_number}`} />}
                {firstAttendee.gender && <Row label="Gender" value={firstAttendee.gender === "male" ? "Laki-laki" : "Perempuan"} />}
                {firstAttendee.age && <Row label="Usia" value={String(firstAttendee.age)} />}
                {firstAttendee.domicile && <Row label="Domisili" value={firstAttendee.domicile} />}
              </tbody>
            </table>
          </div>
        )}

        {payError && (
          <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "6px", padding: "10px 14px", marginBottom: "16px", fontSize: "13px", color: "#DC2626" }}>
            {payError}
          </div>
        )}

        <div style={{ height: "1px", backgroundColor: "#EEEEEE", marginBottom: "24px" }} />

        {/* Actions */}
        <div style={{ display: "flex", gap: "10px" }}>
          {order.status === "paid" ? (
            <button onClick={() => router.push(`/my-tickets/${order.order_code}/qr`)}
              style={{ padding: "6px 16px", backgroundColor: "#37352F", color: "#fff", border: "none", borderRadius: "4px", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>
              View E-Ticket
            </button>
          ) : (
            <button onClick={handlePayNow} disabled={payLoading}
              style={{ padding: "6px 16px", backgroundColor: "#37352F", color: "#fff", border: "none", borderRadius: "4px", fontSize: "13px", fontWeight: 500, cursor: payLoading ? "default" : "pointer", opacity: payLoading ? 0.5 : 1 }}>
              {payLoading ? "Processing..." : "Pay Now"}
            </button>
          )}
          <button onClick={() => { const msg = encodeURIComponent(`Hello Concer TIX, I would like to submit a request.\n\nOrder Code: ${order.order_code}\nEvent: ${ev?.title || "-"}\n\n1. Ticket data change request\n2. Ticket cancellation\n3. Refund request\n4. Account issue\n5. Ticket not showing\n6. Payment issue\n7. Other`); window.open(`https://wa.me/6281316936289?text=${msg}`, "_blank"); }}
            style={{ padding: "6px 16px", backgroundColor: "transparent", color: "#37352F", border: "1px solid #DDDDDD", borderRadius: "4px", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>
            Report
          </button>
        </div>

      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <tr>
      <td style={{ padding: "3px 16px 3px 0", color: "#A0A0A0", verticalAlign: "top", whiteSpace: "nowrap", width: "1%" }}>{label}</td>
      <td style={{ padding: "3px 0", color: "#37352F" }}>{value}</td>
    </tr>
  );
}
