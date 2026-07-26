"use client";

const categories = [
  { icon: "music_note", label: "Musik" },
  { icon: "gallery_thumbnail", label: "Pameran" },
  { icon: "attractions", label: "Wahana" },
  { icon: "theater_comedy", label: "Teater" },
  { icon: "sports_soccer", label: "Olahraga" },
  { icon: "map", label: "Wisata" },
  { icon: "mic", label: "Talkshow" },
  { icon: "school", label: "Workshop" },
  { icon: "trophy", label: "Kompetisi" },
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
      {/* Category circle list */}
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
    <button
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
      }}
    >
      {/* White Circle Icon */}
      <div
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
      </div>

      {/* Label Text */}
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
    </button>
  );
}
