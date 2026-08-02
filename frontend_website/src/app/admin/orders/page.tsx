"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { adminFetch } from "@/lib/adminApi";
import {
  PageHeader,
  StatusBadge,
  Spinner,
  formatIDR,
  formatDateTime,
  NotionTable,
  Td,
  Tr,
  TEXT,
  TEXT_MUTED,
  TEXT_FAINT,
  BORDER,
  BG_HOVER,
  BLUE,
} from "@/components/admin/AdminUI";
import { Search, Plus, Pencil, X, Loader2 } from "lucide-react";
import type { AdminOrder } from "@/types";

const STATUS_FILTERS = ["semua", "paid", "pending", "cancelled", "refunded"];
const EDIT_STATUSES = ["pending", "paid", "cancelled", "refunded"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("semua");
  const [editing, setEditing] = useState<AdminOrder | null>(null);
  const [formStatus, setFormStatus] = useState<AdminOrder["status"]>("pending");
  const [formAmount, setFormAmount] = useState<string>("0");
  const [formMethod, setFormMethod] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminFetch<AdminOrder[]>("/orders");
      setOrders(data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memuat orders");
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

  const openEdit = (o: AdminOrder) => {
    setEditing(o);
    setFormStatus(o.status);
    setFormAmount(String(o.total_amount || 0));
    setFormMethod(o.payment_method || "");
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setNotice(null);
    try {
      await adminFetch(`/orders/${editing.id}`, {
        method: "PUT",
        body: JSON.stringify({
          status: formStatus,
          total_amount: Number(formAmount),
          payment_method: formMethod.trim() || null,
        }),
      });
      setNotice({ type: "success", text: `Order ${editing.order_code} berhasil diperbarui` });
      setEditing(null);
      load();
    } catch (err) {
      setNotice({ type: "error", text: err instanceof Error ? err.message : "Gagal memperbarui order" });
    } finally {
      setSaving(false);
    }
  };

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return orders.filter((o) => {
      const matchStatus = status === "semua" || o.status === status;
      const customer = o.attendees?.[0];
      const eventTitle = o.order_items?.[0]?.events?.title || "";
      const matchQuery =
        !q ||
        o.order_code.toLowerCase().includes(q) ||
        eventTitle.toLowerCase().includes(q) ||
        (customer?.email || "").toLowerCase().includes(q) ||
        (customer?.full_name || "").toLowerCase().includes(q);
      return matchStatus && matchQuery;
    });
  }, [orders, query, status]);

  const paidRevenue = orders.filter((o) => o.status === "paid").reduce((s, o) => s + (o.total_amount || 0), 0);
  const pending = orders.filter((o) => o.status === "pending").length;

  return (
    <div>
      <PageHeader title="Orders" subtitle={`${orders.length} transaksi tiket di platform.`} />

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

      {/* Summary line */}
      <div style={{ display: "flex", alignItems: "center", gap: 28, marginBottom: 28, flexWrap: "wrap" }}>
        {[
          { label: "Total orders", value: String(orders.length) },
          { label: "Revenue (paid)", value: formatIDR(paidRevenue) },
          { label: "Pending", value: String(pending) },
          { label: "Dibatalkan", value: String(orders.filter((o) => o.status === "cancelled").length) },
        ].map((s) => (
          <div key={s.label}>
            <div style={{ fontSize: 12.5, color: TEXT_MUTED, marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: TEXT, letterSpacing: "-0.01em" }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 10, overflow: "hidden" }}>
        {/* Toolbar */}
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
              placeholder="Cari order, event, email..."
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
          <div style={{ marginLeft: "auto" }} />
          <button
            onClick={load}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#EFEEEC",
              border: "none",
              color: TEXT,
              borderRadius: 6,
              padding: "6px 11px",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              transition: "background 0.1s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#E3E1DE")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#EFEEEC")}
          >
            <Plus size={14} />
            Refresh
          </button>
        </div>

        {loading ? (
          <Spinner size={30} />
        ) : error ? (
          <div style={{ textAlign: "center", padding: 40, color: "#E5484D", fontSize: 13.5 }}>{error}</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "56px 20px" }}>
            <div style={{ fontSize: 14.5, fontWeight: 500, color: TEXT }}>Tidak ada order yang cocok</div>
            <div style={{ fontSize: 13, color: TEXT_FAINT, marginTop: 4 }}>Coba ubah kata kunci atau filter status.</div>
          </div>
        ) : (
          <NotionTable headers={["Order", "Customer", "Event", "Jml", "Total", "Status", "Waktu", "Aksi"]} minWidth={900}>
            {filtered.map((o) => {
              const customer = o.attendees?.[0];
              const item = o.order_items?.[0];
              return (
                <Tr key={o.id}>
                  <Td style={{ fontWeight: 600, whiteSpace: "nowrap" }}>{o.order_code}</Td>
                  <Td>
                    <div style={{ fontWeight: 500 }}>{customer?.full_name || "Anonim"}</div>
                    <div style={{ fontSize: 12.5, color: TEXT_FAINT }}>{customer?.email || "-"}</div>
                  </Td>
                  <Td>
                    <div style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item?.events?.title || "Event"}</div>
                    {item?.ticket_label && <div style={{ fontSize: 12.5, color: TEXT_FAINT }}>{item.ticket_label}</div>}
                  </Td>
                  <Td style={{ color: TEXT_MUTED }}>{item?.quantity || 0}</Td>
                  <Td style={{ fontWeight: 500, whiteSpace: "nowrap" }}>{formatIDR(o.total_amount)}</Td>
                  <Td>
                    <StatusBadge status={o.status} />
                  </Td>
                  <Td style={{ color: TEXT_MUTED, whiteSpace: "nowrap" }}>{formatDateTime(o.created_at)}</Td>
                  <Td>
                    <button
                      onClick={() => openEdit(o)}
                      title="Edit order"
                      style={{ background: "none", border: "none", cursor: "pointer", color: TEXT_MUTED, padding: 6, display: "inline-flex", borderRadius: 5 }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = BG_HOVER; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                    >
                      <Pencil size={14} />
                    </button>
                  </Td>
                </Tr>
              );
            })}
          </NotionTable>
        )}
      </div>

      {editing && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,15,15,0.45)", zIndex: 80, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "28px 16px", overflowY: "auto" }} onClick={() => !saving && setEditing(null)}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: "100%", maxWidth: 480, background: "#FFFFFF", borderRadius: 12, boxShadow: "0 16px 48px rgba(15,15,15,0.2)", overflow: "hidden" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: `1px solid ${BORDER}` }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: TEXT }}>Edit order</div>
              <button onClick={() => !saving && setEditing(null)} style={{ background: "transparent", border: "none", cursor: "pointer", color: TEXT_FAINT, padding: 5, borderRadius: 5, display: "flex" }}>
                <X size={17} />
              </button>
            </div>

            <form onSubmit={saveEdit} style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ padding: "10px 12px", background: "#FBFBFA", border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 13.5, color: TEXT }}>
                <span style={{ color: TEXT_FAINT }}>Order </span>
                <strong>{editing.order_code}</strong>
                <span style={{ color: TEXT_FAINT }}> - </span>
                {editing.order_items?.[0]?.events?.title || "Event"}
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: TEXT_MUTED, marginBottom: 5 }}>Status</label>
                <select className="ao-input" value={formStatus} onChange={(e) => setFormStatus(e.target.value as AdminOrder["status"])}>
                  {EDIT_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: TEXT_MUTED, marginBottom: 5 }}>Total (Rp)</label>
                <input className="ao-input" type="number" min={0} value={formAmount} onChange={(e) => setFormAmount(e.target.value)} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: TEXT_MUTED, marginBottom: 5 }}>Metode pembayaran</label>
                <input className="ao-input" value={formMethod} onChange={(e) => setFormMethod(e.target.value)} placeholder="bank_transfer, qris, dst." />
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                <button
                  type="button"
                  onClick={() => !saving && setEditing(null)}
                  style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "9px 0", borderRadius: 6, border: `1px solid ${BORDER}`, background: "transparent", color: TEXT, fontSize: 14, fontWeight: 500, cursor: "pointer" }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    flex: 1,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 7,
                    padding: "9px 0",
                    borderRadius: 6,
                    border: "none",
                    background: BLUE,
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: saving ? "default" : "pointer",
                    opacity: saving ? 0.5 : 1,
                  }}
                >
                  {saving ? <Loader2 size={14} className="admin-spin" /> : null}
                  {saving ? "Menyimpan..." : "Simpan perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .admin-spin { animation: adminSpin 0.8s linear infinite; }
        @keyframes adminSpin { to { transform: rotate(360deg); } }
        .ao-input {
          width: 100%;
          border: 1px solid ${BORDER};
          border-radius: 6px;
          padding: 8px 10px;
          font-size: 13.5px;
          outline: none;
          color: ${TEXT};
          background: #FBFBFA;
          box-sizing: border-box;
        }
        .ao-input:focus { border-color: ${BLUE}; }
      `}</style>
    </div>
  );
}
