import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// The shape of our settings
interface SettingsState {
  unitSystem: "metric" | "imperial";
}

// The shape of the Context (State + Actions)
interface SettingsContextType extends SettingsState {
  toggleUnitSystem: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage so it remembers the user's preference!
  const [unitSystem, setUnitSystem] = useState<"metric" | "imperial">(() => {
    const saved = localStorage.getItem("unitSystem");
    return (saved as "metric" | "imperial") || "metric"; // Default to metric
  });

  // Save to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("unitSystem", unitSystem);
  }, [unitSystem]);

  const toggleUnitSystem = () => {
    setUnitSystem((prev) => (prev === "metric" ? "imperial" : "metric"));
  };

  return (
    <SettingsContext.Provider value={{ unitSystem, toggleUnitSystem }}>
      {children}
    </SettingsContext.Provider>
  );
}

// Custom Hook for easy access
export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}