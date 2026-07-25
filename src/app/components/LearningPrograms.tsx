"use client";
import { useState } from "react";

const courses = [
  {
    img: "https://lh3.googleusercontent.com/aida/AP1WRLuVU8mKxJYWhEGXFbB4787Tq_7VTBwUrVWVL0TQHVtyTomOsQk3IkTTacAlR8BB3RC66yirRwhSuw5CRDHLyNYtiuCkzkG_vjW-aPP4IPPIrOTLHaQff2Q6OWGv0CaDWEATTmRjtq2-g_dzG0GzVvNQXta-uGvLQKB_s4x6aEzSoPBp4W0eG3v9EHhASk0RyS0H7z0Dabt1TNQNskq2-8s7Tf50q_MgDoMBDMBm9aT8ytQqQQfxa3xtbKeM",
    title: "Math Masterclass SD Kelas 5",
    organizer: "Merdeka Academy",
    rating: 4.8,
    reviews: 1240,
    price: "Rp 150.000",
    tag: "Best Seller",
    tagColor: "#FF6B2C",
    duration: "24 jam",
  },
  {
    img: "https://lh3.googleusercontent.com/aida/AP1WRLuXMxFt4Z69shT7Bscd6WQp4Tnlmp_TKEumdrSoEe_JQ8tJ9LHDH3g4hRngm7OPL0JDtxdNrD9oOwyS1580-jTTWihzW-bVSG9yTol7vQLKjhwqcDcJ07_C9AkGyjkP1RAqw_sVKJLaHBpq7U7ZDJselL81bNe4GMApg06c_1GoSeSiwR8-LuuPqEegogbPU0yRy7ktPEPfi2LOBq4c-_x0mDs3i51GnXTqTJIIbhBeWtQ7_rjPNTJCQbP7",
    title: "English Fluency for Professional",
    organizer: "Global Lingua",
    rating: 4.7,
    reviews: 892,
    price: "Rp 250.000",
    tag: "Populer",
    tagColor: "#7950F2",
    duration: "40 jam",
  },
  {
    img: "https://lh3.googleusercontent.com/aida/AP1WRLtTAS9xIOiUlagxiC2kDkZf9F-3LoS8BcHdQkZso_Ga-J0hrcSR8vopfS1MsK-ORdlvEnHuFRe5cx7IG3wVCDN7o38JnI_bXR5qlprtdji_hVmokrAparu3JLiXvkIOUCtF84Q3kzN63zBUsZpK6fOFx4nOc3MbUdsxABF6Ladn16v7c7qdSlna1l4A0VVel9mJ4GYxgSl-0Kyb86ZODUiRV_4OvjrM4A_jixgl5KlZt3C4_AZkamRdSV8-",
    title: "UI/UX Design Intensive Bootcamp",
    organizer: "Pixel Academy",
    rating: 4.9,
    reviews: 2100,
    price: "Rp 1.200.000",
    tag: "Top Rated",
    tagColor: "#2F9E44",
    duration: "60 jam",
  },
  {
    img: "https://lh3.googleusercontent.com/aida/AP1WRLsQAzrnS-hDeHnjNIPMhEDVgupk0M7-DvjjRgvwWGOzFQcmPPc_OqvwyABxP7Iv2jrl580zYx3QwqE5ITbP0OSnR8YHRbsZHQI93aww--vG4v5iyVnsL6bAh8WZvgQOihOkDXpg6OTDeAmrtjU2jCuFrjcfFKAOroQ6Gczbon0vW2rSiTp8GPUk8KIFpVj3796J4Ij2AJyMTkDmF44rYmNY7IOl4EgT2jcIsoYDYJp9QIWFJwGneR15ptc",
    title: "Digital Marketing Specialist 2024",
    organizer: "Growth Hub",
    rating: 4.6,
    reviews: 780,
    price: "Rp 800.000",
    tag: "Baru",
    tagColor: "#1098AD",
    duration: "36 jam",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className="material-symbols-outlined"
          style={{
            fontSize: "12px",
            color: star <= Math.round(rating) ? "#FFD43B" : "#DEE2E6",
            fontVariationSettings: "'FILL' 1",
          }}
        >
          star
        </span>
      ))}
    </div>
  );
}

function CourseCard({ course }: { course: (typeof courses)[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid #E4E8F0",
        cursor: "pointer",
        transition: "all 0.25s cubic-bezier(.25,.8,.25,1)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 16px 48px rgba(13,27,62,0.1)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ position: "relative", overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={course.img}
          alt={course.title}
          style={{
            width: "100%",
            aspectRatio: "16/9",
            objectFit: "cover",
            transition: "transform 0.5s ease",
            transform: hovered ? "scale(1.05)" : "scale(1)",
            display: "block",
          }}
        />
        <span
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            backgroundColor: course.tagColor,
            color: "#fff",
            padding: "3px 10px",
            borderRadius: "100px",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.04em",
          }}
        >
          {course.tag}
        </span>
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            backgroundColor: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(8px)",
            color: "#fff",
            padding: "3px 8px",
            borderRadius: "6px",
            fontSize: "10px",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "3px",
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "11px", fontVariationSettings: "'FILL' 1" }}>
            schedule
          </span>
          {course.duration}
        </div>
      </div>

      <div style={{ padding: "14px 16px 16px" }}>
        <h4
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "#1A1D2E",
            marginBottom: "4px",
            lineHeight: 1.35,
            letterSpacing: "-0.01em",
          }}
        >
          {course.title}
        </h4>
        <p style={{ fontSize: "12px", color: "#8892A4", marginBottom: "10px" }}>
          Oleh <span style={{ fontWeight: 600, color: "#3B5BDB" }}>{course.organizer}</span>
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
          <span style={{ fontSize: "13px", fontWeight: 700, color: "#FFD43B" }}>{course.rating}</span>
          <StarRating rating={course.rating} />
          <span style={{ fontSize: "11px", color: "#ADB5BD" }}>({course.reviews.toLocaleString("id-ID")})</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p
            style={{
              fontFamily: "'Hanken Grotesk', sans-serif",
              fontSize: "16px",
              fontWeight: 800,
              color: "#0D1B3E",
              letterSpacing: "-0.02em",
            }}
          >
            {course.price}
          </p>
          <button
            style={{
              padding: "6px 14px",
              backgroundColor: hovered ? "#3B5BDB" : "#EDF2FF",
              color: hovered ? "#fff" : "#3B5BDB",
              border: "none",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            Daftar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LearningPrograms() {
  return (
    <section style={{ maxWidth: "1320px", margin: "0 auto", padding: "64px 32px" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "28px" }}>
        <div>
          <div style={{ marginBottom: "8px" }}>
            <h2 className="section-heading">Program Belajar Terpopuler</h2>
          </div>
          <p style={{ fontSize: "14px", color: "#8892A4", marginLeft: "14px" }}>
            Tingkatkan skill kamu bersama tutor berpengalaman
          </p>
        </div>
        <a
          href="#"
          style={{ fontSize: "13px", fontWeight: 600, color: "#3B5BDB", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}
        >
          Semua Kelas
          <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>chevron_right</span>
        </a>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
        {courses.map((course, i) => (
          <CourseCard key={i} course={course} />
        ))}
      </div>
    </section>
  );
}
