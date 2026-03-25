import { GeoapifyGeocoderAutocomplete, GeoapifyContext } from '@geoapify/react-geocoder-autocomplete';

// We import one of Geoapify's free pre-built CSS themes so the dropdown looks nice!
import '@geoapify/geocoder-autocomplete/styles/minimal.css';

const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY ?? "";

interface Coordinates {
  lat: number;
  lng: number;
}

interface LocationSearchProps {
  onLocationSelect: (coords: Coordinates) => void;
}

export default function LocationSearch({ onLocationSelect }: LocationSearchProps) {
  
  // This function runs when the user clicks an address from the dropdown
  const handlePlaceSelect = (value: any) => {
    // Geoapify returns the data inside a 'properties' object
    if (value && value.properties) {
      console.log("Found location!", value.properties);
      
      // Pass the coordinates back to App.tsx
      onLocationSelect({
        lat: value.properties.lat,
        // Notice Geoapify uses 'lon' for longitude, but our backend expects 'lng'
        lng: value.properties.lon, 
      });
    }
  };

  return (
    <div style={{ position: "relative", zIndex: 10 }}>
      {/* GeoapifyContext handles the API Key automatically */}
      <GeoapifyContext apiKey={GEOAPIFY_API_KEY}>
        <GeoapifyGeocoderAutocomplete
          placeholder="Search for your location..."
          placeSelect={handlePlaceSelect}
        />
      </GeoapifyContext>
    </div>
  );
}