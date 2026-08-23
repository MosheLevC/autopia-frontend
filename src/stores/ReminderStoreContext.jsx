import { createContext, useContext } from "react";
import { reminderStore } from "./reminderStore";

const ReminderContext = createContext(reminderStore);

export function ReminderStoreProvider({ children }) {
  return (
    <ReminderContext.Provider value={reminderStore}>
      {children}
    </ReminderContext.Provider>
  );
}

export const useReminderStore = () => {
  const store = useContext(ReminderContext);
  if (!store) {
    throw new Error(
      "useReminderStore must be used within a ReminderStoreProvider"
    );
  }
  return store;
};
