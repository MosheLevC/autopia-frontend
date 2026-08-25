import apiClient from "./apiClient";
import { cleanLicensePlate } from "../utils/plateUtils";

const vehicleService = {
  async lookupVehicle(licensePlate) {
    const clean = cleanLicensePlate(licensePlate);
    if (!clean) {
      throw new Error("נא להזין מספר רישוי");
    }

    try {
      const response = await apiClient.get(`/vehicles/lookup/${clean}`);
      const vehicle = response.data?.data?.vehicle;
      return {
        success: true,
        found: Boolean(vehicle),
        vehicle: vehicle || null,
      };
    } catch (err) {
      if (err.response?.status === 404) {
        return {
          success: true,
          found: false,
          vehicle: null,
        };
      }

      if (err.response?.status === 503) {
        throw new Error("מאגר הרכבים הממשלתי אינו זמין כעת. ניתן להמשיך להזנה ידנית.");
      }

      if (err.response?.status === 401) {
        throw new Error("נדרשת התחברות למערכת לצורך חיפוש רכב.");
      }

      if (err.code === "ECONNABORTED" || err.message?.includes("Network Error") || !err.response) {
        throw new Error("לא ניתן להתחבר לשרת. נא לוודא ששרת ה-API פעיל.");
      }

      throw new Error(err.response?.data?.message || "שגיאה בחיפוש פרטי הרכב.");
    }
  },

  async getVehicles() {
    try {
      const response = await apiClient.get("/vehicles");
      return response.data?.data?.vehicles || [];
    } catch (err) {
      throw new Error(err.response?.data?.message || "שגיאה בטעינת רשימת הרכבים");
    }
  },

  async createVehicle(vehicleData) {
    try {
      const response = await apiClient.post("/vehicles", vehicleData);
      return response.data?.data?.vehicle || null;
    } catch (err) {
      throw new Error(err.response?.data?.message || "שגיאה ביצירת הרכב");
    }
  },

  async updateVehicle(vehicleId, updateData) {
    try {
      const response = await apiClient.patch(`/vehicles/${vehicleId}`, updateData);
      return response.data?.data?.vehicle || null;
    } catch (err) {
      throw new Error(err.response?.data?.message || "שגיאה בעדכון פרטי הרכב");
    }
  },

  async deleteVehicle(vehicleId) {
    try {
      const response = await apiClient.delete(`/vehicles/${vehicleId}`);
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "שגיאה במחיקת הרכב");
    }
  },
};

export default vehicleService;
