import { useState } from "react";
import { HeaderContext } from "./HeaderContext";

export function HeaderProvider({ children }) {
  const [title, setTitle] = useState("");

  return (
    <HeaderContext.Provider value={{ title, setTitle }}>
      {children}
    </HeaderContext.Provider>
  );
}
