import { useEffect, useState } from "react";
// Import your new components (LocationSearch code omitted for brevity)
import LocationSearch from "./components/LocationSearch"; 
import BeachCard from "./components/BeachCard";

// ... (API Base URL and Interfaces here) ...
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
    // ... (Your exact same fetch logic goes here) ...
  }, [coords]);

  return (
    <div className="page">
      <div className="wave wave-back" />
      <div className="wave wave-front" />

      <main className="content">
        {/* We pass setCoords down so the search bar can update the parent's state */}
        <LocationSearch onLocationSelect={setCoords} />

        {isLoading && <p className="loading-text">Finding the best waves...</p>}

        {/* The UI is now perfectly encapsulated in its own file! */}
        {!isLoading && closestBeach && <BeachCard beach={closestBeach} />}
      </main>
    </div>
  );
}

export default App;