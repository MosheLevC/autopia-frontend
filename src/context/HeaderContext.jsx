import { createContext, useContext, useEffect, useState } from "react";

const HeaderContext = createContext({
  title: "",
  setTitle: () => {},
});

export function HeaderProvider({ children }) {
  const [title, setTitle] = useState("");

  return (
    <HeaderContext.Provider value={{ title, setTitle }}>
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeader() {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error("useHeader must be used within a HeaderProvider");
  }
  return context;
}

export function useHeaderTitle(pageTitle) {
  const { setTitle } = useHeader();

  useEffect(() => {
    setTitle(pageTitle || "");
    return () => {
      setTitle("");
    };
  }, [pageTitle, setTitle]);
}
