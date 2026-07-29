"use client";

import Link from "next/link";

const categories = [
  { icon: "music_note", label: "Pop", query: "Pop & Rock" },
  { icon: "graphic_eq", label: "Rock", query: "Pop & Rock" },
  { icon: "piano", label: "Jazz", query: "Arts & Culture" },
  { icon: "mic", label: "Hip Hop", query: "Music Concert" },
  { icon: "headphones", label: "EDM", query: "Festival" },
  { icon: "album", label: "Indie", query: "Indie & Alternative" },
  { icon: "queue_music", label: "R&B", query: "Music Concert" },
  { icon: "lyrics", label: "Folk", query: "Arts & Culture" },
  { icon: "settings_input_component", label: "Metal", query: "Pop & Rock" },
];

export default function Categories() {
  return (
    <section
      style={{
        maxWidth: "1320px",
        margin: "0 auto",
        padding: "30px 45px 40px",
      }}
    >
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
      <span
        className="material-symbols-outlined"
        style={{
          fontSize: "35px",
          color: "#1ABC9C",
          fontVariationSettings: "'FILL' 1",
        }}
      >
        {cat.icon}
      </span>
      <span
        style={{
          fontSize: "13px",
          fontWeight: 600,
          color: "#2D3748",
          whiteSpace: "nowrap",
        }}
      >
        {cat.label}
      </span>
    </Link>
  );
}
