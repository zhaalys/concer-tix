"use client";

import { useState } from "react";
import FloatingContact from "@/components/ui/FloatingContact";

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #E9ECEF",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 16px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          gap: "12px",
        }}
      >
        <span style={{ fontSize: "12px", fontWeight: 700, color: "#1A1D2E" }}>{question}</span>
        <span
          style={{
            fontSize: "16px",
            color: "#0E9375",
            fontWeight: 700,
            flexShrink: 0,
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
            display: "inline-block",
          }}
        >
          +
        </span>
      </button>
      {open && (
        <div style={{ padding: "0 16px 12px", fontSize: "11px", color: "#495057", lineHeight: 1.7 }}>
          {answer}
        </div>
      )}
    </div>
  );
}

const FAQ_ITEMS = [
  {
    q: "What is Concer TIX?",
    a: "Concer TIX is a ticketing platform for concerts and live events. We provide digital tickets, wristband printing, and gate scanning integration for event organizers and attendees.",
  },
  {
    q: "How do I buy a ticket?",
    a: "Browse the available events on our homepage, select your desired event, choose your ticket category, and complete the payment process. Your e-ticket will be sent to your email.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept a wide range of payment methods including bank transfers (BCA, BNI, BRI, Mandiri, BSI, BTN), e-wallets (GoPay, ShopeePay, QRIS), credit/debit cards (Visa, Mastercard), and convenience stores (Indomaret, Alfamart).",
  },
  {
    q: "Can I get a refund for my ticket?",
    a: "Refunds are subject to the event organizer's policy. Please check the event detail page for the specific refund terms before purchasing.",
  },
  {
    q: "What is a wristband ticket?",
    a: "A wristband ticket is a physical fabric wristband used as your event entry pass. It can be customized with or without a QR Code for gate scanning.",
  },
  {
    q: "How do I order a wristband?",
    a: "Visit the Wristband Ticket page, select your QR Code preference, enter your desired print quantity, and click Order Now. Production takes 6–9 working days.",
  },
  {
    q: "Is the QR Code on the wristband scannable at the gate?",
    a: "Yes! Wristbands ordered with QR Code are fully integrated with the gate scanning system for fast and seamless entry.",
  },
  {
    q: "How can I contact support?",
    a: "You can reach us via the Contact Us button on this page, or through our official social media channels. Our team is ready to help you.",
  },
];

export default function FAQView() {
  return (
    <div style={{ backgroundColor: "#F7F9FB", minHeight: "100vh" }}>
      <style>{`
        .faq-wrap {
          max-width: 800px;
          margin: 0 auto;
          padding: 64px 32px 100px;
        }
        @media (max-width: 767px) {
          .faq-wrap {
            padding: 24px 16px 80px !important;
          }
        }
      `}</style>
      <div className="faq-wrap">

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/banner/banner_5.png" alt=""
          style={{ width: "100%", height: "auto", display: "block", marginBottom: "28px", borderRadius: "8px" }} />

        <h1
          style={{
            fontSize: "20px",
            fontWeight: 800,
            color: "#1A1D2E",
            textAlign: "center",
            marginBottom: "28px",
          }}
        >
          Frequently Asked <span style={{ color: "#0E9375" }}>Questions!</span>
        </h1>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {FAQ_ITEMS.map((item, i) => (
            <FAQItem key={i} question={item.q} answer={item.a} />
          ))}
        </div>

      </div>

      <FloatingContact />
    </div>
  );
}
