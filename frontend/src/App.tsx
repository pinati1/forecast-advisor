import { useEffect, useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

function App() {
  const [location, setLocation] = useState("");

  useEffect(() => {
    if (!location.trim()) {
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      const url = `${API_BASE_URL}/beaches?location=${encodeURIComponent(
        location.trim()
      )}`;

      fetch(url, { signal: controller.signal })
        .then((response) => {
          // We expect skeleton backend to return `null` for now
          return response.json();
        })
        .then((data) => {
          // For now, just log the result – UI stays as a clean single input
          console.log("Beaches response:", data);
        })
        .catch((error) => {
          if (error.name === "AbortError") return;
          console.error("Error fetching beaches:", error);
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
          placeholder="Enter your location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </main>
    </div>
  );
}

export default App;

