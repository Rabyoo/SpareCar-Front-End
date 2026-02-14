import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  MapPin,
  Loader2,
  Navigation,
  X,
  CheckCircle,
  Move,
} from "lucide-react";

// Advanced MapPicker component with Google Maps integration and drag functionality
const MapPicker = ({ location, onLocationChange }) => {
  const [markerPosition, setMarkerPosition] = useState(location);
  const [tempPosition, setTempPosition] = useState(location);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const getCurrentLocation = () => {
    setIsLoadingLocation(true);

    if (!navigator.geolocation) {
      alert("Your browser doesn't support geolocation");
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setTempPosition(newLocation);
        setIsLoadingLocation(false);
        setShowMap(true);
      },
      (error) => {
        console.error("Location error:", error);
        alert(
          "Unable to determine your location. Please ensure location access is enabled",
        );
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  const handleManualLocationInput = (type, value) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setTempPosition((prev) => ({
        ...prev,
        [type]: numValue,
      }));
    }
  };

  const confirmLocation = () => {
    setMarkerPosition(tempPosition);
    onLocationChange(tempPosition);
    setShowMap(false);
  };

  const closeMap = () => {
    setTempPosition(markerPosition); // Reset to last confirmed position
    setShowMap(false);
  };

  useEffect(() => {
    if (showMap) {
      // Listen for messages from the iframe (if using Google Maps API in the future)
      const handleMessage = (event) => {
        if (event.data && event.data.lat && event.data.lng) {
          setTempPosition({
            lat: event.data.lat,
            lng: event.data.lng,
          });
        }
      };
      window.addEventListener("message", handleMessage);
      return () => window.removeEventListener("message", handleMessage);
    }
  }, [showMap]);

  return (
    <div className="space-y-3">
      <div className="relative w-full h-64 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg border-2 border-gray-300 overflow-hidden shadow-md">
        <div className="absolute inset-0 opacity-20">
          {[...Array(10)].map((_, i) => (
            <div
              key={`h-${i}`}
              className="absolute w-full border-t border-gray-400"
              style={{ top: `${i * 10}%` }}
            />
          ))}
          {[...Array(10)].map((_, i) => (
            <div
              key={`v-${i}`}
              className="absolute h-full border-l border-gray-400"
              style={{ left: `${i * 10}%` }}
            />
          ))}
        </div>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <MapPin
            className="h-12 w-12 text-red-600 drop-shadow-lg animate-bounce"
            fill="currentColor"
          />
        </div>

        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
          <Button
            type="button"
            onClick={getCurrentLocation}
            disabled={isLoadingLocation}
            className="bg-white/95 text-gray-800 hover:bg-white shadow-lg">
            {isLoadingLocation ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Locating...
              </>
            ) : (
              <>
                <Navigation className="mr-2 h-4 w-4" />
                Select Location on Map
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex gap-4 text-sm text-gray-600">
        <div className="flex-1 bg-gray-50 p-3 rounded-lg">
          <span className="font-semibold">Latitude:</span>{" "}
          {markerPosition.lat.toFixed(6)}
        </div>
        <div className="flex-1 bg-gray-50 p-3 rounded-lg">
          <span className="font-semibold">Longitude:</span>{" "}
          {markerPosition.lng.toFixed(6)}
        </div>
      </div>

      {/* Google Maps Modal with Enhanced Location Selection */}
      {showMap && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl h-[700px] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <div>
                <h3 className="text-xl font-bold">Select Your Location</h3>
                <p className="text-sm text-blue-100">
                  Click on the map or adjust coordinates manually
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeMap}
                className="h-8 w-8 p-0 text-white hover:bg-blue-800">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 relative">
              <iframe
                id="google-map-iframe"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps?q=${tempPosition.lat},${tempPosition.lng}&output=embed&z=16`}
              />

              {/* Overlay instruction */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/95 px-4 py-2 rounded-full shadow-lg text-sm font-semibold text-gray-700">
                <Move className="inline h-4 w-4 mr-2" />
                Adjust your location below
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 space-y-4">
              {/* Manual Coordinate Input */}
              <div className="bg-white p-4 rounded-lg border-2 border-blue-200">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                  Fine-tune Your Location
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-semibold text-gray-700">
                      Latitude
                    </Label>
                    <Input
                      type="number"
                      step="0.000001"
                      value={tempPosition.lat}
                      onChange={(e) =>
                        handleManualLocationInput("lat", e.target.value)
                      }
                      className="mt-1 font-mono"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-gray-700">
                      Longitude
                    </Label>
                    <Input
                      type="number"
                      step="0.000001"
                      value={tempPosition.lng}
                      onChange={(e) =>
                        handleManualLocationInput("lng", e.target.value)
                      }
                      className="mt-1 font-mono"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  💡 You can manually adjust the coordinates above for precise
                  location
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={confirmLocation}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 text-base">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Confirm This Location
                </Button>
                <Button
                  variant="outline"
                  onClick={getCurrentLocation}
                  disabled={isLoadingLocation}
                  className="flex-1 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 text-base">
                  {isLoadingLocation ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Detecting...
                    </>
                  ) : (
                    <>
                      <Navigation className="mr-2 h-5 w-5" />
                      Use My GPS Location
                    </>
                  )}
                </Button>
              </div>

              <p className="text-center text-sm text-gray-600">
                Current selection:{" "}
                <span className="font-mono font-bold text-blue-700">
                  {tempPosition.lat.toFixed(6)}, {tempPosition.lng.toFixed(6)}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const RequestMechanic = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [formData, setFormData] = useState({
    vehicleType: "",
    vehicleBrand: "",
    year: "",
    problemType: "",
    problemDescription: "",
    location: { lat: 24.7136, lng: 46.6753 },
    customerName: "",
    customerPhone: "",
  });

  const showToast = (title, description, variant = "default") => {
    const toast = document.createElement("div");
    toast.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 animate-in slide-in-from-right ${
      variant === "destructive"
        ? "bg-red-600 text-white"
        : "bg-green-600 text-white"
    }`;
    toast.innerHTML = `<div class="font-semibold">${title}</div><div class="text-sm">${description}</div>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (
      !formData.vehicleType ||
      !formData.vehicleBrand ||
      !formData.year ||
      !formData.problemType ||
      !formData.customerName ||
      !formData.customerPhone
    ) {
      showToast("Error", "Please fill in all required fields", "destructive");
      setIsSubmitting(false);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockOrderId = Math.random().toString(36).substring(7).toUpperCase();
      setOrderId(mockOrderId);

      showToast(
        "Request Submitted Successfully! ✓",
        "Searching for the nearest mechanic...",
      );

      setTimeout(() => {
        setShowSuccess(true);
      }, 1500);
    } catch (error) {
      showToast(
        "Error",
        "An error occurred while submitting your request. Please try again",
        "destructive",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setShowSuccess(false);
    setFormData({
      vehicleType: "",
      vehicleBrand: "",
      year: "",
      problemType: "",
      problemDescription: "",
      location: { lat: 24.7136, lng: 46.6753 },
      customerName: "",
      customerPhone: "",
    });
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 flex items-center justify-center">
        <Card className="shadow-xl max-w-2xl w-full mx-4">
          <CardContent className="pt-8 text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle className="h-24 w-24 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Request Submitted Successfully!
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Your order ID is:{" "}
              <span className="font-mono font-bold text-blue-600">
                {orderId}
              </span>
            </p>
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-lg mb-4">Request Details:</h3>
              <div className="space-y-2 text-left">
                <p>
                  <span className="font-semibold">Name:</span>{" "}
                  {formData.customerName}
                </p>
                <p>
                  <span className="font-semibold">Phone:</span>{" "}
                  {formData.customerPhone}
                </p>
                <p>
                  <span className="font-semibold">Vehicle:</span>{" "}
                  {formData.vehicleBrand} - {formData.year}
                </p>
                <p>
                  <span className="font-semibold">Problem:</span>{" "}
                  {formData.problemType}
                </p>
                <p>
                  <span className="font-semibold">Location:</span>{" "}
                  {formData.location.lat.toFixed(6)},{" "}
                  {formData.location.lng.toFixed(6)}
                </p>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              A mechanic will be assigned shortly. We'll contact you at{" "}
              {formData.customerPhone}
            </p>
            <Button
              onClick={resetForm}
              className="bg-blue-600 hover:bg-blue-700">
              Submit Another Request
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl text-center">
              Request Mobile Mechanic
            </CardTitle>
            <CardDescription className="text-center text-lg">
              Fill in the details below and we'll send the nearest technician to
              you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-lg text-blue-900">
                  Customer Information
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="customerName" className="text-base">
                    Full Name *
                  </Label>
                  <Input
                    id="customerName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.customerName}
                    onChange={(e) =>
                      setFormData({ ...formData, customerName: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerPhone" className="text-base">
                    Phone Number *
                  </Label>
                  <Input
                    id="customerPhone"
                    type="tel"
                    placeholder="05xxxxxxxx"
                    value={formData.customerPhone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customerPhone: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Vehicle Information */}
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-900">
                  Vehicle Information
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="vehicleType" className="text-base">
                    Vehicle Type *
                  </Label>
                  <Select
                    value={formData.vehicleType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, vehicleType: value })
                    }>
                    <SelectTrigger id="vehicleType">
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedan">Sedan</SelectItem>
                      <SelectItem value="suv">SUV</SelectItem>
                      <SelectItem value="truck">Truck</SelectItem>
                      <SelectItem value="van">Van</SelectItem>
                      <SelectItem value="sports">Sports Car</SelectItem>
                      <SelectItem value="hatchback">Hatchback</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicleBrand" className="text-base">
                    Vehicle Brand *
                  </Label>
                  <Input
                    id="vehicleBrand"
                    type="text"
                    placeholder="e.g., Toyota, Honda, Mercedes..."
                    value={formData.vehicleBrand}
                    onChange={(e) =>
                      setFormData({ ...formData, vehicleBrand: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year" className="text-base">
                    Manufacturing Year *
                  </Label>
                  <Input
                    id="year"
                    type="number"
                    placeholder="e.g., 2020"
                    min="1990"
                    max={new Date().getFullYear()}
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({ ...formData, year: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Problem Information */}
              <div className="space-y-4 p-4 bg-orange-50 rounded-lg">
                <h3 className="font-semibold text-lg text-orange-900">
                  Problem Description
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="problemType" className="text-base">
                    Problem Type *
                  </Label>
                  <Select
                    value={formData.problemType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, problemType: value })
                    }>
                    <SelectTrigger id="problemType">
                      <SelectValue placeholder="Select problem type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="battery">Dead Battery</SelectItem>
                      <SelectItem value="tire">Flat Tire</SelectItem>
                      <SelectItem value="engine">Engine Problem</SelectItem>
                      <SelectItem value="brakes">Brake Issue</SelectItem>
                      <SelectItem value="electrical">
                        Electrical Problem
                      </SelectItem>
                      <SelectItem value="oil">Oil Change</SelectItem>
                      <SelectItem value="coolant">
                        Coolant/Radiator Issue
                      </SelectItem>
                      <SelectItem value="fuel">Fuel System Problem</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="problemDescription" className="text-base">
                    Detailed Problem Description (Optional)
                  </Label>
                  <Textarea
                    id="problemDescription"
                    placeholder="Provide additional details about the problem to help the mechanic..."
                    rows={4}
                    value={formData.problemDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        problemDescription: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label className="text-lg flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Set Your Current Location *
                </Label>
                <MapPicker
                  location={formData.location}
                  onLocationChange={(location) =>
                    setFormData({ ...formData, location })
                  }
                />
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                size="lg"
                disabled={isSubmitting}
                className="w-full text-xl py-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Submitting Request...
                  </>
                ) : (
                  "Submit Request"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RequestMechanic;
