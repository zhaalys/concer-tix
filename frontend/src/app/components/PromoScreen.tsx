"use client";

export default function PromoScreen() {
  return (
    <section style={{ backgroundColor: "#F8F9FA", padding: "64px 0", borderTop: "1px solid #E9ECEF" }}>
      <div style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 32px" }}>
        <div
          style={{
            borderRadius: "24px",
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            minHeight: "380px",
            position: "relative",
          }}
        >
          {/* Left: Movie wall */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gridTemplateRows: "1fr 1fr",
              gap: "6px",
              padding: "0",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {[
              { src: "https://lh3.googleusercontent.com/aida/AP1WRLuo4Cmi-Yvh3DJPNOKq50TjxiRUG_WrQp3yx4gz0HMzXztyyt_wGEGvb-iO602J1hQkvColUS03TITBrEJLIx2C5WrhqZIz4GLZw2ycnFiF6b5MNZ8FLEOdgbhidIUY-HKC_W5mB1c9UpQEufTx4sDs0KVI9ACYDGfZ3r8-wJuDT_hfzilXdkLQk8cLOCzm0c9nJzce7eb5lfYa1j2d5zwh3u4d3o0yZQM-roQzXeOfSWW5bZwFrNpP4KJF", span: 2 },
              { src: "https://lh3.googleusercontent.com/aida/AP1WRLtJK-LyrG2R-8JPw9cz9D-tUiqh2DJ7z8Mnn9NIzRmcgrbyzXpiBekONRNFp-yc3YLrdGmj-meeBk58wQVwD-OcBXVCwa7vNmfvl9OpDFhWWyznGbi8o4rmEEGoGFvWI2ztvVMq_9Zz8BQcplR5G8txBQRm2c1qwinwAslZqc5NKrBHsVSjN6MNSZnuZ7hqSLBR_kc-9qEP9r4iASZRatOykNBs_9FO8ZEKRcTyzbEx1598VrymGmQ-VdnE", span: 1 },
              { src: "https://lh3.googleusercontent.com/aida/AP1WRLt4twpyinTDPRivMBonQnHMVJA8Vccc2Q-cJg5QcM8INxNurX0H6IsF98zjbWLzQa0rTEyB32rnhHgJxoCvQN8jVqd8rviKchOZavW45QtgNN42f09gsGcbat3jN2ocoMVH0SOumqpgU5S_pMQ90l6o5alxIiPqIPHUGuNo3DwvMXyzPlcwWNuSd8cRtyxgKpozWDPLwZ8gK7kF-gQ0w7xtOpLUFg93wrVC1UqUZyWVXVggse-XYXxrr1MZ", span: 1 },
              { src: "https://lh3.googleusercontent.com/aida/AP1WRLs65BmVCTKYYZzAApSGPqR_bkrUJ-BVcXyyjY-V1JMFH2MNKPwQzxAPhdpGVOuGVV5WBPJE3zq95n0BIQC6FNlJ0sKWr3LrWdSR_epugTSAOdJCNqcYkqJj_5ftkaskK_dnjP6igH6K-Gz-kgOSzxbrDGIRe4yNQ2QGsMQbcJpqV8WqK9ddeQAZ0mXHT1ZGbP-_s_ZRSteF2tlP-pi52UGL5js-XOzGqPXVHvQRF7kdypfqVi-mUUxCxEU", span: 2 },
            ].map((item, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={item.src}
                alt={`Film ${i + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  minHeight: "185px",
                  objectFit: "cover",
                  gridColumn: `span ${item.span}`,
                  display: "block",
                }}
              />
            ))}
            {/* Overlay on left side */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "rgba(8,15,36,0.3)",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Right: Promo content */}
          <div
            style={{
              backgroundColor: "#0D1B3E",
              padding: "52px 48px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "relative", zIndex: 2 }}>
              <h2
                style={{
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  fontSize: "34px",
                  fontWeight: 900,
                  color: "#ffffff",
                  lineHeight: 1.15,
                  letterSpacing: "-0.03em",
                  marginBottom: "16px",
                }}
              >
                Nonton Film Terbaru
                <br />
                <span
                  style={{
                    color: "#FF6B2C",
                  }}
                >
                  Langsung di Sini!
                </span>
              </h2>
              <p
                style={{
                  fontSize: "15px",
                  color: "rgba(255,255,255,0.6)",
                  lineHeight: "24px",
                  marginBottom: "36px",
                }}
              >
                Pesan tiket bioskop tanpa antri. Pilih kursi favoritmu dan nikmati film terbaru dengan mudah.
              </p>

              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <button
                  style={{
                    backgroundColor: "#FF6B2C",
                    color: "#fff",
                    padding: "13px 28px",
                    borderRadius: "100px",
                    fontSize: "14px",
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 6px 24px rgba(255,107,44,0.4)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    const b = e.currentTarget as HTMLButtonElement;
                    b.style.transform = "translateY(-2px)";
                    b.style.boxShadow = "0 10px 32px rgba(255,107,44,0.55)";
                  }}
                  onMouseLeave={(e) => {
                    const b = e.currentTarget as HTMLButtonElement;
                    b.style.transform = "translateY(0)";
                    b.style.boxShadow = "0 6px 24px rgba(255,107,44,0.4)";
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "18px", fontVariationSettings: "'FILL' 1" }}>
                    local_activity
                  </span>
                  Beli Tiket Bioskop
                </button>
                <button
                  style={{
                    backgroundColor: "rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.75)",
                    padding: "13px 24px",
                    borderRadius: "100px",
                    fontSize: "14px",
                    fontWeight: 600,
                    border: "1px solid rgba(255,255,255,0.15)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    const b = e.currentTarget as HTMLButtonElement;
                    b.style.backgroundColor = "rgba(255,255,255,0.15)";
                    b.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    const b = e.currentTarget as HTMLButtonElement;
                    b.style.backgroundColor = "rgba(255,255,255,0.08)";
                    b.style.color = "rgba(255,255,255,0.75)";
                  }}
                >
                  Lihat Jadwal
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
