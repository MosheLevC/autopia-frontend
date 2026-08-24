import { useContext, useEffect } from "react";
import { HeaderContext } from "../context/HeaderContext";

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
      setTitle((current) => (current === pageTitle ? "" : current));
    };
  }, [pageTitle, setTitle]);
}
