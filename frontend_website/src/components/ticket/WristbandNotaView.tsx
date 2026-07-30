"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    snap: any;
  }
}

function Hr() {
  return <div style={{ height: "1px", backgroundColor: "#EEEEEE", margin: "20px 0" }} />;
}

function fmt(d: string) {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
}

interface SnapResult {
  order_id?: string;
  transaction_status?: string;
  payment_type?: string;
  status?: string;
  [key: string]: unknown;
}

interface WristbandOrderData {
  order_code: string;
  status: string;
  total_amount: number;
  variant: string;
  quantity: number;
  unit_price: number;
  customer_name: string;
  customer_whatsapp: string;
  shipping_address: string;
  payment_method: string | null;
  paid_at: string | null;
  created_at: string;
}

export default function WristbandNotaView({ order: initialOrder }: { order: WristbandOrderData }) {
  const router = useRouter();
  const [order, setOrder] = useState(initialOrder);
  const [paying, setPaying] = useState(false);

  const variantLabel = order.variant === "with_qr" ? "With QR" : "Without QR";

  const waMsg = encodeURIComponent(
    `Halo Concer TIX! Saya ingin menanyakan pesanan wristband saya:\n\n` +
    `Order Code: ${order.order_code}\n` +
    `Status: ${order.status === "paid" ? "Lunas" : "Pending"}\n\n` +
    `1. Change request\n` +
    `2. Cancellation\n` +
    `3. Refund request\n` +
    `4. Shipping issue\n` +
    `5. Other`
  );

  const refreshOrder = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/wristband-orders/${order.order_code}`
      );
      const json = await res.json();
      if (json.success) setOrder(json.data);
    } catch { /* ignore */ }
  };

  const handlePay = async () => {
    setPaying(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/wristband-orders/payment-token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderCode: order.order_code }),
        }
      );
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Gagal mendapatkan token");

      const patchStatus = async (status: string, result: SnapResult) => {
        const r = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/wristband-orders/${order.order_code}/status`,
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
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/wristband-orders/${order.order_code}`
          );
          const d = await r.json();
          if (d.success && d.data.status === target) return true;
          await new Promise((r) => setTimeout(r, 1000));
        }
        return false;
      };

      (window as any).snap.pay(json.token, {
        onSuccess: async (result: SnapResult) => {
          const patched = await patchStatus("paid", result);
          if (!patched) await pollStatus("paid");
          await refreshOrder();
          setPaying(false);
        },
        onPending: async (result: SnapResult) => {
          await patchStatus("pending", result);
          await refreshOrder();
          setPaying(false);
        },
        onError: () => {
          alert("Pembayaran gagal. Silakan coba lagi.");
          setPaying(false);
        },
        onClose: () => setPaying(false),
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Terjadi kesalahan");
      setPaying(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F7F7F7", fontFamily: FONT }}>
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "60px 24px 80px" }}>
        <div style={{ marginBottom: "8px" }}>
          <span style={{ fontSize: "13px", color: "#A0A0A0", fontWeight: 500 }}>Wristband Order</span>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: "4px" }}>
            <span style={{ fontSize: "13px", color: "#37352F", fontWeight: 600, fontFamily: "monospace" }}>{order.order_code}</span>
            <span style={{
              fontSize: "11px", fontWeight: 500, padding: "2px 10px", borderRadius: "4px",
              color: "#37352F",
              backgroundColor: order.status === "paid" ? "#EEEEEE" : "#FFF3D6",
            }}>
              {order.status === "paid" ? "Paid" : order.status}
            </span>
          </div>
          <p style={{ fontSize: "12px", color: "#A0A0A0", margin: "6px 0 0" }}>{fmt(order.created_at)}</p>
        </div>

        <Hr />

        <div style={{ marginBottom: "8px" }}>
          <p style={{ fontSize: "11px", color: "#B0B0B0", fontWeight: 600, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Order Detail
          </p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0" }}>
            <span style={{ fontSize: "13px", color: "#37352F" }}>Variant</span>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#37352F" }}>{variantLabel}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0" }}>
            <span style={{ fontSize: "13px", color: "#37352F" }}>Quantity</span>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#37352F" }}>{order.quantity}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0" }}>
            <span style={{ fontSize: "13px", color: "#37352F" }}>Unit Price</span>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#37352F" }}>Rp{order.unit_price.toLocaleString("id-ID")}</span>
          </div>
        </div>

        <Hr />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <span style={{ fontSize: "14px", fontWeight: 600, color: "#37352F" }}>Total</span>
          <span style={{ fontSize: "16px", fontWeight: 700, color: "#37352F" }}>Rp{order.total_amount.toLocaleString("id-ID")}</span>
        </div>

        <Hr />

        {order.payment_method && (
          <div style={{ marginBottom: "8px" }}>
            <p style={{ fontSize: "11px", color: "#B0B0B0", fontWeight: 600, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.04em" }}>Payment</p>
            <p style={{ fontSize: "13px", color: "#37352F", margin: "0 0 1px" }}>{order.payment_method}</p>
            {order.paid_at && <p style={{ fontSize: "12px", color: "#A0A0A0", margin: 0 }}>{fmt(order.paid_at)}</p>}
          </div>
        )}

        {order.payment_method && <Hr />}

        <div style={{ marginBottom: "8px" }}>
          <p style={{ fontSize: "11px", color: "#B0B0B0", fontWeight: 600, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Shipping
          </p>
          <p style={{ fontSize: "14px", fontWeight: 600, color: "#37352F", margin: "0 0 1px" }}>{order.customer_name}</p>
          <p style={{ fontSize: "12px", color: "#6B6B6B", margin: "0 0 1px" }}>{order.customer_whatsapp}</p>
          <p style={{ fontSize: "12px", color: "#6B6B6B", margin: 0 }}>{order.shipping_address}</p>
        </div>

        <Hr />

        <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "24px", flexDirection: "column" }}>
          {order.status === "pending" && (
            <button onClick={handlePay} disabled={paying}
              style={{
                padding: "10px 20px", backgroundColor: "#37352F", color: "#fff",
                border: "none", borderRadius: "4px", fontSize: "13px", fontWeight: 500,
                cursor: paying ? "default" : "pointer", opacity: paying ? 0.6 : 1,
              }}>
              {paying ? "Processing..." : "Continue Payment"}
            </button>
          )}
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <button
              onClick={() => window.open(`https://wa.me/6281316936289?text=${waMsg}`, "_blank")}
              style={{
                padding: "8px 20px", backgroundColor: "transparent", color: "#37352F",
                border: "1px solid #DDDDDD", borderRadius: "4px", fontSize: "13px", fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Report an Issue
            </button>
            <button onClick={() => router.push("/my-tickets")}
              style={{
                padding: "8px 20px", backgroundColor: "transparent", color: "#37352F",
                border: "1px solid #DDDDDD", borderRadius: "4px", fontSize: "13px", fontWeight: 500,
                cursor: "pointer",
              }}>
              My Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
