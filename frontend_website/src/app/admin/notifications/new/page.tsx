"use client";

import Link from "next/link";
import { PageHeader, GhostButton, TEXT_MUTED } from "@/components/admin/AdminUI";
import NotificationForm from "@/components/admin/NotificationForm";

export default function NewNotificationPage() {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
        <Link href="/admin/notifications" style={{ textDecoration: "none", color: TEXT_MUTED, fontSize: 14, display: "inline-flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 14 }}>‹</span> Notifications
        </Link>
      </div>
      <PageHeader
        title="Tambah pemberitahuan"
        subtitle="Pemberitahuan aktif akan ditampilkan ke pengguna."
        action={
          <GhostButton onClick={() => window.history.back()}>Batal</GhostButton>
        }
      />
      <NotificationForm />
    </div>
  );
}
