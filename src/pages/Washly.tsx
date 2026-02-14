import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Car,
  Star,
  Clock,
  Shield,
  Phone,
  Search,
  DollarSign,
  CheckCircle2,
  Droplets,
  Sparkle,
  CreditCard,
  Smartphone,
  Truck,
  Home,
  Briefcase,
  Building,
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
      <div className="relative w-full h-64 bg-gradient-to-br from-orange-100 to-amber-100 rounded-lg border-2 border-gray-300 overflow-hidden shadow-md">
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
            className="h-12 w-12 text-[#ff6b35] drop-shadow-lg animate-bounce"
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
                Select Your Location on Map
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
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-[#ff6b35] to-orange-500 text-white">
              <div>
                <h3 className="text-xl font-bold">Select Your Location</h3>
                <p className="text-sm text-orange-100">
                  Click on the map or adjust coordinates manually
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeMap}
                className="h-8 w-8 p-0 text-white hover:bg-orange-600">
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
              <div className="bg-white p-4 rounded-lg border-2 border-orange-200">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-[#ff6b35]" />
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
                className="w-full bg-[#ff6b35] hover:bg-orange-600 text-white font-semibold py-3">
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

const WashlyServicePage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [availableWashers, setAvailableWashers] = useState([]);
  const [selectedWasher, setSelectedWasher] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const [formData, setFormData] = useState({
    washType: "",
    location: { lat: 30.0444, lng: 31.2357 },
    locationType: "",
    specialInstructions: "",
    preferredDate: "",
    preferredTimeSlot: "",
    paymentMethod: "",
  });

  // Mock data for available washers
  const mockWashers = [
    {
      id: 1,
      name: "Ahmed Hassan",
      image: "https://i.pravatar.cc/150?img=12",
      rating: 4.9,
      reviews: 247,
      specializations: ["Exterior Detailing", "Polishing", "Ceramic Coating"],
      distance: 2.3,
      estimatedArrival: "15-20 min",
      pricing: {
        baseFee: 50,
        hourlyRate: 120,
      },
      verified: true,
      experience: "5 years",
      completedJobs: 980,
      responseTime: "5 min avg",
      available: true,
    },
    {
      id: 2,
      name: "Mohamed Ali",
      image: "https://i.pravatar.cc/150?img=33",
      rating: 4.8,
      reviews: 189,
      specializations: ["Interior Cleaning", "Leather Care", "Odor Removal"],
      distance: 3.7,
      estimatedArrival: "20-25 min",
      pricing: {
        baseFee: 45,
        hourlyRate: 110,
      },
      verified: true,
      experience: "4 years",
      completedJobs: 750,
      responseTime: "7 min avg",
      available: true,
    },
    {
      id: 3,
      name: "Khaled Ibrahim",
      image: "https://i.pravatar.cc/150?img=51",
      rating: 5.0,
      reviews: 312,
      specializations: ["Full Detailing", "Paint Correction", "Engine Bay"],
      distance: 1.8,
      estimatedArrival: "10-15 min",
      pricing: {
        baseFee: 60,
        hourlyRate: 150,
      },
      verified: true,
      experience: "8 years",
      completedJobs: 1250,
      responseTime: "3 min avg",
      available: true,
    },
  ];

  // Wash Types
  const washTypes = [
    {
      value: "exterior",
      label: "Exterior Wash",
      icon: Car,
      color: "from-blue-500 to-cyan-500",
      price: 60,
      duration: "30-45 min",
      description: "Complete exterior cleaning and drying",
      features: [
        "Foam wash",
        "Wheel cleaning",
        "Window cleaning",
        "Tire dressing",
      ],
    },
    {
      value: "interior",
      label: "Interior Wash",
      icon: Droplets,
      color: "from-green-500 to-emerald-500",
      price: 85,
      duration: "45-60 min",
      description: "Thorough interior cleaning",
      features: [
        "Vacuuming",
        "Dashboard cleaning",
        "Leather treatment",
        "Odor removal",
      ],
    },
    {
      value: "full",
      label: "Full Detailing",
      icon: Sparkle,
      color: "from-[#ff6b35] to-orange-500",
      price: 100,
      duration: "2-3 hours",
      description: "Complete interior & exterior detailing",
      features: [
        "Both services",
        "Wax application",
        "Engine bay",
        "Full polish",
      ],
      popular: true,
    },
  ];

  // Location Types
  const locationTypes = [
    { value: "home", label: "Home", icon: Home },
    { value: "office", label: "Office", icon: Building },
    { value: "work", label: "Workplace", icon: Briefcase },
    { value: "garage", label: "Garage", icon: Truck },
  ];

  // Time Slots
  const timeSlots = [
    "8:00 AM",
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
    "7:00 PM",
  ];

  // Payment Methods
  const paymentMethods = [
    { value: "cash", label: "Cash on Delivery", icon: DollarSign },
    { value: "vodafone", label: "Vodafone Cash", icon: Smartphone },
    { value: "instapay", label: "InstaPay", icon: CreditCard },
    { value: "card", label: "Credit/Debit Card", icon: CreditCard },
  ];

  // Filter washers
  const getFilteredWashers = () => {
    if (!formData.washType) return [];
    let filtered = mockWashers;

    if (formData.washType === "exterior") {
      filtered = mockWashers.filter((w) =>
        w.specializations.some(
          (s) => s.includes("Exterior") || s.includes("Polishing"),
        ),
      );
    } else if (formData.washType === "interior") {
      filtered = mockWashers.filter((w) =>
        w.specializations.some(
          (s) => s.includes("Interior") || s.includes("Leather"),
        ),
      );
    } else if (formData.washType === "full") {
      filtered = mockWashers.filter((w) =>
        w.specializations.some(
          (s) => s.includes("Full") || s.includes("Detailing"),
        ),
      );
    }

    return filtered.sort((a, b) => a.distance - b.distance);
  };

  // Get next 7 days
  const getNextSevenDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push({
        value: date.toISOString().split("T")[0],
        label: date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
        today: i === 0,
      });
    }
    return days;
  };

  // Find washers
  const handleFindWashers = () => {
    const washers = getFilteredWashers();
    setAvailableWashers(washers);
    setCurrentStep(3);
  };

  // Select washer
  const handleSelectWasher = (washer) => {
    setSelectedWasher(washer);
    setCurrentStep(4);
  };

  // Calculate price
  const calculateTotalPrice = () => {
    const selectedWash = washTypes.find((w) => w.value === formData.washType);
    return selectedWash?.price || 0;
  };

  // Submit
  const handleSubmit = () => {
    if (!formData.washType || !selectedWasher || !formData.paymentMethod) {
      alert("Please complete all required fields");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const generatedId = `WASH-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      setBookingId(generatedId);
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
                  Booking Confirmed! 🎉
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  {selectedWasher?.name} is on the way to wash your car!
                </p>
              </div>

              

              <div className="bg-white p-6 rounded-lg border-2 border-green-200 mb-6">
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Booking ID</p>
                    <p className="font-bold text-gray-900">{bookingId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Service Type</p>
                    <p className="font-bold text-gray-900">
                      {
                        washTypes.find((w) => w.value === formData.washType)
                          ?.label
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                    <p className="font-bold text-green-600">
                      EGP
                      {calculateTotalPrice() + selectedWasher.pricing.baseFee}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <Badge className="bg-green-100 text-green-800">
                      Washer En Route
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <Navigation className="h-6 w-6 text-blue-600" />
                  <div className="text-left flex-1">
                    <p className="font-semibold text-gray-900">
                      Live Washer Tracking
                    </p>
                    <p className="text-sm text-gray-600">
                      Track {selectedWasher?.name} in real-time
                    </p>
                  </div>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Track Now
                  </Button>
                </div>

                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                  <div className="text-left flex-1">
                    <p className="font-semibold text-gray-900">
                      Chat with Washer
                    </p>
                    <p className="text-sm text-gray-600">
                      Direct messaging available
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700">
                    Open Chat
                  </Button>
                </div>

                <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg">
                  <Phone className="h-6 w-6 text-orange-600" />
                  <div className="text-left flex-1">
                    <p className="font-semibold text-gray-900">
                      Call Your Washer
                    </p>
                    <p className="text-sm text-gray-600">
                      Response time: {selectedWasher?.responseTime}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-orange-600 hover:bg-orange-700">
                    Call Now
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
                    setSelectedWasher(null);
                    setFormData({
                      washType: "",
                      location: { lat: 30.0444, lng: 31.2357 },
                      locationType: "",
                      specialInstructions: "",
                      preferredDate: "",
                      preferredTimeSlot: "",
                      paymentMethod: "",
                    });
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700">
                  Book Another Wash
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Book <span className="text-[#ff6b35]">Washly</span> Service
          </h1>
          <p className="text-lg text-gray-600">
            Professional car wash at your location • Live tracking • Cashless
            payments
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                    currentStep >= step
                      ? "bg-[#ff6b35] text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div
                    className={`w-12 h-1 ${currentStep > step ? "bg-[#ff6b35]" : "bg-gray-200"}`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs px-4">
            <span
              className={
                currentStep >= 1
                  ? "text-[#ff6b35] font-semibold"
                  : "text-gray-500"
              }>
              Wash Type
            </span>
            <span
              className={
                currentStep >= 2
                  ? "text-[#ff6b35] font-semibold"
                  : "text-gray-500"
              }>
              Location
            </span>
            <span
              className={
                currentStep >= 3
                  ? "text-[#ff6b35] font-semibold"
                  : "text-gray-500"
              }>
              Washer
            </span>
            <span
              className={
                currentStep >= 4
                  ? "text-[#ff6b35] font-semibold"
                  : "text-gray-500"
              }>
              Confirm
            </span>
          </div>
        </div>

        <Card className="shadow-2xl">
          <CardContent className="p-8">
            {/* Step 1: Wash Type */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Choose Your Wash Type
                  </h2>
                  <p className="text-gray-600">
                    Select the perfect package for your car
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {washTypes.map((wash) => {
                    const Icon = wash.icon;
                    return (
                      <button
                        key={wash.value}
                        onClick={() =>
                          setFormData({ ...formData, washType: wash.value })
                        }
                        className={`p-6 rounded-xl border-2 transition-all text-left ${
                          formData.washType === wash.value
                            ? "border-[#ff6b35] bg-orange-50 shadow-lg scale-105"
                            : "border-gray-200 hover:border-orange-300 hover:shadow-md"
                        }`}>
                        <div className="flex items-start justify-between mb-4">
                          <div
                            className={`w-14 h-14 rounded-xl bg-gradient-to-br ${wash.color} flex items-center justify-center`}>
                            <Icon className="w-7 h-7 text-white" />
                          </div>
                          {wash.popular && (
                            <Badge className="bg-[#ff6b35] text-white">
                              Most Popular
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-bold text-lg mb-2">{wash.label}</h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {wash.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            {wash.duration}
                          </div>
                          <div className="text-xl font-bold text-[#ff6b35]">
                            EGP{wash.price}
                          </div>
                        </div>
                        <div className="mt-3">
                          <ul className="text-xs text-gray-600 space-y-1">
                            {wash.features.map((feature, idx) => (
                              <li key={idx} className="flex items-center">
                                <CheckCircle2 className="h-3 w-3 mr-2 text-green-500" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <Button
                  onClick={() => setCurrentStep(2)}
                  disabled={!formData.washType}
                  className="w-full bg-[#ff6b35] hover:bg-orange-600 text-lg py-6">
                  Continue to Details
                  <ArrowLeft className="ml-2 h-5 w-5 rotate-180" />
                </Button>
              </div>
            )}

            {/* Step 2: Location & Time */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Set Your Location & Time
                  </h2>
                  <p className="text-gray-600">
                    Tell us where and when to wash your car
                  </p>
                </div>

                <MapPicker
                  location={formData.location}
                  onLocationChange={(location) =>
                    setFormData({ ...formData, location })
                  }
                />

                <div>
                  <Label className="text-base font-semibold mb-2 block">
                    Location Type
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {locationTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.value}
                          onClick={() =>
                            setFormData({
                              ...formData,
                              locationType: type.value,
                            })
                          }
                          className={`p-4 rounded-lg border-2 transition-all ${
                            formData.locationType === type.value
                              ? "border-[#ff6b35] bg-orange-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}>
                          <Icon className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                          <span className="text-sm font-medium">
                            {type.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-semibold mb-2 block">
                    Select Date
                  </Label>
                  <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
                    {getNextSevenDays().map((day) => (
                      <button
                        key={day.value}
                        onClick={() => {
                          setSelectedDate(day.value);
                          setFormData({
                            ...formData,
                            preferredDate: day.value,
                          });
                        }}
                        className={`p-3 rounded-lg border transition-all ${
                          selectedDate === day.value
                            ? "border-[#ff6b35] bg-orange-50"
                            : "border-gray-200 hover:border-gray-300"
                        } ${day.today ? "bg-blue-50" : ""}`}>
                        <div className="text-xs text-gray-500">
                          {day.label.split(" ")[0]}
                        </div>
                        <div className="font-semibold">
                          {day.label.split(" ")[1]} {day.label.split(" ")[2]}
                        </div>
                        {day.today && (
                          <div className="text-xs text-blue-600 mt-1">
                            Today
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-semibold mb-2 block">
                    Select Time Slot
                  </Label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => {
                          setSelectedTime(time);
                          setFormData({ ...formData, preferredTimeSlot: time });
                        }}
                        className={`p-3 rounded-lg border transition-all ${
                          selectedTime === time
                            ? "border-[#ff6b35] bg-orange-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}>
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-semibold mb-2 block">
                    Special Instructions (Optional)
                  </Label>
                  <Textarea
                    placeholder="Any specific instructions for the washer..."
                    rows={3}
                    value={formData.specialInstructions}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specialInstructions: e.target.value,
                      })
                    }
                  />
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
                    onClick={handleFindWashers}
                    disabled={!selectedDate || !selectedTime}
                    className="flex-1 bg-[#ff6b35] hover:bg-orange-600 text-lg py-6">
                    <Search className="mr-2 h-5 w-5" />
                    Find Available Washers
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Browse Washers */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Available Washers Near You
                  </h2>
                  <p className="text-gray-600">
                    Found {availableWashers.length} washers • Sorted by distance
                  </p>
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {availableWashers.map((washer) => (
                    <Card
                      key={washer.id}
                      className="border-2 transition-all hover:shadow-lg cursor-pointer hover:border-[#ff6b35]"
                      onClick={() => handleSelectWasher(washer)}>
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0">
                            <div className="relative">
                              <img
                                src={washer.image}
                                alt={washer.name}
                                className="w-24 h-24 rounded-lg object-cover border-2 border-gray-200"
                              />
                              {washer.verified && (
                                <div className="absolute -top-2 -right-2 bg-[#ff6b35] rounded-full p-1">
                                  <CheckCircle2 className="h-4 w-4 text-white" />
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">
                                  {washer.name}
                                </h3>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                    <span className="font-semibold">
                                      {washer.rating}
                                    </span>
                                    <span>({washer.reviews})</span>
                                  </div>
                                  <span>•</span>
                                  <span>{washer.experience} experience</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-gray-600">
                                  Distance
                                </div>
                                <div className="text-xl font-bold text-[#ff6b35]">
                                  {washer.distance} km
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-3">
                              {washer.specializations.map((spec, idx) => (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className="text-xs">
                                  {spec}
                                </Badge>
                              ))}
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-3">
                              <div className="bg-gray-50 p-2 rounded">
                                <div className="text-xs text-gray-600">
                                  Arrival Time
                                </div>
                                <div className="font-semibold text-sm text-green-600">
                                  {washer.estimatedArrival}
                                </div>
                              </div>
                              <div className="bg-gray-50 p-2 rounded">
                                <div className="text-xs text-gray-600">
                                  Response
                                </div>
                                <div className="font-semibold text-sm">
                                  {washer.responseTime}
                                </div>
                              </div>
                              <div className="bg-gray-50 p-2 rounded">
                                <div className="text-xs text-gray-600">
                                  Jobs Done
                                </div>
                                <div className="font-semibold text-sm">
                                  {washer.completedJobs}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t">
                              <div className="flex gap-4 text-sm">
                                <div>
                                  <span className="text-gray-600">
                                    Base Fee:
                                  </span>
                                  <span className="font-bold ml-1">
                                    EGP{washer.pricing.baseFee}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-600">
                                    Per Hour:
                                  </span>
                                  <span className="font-bold ml-1">
                                    EGP{washer.pricing.hourlyRate}
                                  </span>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                className="bg-[#ff6b35] hover:bg-orange-600">
                                Select Washer
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Button
                  onClick={() => setCurrentStep(2)}
                  variant="outline"
                  className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Location & Time
                </Button>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && selectedWasher && (
              <div className="space-y-6">
                

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-4">Booking Summary</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Wash Type:</span>
                        <span className="font-semibold">
                          {
                            washTypes.find((w) => w.value === formData.washType)
                              ?.label
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date & Time:</span>
                        <span className="font-semibold">
                          {selectedDate} • {selectedTime}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <Badge variant="outline">
                          {locationTypes.find(
                            (l) => l.value === formData.locationType,
                          )?.label || "Not specified"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div>
                  <Label className="text-base font-semibold mb-2 block">
                    Select Payment Method
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {paymentMethods.map((method) => {
                      const Icon = method.icon;
                      return (
                        <button
                          key={method.value}
                          onClick={() =>
                            setFormData({
                              ...formData,
                              paymentMethod: method.value,
                            })
                          }
                          className={`p-4 rounded-lg border-2 transition-all ${
                            formData.paymentMethod === method.value
                              ? "border-[#ff6b35] bg-orange-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}>
                          <Icon className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                          <span className="text-sm font-medium">
                            {method.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Cost Summary
                  </h3>
                  <div className="space-y-2 text-sm mb-3">
                    <div className="flex justify-between">
                      <span>Wash Service</span>
                      <span className="font-semibold">
                        EGP{calculateTotalPrice()}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Washer's Base Fee</span>
                      <span>EGP{selectedWasher.pricing.baseFee}</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-green-300 flex justify-between items-center">
                    <span className="font-bold text-lg">Estimated Total:</span>
                    <span className="text-2xl font-bold text-green-600">
                      EGP
                      {calculateTotalPrice() + selectedWasher.pricing.baseFee}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    *Final cost may vary based on actual time required
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      setCurrentStep(3);
                      setSelectedWasher(null);
                    }}
                    variant="outline"
                    className="flex-1">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Choose Different Washer
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !formData.paymentMethod}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-lg py-6">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Confirm & Book Now
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
            { icon: Shield, text: "Verified Washers", color: "text-[#ff6b35]" },
            { icon: Star, text: "4.9/5 Rating", color: "text-yellow-600" },
            { icon: Clock, text: "30min Arrival", color: "text-green-600" },
            { icon: Phone, text: "24/7 Support", color: "text-blue-600" },
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

export default WashlyServicePage;
