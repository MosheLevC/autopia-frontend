import blackVehicleBackground from "../images/long/car_black.png";
import blueVehicleBackground from "../images/long/car_blue.png";
import greenVehicleBackground from "../images/long/car_green.png";
import redVehicleBackground from "../images/long/car_red.png";
import silverVehicleBackground from "../images/long/car_silver.png";
import whiteVehicleBackground from "../images/long/car_white.png";
import yellowVehicleBackground from "../images/long/car_yellow.png";

const VEHICLE_BACKGROUNDS = {
  black: blackVehicleBackground,
  blue: blueVehicleBackground,
  green: greenVehicleBackground,
  red: redVehicleBackground,
  silver: silverVehicleBackground,
  white: whiteVehicleBackground,
  yellow: yellowVehicleBackground,
};

const HEBREW_COLOR_KEYWORDS = [
  ["שחור", "black"],
  ["כחול", "blue"],
  ["ירוק", "green"],
  ["אדום", "red"],
  ["לבן", "white"],
  ["צהוב", "yellow"],
  ["כסוף", "silver"],
  ["כסף", "silver"],
  ["אפור", "silver"],
];

const ENGLISH_COLOR_TO_BACKGROUND = {
  black: "black",
  blue: "blue",
  gray: "silver",
  green: "green",
  grey: "silver",
  red: "red",
  silver: "silver",
  white: "white",
  yellow: "yellow",
};

const normalizeVehicleColor = (color) =>
  typeof color === "string" ? color.trim().toLocaleLowerCase("he-IL") : "";

export function getVehicleBackground(color) {
  const normalizedColor = normalizeVehicleColor(color);
  const hebrewMatch = HEBREW_COLOR_KEYWORDS.find(([keyword]) =>
    normalizedColor.includes(keyword),
  );
  const backgroundKey =
    hebrewMatch?.[1] ||
    ENGLISH_COLOR_TO_BACKGROUND[normalizedColor] ||
    "silver";

  return VEHICLE_BACKGROUNDS[backgroundKey] || silverVehicleBackground;
}
