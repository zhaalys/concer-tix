"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { adminFetch } from "@/lib/adminApi";
import { useAdmin } from "@/lib/useAdmin";
import { PageHeader, GhostButton, TEXT, TEXT_MUTED, TEXT_FAINT, BORDER, BLUE } from "@/components/admin/AdminUI";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

interface AddAdminResult {
  id: string;
  email: string;
  role: "admin" | "super_admin";
  display_name: string;
  created: boolean;
  generated_password?: string;
}

export default function NewAdminPage() {
  const router = useRouter();
  const { isSuperAdmin } = useAdmin();

  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState<"admin" | "super_admin">("admin");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

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

  const submitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setNotice(null);
    try {
      const res = await adminFetch<AddAdminResult>("/admins", {
        method: "POST",
        body: JSON.stringify({ email, role, display_name: displayName || undefined, password: password || undefined }),
      });
      setNotice({
        type: "success",
        text: res.created
          ? `Admin berhasil ditambahkan${res.generated_password ? ` · password default: ${res.generated_password}` : ""}`
          : "Role admin berhasil diperbarui",
      });
      setTimeout(() => router.push("/admin/admins"), 1200);
    } catch (err) {
      setNotice({ type: "error", text: err instanceof Error ? err.message : "Terjadi kesalahan pada server" });
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
        <Link href="/admin/admins" style={{ textDecoration: "none", color: TEXT_MUTED, fontSize: 14, display: "inline-flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 14 }}>‹</span> Admin Management
        </Link>
      </div>
      <PageHeader
        title="Tambah admin"
        subtitle="Beri akses admin baru untuk mengelola dashboard."
        action={
          <GhostButton onClick={() => router.push("/admin/admins")}>Batal</GhostButton>
        }
      />

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
              wordBreak: "break-word",
            }}
          >
            {notice.text}
          </div>
        )}

        <form onSubmit={submitAdd} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: TEXT_MUTED, marginBottom: 5 }}>
              Email admin
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: 8, border: `1px solid ${BORDER}`, borderRadius: 6, padding: "0 10px", background: "#FBFBFA" }}>
              <Mail size={15} color={TEXT_FAINT} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                style={{ border: "none", outline: "none", background: "transparent", fontSize: 14, padding: "9px 0", width: "100%", color: TEXT }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: TEXT_MUTED, marginBottom: 5 }}>Nama tampilan</label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Nama admin"
              style={{ width: "100%", border: `1px solid ${BORDER}`, borderRadius: 6, padding: "9px 10px", fontSize: 14, outline: "none", color: TEXT, background: "#FBFBFA", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: TEXT_MUTED, marginBottom: 5 }}>Role</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {(["admin", "super_admin"] as const).map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setRole(r)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 7,
                    padding: "9px 10px",
                    borderRadius: 6,
                    border: `1.5px solid ${role === r ? BLUE : BORDER}`,
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 500,
                    color: role === r ? BLUE : TEXT_MUTED,
                    background: role === r ? "#E7F0FB" : "#FFFFFF",
                    transition: "all 0.12s ease",
                  }}
                >
                  {r === "super_admin" ? "Super Admin" : "Admin"}
                </button>
              ))}
            </div>
            <p style={{ fontSize: 12, color: TEXT_FAINT, margin: "7px 0 0", lineHeight: 1.55 }}>
              Super admin dapat mengelola admin lain & memantau seluruh data. Admin hanya melihat dashboard & orders.
            </p>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: TEXT_MUTED, marginBottom: 5 }}>Password (opsional)</label>
            <div style={{ display: "flex", alignItems: "center", gap: 8, border: `1px solid ${BORDER}`, borderRadius: 6, padding: "0 10px", background: "#FBFBFA" }}>
              <Lock size={15} color={TEXT_FAINT} />
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kosongkan untuk auto-generate"
                style={{ border: "none", outline: "none", background: "transparent", fontSize: 14, padding: "9px 0", width: "100%", color: TEXT }}
              />
              <button type="button" onClick={() => setShowPass((s) => !s)} style={{ background: "none", border: "none", cursor: "pointer", color: TEXT_FAINT, display: "flex" }}>
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <p style={{ fontSize: 12, color: TEXT_FAINT, margin: "7px 0 0" }}>Jika email sudah terdaftar, hanya role-nya yang diperbarui.</p>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            <GhostButton onClick={() => router.push("/admin/admins")} style={{ flex: 1, justifyContent: "center", border: `1px solid ${BORDER}`, padding: "9px 0" }}>
              Batal
            </GhostButton>
            <button
              type="submit"
              disabled={submitting || !email}
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
                cursor: submitting || !email ? "default" : "pointer",
                opacity: submitting || !email ? 0.4 : 1,
              }}
            >
              {submitting ? <Loader2 size={14} className="admin-spin" /> : null}
              {submitting ? "Menyimpan..." : "Tambahkan"}
            </button>
          </div>
        </form>
      </div>
      <style>{`.admin-spin { animation: adminSpin 0.8s linear infinite; }`}</style>
    </div>
  );
}
