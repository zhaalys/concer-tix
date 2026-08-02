"use client";

export default function FloatingContact() {
  return (
    <>
      <style>{`
        .floating-contact {
          position: fixed;
          bottom: 40px;
          right: 0;
          z-index: 999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background-color: #33D6D4;
          border-radius: 120px 0 0 120px;
          padding: 28px 36px 28px 40px;
          text-decoration: none;
          min-width: 200px;
          cursor: pointer;
          box-shadow: 0 4px 24px rgba(51,214,212,0.35);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .floating-contact:hover {
          transform: translateX(-4px);
          box-shadow: 0 8px 32px rgba(51,214,212,0.45);
        }
        .floating-contact-img {
          width: 52px;
          height: 52px;
          object-fit: contain;
          display: block;
        }
        .floating-contact-label {
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
          white-space: nowrap;
          letter-spacing: -0.01em;
        }

        @media (max-width: 767px) {
          .floating-contact {
            /* On mobile: sit above the bottom nav (≈72px tall) + extra 8px gap */
            bottom: 84px;
            padding: 14px 18px 14px 22px;
            min-width: unset;
            gap: 6px;
            border-radius: 80px 0 0 80px;
          }
          .floating-contact-img {
            width: 32px;
            height: 32px;
          }
          .floating-contact-label {
            font-size: 11px;
          }
        }
      `}</style>
      <a
        href="https://wa.me/6281316936289"
        target="_blank"
        rel="noopener noreferrer"
        className="floating-contact"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/eye/eye.png"
          alt="Contact"
          className="floating-contact-img"
        />
        <span className="floating-contact-label">
          Contact Us
        </span>
      </a>
    </>
  );
}
