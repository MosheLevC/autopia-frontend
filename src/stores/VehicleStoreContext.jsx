import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";

const STORAGE_KEY = "autopia_vehicles";
const ACTIVE_VEHICLE_KEY = "autopia_active_vehicle_id";

const VehicleContext = createContext(null);

export function VehicleStoreProvider({ children }) {
  const [vehicles, setVehicles] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [activeVehicleId, setActiveVehicleIdState] = useState(() => {
    try {
      const stored = localStorage.getItem(ACTIVE_VEHICLE_KEY);
      if (stored) return stored;
    } catch {
      // ignore
    }
    return null;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
    } catch {
      // ignore
    }
  }, [vehicles]);

  useEffect(() => {
    try {
      if (activeVehicleId) {
        localStorage.setItem(ACTIVE_VEHICLE_KEY, activeVehicleId);
      } else {
        localStorage.removeItem(ACTIVE_VEHICLE_KEY);
      }
    } catch {
      // ignore
    }
  }, [activeVehicleId]);

  const setActiveVehicle = useCallback((id) => {
    setActiveVehicleIdState(id);
  }, []);

  const addVehicle = useCallback((vehicleData) => {
    const newVehicle = {
      id: `v_${Date.now()}`,
      ...vehicleData,
    };
    setVehicles((prev) => {
      const updated = [...prev, newVehicle];
      return updated;
    });
    setActiveVehicleIdState(newVehicle.id);
    return newVehicle;
  }, []);

  const updateVehicle = useCallback((id, updatedFields) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updatedFields } : v))
    );
  }, []);

  const deleteVehicle = useCallback((id) => {
    setVehicles((prev) => {
      const filtered = prev.filter((v) => v.id !== id);
      setActiveVehicleIdState((currentActive) => {
        if (currentActive === id) {
          return filtered[0]?.id || null;
        }
        return currentActive;
      });
      return filtered;
    });
  }, []);

  const activeVehicle = useMemo(() => {
    if (vehicles.length === 0) return null;
    return (
      vehicles.find((v) => v.id === activeVehicleId) || vehicles[0] || null
    );
  }, [vehicles, activeVehicleId]);

  const value = {
    vehicles,
    activeVehicleId,
    activeVehicle,
    setActiveVehicle,
    addVehicle,
    updateVehicle,
    deleteVehicle,
  };

  return (
    <VehicleContext.Provider value={value}>{children}</VehicleContext.Provider>
  );
}

export const useVehicleStore = () => {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error(
      "useVehicleStore must be used within a VehicleStoreProvider"
    );
  }
  return context;
};

export const useVehicles = useVehicleStore;
