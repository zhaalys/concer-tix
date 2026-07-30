"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FloatingContact from "@/components/ui/FloatingContact";


const VARIANTS = [
  {
    label: "Without QR",
    thumbnails: [
      "/tiket_version/gelang_kain_1.png",
      "/tiket_version/gelang_kain_2.png",
      "/tiket_version/gelang_kain_3.png",
    ],
  },
  {
    label: "With QR",
    thumbnails: [
      "/tiket_version/gelang_kain_qr_1.png",
      "/tiket_version/gelang_kain_qr_2.png",
      "/tiket_version/gelang_kain_qr_3.png",
    ],
  },
];

const BENEFITS = [
  { icon: "group", label: "Integrated" },
  { icon: "brush", label: "Customizable" },
  { icon: "style", label: "Varied Types" },
  { icon: "payments", label: "Competitive Price" },
  { icon: "bolt", label: "Fast Process" },
  { icon: "verified", label: "Trusted" },
];

export default function WristbandView() {
  const router = useRouter();
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [selectedThumb, setSelectedThumb] = useState(0);
  const [qty, setQty] = useState("");

  const currentVariant = VARIANTS[selectedVariant];
  const mainImage = currentVariant.thumbnails[selectedThumb];

  const pricePerPcs = 3500;
  const total = qty ? parseInt(qty) * pricePerPcs : 0;

  const handleVariant = (idx: number) => {
    setSelectedVariant(idx);
    setSelectedThumb(0);
  };

  return (
    <>
    <div style={{ backgroundColor: "#F7F9FB", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "48px 32px 80px" }}>

        {/* banner_4 */}
        <div style={{ borderRadius: "20px", overflow: "hidden", marginBottom: "48px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/banner/banner_4.png"
            alt="Wristband Ticket - Concer TIX"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>

        {/* Top product section */}
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "48px", alignItems: "start" }}>

          {/* Left: thumbnails + main image */}
          <div style={{ display: "flex", gap: "16px" }}>
            {/* Thumbnails */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {currentVariant.thumbnails.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedThumb(i)}
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "10px",
                    border: selectedThumb === i ? "2px solid #1ABC9C" : "2px solid #E9ECEF",
                    overflow: "hidden",
                    cursor: "pointer",
                    padding: 0,
                    backgroundColor: "#ffffff",
                    flexShrink: 0,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </button>
              ))}
            </div>

            {/* Main image */}
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mainImage}
                alt="Wristband"
                style={{ width: "100%", height: "auto", objectFit: "contain", display: "block" }}
              />
            </div>
          </div>

          {/* Right: product details */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

            {/* QR Variant */}
            <div>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "#1A1D2E", marginBottom: "6px" }}>QR Code</p>
              <div style={{ display: "flex", gap: "6px" }}>
                {VARIANTS.map((v, idx) => (
                  <button
                    key={v.label}
                    onClick={() => handleVariant(idx)}
                    style={{
                      padding: "5px 14px",
                      borderRadius: "6px",
                      border: selectedVariant === idx ? "2px solid #0E9375" : "1.5px solid #DEE2E6",
                      backgroundColor: selectedVariant === idx ? "#E6F7F4" : "#ffffff",
                      color: selectedVariant === idx ? "#0E9375" : "#495057",
                      fontSize: "11px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "#1A1D2E", marginBottom: "6px" }}>Description</p>
              <ul style={{ margin: 0, paddingLeft: "14px", display: "flex", flexDirection: "column", gap: "2px" }}>
                {[
                  "Premium tissue fabric material",
                  "Wristband size (Length 33cm x Width 1.5cm)",
                  "Single-sided print",
                  "Water resistant",
                  "Stain resistant",
                  "Tangle resistant",
                  "Uses central lock system",
                ].map((item) => (
                  <li key={item} style={{ fontSize: "11px", color: "#495057", lineHeight: 1.5 }}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Quantity */}
            <div>
              <p style={{ fontSize: "10px", fontWeight: 700, color: "#1A1D2E", marginBottom: "4px" }}>Print Quantity</p>
              <input
                type="number"
                min={1}
                placeholder="Enter print quantity"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                style={{
                  width: "100%",
                  padding: "5px 8px",
                  borderRadius: "6px",
                  border: "1.5px solid #DEE2E6",
                  fontSize: "10px",
                  color: "#1A1D2E",
                  outline: "none",
                  backgroundColor: "#ffffff",
                }}
              />
            </div>

            {/* Price info */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
              <div
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #E9ECEF",
                  borderRadius: "6px",
                  padding: "6px 8px",
                }}
              >
                <p style={{ fontSize: "9px", color: "#868E96", margin: "0 0 1px" }}>Production Time</p>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "#1A1D2E", margin: 0 }}>6-9 days</p>
              </div>
              <div
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #E9ECEF",
                  borderRadius: "6px",
                  padding: "6px 8px",
                }}
              >
                <p style={{ fontSize: "9px", color: "#868E96", margin: "0 0 1px" }}>Price per Wristband</p>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "#1A1D2E", margin: 0 }}>Rp3.500/pcs</p>
              </div>
            </div>

            {/* Total */}
            <div
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #E9ECEF",
                borderRadius: "6px",
                padding: "6px 8px",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: "9px", color: "#868E96", margin: "0 0 1px" }}>Total Price</p>
              <p style={{ fontSize: "12px", fontWeight: 800, color: "#1A1D2E", margin: 0 }}>
                {total > 0 ? `Rp${total.toLocaleString("id-ID")}` : "Rp0"}
              </p>
            </div>

            {/* CTA */}
            <button
              onClick={() => {
                const q = parseInt(qty) || 1;
                const v = selectedVariant === 0 ? "without_qr" : "with_qr";
                router.push(`/wristband/order?variant=${v}&qty=${q}`);
              }}
              style={{
                width: "100%",
                padding: "8px",
                backgroundColor: "#0E9375",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                letterSpacing: "-0.01em",
              }}
            >
              Order Now
            </button>
          </div>
        </div>

      </div>
    </div>
    <FloatingContact />
    </>
  );
}
