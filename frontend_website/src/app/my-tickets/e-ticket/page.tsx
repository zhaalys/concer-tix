"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { TicketData } from "@/lib/ticketStore";

export default function ETicketPage() {
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [winWidth, setWinWidth] = useState(0);

  useEffect(() => {
    const data = sessionStorage.getItem("eticket_data");
    if (data) {
      setTicket(JSON.parse(data));
    }
    setWinWidth(window.innerWidth);
    const onResize = () => setWinWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (!ticket) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <p style={{ fontSize: "13px", color: "#9B9B9B" }}>No ticket data found.</p>
      </div>
    );
  }

  const qrData = JSON.stringify({
    code: ticket.ticketCode,
    event: ticket.eventTitle,
    holder: ticket.holderName,
    category: ticket.category,
  });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>
      <div style={{ position: "relative", maxWidth: winWidth < 600 ? "100%" : "1000px", width: "100%", margin: "0 auto" }}>
        <img
          src="/history_lanyard/lanyard_history.png"
          alt="lanyard"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
        <div style={{
          position: "absolute",
          top: winWidth < 600 ? "62%" : "62%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}>
          <QRCodeSVG value={qrData} size={winWidth < 600 ? Math.min(winWidth * 0.28, 110) : 280} level="H" />
        </div>
      </div>
    </div>
  );
}
