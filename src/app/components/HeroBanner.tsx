"use client";

const slides = [
  { img: "/benner/benner_1.png", alt: "Banner 1" },
];

export default function HeroBanner() {
  return (
    <section style={{ padding: "48px 32px 32px", maxWidth: "1320px", margin: "0 auto" }}>
      <div
        style={{
          position: "relative",
          borderRadius: "20px",
          overflow: "hidden",
          width: "100%",
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        }}
      >
        {/* Banner image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={slides[0].img}
          alt={slides[0].alt}
          style={{
            width: "100%",
            height: "auto",
            maxHeight: "480px",
            objectFit: "cover",
            display: "block",
            borderRadius: "20px",
          }}
        />
      </div>
    </section>
  );
}
