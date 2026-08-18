import { createContext, useContext } from "react";
import { maintenanceStore } from "./maintenanceStore";

const MaintenanceContext = createContext(maintenanceStore);

export function MaintenanceStoreProvider({ children }) {
  return (
    <MaintenanceContext.Provider value={maintenanceStore}>
      {children}
    </MaintenanceContext.Provider>
  );
}

export const useMaintenanceStore = () => {
  const store = useContext(MaintenanceContext);
  if (!store) {
    throw new Error(
      "useMaintenanceStore must be used within a MaintenanceStoreProvider"
    );
  }
  return store;
};
