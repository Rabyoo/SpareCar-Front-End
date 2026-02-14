// components/MapSelector.tsx
import { useEffect, useState } from "react";
import { Loader2, MapPin, Navigation } from "lucide-react";
import { UserLocation } from "@/types";

interface MapSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: UserLocation) => void;
  initialLocation?: UserLocation | null;
}

const MapSelector = ({
  isOpen,
  onClose,
  onLocationSelect,
  initialLocation,
}: MapSelectorProps) => {
  const [selectedLocation, setSelectedLocation] = useState<UserLocation | null>(
    initialLocation || null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!isOpen || !window.google) return;

    const initMap = () => {
      const defaultCenter = selectedLocation
        ? { lat: selectedLocation.latitude, lng: selectedLocation.longitude }
        : { lat: 30.0444, lng: 31.2357 }; // Cairo coordinates

      const map = new window.google.maps.Map(
        document.getElementById("map") as HTMLElement,
        {
          center: defaultCenter,
          zoom: 14,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
          zoomControl: true,
        },
      );

      // Add marker for selected location
      let marker: google.maps.Marker | null = null;

      if (selectedLocation) {
        marker = new window.google.maps.Marker({
          position: defaultCenter,
          map,
          draggable: true,
          animation: window.google.maps.Animation.DROP,
        });
      }

      // Add click listener to map
      map.addListener("click", (e: google.maps.MapMouseEvent) => {
        const lat = e.latLng?.lat();
        const lng = e.latLng?.lng();

        if (lat && lng) {
          const newLocation = { latitude: lat, longitude: lng };
          setSelectedLocation(newLocation);

          if (marker) {
            marker.setPosition(e.latLng!);
          } else {
            marker = new window.google.maps.Marker({
              position: e.latLng!,
              map,
              draggable: true,
              animation: window.google.maps.Animation.DROP,
            });
          }
        }
      });

      // Marker drag end listener
      if (marker) {
        marker.addListener("dragend", (e: google.maps.MapMouseEvent) => {
          const lat = e.latLng?.lat();
          const lng = e.latLng?.lng();
          if (lat && lng) {
            setSelectedLocation({ latitude: lat, longitude: lng });
          }
        });
      }

      setMapLoaded(true);
    };

    const timer = setTimeout(() => {
      initMap();
    }, 100);

    return () => clearTimeout(timer);
  }, [isOpen, selectedLocation]);

  const handleUseCurrentLocation = () => {
    setIsLoading(true);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setSelectedLocation(location);
          setIsLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert(
            "Unable to get your location. Please enable location services.",
          );
          setIsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000 },
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setIsLoading(false);
    }
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
      onClose();
    }
  };

  const handleAddressSearch = () => {
    const input = document.getElementById("address-input") as HTMLInputElement;
    const address = input?.value;

    if (!address || !window.google) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK" && results?.[0]) {
        const location = results[0].geometry.location;
        const newLocation = {
          latitude: location.lat(),
          longitude: location.lng(),
        };
        setSelectedLocation(newLocation);

        // Center map on location
        const mapElement = document.getElementById("map") as HTMLElement;
        if (mapElement) {
          const map = new window.google.maps.Map(mapElement, {
            center: location,
            zoom: 14,
          });

          new window.google.maps.Marker({
            position: location,
            map,
            draggable: true,
          });
        }
      } else {
        alert("Unable to find address. Please try again.");
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Select Your Location on Map
                  </h3>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500">
                    ✕
                  </button>
                </div>

                {/* Search Address */}
                <div className="mb-4">
                  <div className="flex gap-2">
                    <input
                      id="address-input"
                      type="text"
                      placeholder="Enter address, landmark, or area"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleAddressSearch()
                      }
                    />
                    <button
                      onClick={handleAddressSearch}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Search
                    </button>
                  </div>
                </div>

                {/* Map Container */}
                <div className="relative h-96 w-full bg-gray-100 rounded-lg overflow-hidden">
                  {!mapLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                    </div>
                  )}
                  <div id="map" className="h-full w-full" />

                  {/* Map Instructions */}
                  <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg max-w-xs">
                    <p className="text-sm text-gray-700">
                      <MapPin className="h-4 w-4 inline mr-1" />
                      Click on the map or drag the marker to select your
                      location
                    </p>
                  </div>
                </div>

                {/* Location Actions */}
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleUseCurrentLocation}
                    disabled={isLoading}
                    className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50">
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Detecting...
                      </>
                    ) : (
                      <>
                        <Navigation className="h-4 w-4 mr-2" />
                        Use Current Location
                      </>
                    )}
                  </button>

                  <div className="flex-1 text-sm text-gray-600">
                    {selectedLocation ? (
                      <div className="bg-blue-50 p-3 rounded-md">
                        <p className="font-medium text-blue-900">
                          Selected Location:
                        </p>
                        <p className="text-blue-800">
                          Latitude: {selectedLocation.latitude.toFixed(6)}
                          <br />
                          Longitude: {selectedLocation.longitude.toFixed(6)}
                        </p>
                      </div>
                    ) : (
                      <p>Click on the map to select your location</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!selectedLocation}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed">
              Confirm Location
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapSelector;
