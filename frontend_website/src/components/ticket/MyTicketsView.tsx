"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

declare global {
  interface Window {
    snap: any;
  }
}

interface OrderItem {
  ticket_label: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

interface Order {
  id: string;
  order_code: string;
  status: string;
  total_amount: number;
  payment_method: string;
  paid_at: string;
  created_at: string;
  event: {
    title: string;
    event_date: string;
    event_time: string;
    location: string;
    image_url: string;
    slug: string;
  } | null;
  items: OrderItem[];
}

interface WristbandOrder {
  id: string;
  order_code: string;
  status: string;
  total_amount: number;
  variant: string;
  quantity: number;
  customer_name: string;
  customer_whatsapp: string;
  shipping_address: string;
  created_at: string;
}

export default function MyTicketsView() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [wbOrders, setWbOrders] = useState<WristbandOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [payingWb, setPayingWb] = useState<string | null>(null);

  const handleWbPay = async (wb: WristbandOrder) => {
    setPayingWb(wb.order_code);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/wristband-orders/payment-token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderCode: wb.order_code }),
        }
      );
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Gagal mendapatkan token");

      const patchStatus = async (status: string, result: { payment_type?: string; order_id?: string }) => {
        const r = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/wristband-orders/${wb.order_code}/status`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              status,
              payment_method: String(result.payment_type || "").replace(/_/g, " "),
              payment_token: result.order_id,
            }),
          }
        );
        return r.ok;
      };

      const pollStatus = async (target: string, maxRetries = 10): Promise<boolean> => {
        for (let i = 0; i < maxRetries; i++) {
          const r = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/wristband-orders/${wb.order_code}`
          );
          const d = await r.json();
          if (d.success && d.data.status === target) return true;
          await new Promise((r) => setTimeout(r, 1000));
        }
        return false;
      };

      window.snap.pay(json.token, {
        onSuccess: async (result: { payment_type?: string; order_id?: string }) => {
          const patched = await patchStatus("paid", result);
          if (!patched) await pollStatus("paid");
          setPayingWb(null);
          router.push(`/my-tickets/wristband/${wb.order_code}`);
        },
        onPending: async (result: { payment_type?: string; order_id?: string }) => {
          await patchStatus("pending", result);
          setPayingWb(null);
          router.push(`/my-tickets/wristband/${wb.order_code}`);
        },
        onError: () => { alert("Pembayaran gagal."); setPayingWb(null); },
        onClose: () => setPayingWb(null),
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Terjadi kesalahan");
      setPayingWb(null);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.replace("/login");
        return;
      }

      try {
        const [evtRes, wbRes] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders/history?user_id=${session.user.id}`
          ),
          fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/wristband-orders/history?user_id=${session.user.id}`
          ),
        ]);

        if (evtRes.ok) {
          const evtJson = await evtRes.json();
          if (evtJson.success) setOrders(evtJson.data);
        }
        if (wbRes.ok) {
          const wbJson = await wbRes.json();
          if (wbJson.success) setWbOrders(wbJson.data);
        }
      } catch {
        setError("Gagal memuat data. Pastikan server backend berjalan.");
      }
      setLoading(false);
    };
    fetchAll();
  }, [router]);

  const hasAny = orders.length > 0 || wbOrders.length > 0;

  return (
    <main style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "24px 16px" }}
        className="mytickets-wrap">
        <style>{`@media(min-width:768px){.mytickets-wrap{padding:48px 32px !important;}}`}</style>
        {error ? (
          <p style={{ fontSize: "14px", color: "#EF4444", textAlign: "center", padding: "40px 20px" }}>{error}</p>
        ) : loading ? (
          <p style={{ fontSize: "14px", color: "#868E96", textAlign: "center", padding: "40px 0" }}>Loading...</p>
        ) : !hasAny ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <p style={{ fontSize: "14px", color: "#868E96" }}>Belum ada tiket</p>
          </div>
        ) : (
          <div>
            {orders.length > 0 && (
              <div style={{ marginBottom: "32px" }}>
                {orders.map((order) => {
                  const e = order.event;
                  return (
                    <div key={order.id}
                      onClick={() => router.push(`/my-tickets/${order.order_code}`)}
                      style={{ border: "1px solid #E9ECEF", borderRadius: "12px", padding: "16px", marginBottom: "12px", cursor: "pointer" }}>
                      <div style={{ display: "flex", gap: "12px" }}>
                        {e?.image_url && (
                          <img src={e.image_url} alt="" style={{ width: "80px", height: "80px", borderRadius: "8px", objectFit: "cover", flexShrink: 0 }} />
                        )}
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: "14px", fontWeight: 600, color: "#1A1D2E", margin: "0 0 4px" }}>{e?.title || "Event"}</p>
                          <p style={{ fontSize: "12px", color: "#868E96", margin: "0 0 2px" }}>{e?.event_date} • {e?.location}</p>
                          <p style={{ fontSize: "12px", color: "#868E96", margin: 0 }}>Total: Rp{order.total_amount.toLocaleString("id-ID")}</p>
                          <div style={{ marginTop: "4px" }}>
                            {order.items.map((item, i) => (
                              <span key={i} style={{ fontSize: "11px", padding: "2px 8px", backgroundColor: "#F1F3F5", borderRadius: "100px", marginRight: "4px" }}>
                                {item.ticket_label} x{item.quantity}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "center" }}>
                          <span style={{ fontSize: "11px", fontWeight: 600, color: order.status === "paid" ? "#37352F" : "#868E96", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                            {order.status === "paid" ? "Paid" : order.status}
                          </span>
                          <span style={{ fontSize: "11px", color: "#ADB5BD", marginTop: "2px" }}>{order.order_code}</span>
                        </div>
                      </div>
                      {e?.location && (
                        <div style={{ marginTop: "12px", borderRadius: "8px", overflow: "hidden", height: "120px" }} onClick={(ev) => ev.stopPropagation()}>
                          <iframe
                            src={`https://www.google.com/maps?q=${encodeURIComponent(e.location)}&output=embed`}
                            style={{ width: "100%", height: "100%", border: 0, display: "block" }}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title={e.location}
                          />
                        </div>
                      )}
                      <div style={{ marginTop: "10px", display: "flex", justifyContent: "flex-end" }}>
                        <span onClick={(ev) => { ev.stopPropagation();
                          const msg = encodeURIComponent(`Hello Concer TIX, I would like to submit a request.\n\nOrder Code: ${order.order_code}\nEvent: ${e?.title || "-"}\n\n1. Ticket data change request\n2. Ticket cancellation\n3. Refund request\n4. Account issue\n5. Ticket not showing\n6. Payment issue\n7. Other`);
                          window.open(`https://wa.me/6281316936289?text=${msg}`, "_blank");
                        }} style={{ fontSize: "11px", color: "#868E96", textDecoration: "underline", cursor: "pointer", letterSpacing: "0.02em" }}>
                          Laporkan Kesalahan
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {wbOrders.length > 0 && (
              <div>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#1A1D2E", marginBottom: "12px" }}>Wristband Orders</p>
                {wbOrders.map((wb) => (
                  <div key={wb.id}
                    onClick={() => router.push(`/my-tickets/wristband/${wb.order_code}`)}
                    style={{ border: "1px solid #E9ECEF", borderRadius: "12px", padding: "16px", marginBottom: "12px", cursor: "pointer" }}>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <div style={{ width: "80px", height: "80px", borderRadius: "8px", flexShrink: 0, overflow: "hidden" }}>
                        <img src={wb.variant === "with_qr" ? "/tiket_version/gelang_kain_qr_1.png" : "/tiket_version/gelang_kain_1.png"} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: "14px", fontWeight: 600, color: "#1A1D2E", margin: "0 0 4px" }}>
                          Wristband {wb.variant === "with_qr" ? "With QR" : "Without QR"}
                        </p>
                        <p style={{ fontSize: "12px", color: "#868E96", margin: "0 0 2px" }}>Qty: {wb.quantity} • {wb.customer_name}</p>
                        <p style={{ fontSize: "12px", color: "#868E96", margin: 0 }}>Total: Rp{wb.total_amount.toLocaleString("id-ID")}</p>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "center" }}>
                        <span style={{ fontSize: "11px", fontWeight: 600, color: wb.status === "paid" ? "#37352F" : "#868E96", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                          {wb.status === "paid" ? "Paid" : wb.status}
                        </span>
                        <span style={{ fontSize: "11px", color: "#ADB5BD", marginTop: "2px" }}>{wb.order_code}</span>
                      </div>
                    </div>
                    <div style={{ marginTop: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span onClick={(ev) => { ev.stopPropagation();
                        const msg = encodeURIComponent(`Hello Concer TIX, I would like to submit a request regarding my wristband order.\n\nOrder Code: ${wb.order_code}\n\n1. Change request\n2. Cancellation\n3. Refund request\n4. Shipping issue\n5. Other`);
                        window.open(`https://wa.me/6281316936289?text=${msg}`, "_blank");
                      }} style={{ fontSize: "11px", color: "#868E96", textDecoration: "underline", cursor: "pointer", letterSpacing: "0.02em" }}>
                        Laporkan Kesalahan
                      </span>
                      {wb.status === "pending" && (
                        <button onClick={(ev) => { ev.stopPropagation(); handleWbPay(wb); }} disabled={payingWb === wb.order_code}
                          style={{ padding: "6px 14px", backgroundColor: "#F7F7F7", color: "#37352F", border: "1px solid #EEEEEE", borderRadius: "4px", fontSize: "11px", fontWeight: 500, cursor: payingWb === wb.order_code ? "default" : "pointer", opacity: payingWb === wb.order_code ? 0.6 : 1 }}>
                          {payingWb === wb.order_code ? "..." : "Pay Now"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
