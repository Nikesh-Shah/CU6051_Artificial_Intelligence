"use client";

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

type Field = {
  key: string;
  label: string;
  type: "text" | "textarea" | "url";
  hint?: string;
  placeholder?: string;
};

type EditPopoverProps = {
  trigger: React.ReactNode;
  fields: Field[];
  data: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onSave: () => void;
  onDelete?: () => void;
  title: string;
  icon?: React.ReactNode;
};

function DeleteConfirmStep({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div
      style={{
        background: "rgba(239,68,68,0.08)",
        border: "1px solid rgba(239,68,68,0.25)",
        borderRadius: 14,
        padding: "16px",
        marginTop: 4,
      }}
    >
      <p style={{ fontSize: 13, color: "#fca5a5", fontWeight: 600, marginBottom: 4 }}>
        ⚠️ Confirm Delete
      </p>
      <p style={{ fontSize: 12, color: "rgba(252,165,165,0.7)", marginBottom: 12 }}>
        This action cannot be undone. Are you sure?
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            flex: 1,
            padding: "8px 0",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.05)",
            color: "rgba(255,255,255,0.6)",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          style={{
            flex: 1,
            padding: "8px 0",
            borderRadius: 10,
            border: "none",
            background: "linear-gradient(135deg, #dc2626, #ef4444)",
            color: "#fff",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(239,68,68,0.4)",
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export function EditPopover({
  trigger,
  fields,
  data,
  onChange,
  onSave,
  onDelete,
  title,
  icon,
}: EditPopoverProps) {
  const [deleteStep, setDeleteStep] = useState(false);

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10,
    padding: "9px 12px",
    fontSize: 13,
    color: "#f4f4f5",
    outline: "none",
    transition: "border-color 0.15s, box-shadow 0.15s",
    boxSizing: "border-box",
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent align="end" width={340}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {icon && (
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(204,108,92,0.2))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#a78bfa",
                }}
              >
                {icon}
              </div>
            )}
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f4f4f5", margin: 0 }}>{title}</h3>
          </div>
          {onDelete && !deleteStep && (
            <button
              type="button"
              onClick={() => setDeleteStep(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "5px 10px",
                borderRadius: 8,
                border: "1px solid rgba(239,68,68,0.25)",
                background: "rgba(239,68,68,0.08)",
                color: "#f87171",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              Delete
            </button>
          )}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 16 }} />

        {/* Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {fields.map((field) => (
            <label key={field.key} style={{ display: "block" }}>
              <span
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "rgba(244,244,245,0.5)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 6,
                }}
              >
                {field.label}
                {field.hint && (
                  <span style={{ color: "rgba(244,244,245,0.3)", fontWeight: 400, marginLeft: 6 }}>
                    — {field.hint}
                  </span>
                )}
              </span>
              {field.type === "textarea" ? (
                <textarea
                  value={data[field.key] ?? ""}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  rows={3}
                  placeholder={field.placeholder}
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
              ) : (
                <input
                  type={field.type === "url" ? "url" : "text"}
                  value={data[field.key] ?? ""}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(139,92,246,0.5)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255,255,255,0.1)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              )}
            </label>
          ))}
        </div>

        {/* Delete confirm */}
        {deleteStep && (
          <div style={{ marginTop: 16 }}>
            <DeleteConfirmStep
              onConfirm={() => {
                setDeleteStep(false);
                onDelete?.();
              }}
              onCancel={() => setDeleteStep(false)}
            />
          </div>
        )}

        {/* Save button */}
        {!deleteStep && (
          <button
            type="button"
            onClick={onSave}
            style={{
              width: "100%",
              marginTop: 18,
              padding: "11px 0",
              borderRadius: 12,
              border: "none",
              background: "linear-gradient(135deg, #8b5cf6, #cc6c5c)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.02em",
              boxShadow: "0 4px 16px rgba(139,92,246,0.35)",
              transition: "filter 0.15s, transform 0.1s",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.filter = "brightness(1.1)";
              (e.target as HTMLButtonElement).style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.filter = "";
              (e.target as HTMLButtonElement).style.transform = "";
            }}
          >
            Save Changes
          </button>
        )}
      </PopoverContent>
    </Popover>
  );
}
