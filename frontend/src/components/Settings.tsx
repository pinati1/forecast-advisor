import { useSettings } from "../context/SettingsContext";

export default function Settings() {
  const { unitSystem, toggleUnitSystem } = useSettings();

  return (
    <div className="w-full p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl text-white">
      <h3 className="text-xl font-bold mb-6 tracking-tight border-b border-white/20 pb-3">
        Preferences
      </h3>
      
      <div className="space-y-6">
        {/* Unit System Toggle */}
        <div className="flex flex-col space-y-3">
          <span className="text-gray-300 text-sm font-medium uppercase tracking-wider">
            Measurement System
          </span>
          
          <div className="flex bg-black/20 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => unitSystem !== "metric" && toggleUnitSystem()}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                unitSystem === "metric" 
                  ? "bg-blue-500/80 text-white shadow-md border border-blue-400/50" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              Metric (m, km)
            </button>
            <button
              onClick={() => unitSystem !== "imperial" && toggleUnitSystem()}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                unitSystem === "imperial" 
                  ? "bg-blue-500/80 text-white shadow-md border border-blue-400/50" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              Imperial (ft, mi)
            </button>
          </div>
        </div>

        {/* You can easily add a "Theme" or "Default Radius" toggle here later! */}
      </div>
    </div>
  );
}