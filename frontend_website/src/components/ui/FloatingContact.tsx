"use client";

export default function FloatingContact() {
  return (
    <a
      href="https://wa.me/6281316936289"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: "fixed",
        bottom: "40px",
        right: "0",
        zIndex: 999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        backgroundColor: "#33D6D4",
        borderRadius: "120px 0 0 120px",
        padding: "28px 36px 28px 40px",
        textDecoration: "none",
        minWidth: "200px",
        cursor: "pointer",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/eye/eye.png"
        alt="Contact"
        style={{
          width: "52px",
          height: "52px",
          objectFit: "contain",
          display: "block",
        }}
      />
      <span
        style={{
          fontSize: "13px",
          fontWeight: 700,
          color: "#ffffff",
          whiteSpace: "nowrap",
          letterSpacing: "-0.01em",
        }}
      >
        Contact Us
      </span>
    </a>
  );
}
