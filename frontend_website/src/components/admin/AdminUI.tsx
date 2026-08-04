"use client";

import type { ReactNode } from "react";

/* Notion-style palette */
export const TEXT = "#37352F";
export const TEXT_MUTED = "#787774";
export const TEXT_FAINT = "#A6A39F";
export const BORDER = "#E9E9E7";
export const BG_HOVER = "#F1F1EF";
export const BG_SIDEBAR = "#F7F7F5";
export const BG_PAGE = "#FFFFFF";
export const BLUE = "#2383E2";
export const RED = "#E5484D";
export const GREEN = "#30A46C";
export const AMBER = "#F59E0B";

export function errMsg(e: unknown): string {
  return e instanceof Error ? e.message : "Terjadi kesalahan pada server";
}

export function formatIDR(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export function formatDate(iso: string | null | undefined) {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return "-";
  }
}

export function formatDateTime(iso: string | null | undefined) {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch {
    return "-";
  }
}

export function Spinner({ size = 36 }: { size?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 0" }}>
      <div
        style={{
          width: size,
          height: size,
          border: `3px solid #ECEAE8`,
          borderTopColor: TEXT_MUTED,
          borderRadius: "50%",
          animation: "adminSpin 0.8s linear infinite",
        }}
      />
      <style>{`@keyframes adminSpin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 32, flexWrap: "wrap" }}>
      <div>
        <h1 style={{ fontSize: 30, fontWeight: 700, color: TEXT, letterSpacing: "-0.015em", margin: 0 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 14, color: TEXT_MUTED, margin: "4px 0 0" }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon,
  sub,
}: {
  label: string;
  value: string | number;
  icon?: ReactNode;
  sub?: string;
}) {
  return (
    <div
      style={{
        background: BG_PAGE,
        border: `1px solid ${BORDER}`,
        borderRadius: 10,
        padding: "16px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        transition: "background 0.12s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = BG_HOVER)}
      onMouseLeave={(e) => (e.currentTarget.style.background = BG_PAGE)}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {icon && (
          <span
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: "rgba(227, 227, 227, 0.55)",
              color: TEXT_MUTED,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {icon}
          </span>
        )}
        <span style={{ fontSize: 13, color: TEXT_MUTED, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: TEXT, letterSpacing: "-0.02em", lineHeight: 1.1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: TEXT_FAINT, borderTop: `1px solid ${BORDER}`, paddingTop: 8 }}>{sub}</div>}
    </div>
  );
}

const STATUS_COLORS: Record<string, string> = {
  paid: GREEN,
  completed: GREEN,
  checked_in: GREEN,
  processed: BLUE,
  shipped: BLUE,
  pending: "#E59F00",
  cancelled: RED,
  refunded: "#8B5CF6",
};

export function StatusBadge({ status }: { status: string }) {
  const s = (status || "").toLowerCase();
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13.5, color: TEXT }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: STATUS_COLORS[s] || TEXT_FAINT, flexShrink: 0 }} />
      <span style={{ textTransform: "capitalize" }}>{status}</span>
    </span>
  );
}

export function RoleBadge({ role }: { role: string }) {
  const isSuper = role === "super_admin";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: 12,
        fontWeight: 500,
        color: isSuper ? "#0F609B" : TEXT_MUTED,
        background: isSuper ? "#E7F0FB" : BG_HOVER,
        padding: "3px 9px",
        borderRadius: 6,
      }}
    >
      {isSuper ? "Super Admin" : "Admin"}
    </span>
  );
}

export function Avatar({ name, color }: { name?: string | null; color?: string }) {
  const initial = (name || "?").charAt(0).toUpperCase();
  return (
    <div
      style={{
        width: 30,
        height: 30,
        borderRadius: "50%",
        background: color || "#D9D7D3",
        color: "#4A4A45",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12.5,
        fontWeight: 500,
        flexShrink: 0,
        userSelect: "none",
      }}
    >
      {initial}
    </div>
  );
}

export function Card({
  children,
  title,
  subtitle,
  action,
  pad = true,
}: {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  pad?: boolean;
}) {
  return (
    <div style={{ background: BG_PAGE, border: `1px solid ${BORDER}`, borderRadius: 10, overflow: "hidden" }}>
      {(title || action) && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: `1px solid ${BORDER}`, gap: 12 }}>
          <div>
            {title && <div style={{ fontSize: 15, fontWeight: 600, color: TEXT }}>{title}</div>}
            {subtitle && <div style={{ fontSize: 12.5, color: TEXT_FAINT, marginTop: 2 }}>{subtitle}</div>}
          </div>
          {action}
        </div>
      )}
      <div style={pad ? { padding: "12px 20px 16px" } : undefined}>{children}</div>
    </div>
  );
}

export function NotionTable({
  headers,
  children,
  minWidth = 680,
}: {
  headers: string[];
  children: ReactNode;
  minWidth?: number;
}) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, minWidth }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
            {headers.map((h) => (
              <th key={h} style={{ textAlign: "left", padding: "10px 20px", fontSize: 13.5, fontWeight: 500, color: TEXT_MUTED, whiteSpace: "nowrap" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function Td({
  children,
  style,
}: {
  children: ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <td style={{ padding: "11px 20px", borderBottom: `1px solid ${BORDER}`, color: TEXT, verticalAlign: "middle", ...style }}>
      {children}
    </td>
  );
}

export function Tr({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <tr
      onClick={onClick}
      style={{ transition: "background 0.1s ease", cursor: onClick ? "pointer" : "default" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = BG_HOVER)}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {children}
    </tr>
  );
}

export function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ textAlign: "center", padding: "56px 20px" }}>
      <div style={{ width: 44, height: 44, margin: "0 auto 14px", borderRadius: 10, background: BG_HOVER, display: "flex", alignItems: "center", justifyContent: "center", color: TEXT_FAINT }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /><line x1="7" y1="12" x2="17" y2="12" />
        </svg>
      </div>
      <div style={{ fontSize: 14.5, fontWeight: 500, color: TEXT }}>{title}</div>
      {subtitle && <div style={{ fontSize: 13, color: TEXT_FAINT, marginTop: 4 }}>{subtitle}</div>}
    </div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  style,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        background: BLUE,
        color: "#fff",
        border: "none",
        borderRadius: 8,
        padding: "9px 16px",
        fontSize: 14,
        fontWeight: 500,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.4 : 1,
        transition: "background 0.15s ease",
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.background = "#1B6DBD";
      }}
      onMouseLeave={(e) => {
        if (!disabled) e.currentTarget.style.background = BLUE;
      }}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  onClick,
  disabled,
  style,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        background: "transparent",
        color: TEXT,
        border: "none",
        borderRadius: 6,
        padding: "7px 11px",
        fontSize: 14,
        fontWeight: 500,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "background 0.15s ease",
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.background = BG_HOVER;
      }}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {children}
    </button>
  );
}
