"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  defaultPortfolioContent,
  getAnalyticsData,
  loadPortfolioContent,
  loadChanges,
  logChange,
  PortfolioContent,
  resetPortfolioContent,
  savePortfolioContent,
  trackPageVisit,
  AnalyticsData,
  ContentChange,
} from "../lib/portfolio-content";
import { EditPopover } from "../components/admin/edit-popover";

// ─── Icon Library ─────────────────────────────────────────────────────────────

const Icons = {
  Dashboard: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  User: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <circle cx="12" cy="7" r="4" />
      <path strokeLinecap="round" d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  ),
  Link: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  ),
  Share: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  ),
  Image: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 15l-5-5L5 21" />
    </svg>
  ),
  BarChart: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  ),
  Settings: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  ),
  LogOut: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
  ),
  Sun: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ),
  Moon: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
  ),
  Plus: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Edit: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
    </svg>
  ),
  Eye: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Save: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
    </svg>
  ),
  Menu: () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  ),
  Close: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Globe: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  ),
  ArrowUpRight: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  ),
  TrendUp: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  Activity: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  Zap: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Clock: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
};

// ─── Types ────────────────────────────────────────────────────────────────────

type Section = "dashboard" | "hero" | "nav" | "social" | "gallery" | "analytics" | "settings";

const navItems: { id: Section; label: string; icon: keyof typeof Icons }[] = [
  { id: "dashboard", label: "Dashboard", icon: "Dashboard" },
  { id: "hero", label: "Hero", icon: "User" },
  { id: "nav", label: "Navigation", icon: "Link" },
  { id: "social", label: "Social Links", icon: "Share" },
  { id: "gallery", label: "Gallery", icon: "Image" },
  { id: "analytics", label: "Analytics", icon: "BarChart" },
  { id: "settings", label: "Settings", icon: "Settings" },
];

// ─── Styles ───────────────────────────────────────────────────────────────────

const S = {
  root: {
    minHeight: "100vh",
    display: "flex",
    background: "#08080f",
    color: "#f4f4f5",
    fontFamily: "var(--font-geist-sans, ui-sans-serif, system-ui, sans-serif)",
    position: "relative" as const,
    overflow: "hidden",
  },
  // ambient glows
  glow1: {
    position: "fixed" as const,
    top: -200,
    left: -200,
    width: 600,
    height: 600,
    background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)",
    pointerEvents: "none" as const,
    zIndex: 0,
  },
  glow2: {
    position: "fixed" as const,
    bottom: -300,
    right: -200,
    width: 700,
    height: 700,
    background: "radial-gradient(circle, rgba(204,108,92,0.08) 0%, transparent 70%)",
    pointerEvents: "none" as const,
    zIndex: 0,
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  icon,
  color,
  trend,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  color: string;
  trend?: number;
}) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 20,
        padding: "20px 22px",
        backdropFilter: "blur(16px)",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 40px ${color}20`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "";
      }}
    >
      {/* bg accent */}
      <div
        style={{
          position: "absolute",
          top: -20,
          right: -20,
          width: 100,
          height: 100,
          background: `radial-gradient(circle, ${color}18 0%, transparent 70%)`,
          borderRadius: "50%",
        }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: `linear-gradient(135deg, ${color}30, ${color}15)`,
            border: `1px solid ${color}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color,
          }}
        >
          {icon}
        </div>
        {trend !== undefined && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: trend >= 0 ? "#34d399" : "#f87171",
              background: trend >= 0 ? "rgba(52,211,153,0.12)" : "rgba(248,113,113,0.12)",
              padding: "3px 8px",
              borderRadius: 20,
            }}
          >
            {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div style={{ marginTop: 14 }}>
        <p style={{ fontSize: 28, fontWeight: 800, color: "#fff", lineHeight: 1, letterSpacing: "-0.02em" }}>
          {value}
        </p>
        <p style={{ fontSize: 13, color: "rgba(244,244,245,0.5)", marginTop: 4, fontWeight: 500 }}>{label}</p>
        {sub && <p style={{ fontSize: 11, color: "rgba(244,244,245,0.3)", marginTop: 2 }}>{sub}</p>}
      </div>
    </div>
  );
}

function SparkLine({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = max - min || 1;
  const H = 60;
  const W = 100;
  const step = W / (data.length - 1);

  const points = data
    .map((v, i) => {
      const x = i * step;
      const y = H - ((v - min) / range) * (H - 8) - 4;
      return `${x},${y}`;
    })
    .join(" ");

  const areaPoints = `0,${H} ${points} ${W},${H}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 60 }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`sg-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={areaPoints}
        fill={`url(#sg-${color.replace("#", "")})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* last point dot */}
      {data.length > 0 && (() => {
        const lastX = (data.length - 1) * step;
        const lastY = H - ((data[data.length - 1] - min) / range) * (H - 8) - 4;
        return <circle cx={lastX} cy={lastY} r="3" fill={color} />;
      })()}
    </svg>
  );
}

function BarChart({ data, color, labels }: { data: number[]; color: string; labels?: string[] }) {
  const max = Math.max(...data, 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80, padding: "0 4px" }}>
      {data.map((v, i) => {
        const h = (v / max) * 72;
        return (
          <div
            key={i}
            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}
          >
            <div
              style={{
                width: "100%",
                height: h || 3,
                background: `linear-gradient(180deg, ${color} 0%, ${color}60 100%)`,
                borderRadius: "4px 4px 0 0",
                transition: "height 0.6s cubic-bezier(0.34,1.56,0.64,1)",
                boxShadow: `0 4px 12px ${color}40`,
              }}
            />
            {labels && (
              <span style={{ fontSize: 9, color: "rgba(244,244,245,0.3)", whiteSpace: "nowrap" }}>
                {labels[i]}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function DonutChart({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((a, b) => a + b.value, 0) || 1;
  const R = 50;
  const CX = 60;
  const CY = 60;
  const circumference = 2 * Math.PI * R;

  let cumulative = 0;
  const slices = segments.map((seg) => {
    const pct = seg.value / total;
    const offset = circumference * (1 - cumulative);
    const dashArray = `${circumference * pct} ${circumference * (1 - pct)}`;
    cumulative += pct;
    return { ...seg, offset, dashArray };
  });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <svg width="120" height="120" style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
        {slices.map((slice, i) => (
          <circle
            key={i}
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            stroke={slice.color}
            strokeWidth="16"
            strokeDasharray={slice.dashArray}
            strokeDashoffset={-circumference + slice.offset}
            strokeLinecap="butt"
          />
        ))}
        <circle cx={CX} cy={CY} r={42} fill="rgba(8,8,15,0.8)" />
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {segments.map((seg, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: seg.color, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: "rgba(244,244,245,0.6)", fontWeight: 500 }}>{seg.label}</span>
            <span style={{ fontSize: 12, color: "#f4f4f5", fontWeight: 700, marginLeft: "auto" }}>
              {Math.round((seg.value / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function GlassCard({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 24,
        backdropFilter: "blur(16px)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
  icon,
  action,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {icon && (
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "linear-gradient(135deg, rgba(139,92,246,0.25), rgba(204,108,92,0.15))",
              border: "1px solid rgba(139,92,246,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#a78bfa",
            }}
          >
            {icon}
          </div>
        )}
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.01em" }}>
            {title}
          </h2>
          {subtitle && (
            <p style={{ fontSize: 13, color: "rgba(244,244,245,0.4)", margin: "2px 0 0" }}>{subtitle}</p>
          )}
        </div>
      </div>
      {action}
    </div>
  );
}

function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "9px 16px",
        borderRadius: 12,
        border: "none",
        background: "linear-gradient(135deg, #8b5cf6, #cc6c5c)",
        color: "#fff",
        fontSize: 13,
        fontWeight: 700,
        cursor: "pointer",
        boxShadow: "0 4px 16px rgba(139,92,246,0.3)",
        transition: "filter 0.15s, transform 0.1s",
        letterSpacing: "0.01em",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.1)";
        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.filter = "";
        (e.currentTarget as HTMLButtonElement).style.transform = "";
      }}
    >
      <Icons.Plus />
      {label}
    </button>
  );
}

function ChangeItem({ change }: { change: ContentChange }) {
  const actionColors: Record<string, string> = {
    updated: "#8b5cf6",
    added: "#34d399",
    deleted: "#f87171",
    reset: "#fb923c",
  };
  const actionLabels: Record<string, string> = {
    updated: "Updated",
    added: "Added",
    deleted: "Deleted",
    reset: "Reset",
  };
  const relTime = (() => {
    const diff = Date.now() - change.timestamp;
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return new Date(change.timestamp).toLocaleDateString();
  })();

  const color = actionColors[change.action] ?? "#8b5cf6";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 0",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: color,
          flexShrink: 0,
          boxShadow: `0 0 6px ${color}`,
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#f4f4f5", margin: 0 }}>
          {actionLabels[change.action]} <span style={{ color }}>{change.section}</span>
        </p>
        {change.detail && (
          <p style={{ fontSize: 11, color: "rgba(244,244,245,0.4)", margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {change.detail}
          </p>
        )}
      </div>
      <span style={{ fontSize: 11, color: "rgba(244,244,245,0.3)", flexShrink: 0 }}>{relTime}</span>
    </div>
  );
}

// ─── Section renderers ────────────────────────────────────────────────────────

function DashboardSection({
  content,
  changes,
  analytics,
}: {
  content: PortfolioContent;
  changes: ContentChange[];
  analytics: AnalyticsData;
}) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date().getDay();
  const dayLabels = Array.from({ length: 7 }, (_, i) => days[(today - 6 + i + 7) % 7]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <StatCard
          label="Total Visits"
          value={analytics.totalVisits.toLocaleString()}
          icon={<Icons.Globe />}
          color="#8b5cf6"
          trend={12}
          sub="Portfolio page"
        />
        <StatCard
          label="Nav Links"
          value={content.navLinks.length}
          icon={<Icons.Link />}
          color="#06b6d4"
          sub="Active navigation items"
        />
        <StatCard
          label="Social Links"
          value={content.socialLinks.length}
          icon={<Icons.Share />}
          color="#f59e0b"
          sub="Connected profiles"
        />
        <StatCard
          label="Gallery Items"
          value={content.gallery.length}
          icon={<Icons.Image />}
          color="#10b981"
          sub="Portfolio visuals"
        />
      </div>

      {/* Charts + Changes row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16 }}>
        {/* Weekly chart */}
        <GlassCard style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: 0 }}>Weekly Traffic</h3>
              <p style={{ fontSize: 12, color: "rgba(244,244,245,0.4)", margin: "4px 0 0" }}>Last 7 days</p>
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#34d399",
                background: "rgba(52,211,153,0.1)",
                padding: "4px 10px",
                borderRadius: 20,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Icons.TrendUp /> +12%
            </span>
          </div>
          <BarChart data={analytics.weeklyVisits} color="#8b5cf6" labels={dayLabels} />
        </GlassCard>

        {/* Recent changes */}
        <GlassCard style={{ padding: "24px", overflowY: "auto", maxHeight: 300 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Icons.Activity />
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: 0 }}>Recent Changes</h3>
          </div>
          {changes.length === 0 ? (
            <p style={{ fontSize: 13, color: "rgba(244,244,245,0.3)", textAlign: "center", padding: "20px 0" }}>
              No changes yet
            </p>
          ) : (
            changes.slice(0, 8).map((c) => <ChangeItem key={c.id} change={c} />)
          )}
        </GlassCard>
      </div>

      {/* Quick info */}
      <GlassCard style={{ padding: "24px" }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: "0 0 16px" }}>
          Portfolio Info
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          {[
            { label: "Name", value: content.name },
            { label: "Title", value: content.title },
            { label: "Email", value: content.email },
            { label: "Hero Badge", value: content.heroBadge },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 14,
                padding: "14px 16px",
              }}
            >
              <p style={{ fontSize: 11, color: "rgba(244,244,245,0.4)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>
                {item.label}
              </p>
              <p style={{ fontSize: 14, color: "#fff", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

function HeroSection({
  content,
  updateContent,
  setSavedMessage,
}: {
  content: PortfolioContent;
  updateContent: <K extends keyof PortfolioContent>(key: K, value: PortfolioContent[K]) => void;
  setSavedMessage: (msg: string) => void;
}) {
  const previewName = useMemo(() => content.name.split(" "), [content.name]);

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: "11px 14px",
    fontSize: 13,
    color: "#f4f4f5",
    outline: "none",
    transition: "border-color 0.15s, box-shadow 0.15s",
    boxSizing: "border-box" as const,
  };

  const fields = [
    { key: "heroBadge", label: "Hero Badge", value: content.heroBadge, placeholder: "e.g. It's me" },
    { key: "name", label: "Full Name", value: content.name, placeholder: "e.g. Nikesh Shah" },
    { key: "title", label: "Role Title", value: content.title, placeholder: "e.g. Software Developer" },
    { key: "email", label: "Email Address", value: content.email, placeholder: "your@email.com" },
    { key: "ctaPrimary", label: "CTA Primary Text", value: content.ctaPrimary, placeholder: "let's" },
    { key: "ctaSecondary", label: "CTA Secondary Text", value: content.ctaSecondary, placeholder: "talk" },
    { key: "avatarSrc", label: "Avatar Image URL", value: content.avatar.src, placeholder: "/nikesh.png" },
    { key: "avatarAlt", label: "Avatar Alt Text", value: content.avatar.alt, placeholder: "Profile illustration" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
      {/* Form */}
      <GlassCard style={{ padding: 28 }}>
        <SectionHeader title="Hero Content" subtitle="Manage your portfolio headline section" icon={<Icons.User />} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {fields.map((field) => (
            <label key={field.key} style={{ display: "block" }}>
              <span
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "rgba(244,244,245,0.4)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 6,
                }}
              >
                {field.label}
              </span>
              <input
                type="text"
                value={field.value}
                placeholder={field.placeholder}
                onChange={(e) => {
                  if (field.key === "avatarSrc")
                    updateContent("avatar", { ...content.avatar, src: e.target.value });
                  else if (field.key === "avatarAlt")
                    updateContent("avatar", { ...content.avatar, alt: e.target.value });
                  else updateContent(field.key as keyof PortfolioContent, e.target.value);
                  setSavedMessage("Saving...");
                  logChange("Hero", "updated", field.label);
                }}
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(139,92,246,0.5)";
                  e.target.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.1)";
                  e.target.style.boxShadow = "none";
                  setSavedMessage("Saved");
                }}
              />
            </label>
          ))}
        </div>
        <label style={{ display: "block", marginTop: 16 }}>
          <span
            style={{
              display: "block",
              fontSize: 11,
              fontWeight: 600,
              color: "rgba(244,244,245,0.4)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 6,
            }}
          >
            Description
          </span>
          <textarea
            rows={4}
            value={content.description}
            placeholder="Write a short bio..."
            onChange={(e) => {
              updateContent("description", e.target.value);
              logChange("Hero", "updated", "Description");
            }}
            style={{ ...inputStyle, resize: "vertical" }}
            onFocus={(e) => {
              e.target.style.borderColor = "rgba(139,92,246,0.5)";
              e.target.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(255,255,255,0.1)";
              e.target.style.boxShadow = "none";
            }}
          />
        </label>
      </GlassCard>

      {/* Live preview */}
      <GlassCard style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "rgba(244,244,245,0.5)", margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Live Preview
        </h3>
        <div
          style={{
            background: "rgba(0,0,0,0.4)",
            borderRadius: 16,
            padding: 20,
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <span
            style={{
              display: "inline-block",
              background: "rgba(255,255,255,0.1)",
              padding: "3px 10px",
              borderRadius: 6,
              fontSize: 11,
              color: "rgba(244,244,245,0.6)",
              marginBottom: 12,
            }}
          >
            {content.heroBadge}
          </span>
          <h3
            style={{
              fontSize: 28,
              fontWeight: 900,
              color: "#fff",
              margin: 0,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            {previewName[0]}
            <br />
            <span style={{ color: "#cc6c5c" }}>{previewName.slice(1).join(" ")}</span>
          </h3>
          <p
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "rgba(244,244,245,0.4)",
              marginTop: 8,
            }}
          >
            {content.title}
          </p>
          <p style={{ fontSize: 12, color: "rgba(244,244,245,0.5)", marginTop: 12, lineHeight: 1.6 }}>
            {content.description.slice(0, 120)}...
          </p>
        </div>
        {/* Avatar preview */}
        <div
          style={{
            borderRadius: 16,
            overflow: "hidden",
            background: "linear-gradient(135deg, rgba(204,108,92,0.2), rgba(139,92,246,0.2))",
          }}
        >
          <Image
            src={content.avatar.src || defaultPortfolioContent.avatar.src}
            alt={content.avatar.alt}
            width={400}
            height={400}
            style={{ width: "100%", height: "auto", objectFit: "cover" }}
          />
        </div>
      </GlassCard>
    </div>
  );
}

function LinksSection({
  title,
  subtitle,
  icon,
  items,
  onAdd,
  onEdit,
  onDelete,
  fields,
  renderCard,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  items: Record<string, string>[];
  onAdd: () => void;
  onEdit: (index: number, key: string, value: string) => void;
  onDelete: (index: number) => void;
  fields: { key: string; label: string; type: "text" | "textarea" | "url"; placeholder?: string }[];
  renderCard: (item: Record<string, string>, index: number) => React.ReactNode;
}) {
  return (
    <GlassCard style={{ padding: 28 }}>
      <SectionHeader
        title={title}
        subtitle={subtitle}
        icon={icon}
        action={<AddButton onClick={onAdd} label="Add New" />}
      />
      {items.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "48px 0",
            color: "rgba(244,244,245,0.3)",
            border: "1px dashed rgba(255,255,255,0.08)",
            borderRadius: 16,
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 8 }}>✦</div>
          <p style={{ fontSize: 14, fontWeight: 500 }}>No items yet. Add your first one!</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
          {items.map((item, i) => (
            <div key={i} style={{ position: "relative" }}>
              {renderCard(item, i)}
              <div style={{ position: "absolute", top: 12, right: 12 }}>
                <EditPopover
                  trigger={
                    <button
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 8,
                        border: "1px solid rgba(255,255,255,0.1)",
                        background: "rgba(255,255,255,0.06)",
                        color: "rgba(244,244,245,0.6)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = "rgba(139,92,246,0.2)";
                        (e.currentTarget as HTMLButtonElement).style.color = "#a78bfa";
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(139,92,246,0.3)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)";
                        (e.currentTarget as HTMLButtonElement).style.color = "rgba(244,244,245,0.6)";
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)";
                      }}
                    >
                      <Icons.Edit />
                    </button>
                  }
                  title={`Edit ${title.replace(/s$/, "")}`}
                  icon={<Icons.Edit />}
                  fields={fields}
                  data={item}
                  onChange={(key, value) => onEdit(i, key, value)}
                  onSave={() => {}}
                  onDelete={() => onDelete(i)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}

function AnalyticsSection({ analytics }: { analytics: AnalyticsData }) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();
  const monthLabels = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
    return months[d.getMonth()];
  });

  const trafficSources = [
    { label: "Direct", value: 38, color: "#8b5cf6" },
    { label: "Search", value: 32, color: "#06b6d4" },
    { label: "Social", value: 20, color: "#f59e0b" },
    { label: "Referral", value: 10, color: "#10b981" },
  ];

  const totalMonthly = analytics.monthlyVisits.reduce((a, b) => a + b, 0);
  const prevMonthlyTotal = analytics.monthlyVisits.slice(0, 6).reduce((a, b) => a + b, 0);
  const currentMonthlyTotal = analytics.monthlyVisits.slice(6).reduce((a, b) => a + b, 0);
  const growth =
    prevMonthlyTotal > 0
      ? Math.round(((currentMonthlyTotal - prevMonthlyTotal) / prevMonthlyTotal) * 100)
      : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <StatCard
          label="Total Visits"
          value={analytics.totalVisits.toLocaleString()}
          icon={<Icons.Globe />}
          color="#8b5cf6"
          trend={12}
        />
        <StatCard
          label="This Month"
          value={(analytics.monthlyVisits[analytics.monthlyVisits.length - 1] || 0).toLocaleString()}
          icon={<Icons.TrendUp />}
          color="#06b6d4"
          trend={growth}
        />
        <StatCard
          label="Total Edits"
          value={analytics.totalChanges}
          icon={<Icons.Activity />}
          color="#f59e0b"
          sub="Content changes"
        />
        <StatCard
          label="Sections"
          value={analytics.topSections.length}
          icon={<Icons.BarChart />}
          color="#10b981"
          sub="Edited sections"
        />
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Monthly traffic */}
        <GlassCard style={{ padding: 28 }}>
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: 0 }}>Monthly Traffic</h3>
            <p style={{ fontSize: 12, color: "rgba(244,244,245,0.4)", margin: "4px 0 0" }}>
              {totalMonthly.toLocaleString()} total visits this year
            </p>
          </div>
          <BarChart data={analytics.monthlyVisits} color="#8b5cf6" labels={monthLabels} />
          <div style={{ marginTop: 16, height: 60 }}>
            <SparkLine data={analytics.monthlyVisits} color="#cc6c5c" />
          </div>
        </GlassCard>

        {/* Traffic sources */}
        <GlassCard style={{ padding: 28 }}>
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: 0 }}>Traffic Sources</h3>
            <p style={{ fontSize: 12, color: "rgba(244,244,245,0.4)", margin: "4px 0 0" }}>
              Distribution by channel
            </p>
          </div>
          <DonutChart segments={trafficSources} />
        </GlassCard>
      </div>

      {/* Top sections */}
      <GlassCard style={{ padding: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <Icons.Zap />
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: 0 }}>Most Edited Sections</h3>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {analytics.topSections.map((sec, i) => {
            const maxEdits = Math.max(...analytics.topSections.map((s) => s.edits));
            const pct = (sec.edits / maxEdits) * 100;
            const colors = ["#8b5cf6", "#06b6d4", "#f59e0b", "#10b981", "#f87171"];
            const color = colors[i % colors.length];
            return (
              <div key={sec.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 12, color: "rgba(244,244,245,0.4)", width: 24, textAlign: "right" }}>
                  #{i + 1}
                </span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#f4f4f5", width: 110, flexShrink: 0 }}>
                  {sec.name}
                </span>
                <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3 }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${pct}%`,
                      background: `linear-gradient(90deg, ${color}, ${color}80)`,
                      borderRadius: 3,
                      transition: "width 0.8s cubic-bezier(0.34,1.56,0.64,1)",
                      boxShadow: `0 2px 8px ${color}40`,
                    }}
                  />
                </div>
                <span style={{ fontSize: 12, color, fontWeight: 700, width: 40, textAlign: "right" }}>
                  {sec.edits}
                </span>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Last saved */}
      {analytics.lastSaved && (
        <div
          style={{
            background: "rgba(139,92,246,0.06)",
            border: "1px solid rgba(139,92,246,0.15)",
            borderRadius: 16,
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Icons.Clock />
          <span style={{ fontSize: 13, color: "rgba(244,244,245,0.6)" }}>
            Last content update:{" "}
            <strong style={{ color: "#a78bfa" }}>
              {new Date(analytics.lastSaved).toLocaleString()}
            </strong>
          </span>
        </div>
      )}
    </div>
  );
}

function SettingsSection({
  onReset,
  onLogout,
}: {
  onReset: () => void;
  onLogout: () => void;
}) {
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 560 }}>
      <GlassCard style={{ padding: 28 }}>
        <SectionHeader title="Settings" subtitle="Manage your admin preferences" icon={<Icons.Settings />} />

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Reset content */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 20px",
              background: "rgba(251,146,60,0.06)",
              border: "1px solid rgba(251,146,60,0.15)",
              borderRadius: 16,
            }}
          >
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#fff", margin: 0 }}>Reset Content</p>
              <p style={{ fontSize: 12, color: "rgba(244,244,245,0.4)", margin: "3px 0 0" }}>
                Restore all content to default values
              </p>
            </div>
            {confirmReset ? (
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => setConfirmReset(false)}
                  style={{
                    padding: "7px 14px",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "transparent",
                    color: "rgba(244,244,245,0.5)",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onReset();
                    setConfirmReset(false);
                  }}
                  style={{
                    padding: "7px 14px",
                    borderRadius: 10,
                    border: "none",
                    background: "#fb923c",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Confirm Reset
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmReset(true)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 10,
                  border: "1px solid rgba(251,146,60,0.3)",
                  background: "rgba(251,146,60,0.1)",
                  color: "#fb923c",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Reset
              </button>
            )}
          </div>

          {/* Logout */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 20px",
              background: "rgba(239,68,68,0.06)",
              border: "1px solid rgba(239,68,68,0.15)",
              borderRadius: 16,
            }}
          >
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#fff", margin: 0 }}>Logout</p>
              <p style={{ fontSize: 12, color: "rgba(244,244,245,0.4)", margin: "3px 0 0" }}>
                Sign out of the admin dashboard
              </p>
            </div>
            <button
              onClick={onLogout}
              style={{
                padding: "8px 16px",
                borderRadius: 10,
                border: "1px solid rgba(239,68,68,0.3)",
                background: "rgba(239,68,68,0.1)",
                color: "#f87171",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Icons.LogOut />
              Logout
            </button>
          </div>
        </div>
      </GlassCard>

      <GlassCard style={{ padding: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff", margin: "0 0 12px" }}>About</h3>
        <p style={{ fontSize: 13, color: "rgba(244,244,245,0.4)", lineHeight: 1.6, margin: 0 }}>
          Portfolio Admin v2.0 — A premium CMS dashboard for <strong style={{ color: "#a78bfa" }}>Nikesh.Dev</strong>.
          All content is stored locally in your browser&apos;s localStorage for instant updates.
        </p>
      </GlassCard>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminPage() {
  const router = useRouter();
  const [content, setContent] = useState<PortfolioContent>(() => loadPortfolioContent());
  const [savedMessage, setSavedMessage] = useState<"saved" | "saving" | "ready">("ready");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>("dashboard");
  const [analytics, setAnalytics] = useState<AnalyticsData>(() => getAnalyticsData());
  const [changes, setChanges] = useState<ContentChange[]>(() => loadChanges());

  // Track visit on mount
  useEffect(() => {
    trackPageVisit();
    setAnalytics(getAnalyticsData());
  }, []);

  const setAndSave = (next: PortfolioContent) => {
    setContent(next);
    savePortfolioContent(next);
    window.dispatchEvent(new Event("storage"));
    setSavedMessage("saved");
    setChanges(loadChanges());
    setAnalytics(getAnalyticsData());
  };

  const updateContent = <K extends keyof PortfolioContent>(key: K, value: PortfolioContent[K]) => {
    setAndSave({ ...content, [key]: value });
  };

  // Nav links
  const addNavLink = () => {
    setAndSave({ ...content, navLinks: [...content.navLinks, { label: "New Link", href: "#" }] });
    logChange("Navigation", "added", "New nav link");
  };
  const updateNavLink = (i: number, key: string, value: string) => {
    setAndSave({
      ...content,
      navLinks: content.navLinks.map((item, idx) =>
        idx === i ? { ...item, [key]: value } : item,
      ),
    });
    logChange("Navigation", "updated", `Link ${i + 1} ${key}`);
  };
  const deleteNavLink = (i: number) => {
    setAndSave({ ...content, navLinks: content.navLinks.filter((_, idx) => idx !== i) });
    logChange("Navigation", "deleted", `Link ${i + 1}`);
  };

  // Social links
  const addSocialLink = () => {
    setAndSave({ ...content, socialLinks: [...content.socialLinks, { label: "New", href: "" }] });
    logChange("Social Links", "added");
  };
  const updateSocialLink = (i: number, key: string, value: string) => {
    setAndSave({
      ...content,
      socialLinks: content.socialLinks.map((item, idx) =>
        idx === i ? { ...item, [key]: value } : item,
      ),
    });
    logChange("Social Links", "updated", `Link ${i + 1} ${key}`);
  };
  const deleteSocialLink = (i: number) => {
    setAndSave({ ...content, socialLinks: content.socialLinks.filter((_, idx) => idx !== i) });
    logChange("Social Links", "deleted", `Link ${i + 1}`);
  };

  // Gallery
  const addGalleryItem = () => {
    setAndSave({
      ...content,
      gallery: [...content.gallery, { title: "New Item", description: "", image: "" }],
    });
    logChange("Gallery", "added");
  };
  const updateGalleryItem = (i: number, key: string, value: string) => {
    setAndSave({
      ...content,
      gallery: content.gallery.map((item, idx) =>
        idx === i ? { ...item, [key]: value } : item,
      ),
    });
    logChange("Gallery", "updated", `Item ${i + 1} ${key}`);
  };
  const deleteGalleryItem = (i: number) => {
    setAndSave({ ...content, gallery: content.gallery.filter((_, idx) => idx !== i) });
    logChange("Gallery", "deleted", `Item ${i + 1}`);
  };

  const navLinkItems = content.navLinks.map((l) => ({ label: l.label, href: l.href }));
  const socialLinkItems = content.socialLinks.map((l) => ({ label: l.label, href: l.href }));
  const galleryItems = content.gallery.map((g) => ({
    title: g.title,
    description: g.description,
    image: g.image,
  }));

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardSection content={content} changes={changes} analytics={analytics} />;
      case "hero":
        return (
          <HeroSection
            content={content}
            updateContent={updateContent}
            setSavedMessage={(m) => setSavedMessage(m === "Saving..." ? "saving" : "saved")}
          />
        );
      case "nav":
        return (
          <LinksSection
            title="Navigation Links"
            subtitle="Manage your site's main navigation"
            icon={<Icons.Link />}
            items={navLinkItems}
            onAdd={addNavLink}
            onEdit={updateNavLink}
            onDelete={deleteNavLink}
            fields={[
              { key: "label", label: "Label", type: "text", placeholder: "e.g. Works" },
              { key: "href", label: "URL", type: "url", placeholder: "#section or /page" },
            ]}
            renderCard={(item) => (
              <div
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 16,
                  padding: "16px 16px 16px 20px",
                  paddingRight: 52,
                  transition: "border-color 0.15s",
                }}
              >
                <p style={{ fontSize: 14, fontWeight: 700, color: "#fff", margin: 0 }}>{item.label || "—"}</p>
                <p
                  style={{
                    fontSize: 12,
                    color: "#8b5cf6",
                    margin: "4px 0 0",
                    fontFamily: "monospace",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.href || "No URL"}
                </p>
              </div>
            )}
          />
        );
      case "social":
        return (
          <LinksSection
            title="Social Links"
            subtitle="Connect your social profiles"
            icon={<Icons.Share />}
            items={socialLinkItems}
            onAdd={addSocialLink}
            onEdit={updateSocialLink}
            onDelete={deleteSocialLink}
            fields={[
              { key: "label", label: "Platform", type: "text", placeholder: "e.g. GitHub" },
              { key: "href", label: "URL", type: "url", placeholder: "https://..." },
            ]}
            renderCard={(item) => {
              const platformColors: Record<string, string> = {
                github: "#f4f4f5",
                linkedin: "#0a66c2",
                twitter: "#1d9bf0",
                instagram: "#e1306c",
                youtube: "#ff0000",
                default: "#8b5cf6",
              };
              const platformKey = item.label.toLowerCase();
              const color =
                Object.entries(platformColors).find(([k]) => platformKey.includes(k))?.[1] ??
                platformColors.default;
              return (
                <div
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${color}25`,
                    borderRadius: 16,
                    padding: "16px 52px 16px 20px",
                    transition: "border-color 0.15s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: `${color}18`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color,
                        fontWeight: 800,
                        fontSize: 12,
                      }}
                    >
                      {item.label.charAt(0).toUpperCase()}
                    </div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#fff", margin: 0 }}>
                      {item.label || "—"}
                    </p>
                  </div>
                  <p
                    style={{
                      fontSize: 11,
                      color: "rgba(244,244,245,0.3)",
                      margin: "6px 0 0",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.href || "No URL set"}
                  </p>
                </div>
              );
            }}
          />
        );
      case "gallery":
        return (
          <LinksSection
            title="Gallery"
            subtitle="Manage your portfolio images"
            icon={<Icons.Image />}
            items={galleryItems}
            onAdd={addGalleryItem}
            onEdit={updateGalleryItem}
            onDelete={deleteGalleryItem}
            fields={[
              { key: "title", label: "Title", type: "text", placeholder: "Image title" },
              { key: "description", label: "Description", type: "textarea", placeholder: "Brief description..." },
              { key: "image", label: "Image URL", type: "url", placeholder: "/image.png or https://..." },
            ]}
            renderCard={(item) => (
              <div
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 16,
                  overflow: "hidden",
                  paddingRight: 52,
                }}
              >
                {item.image ? (
                  <div
                    style={{
                      height: 80,
                      background: `linear-gradient(135deg, rgba(139,92,246,0.2), rgba(204,108,92,0.2))`,
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      style={{ objectFit: "cover", opacity: 0.7 }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      height: 80,
                      background: "linear-gradient(135deg, rgba(139,92,246,0.1), rgba(204,108,92,0.1))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "rgba(244,244,245,0.2)",
                      fontSize: 24,
                    }}
                  >
                    ⊞
                  </div>
                )}
                <div style={{ padding: "12px 16px" }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: 0 }}>{item.title || "—"}</p>
                  <p
                    style={{
                      fontSize: 11,
                      color: "rgba(244,244,245,0.4)",
                      margin: "3px 0 0",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.description || "No description"}
                  </p>
                </div>
              </div>
            )}
          />
        );
      case "analytics":
        return <AnalyticsSection analytics={analytics} />;
      case "settings":
        return (
          <SettingsSection
            onReset={() => {
              const next = resetPortfolioContent();
              setContent(next);
              window.dispatchEvent(new Event("storage"));
              logChange("Settings", "reset", "All content restored to defaults");
              setSavedMessage("saved");
              setChanges(loadChanges());
            }}
            onLogout={() => {
              localStorage.removeItem("admin-auth");
              router.replace("/login");
            }}
          />
        );
      default:
        return null;
    }
  };

  const sectionTitles: Record<Section, string> = {
    dashboard: "Overview",
    hero: "Hero Content",
    nav: "Navigation",
    social: "Social Links",
    gallery: "Gallery",
    analytics: "Analytics",
    settings: "Settings",
  };

  return (
    <div style={S.root}>
      {/* Ambient glows */}
      <div style={S.glow1} />
      <div style={S.glow2} />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 40,
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: 240,
          zIndex: 50,
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
          background: "linear-gradient(180deg, rgba(12,12,20,0.98) 0%, rgba(10,10,18,0.98) 100%)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
          display: "flex",
          flexDirection: "column",
        }}
        // Make sidebar always visible on md+
        className="md-sidebar"
      >
        {/* Logo */}
        <div
          style={{
            padding: "24px 20px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg, #8b5cf6, #cc6c5c)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                fontWeight: 900,
                color: "#fff",
                boxShadow: "0 4px 12px rgba(139,92,246,0.4)",
              }}
            >
              N
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.01em" }}>
                NIKESH<span style={{ color: "#cc6c5c" }}>.DEV</span>
              </p>
              <p style={{ fontSize: 10, color: "rgba(244,244,245,0.35)", margin: "1px 0 0", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Admin Console
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
          <p
            style={{
              fontSize: 10,
              color: "rgba(244,244,245,0.25)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontWeight: 600,
              padding: "4px 12px 10px",
            }}
          >
            Main Menu
          </p>
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            const IconComp = Icons[item.icon];
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: "none",
                  background: isActive
                    ? "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(204,108,92,0.1))"
                    : "transparent",
                  color: isActive ? "#a78bfa" : "rgba(244,244,245,0.5)",
                  fontSize: 13,
                  fontWeight: isActive ? 700 : 500,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  marginBottom: 2,
                  textAlign: "left",
                  borderLeft: isActive ? "2px solid #8b5cf6" : "2px solid transparent",
                  boxShadow: isActive ? "inset 0 0 0 1px rgba(139,92,246,0.15)" : "none",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
                    (e.currentTarget as HTMLButtonElement).style.color = "#f4f4f5";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                    (e.currentTarget as HTMLButtonElement).style.color = "rgba(244,244,245,0.5)";
                  }
                }}
              >
                <IconComp />
                {item.label}
                {isActive && (
                  <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#8b5cf6" }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* User footer */}
        <div style={{ padding: "12px 10px 20px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: "linear-gradient(135deg, #8b5cf6, #cc6c5c)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 800,
                color: "#fff",
                flexShrink: 0,
              }}
            >
              N
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#f4f4f5", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                Nikesh Shah
              </p>
              <p style={{ fontSize: 10, color: "rgba(244,244,245,0.35)", margin: "1px 0 0" }}>Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Area ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh", marginLeft: 0, position: "relative", zIndex: 1 }}>

        {/* ── Top Header ── */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 30,
            background: "rgba(8,8,15,0.85)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            padding: "0 24px",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          {/* Left: hamburger + breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.04)",
                color: "rgba(244,244,245,0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <Icons.Menu />
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 12, color: "rgba(244,244,245,0.3)" }}>Admin</span>
              <span style={{ fontSize: 12, color: "rgba(244,244,245,0.2)" }}>›</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>
                {sectionTitles[activeSection]}
              </span>
            </div>
          </div>

          {/* Right: status + actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Save status pill */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 12px",
                borderRadius: 20,
                background:
                  savedMessage === "saved"
                    ? "rgba(52,211,153,0.1)"
                    : savedMessage === "saving"
                    ? "rgba(251,146,60,0.1)"
                    : "rgba(255,255,255,0.05)",
                border:
                  savedMessage === "saved"
                    ? "1px solid rgba(52,211,153,0.2)"
                    : savedMessage === "saving"
                    ? "1px solid rgba(251,146,60,0.2)"
                    : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background:
                    savedMessage === "saved"
                      ? "#34d399"
                      : savedMessage === "saving"
                      ? "#fb923c"
                      : "rgba(244,244,245,0.3)",
                }}
              />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color:
                    savedMessage === "saved"
                      ? "#34d399"
                      : savedMessage === "saving"
                      ? "#fb923c"
                      : "rgba(244,244,245,0.5)",
                }}
              >
                {savedMessage === "saved" ? "Saved" : savedMessage === "saving" ? "Saving..." : "Ready"}
              </span>
            </div>

            {/* Preview site */}
            <button
              onClick={() => router.push("/")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 14px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.04)",
                color: "rgba(244,244,245,0.7)",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)";
                (e.currentTarget as HTMLButtonElement).style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
                (e.currentTarget as HTMLButtonElement).style.color = "rgba(244,244,245,0.7)";
              }}
            >
              <Icons.Eye />
              Preview
            </button>

            {/* Save button */}
            <button
              onClick={() => {
                savePortfolioContent(content);
                window.dispatchEvent(new Event("storage"));
                logChange("All", "updated", "Manual save");
                setSavedMessage("saved");
                setChanges(loadChanges());
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                borderRadius: 10,
                border: "none",
                background: "linear-gradient(135deg, #8b5cf6, #cc6c5c)",
                color: "#fff",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(139,92,246,0.3)",
                transition: "filter 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.1)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.filter = "";
              }}
            >
              <Icons.Save />
              Save
            </button>
          </div>
        </header>

        {/* ── Content ── */}
        <main style={{ flex: 1, padding: "28px 24px 40px", overflowY: "auto" }}>
          {renderSection()}
        </main>
      </div>

      {/* Sidebar CSS for md+ (since we can't use Tailwind responsive here, inject a style tag) */}
      <style>{`
        @media (min-width: 768px) {
          .md-sidebar {
            transform: translateX(0) !important;
            position: sticky !important;
            height: 100vh !important;
          }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.15); }
      `}</style>
    </div>
  );
}
