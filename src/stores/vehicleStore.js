import { observable, action, runInAction } from "mobx";
import vehicleService from "../services/vehicleService";

const ACTIVE_VEHICLE_KEY = "autopia_active_vehicle_id";

export function createVehicleStore() {
  const store = observable({
    vehicles: [],
    activeVehicleId: null,
    isLoading: false,
    error: null,

    get activeVehicle() {
      if (!store.vehicles || store.vehicles.length === 0) return null;
      return (
        store.vehicles.find(
          (v) => v._id === store.activeVehicleId
        ) ||
        store.vehicles[0] ||
        null
      );
    },

    clearError: action(function () {
      store.error = null;
    }),

    setActiveVehicle: action(function (id) {
      store.activeVehicleId = id;
      try {
        if (id) {
          localStorage.setItem(ACTIVE_VEHICLE_KEY, id);
        } else {
          localStorage.removeItem(ACTIVE_VEHICLE_KEY);
        }
      } catch (error) {
        console.warn("[vehicleStore] Failed to save active vehicle ID:", error);
      }
    }),

    async fetchVehicles() {
      runInAction(() => {
        store.isLoading = true;
        store.error = null;
      });

      try {
        const vehicles = await vehicleService.getVehicles();
        runInAction(() => {
          store.vehicles = vehicles || [];
          const storedActiveId = localStorage.getItem(ACTIVE_VEHICLE_KEY);
          const activeExists = store.vehicles.some(
            (v) => v._id === storedActiveId
          );
          if (activeExists) {
            store.activeVehicleId = storedActiveId;
          } else if (store.vehicles.length > 0) {
            store.activeVehicleId = store.vehicles[0]._id;
          } else {
            store.activeVehicleId = null;
          }
        });
        return vehicles;
      } catch (err) {
        runInAction(() => {
          store.error = err.message || "שגיאה בטעינת הרכבים";
        });
        throw err;
      } finally {
        runInAction(() => {
          store.isLoading = false;
        });
      }
    },

    async createVehicle(vehicleData) {
      runInAction(() => {
        store.isLoading = true;
        store.error = null;
      });

      try {
        const newVehicle = await vehicleService.createVehicle(vehicleData);
        runInAction(() => {
          if (newVehicle) {
            store.vehicles.push(newVehicle);
            const id = newVehicle._id;
            store.activeVehicleId = id;
            try {
              localStorage.setItem(ACTIVE_VEHICLE_KEY, id);
            } catch {}
          }
        });
        return newVehicle;
      } catch (err) {
        runInAction(() => {
          store.error = err.message || "שגיאה בהוספת הרכב";
        });
        throw err;
      } finally {
        runInAction(() => {
          store.isLoading = false;
        });
      }
    },

    async updateVehicle(vehicleId, updateData) {
      runInAction(() => {
        store.isLoading = true;
        store.error = null;
      });

      try {
        const updated = await vehicleService.updateVehicle(vehicleId, updateData);
        runInAction(() => {
          if (updated) {
            const index = store.vehicles.findIndex(
              (v) => v._id === vehicleId
            );
            if (index !== -1) {
              store.vehicles[index] = updated;
            }
          }
        });
        return updated;
      } catch (err) {
        runInAction(() => {
          store.error = err.message || "שגיאה בעדכון הרכב";
        });
        throw err;
      } finally {
        runInAction(() => {
          store.isLoading = false;
        });
      }
    },

    async deleteVehicle(vehicleId) {
      runInAction(() => {
        store.isLoading = true;
        store.error = null;
      });

      try {
        await vehicleService.deleteVehicle(vehicleId);
        runInAction(() => {
          store.vehicles = store.vehicles.filter(
            (v) => v._id !== vehicleId
          );
          if (store.activeVehicleId === vehicleId) {
            const nextActive = store.vehicles[0];
            const nextId = nextActive ? nextActive._id : null;
            store.activeVehicleId = nextId;
            try {
              if (nextId) {
                localStorage.setItem(ACTIVE_VEHICLE_KEY, nextId);
              } else {
                localStorage.removeItem(ACTIVE_VEHICLE_KEY);
              }
            } catch {}
          }
        });
      } catch (err) {
        runInAction(() => {
          store.error = err.message || "שגיאה במחיקת הרכב";
        });
        throw err;
      } finally {
        runInAction(() => {
          store.isLoading = false;
        });
      }
    },

    clear: action(function () {
      store.vehicles = [];
      store.activeVehicleId = null;
      store.error = null;
      store.isLoading = false;
      try {
        localStorage.removeItem(ACTIVE_VEHICLE_KEY);
      } catch {}
    }),
  });

  return store;
}

export const vehicleStore = createVehicleStore();

