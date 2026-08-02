"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/adminApi";
import {
  PageHeader,
  Spinner,
  formatDate,
  NotionTable,
  Td,
  Tr,
  PrimaryButton,
  GhostButton,
  TEXT,
  TEXT_MUTED,
  TEXT_FAINT,
  BORDER,
  BG_HOVER,
} from "@/components/admin/AdminUI";
import { Pencil, Trash2, Loader2, Search, ExternalLink } from "lucide-react";
import type { AdminEvent } from "@/types";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminFetch<AdminEvent[]>("/events");
      setEvents(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memuat events");
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
    return events.filter((e) => !q || (e.title || "").toLowerCase().includes(q) || (e.organizer || "").toLowerCase().includes(q) || (e.city_label || "").toLowerCase().includes(q));
  }, [events, query]);

  const remove = async (ev: AdminEvent) => {
    const ok = window.confirm(`Hapus event "${ev.title}"? Event dengan order terikat tidak bisa dihapus.`);
    if (!ok) return;
    setDeletingId(ev.id);
    try {
      await adminFetch(`/events/${ev.id}`, { method: "DELETE" });
      setNotice({ type: "success", text: "Event berhasil dihapus" });
      load();
    } catch (err) {
      setNotice({ type: "error", text: err instanceof Error ? err.message : "Gagal menghapus event" });
    } finally {
      setDeletingId(null);
    }
  };

  const upcoming = events.filter((e) => e.status !== "cancelled").length;

  return (
    <div>
      <PageHeader
        title="Events"
        subtitle={`${events.length} event, ${upcoming} aktif di platform.`}
        action={
          <Link href="/admin/events/new" style={{ textDecoration: "none" }}>
            <PrimaryButton>Tambah event</PrimaryButton>
          </Link>
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

      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 10, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderBottom: `1px solid ${BORDER}`, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, background: "#EFEEEC", borderRadius: 6, padding: "0 9px", height: 32, flex: 1, minWidth: 200, maxWidth: 320 }}>
            <Search size={13.5} color={TEXT_FAINT} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari event, organizer, kota..."
              style={{ border: "none", outline: "none", background: "transparent", fontSize: 14, width: "100%", color: TEXT }}
            />
          </div>
          <div style={{ marginLeft: "auto" }} />
          <GhostButton onClick={load}>Refresh</GhostButton>
        </div>

        {loading ? (
          <Spinner size={30} />
        ) : error ? (
          <div style={{ textAlign: "center", padding: 40, color: "#E5484D", fontSize: 13.5 }}>{error}</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "56px 20px" }}>
            <div style={{ fontSize: 14.5, fontWeight: 500, color: TEXT }}>Tidak ada event yang cocok</div>
          </div>
        ) : (
          <NotionTable headers={["Event", "Kota", "Tanggal", "Tiket", "Status", "Aksi"]} minWidth={860}>
            {filtered.map((ev) => (
              <Tr key={ev.id}>
                <Td>
                  <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                    {ev.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={ev.image_url}
                        alt=""
                        style={{ width: 46, height: 34, borderRadius: 6, objectFit: "cover", flexShrink: 0, border: `1px solid ${BORDER}` }}
                      />
                    ) : (
                      <div style={{ width: 46, height: 34, borderRadius: 6, background: "#EFEEEC", flexShrink: 0 }} />
                    )}
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 500, maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {ev.title}
                        {ev.is_hot && <span style={{ marginLeft: 7, fontSize: 11, fontWeight: 600, color: "#B6570A", background: "#FFE8D9", padding: "1px 7px", borderRadius: 4 }}>HOT</span>}
                      </div>
                      <div style={{ fontSize: 12.5, color: TEXT_FAINT }}>{ev.organizer || "Tidak ada organizer"}</div>
                    </div>
                  </div>
                </Td>
                <Td style={{ color: TEXT_MUTED }}>{ev.city_label || ev.city || "-"}</Td>
                <Td style={{ color: TEXT_MUTED, whiteSpace: "nowrap" }}>{formatDate(ev.event_date)}</Td>
                <Td style={{ color: TEXT_MUTED }}>{ev.event_tickets?.length || 0}</Td>
                <Td>
                  <span
                    style={{
                      fontSize: 12.5,
                      fontWeight: 500,
                      textTransform: "capitalize",
                      color: ev.status === "cancelled" ? "#CD2B31" : ev.status === "completed" ? "#6A4C93" : "#0F609B",
                      background: ev.status === "cancelled" ? "#FFECEF" : ev.status === "completed" ? "#F0EBF9" : "#E7F0FB",
                      padding: "3px 9px",
                      borderRadius: 6,
                    }}
                  >
                    {ev.status}
                  </span>
                </Td>
                <Td>
                  <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <a
                      href={`/event/${ev.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Lihat di website"
                      style={{ color: TEXT_FAINT, padding: 6, display: "inline-flex" }}
                    >
                      <ExternalLink size={14} />
                    </a>
                    <Link
                      href={`/admin/events/${ev.id}/edit`}
                      title="Edit"
                      style={{ color: TEXT_MUTED, padding: 6, display: "inline-flex", borderRadius: 5 }}
                    >
                      <Pencil size={14} />
                    </Link>
                    <button
                      onClick={() => remove(ev)}
                      disabled={deletingId === ev.id}
                      title="Hapus"
                      style={{ background: "none", border: "none", cursor: deletingId === ev.id ? "default" : "pointer", color: TEXT_MUTED, padding: 6, display: "inline-flex", borderRadius: 5, opacity: deletingId === ev.id ? 0.4 : 1 }}
                      onMouseEnter={(e) => { if (deletingId !== ev.id) { e.currentTarget.style.color = "#E5484D"; e.currentTarget.style.background = "#FFECEF"; } }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = TEXT_MUTED; e.currentTarget.style.background = "transparent"; }}
                    >
                      {deletingId === ev.id ? <Loader2 size={14} className="admin-spin" /> : <Trash2 size={14} />}
                    </button>
                  </div>
                </Td>
              </Tr>
            ))}
          </NotionTable>
        )}
        <style>{`.admin-spin { animation: adminSpin 0.8s linear infinite; }`}</style>
      </div>
    </div>
  );
}
