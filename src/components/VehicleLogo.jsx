import { findMake, VehicleMakes } from "node-vehicle-logos";

export default function VehicleLogo({ make, size = 36, className = "" }) {
  if (!make) return null;

  const matched = findMake(make, VehicleMakes, "contains") || findMake(make, VehicleMakes);

  const fallbackInitial = make.charAt(0).toUpperCase();

  return (
    <div
      className={`vehicle-logo-wrapper ${className}`}
      style={{
        width: size,
        height: size,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "8px",
        background: "#f1f5f9",
        color: "#1e293b",
        fontWeight: "bold",
        fontSize: size * 0.4,
        overflow: "hidden"
      }}
    >
      {matched ? (
        <span style={{ fontSize: size * 0.45 }}>🏎️</span>
      ) : (
        <span>{fallbackInitial}</span>
      )}
    </div>
  );
}
