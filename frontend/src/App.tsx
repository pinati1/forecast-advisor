import { useEffect, useState } from "react";
import LocationSearch from "./components/LocationSearch"; 
import BeachCard from "./components/BeachCard";
import Settings from "./components/Settings"; // <-- 1. Import the new Settings component

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

interface SurfCondition {
  wave_height: number;
  wave_period: number;
  quality: string;
}

interface Beach {
  _id: string;
  name: string;
  city?: string;
  country?: string;
  driving_distance_meters?: number;
  surf?: SurfCondition;
}

interface Coordinates {
  lat: number;
  lng: number;
}

function App() {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [closestBeach, setClosestBeach] = useState<Beach | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // <-- 2. Add this state to track if the settings menu is open or closed
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (!coords) {
      setClosestBeach(null);
      return;
    }

    const controller = new AbortController();
    
    const loadBeachData = async () => {
      setIsLoading(true);
      try {
        const beachRes = await fetch(
          `${API_BASE_URL}/beaches/closest?lat=${coords.lat}&lng=${coords.lng}`,
          { signal: controller.signal }
        );
        if (!beachRes.ok) throw new Error("Beach data unavailable");
        const beachData: Beach = await beachRes.json();
        console.log(beachData);
        
        const condRes = await fetch(
          `${API_BASE_URL}/beaches/condition?beach_id=${beachData._id}`,
          { signal: controller.signal }
        );
        if (!condRes.ok) throw new Error("Surf data unavailable");
        const surfData: SurfCondition = await condRes.json();

        setClosestBeach({ ...beachData, surf: surfData });
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Pipeline Error:", err.message);
          setClosestBeach(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadBeachData();
    return () => controller.abort();
  }, [coords]);

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-black overflow-hidden">
      
      {/* Background FX */}
      <div className="wave-container pointer-events-none">
        <div className="wave wave-back opacity-30" />
        <div className="wave wave-front opacity-50" />
      </div>

      {/* <-- 3. ADD THIS NEW HEADER BLOCK FOR SETTINGS --> */}
      <header className="absolute top-0 left-0 w-full p-4 flex justify-end z-50">
        <div className="relative">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-md border border-white/20 transition-all shadow-lg"
          >
            ⚙️ Settings
          </button>

          {/* This drops down when you click the button */}
          {showSettings && (
            <div className="absolute right-0 mt-2 w-72 origin-top-right animate-in fade-in slide-in-from-top-4 duration-200">
              <Settings />
            </div>
          )}
        </div>
      </header>
      {/* <-- END OF HEADER BLOCK --> */}

      {/* Notice I added 'mt-12' here so the search bar doesn't overlap the header */}
      <main className="relative z-10 flex flex-col items-center justify-center w-full p-6 space-y-8 mt-12">
        <div className="w-full max-w-md animate-in slide-in-from-top-4 duration-700">
          <LocationSearch onLocationSelect={setCoords} />
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-blue-200 font-medium tracking-wide">Analyzing Swell Patterns...</p>
          </div>
        ) : (
          closestBeach && (
            <div className="animate-in fade-in zoom-in duration-500">
              <BeachCard beach={closestBeach} />
            </div>
          )
        )}
      </main>
    </div>
  );
}

export default App;