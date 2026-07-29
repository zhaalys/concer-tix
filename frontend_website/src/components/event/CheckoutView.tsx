"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { EventData } from "@/lib/eventsData";
import { addTicket, generateTicketCode } from "@/lib/ticketStore";

interface SnapResult {
  order_id?: string;
  transaction_status?: string;
  payment_type?: string;
  status?: string;
  [key: string]: unknown;
}

const STEPS = ["Pilih Kategori", "Detail Pesanan", "Metode Pembayaran", "Pembayaran"];

const TICKET_CATEGORIES = [
  { id: "reguler", label: "Reguler", price: 120000, status: "on_sale" },
  { id: "presale", label: "Presale", price: 98000, status: "sold_out" },
  { id: "vip", label: "VIP", price: 350000, status: "on_sale" },
];

const PAYMENT_METHODS = [
  { id: "bca_va", label: "BCA Virtual Account", img: "/img_payment/bca.png", group: "Bank Transfer", snapKey: "bca_va" },
  { id: "bni_va", label: "BNI Virtual Account", img: "/img_payment/bni.png", group: "Bank Transfer", snapKey: "bni_va" },
  { id: "bri_va", label: "BRI Virtual Account", img: "/img_payment/bri.png", group: "Bank Transfer", snapKey: "bri_va" },
  { id: "mandiri_va", label: "Mandiri Virtual Account", img: "/img_payment/mandiri.png", group: "Bank Transfer", snapKey: "echannel" },
  { id: "gopay", label: "GoPay", img: "/img_payment/gopay.png", group: "E-Wallet", snapKey: "gopay" },
  { id: "shopeepay", label: "ShopeePay", img: "/img_payment/shopeepay.png", group: "E-Wallet", snapKey: "shopeepay" },
  { id: "qris", label: "QRIS", img: "/img_payment/qris.png", group: "E-Wallet", snapKey: "qris" },
  { id: "indomaret", label: "Indomaret", img: "/img_payment/indomaret.png", group: "Convenience Store", snapKey: "indomaret" },
  { id: "alfamart", label: "Alfamart", img: "/img_payment/alfamart.png", group: "Convenience Store", snapKey: "alfamart" },
];

function Stepper({ current }: { current: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0", marginBottom: "40px", padding: "20px 0" }}>
      {STEPS.map((step, i) => (
        <div key={step} style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "34px", height: "34px", borderRadius: "50%",
              backgroundColor: "#ffffff",
              border: i <= current ? "1px solid #000000" : "1px solid #D0D0D0",
              color: i <= current ? "#000000" : "#D0D0D0",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "13px", fontWeight: 600, flexShrink: 0,
            }}>
              {i < current ? (
                <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>check</span>
              ) : (i + 1)}
            </div>
            <span style={{
              fontSize: "13px", fontWeight: i === current ? 700 : 500,
              color: i === current ? "#000000" : i < current ? "#000000" : "#868E96",
              whiteSpace: "nowrap",
            }}>{step}</span>
          </div>
          {i < STEPS.length - 1 && (
            <span style={{ fontSize: "16px", color: i < current ? "#000000" : "#D0D0D0", margin: "0 16px", fontWeight: 400 }}>›</span>
          )}
        </div>
      ))}
    </div>
  );
}

function Step1({ event, onNext }: { event: EventData; onNext: (cat: typeof TICKET_CATEGORIES[0]) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const cat = TICKET_CATEGORIES.find((c) => c.id === selected);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "32px", alignItems: "start" }}>
      <div>
        <div style={{ borderRadius: "12px", overflow: "hidden", marginBottom: "24px", border: "1px solid #EBEBEB" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={event.img} alt={event.title} style={{ width: "100%", aspectRatio: "16/6", objectFit: "cover", display: "block" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <p style={{ fontSize: "14px", fontWeight: 700, color: "#000000", marginBottom: "4px" }}>Kategori Tiket</p>
          {TICKET_CATEGORIES.map((cat) => (
            <div key={cat.id} onClick={cat.status === "on_sale" ? () => setSelected(cat.id) : undefined} style={{
              backgroundColor: "#fff",
              border: selected === cat.id ? "1.5px solid #000000" : "1px solid #EBEBEB",
              borderRadius: "8px",
              cursor: cat.status === "on_sale" ? "pointer" : "default",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px" }}>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#000000" }}>{cat.label}</span>
              </div>
              <div style={{ borderTop: "1px solid #EBEBEB", margin: "0 20px" }} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px" }}>
                <span style={{ fontSize: "15px", fontWeight: 700, color: "#000000" }}>Rp{cat.price.toLocaleString("id-ID")}</span>
                {cat.status === "on_sale" ? (
                  <span style={{
                    fontSize: "13px", fontWeight: 500,
                    color: selected === cat.id ? "#000000" : "#9B9B9B",
                    borderBottom: selected === cat.id ? "1px solid #000000" : "1px solid #D0D0D0",
                  }}>
                    {selected === cat.id ? "Dipilih" : "Pilih Tiket"}
                  </span>
                ) : (
                  <span style={{ fontSize: "11px", fontWeight: 600, color: "#BDBDBD" }}>Sold Out</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: "sticky", top: "24px", border: "1px solid #EBEBEB", borderRadius: "8px", padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <span style={{ fontSize: "12px", color: "#9B9B9B" }}>Harga mulai dari</span>
          <span style={{ fontSize: "15px", fontWeight: 700, color: "#000000" }}>
            {cat ? `Rp${cat.price.toLocaleString("id-ID")}` : event.price}
          </span>
        </div>
        <button
          onClick={() => cat && onNext(cat)}
          disabled={!selected}
          style={{
            width: "100%", padding: "10px 0",
            backgroundColor: selected ? "#0E9375" : "#CED4DA",
            color: "#ffffff",
            border: "none",
            fontSize: "13px", fontWeight: 600,
            cursor: selected ? "pointer" : "default",
          }}
        >
          Beli Sekarang
        </button>
      </div>
    </div>
  );
}

function Step2({ event, category, onNext, onBack }: { event: EventData; category: typeof TICKET_CATEGORIES[0]; onNext: (form: { nama: string; email: string }) => void; onBack: () => void }) {
  const [form, setForm] = useState({ nama: "", idType: "", idNo: "", email: "", whatsapp: "" });
  const [ticketForm, setTicketForm] = useState({ nama: "", idType: "", idNo: "", email: "", jenisKelamin: "", usia: "", domisili: "" });
  const [timeLeft, setTimeLeft] = useState(600);

  useEffect(() => {
    const id = setInterval(() => setTimeLeft((t) => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "32px", alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

        <div style={{ display: "flex", alignItems: "center", backgroundColor: "#F5A623", borderRadius: "6px", overflow: "hidden" }}>
          <div style={{ padding: "12px 18px", backgroundColor: "rgba(0,0,0,0.1)", fontSize: "15px", fontWeight: 800, color: "#fff", letterSpacing: "0.05em", fontFamily: "monospace", flexShrink: 0 }}>
            {mins}:{secs}
          </div>
          <div style={{ padding: "12px 18px", fontSize: "13px", fontWeight: 600, color: "#fff" }}>
            Batas Waktu Tersisa
          </div>
        </div>

        <div style={{ border: "1px solid #EBEBEB", borderRadius: "8px", padding: "20px" }}>
          <div style={{ marginBottom: "16px" }}>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#000000" }}>Data Pemesan</span>
          </div>
          <p style={{ fontSize: "11px", color: "#9B9B9B", marginBottom: "16px" }}>Nama Lengkap *</p>
          <input type="text" placeholder="Masukkan nama lengkap Anda" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })}
            style={{ width: "100%", padding: "9px 12px", border: "1px solid #EBEBEB", fontSize: "13px", marginBottom: "12px", outline: "none" }} />
          <p style={{ fontSize: "11px", color: "#9B9B9B", marginBottom: "8px" }}>Tipe Identitas *</p>
          <select value={form.idType} onChange={(e) => setForm({ ...form, idType: e.target.value })}
            style={{ width: "100%", padding: "9px 12px", border: "1px solid #EBEBEB", fontSize: "13px", marginBottom: "12px", outline: "none" }}>
            <option value="">Pilih tipe identitas Anda</option>
            <option value="ktp">KTP</option>
            <option value="sim">SIM</option>
            <option value="passport">Passport</option>
          </select>
          <p style={{ fontSize: "11px", color: "#9B9B9B", marginBottom: "8px" }}>Nomor Identitas *</p>
          <input type="text" placeholder="Masukkan nomor identitas Anda" value={form.idNo} onChange={(e) => setForm({ ...form, idNo: e.target.value })}
            style={{ width: "100%", padding: "9px 12px", border: "1px solid #EBEBEB", fontSize: "13px", marginBottom: "12px", outline: "none" }} />
          <p style={{ fontSize: "11px", color: "#9B9B9B", marginBottom: "8px" }}>Email *</p>
          <input type="email" placeholder="Masukkan email Anda" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={{ width: "100%", padding: "9px 12px", border: "1px solid #EBEBEB", fontSize: "13px", marginBottom: "12px", outline: "none" }} />
          <p style={{ fontSize: "11px", color: "#9B9B9B", marginBottom: "8px" }}>No. WhatsApp *</p>
          <input type="tel" placeholder="+62" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            style={{ width: "100%", padding: "9px 12px", border: "1px solid #EBEBEB", fontSize: "13px", outline: "none" }} />
        </div>

        <div style={{ border: "1px solid #EBEBEB", borderRadius: "8px", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#000000" }}>Detail Tiket - 1</span>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#000000", padding: "4px 10px" }}>{category.label}</span>
          </div>
          <p style={{ fontSize: "11px", color: "#9B9B9B", marginBottom: "8px" }}>Nama Lengkap *</p>
          <input type="text" placeholder="Masukkan nama lengkap Anda" value={ticketForm.nama} onChange={(e) => setTicketForm({ ...ticketForm, nama: e.target.value })}
            style={{ width: "100%", padding: "9px 12px", border: "1px solid #EBEBEB", fontSize: "13px", marginBottom: "12px", outline: "none" }} />
        </div>
      </div>

      <div style={{ position: "sticky", top: "24px" }}>
        <div style={{ border: "1px solid #EBEBEB", borderRadius: "8px", padding: "16px", marginBottom: "12px" }}>
          <p style={{ fontSize: "12px", fontWeight: 600, color: "#000000", marginBottom: "10px" }}>Rincian Pesanan</p>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#6B6B6B", marginBottom: "6px" }}>
            <span>{category.label} x1</span>
            <span>Rp{category.price.toLocaleString("id-ID")}</span>
          </div>
          <div style={{ borderTop: "1px solid #EBEBEB", paddingTop: "8px", marginTop: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
              <span style={{ color: "#9B9B9B" }}>Subtotal</span>
              <span style={{ fontWeight: 700, color: "#000000" }}>Rp{category.price.toLocaleString("id-ID")}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
              <span style={{ color: "#9B9B9B" }}>Total Bayar</span>
              <span style={{ fontWeight: 800, color: "#000000" }}>Rp{category.price.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={onBack} style={{ flex: 1, padding: "10px 0", border: "1px solid #EBEBEB", backgroundColor: "transparent", fontSize: "13px", fontWeight: 500, cursor: "pointer", color: "#9B9B9B" }}> Kembali</button>
          <button onClick={() => onNext({ nama: form.nama, email: form.email })} style={{ flex: 1, padding: "10px 0", border: "1.5px solid #000000", backgroundColor: "transparent", color: "#000000", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Lanjutkan</button>
        </div>
      </div>
    </div>
  );
}

function Step3({ category, form, onSuccess, onBack }: {
  category: typeof TICKET_CATEGORIES[0];
  form: { nama: string; email: string };
  onSuccess: (result: SnapResult) => void;
  onBack: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const selectedMethod = PAYMENT_METHODS.find((m) => m.id === selected);

  const handlePay = async () => {
    if (!selectedMethod) return;
    setLoading(true);
    setError(null);
    try {
      const orderId = `ORDER-${Date.now()}`;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/payment/token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            amount: category.price,
            name: form.nama || "Guest",
            email: form.email || "guest@example.com",
            category: { id: category.id, label: category.label },
            enabledPayments: [selectedMethod.snapKey],
          }),
        }
      );
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).snap.pay(data.token, {
        onSuccess: (result: SnapResult) => onSuccess({ ...result, status: "success" }),
        onPending: (result: SnapResult) => onSuccess({ ...result, status: "pending" }),
        onError: (result: SnapResult) => { setError("Pembayaran gagal. Silakan coba lagi."); console.error(result); },
        onClose: () => setLoading(false),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const groupedMethods = PAYMENT_METHODS.reduce((acc, m) => {
    if (!acc[m.group]) acc[m.group] = [];
    acc[m.group].push(m);
    return acc;
  }, {} as Record<string, typeof PAYMENT_METHODS>);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "32px", alignItems: "start" }}>
      <div>
        {error && (
          <div style={{ backgroundColor: "#FFF0F0", border: "1px solid #FFB3B3", borderRadius: "8px", padding: "12px 16px", marginBottom: "16px", fontSize: "13px", color: "#E03131" }}>
            {error}
          </div>
        )}
        {Object.entries(groupedMethods).map(([group, methods]) => (
          <div key={group} style={{ marginBottom: "20px" }}>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "#000000", marginBottom: "10px" }}>{group}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
              {methods.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelected(m.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: "10px", padding: "12px",
                    border: selected === m.id ? "1.5px solid #000000" : "1px solid #EBEBEB",
                    backgroundColor: "#fff", borderRadius: "8px",
                    cursor: "pointer", justifyContent: "flex-start",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.img} alt={m.label} style={{ width: "32px", height: "32px", objectFit: "contain" }} />
                  <span style={{ fontSize: "12px", fontWeight: selected === m.id ? 700 : 500, color: selected === m.id ? "#000000" : "#6B6B6B" }}>{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
        <p style={{ fontSize: "12px", color: "#BDBDBD", marginTop: "8px" }}>
          Semua metode pembayaran tersedia melalui Midtrans Snap.
        </p>
      </div>

      <div style={{ position: "sticky", top: "24px" }}>
        <div style={{ border: "1px solid #EBEBEB", borderRadius: "8px", padding: "16px", marginBottom: "12px" }}>
          <p style={{ fontSize: "12px", color: "#9B9B9B", marginBottom: "4px" }}>Total Bayar</p>
          <p style={{ fontSize: "20px", fontWeight: 800, color: "#000000" }}>Rp{category.price.toLocaleString("id-ID")}</p>
          {selectedMethod && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "10px", padding: "8px 10px", border: "1px solid #EBEBEB", borderRadius: "6px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selectedMethod.img} alt={selectedMethod.label} style={{ width: "24px", height: "24px", objectFit: "contain" }} />
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#000000" }}>{selectedMethod.label}</span>
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={onBack} style={{ flex: 1, padding: "10px 0", border: "1px solid #EBEBEB", backgroundColor: "transparent", fontSize: "13px", fontWeight: 500, cursor: "pointer", color: "#9B9B9B" }}> Kembali</button>
          <button
            onClick={handlePay}
            disabled={loading || !selected}
            style={{
              flex: 2, padding: "10px 0",
              border: loading || !selected ? "1px solid #EBEBEB" : "1.5px solid #000000",
              backgroundColor: "transparent",
              color: loading || !selected ? "#D0D0D0" : "#000000",
              fontSize: "13px", fontWeight: 600,
              cursor: loading || !selected ? "default" : "pointer",
            }}
          >
            {loading ? "Memproses..." : "Bayar Sekarang"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Step4({ event, category, snapResult, onViewTicket }: { event: EventData; category: typeof TICKET_CATEGORIES[0]; snapResult: SnapResult; onViewTicket: () => void }) {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    setMobile(window.innerWidth < 768);
    const onResize = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div style={{ minHeight: "60vh", backgroundColor: "#ffffff" }}>
      {mobile ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 24px", gap: "16px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/history_lanyard/lanyard_accept.png"
            alt="payment accepted"
            style={{ width: "60%", maxWidth: "220px", height: "auto", display: "block" }}
          />
          <div style={{
            width: "100%",
            backgroundColor: "#ffffff",
            border: "1px solid #E5E5E5",
            borderRadius: "6px",
            padding: "14px 16px",
          }}>
            <p style={{ fontSize: "12px", fontWeight: 700, color: "#000000", margin: "0 0 2px", textAlign: "center", letterSpacing: "0.04em", textTransform: "uppercase" }}>Payment Successful</p>
            <div style={{ borderTop: "1px dashed #D0D0D0", margin: "6px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", marginBottom: "3px" }}>
              <span style={{ color: "#9B9B9B" }}>Event</span>
              <span style={{ color: "#000000", fontWeight: 500, textAlign: "right", maxWidth: "60%" }}>{event.title}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", marginBottom: "3px" }}>
              <span style={{ color: "#9B9B9B" }}>Order</span>
              <span style={{ color: "#000000", fontWeight: 500, fontFamily: "monospace", fontSize: "9px" }}>{snapResult.order_id}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", marginBottom: "3px" }}>
              <span style={{ color: "#9B9B9B" }}>Category</span>
              <span style={{ color: "#000000", fontWeight: 500 }}>{category.label}</span>
            </div>
            <div style={{ borderTop: "1px dashed #D0D0D0", margin: "6px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px" }}>
              <span style={{ color: "#9B9B9B" }}>Total</span>
              <span style={{ color: "#000000", fontWeight: 700 }}>Rp{category.price.toLocaleString("id-ID")}</span>
            </div>
          </div>
          <button
            onClick={onViewTicket}
            style={{
              padding: "8px 20px",
              backgroundColor: "transparent", color: "#000000",
              border: "1.5px solid #000000",
              fontSize: "10px", fontWeight: 600, cursor: "pointer",
              letterSpacing: "0.04em",
            }}
          >
            VIEW E-TICKET
          </button>
        </div>
      ) : (
        <div style={{ position: "relative", maxWidth: "1000px", width: "100%", margin: "0 auto" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/history_lanyard/lanyard_accept.png"
            alt="payment accepted"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
          <div style={{
            position: "absolute", top: "68%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: "52%",
            backgroundColor: "#ffffff",
            border: "1px solid #E5E5E5",
            borderRadius: "5px",
            padding: "16px 20px",
          }}>
            <p style={{ fontSize: "17px", fontWeight: 700, color: "#000000", margin: "0 0 2px", textAlign: "center", letterSpacing: "0.04em", textTransform: "uppercase" }}>Payment Successful</p>
            <div style={{ borderTop: "1px dashed #D0D0D0", margin: "12px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", marginBottom: "8px" }}>
              <span style={{ color: "#9B9B9B" }}>Event</span>
              <span style={{ color: "#000000", fontWeight: 500, textAlign: "right", maxWidth: "65%" }}>{event.title}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", marginBottom: "8px" }}>
              <span style={{ color: "#9B9B9B" }}>Order</span>
              <span style={{ color: "#000000", fontWeight: 500, fontFamily: "monospace", fontSize: "14px" }}>{snapResult.order_id}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", marginBottom: "8px" }}>
              <span style={{ color: "#9B9B9B" }}>Category</span>
              <span style={{ color: "#000000", fontWeight: 500 }}>{category.label}</span>
            </div>
            <div style={{ borderTop: "1px dashed #D0D0D0", margin: "12px 0 8px" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", marginBottom: "10px" }}>
              <span style={{ color: "#9B9B9B" }}>Total</span>
              <span style={{ color: "#000000", fontWeight: 700 }}>Rp{category.price.toLocaleString("id-ID")}</span>
            </div>
          </div>
          <div style={{ position: "absolute", bottom: "14%", left: "50%", transform: "translateX(-50%)" }}>
            <button
              onClick={onViewTicket}
              style={{
                padding: "7px 20px", backgroundColor: "transparent", color: "#000000",
                border: "1.5px solid #000000",
                fontSize: "10px", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
                letterSpacing: "0.04em",
              }}
            >
              VIEW E-TICKET
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CheckoutView({ event }: { event: EventData }) {
  const [step, setStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<typeof TICKET_CATEGORIES[0] | null>(null);
  const [snapResult, setSnapResult] = useState<SnapResult | null>(null);
  const [orderForm, setOrderForm] = useState({ nama: "", email: "" });
  const router = useRouter();

  const handleSuccess = (result: SnapResult, category: typeof TICKET_CATEGORIES[0], form: { nama: string; email: string }) => {
    addTicket({
      ticketCode: generateTicketCode(),
      orderId: String(result.order_id || ""),
      eventTitle: event.title,
      eventDate: event.date,
      eventTime: event.time,
      eventLocation: event.location,
      category: category.label,
      price: category.price,
      holderName: form.nama || "Guest",
      email: form.email || "guest@example.com",
      purchasedAt: new Date().toLocaleString("id-ID"),
      paymentMethod: String(result.payment_type || "").replace(/_/g, " "),
      status: result.status === "pending" ? "pending" : "success",
    });
    setSnapResult(result);
    setStep(3);
  };

  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 32px 80px" }}>
        <Stepper current={step} />
        {step === 0 && <Step1 event={event} onNext={(cat) => { setSelectedCategory(cat); setStep(1); }} />}
        {step === 1 && selectedCategory && (
          <Step2
            event={event}
            category={selectedCategory}
            onNext={(form) => { setOrderForm(form); setStep(2); }}
            onBack={() => setStep(0)}
          />
        )}
        {step === 2 && selectedCategory && (
          <Step3
            category={selectedCategory}
            form={orderForm}
            onSuccess={(result) => handleSuccess(result, selectedCategory, orderForm)}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && selectedCategory && snapResult && (
          <Step4
            event={event}
            category={selectedCategory}
            snapResult={snapResult}
            onViewTicket={() => router.push("/my-tickets")}
          />
        )}
      </div>
    </div>
  );
}
