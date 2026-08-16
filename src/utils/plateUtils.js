export const cleanLicensePlate = (input) => {
  if (!input) return "";
  return String(input).replace(/\D/g, "").slice(0, 8);
};

export const formatLicensePlate = (input) => {
  const clean = cleanLicensePlate(input);
  if (clean.length === 8) {
    return `${clean.slice(0, 3)}·${clean.slice(3, 5)}·${clean.slice(5, 8)}`;
  } else if (clean.length === 7) {
    return `${clean.slice(0, 2)}·${clean.slice(2, 5)}·${clean.slice(5, 7)}`;
  }
  return clean;
};

export const formatDateToDisplay = (dateValue) => {
  if (!dateValue) return "";
  const d = new Date(dateValue);
  if (isNaN(d.getTime())) return String(dateValue);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
};
