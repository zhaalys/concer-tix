"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { AdminProvider, useAdmin } from "@/lib/useAdmin";
import { supabase } from "@/lib/supabase";
import { LayoutDashboard, Ticket, Users, ShieldCheck, Globe, LogOut, Menu, X, Search, CalendarDays, CreditCard, Bell, ScanLine, type LucideIcon } from "lucide-react";
import { TEXT, TEXT_MUTED, TEXT_FAINT, BORDER, BG_HOVER, BG_SIDEBAR } from "@/components/admin/AdminUI";

const SIDEBAR_W = 260;

function SidebarContent({ onNavigate, isMobile }: { onNavigate?: () => void; isMobile?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, isSuperAdmin, user } = useAdmin();
  const [query, setQuery] = useState("");

  const menuItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
    { label: "Orders", href: "/admin/orders", icon: Ticket },
    { label: "Payments", href: "/admin/payments", icon: CreditCard },
    { label: "Events", href: "/admin/events", icon: CalendarDays },
    { label: "Notifications", href: "/admin/notifications", icon: Bell },
    { label: "Check-in", href: "/admin/scanner", icon: ScanLine },
  ];
  const manageItems = [
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Admins", href: "/admin/admins", icon: ShieldCheck },
  ];

  const isActive = (href: string, exact?: boolean) => (exact ? pathname === href : pathname.startsWith(href));

  const q = query.trim().toLowerCase();
  const matches = (label: string, href: string) => !q || label.toLowerCase().includes(q) || href.toLowerCase().includes(q);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const NavItem = ({ item }: { item: { label: string; href: string; icon: LucideIcon; exact?: boolean } }) => {
    const active = isActive(item.href, item.exact);
    const Icon = item.icon;
    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 10px",
          borderRadius: 5,
          textDecoration: "none",
          fontSize: 14,
          fontWeight: active ? 600 : 450,
          color: active ? TEXT : TEXT_MUTED,
          background: active ? BG_HOVER : "transparent",
          transition: "background 0.1s ease",
        }}
        onMouseEnter={(e) => {
          if (!active) e.currentTarget.style.background = BG_HOVER;
        }}
        onMouseLeave={(e) => {
          if (!active) e.currentTarget.style.background = "transparent";
        }}
      >
        <Icon size={16} strokeWidth={1.8} color={active ? TEXT : TEXT_FAINT} />
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.label}</span>
      </Link>
    );
  };

  return (
    <div
      style={{
        width: SIDEBAR_W,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: BG_SIDEBAR,
        borderRight: `1px solid ${BORDER}`,
        position: isMobile ? "relative" : "fixed",
        top: 0,
        left: 0,
        zIndex: 50,
      }}
    >
      {/* Workspace header */}
      <div style={{ padding: "16px 12px 8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/admin" onClick={onNavigate} style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", minWidth: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo/tix_logo.png?v=3"
            alt=""
            style={{
              width: 26,
              height: 26,
              borderRadius: 6,
              objectFit: "cover",
              background: "#E4E2DE",
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 14.5, fontWeight: 600, color: TEXT, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            Concer TIX Admin
          </span>
        </Link>
        {isMobile ? (
          <button onClick={onNavigate} style={{ background: "none", border: "none", cursor: "pointer", color: TEXT_MUTED, display: "flex", padding: 4 }}>
            <X size={18} />
          </button>
        ) : (
          <button
            onClick={handleLogout}
            title="Log out"
            style={{ background: "transparent", border: "none", cursor: "pointer", color: TEXT_FAINT, display: "flex", padding: 5, borderRadius: 5 }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = TEXT;
              e.currentTarget.style.background = BG_HOVER;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = TEXT_FAINT;
              e.currentTarget.style.background = "transparent";
            }}
          >
            <LogOut size={15} />
          </button>
        )}
      </div>

      {/* Search */}
      <div style={{ padding: "10px 12px 8px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            background: "#EFEEEC",
            border: "1px solid transparent",
            borderRadius: 6,
            padding: "0 9px",
            height: 34,
          }}
        >
          <Search size={13.5} color={TEXT_FAINT} />
          <input
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: 14,
              width: "100%",
              color: TEXT,
            }}
          />
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "6px 8px", display: "flex", flexDirection: "column", gap: 1 }}>
        <span style={{ padding: "10px 10px 4px", fontSize: 12, fontWeight: 500, color: TEXT_FAINT, textTransform: "uppercase", letterSpacing: "0.04em" }}>
          Workspace
        </span>
        {menuItems.map((item) => matches(item.label, item.href) && <NavItem key={item.href} item={item} />)}

        {isSuperAdmin && (
          <>
            <span style={{ padding: "14px 10px 4px", fontSize: 12, fontWeight: 500, color: TEXT_FAINT, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Management
            </span>
            {manageItems.map((item) => matches(item.label, item.href) && <NavItem key={item.href} item={item} />)}
          </>
        )}

        <div style={{ paddingTop: 12 }}>
          {matches("View website", "/") && (
            <Link
              href="/"
              onClick={onNavigate}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 10px",
                borderRadius: 5,
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 450,
                color: TEXT_MUTED,
                transition: "background 0.1s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = BG_HOVER)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <Globe size={16} strokeWidth={1.8} color={TEXT_FAINT} />
              View website
            </Link>
          )}
        </div>
      </nav>

      {/* User card */}
      <div style={{ padding: "10px 8px", borderTop: `1px solid ${BORDER}` }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "7px 8px",
            borderRadius: 5,
            transition: "background 0.1s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = BG_HOVER)}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 5,
              background: "#D9D7D3",
              color: "#4A4A45",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {(profile?.display_name || user?.email || "A").charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: TEXT, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {profile?.display_name || user?.email || "Admin"}
            </div>
            <div style={{ fontSize: 12, color: TEXT_FAINT, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {isSuperAdmin ? "Super Admin" : "Admin"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { role, loading } = useAdmin();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !role) {
      router.replace("/login");
    }
  }, [loading, role, router]);

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FFFFFF",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            border: "3px solid #ECEAE8",
            borderTopColor: "#787774",
            borderRadius: "50%",
            animation: "adminSpin 0.8s linear infinite",
          }}
        />
        <span style={{ fontSize: 13, color: TEXT_FAINT, fontWeight: 450 }}>Loading...</span>
        <style>{`@keyframes adminSpin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!role) return null;

  const titles: Record<string, string> = {
    "/admin": "Dashboard",
    "/admin/orders": "Orders",
    "/admin/payments": "Payments",
    "/admin/events": "Events",
    "/admin/events/new": "Tambah event",
    "/admin/notifications": "Notifications",
    "/admin/notifications/new": "Tambah pemberitahuan",
    "/admin/scanner": "Scan QR Check-in",
    "/admin/users": "Users",
    "/admin/admins": "Admin Management",
    "/admin/admins/new": "Tambah admin",
  };

  let pageTitle = titles[pathname] || "Dashboard";
  if (pathname.startsWith("/admin/events/")) pageTitle = "Edit event";
  else if (pathname.startsWith("/admin/notifications/")) pageTitle = "Edit pemberitahuan";

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF" }}>
      <style>{`
        .admin-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
        .admin-scroll::-webkit-scrollbar-thumb { background: #D3D1CC; border-radius: 8px; }
        @media (max-width: 900px) { .admin-sidebar-desktop { display: none; } }
        @media (max-width: 640px) { .admin-main { padding: 18px 14px 84px !important; } }
      `}</style>

      {/* Desktop sidebar */}
      <div className="admin-sidebar-desktop" style={{ paddingLeft: SIDEBAR_W }}>
        <SidebarContent />
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,15,15,0.45)", zIndex: 60 }} onClick={() => setMobileOpen(false)} />
      )}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 61,
          transform: mobileOpen ? "translateX(0)" : "translateX(-110%)",
          transition: "transform 0.2s ease",
        }}
      >
        {mobileOpen && <SidebarContent isMobile onNavigate={() => setMobileOpen(false)} />}
      </div>

      {/* Minimal topbar */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(8px)",
          borderBottom: `1px solid ${BORDER}`,
          height: 50,
          display: "flex",
          alignItems: "center",
          padding: "0 22px",
          gap: 10,
        }}
      >
        <button
          onClick={() => setMobileOpen(true)}
          style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: TEXT_MUTED, padding: 5 }}
          className="admin-menu-btn"
        >
          <Menu size={19} />
        </button>
        <style>{`@media (max-width: 900px) { .admin-menu-btn { display: flex !important; } }`}</style>
        <span style={{ fontSize: 14, color: TEXT, fontWeight: 500 }}>{pageTitle}</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 13, color: TEXT_FAINT }}>Concer TIX</span>
      </div>

      {/* Content */}
      <main className="admin-main" style={{ padding: "36px 28px 80px", maxWidth: 1320, margin: "0 auto" }}>{children}</main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  );
}
