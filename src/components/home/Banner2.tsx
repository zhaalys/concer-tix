"use client";

export default function Banner2() {
  return (
    <section
      style={{
        maxWidth: "1320px",
        margin: "0 auto",
        padding: "0 32px 48px",
      }}
    >
      <div
        style={{
          borderRadius: "20px",
          overflow: "hidden",
          cursor: "pointer",
          position: "relative",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/banner/banner_2.png"
          alt="Banner Promo"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
          }}
        />
      </div>
    </section>
  );
}
