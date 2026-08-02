"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/adminApi";
import { Spinner, GhostButton, TEXT, TEXT_MUTED, TEXT_FAINT, BORDER, BLUE } from "@/components/admin/AdminUI";
import { Info, Tag, TriangleAlert, RefreshCcw, Loader2 } from "lucide-react";
import type { AdminNotification } from "@/types";

const TYPE_META: Record<string, { label: string; icon: React.ReactNode }> = {
  info: { label: "Info", icon: <Info size={13} /> },
  promo: { label: "Promo", icon: <Tag size={13} /> },
  warning: { label: "Warning", icon: <TriangleAlert size={13} /> },
  update: { label: "Update", icon: <RefreshCcw size={13} /> },
};

interface FormState {
  title: string;
  message: string;
  type: "info" | "promo" | "warning" | "update";
  link: string;
  is_active: boolean;
}

const EMPTY_FORM: FormState = { title: "", message: "", type: "info", link: "", is_active: true };

export default function NotificationForm({ notificationId }: { notificationId?: string }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(!!notificationId);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!notificationId) return;
    (async () => {
      setLoading(true);
      setLoadError("");
      try {
        const n = await adminFetch<AdminNotification>(`/notifications/${notificationId}`);
        setForm({ title: n.title, message: n.message || "", type: n.type, link: n.link || "", is_active: n.is_active });
      } catch (e) {
        setLoadError(e instanceof Error ? e.message : "Gagal memuat pemberitahuan");
      } finally {
        setLoading(false);
      }
    })();
  }, [notificationId]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setNotice({ type: "error", text: "Judul wajib diisi" });
      return;
    }
    setSaving(true);
    setNotice(null);
    try {
      const payload = { title: form.title.trim(), message: form.message.trim(), type: form.type, link: form.link.trim() || null, is_active: form.is_active };
      if (notificationId) {
        await adminFetch(`/notifications/${notificationId}`, { method: "PUT", body: JSON.stringify(payload) });
      } else {
        await adminFetch("/notifications", { method: "POST", body: JSON.stringify(payload) });
      }
      router.push("/admin/notifications");
    } catch (err) {
      setNotice({ type: "error", text: err instanceof Error ? err.message : "Gagal menyimpan" });
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 10, background: "#fff" }}>
        <Spinner size={28} />
      </div>
    );
  }

  if (loadError) {
    return (
      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 10, padding: "48px 20px", textAlign: "center", background: "#fff" }}>
        <div style={{ fontSize: 14.5, fontWeight: 500, color: TEXT }}>{loadError}</div>
        <GhostButton onClick={() => router.push("/admin/notifications")} style={{ marginTop: 14 }}>
          Kembali ke daftar pemberitahuan
        </GhostButton>
      </div>
    );
  }

  return (
    <div style={{ border: `1px solid ${BORDER}`, borderRadius: 10, background: "#fff", padding: 20, maxWidth: 560 }}>
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

      <form onSubmit={save} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: TEXT_MUTED, marginBottom: 5 }}>Judul *</label>
          <input className="an-input" required value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Contoh: Info penting jelang hari-H" />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: TEXT_MUTED, marginBottom: 5 }}>Pesan *</label>
          <textarea className="an-input" rows={3} required value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="Isi pemberitahuan" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: TEXT_MUTED, marginBottom: 5 }}>Tipe *</label>
            <select className="an-input" value={form.type} onChange={(e) => set("type", e.target.value as FormState["type"])}>
              {Object.entries(TYPE_META).map(([key, m]) => (
                <option key={key} value={key}>{m.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: TEXT_MUTED, marginBottom: 5 }}>Link (opsional)</label>
            <input className="an-input" value={form.link} onChange={(e) => set("link", e.target.value)} placeholder="https://..." />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 2 }}>
          <input id="an-active" type="checkbox" checked={form.is_active} onChange={(e) => set("is_active", e.target.checked)} style={{ width: 15, height: 15, cursor: "pointer" }} />
          <label htmlFor="an-active" style={{ fontSize: 13.5, color: TEXT, cursor: "pointer", fontWeight: 500 }}>Tampilkan ke pengguna</label>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          <button
            type="button"
            onClick={() => router.push("/admin/notifications")}
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
            {saving ? "Menyimpan..." : notificationId ? "Simpan perubahan" : "Buat pemberitahuan"}
          </button>
        </div>
      </form>

      <style>{`
        .admin-spin { animation: adminSpin 0.8s linear infinite; }
        .an-input {
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
        .an-input:focus { border-color: ${BLUE}; }
      `}</style>
    </div>
  );
}
