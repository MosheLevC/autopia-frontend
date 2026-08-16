import { createContext, useContext } from "react";
import { authStore } from "./authStore";

const AuthContext = createContext(authStore);

export function AuthStoreProvider({ children }) {
  return (
    <AuthContext.Provider value={authStore}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const store = useContext(AuthContext);
  if (!store) {
    throw new Error("useAuth must be used within an AuthStoreProvider");
  }
  return store;
};
