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
  MessageSquare,
  Wrench,
  Zap,
  Star,
  Clock,
  Shield,
  TrendingUp,
  Phone,
  Search,
  DollarSign,
  CheckCircle2,
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

      {/* Google Maps Modal */}
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

              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/95 px-4 py-2 rounded-full shadow-lg text-sm font-semibold text-gray-700">
                <Move className="inline h-4 w-4 mr-2" />
                Adjust your location below
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 space-y-4">
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3">
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

const RequestMobileProfessional = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [aiDiagnosis, setAiDiagnosis] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [availableProfessionals, setAvailableProfessionals] = useState([]);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [showProfessionals, setShowProfessionals] = useState(false);

  const [formData, setFormData] = useState({
    // Service Selection
    serviceType: "",

    // Problem Information
    problemType: "",
    problemDescription: "",
    imageFile: null,

    // Location
    location: { lat: 30.0444, lng: 31.2357 }, // Default Cairo

    // Preferences
    isEmergency: false,
    preferredTime: "asap",
  });

  // Mock data for available professionals
  const mockProfessionals = [
    {
      id: 1,
      name: "Ahmed Hassan",
      image: "https://i.pravatar.cc/150?img=12",
      rating: 4.9,
      reviews: 247,
      specializations: ["Engine Repair", "Brake System", "Transmission"],
      distance: 2.3,
      estimatedArrival: "15-20 min",
      pricing: {
        calloutFee: 50,
        hourlyRate: 150,
      },
      verified: true,
      experience: "8 years",
      completedJobs: 1240,
      responseTime: "5 min avg",
      available: true,
    },
    {
      id: 2,
      name: "Mohamed Ali",
      image: "https://i.pravatar.cc/150?img=33",
      rating: 4.8,
      reviews: 189,
      specializations: ["Electrical Systems", "Battery", "Alternator"],
      distance: 3.7,
      estimatedArrival: "20-25 min",
      pricing: {
        calloutFee: 45,
        hourlyRate: 140,
      },
      verified: true,
      experience: "6 years",
      completedJobs: 890,
      responseTime: "7 min avg",
      available: true,
    },
    {
      id: 3,
      name: "Khaled Ibrahim",
      image: "https://i.pravatar.cc/150?img=51",
      rating: 5.0,
      reviews: 312,
      specializations: ["AC Systems", "Climate Control", "Refrigeration"],
      distance: 1.8,
      estimatedArrival: "10-15 min",
      pricing: {
        calloutFee: 60,
        hourlyRate: 180,
      },
      verified: true,
      experience: "10 years",
      completedJobs: 1580,
      responseTime: "3 min avg",
      available: true,
    },
    {
      id: 4,
      name: "Omar Saeed",
      image: "https://i.pravatar.cc/150?img=68",
      rating: 4.7,
      reviews: 156,
      specializations: ["Engine Diagnostics", "Oil Change", "Suspension"],
      distance: 4.2,
      estimatedArrival: "25-30 min",
      pricing: {
        calloutFee: 40,
        hourlyRate: 130,
      },
      verified: true,
      experience: "5 years",
      completedJobs: 680,
      responseTime: "10 min avg",
      available: false,
    },
    {
      id: 5,
      name: "Hassan Mahmoud",
      image: "https://i.pravatar.cc/150?img=15",
      rating: 4.9,
      reviews: 203,
      specializations: ["Wiring", "Sensors", "Lighting Systems"],
      distance: 3.1,
      estimatedArrival: "18-23 min",
      pricing: {
        calloutFee: 55,
        hourlyRate: 160,
      },
      verified: true,
      experience: "7 years",
      completedJobs: 950,
      responseTime: "6 min avg",
      available: true,
    },
  ];

  // Filter professionals based on service type
  const getFilteredProfessionals = () => {
    if (!formData.serviceType) return [];

    let filtered = mockProfessionals;

    if (formData.serviceType === "mechanic") {
      filtered = mockProfessionals.filter((p) =>
        p.specializations.some(
          (s) =>
            s.includes("Engine") ||
            s.includes("Brake") ||
            s.includes("Transmission") ||
            s.includes("Suspension") ||
            s.includes("Oil"),
        ),
      );
    } else if (formData.serviceType === "electrician") {
      filtered = mockProfessionals.filter((p) =>
        p.specializations.some(
          (s) =>
            s.includes("Electrical") ||
            s.includes("Battery") ||
            s.includes("Alternator") ||
            s.includes("Wiring") ||
            s.includes("Sensors") ||
            s.includes("Lighting"),
        ),
      );
    } else if (formData.serviceType === "ac-specialist") {
      filtered = mockProfessionals.filter((p) =>
        p.specializations.some(
          (s) =>
            s.includes("AC") ||
            s.includes("Climate") ||
            s.includes("Refrigeration"),
        ),
      );
    }

    // Sort by distance
    return filtered.sort((a, b) => a.distance - b.distance);
  };

  const serviceTypes = [
    {
      value: "mechanic",
      label: "Mobile Mechanic",
      icon: Wrench,
      color: "from-blue-500 to-cyan-500",
      description: "Engine, brakes, transmission, and general repairs",
    },
    {
      value: "electrician",
      label: "Mobile Electrician",
      icon: Zap,
      color: "from-yellow-500 to-orange-500",
      description: "Electrical systems, battery, alternator, wiring",
    },
    {
      value: "ac-specialist",
      label: "AC Specialist",
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500",
      description: "Air conditioning, climate control, ventilation",
    },
  ];

  const problemTypes = {
    mechanic: [
      { value: "engine", label: "Engine Problem" },
      { value: "brakes", label: "Brake Issue" },
      { value: "transmission", label: "Transmission Problem" },
      { value: "suspension", label: "Suspension Issue" },
      { value: "oil", label: "Oil Change/Leak" },
      { value: "coolant", label: "Coolant/Radiator Issue" },
      { value: "exhaust", label: "Exhaust System" },
      { value: "other", label: "Other Mechanical Issue" },
    ],
    electrician: [
      { value: "battery", label: "Dead/Weak Battery" },
      { value: "alternator", label: "Alternator Problem" },
      { value: "starter", label: "Starter Motor Issue" },
      { value: "wiring", label: "Wiring/Fuse Problem" },
      { value: "lights", label: "Lighting System" },
      { value: "sensors", label: "Electronic Sensors" },
      { value: "other", label: "Other Electrical Issue" },
    ],
    "ac-specialist": [
      { value: "no-cooling", label: "No Cooling" },
      { value: "weak-cooling", label: "Weak Cooling" },
      { value: "strange-noise", label: "Strange Noise" },
      { value: "bad-smell", label: "Bad Smell" },
      { value: "refrigerant", label: "Refrigerant Recharge" },
      { value: "compressor", label: "Compressor Issue" },
      { value: "other", label: "Other AC Issue" },
    ],
  };

  const handleFindProfessionals = () => {
    // Get filtered professionals based on service type and location
    const professionals = getFilteredProfessionals();
    setAvailableProfessionals(professionals);
    setShowProfessionals(true);
    setCurrentStep(4); // New step for browsing professionals
  };

  const handleSelectProfessional = (professional) => {
    setSelectedProfessional(professional);
    setShowProfessionals(false);
    setCurrentStep(5); // Move to final confirmation
  };

  const handleSubmit = () => {
    // Validate required fields
    if (
      !formData.serviceType ||
      !formData.problemType ||
      !selectedProfessional
    ) {
      alert("Please fill in all required fields and select a professional");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const generatedId = `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      setRequestId(generatedId);
      setSubmissionSuccess(true);
      setIsSubmitting(false);
    }, 2000);
  };

  // Success Screen
  if (submissionSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="shadow-2xl border-2 border-green-200">
            <CardContent className="p-12 text-center">
              <div className="mb-6">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle className="h-16 w-16 text-green-600" />
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-3">
                  Request Sent Successfully!
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  {selectedProfessional?.name} has been notified and will
                  contact you soon!
                </p>
              </div>

              {/* Professional Info */}
              {selectedProfessional && (
                <div className="bg-white p-6 rounded-lg border-2 border-green-200 mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={selectedProfessional.image}
                      alt={selectedProfessional.name}
                      className="w-16 h-16 rounded-full border-2 border-green-500"
                    />
                    <div className="text-left">
                      <h3 className="font-bold text-lg">
                        {selectedProfessional.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold">
                          {selectedProfessional.rating}
                        </span>
                        <span className="text-gray-500">
                          ({selectedProfessional.reviews} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white p-6 rounded-lg border-2 border-green-200 mb-6">
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Request ID</p>
                    <p className="font-bold text-gray-900">{requestId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Service Type</p>
                    <p className="font-bold text-gray-900">
                      {
                        serviceTypes.find(
                          (s) => s.value === formData.serviceType,
                        )?.label
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Estimated Arrival
                    </p>
                    <p className="font-bold text-green-600">
                      {selectedProfessional?.estimatedArrival ||
                        "15-30 minutes"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <Badge className="bg-green-100 text-green-800">
                      Professional Notified
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <Navigation className="h-6 w-6 text-blue-600" />
                  <div className="text-left flex-1">
                    <p className="font-semibold text-gray-900">
                      Track Your Professional
                    </p>
                    <p className="text-sm text-gray-600">
                      Real-time location tracking available
                    </p>
                  </div>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Track
                  </Button>
                </div>

                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                  <div className="text-left flex-1">
                    <p className="font-semibold text-gray-900">
                      Chat with {selectedProfessional?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Direct messaging available
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700">
                    Chat
                  </Button>
                </div>

                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                  <Phone className="h-6 w-6 text-green-600" />
                  <div className="text-left flex-1">
                    <p className="font-semibold text-gray-900">
                      Call Professional
                    </p>
                    <p className="text-sm text-gray-600">
                      Response time: {selectedProfessional?.responseTime}
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
                    setSelectedProfessional(null);
                    setShowProfessionals(false);
                    setFormData({
                      serviceType: "",
                      problemType: "",
                      problemDescription: "",
                      imageFile: null,
                      location: { lat: 30.0444, lng: 31.2357 },
                      isEmergency: false,
                      preferredTime: "asap",
                    });
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Request{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Professional
            </span>{" "}
            Service
          </h1>
          <p className="text-lg text-gray-600">
            AI-powered matching • Real-time tracking • Verified professionals
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
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}>
                  {step}
                </div>
                {step < 5 && (
                  <div
                    className={`w-12 h-1 ${currentStep > step ? "bg-blue-600" : "bg-gray-200"}`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-8 mt-2 text-xs">
            <span
              className={
                currentStep >= 1
                  ? "text-blue-600 font-semibold"
                  : "text-gray-500"
              }>
              Service
            </span>
            <span
              className={
                currentStep >= 2
                  ? "text-blue-600 font-semibold"
                  : "text-gray-500"
              }>
              Details
            </span>
            <span
              className={
                currentStep >= 3
                  ? "text-blue-600 font-semibold"
                  : "text-gray-500"
              }>
              Location
            </span>
            <span
              className={
                currentStep >= 4
                  ? "text-blue-600 font-semibold"
                  : "text-gray-500"
              }>
              Browse
            </span>
            <span
              className={
                currentStep >= 5
                  ? "text-blue-600 font-semibold"
                  : "text-gray-500"
              }>
              Confirm
            </span>
          </div>
        </div>

        <Card className="shadow-2xl">
          <CardContent className="p-8">
            {/* Step 1: Service Type Selection */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Select Service Type
                  </h2>
                  <p className="text-gray-600">
                    Choose the type of professional you need
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {serviceTypes.map((service) => {
                    const Icon = service.icon;
                    return (
                      <button
                        key={service.value}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            serviceType: service.value,
                            problemType: "",
                          })
                        }
                        className={`p-6 rounded-xl border-2 transition-all ${
                          formData.serviceType === service.value
                            ? "border-blue-600 bg-blue-50 shadow-lg scale-105"
                            : "border-gray-200 hover:border-blue-300 hover:shadow-md"
                        }`}>
                        <div
                          className={`w-16 h-16 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mx-auto mb-4`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">
                          {service.label}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {service.description}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Emergency Toggle */}
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isEmergency}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isEmergency: e.target.checked,
                        })
                      }
                      className="w-5 h-5"
                    />
                    <div>
                      <p className="font-bold text-red-900">
                        Emergency Priority Service
                      </p>
                      <p className="text-sm text-red-700">
                        Get help in under 15 minutes (additional fees apply)
                      </p>
                    </div>
                  </label>
                </div>

                <Button
                  onClick={() => setCurrentStep(2)}
                  disabled={!formData.serviceType}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6">
                  Continue to Details
                  <ArrowLeft className="ml-2 h-5 w-5 rotate-180" />
                </Button>
              </div>
            )}

            {/* Step 2: Problem Details & Customer Info */}
            {currentStep === 2 && (
              <div className="space-y-6">

                {/* Problem Description */}
                <div className="space-y-4 p-6 bg-orange-50 rounded-lg border-2 border-orange-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Wrench className="h-5 w-5 text-orange-600" />
                    <h3 className="font-bold text-lg text-gray-900">
                      Problem Description
                    </h3>
                  </div>

                  <div>
                    <Label
                      htmlFor="problemType"
                      className="text-base font-semibold mb-2 block">
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
                        {formData.serviceType &&
                          problemTypes[formData.serviceType]?.map((problem) => (
                            <SelectItem
                              key={problem.value}
                              value={problem.value}>
                              {problem.label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label
                      htmlFor="problemDescription"
                      className="text-base font-semibold mb-2 block">
                      Detailed Description (Optional)
                    </Label>
                    <Textarea
                      id="problemDescription"
                      placeholder="Describe the issue in detail to help us serve you better..."
                      rows={4}
                      value={formData.problemDescription}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          problemDescription: e.target.value,
                        })
                      }
                      className="text-base"
                    />
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
                      !formData.problemType
                    }
                    className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Continue to Location
                    <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Location & Confirmation */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Set Your Location
                  </h2>
                  <p className="text-gray-600">
                    Help us find the nearest professionals to you
                  </p>
                </div>

                <MapPicker
                  location={formData.location}
                  onLocationChange={(location) =>
                    setFormData({ ...formData, location })
                  }
                />

                {/* Service Summary */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    Search Summary
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Service Type</p>
                      <p className="font-semibold">
                        {
                          serviceTypes.find(
                            (s) => s.value === formData.serviceType,
                          )?.label
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Problem Type</p>
                      <p className="font-semibold">
                        {
                          problemTypes[formData.serviceType]?.find(
                            (p) => p.value === formData.problemType,
                          )?.label
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Priority</p>
                      <Badge
                        className={
                          formData.isEmergency
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }>
                        {formData.isEmergency ? "Emergency" : "Standard"}
                      </Badge>
                    </div>
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
                    onClick={handleFindProfessionals}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-lg py-6">
                    <Search className="mr-2 h-5 w-5" />
                    Find Available Professionals
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Browse Available Professionals */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Available Professionals Near You
                  </h2>
                  <p className="text-gray-600">
                    Found {availableProfessionals.length} professionals • Sorted
                    by distance
                  </p>
                </div>

                {/* Filters */}
                <div className="flex gap-3 flex-wrap">
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-blue-50">
                    <Star className="h-3 w-3 mr-1" />
                    Highest Rated
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-blue-50">
                    <Clock className="h-3 w-3 mr-1" />
                    Fastest Arrival
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-blue-50">
                    <DollarSign className="h-3 w-3 mr-1" />
                    Best Price
                  </Badge>
                </div>

                {/* Professionals List */}
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {availableProfessionals.map((professional) => (
                    <Card
                      key={professional.id}
                      className={`border-2 transition-all hover:shadow-lg cursor-pointer ${
                        !professional.available
                          ? "opacity-60"
                          : "hover:border-blue-400"
                      }`}
                      onClick={() =>
                        professional.available &&
                        handleSelectProfessional(professional)
                      }>
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          {/* Professional Image */}
                          <div className="flex-shrink-0">
                            <div className="relative">
                              <img
                                src={professional.image}
                                alt={professional.name}
                                className="w-24 h-24 rounded-lg object-cover border-2 border-gray-200"
                              />
                              {professional.verified && (
                                <div className="absolute -top-2 -right-2 bg-blue-600 rounded-full p-1">
                                  <CheckCircle2 className="h-4 w-4 text-white" />
                                </div>
                              )}
                              {!professional.available && (
                                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">
                                    Busy
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Professional Details */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">
                                  {professional.name}
                                </h3>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                    <span className="font-semibold">
                                      {professional.rating}
                                    </span>
                                    <span>({professional.reviews})</span>
                                  </div>
                                  <span>•</span>
                                  <span>
                                    {professional.experience} experience
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-gray-600">
                                  Distance
                                </div>
                                <div className="text-xl font-bold text-blue-600">
                                  {professional.distance} km
                                </div>
                              </div>
                            </div>

                            {/* Specializations */}
                            <div className="flex flex-wrap gap-2 mb-3">
                              {professional.specializations.map((spec, idx) => (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className="text-xs">
                                  {spec}
                                </Badge>
                              ))}
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-4 mb-3">
                              <div className="bg-gray-50 p-2 rounded">
                                <div className="text-xs text-gray-600">
                                  Arrival Time
                                </div>
                                <div className="font-semibold text-sm text-green-600">
                                  {professional.estimatedArrival}
                                </div>
                              </div>
                              <div className="bg-gray-50 p-2 rounded">
                                <div className="text-xs text-gray-600">
                                  Response
                                </div>
                                <div className="font-semibold text-sm">
                                  {professional.responseTime}
                                </div>
                              </div>
                              <div className="bg-gray-50 p-2 rounded">
                                <div className="text-xs text-gray-600">
                                  Jobs Done
                                </div>
                                <div className="font-semibold text-sm">
                                  {professional.completedJobs}
                                </div>
                              </div>
                            </div>

                            {/* Pricing */}
                            <div className="flex items-center justify-between pt-3 border-t">
                              <div className="flex gap-4 text-sm">
                                <div>
                                  <span className="text-gray-600">
                                    Callout Fee:
                                  </span>
                                  <span className="font-bold ml-1">
                                    EGP {professional.pricing.calloutFee}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-600">
                                    Per Hour:
                                  </span>
                                  <span className="font-bold ml-1">
                                    EGP {professional.pricing.hourlyRate}
                                  </span>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                disabled={!professional.available}
                                className="bg-blue-600 hover:bg-blue-700">
                                {professional.available
                                  ? "Select Professional"
                                  : "Currently Unavailable"}
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

            {/* Step 5: Final Confirmation with Selected Professional */}
            {currentStep === 5 && selectedProfessional && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Confirm Your Request
                  </h2>
                  <p className="text-gray-600">
                    Review details before sending your request
                  </p>
                </div>

                {/* Selected Professional Card */}
                <Card className="border-2 border-blue-500 bg-blue-50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={selectedProfessional.image}
                        alt={selectedProfessional.name}
                        className="w-20 h-20 rounded-full border-4 border-blue-500"
                      />
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900">
                          {selectedProfessional.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-semibold">
                            {selectedProfessional.rating}
                          </span>
                          <span className="text-gray-600">
                            ({selectedProfessional.reviews} reviews)
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-600">
                            {selectedProfessional.experience}
                          </span>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Selected
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-white p-3 rounded">
                        <div className="text-gray-600 mb-1">
                          Estimated Arrival
                        </div>
                        <div className="font-bold text-green-600">
                          {selectedProfessional.estimatedArrival}
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded">
                        <div className="text-gray-600 mb-1">Distance</div>
                        <div className="font-bold">
                          {selectedProfessional.distance} km away
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded">
                        <div className="text-gray-600 mb-1">Callout Fee</div>
                        <div className="font-bold">
                          EGP {selectedProfessional.pricing.calloutFee}
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded">
                        <div className="text-gray-600 mb-1">Hourly Rate</div>
                        <div className="font-bold">
                          EGP {selectedProfessional.pricing.hourlyRate}
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
                          {
                            serviceTypes.find(
                              (s) => s.value === formData.serviceType,
                            )?.label
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Problem:</span>
                        <span className="font-semibold">
                          {
                            problemTypes[formData.serviceType]?.find(
                              (p) => p.value === formData.problemType,
                            )?.label
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Priority:</span>
                        <Badge
                          className={
                            formData.isEmergency
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }>
                          {formData.isEmergency ? "Emergency" : "Standard"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Estimated Cost */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Estimated Cost
                  </h3>
                  <div className="space-y-2 text-sm mb-3">
                    <div className="flex justify-between">
                      <span>Callout Fee</span>
                      <span className="font-semibold">
                        EGP {selectedProfessional.pricing.calloutFee}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Labor (Est. 1 hour)</span>
                      <span className="font-semibold">
                        EGP {selectedProfessional.pricing.hourlyRate}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Parts (if needed)</span>
                      <span>TBD</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-green-300 flex justify-between items-center">
                    <span className="font-bold text-lg">Estimated Total:</span>
                    <span className="text-2xl font-bold text-green-600">
                      EGP{" "}
                      {selectedProfessional.pricing.calloutFee +
                        selectedProfessional.pricing.hourlyRate}
                      +
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    *Final cost may vary based on actual work required and parts
                    needed
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      setCurrentStep(4);
                      setSelectedProfessional(null);
                    }}
                    variant="outline"
                    className="flex-1">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Choose Different Professional
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-lg py-6">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sending Request...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Confirm & Send Request
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
              text: "Verified Professionals",
              color: "text-blue-600",
            },
            { icon: Star, text: "4.9/5 Rating", color: "text-yellow-600" },
            { icon: Clock, text: "15min Response", color: "text-green-600" },
            { icon: Phone, text: "24/7 Support", color: "text-purple-600" },
          ].map((item, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow-md">
              <item.icon className={`h-8 w-8 mx-auto mb-2 ${item.color}`} />
              <p className="text-sm font-semibold text-gray-700">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RequestMobileProfessional;
