import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@mantine/core/styles.css";
import "./index.css";
import App from "./App.jsx";
import { createTheme, MantineProvider } from "@mantine/core";

const APP_FONT_FAMILY =
  "Heebo, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

const theme = createTheme({
  fontFamily: APP_FONT_FAMILY,
  headings: { fontFamily: APP_FONT_FAMILY },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <App />
    </MantineProvider>
  </StrictMode>,
);
