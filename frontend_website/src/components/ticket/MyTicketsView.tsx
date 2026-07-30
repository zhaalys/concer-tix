"use client";

import { TicketData } from "@/lib/ticketStore";

export default function MyTicketsView({ tickets }: { tickets: TicketData[] }) {
  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "64px 32px 80px" }}>

        {tickets.length === 0 ? (
          <div style={{ padding: "48px 0" }}>
            <p style={{ fontSize: "14px", fontWeight: 500, color: "#9B9B9B", margin: 0 }}>No tickets yet</p>
            <p style={{ fontSize: "13px", color: "#BDBDBD", marginTop: "6px" }}>Tickets you purchase will appear here</p>
          </div>
        ) : (
          <div>
            {tickets.map((ticket, i) => (
              <div
                key={ticket.ticketCode}
                onClick={ticket.status === "success" ? () => window.open(`/my-tickets/${encodeURIComponent(ticket.ticketCode)}`, "_blank") : undefined}
                style={{
                  border: "1px solid #EBEBEB",
                  borderRadius: "8px",
                  padding: "20px",
                  cursor: ticket.status === "success" ? "pointer" : "default",
                  marginBottom: i < tickets.length - 1 ? "12px" : "0",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "24px" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span style={{
                        fontSize: "11px", fontWeight: 500,
                        color: ticket.status === "success" ? "#000000" : "#9B9B9B",
                      }}>
                        {ticket.status === "success" ? "Success" : "Pending"}
                      </span>
                      <span style={{ fontSize: "11px", color: "#BDBDBD" }}>{ticket.purchasedAt}</span>
                    </div>
                    <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#000000", margin: "0 0 4px", lineHeight: "1.4" }}>
                      {ticket.eventTitle}
                    </h3>
                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", fontSize: "12px", color: "#6B6B6B" }}>
                      <span>{ticket.eventDate}</span>
                      <span>{ticket.category}</span>
                      <span>{ticket.eventLocation}</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px", flexShrink: 0 }}>
                    <p style={{ fontSize: "15px", fontWeight: 600, color: "#000000", margin: 0 }}>
                      Rp{ticket.price.toLocaleString("id-ID")}
                    </p>
                    <span style={{
                      fontSize: "12px", fontWeight: 500,
                      color: ticket.status === "success" ? "#000000" : "#D0D0D0",
                      borderBottom: ticket.status === "success" ? "1px solid #000000" : "1px solid #D0D0D0",
                    }}>
                      View E-Ticket
                    </span>
                  </div>
                </div>

                {/* Map */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ticket.eventLocation)}`, "_blank");
                  }}
                  style={{ textDecoration: "none", display: "block", marginTop: "12px", cursor: "pointer" }}
                >
                  <div
                    style={{
                      borderRadius: "8px",
                      overflow: "hidden",
                      border: "1px solid #EBEBEB",
                      position: "relative",
                    }}
                  >
                    <iframe
                      src={`https://www.google.com/maps?q=${encodeURIComponent(ticket.eventLocation)}&output=embed`}
                      width="100%"
                      height="120"
                      style={{ border: 0, display: "block", pointerEvents: "none" }}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Event Location"
                    />
                    <div
                      style={{
                        position: "absolute", inset: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >
                      <span
                        style={{
                          backgroundColor: "#ffffff",
                          padding: "5px 12px",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "#1A1D2E",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: "12px" }}>open_in_new</span>
                        Buka Google Maps
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
