"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { EventData } from "@/lib/eventsData";
import { FACILITY_ICON_IMAGES } from "@/lib/facilities";

const EventMap = dynamic(() => import("@/components/event/EventMap"), { ssr: false });

function hasCoords(mapUrl?: string): boolean {
  const [a, b] = (mapUrl || "").split(",").map((s) => parseFloat(s.trim()));
  return !Number.isNaN(a) && !Number.isNaN(b) && !!a && !!b;
}

export default function EventDetailView({ event }: { event: EventData }) {
  const [activeTab, setActiveTab] = useState<"description" | "terms" | "facilities">("description");

  const tabs = [
    { key: "description", label: "Description" },
    { key: "terms", label: "Terms & Conditions" },
    { key: "facilities", label: "Facilities" },
  ] as const;

  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 32px 80px" }}>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "48px", alignItems: "start" }}>

          {/* ── LEFT ── */}
          <div>
            {/* Title */}
            <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#1A1D2E", letterSpacing: "-0.02em", marginBottom: "12px", lineHeight: 1.25 }}>
              {event.title}
            </h1>

            {/* Organizer */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <span style={{ fontSize: "12px", color: "#868E96", fontWeight: 500 }}>Penyelenggara</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={event.organizerLogo} alt={event.organizer}
                style={{ width: "28px", height: "28px", borderRadius: "50%", objectFit: "contain", border: "1px solid #E9ECEF" }} />
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#1A1D2E" }}>{event.organizer}</span>
            </div>

            {/* Location */}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#0E9375", fontVariationSettings: "'FILL' 1" }}>
                location_on
              </span>
              <div>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#1A1D2E" }}>{event.location}</span>
                <span style={{ fontSize: "12px", color: "#868E96", marginLeft: "8px" }}>{event.cityLabel}</span>
              </div>
              <span className="material-symbols-outlined" style={{ fontSize: "14px", color: "#ADB5BD", marginLeft: "auto" }}>
                open_in_new
              </span>
            </a>

            {/* Social Media */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "28px" }}>
              <span style={{ fontSize: "12px", color: "#868E96", fontWeight: 500, alignSelf: "center" }}>Media Sosial</span>
              {event.socialMedia.map((s) => (
                <a key={s.platform} href={s.url}
                  style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    padding: "5px 12px", borderRadius: "8px",
                    backgroundColor: s.platform === "Instagram" ? "#E7F0FD" : "#F0F0F0",
                    color: s.platform === "Instagram" ? "#3B5BDB" : "#1A1D2E",
                    fontSize: "12px", fontWeight: 600, textDecoration: "none",
                  }}
                >
                  {s.platform === "Instagram" ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
                          <stop offset="0%" stopColor="#fdf497"/>
                          <stop offset="5%" stopColor="#fdf497"/>
                          <stop offset="45%" stopColor="#fd5949"/>
                          <stop offset="60%" stopColor="#d6249f"/>
                          <stop offset="90%" stopColor="#285AEB"/>
                        </radialGradient>
                      </defs>
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="url(#ig-grad)"/>
                      <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.8" fill="none"/>
                      <circle cx="17.5" cy="6.5" r="1.2" fill="white"/>
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.14 8.14 0 0 0 4.77 1.52V6.75a4.85 4.85 0 0 1-1-.06z"/>
                    </svg>
                  )}
                  {s.platform}
                </a>
              ))}
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: "0", borderBottom: "2px solid #F1F3F5", marginBottom: "24px" }}>
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    padding: "10px 20px",
                    background: "none",
                    border: "none",
                    borderBottom: activeTab === tab.key ? "2px solid #0E9375" : "2px solid transparent",
                    marginBottom: "-2px",
                    fontSize: "13px",
                    fontWeight: activeTab === tab.key ? 700 : 500,
                    color: activeTab === tab.key ? "#0E9375" : "#868E96",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === "description" && (
              <div>
                <p style={{ fontSize: "14px", color: "#495057", lineHeight: 1.8, marginBottom: "0" }}>
                  {event.description}
                </p>
              </div>
            )}

            {activeTab === "terms" && (
              <div>
                <ol style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "10px", margin: 0 }}>
                  {event.terms.map((term, i) => (
                    <li key={i} style={{ fontSize: "13px", color: "#495057", lineHeight: 1.7 }}>{term}</li>
                  ))}
                </ol>
              </div>
            )}

            {activeTab === "facilities" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "12px" }}>
                {event.facilities.map((f) => {
                  const iconFile = FACILITY_ICON_IMAGES[f.icon];
                  return (
                  <div key={f.label} style={{
                    display: "flex", alignItems: "center", gap: "10px",
                  }}>
                    {iconFile ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={iconFile}
                        alt={f.label}
                        style={{ width: "36px", height: "36px", objectFit: "contain", flexShrink: 0 }}
                      />
                    ) : (
                      <span className="material-symbols-outlined"
                        style={{ fontSize: "28px", color: "#0E9375", fontVariationSettings: "'FILL' 1" }}>
                        {f.icon}
                      </span>
                    )}
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#1A1D2E" }}>{f.label}</span>
                  </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── RIGHT sticky card ── */}
          <div style={{ position: "sticky", top: "24px" }}>

            {/* Poster image */}
            <div style={{ borderRadius: "12px", overflow: "hidden", marginBottom: "20px", border: "1px solid #F1F3F5" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={event.img} alt={event.title}
                style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }} />
            </div>

            {/* Detail Acara */}
            <div style={{ marginBottom: "16px" }}>
              <p style={{ fontSize: "12px", fontWeight: 500, color: "#1A1D2E", marginBottom: "12px" }}>
                Detail Acara
              </p>
              {[
                { icon: "calendar_month", text: event.date },
                { icon: "schedule", text: event.time },
              ].map((row) => (
                <div key={row.icon} style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "10px" }}>
                  <span className="material-symbols-outlined"
                    style={{ fontSize: "16px", color: "#0E9375", fontVariationSettings: "'FILL' 1", flexShrink: 0, marginTop: "1px" }}>
                    {row.icon}
                  </span>
                  <span style={{ fontSize: "13px", color: "#495057", fontWeight: 400, lineHeight: 1.5 }}>{row.text}</span>
                </div>
              ))}

              {/* Map */}
              {hasCoords(event.mapUrl) ? (
                <div style={{ marginTop: "12px" }}>
                  <EventMap mapUrl={event.mapUrl || ""} location={`${event.location}`} />
                  <a
                    href={`https://www.google.com/maps?q=${encodeURIComponent(event.mapUrl || "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: "5px", marginTop: "8px", fontSize: "12.5px", fontWeight: 600, color: "#0E9375", textDecoration: "none" }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>open_in_new</span>
                    Buka Google Maps
                  </a>
                </div>
              ) : (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none", display: "block", marginTop: "12px" }}
              >
                <div
                  style={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: "1px solid #E9ECEF",
                    position: "relative",
                    cursor: "pointer",
                  }}
                >
                  <iframe
                    src={`https://www.google.com/maps?q=${encodeURIComponent(event.location)}&output=embed`}
                    width="100%"
                    height="160"
                    style={{ border: 0, display: "block", pointerEvents: "none" }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Event Location"
                  />
                  <div
                    style={{
                      position: "absolute", inset: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      backgroundColor: "rgba(0,0,0,0.03)",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.07)"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.03)"}
                  >
                    <span
                      style={{
                        backgroundColor: "#ffffff",
                        padding: "6px 14px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#1A1D2E",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>open_in_new</span>
                      Buka Google Maps
                    </span>
                  </div>
                </div>
              </a>
              )}
            </div>

            {/* Harga + Beli Tiket */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              backgroundColor: "#F8FAFB", borderRadius: "12px",
              padding: "14px 16px", border: "1px solid #F1F3F5",
            }}>
              <div>
                <p style={{ fontSize: "13px", color: "#868E96", margin: "0 0 2px", fontWeight: 400 }}>Harga mulai dari</p>
                <p style={{ fontSize: "22px", fontWeight: 800, color: "#1A1D2E", letterSpacing: "-0.02em", margin: 0 }}>
                  {event.price}
                </p>
              </div>
              <Link
                href={`/event/${event.id}/checkout`}
                style={{
                  padding: "9px 18px",
                  backgroundColor: "#0E9375", color: "#fff",
                  borderRadius: "8px",
                  fontSize: "13px", fontWeight: 700, cursor: "pointer",
                  letterSpacing: "-0.01em",
                  display: "flex", alignItems: "center", gap: "6px", flexShrink: 0,
                  textDecoration: "none",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "15px", fontVariationSettings: "'FILL' 1" }}>
                  confirmation_number
                </span>
                Beli Tiket
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
