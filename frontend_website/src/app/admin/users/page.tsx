"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { adminFetch } from "@/lib/adminApi";
import { useAdmin } from "@/lib/useAdmin";
import {
  PageHeader,
  RoleBadge,
  Spinner,
  Avatar,
  formatIDR,
  formatDate,
  formatDateTime,
  NotionTable,
  Td,
  Tr,
  errMsg,
  TEXT,
  TEXT_MUTED,
  TEXT_FAINT,
  BORDER,
  BG_HOVER,
} from "@/components/admin/AdminUI";
import { Search, Plus, ShieldAlert } from "lucide-react";
import type { AdminUser } from "@/types";

export default function AdminUsersPage() {
  const { isSuperAdmin } = useAdmin();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminFetch<AdminUser[]>("/users");
      setUsers(data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isSuperAdmin) load();
  }, [isSuperAdmin, load]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return users.filter(
      (u) => !q || (u.email || "").toLowerCase().includes(q) || (u.display_name || "").toLowerCase().includes(q)
    );
  }, [users, query]);

  if (!isSuperAdmin) {
    return (
      <div style={{ maxWidth: 480, margin: "60px auto", textAlign: "center" }}>
        <div style={{ fontSize: 17, fontWeight: 600, color: TEXT, letterSpacing: "-0.01em" }}>Akses terbatas</div>
        <div style={{ fontSize: 14, color: TEXT_MUTED, marginTop: 8, lineHeight: 1.6 }}>
          Halaman ini hanya dapat diakses oleh <b>Super Admin</b>.
        </div>
      </div>
    );
  }

  const totalSpent = users.reduce((s, u) => s + (u.total_spent || 0), 0);
  const totalPaidOrders = users.reduce((s, u) => s + (u.orders_paid || 0), 0);

  return (
    <div>
      <PageHeader title="Users" subtitle={`${users.length} pengguna terdaftar di platform.`} />

      <div style={{ display: "flex", alignItems: "center", gap: 28, marginBottom: 28, flexWrap: "wrap" }}>
        {[
          { label: "Total users", value: String(users.length) },
          { label: "Order dibayar", value: String(totalPaidOrders) },
          { label: "Total belanja", value: formatIDR(totalSpent) },
          { label: "Admins", value: String(users.filter((u) => u.role !== "user").length) },
        ].map((s) => (
          <div key={s.label}>
            <div style={{ fontSize: 12.5, color: TEXT_MUTED, marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: TEXT, letterSpacing: "-0.01em" }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 10, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderBottom: `1px solid ${BORDER}`, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, background: "#EFEEEC", borderRadius: 6, padding: "0 9px", height: 32, flex: 1, minWidth: 200, maxWidth: 320 }}>
            <Search size={13.5} color={TEXT_FAINT} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama atau email..."
              style={{ border: "none", outline: "none", background: "transparent", fontSize: 14, width: "100%", color: TEXT }}
            />
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
            <div style={{ fontSize: 14.5, fontWeight: 500, color: TEXT }}>Tidak ada user yang cocok</div>
          </div>
        ) : (
          <NotionTable headers={["User", "Role", "Provider", "Order", "Total Belanja", "Daftar", "Login"]} minWidth={820}>
            {filtered.map((u) => (
              <Tr key={u.id}>
                <Td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar name={u.display_name || u.email} />
                    <div>
                      <div style={{ fontWeight: 500 }}>{u.display_name || "-"}</div>
                      <div style={{ fontSize: 12.5, color: TEXT_FAINT }}>{u.email}</div>
                    </div>
                  </div>
                </Td>
                <Td>{u.role !== "user" ? <RoleBadge role={u.role} /> : <span style={{ fontSize: 13, color: TEXT_MUTED }}>User</span>}</Td>
                <Td style={{ color: TEXT_MUTED, textTransform: "capitalize" }}>{u.provider}</Td>
                <Td style={{ color: TEXT_MUTED }}>
                  {u.orders_count} <span style={{ fontSize: 12.5, color: TEXT_FAINT }}>({u.orders_paid} paid)</span>
                </Td>
                <Td style={{ fontWeight: 500, whiteSpace: "nowrap" }}>{formatIDR(u.total_spent)}</Td>
                <Td style={{ color: TEXT_MUTED, whiteSpace: "nowrap" }}>{formatDate(u.created_at)}</Td>
                <Td style={{ color: TEXT_MUTED, whiteSpace: "nowrap" }}>{u.last_sign_in_at ? formatDateTime(u.last_sign_in_at) : "-"}</Td>
              </Tr>
            ))}
          </NotionTable>
        )}
      </div>
    </div>
  );
}
