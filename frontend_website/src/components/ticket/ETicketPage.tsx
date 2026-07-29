"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { TicketData } from "@/lib/ticketStore";

export default function ETicketPage({ ticket }: { ticket: TicketData }) {
  const [winWidth, setWinWidth] = useState(0);
  const [showTataCara, setShowTataCara] = useState(true);

  useEffect(() => {
    setWinWidth(window.innerWidth);
    const onResize = () => setWinWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const qrData = JSON.stringify({
    code: ticket.ticketCode,
    event: ticket.eventTitle,
    holder: ticket.holderName,
    category: ticket.category,
  });

  const isMobile = winWidth < 600;
  const qrSize = isMobile ? Math.min(winWidth * 0.28, 110) : 280;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>
      {showTataCara && (
        <div
          onClick={() => setShowTataCara(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "24px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ position: "relative", maxWidth: "900px", width: "100%" }}
          >
            <button
              onClick={() => setShowTataCara(false)}
              style={{
                position: "absolute", top: "8px", right: "8px", zIndex: 1,
                width: "28px", height: "28px", borderRadius: "50%",
                backgroundColor: "rgba(0,0,0,0.5)", border: "none",
                color: "#fff", fontSize: "14px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              ✕
            </button>
            <img
              src="/scan_qr/tata_cara.png"
              alt="tata cara"
              style={{ width: "100%", height: "auto", display: "block", borderRadius: "8px" }}
            />
          </div>
        </div>
      )}
      <div style={{ position: "relative", maxWidth: isMobile ? "100%" : "1000px", width: "100%", margin: "0 auto" }}>
        <img
          src="/history_lanyard/lanyard_history.png"
          alt="lanyard"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
        <div style={{
          position: "absolute",
          top: isMobile ? "62%" : "62%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}>
          <QRCodeSVG value={qrData} size={qrSize} level="H" />
        </div>
      </div>
    </div>
  );
}
