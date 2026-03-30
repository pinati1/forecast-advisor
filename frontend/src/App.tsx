import { useEffect, useState } from "react";
import LocationSearch from "./components/LocationSearch"; 
import BeachCard from "./components/BeachCard";

// 1. Make sure we have the API URL defined here
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

interface Coordinates {
  lat: number;
  lng: number;
}

interface Beach {
  _id: string;
  name: string;
  distance?: number;
  condition?: string; 
}

function App() {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [closestBeach, setClosestBeach] = useState<Beach | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 2. If we don't have coordinates yet (initial load), do nothing.
    if (!coords) {
      setClosestBeach(null);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);

    // 3. The actual Fetch request to your Python backend!
    const url = `${API_BASE_URL}/beaches/closest?lat=${coords.lat}&lng=${coords.lng}`;
    
    console.log("Fetching from:", url); // Let's log this so you can see it working!

    fetch(url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Beach not found or server error");
        return response.json();
      })
      .then((data: Beach) => {
        console.log("Backend returned beach:", data);
        setClosestBeach(data);
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        console.error("Error fetching beach:", error);
        setClosestBeach(null);
        setIsLoading(false);
      });

    // Cleanup function in case the user types another location really fast
    return () => {
      controller.abort();
    };
  }, [coords]); // This tells React: "Run this effect EVERY TIME coords change!"

  return (
    /* Changed the background gradient to dark grays and blacks */
    <div className="min-h-screen relative flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-black overflow-hidden">
      
      <div className="wave-container pointer-events-none">
        <div className="wave wave-back" />
        <div className="wave wave-front" />
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center w-full p-6">
        
        {/* Added 'animate-in' so the search bar glides up when the page loads */}
        <div className="w-full max-w-md mb-8 animate-in">
          <LocationSearch onLocationSelect={setCoords} />
        </div>

        {isLoading && <p className="text-white text-lg animate-pulse">Scanning the coast...</p>}

        {/* The Beach Card will render here! */}
        {!isLoading && closestBeach && <BeachCard beach={closestBeach} />}
      </main>
    </div>
  );
}

export default App;