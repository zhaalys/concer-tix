"use client";

import { useEffect, useState, useCallback } from "react";
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
  GREEN,
} from "@/components/admin/AdminUI";
import { Pencil, Trash2, Loader2, Megaphone, Link2, Bell, Info, Tag, TriangleAlert, RefreshCcw } from "lucide-react";
import type { AdminNotification } from "@/types";

const TYPE_META: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  info: { label: "Info", color: "#0F609B", bg: "#E7F0FB", icon: <Info size={13} /> },
  promo: { label: "Promo", color: "#18794E", bg: "#E9F9EE", icon: <Tag size={13} /> },
  warning: { label: "Warning", color: "#B6570A", bg: "#FFE8D9", icon: <TriangleAlert size={13} /> },
  update: { label: "Update", color: "#6A4C93", bg: "#F0EBF9", icon: <RefreshCcw size={13} /> },
};

const PLACEMENT_META: Record<string, { label: string; color: string; bg: string }> = {
  hero: { label: "Carousel atas", color: "#0F609B", bg: "#E7F0FB" },
  banner: { label: "Banner tengah", color: "#18794E", bg: "#E9F9EE" },
  inline: { label: "Teks", color: "#6A6A67", bg: "#F1F1EF" },
};

export default function AdminNotificationsPage() {
  const [items, setItems] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminFetch<AdminNotification[]>("/notifications");
      setItems(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memuat pemberitahuan");
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

  const remove = async (n: AdminNotification) => {
    if (!window.confirm(`Hapus pemberitahuan "${n.title}"?`)) return;
    setDeletingId(n.id);
    try {
      await adminFetch(`/notifications/${n.id}`, { method: "DELETE" });
      setNotice({ type: "success", text: "Pemberitahuan dihapus" });
      load();
    } catch (err) {
      setNotice({ type: "error", text: err instanceof Error ? err.message : "Gagal menghapus" });
    } finally {
      setDeletingId(null);
    }
  };

  const toggle = async (n: AdminNotification) => {
    setTogglingId(n.id);
    try {
      await adminFetch(`/notifications/${n.id}`, {
        method: "PUT",
        body: JSON.stringify({ is_active: !n.is_active }),
      });
      load();
    } catch (err) {
      setNotice({ type: "error", text: err instanceof Error ? err.message : "Gagal mengubah status" });
    } finally {
      setTogglingId(null);
    }
  };

  const active = items.filter((n) => n.is_active).length;

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle={`${items.length} pemberitahuan, ${active} aktif ditampilkan ke pengguna.`}
        action={
          <Link href="/admin/notifications/new" style={{ textDecoration: "none" }}>
            <PrimaryButton>Tambah pemberitahuan</PrimaryButton>
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
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, color: TEXT_FAINT }}>
            <Megaphone size={14} />
            <span style={{ fontSize: 13, color: TEXT_MUTED }}>Aktif: {active}</span>
          </div>
          <div style={{ marginLeft: "auto" }} />
          <GhostButton onClick={load}>Refresh</GhostButton>
        </div>

        {loading ? (
          <Spinner size={30} />
        ) : error ? (
          <div style={{ textAlign: "center", padding: 40, color: "#E5484D", fontSize: 13.5 }}>{error}</div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "56px 20px" }}>
            <div style={{ width: 44, height: 44, margin: "0 auto 14px", borderRadius: 10, background: BG_HOVER, display: "flex", alignItems: "center", justifyContent: "center", color: TEXT_FAINT }}>
              <Bell size={20} />
            </div>
            <div style={{ fontSize: 14.5, fontWeight: 500, color: TEXT }}>Belum ada pemberitahuan</div>
            <div style={{ fontSize: 13, color: TEXT_FAINT, marginTop: 4 }}>Buat pemberitahuan pertama untuk pengguna.</div>
          </div>
        ) : (
          <NotionTable headers={["Pemberitahuan", "Banner", "Tipe", "Status", "Dibuat", "Aksi"]} minWidth={820}>
            {items.map((n) => {
              const meta = TYPE_META[n.type] || TYPE_META.info;
              const pm = PLACEMENT_META[n.placement] || PLACEMENT_META.inline;
              return (
                <Tr key={n.id}>
                  <Td>
                    <div style={{ minWidth: 0, maxWidth: 340 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 500 }}>
                        {n.link && <Link2 size={12.5} color={TEXT_FAINT} />}
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.title}</span>
                      </div>
                      {n.message && (
                        <div style={{ fontSize: 12.5, color: TEXT_MUTED, marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {n.message}
                        </div>
                      )}
                    </div>
                  </Td>
                  <Td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 52, height: 34, borderRadius: 5, overflow: "hidden", border: `1px solid ${BORDER}`, flexShrink: 0, background: "#FBFBFA" }}>
                        {n.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={n.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        ) : null}
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 500, color: pm.color, background: pm.bg, padding: "3px 8px", borderRadius: 6, whiteSpace: "nowrap" }}>
                        {pm.label}
                      </span>
                    </div>
                  </Td>
                  <Td>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 500, color: meta.color, background: meta.bg, padding: "3px 9px", borderRadius: 6 }}>
                      {meta.icon}
                      {meta.label}
                    </span>
                  </Td>
                  <Td>
                    <button
                      onClick={() => toggle(n)}
                      disabled={togglingId === n.id}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 7,
                        background: "none",
                        border: "none",
                        cursor: togglingId === n.id ? "default" : "pointer",
                        padding: 0,
                        fontSize: 13.5,
                        color: TEXT,
                      }}
                    >
                      <span
                        style={{
                          width: 26,
                          height: 15,
                          borderRadius: 8,
                          background: n.is_active ? GREEN : "#D3D1CB",
                          position: "relative",
                          transition: "background 0.15s ease",
                          display: "inline-block",
                          flexShrink: 0,
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            top: 2,
                            left: n.is_active ? 13 : 2,
                            width: 11,
                            height: 11,
                            borderRadius: "50%",
                            background: "#fff",
                            transition: "left 0.15s ease",
                          }}
                        />
                      </span>
                      {n.is_active ? "Aktif" : "Nonaktif"}
                    </button>
                  </Td>
                  <Td style={{ color: TEXT_FAINT, whiteSpace: "nowrap" }}>{formatDate(n.created_at)}</Td>
                  <Td>
                    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Link
                        href={`/admin/notifications/${n.id}/edit`}
                        title="Edit"
                        style={{ color: TEXT_MUTED, padding: 6, display: "inline-flex", borderRadius: 5 }}
                      >
                        <Pencil size={14} />
                      </Link>
                      <button
                        onClick={() => remove(n)}
                        disabled={deletingId === n.id}
                        title="Hapus"
                        style={{ background: "none", border: "none", cursor: deletingId === n.id ? "default" : "pointer", color: TEXT_MUTED, padding: 6, display: "inline-flex", borderRadius: 5, opacity: deletingId === n.id ? 0.4 : 1 }}
                        onMouseEnter={(e) => { if (deletingId !== n.id) { e.currentTarget.style.color = "#E5484D"; e.currentTarget.style.background = "#FFECEF"; } }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = TEXT_MUTED; e.currentTarget.style.background = "transparent"; }}
                      >
                        {deletingId === n.id ? <Loader2 size={14} className="admin-spin" /> : <Trash2 size={14} />}
                      </button>
                    </div>
                  </Td>
                </Tr>
              );
            })}
          </NotionTable>
        )}
        <style>{`.admin-spin { animation: adminSpin 0.8s linear infinite; }`}</style>
      </div>
    </div>
  );
}
