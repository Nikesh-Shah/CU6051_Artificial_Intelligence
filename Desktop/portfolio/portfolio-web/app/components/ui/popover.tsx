"use client";

import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";

type PopoverContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
};

const PopoverContext = createContext<PopoverContextType>({
  open: false,
  setOpen: () => {},
  triggerRef: { current: null },
});

export function Popover({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  return (
    <PopoverContext.Provider value={{ open, setOpen, triggerRef }}>
      <div style={{ position: "relative", display: "inline-block" }}>
        {children}
      </div>
    </PopoverContext.Provider>
  );
}

export function PopoverTrigger({
  children,
  asChild,
}: {
  children: React.ReactNode;
  asChild?: boolean;
}) {
  const { open, setOpen, triggerRef } = useContext(PopoverContext);
  const handleClick = useCallback(() => setOpen(!open), [open, setOpen]);

  if (asChild && typeof children === "object" && children !== null) {
    return (
      <span
        ref={triggerRef as React.RefObject<HTMLSpanElement>}
        onClick={handleClick}
        style={{ display: "inline-block" }}
      >
        {children}
      </span>
    );
  }
  return (
    <button
      ref={triggerRef as React.RefObject<HTMLButtonElement>}
      type="button"
      onClick={handleClick}
      style={{ display: "inline-block" }}
    >
      {children}
    </button>
  );
}

export function PopoverContent({
  children,
  align = "end",
  className = "",
  width = 340,
}: {
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  className?: string;
  width?: number;
}) {
  const { open, setOpen, triggerRef } = useContext(PopoverContext);
  const contentRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      setVisible(false);
      return;
    }

    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    const W = width;

    let left: number;
    if (align === "start") left = rect.left + scrollX;
    else if (align === "end") left = rect.right + scrollX - W;
    else left = rect.left + scrollX + rect.width / 2 - W / 2;

    // clamp to viewport
    left = Math.max(8, Math.min(left, window.innerWidth - W - 8));

    setPos({
      top: rect.bottom + scrollY + 8,
      left,
    });

    // trigger animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });
  }, [open, align, width, triggerRef]);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open, setOpen, triggerRef]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      ref={contentRef}
      className={className}
      style={{
        position: "absolute",
        top: pos.top,
        left: pos.left,
        width,
        zIndex: 9999,
        background: "linear-gradient(135deg, rgba(15,15,25,0.97) 0%, rgba(20,20,35,0.97) 100%)",
        border: "1px solid rgba(139,92,246,0.25)",
        borderRadius: 20,
        boxShadow: "0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        padding: "20px",
        transform: visible ? "scale(1) translateY(0)" : "scale(0.95) translateY(-8px)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.2s cubic-bezier(0.34,1.56,0.64,1), opacity 0.15s ease",
        transformOrigin: "top right",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>,
    document.body
  );
}
