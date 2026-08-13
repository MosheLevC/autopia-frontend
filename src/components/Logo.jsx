import React from "react";

/**
 * Autopia Brand Logo Component
 * Renders the accurate PNG logo mark from public/logo.png
 *
 * @param {Object} props
 * @param {number} [props.size=40] - Logo height in px
 * @param {boolean} [props.showText=false] - Show 'אוטופיה' text alongside mark
 * @param {string} [props.className='']
 */
export default function Logo({ size = 40, showText = false, className = "" }) {
  return (
    <div
      className={`autopia-logo ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        direction: "rtl",
      }}
    >
      <img
        src="/logo.png"
        alt="Autopia Logo"
        style={{
          height: `${size}px`,
          width: "auto",
          objectFit: "contain",
          display: "block",
        }}
      />
      {showText && (
        <span
          style={{
            fontSize: `${Math.round(size * 0.5)}px`,
            fontWeight: 800,
            color: "#1e293b",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          אוטופיה <span style={{ color: "#2563eb", fontSize: "0.85em" }}>AUTOPIA</span>
        </span>
      )}
    </div>
  );
}
