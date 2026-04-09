import { useEffect, useState } from "react";
import LocationSearch from "./components/LocationSearch"; 
import BeachCard from "./components/BeachCard";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

// Define this as a standalone interface
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
  surf?: SurfCondition; // Nested interface
}

interface Coordinates {
  lat: number;
  lng: number;
}


function App() {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [closestBeach, setClosestBeach] = useState<Beach | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!coords) {
      setClosestBeach(null);
      return;
    }

    const controller = new AbortController();
    
    // Abstracted Fetch Logic
    const loadBeachData = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch Metadata
        const beachRes = await fetch(
          `${API_BASE_URL}/beaches/closest?lat=${coords.lat}&lng=${coords.lng}`,
          { signal: controller.signal }
        );
        if (!beachRes.ok) throw new Error("Beach data unavailable");
        const beachData: Beach = await beachRes.json();
        console.log(beachData)
        // 2. Fetch Conditions
        const condRes = await fetch(
          `${API_BASE_URL}/beaches/condition?beach_id=${beachData._id}`,
          { signal: controller.signal }
        );
        if (!condRes.ok) throw new Error("Surf data unavailable");
        const surfData: SurfCondition = await condRes.json();

        // 3. Update State with Merged Object
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

      <main className="relative z-10 flex flex-col items-center justify-center w-full p-6 space-y-8">
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