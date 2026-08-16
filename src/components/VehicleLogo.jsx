import { Box } from "@mantine/core";
import { findMake, VehicleMakes } from "node-vehicle-logos";

const HEBREW_MAKE_MAP = {
  "טויוטה": "Toyota",
  "יונדאי": "Hyundai",
  "קיה": "Kia",
  "מאזדה": "Mazda",
  "טסלה": "Tesla",
  "סקודה": "Skoda",
  "פיז'ו": "Peugeot",
  "ניסאן": "Nissan",
  "מרצדס": "Mercedes-Benz",
  "ב.מ.וו": "BMW",
  "שברולט": "Chevrolet",
  "פולקסווגן": "Volkswagen",
  "סובארו": "Subaru",
  "סוזוקי": "Suzuki",
  "אאודי": "Audi",
  "סיאט": "Seat",
  "רנו": "Renault",
  "וולוו": "Volvo",
  "ג'יפ": "Jeep",
  "סיטרואן": "Citroen",
  "פורד": "Ford",
  "הונדה": "Honda",
  "מיצובישי": "Mitsubishi",
  "קופרה": "Cupra",
  "ג'אקו": "Jaecoo",
  "BYD": "BYD",
  "ג'ילי": "Geely",
  "MG": "MG",
};

const resolveManufacturerName = (name) => {
  if (!name) return "";
  const trimmed = String(name).trim();
  for (const [hebKey, engMake] of Object.entries(HEBREW_MAKE_MAP)) {
    if (trimmed.includes(hebKey)) {
      return engMake;
    }
  }
  return trimmed;
};

export default function VehicleLogo({
  manufacturer,
  size = 36,
  className = "",
}) {
  if (!manufacturer) return null;

  const resolved = resolveManufacturerName(manufacturer);
  const matched =
    findMake(resolved, VehicleMakes, "contains") ||
    findMake(resolved, VehicleMakes);
  const fallbackInitial = resolved.charAt(0).toUpperCase();

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
