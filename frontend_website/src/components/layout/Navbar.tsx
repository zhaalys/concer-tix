"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/explore" },
  { label: "My Tickets", href: "/my-tickets" },
  { label: "About", href: "/about" },
];

const artistPlaceholders = [
  "Search Sheila On 7...",
  "Search Coldplay...",
  "Search Hindia...",
  "Search Bernadya...",
  "Search Mahalini...",
  "Search Tulus...",
  "Search JKT48...",
  "Search Bruno Mars...",
  "Search Raisa...",
  "Search Pamungkas...",
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [artistIndex, setArtistIndex] = useState(0);
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!isMobile) setMobileMenuOpen(false);
  }, [isMobile]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user ?? null);
      setAvatarError(false);
      if (data?.session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.session.user.id)
          .maybeSingle();
        setIsAdmin(profile?.role === "admin" || profile?.role === "super_admin");
      }
    };
    init();
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      setAvatarError(false);
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .maybeSingle();
        setIsAdmin(profile?.role === "admin" || profile?.role === "super_admin");
      } else {
        setIsAdmin(false);
      }
    });
    return () => listener?.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setArtistIndex((prev) => (prev + 1) % artistPlaceholders.length);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (pathname === "/explore" && typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setSearchValue(params.get("q") || "");
    }
  }, [pathname]);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    const q = searchValue.trim();
    if (!q && pathname !== "/explore") return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const url = q ? `/explore?q=${encodeURIComponent(q)}` : "/explore";
      router.replace(url);
    }, 150);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchValue]);

  return (
    <>
      {/* Top Bar */}
      <div
        style={{
          backgroundColor: "#064E3B",
          height: "38px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "32px",
          overflowX: "auto",
          padding: "0 16px",
        }}
        className="top-bar"
      >
        <style>{`
          .top-bar {
            gap: 32px;
          }
          @media (max-width: 767px) {
            .top-bar {
              display: none !important;
            }
          }
        `}</style>
        {[
          { label: "Our Journey", href: "/our-journey" },
          { label: "Wristband Ticket", href: "/wristband" },
          { label: "FAQ!", href: "/faq" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            style={{
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: 500,
              textDecoration: "none",
              letterSpacing: "0.02em",
            }}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Main Navbar */}
      <nav
        style={{
          backgroundColor: "#ffffff",
          position: "sticky",
          top: 0,
          zIndex: 100,
          borderBottom: "1px solid #E9ECEF",
          transition: "box-shadow 0.3s ease",
          boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.08)" : "none",
        }}
      >
        <style>{`
          .navbar-container {
            max-width: 1320px;
            margin: 0 auto;
            padding: 0 32px;
            height: 76px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 32px;
          }
          .nav-logo-img {
            height: 70px;
            width: auto;
            object-fit: contain;
            display: block;
          }
          @media (max-width: 767px) {
            .navbar-container {
              padding: 0 16px !important;
              height: 64px !important;
              gap: 12px !important;
            }
            .nav-logo-img {
              height: 48px !important;
            }
          }
        `}</style>
        <div className="navbar-container">
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo/tix_logo.png?v=3"
                alt="Concer TIX Logo"
                className="nav-logo-img"
              />
            </Link>
          </div>

          {/* Center: Pill Nav + Search (desktop) */}
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, justifyContent: "center" }}>
              {/* Pill nav */}
              <div
                style={{
                  display: "flex",
                  backgroundColor: "#F1F3F5",
                  borderRadius: "100px",
                  padding: "4px",
                  gap: "2px",
                  flexShrink: 0,
                }}
              >
                {navLinks.map((link) => {
                  const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));

                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      style={{
                        padding: "7px 18px",
                        borderRadius: "100px",
                        fontSize: "13px",
                        fontWeight: 600,
                        textDecoration: "none",
                        color: isActive ? "#ffffff" : "#5A6072",
                        backgroundColor: isActive ? "#1ABC9C" : "transparent",
                        transition: "all 0.2s ease",
                        letterSpacing: "-0.01em",
                        boxShadow: "none",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.color = "#1A1D2E";
                          e.currentTarget.style.backgroundColor = "#E9ECEF";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.color = "#5A6072";
                          e.currentTarget.style.backgroundColor = "transparent";
                        }
                      }}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              {/* Search */}
              <div
                style={{
                  position: "relative",
                  flex: 1,
                  maxWidth: "340px",
                  marginLeft: "12px",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "18px",
                    color: searchFocused ? "#1ABC9C" : "#ADB5BD",
                    transition: "color 0.2s",
                  }}
                >
                  search
                </span>
                <style>{`.artist-search::placeholder { color: transparent; }`}</style>
                {!searchFocused && !searchValue && (
                  <span
                    style={{
                      position: "absolute",
                      left: "44px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "13px",
                      color: "#868E96",
                      pointerEvents: "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Search <span style={{ fontWeight: 700, color: "#1A1D2E" }}>{artistPlaceholders[artistIndex].replace("Search ", "").replace("...", "")}</span>...
                  </span>
                )}
                <input
                  suppressHydrationWarning
                  className="artist-search"
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  style={{
                    width: "100%",
                    height: "40px",
                    paddingLeft: "44px",
                    paddingRight: "16px",
                    backgroundColor: searchFocused ? "#ffffff" : "#F1F3F5",
                    border: searchFocused ? "1.5px solid #1ABC9C" : "1.5px solid #E9ECEF",
                    borderRadius: "100px",
                    color: "#1A1D2E",
                    fontSize: "13px",
                    transition: "all 0.2s ease",
                    boxShadow: searchFocused ? "0 0 0 3px rgba(26,188,156,0.1)" : "none",
                  }}
                />
              </div>
            </div>
          )}

          {/* Right actions (desktop) */}
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
              {user ? (
                <>
                  {isAdmin && (
                    <Link href="/admin" style={{ textDecoration: "none" }}>
                      <button
                        style={{
                          backgroundColor: "#EFEFEF",
                          color: "#37352F",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "8px",
                          fontSize: "12.5px",
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#E3E3E3")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#EFEFEF")}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>dashboard</span>
                        Admin Panel
                      </button>
                    </Link>
                  )}
                  <Link href="/profile" style={{ textDecoration: "none" }}>
                    {(() => {
                      const avatar = user.user_metadata?.avatar_url || user.user_metadata?.picture;
                      if (avatar && !avatarError) {
                        return (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={avatar} alt="Profile" onError={() => setAvatarError(true)} referrerPolicy="no-referrer"
                            style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover", border: "2px solid #E9ECEF", cursor: "pointer" }} />
                        );
                      }
                      return (
                        <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#1ABC9C", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#ffffff", fontSize: "14px", fontWeight: 700 }}>
                          {(user.user_metadata?.display_name || user.email || "U").charAt(0).toUpperCase()}
                        </div>
                      );
                    })()}
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" style={{ textDecoration: "none" }}>
                    <button
                      suppressHydrationWarning
                      style={{
                        backgroundColor: "transparent",
                        border: "1.5px solid #DEE2E6",
                        color: "#495057",
                        padding: "8px 20px",
                        borderRadius: "100px",
                        fontSize: "13px",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        const b = e.currentTarget as HTMLButtonElement;
                        b.style.borderColor = "#1ABC9C";
                        b.style.color = "#1ABC9C";
                      }}
                      onMouseLeave={(e) => {
                        const b = e.currentTarget as HTMLButtonElement;
                        b.style.borderColor = "#DEE2E6";
                        b.style.color = "#495057";
                      }}
                    >
                      Log In
                    </button>
                  </Link>
                  <Link href="/register" style={{ textDecoration: "none" }}>
                    <button
                      suppressHydrationWarning
                      style={{
                        backgroundColor: "#1ABC9C",
                        color: "#ffffff",
                        padding: "8px 22px",
                        borderRadius: "100px",
                        fontSize: "13px",
                        fontWeight: 700,
                        border: "none",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        letterSpacing: "-0.01em",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#16A085";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#1ABC9C";
                      }}
                    >
                      Sign Up
                    </button>
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Mobile: search + hamburger */}
          {isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Link href="/explore" style={{ textDecoration: "none", display: "flex", alignItems: "center", padding: "6px", backgroundColor: "#F1F3F5", borderRadius: "50%" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "22px", color: "#1A1D2E" }}>
                  search
                </span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{ background: "#F1F3F5", border: "none", borderRadius: "50%", cursor: "pointer", padding: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "24px", color: "#1A1D2E" }}>
                  {mobileMenuOpen ? "close" : "menu"}
                </span>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {isMobile && mobileMenuOpen && (
        <div
          style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.4)", zIndex: 999 }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ position: "absolute", top: "100px", right: "12px", width: "280px", backgroundColor: "#ffffff", borderRadius: "18px", boxShadow: "0 12px 36px rgba(0,0,0,0.18)", padding: "12px 0", overflow: "hidden", animation: "slideDown 0.2s ease" }}
          >
            {[...navLinks, { label: "Our Journey", href: "/our-journey" }, { label: "Wristband", href: "/wristband" }, { label: "FAQ", href: "/faq" }].map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 20px", textDecoration: "none", fontSize: "14px", fontWeight: isActive ? 700 : 500, color: isActive ? "#1ABC9C" : "#37352F", backgroundColor: isActive ? "#F0FDFA" : "transparent" }}
                >
                  {link.label}
                </Link>
              );
            })}
            <div style={{ height: "1px", backgroundColor: "#EEEEEE", margin: "8px 20px" }} />
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 20px", textDecoration: "none", fontSize: "14px", fontWeight: 500, color: "#37352F" }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "#6C757D" }}>dashboard</span>
                Admin Panel
              </Link>
            )}
            {user ? (
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 20px", textDecoration: "none", fontSize: "14px", fontWeight: 500, color: "#37352F" }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "#6C757D" }}>person</span>
                Profile
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 20px", textDecoration: "none", fontSize: "14px", fontWeight: 500, color: "#37352F" }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "#6C757D" }}>login</span>
                  Log In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 20px", textDecoration: "none", fontSize: "14px", fontWeight: 500, color: "#37352F" }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "#6C757D" }}>person_add</span>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Floating Bottom Nav Bar (mobile) */}
      {isMobile ? (
        <>
          <style>{`body { padding-bottom: 80px !important; }`}</style>
          <div
            style={{
              position: "fixed",
              bottom: "12px",
              left: "16px",
              right: "16px",
              height: "62px",
              backgroundColor: "#ffffff",
              borderRadius: "100px",
              boxShadow: "0 8px 32px rgba(13, 27, 62, 0.15)",
              border: "1px solid rgba(233, 236, 239, 0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              zIndex: 999,
              padding: "0 8px",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            {[
              { label: "Beranda", href: "/", icon: "home" },
              { label: "Jelajahi", href: "/explore", icon: "explore" },
              { label: "Tiket", href: "/my-tickets", icon: "confirmation_number" },
              ...(isAdmin ? [{ label: "Admin", href: "/admin", icon: "dashboard" }] : []),
              { label: "Gelang", href: "/wristband", icon: "style" },
              { label: "Profil", href: "/profile", icon: "person" },
            ].map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    textDecoration: "none",
                    color: isActive ? "#ffffff" : "#6C757D",
                    backgroundColor: isActive ? "#1ABC9C" : "transparent",
                    padding: isActive ? "8px 16px" : "8px 10px",
                    borderRadius: "100px",
                    transition: "all 0.25s ease",
                    boxShadow: isActive ? "0 4px 12px rgba(26, 188, 156, 0.3)" : "none",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: "22px",
                      fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                    }}
                  >
                    {link.icon}
                  </span>
                  {isActive && (
                    <span style={{ fontSize: "12px", fontWeight: 700, whiteSpace: "nowrap" }}>
                      {link.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </>
      ) : (
        <style>{`body { padding-bottom: 0; }`}</style>
      )}
    </>
  );
}

