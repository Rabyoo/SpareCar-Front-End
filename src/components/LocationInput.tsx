// components/LocationInput.tsx
import { useState } from "react";
import { Search, Navigation, MapPin, Loader2 } from "lucide-react";
import { UserLocation } from "@/types";
import MapSelector from "./MapSelector";

interface LocationInputProps {
  onLocationSet: (location: UserLocation) => void;
}

const LocationInput = ({ onLocationSet }: LocationInputProps) => {
  const [isAutoDetecting, setIsAutoDetecting] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [manualInput, setManualInput] = useState("");

  const handleAutoDetect = () => {
    setIsAutoDetecting(true);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: `Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`,
          };
          onLocationSet(location);
          setIsAutoDetecting(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert(
            "Unable to get your location. Please enable location services or use manual selection.",
          );
          setIsAutoDetecting(false);
        },
        { enableHighAccuracy: true, timeout: 10000 },
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setIsAutoDetecting(false);
    }
  };

  const handleManualInput = () => {
    if (manualInput.trim()) {
      // You can integrate with a geocoding API here
      // For now, we'll just pass the text as address
      const mockLocation = {
        latitude: 30.0444,
        longitude: 31.2357,
        address: manualInput,
      };
      onLocationSet(mockLocation);
    }
  };

  const handleMapLocationSelect = (location: UserLocation) => {
    // Reverse geocode to get address (you can use Google Maps Geocoding API)
    const address = `Lat: ${location.latitude.toFixed(4)}, Lng: ${location.longitude.toFixed(4)}`;
    onLocationSet({
      ...location,
      address,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Enter Your Location
        </h3>
        <p className="text-sm text-gray-600">
          Find the nearest fuel stations by entering your location
        </p>
      </div>

      {/* Manual Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter address manually
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="Enter your address, area, or landmark"
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              onKeyPress={(e) => e.key === "Enter" && handleManualInput()}
            />
          </div>
          <button
            onClick={handleManualInput}
            disabled={!manualInput.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
            Search
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">OR</span>
        </div>
      </div>

      {/* Location Options */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={handleAutoDetect}
          disabled={isAutoDetecting}
          className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">
          {isAutoDetecting ? (
            <Loader2 className="h-5 w-5 animate-spin text-blue-600 mr-3" />
          ) : (
            <Navigation className="h-5 w-5 text-blue-600 mr-3" />
          )}
          <div className="text-left">
            <p className="font-medium text-gray-900">
              {isAutoDetecting
                ? "Detecting Location..."
                : "Auto-Detect Location"}
            </p>
            <p className="text-sm text-gray-600">Use your device's GPS</p>
          </div>
        </button>

        <button
          onClick={() => setIsMapOpen(true)}
          className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <MapPin className="h-5 w-5 text-green-600 mr-3" />
          <div className="text-left">
            <p className="font-medium text-gray-900">Select on Map</p>
            <p className="text-sm text-gray-600">
              Choose location on Google Maps
            </p>
          </div>
        </button>
      </div>

      {/* Map Selector Modal */}
      <MapSelector
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onLocationSelect={handleMapLocationSelect}
      />
    </div>
  );
};

export default LocationInput;
