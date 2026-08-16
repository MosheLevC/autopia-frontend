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

const formatGovDateToDisplay = (dateStr) => {
  if (!dateStr) return "";
  const cleanDate = dateStr.slice(0, 10);
  const parts = cleanDate.split("-");
  if (parts.length === 3) {
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
  }
  return dateStr;
};

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
  "MG": "MG"
};

const normalizeMakeName = (rawMakeStr) => {
  if (!rawMakeStr) return "יצרן כללי";
  const str = String(rawMakeStr).trim();
  for (const [hebKey, engMake] of Object.entries(HEBREW_MAKE_MAP)) {
    if (str.includes(hebKey)) {
      return engMake;
    }
  }
  return str;
};

// Ministry of Transport Datastore Resource IDs (data.gov.il)
// Primary: Active Private & Commercial Vehicles Dataset
const ACTIVE_VEHICLES_RESOURCE_ID = "053cea08-09bc-40ec-8f7a-156f0677aff3";
// Secondary: Special Purpose / Imported / Legacy Vehicles Dataset
const SPECIAL_VEHICLES_RESOURCE_ID = "0866573c-40cd-4ca8-91d2-9dd2d7a492e5";

export const fetchVehicleDetailsByPlate = async (plateNumber) => {
  const cleanDigits = cleanPlateNumber(plateNumber);
  if (!cleanDigits || (cleanDigits.length !== 7 && cleanDigits.length !== 8)) {
    throw new Error("מספר רישוי חייב להכיל 7 או 8 ספרות");
  }

  const numericPlate = parseInt(cleanDigits, 10);

  const tryFetchFromResource = async (resourceId) => {
    try {
      const response = await axios.get("https://data.gov.il/api/3/action/datastore_search", {
        params: {
          resource_id: resourceId,
          filters: JSON.stringify({ mispar_rechev: numericPlate }),
          limit: 1
        },
        timeout: 6000
      });

      const records = response.data?.result?.records;
      if (records && records.length > 0) {
        return records[0];
      }
    } catch (err) {
      console.warn(`[licensePlateService] Fetch failed for dataset ${resourceId}:`, err?.message || err);
    }
    return null;
  };

  let record = await tryFetchFromResource(ACTIVE_VEHICLES_RESOURCE_ID);

  if (!record) {
    record = await tryFetchFromResource(SPECIAL_VEHICLES_RESOURCE_ID);
  }

  if (record) {
    const rawMake = record.tozeret_nm || record.make || "";
    const make = normalizeMakeName(rawMake);
    const model = record.kinuy_mishari || record.model_nm || record.degem_nm || "דגם כללי";
    const year = record.shnat_yitzur ? parseInt(record.shnat_yitzur, 10) : new Date().getFullYear();
    const color = record.tzeva_rechev || "לבן";
    const fuelType = record.sug_delek_nm || "בנזין";
    const rawTestDate = record.tokef_dt ? record.tokef_dt.slice(0, 10) : "";
    const testExpiryDate = formatGovDateToDisplay(rawTestDate);

    return {
      success: true,
      found: true,
      source: "gov_api",
      data: {
        make,
        model,
        year,
        color,
        fuelType,
        mileage: 0,
        testExpiryDate,
        rawGovernmentData: record
      }
    };
  }

  return {
    success: true,
    found: false,
    source: "none",
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
