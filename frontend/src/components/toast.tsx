"use client";

import type React from "react";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles: React.CSSProperties = {
    position: "fixed",
    bottom: "2rem",
    right: "2rem",
    padding: "1rem 1.5rem",
    background: type === "success" ? "#10b981" : "#ef4444",
    color: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    zIndex: 1000,
    animation: "slideIn 0.3s ease-out",
    maxWidth: "400px",
  };

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
      <div style={styles}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span>{type === "success" ? "✓" : "✕"}</span>
          <span>{message}</span>
        </div>
      </div>
    </>
  );
}
