import axios from "axios";

export const cleanPlateNumber = (input) => {
  if (!input) return "";
  return String(input).replace(/\D/g, "").slice(0, 8);
};

export const formatPlateNumber = (input) => {
  const clean = cleanPlateNumber(input);
  if (clean.length === 8) {
    return `${clean.slice(0, 3)}·${clean.slice(3, 5)}·${clean.slice(5, 8)}`;
  } else if (clean.length === 7) {
    return `${clean.slice(0, 2)}·${clean.slice(2, 5)}·${clean.slice(5, 7)}`;
  }
  return clean;
};

const MOCK_PLATE_DATABASE = {
  "12345678": {
    make: "Toyota",
    model: "Corolla Hybrid",
    year: 2023,
    color: "לבן פנינה",
    fuelType: "היברידי",
    mileage: 32000,
    lastServiceDate: "2024-02-10",
    lastServiceMileage: 28000,
    serviceInterval: "כל 15,000 ק\"מ / שנה",
    testExpiryDate: "2025-08-15",
    insuranceExpiryDate: "2025-09-01"
  },
  "1234567": {
    make: "Mazda",
    model: "Mazda 3",
    year: 2019,
    color: "אדום מטאלי",
    fuelType: "בנזין",
    mileage: 78000,
    lastServiceDate: "2023-11-05",
    lastServiceMileage: 70000,
    serviceInterval: "כל 15,000 ק\"מ / שנה",
    testExpiryDate: "2025-04-10",
    insuranceExpiryDate: "2025-05-15"
  },
  "8899900": {
    make: "Hyundai",
    model: "Ioniq 5",
    year: 2024,
    color: "אפור עכבר",
    fuelType: "חשמלי",
    mileage: 15000,
    lastServiceDate: "2024-05-01",
    lastServiceMileage: 15000,
    serviceInterval: "כל 20,000 ק\"מ / 2 שנים",
    testExpiryDate: "2026-03-30",
    insuranceExpiryDate: "2026-04-15"
  },
  "11223344": {
    make: "Tesla",
    model: "Model 3",
    year: 2023,
    color: "שחור",
    fuelType: "חשמלי",
    mileage: 24000,
    lastServiceDate: "2024-01-20",
    lastServiceMileage: 20000,
    serviceInterval: "כל 20,000 ק\"מ / 2 שנים",
    testExpiryDate: "2026-01-20",
    insuranceExpiryDate: "2026-02-01"
  },
  "55666777": {
    make: "Kia",
    model: "Sportage",
    year: 2021,
    color: "כסוף",
    fuelType: "בנזין",
    mileage: 52000,
    lastServiceDate: "2024-03-12",
    lastServiceMileage: 45000,
    serviceInterval: "כל 15,000 ק\"מ / שנה",
    testExpiryDate: "2025-11-01",
    insuranceExpiryDate: "2025-12-01"
  }
};

export const fetchVehicleDetailsByPlate = async (plateNumber) => {
  const cleanDigits = plateNumber.replace(/\D/g, "");
  if (!cleanDigits || (cleanDigits.length !== 7 && cleanDigits.length !== 8)) {
    throw new Error("מספר רישוי חייב להכיל 7 או 8 ספרות");
  }

  if (MOCK_PLATE_DATABASE[cleanDigits]) {
    await new Promise((res) => setTimeout(res, 600));
    return {
      success: true,
      found: true,
      data: MOCK_PLATE_DATABASE[cleanDigits]
    };
  }

  try {
    const response = await axios.get("https://data.gov.il/api/3/action/datastore_search", {
      params: {
        resource_id: "05a481d8-a477-49bc-be85-b9e73b7e7592",
        filters: JSON.stringify({ mispar_rechev: cleanDigits })
      },
      timeout: 4000
    });

    const records = response.data?.result?.records;
    if (records && records.length > 0) {
      const rec = records[0];
      return {
        success: true,
        found: true,
        data: {
          make: rec.tozeret_nm || rec.make || "יצרן כללי",
          model: rec.kinuy_mishari || rec.model_nm || "דגם כללי",
          year: rec.shnat_yitzur ? parseInt(rec.shnat_yitzur, 10) : new Date().getFullYear(),
          color: rec.tzeva_rechev || "לבן",
          fuelType: rec.sug_delek_nm || "בנזין",
          mileage: 0,
          testExpiryDate: rec.tokef_dt ? rec.tokef_dt.slice(0, 10) : ""
        }
      };
    }
  } catch {
    // TODO: log backend API fallback
  }

  return {
    success: true,
    found: false,
    data: {
      make: "",
      model: "",
      year: new Date().getFullYear(),
      color: "לבן",
      fuelType: "בנזין",
      mileage: 0
    }
  };
};
