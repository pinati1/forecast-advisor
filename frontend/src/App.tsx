import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

// 1. Define the shape of the data your backend sends
// Update these fields based on what your MongoDB document actually looks like!
interface Beach {
  _id: string;
  name: string;
  distance?: number;
  condition?: string; 
}

function App() {
  const [location, setLocation] = useState("");
  
  // 2. Add state to hold the beach data and a loading state
  const [closestBeach, setClosestBeach] = useState<Beach | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!location.trim()) {
      setClosestBeach(null); // Clear the card if input is empty
      return;
    }

    const controller = new AbortController();
    
    const timeoutId = setTimeout(() => {
      setIsLoading(true);

      // TEMPORARY HACK: Your backend expects lat/lng, but we only have a text string.
      // We are hardcoding Bat Yam coordinates here just to test your backend route.
      // Later, we will need to convert the text 'location' into real coordinates.
      const lat = 32.0136; 
      const lng = 34.7479;
      const url = `${API_BASE_URL}/beaches/closest?lat=${lat}&lng=${lng}`;

      fetch(url, { signal: controller.signal })
        .then((response) => {
          if (!response.ok) throw new Error("Beach not found");
          return response.json();
        })
        .then((data: Beach) => {
          console.log("Found beach:", data);
          setClosestBeach(data); // 3. Save the backend data to React's memory
          setIsLoading(false);
        })
        .catch((error) => {
          if (error.name === "AbortError") return;
          console.error("Error fetching beach:", error);
          setClosestBeach(null);
          setIsLoading(false);
        });
    }, 500);

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [location]);

  return (
    <div className="page">
      <div className="wave wave-back" />
      <div className="wave wave-front" />

      <main className="content">
        <input
          className="location-input"
          type="text"
          placeholder="Enter your location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        {/* 4. Conditional Rendering: Only show this if we are loading */}
        {isLoading && <p className="loading-text">Finding the best waves...</p>}

        {/* 5. The Card: Only show this if closestBeach is NOT null */}
        {!isLoading && closestBeach && (
          <div className="beach-card">
            <h2>{closestBeach.name}</h2>
            {closestBeach.distance && (
              <p>Distance: {closestBeach.distance.toFixed(2)} km away</p>
            )}
            {closestBeach.condition && (
              <div className="condition-badge">
                Condition: {closestBeach.condition}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;