"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { adminFetch } from "@/lib/adminApi";
import {
  PageHeader,
  StatCard,
  StatusBadge,
  Spinner,
  formatIDR,
  formatDateTime,
  NotionTable,
  Td,
  Tr,
  PrimaryButton,
  TEXT,
  TEXT_MUTED,
  TEXT_FAINT,
  BORDER,
} from "@/components/admin/AdminUI";
import { Search, RefreshCw, Check, XCircle, RotateCcw, ExternalLink, CreditCard, Wallet, Clock } from "lucide-react";
import type { AdminPayment } from "@/types";

const STATUS_FILTERS = ["semua", "paid", "pending", "cancelled", "refunded", "processed", "shipped", "completed"];

const TICKET_STATUSES = ["pending", "paid", "cancelled", "refunded"];
const WRISTBAND_STATUSES = ["pending", "paid", "processed", "shipped", "completed", "cancelled"];

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("semua");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminFetch<AdminPayment[]>("/payments");
      setPayments(data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memuat pembayaran");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(t);
  }, [notice]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return payments.filter((p) => {
      const matchStatus = status === "semua" || p.status === status;
      const matchQuery =
        !q ||
        p.order_code.toLowerCase().includes(q) ||
        p.customer.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.payment_method || "").toLowerCase().includes(q);
      return matchStatus && matchQuery;
    });
  }, [payments, query, status]);

  const setStatusFor = async (p: AdminPayment, newStatus: string) => {
    setBusyId(p.id);
    setNotice(null);
    try {
      await adminFetch(`/payments/${p.id}/status`, {
        method: "PUT",
        body: JSON.stringify({ type: p.type, status: newStatus }),
      });
      setNotice({ type: "success", text: `${p.order_code} diperbarui menjadi ${newStatus}` });
      load();
    } catch (e) {
      setNotice({ type: "error", text: e instanceof Error ? e.message : "Gagal memperbarui" });
    } finally {
      setBusyId(null);
    }
  };

  const confirmStatus = async (p: AdminPayment, newStatus: string) => {
    const ok = window.confirm(
      `Ubah status ${p.order_code} (${p.type}) menjadi "${newStatus}"?`
    );
    if (!ok) return;
    await setStatusFor(p, newStatus);
  };

  const revenue = payments.filter((p) => p.status === "paid").reduce((s, p) => s + (p.amount || 0), 0);
  const pending = payments.filter((p) => p.status === "pending").length;
  const refunded = payments.filter((p) => p.status === "refunded" || p.status === "cancelled").length;

  const statusesFor = (p: AdminPayment) => (p.type === "wristband" ? WRISTBAND_STATUSES : TICKET_STATUSES);

  return (
    <div>
      <PageHeader
        title="Payments"
        subtitle="Kelola pembayaran tiket & wristband, termasuk pembayaran bermasalah."
        action={
          <PrimaryButton onClick={load}>
            <RefreshCw size={15} />
            Refresh
          </PrimaryButton>
        }
      />

      {notice && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "10px 14px",
            borderRadius: 8,
            marginBottom: 16,
            fontSize: 13.5,
            color: notice.type === "success" ? "#18794E" : "#CD2B31",
            background: notice.type === "success" ? "#E9F9EE" : "#FFECEF",
            border: `1px solid ${notice.type === "success" ? "#B6E0C7" : "#FFBDC1"}`,
          }}
        >
          {notice.text}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(215px, 1fr))", gap: 12, marginBottom: 28 }}>
        <StatCard label="Total transaksi" value={String(payments.length)} icon={<CreditCard size={17} />} sub="Tiket & wristband" />
        <StatCard label="Revenue (paid)" value={formatIDR(revenue)} icon={<Wallet size={17} />} sub="Pembayaran lunas" />
        <StatCard label="Menunggu" value={String(pending)} icon={<Clock size={17} />} sub="Status pending" />
        <StatCard label="Refund / Batal" value={String(refunded)} icon={<RotateCcw size={17} />} sub="Tidak diteruskan" />
      </div>

      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 10, overflow: "hidden" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 12px",
            borderBottom: `1px solid ${BORDER}`,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 7, background: "#EFEEEC", borderRadius: 6, padding: "0 9px", height: 32, flex: 1, minWidth: 200, maxWidth: 320 }}>
            <Search size={13.5} color={TEXT_FAINT} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari kode, customer, event..."
              style={{ border: "none", outline: "none", background: "transparent", fontSize: 14, width: "100%", color: TEXT }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, color: TEXT_FAINT }}>Status</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: TEXT,
                background: "#EFEEEC",
                border: "none",
                borderRadius: 6,
                padding: "6px 10px",
                outline: "none",
                cursor: "pointer",
              }}
            >
              {STATUS_FILTERS.map((s) => (
                <option key={s} value={s}>{s === "semua" ? "Semua status" : s}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <Spinner size={30} />
        ) : error ? (
          <div style={{ textAlign: "center", padding: 40, color: "#E5484D", fontSize: 13.5 }}>{error}</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "56px 20px" }}>
            <div style={{ fontSize: 14.5, fontWeight: 500, color: TEXT }}>Tidak ada pembayaran yang cocok</div>
          </div>
        ) : (
          <NotionTable headers={["Kode", "Tipe", "Customer", "Detail", "Total", "Metode", "Status", "Waktu", "Aksi"]} minWidth={1040}>
            {filtered.map((p) => (
              <Tr key={`${p.type}-${p.id}`}>
                <Td style={{ fontWeight: 600, whiteSpace: "nowrap" }}>{p.order_code}</Td>
                <Td>
                  <span
                    style={{
                      fontSize: 11.5,
                      fontWeight: 500,
                      textTransform: "uppercase",
                      letterSpacing: "0.02em",
                      color: p.type === "wristband" ? "#6A4C93" : "#0F609B",
                      background: p.type === "wristband" ? "#F0EBF9" : "#E7F0FB",
                      padding: "2px 8px",
                      borderRadius: 5,
                    }}
                  >
                    {p.type}
                  </span>
                </Td>
                <Td style={{ maxWidth: 180 }}>
                  <div style={{ fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.customer}</div>
                </Td>
                <Td style={{ color: TEXT_MUTED, maxWidth: 200 }}>
                  <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.description}</div>
                </Td>
                <Td style={{ fontWeight: 500, whiteSpace: "nowrap" }}>{formatIDR(p.amount)}</Td>
                <Td style={{ color: TEXT_MUTED, textTransform: "capitalize" }}>{p.payment_method || "-"}</Td>
                <Td>
                  <StatusBadge status={p.status} />
                </Td>
                <Td style={{ color: TEXT_MUTED, whiteSpace: "nowrap" }}>{formatDateTime(p.created_at)}</Td>
                <Td>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap", maxWidth: 150 }}>
                    {p.status !== "paid" && (
                      <button
                        onClick={() => confirmStatus(p, "paid")}
                        disabled={busyId === p.id}
                        title="Tandai Lunas"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          background: "#E9F9EE",
                          color: "#18794E",
                          border: "none",
                          borderRadius: 5,
                          padding: "4px 8px",
                          fontSize: 12,
                          fontWeight: 500,
                          cursor: busyId === p.id ? "default" : "pointer",
                          opacity: busyId === p.id ? 0.5 : 1,
                        }}
                      >
                        <Check size={12} />
                        Lunas
                      </button>
                    )}
                    {p.status !== "cancelled" && p.status !== "refunded" && (
                      <button
                        onClick={() => confirmStatus(p, "cancelled")}
                        disabled={busyId === p.id}
                        title="Batalkan"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          background: "#FFECEF",
                          color: "#CD2B31",
                          border: "none",
                          borderRadius: 5,
                          padding: "4px 8px",
                          fontSize: 12,
                          fontWeight: 500,
                          cursor: busyId === p.id ? "default" : "pointer",
                          opacity: busyId === p.id ? 0.5 : 1,
                        }}
                      >
                        <XCircle size={12} />
                        Batal
                      </button>
                    )}
                    {p.status === "paid" && (
                      <button
                        onClick={() => confirmStatus(p, "refunded")}
                        disabled={busyId === p.id}
                        title="Refund"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          background: "#F0EBF9",
                          color: "#6A4C93",
                          border: "none",
                          borderRadius: 5,
                          padding: "4px 8px",
                          fontSize: 12,
                          fontWeight: 500,
                          cursor: busyId === p.id ? "default" : "pointer",
                          opacity: busyId === p.id ? 0.5 : 1,
                        }}
                      >
                        <RotateCcw size={12} />
                        Refund
                      </button>
                    )}
                    {p.payment_url && (
                      <a
                        href={p.payment_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Buka link pembayaran"
                        style={{ color: TEXT_FAINT, display: "inline-flex", padding: 3 }}
                      >
                        <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                </Td>
              </Tr>
            ))}
          </NotionTable>
        )}
      </div>
    </div>
  );
}
