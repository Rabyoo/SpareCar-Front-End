import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MapPin,
  Loader2,
  Navigation,
  X,
  CheckCircle,
  Move,
  Star,
  Clock,
  Shield,
  Truck,
  Phone,
  Search,
  DollarSign,
  CheckCircle2,
  Crown,
  AlertTriangle,
  Camera,
  MessageSquare,
  MapPinned,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Advanced MapPicker component
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
    setTempPosition(markerPosition);
    setShowMap(false);
  };

  return (
    <div className="space-y-3">
      <div className="relative w-full h-64 bg-gradient-to-br from-orange-100 to-gray-100 rounded-lg border-2 border-gray-300 overflow-hidden shadow-md">
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
            className="h-12 w-12 text-orange-600 drop-shadow-lg animate-bounce"
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
                Detect My Location
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

      {/* Google Maps Modal */}
      {showMap && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl h-[700px] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-orange-600 to-orange-700 text-white">
              <div>
                <h3 className="text-xl font-bold">Select Your Location</h3>
                <p className="text-sm text-orange-100">
                  Pin your exact location for faster rescue
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeMap}
                className="h-8 w-8 p-0 text-white hover:bg-orange-800">
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

              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/95 px-4 py-2 rounded-full shadow-lg text-sm font-semibold text-gray-700">
                <Move className="inline h-4 w-4 mr-2" />
                Adjust coordinates below
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 space-y-4">
              <div className="bg-white p-4 rounded-lg border-2 border-orange-200">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-orange-600" />
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
                      className="mt-1"
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
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={confirmLocation}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3">
                <CheckCircle className="mr-2 h-5 w-5" />
                Confirm This Location
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const RescueWinch = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [availableTrucks, setAvailableTrucks] = useState([]);
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);

  const [formData, setFormData] = useState({
    // Service Type
    serviceType: "", // premium or standard

    // Situation Information
    situationType: "", // breakdown, accident, stuck, relocation
    situationDescription: "",

    // Location
    pickupLocation: { lat: 30.0444, lng: 31.2357 },
    dropoffLocation: { lat: 30.0444, lng: 31.2357 },
    pickupAddress: "",
    dropoffAddress: "",

    // Additional
    isEmergency: false,
    hasInsurance: false,
  });

  const serviceTypes = [
    {
      value: "premium",
      label: "Premium Tow Service",
      icon: Crown,
      color: "from-orange-500 to-red-600",
      badge: "Luxury Vehicles",
      description: "Enclosed transport for high-value vehicles",
      features: [
        "Enclosed trailer protection",
        "Specialized luxury vehicle handling",
        "White-glove service",
        "Premium insurance coverage",
        "Photo documentation",
        "Climate-controlled transport",
      ],
      vehicleTypes: [
        "Ferrari",
        "Lamborghini",
        "Bugatti",
        "Rolls-Royce",
        "Bentley",
        "McLaren",
        "Porsche",
        "Mercedes AMG",
        "BMW M Series",
        "Other Luxury",
      ],
    },
    {
      value: "standard",
      label: "Standard Tow Service",
      icon: Truck,
      color: "from-gray-600 to-gray-800",
      badge: "All Vehicles",
      description: "Professional towing for accidents and breakdowns",
      features: [
        "24/7 emergency response",
        "Accident recovery",
        "Breakdown assistance",
        "Standard insurance",
        "Safe vehicle handling",
        "Quick response time",
      ],
      vehicleTypes: [
        "Sedan",
        "SUV",
        "Truck",
        "Van",
        "Hatchback",
        "Coupe",
        "Crossover",
        "Other",
      ],
    },
  ];

  const situationTypes = [
    { value: "breakdown", label: "Vehicle Breakdown", icon: AlertTriangle },
    { value: "accident", label: "Accident Recovery", icon: AlertTriangle },
    { value: "stuck", label: "Stuck Vehicle", icon: AlertTriangle },
    { value: "relocation", label: "Vehicle Relocation", icon: Truck },
    { value: "garage", label: "Garage Transport", icon: Truck },
    { value: "other", label: "Other Reason", icon: Truck },
  ];

  // Mock data for available tow trucks
  const mockTrucks = {
    premium: [
      {
        id: 1,
        name: "Luxury Transport 1",
        driverName: "Ahmed Khaled",
        image: "https://i.pravatar.cc/150?img=12",
        truckImage: "/assets/premium-tow-truck.jpg",
        rating: 5.0,
        reviews: 156,
        truckType: "Enclosed Trailer",
        distance: 3.2,
        estimatedArrival: "25-30 min",
        pricing: {
          baseFee: 500,
          perKm: 15,
        },
        features: [
          "Climate Controlled",
          "GPS Tracking",
          "Full Insurance",
          "Photo Documentation",
        ],
        verified: true,
        experience: "12 years",
        completedJobs: 890,
        specialization: "Luxury & Exotic Cars",
        available: true,
      },
      {
        id: 2,
        name: "Elite Car Transport",
        driverName: "Mohamed Hassan",
        image: "https://i.pravatar.cc/150?img=33",
        truckImage: "/assets/premium-tow-truck-2.jpg",
        rating: 4.9,
        reviews: 203,
        truckType: "Enclosed Flatbed",
        distance: 5.1,
        estimatedArrival: "35-40 min",
        pricing: {
          baseFee: 450,
          perKm: 12,
        },
        features: [
          "Soft Tie Downs",
          "Video Monitoring",
          "Premium Insurance",
          "VIP Service",
        ],
        verified: true,
        experience: "10 years",
        completedJobs: 720,
        specialization: "Sports & Luxury Cars",
        available: true,
      },
    ],
    standard: [
      {
        id: 3,
        name: "Quick Rescue 24/7",
        driverName: "Omar Saeed",
        image: "https://i.pravatar.cc/150?img=51",
        truckImage: "/assets/standard-tow-truck.jpg",
        rating: 4.8,
        reviews: 412,
        truckType: "Flatbed Tow Truck",
        distance: 2.1,
        estimatedArrival: "15-20 min",
        pricing: {
          baseFee: 150,
          perKm: 8,
        },
        features: [
          "24/7 Available",
          "Fast Response",
          "Basic Insurance",
          "Experienced Driver",
        ],
        verified: true,
        experience: "8 years",
        completedJobs: 1540,
        specialization: "Emergency Towing",
        available: true,
      },
      {
        id: 4,
        name: "City Tow Services",
        driverName: "Khaled Ibrahim",
        image: "https://i.pravatar.cc/150?img=68",
        truckImage: "/assets/standard-tow-truck-2.jpg",
        rating: 4.7,
        reviews: 328,
        truckType: "Wheel Lift Tow",
        distance: 4.5,
        estimatedArrival: "25-30 min",
        pricing: {
          baseFee: 120,
          perKm: 6,
        },
        features: [
          "Accident Recovery",
          "Damage-Free Towing",
          "Insurance Accepted",
          "Professional",
        ],
        verified: true,
        experience: "6 years",
        completedJobs: 980,
        specialization: "Accident Recovery",
        available: true,
      },
      {
        id: 5,
        name: "Highway Rescue",
        driverName: "Hassan Mahmoud",
        image: "https://i.pravatar.cc/150?img=15",
        truckImage: "/assets/standard-tow-truck-3.jpg",
        rating: 4.9,
        reviews: 267,
        truckType: "Heavy Duty Flatbed",
        distance: 3.7,
        estimatedArrival: "20-25 min",
        pricing: {
          baseFee: 180,
          perKm: 10,
        },
        features: [
          "Heavy Vehicles",
          "Long Distance",
          "Highway Specialists",
          "24/7 Service",
        ],
        verified: true,
        experience: "9 years",
        completedJobs: 1120,
        specialization: "Heavy Duty Towing",
        available: false,
      },
    ],
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setUploadedImages([...uploadedImages, ...imageUrls]);
  };

  const handleFindTrucks = () => {
    const trucks = formData.serviceType ? mockTrucks[formData.serviceType] : [];
    setAvailableTrucks(trucks);
    setCurrentStep(4);
  };

  const handleSelectTruck = (truck) => {
    setSelectedTruck(truck);
    setCurrentStep(5);
  };

  const calculateDistance = () => {
    // Simple distance calculation (in real app, use proper distance calculation)
    const lat1 = formData.pickupLocation.lat;
    const lon1 = formData.pickupLocation.lng;
    const lat2 = formData.dropoffLocation.lat;
    const lon2 = formData.dropoffLocation.lng;

    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  const calculateEstimatedCost = () => {
    if (!selectedTruck) return 0;
    const distance = parseFloat(calculateDistance());
    return (
      selectedTruck.pricing.baseFee + distance * selectedTruck.pricing.perKm
    );
  };

  const handleSubmit = () => {
    if (
      !formData.serviceType ||
      !selectedTruck
    ) {
      alert("Please fill in all required fields and select a tow truck");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const generatedId = `TOW-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      setRequestId(generatedId);
      setSubmissionSuccess(true);
      setIsSubmitting(false);
    }, 2000);
  };

  // Success Screen
  if (submissionSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="shadow-2xl border-2 border-orange-200">
            <CardContent className="p-12 text-center">
              <div className="mb-6">
                <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle className="h-16 w-16 text-orange-600" />
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-3">
                  Rescue Request Confirmed!
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  {selectedTruck?.driverName} is on the way to your location!
                </p>
              </div>

              {/* Truck & Driver Info */}
              {selectedTruck && (
                <div className="bg-white p-6 rounded-lg border-2 border-orange-200 mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={selectedTruck.image}
                      alt={selectedTruck.driverName}
                      className="w-16 h-16 rounded-full border-2 border-orange-500"
                    />
                    <div className="text-left flex-1">
                      <h3 className="font-bold text-lg">
                        {selectedTruck.driverName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {selectedTruck.name}
                      </p>
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="h-4 w-4 text-orange-500 fill-orange-500" />
                        <span className="font-semibold">
                          {selectedTruck.rating}
                        </span>
                      </div>
                    </div>
                    <Badge
                      className={
                        formData.serviceType === "premium"
                          ? "bg-orange-600"
                          : "bg-gray-600"
                      }>
                      {formData.serviceType === "premium"
                        ? "Premium"
                        : "Standard"}
                    </Badge>
                  </div>
                </div>
              )}

              <div className="bg-white p-6 rounded-lg border-2 border-orange-200 mb-6">
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Request ID</p>
                    <p className="font-bold text-gray-900">{requestId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Estimated Arrival
                    </p>
                    <p className="font-bold text-orange-600">
                      {selectedTruck?.estimatedArrival}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Distance</p>
                    <p className="font-bold text-gray-900">
                      {calculateDistance()} km
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Estimated Cost</p>
                    <p className="font-bold text-orange-600">
                      EGP {calculateEstimatedCost().toFixed(0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <Navigation className="h-6 w-6 text-orange-600" />
                  <div className="text-left flex-1">
                    <p className="font-semibold text-gray-900">
                      Track Tow Truck Live
                    </p>
                    <p className="text-sm text-gray-600">
                      Real-time GPS tracking available
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-orange-600 hover:bg-orange-700">
                    Track
                  </Button>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <MessageSquare className="h-6 w-6 text-gray-600" />
                  <div className="text-left flex-1">
                    <p className="font-semibold text-gray-900">
                      Chat with Driver
                    </p>
                    <p className="text-sm text-gray-600">
                      Direct messaging available
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Chat
                  </Button>
                </div>

                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                  <Phone className="h-6 w-6 text-green-600" />
                  <div className="text-left flex-1">
                    <p className="font-semibold text-gray-900">
                      Call Driver Directly
                    </p>
                    <p className="text-sm text-gray-600">
                      Instant phone connection
                    </p>
                  </div>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Call
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => navigate("/")}
                  variant="outline"
                  className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
                <Button
                  onClick={() => {
                    setSubmissionSuccess(false);
                    setCurrentStep(1);
                    setSelectedTruck(null);
                    setUploadedImages([]);
                    setFormData({
                      serviceType: "",
                      situationType: "",
                      situationDescription: "",
                      pickupLocation: { lat: 30.0444, lng: 31.2357 },
                      dropoffLocation: { lat: 30.0444, lng: 31.2357 },
                      pickupAddress: "",
                      dropoffAddress: "",
                      isEmergency: false,
                      hasInsurance: false,
                    });
                  }}
                  className="flex-1 bg-orange-600 hover:bg-orange-700">
                  New Request
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-4xl  md:text-5xl font-bold text-gray-900 mb-3">
            Winch
            <span className="bg-gradient-to-r ml-2 from-orange-600 to-red-600 bg-clip-text text-transparent">
              Helpo
            </span>{" "}
            Service
          </h1>
          <p className="text-lg text-gray-600">
            Premium & Standard towing • Live tracking • Professional drivers
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                    currentStep >= step
                      ? "bg-orange-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}>
                  {step}
                </div>
                {step < 5 && (
                  <div
                    className={`w-12 h-1 ${currentStep > step ? "bg-orange-600" : "bg-gray-200"}`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-8 mt-2 text-xs">
            <span
              className={
                currentStep >= 1
                  ? "text-orange-600 font-semibold"
                  : "text-gray-500"
              }>
              Service
            </span>
            <span
              className={
                currentStep >= 2
                  ? "text-orange-600 font-semibold"
                  : "text-gray-500"
              }>
              Details
            </span>
            <span
              className={
                currentStep >= 3
                  ? "text-orange-600 font-semibold"
                  : "text-gray-500"
              }>
              Location
            </span>
            <span
              className={
                currentStep >= 4
                  ? "text-orange-600 font-semibold"
                  : "text-gray-500"
              }>
              Browse
            </span>
            <span
              className={
                currentStep >= 5
                  ? "text-orange-600 font-semibold"
                  : "text-gray-500"
              }>
              Confirm
            </span>
          </div>
        </div>

        <Card className="shadow-2xl border-2 border-gray-200">
          <CardContent className="p-8">
            {/* Step 1: Service Type Selection */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Select Tow Service Type
                  </h2>
                  <p className="text-gray-600">
                    Choose between premium luxury transport or standard towing
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {serviceTypes.map((service) => {
                    const Icon = service.icon;
                    const isSelected = formData.serviceType === service.value;

                    return (
                      <button
                        key={service.value}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            serviceType: service.value,
                          })
                        }
                        className={`p-6 rounded-xl border-2 transition-all text-left ${
                          isSelected
                            ? "border-orange-600 bg-orange-50 shadow-xl scale-105"
                            : "border-gray-200 hover:border-orange-300 hover:shadow-lg"
                        }`}>
                        <div className="flex items-start justify-between mb-4">
                          <div
                            className={`w-16 h-16 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center`}>
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                          <Badge
                            className={
                              service.value === "premium"
                                ? "bg-orange-600"
                                : "bg-gray-600"
                            }>
                            {service.badge}
                          </Badge>
                        </div>

                        <h3 className="font-bold text-xl mb-2">
                          {service.label}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          {service.description}
                        </p>

                        <div className="space-y-2">
                          {service.features.slice(0, 3).map((feature, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-sm">
                              <CheckCircle2 className="h-4 w-4 text-orange-600 flex-shrink-0" />
                              <span className="text-gray-700">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Emergency Toggle */}
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isEmergency}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isEmergency: e.target.checked,
                        })
                      }
                      className="w-5 h-5 mt-1"
                    />
                    <div>
                      <p className="font-bold text-red-900 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Emergency Priority Service
                      </p>
                      <p className="text-sm text-red-700 mt-1">
                        Vehicle accident or critical breakdown? Get immediate
                        response (additional fees apply)
                      </p>
                    </div>
                  </label>
                </div>

                <Button
                  onClick={() => setCurrentStep(2)}
                  disabled={!formData.serviceType}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-lg py-6">
                  Continue to Details
                  <ArrowLeft className="ml-2 h-5 w-5 rotate-180" />
                </Button>
              </div>
            )}

            {/* Step 2: Vehicle & Situation Details */}
            {currentStep === 2 && (
              <div className="space-y-6">

                {/* Situation Information */}
                <div className="space-y-4 p-6 bg-red-50 rounded-lg border-2 border-red-200">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <h3 className="font-bold text-lg text-gray-900">
                      Situation Details
                    </h3>
                  </div>

                  <div>
                    <Label
                      htmlFor="situationType"
                      className="text-base font-semibold mb-2 block">
                      Situation Type *
                    </Label>
                    <Select
                      value={formData.situationType}
                      onValueChange={(value) =>
                        setFormData({ ...formData, situationType: value })
                      }>
                      <SelectTrigger id="situationType">
                        <SelectValue placeholder="Select situation type" />
                      </SelectTrigger>
                      <SelectContent>
                        {situationTypes.map((type) => {
                          const Icon = type.icon;
                          return (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4" />
                                {type.label}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label
                      htmlFor="situationDescription"
                      className="text-base font-semibold mb-2 block">
                      Detailed Description (Optional)
                    </Label>
                    <Textarea
                      id="situationDescription"
                      placeholder="Describe your situation in detail (e.g., location details, damage description, special requirements)..."
                      rows={4}
                      value={formData.situationDescription}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          situationDescription: e.target.value,
                        })
                      }
                      className="text-base"
                    />
                  </div>

                  {/* Photo Upload */}
                  <div>
                    <Label className="text-base font-semibold mb-2 block">
                      Upload Photos (Optional)
                    </Label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="flex items-center justify-center gap-3 p-6 border-2 border-dashed border-red-300 rounded-lg hover:bg-red-100 cursor-pointer transition-colors">
                        <Camera className="h-8 w-8 text-red-600" />
                        <span className="font-semibold text-gray-700">
                          Upload Vehicle/Situation Photos
                        </span>
                      </label>
                    </div>

                    {uploadedImages.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mt-4">
                        {uploadedImages.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`Upload ${idx + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setCurrentStep(1)}
                    variant="outline"
                    className="flex-1">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    onClick={() => setCurrentStep(3)}
                    disabled={
                      !formData.situationType
                    }
                    className="flex-1 bg-orange-600 hover:bg-orange-700">
                    Continue to Location
                    <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Pickup & Dropoff Locations */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Set Pickup & Dropoff Locations
                  </h2>
                  <p className="text-gray-600">
                    Help us plan the best route for your vehicle transport
                  </p>
                </div>

                {/* Pickup Location */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-orange-600" />
                    <h3 className="font-bold text-lg">Pickup Location *</h3>
                  </div>
                  <Input
                    placeholder="Enter pickup address (optional)"
                    value={formData.pickupAddress}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pickupAddress: e.target.value,
                      })
                    }
                    className="mb-2"
                  />
                  <MapPicker
                    location={formData.pickupLocation}
                    onLocationChange={(location) =>
                      setFormData({ ...formData, pickupLocation: location })
                    }
                  />
                </div>

                {/* Dropoff Location */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPinned className="h-5 w-5 text-green-600" />
                    <h3 className="font-bold text-lg">Dropoff Location *</h3>
                  </div>
                  <Input
                    placeholder="Enter dropoff address (optional)"
                    value={formData.dropoffAddress}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dropoffAddress: e.target.value,
                      })
                    }
                    className="mb-2"
                  />
                  <MapPicker
                    location={formData.dropoffLocation}
                    onLocationChange={(location) =>
                      setFormData({ ...formData, dropoffLocation: location })
                    }
                  />
                </div>

                {/* Distance Display */}
                <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">
                        Estimated Distance
                      </p>
                      <p className="text-2xl font-bold text-orange-600">
                        {calculateDistance()} km
                      </p>
                    </div>
                    <Truck className="h-12 w-12 text-orange-600" />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setCurrentStep(2)}
                    variant="outline"
                    className="flex-1">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    onClick={handleFindTrucks}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-lg py-6">
                    <Search className="mr-2 h-5 w-5" />
                    Find Available Tow Trucks
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Browse Available Tow Trucks */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Available{" "}
                    {formData.serviceType === "premium"
                      ? "Premium"
                      : "Standard"}{" "}
                    Tow Trucks
                  </h2>
                  <p className="text-gray-600">
                    Found {availableTrucks.length} trucks • Sorted by distance
                  </p>
                </div>

                {/* Trucks List */}
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {availableTrucks.map((truck) => (
                    <Card
                      key={truck.id}
                      className={`border-2 transition-all hover:shadow-xl cursor-pointer ${
                        !truck.available
                          ? "opacity-60"
                          : "hover:border-orange-400"
                      }`}
                      onClick={() =>
                        truck.available && handleSelectTruck(truck)
                      }>
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          {/* Driver Image */}
                          <div className="flex-shrink-0">
                            <div className="relative">
                              <img
                                src={truck.image}
                                alt={truck.driverName}
                                className="w-24 h-24 rounded-lg object-cover border-2 border-gray-200"
                              />
                              {truck.verified && (
                                <div className="absolute -top-2 -right-2 bg-orange-600 rounded-full p-1">
                                  <CheckCircle2 className="h-4 w-4 text-white" />
                                </div>
                              )}
                              {!truck.available && (
                                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">
                                    Busy
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Truck Details */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">
                                  {truck.name}
                                </h3>
                                <p className="text-sm text-gray-600 mb-1">
                                  Driver: {truck.driverName}
                                </p>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 text-orange-500 fill-orange-500" />
                                    <span className="font-semibold">
                                      {truck.rating}
                                    </span>
                                    <span>({truck.reviews})</span>
                                  </div>
                                  <span>•</span>
                                  <span>{truck.experience}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-gray-600">
                                  Distance
                                </div>
                                <div className="text-xl font-bold text-orange-600">
                                  {truck.distance} km
                                </div>
                              </div>
                            </div>

                            <Badge variant="secondary" className="mb-3">
                              <Truck className="h-3 w-3 mr-1" />
                              {truck.truckType}
                            </Badge>

                            {/* Features */}
                            <div className="flex flex-wrap gap-2 mb-3">
                              {truck.features.map((feature, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded">
                                  <CheckCircle2 className="h-3 w-3 text-orange-600" />
                                  {feature}
                                </div>
                              ))}
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-4 mb-3">
                              <div className="bg-gray-50 p-2 rounded">
                                <div className="text-xs text-gray-600">
                                  Arrival Time
                                </div>
                                <div className="font-semibold text-sm text-green-600">
                                  {truck.estimatedArrival}
                                </div>
                              </div>
                              <div className="bg-gray-50 p-2 rounded">
                                <div className="text-xs text-gray-600">
                                  Specialty
                                </div>
                                <div className="font-semibold text-sm">
                                  {truck.specialization}
                                </div>
                              </div>
                              <div className="bg-gray-50 p-2 rounded">
                                <div className="text-xs text-gray-600">
                                  Jobs Done
                                </div>
                                <div className="font-semibold text-sm">
                                  {truck.completedJobs}
                                </div>
                              </div>
                            </div>

                            {/* Pricing */}
                            <div className="flex items-center justify-between pt-3 border-t">
                              <div className="flex gap-4 text-sm">
                                <div>
                                  <span className="text-gray-600">
                                    Base Fee:
                                  </span>
                                  <span className="font-bold ml-1">
                                    EGP {truck.pricing.baseFee}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Per KM:</span>
                                  <span className="font-bold ml-1">
                                    EGP {truck.pricing.perKm}
                                  </span>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                disabled={!truck.available}
                                className="bg-orange-600 hover:bg-orange-700">
                                {truck.available
                                  ? "Select Truck"
                                  : "Currently Busy"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Button
                  onClick={() => setCurrentStep(3)}
                  variant="outline"
                  className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Location
                </Button>
              </div>
            )}

            {/* Step 5: Final Confirmation */}
            {currentStep === 5 && selectedTruck && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Confirm Your Tow Request
                  </h2>
                  <p className="text-gray-600">
                    Review all details before submitting
                  </p>
                </div>

                {/* Selected Truck Card */}
                <Card className="border-2 border-orange-500 bg-orange-50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={selectedTruck.image}
                        alt={selectedTruck.driverName}
                        className="w-20 h-20 rounded-full border-4 border-orange-500"
                      />
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900">
                          {selectedTruck.name}
                        </h3>
                        <p className="text-gray-700">
                          Driver: {selectedTruck.driverName}
                        </p>
                        <div className="flex items-center gap-2 text-sm">
                          <Star className="h-4 w-4 text-orange-500 fill-orange-500" />
                          <span className="font-semibold">
                            {selectedTruck.rating}
                          </span>
                          <span className="text-gray-600">
                            ({selectedTruck.reviews} reviews)
                          </span>
                        </div>
                      </div>
                      <Badge
                        className={
                          formData.serviceType === "premium"
                            ? "bg-orange-600"
                            : "bg-gray-600"
                        }>
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Selected
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-white p-3 rounded">
                        <div className="text-gray-600 mb-1">Truck Type</div>
                        <div className="font-bold">
                          {selectedTruck.truckType}
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded">
                        <div className="text-gray-600 mb-1">
                          Estimated Arrival
                        </div>
                        <div className="font-bold text-green-600">
                          {selectedTruck.estimatedArrival}
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded">
                        <div className="text-gray-600 mb-1">
                          Distance to You
                        </div>
                        <div className="font-bold">
                          {selectedTruck.distance} km
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded">
                        <div className="text-gray-600 mb-1">Specialty</div>
                        <div className="font-bold">
                          {selectedTruck.specialization}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Request Summary */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-4">Request Summary</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service Type:</span>
                        <span className="font-semibold">
                          {formData.serviceType === "premium"
                            ? "Premium Tow"
                            : "Standard Tow"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Vehicle:</span>
                        <span className="font-semibold">
                          {formData.vehicleBrand} {formData.vehicleModel} (
                          {formData.vehicleYear})
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Situation:</span>
                        <span className="font-semibold">
                          {
                            situationTypes.find(
                              (s) => s.value === formData.situationType,
                            )?.label
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Customer:</span>
                        <span className="font-semibold">
                          {formData.customerName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-semibold">
                          {formData.customerPhone}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Transport Distance:
                        </span>
                        <span className="font-semibold">
                          {calculateDistance()} km
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Priority:</span>
                        <Badge
                          className={
                            formData.isEmergency ? "bg-red-600" : "bg-green-600"
                          }>
                          {formData.isEmergency ? "Emergency" : "Standard"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Cost Breakdown */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-orange-600" />
                    Cost Breakdown
                  </h3>
                  <div className="space-y-2 text-sm mb-3">
                    <div className="flex justify-between">
                      <span>Base Callout Fee</span>
                      <span className="font-semibold">
                        EGP {selectedTruck.pricing.baseFee}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>
                        Distance ({calculateDistance()} km × EGP{" "}
                        {selectedTruck.pricing.perKm})
                      </span>
                      <span className="font-semibold">
                        EGP{" "}
                        {(
                          parseFloat(calculateDistance()) *
                          selectedTruck.pricing.perKm
                        ).toFixed(0)}
                      </span>
                    </div>
                    {formData.isEmergency && (
                      <div className="flex justify-between text-red-600">
                        <span>Emergency Priority Fee</span>
                        <span className="font-semibold">EGP 200</span>
                      </div>
                    )}
                    {formData.serviceType === "premium" && (
                      <div className="flex justify-between text-orange-600">
                        <span>Premium Service Fee</span>
                        <span className="font-semibold">EGP 300</span>
                      </div>
                    )}
                  </div>
                  <div className="pt-3 border-t-2 border-orange-300 flex justify-between items-center">
                    <span className="font-bold text-lg">Estimated Total:</span>
                    <span className="text-3xl font-bold text-orange-600">
                      EGP{" "}
                      {(
                        calculateEstimatedCost() +
                        (formData.isEmergency ? 200 : 0) +
                        (formData.serviceType === "premium" ? 300 : 0)
                      ).toFixed(0)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    *Price includes all fees. Payment upon service completion.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      setCurrentStep(4);
                      setSelectedTruck(null);
                    }}
                    variant="outline"
                    className="flex-1">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Choose Different Truck
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-lg py-6">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sending Request...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Confirm & Request Tow
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <div className="mt-8 grid md:grid-cols-4 gap-4 text-center">
          {[
            {
              icon: Shield,
              text: "Verified Drivers",
              color: "text-orange-600",
            },
            { icon: Star, text: "4.8/5 Rating", color: "text-orange-600" },
            { icon: Clock, text: "Fast Response", color: "text-green-600" },
            { icon: Phone, text: "24/7 Support", color: "text-gray-600" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <item.icon className={`h-8 w-8 mx-auto mb-2 ${item.color}`} />
              <p className="text-sm font-semibold text-gray-700">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RescueWinch;
