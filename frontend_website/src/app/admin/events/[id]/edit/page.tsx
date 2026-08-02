"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { PageHeader, GhostButton, TEXT_MUTED } from "@/components/admin/AdminUI";
import EventForm from "@/components/admin/EventForm";

export default function EditEventPage() {
  const params = useParams<{ id: string }>();
  const eventId = params.id;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
        <Link href="/admin/events" style={{ textDecoration: "none", color: TEXT_MUTED, fontSize: 14, display: "inline-flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 14 }}>‹</span> Events
        </Link>
      </div>
      <PageHeader
        title="Edit event"
        subtitle="Perubahan akan langsung tampil di website publik."
        action={
          <GhostButton onClick={() => window.history.back()}>Batal</GhostButton>
        }
      />
      <EventForm eventId={eventId} />
    </div>
  );
}
