import { useSettings } from "../context/SettingsContext";

export default function BeachCard({ beach }: { beach: any }) {
  // 1. Hook into our global settings!
  const { unitSystem } = useSettings();

  // 2. Helper to color-code the quality
  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "Epic": return "text-purple-400 font-bold drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]";
      case "Good": return "text-green-400 font-bold";
      case "Fair": return "text-yellow-400 font-medium";
      case "Poor": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  // 3. Dynamic Distance Calculator
  const getDisplayDistance = () => {
    const meters = beach.driving_distance_meters;
    if (!meters) return "Unknown";

    if (unitSystem === "imperial") {
      const miles = meters / 1609.34;
      return `${miles.toFixed(1)} mi`;
    }
    
    // Metric (Default)
    const km = meters / 1000;
    return `${km.toFixed(1)} km`;
  };

  // 4. Dynamic Wave Height Calculator
  const getDisplayWaveHeight = () => {
    const height = beach.surf?.wave_height;
    if (height === undefined) return "Loading...";

    if (unitSystem === "imperial") {
      const feet = height * 3.28084;
      return `${feet.toFixed(1)} ft`;
    }
    
    // Metric (Default)
    return `${height}m`;
  };

  return (
    <div className="w-full max-w-md p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl animate-in delay-200 text-white">
      
      {/* HEADER */}
      <div className="flex justify-between items-start mb-6 border-b border-white/20 pb-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {beach.name || "Secret Spot"}
          </h2>
          <p className="text-sm text-gray-300 mt-1">{beach.city}, {beach.country}</p>
        </div>
        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-wider rounded-full border border-blue-500/30">
          Closest Beach
        </span>
      </div>

      {/* STATS GRID */}
      <div className="space-y-4">
        
        {/* Distance - Now uses dynamic function */}
        <div className="flex justify-between items-center pb-3 border-b border-white/10">
          <span className="text-gray-400">Drive Distance</span>
          <span className="text-xl font-semibold">
            {getDisplayDistance()}
          </span>
        </div>

        {/* Wave Height - Now uses dynamic function */}
        <div className="flex justify-between items-center pb-3 border-b border-white/10">
          <span className="text-gray-400">Wave Height</span>
          <span className="text-xl font-semibold">
            {getDisplayWaveHeight()}
          </span>
        </div>

        {/* Wave Period - No math needed, time is time! */}
        <div className="flex justify-between items-center pb-3 border-b border-white/10">
          <span className="text-gray-400">Wave Period</span>
          <span className="text-xl font-semibold">
            {beach.surf?.wave_period !== undefined ? `${beach.surf.wave_period}s` : "Loading..."}
          </span>
        </div>
        
        {/* Overall Quality */}
        <div className="flex justify-between items-center pt-2">
          <span className="text-gray-400 uppercase text-sm font-bold tracking-widest">Surf Status</span>
          <span className={`text-2xl ${getQualityColor(beach.surf?.quality)}`}>
            {beach.surf?.quality || "Unknown"}
          </span>
        </div>

      </div>
    </div>
  );
}