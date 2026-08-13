import { createContext, useContext } from "react";
import { vehicleStore } from "./vehicleStore";

const VehicleStoreContext = createContext(vehicleStore);

export const VehicleStoreProvider = ({ children }) => {
  return (
    <VehicleStoreContext.Provider value={vehicleStore}>
      {children}
    </VehicleStoreContext.Provider>
  );
};

export const useVehicleStore = () => useContext(VehicleStoreContext);
