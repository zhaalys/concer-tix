"use client";

import FloatingContact from "@/components/ui/FloatingContact";

export default function PricingView() {
  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>
      <section
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "48px 32px 80px",
        }}
      >
        <div style={{ borderRadius: "20px", overflow: "hidden" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/banner/banner_5.png"
            alt="Pricing - Concer TIX"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>
      </section>

      <FloatingContact />
    </div>
  );
}
