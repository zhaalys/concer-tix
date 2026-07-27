"use client";

export default function AboutView() {
  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>
      {/* Banner Image */}
      <section
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "48px 32px 0",
        }}
      >
        <div
          style={{
            borderRadius: "20px",
            overflow: "hidden",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/banner/banner_3.png"
            alt="Concer TIX - Your Ticketing Partner"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
            }}
          />
        </div>
      </section>

      {/* Description */}
      <section
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "48px 32px 80px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <p style={{ fontSize: "15px", color: "#495057", lineHeight: "1.75", margin: 0 }}>
          Concer TIX is a Ticket Management Service (TMS) platform built to support every kind of live event: concerts, festivals, sports, and more. We make it effortless for organizers to create, market, sell, and distribute tickets with full transparency and control.
        </p>

        <p style={{ fontSize: "15px", color: "#495057", lineHeight: "1.75", margin: 0 }}>
          Our technology is designed to empower organizers and venue providers at every stage: from pre-event ticket distribution and management, right through to post-event reporting and settlement.
        </p>

        <p style={{ fontSize: "15px", color: "#495057", lineHeight: "1.75", margin: 0 }}>
          Concer TIX was founded with a single mission: to eliminate long queues and bring a fast, secure, and transparent ticket-buying experience to music fans across Indonesia. Now it is your turn. Let us help you sell your event tickets with ease.
        </p>
      </section>
    </div>
  );
}
