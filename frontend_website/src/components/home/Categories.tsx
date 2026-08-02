"use client";

import Link from "next/link";

const categories = [
  { img: "/icon/pop.png", label: "Pop", query: "Pop & Rock" },
  { img: "/icon/rock.png", label: "Rock", query: "Pop & Rock" },
  { img: "/icon/jazz.png", label: "Jazz", query: "Arts & Culture" },
  { img: "/icon/hiphop.png", label: "Hip Hop", query: "Music Concert" },
  { img: "/icon/edm.png", label: "EDM", query: "Festival" },
  { img: "/icon/indie.png", label: "Indie", query: "Indie & Alternative" },
  { img: "/icon/rnb.png", label: "R&B", query: "Music Concert" },
  { img: "/icon/folk.png", label: "Folk", query: "Arts & Culture" },
  { img: "/icon/metal.png", label: "Metal", query: "Pop & Rock" },
];

export default function Categories() {
  return (
    <section className="categories-section">
      <style>{`
        .categories-section {
          max-width: 1320px;
          margin: 0 auto;
          padding: 30px 45px 40px;
        }
        @media (max-width: 767px) {
          .categories-section {
            padding: 16px 16px 24px !important;
          }
        }
      `}</style>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          overflowX: "auto",
          padding: "8px 4px 16px",
        }}
        className="hide-scrollbar"
      >
        {categories.map((cat) => (
          <CategoryCircleItem key={cat.label} cat={cat} />
        ))}
      </div>
    </section>
  );
}

function CategoryCircleItem({ cat }: { cat: typeof categories[0] }) {
  return (
    <Link
      href={`/explore?genre=${encodeURIComponent(cat.label)}&category=${encodeURIComponent(cat.query)}`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
        background: "none",
        border: "none",
        cursor: "pointer",
        flexShrink: 0,
        padding: "4px",
        textDecoration: "none",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={cat.img}
        alt={cat.label}
        style={{ width: "40px", height: "40px", objectFit: "contain" }}
      />
    </Link>
  );
}
