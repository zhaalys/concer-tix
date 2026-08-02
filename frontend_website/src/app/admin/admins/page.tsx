"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/adminApi";
import { useAdmin } from "@/lib/useAdmin";
import {
  PageHeader,
  RoleBadge,
  Spinner,
  Avatar,
  formatDate,
  NotionTable,
  Td,
  Tr,
  errMsg,
  PrimaryButton,
  TEXT,
  TEXT_MUTED,
  TEXT_FAINT,
  BORDER,
  RED,
} from "@/components/admin/AdminUI";
import { Trash2, Loader2 } from "lucide-react";

interface AdminRecord {
  id: string;
  email: string | null;
  role: "admin" | "super_admin";
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export default function AdminAdminsPage() {
  const { isSuperAdmin, user } = useAdmin();
  const [admins, setAdmins] = useState<AdminRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminFetch<AdminRecord[]>("/admins");
      setAdmins(data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isSuperAdmin) load();
  }, [isSuperAdmin, load]);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(t);
  }, [notice]);

  const removeAdmin = async (a: AdminRecord) => {
    if (a.id === user?.id) return;
    const confirmed = window.confirm(`Hapus admin "${a.email}"? Role akan dikembalikan menjadi user biasa.`);
    if (!confirmed) return;
    setBusyId(a.id);
    try {
      await adminFetch(`/admins/${a.id}`, { method: "DELETE" });
      setNotice({ type: "success", text: `Admin ${a.email} berhasil dihapus` });
      load();
    } catch (err) {
      setNotice({ type: "error", text: errMsg(err) });
    } finally {
      setBusyId(null);
    }
  };

  if (!isSuperAdmin) {
    return (
      <div style={{ maxWidth: 480, margin: "60px auto", textAlign: "center" }}>
        <div style={{ fontSize: 17, fontWeight: 600, color: TEXT, letterSpacing: "-0.01em" }}>Akses terbatas</div>
        <div style={{ fontSize: 14, color: TEXT_MUTED, marginTop: 8, lineHeight: 1.6 }}>
          Manajemen admin hanya dapat diakses oleh <b>Super Admin</b>.
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Admin Management"
        subtitle="Kelola akses admin dandi tambah, atur role, atau hapus admin."
        action={
          <Link href="/admin/admins/new" style={{ textDecoration: "none" }}>
            <PrimaryButton>Tambah admin</PrimaryButton>
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
        {loading ? (
          <Spinner size={30} />
        ) : error ? (
          <div style={{ textAlign: "center", padding: 40, color: "#E5484D", fontSize: 13.5 }}>{error}</div>
        ) : admins.length === 0 ? (
          <div style={{ textAlign: "center", padding: "56px 20px" }}>
            <div style={{ fontSize: 14.5, fontWeight: 500, color: TEXT }}>Belum ada admin</div>
          </div>
        ) : (
          <NotionTable headers={["Admin", "Role", "Bergabung", ""]} minWidth={620}>
            {admins.map((a) => {
              const isMe = a.id === user?.id;
              return (
                <Tr key={a.id}>
                  <Td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Avatar name={a.display_name || a.email} color={a.role === "super_admin" ? "#FFE8D9" : "#D8E6F7"} />
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 500 }}>
                          {a.display_name || a.email}
                          {isMe && <span style={{ fontSize: 11.5, color: TEXT_FAINT }}>(Anda)</span>}
                        </div>
                        <div style={{ fontSize: 12.5, color: TEXT_FAINT }}>{a.email}</div>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <RoleBadge role={a.role} />
                  </Td>
                  <Td style={{ color: TEXT_MUTED, whiteSpace: "nowrap" }}>{formatDate(a.created_at)}</Td>
                  <Td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                    <button
                      onClick={() => removeAdmin(a)}
                      disabled={isMe || busyId === a.id}
                      title={isMe ? "Anda tidak dapat menghapus akun sendiri" : `Hapus admin ${a.email}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        background: "transparent",
                        color: isMe ? TEXT_FAINT : TEXT_MUTED,
                        border: "none",
                        borderRadius: 5,
                        padding: "5px 8px",
                        fontSize: 12.5,
                        fontWeight: 500,
                        cursor: isMe ? "not-allowed" : "pointer",
                        transition: "all 0.1s ease",
                      }}
                      onMouseEnter={(e) => {
                        if (!isMe) {
                          e.currentTarget.style.background = "#FFECEF";
                          e.currentTarget.style.color = RED;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isMe) {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = TEXT_MUTED;
                        }
                      }}
                    >
                      {busyId === a.id ? <Loader2 size={13} className="admin-spin" /> : <Trash2 size={13} />}
                      {isMe ? "Anda" : "Hapus"}
                    </button>
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
