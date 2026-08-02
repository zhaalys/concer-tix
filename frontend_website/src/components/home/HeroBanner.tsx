"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const slides = [
  { img: "/banner/banner_1.png", alt: "Banner 1" },
  { img: "/banner/banner_6.png", alt: "Banner 2" },
];

const INTERVAL = 7000;

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((idx: number) => {
    setCurrent(((idx % slides.length) + slides.length) % slides.length);
  }, []);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, INTERVAL);
  }, []);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  const onManual = (fn: () => void) => () => {
    fn();
    startTimer();
  };

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
        {/* Slides */}
        <div style={{ position: "relative", width: "100%", height: "clamp(240px, 34vw, 480px)" }}>
          {slides.map((slide, idx) => (
            <div
              key={slide.img}
              style={{
                position: "absolute",
                inset: 0,
                transform: `translateX(${(idx - current) * 100}%)`,
                transition: "transform 0.5s ease",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.img}
                alt={slide.alt}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  borderRadius: "20px",
                }}
              />
            </div>
          ))}
        </div>

        {/* Prev arrow */}
        <button
          onClick={onManual(prev)}
          aria-label="Sebelumnya"
          style={{
            position: "absolute",
            left: 14,
            top: "50%",
            transform: "translateY(-50%)",
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "none",
            background: "rgba(255,255,255,0.85)",
            color: "#0d1b3e",
            fontSize: 20,
            lineHeight: 1,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          ‹
        </button>

        {/* Next arrow */}
        <button
          onClick={onManual(next)}
          aria-label="Berikutnya"
          style={{
            position: "absolute",
            right: 14,
            top: "50%",
            transform: "translateY(-50%)",
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "none",
            background: "rgba(255,255,255,0.85)",
            color: "#0d1b3e",
            fontSize: 20,
            lineHeight: 1,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          ›
        </button>

        {/* Dots */}
        <div
          style={{
            position: "absolute",
            bottom: 12,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            gap: 8,
          }}
        >
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={onManual(() => goTo(idx))}
              aria-label={`Banner ${idx + 1}`}
              style={{
                width: idx === current ? 22 : 8,
                height: 8,
                borderRadius: 4,
                border: "none",
                background: idx === current ? "#0d1b3e" : "rgba(13,27,62,0.35)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
