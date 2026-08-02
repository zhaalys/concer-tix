"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar, Footer } from "@/components";
import { supabase } from "@/lib/supabase";

const UNIT_PRICE = 3500;
const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

function Hr() {
  return <div style={{ height: "1px", backgroundColor: "#EEEEEE", margin: "20px 0" }} />;
}

function fmt(d: string) {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    snap: any;
  }
}

interface SnapResult {
  order_id?: string;
  transaction_status?: string;
  payment_type?: string;
  status?: string;
  [key: string]: unknown;
}

function OrderForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const variant = searchParams.get("variant") || "without_qr";
  const qty = parseInt(searchParams.get("qty") || "1", 10);

  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);
  const [done, setDone] = useState(false);
  const [orderData, setOrderData] = useState<{ order_code: string; created_at: string; total_amount: number; status: string; payment_method: string | null } | null>(null);
  const [pendingPayment, setPendingPayment] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserId(session.user.id);
      } else {
        router.replace(`/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      }
    });
  }, [router]);

  const total = qty * UNIT_PRICE;
  const variantLabel = variant === "with_qr" ? "With QR" : "Without QR";

  const phoneDigits = whatsapp.replace(/\D/g, "");
  const phoneValid = phoneDigits.startsWith("62") && phoneDigits.length >= 10 && phoneDigits.length <= 15;
  const canSubmit = name.trim() && phoneValid && address.trim();

  const handleWhatsapp = (raw: string) => {
    let digits = raw.replace(/\D/g, "");
    if (digits.startsWith("62")) digits = digits.slice(2);
    else if (digits.startsWith("0")) digits = digits.slice(1);
    setWhatsapp(digits ? `+62 ${digits.slice(0, 13)}` : "");
  };

  const updateStatus = async (orderCode: string, status: string, result: SnapResult) => {
    await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/wristband-orders/${orderCode}/status`,
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
  };

  const refreshOrder = async (orderCode: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/wristband-orders/${orderCode}`
      );
      const json = await res.json();
      if (json.success) setOrderData(json.data);
    } catch { /* ignore */ }
  };

  const handlePay = async (orderCode: string) => {
    setPaying(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/wristband-orders/payment-token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderCode }),
        }
      );
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Gagal mendapatkan token");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).snap.pay(json.token, {
        onSuccess: async (result: SnapResult) => {
          await updateStatus(orderCode, "paid", result);
          await refreshOrder(orderCode);
          setPendingPayment(false);
          setPaying(false);
          setDone(true);
        },
        onPending: async (result: SnapResult) => {
          await updateStatus(orderCode, "pending", result);
          await refreshOrder(orderCode);
          setPendingPayment(true);
          setPaying(false);
          setDone(true);
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

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/wristband-orders`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            variant,
            quantity: qty,
            customer_name: name.trim(),
            customer_whatsapp: formatPhone(whatsapp.trim()),
            shipping_address: address.trim(),
            user_id: userId,
          }),
        }
      );
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Gagal membuat pesanan");
      setOrderData(json.data);
      setLoading(false);
      handlePay(json.data.order_code);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Terjadi kesalahan");
      setLoading(false);
    }
  };

  if (paying || loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#F7F7F7", fontFamily: FONT, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: "14px", color: "#A0A0A0" }}>{loading ? "Creating order..." : "Processing payment..."}</p>
      </div>
    );
  }

  if (done && orderData) {
    const waMsg = encodeURIComponent(
      `Halo Concer TIX! Saya telah melakukan pemesanan wristband:\n\n` +
      `Order Code: ${orderData.order_code}\n` +
      `Variant: ${variantLabel}\n` +
      `Quantity: ${qty}\n` +
      `Total: Rp${total.toLocaleString("id-ID")}\n` +
      `Status: ${orderData.status === "paid" ? "Lunas" : "Pending"}\n` +
      `Nama: ${name.trim()}\n` +
      `WhatsApp: ${formatPhone(whatsapp.trim())}\n` +
      `Alamat: ${address.trim()}\n\n` +
      `Mohon konfirmasi dan info pengiriman. Terima kasih.`
    );

    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#F7F7F7", fontFamily: FONT }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "60px 24px 80px" }}>
          <div style={{ marginBottom: "8px" }}>
            <span style={{ fontSize: "13px", color: "#A0A0A0", fontWeight: 500 }}>Order Wristband</span>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: "4px" }}>
              <span style={{ fontSize: "13px", color: "#37352F", fontWeight: 600, fontFamily: "monospace" }}>{orderData.order_code}</span>
              <span style={{
                fontSize: "11px", fontWeight: 500, padding: "2px 10px", borderRadius: "4px",
                color: "#37352F",
                backgroundColor: orderData.status === "paid" ? "#EEEEEE" : "#FFF3D6",
              }}>
                {orderData.status === "paid" ? "Paid" : "Pending"}
              </span>
            </div>
            <p style={{ fontSize: "12px", color: "#A0A0A0", margin: "6px 0 0" }}>{fmt(orderData.created_at)}</p>
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
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#37352F" }}>{qty}</span>
            </div>
            {orderData.payment_method && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0" }}>
                <span style={{ fontSize: "13px", color: "#37352F" }}>Payment</span>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#37352F" }}>{orderData.payment_method}</span>
              </div>
            )}
          </div>

          <Hr />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#37352F" }}>Total</span>
            <span style={{ fontSize: "16px", fontWeight: 700, color: "#37352F" }}>Rp{total.toLocaleString("id-ID")}</span>
          </div>

          <Hr />

          <div style={{ marginBottom: "8px" }}>
            <p style={{ fontSize: "11px", color: "#B0B0B0", fontWeight: 600, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Shipping
            </p>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "#37352F", margin: "0 0 1px" }}>{name}</p>
            <p style={{ fontSize: "12px", color: "#6B6B6B", margin: "0 0 1px" }}>{formatPhone(whatsapp)}</p>
            <p style={{ fontSize: "12px", color: "#6B6B6B", margin: 0 }}>{address}</p>
          </div>

          <Hr />

          {pendingPayment && (
            <p style={{ fontSize: "12px", color: "#A0A0A0", textAlign: "center", marginBottom: "8px" }}>
              Please complete your payment using the instructions shown. Status will update once confirmed.
            </p>
          )}
          {orderData.status === "paid" && (
            <p style={{ fontSize: "12px", color: "#A0A0A0", textAlign: "center", marginBottom: "8px" }}>
              Payment confirmed. We will process your order shortly.
            </p>
          )}
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <button
              onClick={() => window.open(`https://wa.me/6281316936289?text=${waMsg}`, "_blank")}
              style={{
                padding: "8px 20px", backgroundColor: "#37352F", color: "#fff",
                border: "none", borderRadius: "4px", fontSize: "13px", fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Send Invoice to WhatsApp
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
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F7F7F7", fontFamily: FONT }}>
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "60px 24px 80px" }}>
        <div style={{ marginBottom: "8px" }}>
          <span style={{ fontSize: "13px", color: "#A0A0A0", fontWeight: 500 }}>Order Wristband</span>
          <p style={{ fontSize: "12px", color: "#A0A0A0", margin: "4px 0 0" }}>Complete your wristband order</p>
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
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#37352F" }}>{qty}</span>
          </div>
        </div>

        <Hr />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <span style={{ fontSize: "14px", fontWeight: 600, color: "#37352F" }}>Total</span>
          <span style={{ fontSize: "16px", fontWeight: 700, color: "#37352F" }}>Rp{total.toLocaleString("id-ID")}</span>
        </div>

        <Hr />

        <div style={{ marginBottom: "8px" }}>
          <p style={{ fontSize: "11px", color: "#B0B0B0", fontWeight: 600, margin: "0 0 16px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Shipping Information
          </p>
          <p style={{ fontSize: "12px", color: "#A0A0A0", margin: "0 0 4px" }}>Nama Lengkap</p>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. John Doe"
            style={{ width: "100%", padding: "8px 10px", border: "1px solid #DDDDDD", borderRadius: "4px", fontSize: "13px", color: "#37352F", marginBottom: "16px", outline: "none" }} />
          <p style={{ fontSize: "12px", color: "#A0A0A0", margin: "0 0 4px" }}>No. WhatsApp *</p>
          <input value={whatsapp} onChange={(e) => handleWhatsapp(e.target.value)} placeholder="+62 8xxxxxxxxx" required
            style={{ width: "100%", padding: "8px 10px", border: `1px solid ${whatsapp && !phoneValid ? "#E5484D" : "#DDDDDD"}`, borderRadius: "4px", fontSize: "13px", color: "#37352F", marginBottom: whatsapp && !phoneValid ? "4px" : "16px", outline: "none" }} />
          {whatsapp && !phoneValid ? (
            <p style={{ fontSize: "11px", color: "#E5484D", margin: "0 0 12px" }}>Nomor tidak valid, minimal 10 digit setelah +62</p>
          ) : phoneValid ? (
            <p style={{ fontSize: "11px", color: "#1ABC9C", margin: "0 0 12px" }}>Tersimpan sebagai {formatPhone(whatsapp)}</p>
          ) : null}
          <p style={{ fontSize: "12px", color: "#A0A0A0", margin: "0 0 4px" }}>Alamat Pengiriman</p>
          <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="e.g. Jl. Merdeka No. 1, Jakarta"
            rows={3}
            style={{ width: "100%", padding: "8px 10px", border: "1px solid #DDDDDD", borderRadius: "4px", fontSize: "13px", color: "#37352F", outline: "none", resize: "vertical" }} />
        </div>

        <Hr />

        <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "24px" }}>
          <button onClick={handleSubmit} disabled={!canSubmit}
            style={{
              padding: "8px 24px", backgroundColor: "#37352F", color: "#fff",
              border: "none", borderRadius: "4px", fontSize: "13px", fontWeight: 500,
              cursor: canSubmit ? "pointer" : "default",
              opacity: canSubmit ? 1 : 0.4,
            }}>
            Place Order
          </button>
          <button onClick={() => router.push("/wristband")}
            style={{
              padding: "8px 20px", backgroundColor: "transparent", color: "#37352F",
              border: "1px solid #DDDDDD", borderRadius: "4px", fontSize: "13px", fontWeight: 500,
              cursor: "pointer",
            }}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

function formatPhone(phone: string): string {
  let p = phone.replace(/\D/g, "");
  if (p.startsWith("08")) p = "628" + p.slice(1);
  else if (p.startsWith("8")) p = "62" + p;
  else if (p.startsWith("62") && !p.startsWith("628")) p = "628" + p.slice(2);
  else if (!p.startsWith("628")) p = "628" + p;
  return p;
}

export default function WristbandOrderPage() {
  return (
    <>
      <Navbar />
      <main>
        <Suspense fallback={<div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>}>
          <OrderForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
