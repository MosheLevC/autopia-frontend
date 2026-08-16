import { Box } from "@mantine/core";
import { findMake, VehicleMakes } from "node-vehicle-logos";

export default function VehicleLogo({ make, size = 36, className = "" }) {
  if (!make) return null;

  const matched = findMake(make, VehicleMakes, "contains") || findMake(make, VehicleMakes);
  const fallbackInitial = make.charAt(0).toUpperCase();

  return (
    <Box
      className={`vehicle-logo-wrapper ${className}`}
      w={size}
      h={size}
      radius="sm"
      bg="gray.1"
      fw={700}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.4,
        overflow: "hidden",
      }}
    >
      {matched ? (
        <span style={{ fontSize: size * 0.45 }}>🏎️</span>
      ) : (
        <span>{fallbackInitial}</span>
      )}
    </Box>
  );
}

