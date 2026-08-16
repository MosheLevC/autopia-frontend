import { observable, action } from "mobx";

const STORAGE_KEY = "autopia_vehicles";
const ACTIVE_VEHICLE_KEY = "autopia_active_vehicle_id";

export function createVehicleStore() {
  const store = observable({
    vehicles: [],
    activeVehicleId: null,

    get activeVehicle() {
      if (store.vehicles.length === 0) return null;
      return (
        store.vehicles.find((v) => v.id === store.activeVehicleId) ||
        store.vehicles[0] ||
        null
      );
    },

    setActiveVehicle: action(function (id) {
      store.activeVehicleId = id;
      store.saveToStorage();
    }),

    addVehicle: action(function (vehicleData) {
      const newVehicle = {
        id: `v_${Date.now()}`,
        ...vehicleData,
      };
      store.vehicles.push(newVehicle);
      store.activeVehicleId = newVehicle.id;
      store.saveToStorage();
      return newVehicle;
    }),

    updateVehicle: action(function (id, updatedFields) {
      const index = store.vehicles.findIndex((v) => v.id === id);
      if (index !== -1) {
        store.vehicles[index] = {
          ...store.vehicles[index],
          ...updatedFields,
        };
        store.saveToStorage();
      }
    }),

    deleteVehicle: action(function (id) {
      store.vehicles = store.vehicles.filter((v) => v.id !== id);
      if (store.activeVehicleId === id) {
        store.activeVehicleId = store.vehicles[0]?.id || null;
      }
      store.saveToStorage();
    }),

    clear: action(function () {
      store.vehicles = [];
      store.activeVehicleId = null;
      store.clearStorage();
    }),

    saveToStorage() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store.vehicles));
        if (store.activeVehicleId) {
          localStorage.setItem(ACTIVE_VEHICLE_KEY, store.activeVehicleId);
        } else {
          localStorage.removeItem(ACTIVE_VEHICLE_KEY);
        }
      } catch {
        // ignore storage errors
      }
    },

    clearStorage() {
      try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(ACTIVE_VEHICLE_KEY);
      } catch {
        // ignore storage errors
      }
    },

    loadFromStorage: action(function () {
      try {
        const storedVehicles = localStorage.getItem(STORAGE_KEY);
        const storedActiveId = localStorage.getItem(ACTIVE_VEHICLE_KEY);

        if (storedVehicles) {
          const parsed = JSON.parse(storedVehicles);
          if (Array.isArray(parsed)) {
            store.vehicles = parsed;
          }
        }

        if (storedActiveId) {
          store.activeVehicleId = storedActiveId;
        }
      } catch {
        // ignore load errors
      }
    }),
  });

  store.loadFromStorage();
  return store;
}

export const vehicleStore = createVehicleStore();
