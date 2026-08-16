import { createContext, useContext } from "react";
import { vehicleStore } from "./vehicleStore";

const VehicleContext = createContext(vehicleStore);

export function VehicleStoreProvider({ children }) {
  return (
    <VehicleContext.Provider value={vehicleStore}>
      {children}
    </VehicleContext.Provider>
  );
}

export const useVehicleStore = () => {
  const store = useContext(VehicleContext);
  if (!store) {
    throw new Error(
      "useVehicleStore must be used within a VehicleStoreProvider"
    );
  }
  return store;
};
