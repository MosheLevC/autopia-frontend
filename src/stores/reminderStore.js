import { observable, action, runInAction } from "mobx";
import reminderService from "../services/reminderService";

export function createReminderStore() {
  const store = observable({
    reminders: [],
    remindersVehicleId: null,
    activeReminder: null,
    isLoading: false,
    error: null,

    clearError: action(function () {
      store.error = null;
    }),

    async fetchReminders(vehicleId) {
      if (!vehicleId) {
        runInAction(() => {
          store.reminders = [];
          store.remindersVehicleId = null;
          store.isLoading = false;
        });
        return [];
      }

      runInAction(() => {
        store.isLoading = true;
        store.error = null;
        if (store.remindersVehicleId !== vehicleId) {
          store.reminders = [];
        }
      });

      try {
        const records = await reminderService.getReminders(vehicleId);
        runInAction(() => {
          store.reminders = Array.isArray(records) ? records : [];
          store.remindersVehicleId = vehicleId;
        });
        return records;
      } catch (err) {
        runInAction(() => {
          store.error = err.message || "שגיאה בטעינת התזכורות";
        });
        throw err;
      } finally {
        runInAction(() => {
          store.isLoading = false;
        });
      }
    },

    async fetchReminderById(vehicleId, reminderId) {
      runInAction(() => {
        store.isLoading = true;
        store.error = null;
      });

      try {
        const record = await reminderService.getReminderById(
          vehicleId,
          reminderId
        );
        runInAction(() => {
          store.activeReminder = record;
        });
        return record;
      } catch (err) {
        runInAction(() => {
          store.error = err.message || "שגיאה בטעינת פרטי התזכורת";
        });
        throw err;
      } finally {
        runInAction(() => {
          store.isLoading = false;
        });
      }
    },

    async createReminder(vehicleId, reminderData) {
      runInAction(() => {
        store.isLoading = true;
        store.error = null;
      });

      try {
        const reminder = await reminderService.createReminder(
          vehicleId,
          reminderData
        );

        runInAction(() => {
          if (reminder && store.remindersVehicleId === vehicleId) {
            store.reminders.push(reminder);
            store.reminders.sort(
              (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
            );
          }
        });
        return reminder;
      } catch (err) {
        runInAction(() => {
          store.error = err.message || "שגיאה בהוספת התזכורת";
        });
        throw err;
      } finally {
        runInAction(() => {
          store.isLoading = false;
        });
      }
    },

    async updateReminder(vehicleId, reminderId, updateData) {
      runInAction(() => {
        store.isLoading = true;
        store.error = null;
      });

      try {
        const reminder = await reminderService.updateReminder(
          vehicleId,
          reminderId,
          updateData
        );

        runInAction(() => {
          if (reminder) {
            if (store.remindersVehicleId === vehicleId) {
              const index = store.reminders.findIndex(
                (r) => r._id === reminderId
              );
              if (index !== -1) {
                store.reminders[index] = reminder;
                store.reminders.sort(
                  (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
                );
              }
            }
            if (store.activeReminder?._id === reminderId) {
              store.activeReminder = reminder;
            }
          }
        });
        return reminder;
      } catch (err) {
        runInAction(() => {
          store.error = err.message || "שגיאה בעדכון התזכורת";
        });
        throw err;
      } finally {
        runInAction(() => {
          store.isLoading = false;
        });
      }
    },

    async deleteReminder(vehicleId, reminderId) {
      runInAction(() => {
        store.isLoading = true;
        store.error = null;
      });

      try {
        await reminderService.deleteReminder(vehicleId, reminderId);
        runInAction(() => {
          if (store.remindersVehicleId === vehicleId) {
            store.reminders = store.reminders.filter(
              (r) => r._id !== reminderId
            );
          }
          if (store.activeReminder?._id === reminderId) {
            store.activeReminder = null;
          }
        });
      } catch (err) {
        runInAction(() => {
          store.error = err.message || "שגיאה במחיקת התזכורת";
        });
        throw err;
      } finally {
        runInAction(() => {
          store.isLoading = false;
        });
      }
    },

    async renewReminder(vehicleId, reminderId) {
      runInAction(() => {
        store.isLoading = true;
        store.error = null;
      });

      try {
        const renewed = await reminderService.renewReminder(
          vehicleId,
          reminderId
        );
        runInAction(() => {
          if (renewed) {
            if (store.remindersVehicleId === vehicleId) {
              const index = store.reminders.findIndex(
                (r) => r._id === reminderId
              );
              if (index !== -1) {
                store.reminders[index] = renewed;
                store.reminders.sort(
                  (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
                );
              }
            }
            if (store.activeReminder?._id === reminderId) {
              store.activeReminder = renewed;
            }
          }
        });
        return renewed;
      } catch (err) {
        runInAction(() => {
          store.error = err.message || "שגיאה בחידוש התזכורת";
        });
        throw err;
      } finally {
        runInAction(() => {
          store.isLoading = false;
        });
      }
    },

    clear: action(function () {
      store.reminders = [];
      store.remindersVehicleId = null;
      store.activeReminder = null;
      store.error = null;
      store.isLoading = false;
    }),
  });

  return store;
}

export const reminderStore = createReminderStore();
