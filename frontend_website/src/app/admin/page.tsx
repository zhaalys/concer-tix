"use client";

import { useEffect, useState, useCallback } from "react";
import { adminFetch } from "@/lib/adminApi";
import { useAdmin } from "@/lib/useAdmin";
import {
  PageHeader,
  StatCard,
  StatusBadge,
  Card,
  EmptyState,
  Spinner,
  formatIDR,
  formatDateTime,
  NotionTable,
  Td,
  Tr,
  GhostButton,
  TEXT,
  TEXT_MUTED,
  TEXT_FAINT,
  BORDER,
  BLUE,
} from "@/components/admin/AdminUI";
import { RefreshCw } from "lucide-react";
import Link from "next/link";
import type { OverviewStats } from "@/types";

export default function AdminOverviewPage() {
  const { isSuperAdmin } = useAdmin();
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminFetch<OverviewStats>("/overview");
      setStats(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading && !stats) return <Spinner />;

  if (error && !stats) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px", color: "#E5484D" }}>
        <div style={{ fontSize: 15, fontWeight: 600 }}>Gagal memuat dashboard</div>
        <div style={{ fontSize: 13, color: TEXT_FAINT, marginTop: 6 }}>{error}</div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Ringkasan aktivitas penjualan tiket Concer TIX."
        action={
          <GhostButton onClick={load}>
            <RefreshCw size={14} />
            Refresh
          </GhostButton>
        }
      />

      {/* Stat tiles */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(215px, 1fr))", gap: 12, marginBottom: 28 }}>
        <StatCard label="Total Revenue" value={formatIDR(stats?.total_revenue || 0)} sub={`${formatIDR(stats?.ticket_revenue || 0)} tiket · ${formatIDR(stats?.wristband_revenue || 0)} wristband`} />
        <StatCard label="Total Orders" value={stats?.total_orders || 0} sub={`${stats?.ticket_orders || 0} tiket · ${stats?.wristband_orders || 0} wristband`} />
        <StatCard label="Tickets Sold" value={stats?.tickets_sold || 0} sub="Kursi terjual" />
        <StatCard label="Total Users" value={stats?.total_users || 0} sub="Akun terdaftar" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isSuperAdmin ? "minmax(0, 1.9fr) minmax(0, 1fr)" : "1fr", gap: 24, alignItems: "start" }}>
        {/* Recent orders */}
        <Card
          pad={false}
          title="Transaksi terbaru"
          subtitle="Order tiket terakhir masuk"
          action={
            <Link href="/admin/orders" style={{ fontSize: 13.5, color: BLUE, textDecoration: "none", whiteSpace: "nowrap" }}>
              Lihat semua
            </Link>
          }
        >
          {(stats?.recent_orders?.length || 0) === 0 ? (
            <EmptyState title="Belum ada transaksi" subtitle="Order tiket akan muncul di sini." />
          ) : (
            <NotionTable headers={["Order", "Event", "Total", "Status", "Waktu"]} minWidth={620}>
              {stats?.recent_orders?.map((o) => (
                <Tr key={o.id}>
                  <Td style={{ fontWeight: 600 }}>{o.order_code}</Td>
                  <Td>
                    <div style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.order_items?.[0]?.events?.title || "Event"}</div>
                    <div style={{ fontSize: 12.5, color: TEXT_FAINT }}>{o.order_items?.[0]?.ticket_label}</div>
                  </Td>
                  <Td style={{ fontWeight: 500 }}>{formatIDR(o.total_amount)}</Td>
                  <Td>
                    <StatusBadge status={o.status} />
                  </Td>
                  <Td style={{ color: TEXT_MUTED, whiteSpace: "nowrap" }}>{formatDateTime(o.created_at)}</Td>
                </Tr>
              ))}
            </NotionTable>
          )}
        </Card>

        {/* Insights (super admin only) */}
        {isSuperAdmin && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <Card pad={false} title="Insight" subtitle="Ringkasan metrik platform">
              {[
                { label: "Total Events", value: String(stats?.total_events || 0) },
                { label: "Check-in", value: `${stats?.checked_in || 0} dari ${stats?.tickets_sold || 0}` },
                { label: "Revenue Tiket", value: formatIDR(stats?.ticket_revenue || 0) },
                { label: "Revenue Wristband", value: formatIDR(stats?.wristband_revenue || 0) },
              ].map((item, idx) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "11px 16px",
                    borderBottom: idx === 3 ? "none" : `1px solid ${BORDER}`,
                  }}
                >
                  <span style={{ flex: 1, fontSize: 13.5, color: TEXT_MUTED }}>{item.label}</span>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: TEXT, whiteSpace: "nowrap" }}>{item.value}</span>
                </div>
              ))}
            </Card>

            <Card title="Progress check-in" subtitle={`${stats?.checked_in || 0} dari ${stats?.tickets_sold || 0} tiket terjual sudah check-in.`}>
              <div style={{ height: 6, borderRadius: 4, background: "#E4E2DE", overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${stats?.tickets_sold ? Math.min(100, ((stats?.checked_in || 0) / Math.max(1, stats?.tickets_sold || 1)) * 100) : 0}%`,
                    background: BLUE,
                    borderRadius: 4,
                  }}
                />
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
