"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { EventData } from "@/lib/eventsData";
import { supabase } from "@/lib/supabase";

interface SnapResult {
  order_id?: string;
  transaction_status?: string;
  payment_type?: string;
  status?: string;
  [key: string]: unknown;
}

interface TicketCategory {
  id: string;
  label: string;
  price: number;
  status: "on_sale" | "sold_out";
}

const STEPS = ["Pilih Kategori", "Detail Pesanan", "Metode Pembayaran", "Pembayaran"];

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
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0", marginBottom: "40px", padding: "20px 0", flexWrap: "wrap", rowGap: "8px" }}>
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

function Step1({ event, onNext }: { event: EventData; onNext: (cat: TicketCategory) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const categories: TicketCategory[] = (event.tickets || []).map((t) => ({
    id: t.id || t.label,
    label: t.label,
    price: t.price,
    status: t.remaining > 0 ? "on_sale" : "sold_out",
  }));
  const cat = categories.find((c) => c.id === selected);

  return (
    <div className="checkout-step-grid">
      <div>
        <div style={{ borderRadius: "12px", overflow: "hidden", marginBottom: "20px", border: "1px solid #EBEBEB" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={event.stageImage || "/stage/stage.png"} alt="Denah panggung & area penonton" style={{ width: "100%", height: "auto", objectFit: "contain", display: "block" }} />
        </div>

        {event.stages && event.stages.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: "24px" }}>
            <span style={{ fontSize: "12px", color: "#9B9B9B" }}>Area penonton:</span>
            {event.stages.map((s) => (
              <span key={s} style={{ fontSize: "12px", fontWeight: 600, color: "#1A1D2E", padding: "4px 12px", borderRadius: 999, border: "1px solid #EBEBEB", background: "#fff" }}>
                {s}
              </span>
            ))}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <p style={{ fontSize: "14px", fontWeight: 700, color: "#000000", marginBottom: "4px" }}>Kategori Tiket</p>
          {categories.length === 0 && (
            <div style={{ padding: "24px 20px", border: "1px solid #EBEBEB", borderRadius: "8px", fontSize: "13px", color: "#9B9B9B" }}>
              Tiket untuk event ini belum tersedia. Silakan hubungi penyelenggara.
            </div>
          )}
          {categories.map((cat) => (
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

function formatPhone(phone: string): string {
  let p = phone.replace(/\D/g, "");
  if (p.startsWith("08")) p = "628" + p.slice(1);
  else if (p.startsWith("8")) p = "62" + p;
  else if (p.startsWith("62") && !p.startsWith("628")) p = "628" + p.slice(2);
  else if (!p.startsWith("628")) p = "628" + p;
  return p;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ID_MAX_LENGTHS: Record<string, number> = {
  ktp: 16,
  sim: 12,
  passport: 9,
};

function Step2({ event, category, onNext, onBack }: { event: EventData; category: TicketCategory; onNext: (form: { nama: string; email: string; whatsapp: string; idType: string; idNo: string; ticketNama: string; gender: string; age: string; domicile: string }) => void; onBack: () => void }) {
  const [form, setForm] = useState({ nama: "", email: "", whatsapp: "" });
  const [ticketForm, setTicketForm] = useState({ nama: "", idType: "", idNo: "", gender: "", age: "", domicile: "" });
  const [timeLeft, setTimeLeft] = useState(600);

  useEffect(() => {
    const id = setInterval(() => setTimeLeft((t) => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");

  const idMaxLength = ticketForm.idType ? ID_MAX_LENGTHS[ticketForm.idType] : undefined;
  const idNoValid = !ticketForm.idType || (ticketForm.idNo.length <= (ID_MAX_LENGTHS[ticketForm.idType] || 999));

  const emailValid = EMAIL_RE.test(form.email.trim());

  const phoneDigits = form.whatsapp.replace(/\D/g, "");
  const phoneValid = phoneDigits.startsWith("62") && phoneDigits.length >= 10 && phoneDigits.length <= 15;

  const handleWhatsapp = (raw: string) => {
    let digits = raw.replace(/\D/g, "");
    if (digits.startsWith("62")) digits = digits.slice(2);
    else if (digits.startsWith("0")) digits = digits.slice(1);
    setForm((f) => ({ ...f, whatsapp: digits ? `+62 ${digits.slice(0, 13)}` : "" }));
  };

  const canSubmit = form.nama.trim() && emailValid && phoneValid && ticketForm.nama.trim() && ticketForm.idType && ticketForm.idNo.trim() && idNoValid;

  return (
    <div className="checkout-step-grid">
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
          <input type="text" placeholder="Nama pemesan" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })}
            style={{ width: "100%", padding: "9px 12px", border: "1px solid #EBEBEB", fontSize: "13px", marginBottom: "12px", outline: "none" }} />
          <p style={{ fontSize: "11px", color: "#9B9B9B", marginBottom: "8px" }}>Email *</p>
          <input type="email" required placeholder="Masukkan email Anda" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={{ width: "100%", padding: "9px 12px", border: `1px solid ${form.email && !emailValid ? "#E5484D" : "#EBEBEB"}`, fontSize: "13px", marginBottom: form.email && !emailValid ? "4px" : "12px", outline: "none" }} />
          {form.email && !emailValid && (
            <p style={{ fontSize: "10px", color: "#E5484D", margin: "0 0 8px" }}>Email tidak valid, contoh: nama@email.com</p>
          )}
          <p style={{ fontSize: "11px", color: "#9B9B9B", marginBottom: "8px" }}>No. WhatsApp *</p>
          <input type="tel" required inputMode="tel" placeholder="+62 8xxxxxxxxx" value={form.whatsapp} onChange={(e) => handleWhatsapp(e.target.value)}
            style={{ width: "100%", padding: "9px 12px", border: `1px solid ${form.whatsapp && !phoneValid ? "#E5484D" : "#EBEBEB"}`, fontSize: "13px", marginBottom: form.whatsapp && !phoneValid ? "4px" : "12px", outline: "none" }} />
          {form.whatsapp && !phoneValid ? (
            <p style={{ fontSize: "10px", color: "#E5484D", margin: "0 0 8px" }}>Nomor tidak valid, minimal 10 digit setelah +62</p>
          ) : phoneValid ? (
            <p style={{ fontSize: "10px", color: "#1ABC9C", margin: "0 0 8px" }}>Tersimpan sebagai {formatPhone(form.whatsapp)}</p>
          ) : null}
        </div>

        <div style={{ border: "1px solid #EBEBEB", borderRadius: "8px", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#000000" }}>Detail Tiket - 1</span>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#000000", padding: "4px 10px" }}>{category.label}</span>
          </div>
          <p style={{ fontSize: "11px", color: "#9B9B9B", marginBottom: "8px" }}>Nama Lengkap *</p>
          <input type="text" placeholder="Nama sesuai KTP/SIM/Passport" value={ticketForm.nama} onChange={(e) => setTicketForm({ ...ticketForm, nama: e.target.value })}
            style={{ width: "100%", padding: "9px 12px", border: "1px solid #EBEBEB", fontSize: "13px", marginBottom: "12px", outline: "none" }} />
          <p style={{ fontSize: "11px", color: "#9B9B9B", marginBottom: "8px" }}>Tipe Identitas *</p>
          <select value={ticketForm.idType} onChange={(e) => { setTicketForm({ ...ticketForm, idType: e.target.value, idNo: "" }); }}
            style={{ width: "100%", padding: "9px 12px", border: "1px solid #EBEBEB", fontSize: "13px", marginBottom: "12px", outline: "none" }}>
            <option value="">Pilih tipe identitas</option>
            <option value="ktp">KTP (maks 16 digit)</option>
            <option value="sim">SIM (maks 12 digit)</option>
            <option value="passport">Passport (maks 9 digit)</option>
          </select>
          <p style={{ fontSize: "11px", color: "#9B9B9B", marginBottom: "8px" }}>Nomor Identitas * {idMaxLength ? `(maks ${idMaxLength} digit)` : ""}</p>
          <input type="text" placeholder={ticketForm.idType === "ktp" ? "16 digit" : ticketForm.idType === "sim" ? "12 digit" : "9 digit"} value={ticketForm.idNo} onChange={(e) => { const val = e.target.value.replace(/\D/g, "").slice(0, idMaxLength); setTicketForm({ ...ticketForm, idNo: val }); }}
            style={{ width: "100%", padding: "9px 12px", border: "1px solid #EBEBEB", fontSize: "13px", marginBottom: "12px", outline: "none" }} />
          <p style={{ fontSize: "11px", color: "#9B9B9B", marginBottom: "8px" }}>Jenis Kelamin</p>
          <select value={ticketForm.gender} onChange={(e) => setTicketForm({ ...ticketForm, gender: e.target.value })}
            style={{ width: "100%", padding: "9px 12px", border: "1px solid #EBEBEB", fontSize: "13px", marginBottom: "12px", outline: "none" }}>
            <option value="">Pilih jenis kelamin</option>
            <option value="male">Laki-laki</option>
            <option value="female">Perempuan</option>
          </select>
          <p style={{ fontSize: "11px", color: "#9B9B9B", marginBottom: "8px" }}>Usia</p>
          <input type="number" placeholder="Usia" value={ticketForm.age} onChange={(e) => setTicketForm({ ...ticketForm, age: e.target.value.replace(/\D/g, "") })}
            style={{ width: "100%", padding: "9px 12px", border: "1px solid #EBEBEB", fontSize: "13px", marginBottom: "12px", outline: "none" }} />
          <p style={{ fontSize: "11px", color: "#9B9B9B", marginBottom: "8px" }}>Domisili</p>
          <select value={ticketForm.domicile} onChange={(e) => setTicketForm({ ...ticketForm, domicile: e.target.value })}
            style={{ width: "100%", padding: "9px 12px", border: "1px solid #EBEBEB", fontSize: "13px", outline: "none" }}>
            <option value="">Pilih kota domisili</option>
            <option value="Ambon">Ambon</option>
            <option value="Balikpapan">Balikpapan</option>
            <option value="Banda Aceh">Banda Aceh</option>
            <option value="Bandar Lampung">Bandar Lampung</option>
            <option value="Bandung">Bandung</option>
            <option value="Banjarmasin">Banjarmasin</option>
            <option value="Batam">Batam</option>
            <option value="Batu">Batu</option>
            <option value="Bekasi">Bekasi</option>
            <option value="Bogor">Bogor</option>
            <option value="Bontang">Bontang</option>
            <option value="Cilegon">Cilegon</option>
            <option value="Cimahi">Cimahi</option>
            <option value="Cirebon">Cirebon</option>
            <option value="Denpasar">Denpasar</option>
            <option value="Depok">Depok</option>
            <option value="Gorontalo">Gorontalo</option>
            <option value="Jakarta">Jakarta</option>
            <option value="Jambi">Jambi</option>
            <option value="Jayapura">Jayapura</option>
            <option value="Kediri">Kediri</option>
            <option value="Kendari">Kendari</option>
            <option value="Kupang">Kupang</option>
            <option value="Lubuklinggau">Lubuklinggau</option>
            <option value="Madiun">Madiun</option>
            <option value="Magelang">Magelang</option>
            <option value="Makassar">Makassar</option>
            <option value="Malang">Malang</option>
            <option value="Manado">Manado</option>
            <option value="Mataram">Mataram</option>
            <option value="Medan">Medan</option>
            <option value="Mojokerto">Mojokerto</option>
            <option value="Padang">Padang</option>
            <option value="Palangkaraya">Palangkaraya</option>
            <option value="Palembang">Palembang</option>
            <option value="Palopo">Palopo</option>
            <option value="Palu">Palu</option>
            <option value="Pangkalpinang">Pangkalpinang</option>
            <option value="Parepare">Parepare</option>
            <option value="Pekalongan">Pekalongan</option>
            <option value="Pekanbaru">Pekanbaru</option>
            <option value="Pematangsiantar">Pematangsiantar</option>
            <option value="Pontianak">Pontianak</option>
            <option value="Prabumulih">Prabumulih</option>
            <option value="Probolinggo">Probolinggo</option>
            <option value="Salatiga">Salatiga</option>
            <option value="Samarinda">Samarinda</option>
            <option value="Semarang">Semarang</option>
            <option value="Serang">Serang</option>
            <option value="Sibolga">Sibolga</option>
            <option value="Sidoarjo">Sidoarjo</option>
            <option value="Sukabumi">Sukabumi</option>
            <option value="Surabaya">Surabaya</option>
            <option value="Surakarta">Surakarta</option>
            <option value="Tangerang">Tangerang</option>
            <option value="Tanjungpinang">Tanjungpinang</option>
            <option value="Tasikmalaya">Tasikmalaya</option>
            <option value="Tebingtinggi">Tebingtinggi</option>
            <option value="Tegal">Tegal</option>
            <option value="Ternate">Ternate</option>
            <option value="Yogyakarta">Yogyakarta</option>
          </select>
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
          <button onClick={() => onNext({ nama: form.nama, email: form.email, whatsapp: formatPhone(form.whatsapp), idType: ticketForm.idType, idNo: ticketForm.idNo, ticketNama: ticketForm.nama, gender: ticketForm.gender, age: ticketForm.age, domicile: ticketForm.domicile })}
            disabled={!canSubmit}
            style={{ flex: 1, padding: "10px 0", border: "1.5px solid #000000", backgroundColor: !canSubmit ? "#F5F5F5" : "transparent", color: !canSubmit ? "#D0D0D0" : "#000000", fontSize: "13px", fontWeight: 600, cursor: !canSubmit ? "default" : "pointer" }}>Lanjutkan</button>
        </div>
      </div>
    </div>
  );
}

function Step3({ category, form, orderCode, onSuccess, onBack }: {
  category: TicketCategory;
  form: { nama: string; email: string; whatsapp: string; idType: string; idNo: string; ticketNama: string; gender: string; age: string; domicile: string };
  orderCode: string;
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
      if (!orderCode) throw new Error("Pesanan belum dibuat. Silakan kembali.");

      const payRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/payment/token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: `${orderCode}-${Date.now()}`,
            amount: category.price,
            name: form.nama || "Guest",
            email: (form.email || "guest@example.com").trim(),
            category: { id: category.id, label: category.label },
            enabledPayments: [selectedMethod.snapKey],
          }),
        }
      );
      const payData = await payRes.json();
      if (!payData.success) throw new Error(payData.message);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).snap.pay(payData.token, {
        onSuccess: (result: SnapResult) => onSuccess({ ...result, status: "success", order_code: orderCode }),
        onPending: (result: SnapResult) => onSuccess({ ...result, status: "pending", order_code: orderCode }),
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

function Step4({ event, category, snapResult, onViewTicket }: { event: EventData; category: TicketCategory; snapResult: SnapResult; onViewTicket: () => void }) {
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
  const [selectedCategory, setSelectedCategory] = useState<TicketCategory | null>(null);
  const [snapResult, setSnapResult] = useState<SnapResult | null>(null);
  const [orderCode, setOrderCode] = useState("");
  const [pendingOrderCode, setPendingOrderCode] = useState("");
  const [orderForm, setOrderForm] = useState({ nama: "", email: "", whatsapp: "", idType: "", idNo: "", ticketNama: "", gender: "", age: "", domicile: "" });
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      if (!data.session?.user) {
        router.replace(`/login?next=${encodeURIComponent(window.location.pathname)}`);
      }
    });
    return () => {
      mounted = false;
    };
  }, [router]);

  const handleStep2Next = async (form: typeof orderForm) => {
    setOrderForm(form);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.replace(`/login?next=${encodeURIComponent(window.location.pathname)}`);
        return;
      }

      const { data: events } = await supabase
        .from("events")
        .select("slug")
        .eq("title", event.title)
        .limit(1);
      const slug = events?.[0]?.slug;
      if (!slug) return;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: session.user.id,
            event_slug: slug,
            category: selectedCategory!.label,
            unit_price: selectedCategory!.price,
            quantity: 1,
            full_name: form.ticketNama,
            email: form.email,
            whatsapp: form.whatsapp,
            identity_type: form.idType || undefined,
            identity_number: form.idNo || undefined,
            booker_name: form.nama || undefined,
            gender: form.gender || undefined,
            age: form.age ? parseInt(form.age, 10) : undefined,
            domicile: form.domicile || undefined,
          }),
        }
      );
      const json = await res.json();
      if (json.success) {
        setPendingOrderCode(json.data.order_code);
      }
    } catch {
      // order creation failed silently, user can retry on pay
    }
    setStep(2);
  };

  const handleSuccess = async (result: SnapResult, category: TicketCategory, form: { nama: string; email: string }) => {
    const code = pendingOrderCode || (result as any).order_code || "";
    setOrderCode(code);
    setSnapResult(result);
    if (code) {
      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders/${code}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: result.status === "pending" ? "pending" : "paid",
            payment_method: String(result.payment_type || "").replace(/_/g, " "),
            payment_token: result.order_id,
          }),
        }
      );
    }
    setStep(3);
  };

  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>
      <style>{`
        .checkout-wrap {
          max-width: 1100px;
          margin: 0 auto;
          padding: 40px 32px 80px;
        }
        .checkout-step-grid {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 32px;
          align-items: start;
        }
        @media (max-width: 991px) {
          .checkout-step-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
        @media (max-width: 767px) {
          .checkout-wrap {
            padding: 16px 16px 80px !important;
          }
        }
      `}</style>
      <div className="checkout-wrap">
        <Stepper current={step} />
        {step === 0 && <Step1 event={event} onNext={(cat) => { setSelectedCategory(cat); setStep(1); }} />}
        {step === 1 && selectedCategory && (
          <Step2
            event={event}
            category={selectedCategory}
            onNext={(form) => { handleStep2Next(form); }}
            onBack={() => setStep(0)}
          />
        )}
        {step === 2 && selectedCategory && (
          <Step3
            category={selectedCategory}
            form={orderForm}
            orderCode={pendingOrderCode}
            onSuccess={(result) => handleSuccess(result, selectedCategory, orderForm)}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && selectedCategory && snapResult && (
          <Step4
            event={event}
            category={selectedCategory}
            snapResult={snapResult}
            onViewTicket={() => router.push(orderCode ? `/my-tickets/${orderCode}` : "/my-tickets")}
          />
        )}
      </div>
    </div>
  );
}
