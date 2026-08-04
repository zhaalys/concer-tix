"use client";

import { useRouter } from "next/navigation";

export default function Banner2({ src, link }: { src?: string | null; link?: string | null }) {
  const router = useRouter();
  if (!src) return null;

  const open = () => {
    if (link) {
      if (link.startsWith("http")) {
        window.open(link, "_blank", "noopener,noreferrer");
      } else {
        router.push(link);
      }
    }
  };

  return (
    <section
      style={{
        maxWidth: "1320px",
        margin: "0 auto",
        padding: "0 32px 48px",
      }}
    >
      <div
        onClick={open}
        style={{
          borderRadius: "20px",
          overflow: "hidden",
          cursor: link ? "pointer" : "default",
          position: "relative",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
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
