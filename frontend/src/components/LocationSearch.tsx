import { useRef } from "react";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? "";
const libraries: ("places")[] = ["places"];

// Define the shape of the data we send back to App.tsx
interface Coordinates {
  lat: number;
  lng: number;
}

interface LocationSearchProps {
  onLocationSelect: (coords: Coordinates) => void;
}

export default function LocationSearch({ onLocationSelect }: LocationSearchProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const handlePlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      
      if (place.geometry?.location) {
        // Pass the coordinates back up to the parent (App.tsx)
        onLocationSelect({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
      }
    }
  };

  // If Google Maps is still loading, show a disabled fallback input
  if (!isLoaded) {
    return (
      <input 
        className="location-input" 
        type="text" 
        placeholder="Loading map data..." 
        disabled 
      />
    );
  }

  return (
    <Autocomplete
      onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
      onPlaceChanged={handlePlaceChanged}
    >
      <input
        className="location-input"
        type="text"
        placeholder="Search for your location..."
      />
    </Autocomplete>
  );
}