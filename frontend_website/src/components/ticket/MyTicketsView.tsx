"use client";

import { TicketData } from "@/lib/ticketStore";

export default function MyTicketsView({ tickets }: { tickets: TicketData[] }) {
  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 32px 80px" }}>
        <p style={{ fontSize: "24px", fontWeight: 800, color: "#1A1D2E", marginBottom: "32px", letterSpacing: "-0.02em" }}>
          My Tickets
        </p>

        {tickets.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 0" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#CED4DA", display: "block", marginBottom: "16px" }}>
              confirmation_number
            </span>
            <p style={{ fontSize: "15px", fontWeight: 700, color: "#1A1D2E", marginBottom: "8px" }}>No tickets yet</p>
            <p style={{ fontSize: "13px", color: "#868E96" }}>Tickets you purchase will appear here</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {tickets.map((ticket) => (
              <div
                key={ticket.ticketCode}
                style={{
                  backgroundColor: "#fff", borderRadius: "14px",
                  border: "1px solid #E9ECEF",
                  padding: "20px 24px",
                  display: "flex", alignItems: "center", gap: "20px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <span style={{
                      fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "100px",
                      backgroundColor: ticket.status === "success" ? "#E6F7F4" : "#FFF9E6",
                      color: ticket.status === "success" ? "#0E9375" : "#F5A623",
                    }}>
                      {ticket.status === "success" ? "Success" : "Pending"}
                    </span>
                    <span style={{ fontSize: "11px", color: "#868E96" }}>{ticket.purchasedAt}</span>
                  </div>
                  <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#1A1D2E", marginBottom: "4px", letterSpacing: "-0.01em" }}>
                    {ticket.eventTitle}
                  </h3>
                  <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "12px", color: "#495057" }}>{ticket.eventDate}</span>
                    <span style={{ fontSize: "12px", color: "#495057" }}>{ticket.category}</span>
                    <span style={{ fontSize: "12px", color: "#495057" }}>{ticket.eventLocation}</span>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px", flexShrink: 0 }}>
                  <p style={{ fontSize: "16px", fontWeight: 800, color: "#1A1D2E", margin: 0 }}>
                    Rp{ticket.price.toLocaleString("id-ID")}
                  </p>
                  <a
                    href={`/my-tickets/${encodeURIComponent(ticket.ticketCode)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: "8px 18px", borderRadius: "8px",
                      backgroundColor: ticket.status === "success" ? "#0E9375" : "#CED4DA",
                      color: "#fff", fontSize: "12px", fontWeight: 700,
                      cursor: ticket.status === "success" ? "pointer" : "not-allowed",
                      textDecoration: "none",
                      pointerEvents: ticket.status === "success" ? "auto" : "none",
                    }}
                  >
                    View E-Ticket
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
