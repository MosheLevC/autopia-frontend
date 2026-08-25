import apiClient from "./apiClient";

const reminderService = {
  async getReminders(vehicleId) {
    if (!vehicleId) return [];

    try {
      const response = await apiClient.get(`/vehicles/${vehicleId}/reminders`);
      return response.data?.data?.reminders || response.data?.reminders || [];
    } catch (err) {
      throw new Error(err.response?.data?.message || "שגיאה בטעינת התזכורות");
    }
  },

  async getReminderById(vehicleId, reminderId) {
    try {
      const response = await apiClient.get(
        `/vehicles/${vehicleId}/reminders/${reminderId}`
      );
      return response.data?.data?.reminder || response.data?.reminder || null;
    } catch (err) {
      throw new Error(err.response?.data?.message || "שגיאה בטעינת פרטי התזכורת");
    }
  },

  async createReminder(vehicleId, data) {
    try {
      const response = await apiClient.post(
        `/vehicles/${vehicleId}/reminders`,
        data
      );
      return response.data?.data?.reminder || response.data?.reminder || null;
    } catch (err) {
      throw new Error(err.response?.data?.message || "שגיאה בהוספת תזכורת חדשה");
    }
  },

  async updateReminder(vehicleId, reminderId, data) {
    try {
      const response = await apiClient.patch(
        `/vehicles/${vehicleId}/reminders/${reminderId}`,
        data
      );
      return response.data?.data?.reminder || response.data?.reminder || null;
    } catch (err) {
      throw new Error(err.response?.data?.message || "שגיאה בעדכון התזכורת");
    }
  },

  async deleteReminder(vehicleId, reminderId) {
    try {
      const response = await apiClient.delete(
        `/vehicles/${vehicleId}/reminders/${reminderId}`
      );
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "שגיאה במחיקת התזכורת");
    }
  },

  async renewReminder(vehicleId, reminderId) {
    try {
      const response = await apiClient.post(
        `/vehicles/${vehicleId}/reminders/${reminderId}/renew`
      );
      return response.data?.data?.reminder || response.data?.reminder || null;
    } catch (err) {
      throw new Error(err.response?.data?.message || "שגיאה בחידוש התזכורת");
    }
  },
};

export default reminderService;
