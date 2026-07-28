"use client";

const footerLinks = {
  "About LOKET": ["About Us", "Terms & Conditions", "Privacy Policy", "Careers"],
  "Event Creator": ["Pricing", "Partner With Us", "Creator Guide", "LOKET Creator"],
  Support: ["Contact Support", "Terms & Conditions", "Privacy Policy", "Cookie Policy"],
};

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#e0e3e5",
        borderTop: "1px solid #c3c5d7",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "48px 32px",
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
          gap: "24px",
        }}
      >
        {/* Brand column */}
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo/tix_logo.png?v=3"
            alt="Concer TIX Logo"
            style={{
              height: "100px",
              width: "auto",
              objectFit: "contain",
              display: "block",
              marginBottom: "1px",
            }}
          />
          <p
            style={{
              fontSize: "14px",
              color: "#434654",
              maxWidth: "280px",
              lineHeight: "20px",
              marginBottom: "24px",
            }}
          >
            Buy concert tickets, festival passes, sports events, and other exciting events easily on Concer
            TIX. #GETTICKETS for your favorite events &amp; experiences!
          </p>
          <div style={{ display: "flex", gap: "16px" }}>
            {["public", "alternate_email", "share"].map((icon) => (
              <a
                key={icon}
                href="#"
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#ffffff",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#003599",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  textDecoration: "none",
                  transition: "transform 150ms",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)";
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                  {icon}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(footerLinks).map(([heading, links]) => (
          <div key={heading}>
            <h5
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#003599",
                marginBottom: "16px",
                letterSpacing: "0.01em",
              }}
            >
              {heading}
            </h5>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
              {links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    style={{
                      fontSize: "14px",
                      color: "#434654",
                      textDecoration: "none",
                      transition: "color 150ms",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = "#0049CC";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = "#434654";
                    }}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Payment column */}
        <div>
          <h5
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#003599",
              marginBottom: "16px",
              letterSpacing: "0.01em",
            }}
          >
            Payment Methods
          </h5>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              alignItems: "center",
              maxWidth: "400px",
            }}
          >
            {[
              { name: "QRIS", src: "/img_payment/qris.png" },
              { name: "BCA", src: "/img_payment/bca.png" },
              { name: "Mandiri", src: "/img_payment/mandiri.png" },
              { name: "BNI", src: "/img_payment/bni.png" },
              { name: "BRI", src: "/img_payment/bri.png" },
              { name: "GoPay", src: "/img_payment/gopay.png" },
              { name: "ShopeePay", src: "/img_payment/shopeepay.png" },
              { name: "Visa", src: "/img_payment/visa.png" },
              { name: "Mastercard", src: "/img_payment/mastercard.png" },
              { name: "Alfamart", src: "/img_payment/alfamart.png" },
              { name: "Indomaret", src: "/img_payment/indomaret.png" },
              { name: "BSI", src: "/img_payment/bsi.png" },
            ].map((pm) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={pm.name}
                src={pm.src}
                  alt={pm.name}
                style={{
                  height: "52px",
                  width: "auto",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "24px 32px",
          borderTop: "1px solid #c3c5d7",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "12px", color: "#737686", margin: 0 }}>
          © 2024 Concer TIX. All rights reserved. Part of Global Loket Sejahtera.
        </p>
      </div>
    </footer>
  );
}
