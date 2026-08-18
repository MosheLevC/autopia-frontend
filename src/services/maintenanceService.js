import apiClient from "./apiClient";

export const maintenanceService = {
  async getMaintenances(vehicleId) {
    if (!vehicleId) return [];

    try {
      const response = await apiClient.get(`/vehicles/${vehicleId}/maintenances`);
      return response.data?.data?.maintenances || response.data?.maintenances || [];
    } catch (err) {
      throw new Error(err.response?.data?.message || "שגיאה בטעינת יומן הטיפולים");
    }
  },

  async getMaintenanceById(vehicleId, maintenanceId) {
    try {
      const response = await apiClient.get(`/vehicles/${vehicleId}/maintenances/${maintenanceId}`);
      return response.data?.data?.maintenance || response.data?.maintenance || null;
    } catch (err) {
      throw new Error(err.response?.data?.message || "שגיאה בטעינת פרטי הטיפול");
    }
  },

  async createMaintenance(vehicleId, data) {
    try {
      const response = await apiClient.post(`/vehicles/${vehicleId}/maintenances`, data);
      return response.data?.data?.maintenance || response.data?.maintenance || null;
    } catch (err) {
      throw new Error(err.response?.data?.message || "שגיאה בהוספת טיפול חדש");
    }
  },

  async updateMaintenance(vehicleId, maintenanceId, data) {
    try {
      const response = await apiClient.patch(`/vehicles/${vehicleId}/maintenances/${maintenanceId}`, data);
      return response.data?.data?.maintenance || response.data?.maintenance || null;
    } catch (err) {
      throw new Error(err.response?.data?.message || "שגיאה בעדכון פרטי הטיפול");
    }
  },

  async deleteMaintenance(vehicleId, maintenanceId) {
    try {
      const response = await apiClient.delete(`/vehicles/${vehicleId}/maintenances/${maintenanceId}`);
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "שגיאה במחיקת הטיפול");
    }
  },
};

export default maintenanceService;
