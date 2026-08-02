"use client";

import Link from "next/link";
import { PageHeader, GhostButton, TEXT_MUTED } from "@/components/admin/AdminUI";
import EventForm from "@/components/admin/EventForm";

export default function NewEventPage() {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
        <Link href="/admin/events" style={{ textDecoration: "none", color: TEXT_MUTED, fontSize: 14, display: "inline-flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 14 }}>‹</span> Events
        </Link>
      </div>
      <PageHeader
        title="Tambah event"
        subtitle="Event baru akan langsung tampil di website publik."
        action={
          <GhostButton onClick={() => window.history.back()}>Batal</GhostButton>
        }
      />
      <EventForm />
    </div>
  );
}
