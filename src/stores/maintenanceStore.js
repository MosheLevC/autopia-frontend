import { observable, action, runInAction } from "mobx";
import maintenanceService from "../services/maintenanceService";

export function createMaintenanceStore() {
  const store = observable({
    maintenances: [],
    maintenancesVehicleId: null,
    activeMaintenance: null,
    isLoading: false,
    error: null,

    clearError: action(function () {
      store.error = null;
    }),

    async fetchMaintenances(vehicleId) {
      if (!vehicleId) {
        runInAction(() => {
          store.maintenances = [];
          store.maintenancesVehicleId = null;
          store.isLoading = false;
        });
        return [];
      }

      runInAction(() => {
        store.isLoading = true;
        store.error = null;
        store.maintenances = [];
      });

      try {
        const records = await maintenanceService.getMaintenances(vehicleId);
        runInAction(() => {
          store.maintenances = Array.isArray(records) ? records : [];
          store.maintenancesVehicleId = vehicleId;
        });
        return records;
      } catch (err) {
        runInAction(() => {
          store.error = err.message || "שגיאה בטעינת יומן הטיפולים";
        });
        throw err;
      } finally {
        runInAction(() => {
          store.isLoading = false;
        });
      }
    },

    async fetchMaintenanceById(vehicleId, maintenanceId) {
      runInAction(() => {
        store.isLoading = true;
        store.error = null;
      });

      try {
        const record = await maintenanceService.getMaintenanceById(vehicleId, maintenanceId);
        runInAction(() => {
          store.activeMaintenance = record;
        });
        return record;
      } catch (err) {
        runInAction(() => {
          store.error = err.message || "שגיאה בטעינת פרטי הטיפול";
        });
        throw err;
      } finally {
        runInAction(() => {
          store.isLoading = false;
        });
      }
    },

    async createMaintenance(vehicleId, maintenanceData) {
      runInAction(() => {
        store.isLoading = true;
        store.error = null;
      });

      try {
        const result = await maintenanceService.createMaintenance(vehicleId, maintenanceData);
        const maintenance = result?.maintenance || result;
        const vehicle = result?.vehicle || null;

        runInAction(() => {
          if (
            maintenance &&
            store.maintenancesVehicleId === vehicleId
          ) {
            store.maintenances.unshift(maintenance);
          }
        });
        return { maintenance, vehicle };
      } catch (err) {
        runInAction(() => {
          store.error = err.message || "שגיאה בהוספת הטיפול";
        });
        throw err;
      } finally {
        runInAction(() => {
          store.isLoading = false;
        });
      }
    },

    async updateMaintenance(vehicleId, maintenanceId, updateData) {
      runInAction(() => {
        store.isLoading = true;
        store.error = null;
      });

      try {
        const result = await maintenanceService.updateMaintenance(vehicleId, maintenanceId, updateData);
        const maintenance = result?.maintenance || result;
        const vehicle = result?.vehicle || null;

        runInAction(() => {
          if (maintenance) {
            if (store.maintenancesVehicleId === vehicleId) {
              const index = store.maintenances.findIndex(
                (m) => m._id === maintenanceId,
              );
              if (index !== -1) {
                store.maintenances[index] = maintenance;
              }
            }
            if (store.activeMaintenance?._id === maintenanceId) {
              store.activeMaintenance = maintenance;
            }
          }
        });
        return { maintenance, vehicle };
      } catch (err) {
        runInAction(() => {
          store.error = err.message || "שגיאה בעדכון הטיפול";
        });
        throw err;
      } finally {
        runInAction(() => {
          store.isLoading = false;
        });
      }
    },

    async deleteMaintenance(vehicleId, maintenanceId) {
      runInAction(() => {
        store.isLoading = true;
        store.error = null;
      });

      try {
        await maintenanceService.deleteMaintenance(vehicleId, maintenanceId);
        runInAction(() => {
          if (store.maintenancesVehicleId === vehicleId) {
            store.maintenances = store.maintenances.filter(
              (m) => m._id !== maintenanceId,
            );
          }
          if (store.activeMaintenance?._id === maintenanceId) {
            store.activeMaintenance = null;
          }
        });
      } catch (err) {
        runInAction(() => {
          store.error = err.message || "שגיאה במחיקת הטיפול";
        });
        throw err;
      } finally {
        runInAction(() => {
          store.isLoading = false;
        });
      }
    },

    clear: action(function () {
      store.maintenances = [];
      store.maintenancesVehicleId = null;
      store.activeMaintenance = null;
      store.error = null;
      store.isLoading = false;
    }),
  });

  return store;
}

export const maintenanceStore = createMaintenanceStore();
