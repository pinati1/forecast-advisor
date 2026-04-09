export default function BeachCard({ beach }: { beach: any }) {
    // A quick helper to color-code the quality!
    const getQualityColor = (quality: string) => {
      switch (quality) {
        case "Epic": return "text-purple-400 font-bold drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]";
        case "Good": return "text-green-400 font-bold";
        case "Fair": return "text-yellow-400 font-medium";
        case "Poor": return "text-red-400";
        default: return "text-gray-400";
      }
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
          
          {/* Distance */}
          <div className="flex justify-between items-center pb-3 border-b border-white/10">
            <span className="text-gray-400">Drive Distance</span>
            <span className="text-xl font-semibold">
              {beach.driving_distance_meters 
                ? (Number(beach.driving_distance_meters) / 1000).toFixed(1) 
                : "0"} km
            </span>
          </div>
  
          {/* Wave Height */}
          <div className="flex justify-between items-center pb-3 border-b border-white/10">
            <span className="text-gray-400">Wave Height</span>
            <span className="text-xl font-semibold">
              {beach.surf?.wave_height !== undefined ? `${beach.surf.wave_height}m` : "Loading..."}
            </span>
          </div>
  
          {/* Wave Period */}
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