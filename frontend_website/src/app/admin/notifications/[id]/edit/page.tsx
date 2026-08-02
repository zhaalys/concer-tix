"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { PageHeader, GhostButton, TEXT_MUTED } from "@/components/admin/AdminUI";
import NotificationForm from "@/components/admin/NotificationForm";

export default function EditNotificationPage() {
  const params = useParams<{ id: string }>();
  const notificationId = params.id;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
        <Link href="/admin/notifications" style={{ textDecoration: "none", color: TEXT_MUTED, fontSize: 14, display: "inline-flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 14 }}>‹</span> Notifications
        </Link>
      </div>
      <PageHeader
        title="Edit pemberitahuan"
        subtitle="Perubahan langsung diterapkan pada pemberitahuan."
        action={
          <GhostButton onClick={() => window.history.back()}>Batal</GhostButton>
        }
      />
      <NotificationForm notificationId={notificationId} />
    </div>
  );
}
