import React from "react";
import { createRoot } from "react-dom/client"; 
import App from "./App";
import "./styles.css";

// 1. Import the Provider we just built
import { SettingsProvider } from "./context/SettingsContext";

const container = document.getElementById("root") as HTMLElement;

const root = createRoot(container);

root.render(
  <React.StrictMode>
    {/* 2. Wrap your App inside the Provider */}
    <SettingsProvider>
      <App />
    </SettingsProvider>
  </React.StrictMode>
);