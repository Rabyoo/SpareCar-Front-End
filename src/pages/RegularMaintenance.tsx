import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Wrench,
  Droplets,
  Gauge,
  Settings,
  Battery,
  Wind,
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  Loader2,
  ChevronRight,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RegularMaintenance() {
  const navigate = useNavigate();

  // Service Request State
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [urgencyLevel, setUrgencyLevel] = useState<
    "normal" | "urgent" | "emergency"
  >("normal");

  // User Data - بيانات بسيطة فقط
  const [formData, setFormData] = useState({
    location: "",
    description: "",
    preferredTime: "",
  });

  // Live Location
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  // Price Estimation
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<{
    min: number;
    max: number;
  } | null>(null);

  // Submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Services Data
  const maintenanceServices = [
    {
      id: "oil-change",
      title: "Oil Change Service",
      titleEn: "Complete oil & filter replacement",
      icon: Droplets,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      estimatedTime: "30-45 mins",
      basePrice: 150,
      priceRange: { min: 150, max: 300 },
    },
    {
      id: "tire-service",
      title: "Tire Service",
      titleEn: "Repair, rotation & balancing",
      icon: Settings,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      estimatedTime: "45-60 mins",
      basePrice: 200,
      priceRange: { min: 100, max: 500 },
    },
    {
      id: "brake-service",
      title: "Brake Service",
      titleEn: "Complete brake system inspection",
      icon: Gauge,
      color: "text-red-600",
      bgColor: "bg-red-50",
      estimatedTime: "1-2 hours",
      basePrice: 350,
      priceRange: { min: 250, max: 800 },
    },
    {
      id: "battery-service",
      title: "Battery Service",
      titleEn: "Testing & replacement",
      icon: Battery,
      color: "text-green-600",
      bgColor: "bg-green-50",
      estimatedTime: "20-30 mins",
      basePrice: 400,
      priceRange: { min: 300, max: 700 },
    },
    {
      id: "ac-service",
      title: "A/C Service",
      titleEn: "Air conditioning repair & recharge",
      icon: Wind,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      estimatedTime: "1-1.5 hours",
      basePrice: 250,
      priceRange: { min: 200, max: 600 },
    },
    {
      id: "general-inspection",
      title: "General Inspection",
      titleEn: "Comprehensive vehicle check",
      icon: Wrench,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      estimatedTime: "2-3 hours",
      basePrice: 500,
      priceRange: { min: 400, max: 1000 },
    },
  ];

  // Price Estimation
  useEffect(() => {
    if (selectedService) {
      const service = maintenanceServices.find((s) => s.id === selectedService);
      if (service) {
        let multiplier = 1;
        if (urgencyLevel === "urgent") multiplier = 1.3;
        if (urgencyLevel === "emergency") multiplier = 1.8;

        setEstimatedPrice(Math.round(service.basePrice * multiplier));
        setPriceRange({
          min: Math.round(service.priceRange.min * multiplier),
          max: Math.round(service.priceRange.max * multiplier),
        });
      }
    }
  }, [selectedService, urgencyLevel]);

  // Form Submission
  const handleSubmit = async () => {
    console.log("=== Submitting Request ===");
    console.log("Selected Service:", selectedService);
    console.log("Urgency Level:", urgencyLevel);
    console.log("Form Data:", formData);

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setSubmitSuccess(true);
    setStep(4);
  };

  // Reset form
  const resetForm = () => {
    setStep(1);
    setSelectedService(null);
    setFormData({
      location: "",
      description: "",
      preferredTime: "",
    });
    setSubmitSuccess(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-20 pb-10">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    step >= s
                      ? "bg-[#ff6b35] text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}>
                  {step > s ? <Check className="w-5 h-5" /> : s}
                </div>
                {s < 4 && (
                  <div
                    className={`h-1 w-20 mx-2 ${
                      step > s ? "bg-[#ff6b35]" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>Choose Service</span>
            <span>Details</span>
            <span>Confirm</span>
            <span>Success</span>
          </div>
        </div>

        {/* Step 1: Service Selection */}
        {step === 1 && (
          <div className="animate-fade-in-up">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Choose Your Service
              </h1>
              <p className="text-gray-600">
                Select the maintenance you need right now
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {maintenanceServices.map((service) => (
                <Card
                  key={service.id}
                  className={`cursor-pointer transition-all hover:shadow-2xl hover:scale-105 ${
                    selectedService === service.id
                      ? "ring-4 ring-[#ff6b35] shadow-2xl"
                      : ""
                  }`}
                  onClick={() => setSelectedService(service.id)}>
                  <CardContent className="p-6 text-center space-y-4">
                    <div
                      className={`w-20 h-20 mx-auto rounded-full ${service.bgColor} flex items-center justify-center`}>
                      <service.icon className={`w-10 h-10 ${service.color}`} />
                    </div>
                    <h3 className="text-xl font-bold">{service.title}</h3>
                    <p className="text-sm text-gray-600">{service.titleEn}</p>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      {service.estimatedTime}
                    </div>
                    <div className="text-2xl font-bold text-[#ff6b35]">
                      {service.basePrice} EGP
                    </div>
                    {selectedService === service.id && (
                      <CheckCircle className="w-8 h-8 text-[#ff6b35] mx-auto" />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Urgency Level */}
            {selectedService && (
              <Card className="mb-8 border-2 border-[#ff6b35]/30">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-center">
                    Urgency Level
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      {
                        value: "normal",
                        label: "Normal",
                        color: "bg-green-500",
                        desc: "Within a day",
                      },
                      {
                        value: "urgent",
                        label: "Urgent",
                        color: "bg-orange-500",
                        desc: "Within hours",
                      },
                      {
                        value: "emergency",
                        label: "Emergency",
                        color: "bg-red-500",
                        desc: "Immediately",
                      },
                    ].map((level) => (
                      <button
                        key={level.value}
                        onClick={() => setUrgencyLevel(level.value as any)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          urgencyLevel === level.value
                            ? "border-[#ff6b35] bg-[#ff6b35]/10"
                            : "border-gray-200"
                        }`}>
                        <div
                          className={`w-4 h-4 ${level.color} rounded-full mx-auto mb-2`}
                        />
                        <div className="font-bold">{level.label}</div>
                        <div className="text-sm text-gray-600">
                          {level.desc}
                        </div>
                      </button>
                    ))}
                  </div>

                  {priceRange && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
                      <div className="text-sm text-gray-600 mb-2">
                        Estimated Price
                      </div>
                      <div className="text-3xl font-bold text-[#ff6b35]">
                        {priceRange.min} - {priceRange.max} EGP
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Button
              size="lg"
              disabled={!selectedService}
              onClick={() => setStep(2)}
              className="w-full bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white text-xl py-6">
              Next
              <ChevronRight className="ml-2 w-6 h-6" />
            </Button>
          </div>
        )}

        {/* Step 2: Problem */}
        {step === 2 && (
          <div className="animate-fade-in-up space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Problem</h1>
              <p className="text-gray-600">Complete the required information</p>
            </div>

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <label className="block text-sm font-bold mb-2">
                  Problem Description
                </label>
                <textarea
                  placeholder="Describe the problem in detail..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-[#ff6b35] focus:outline-none resize-none"
                />
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button
                size="lg"
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1 text-lg py-6">
                Back
              </Button>
              <Button
                size="lg"
                onClick={() => setStep(3)}
                className="flex-1 bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white text-lg py-6">
                Next
                <ChevronRight className="ml-2 w-6 h-6" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="animate-fade-in-up space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Review & Confirm
              </h1>
              <p className="text-gray-600">
                Verify all details before submitting
              </p>
            </div>

            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-gray-500 mb-2">Service</h3>
                    <p className="text-lg">
                      {
                        maintenanceServices.find(
                          (s) => s.id === selectedService,
                        )?.title
                      }
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-500 mb-2">
                      Urgency Level
                    </h3>
                    <p className="text-lg capitalize">{urgencyLevel}</p>
                  </div>

                  <div className="md:col-span-2">
                    <h3 className="font-bold text-gray-500 mb-2">Location</h3>
                    <p className="text-lg">{formData.location}</p>
                  </div>

                  {formData.preferredTime && (
                    <div className="md:col-span-2">
                      <h3 className="font-bold text-gray-500 mb-2">
                        Preferred Time
                      </h3>
                      <p className="text-lg">
                        {new Date(formData.preferredTime).toLocaleString(
                          "en-US",
                        )}
                      </p>
                    </div>
                  )}

                  {formData.description && (
                    <div className="md:col-span-2">
                      <h3 className="font-bold text-gray-500 mb-2">
                        Problem Description
                      </h3>
                      <p className="text-lg">{formData.description}</p>
                    </div>
                  )}
                </div>

                {estimatedPrice && (
                  <div className="p-6 bg-gradient-to-br from-[#ff6b35] to-[#ff8c5a] rounded-lg text-white text-center">
                    <h3 className="text-lg mb-2">Estimated Price</h3>
                    <div className="text-4xl font-bold">
                      {estimatedPrice} EGP
                    </div>
                    {priceRange && (
                      <p className="text-sm mt-2 opacity-90">
                        (Range: {priceRange.min} - {priceRange.max} EGP)
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button
                size="lg"
                variant="outline"
                onClick={() => setStep(2)}
                disabled={isSubmitting}
                className="flex-1 text-lg py-6">
                Back
              </Button>
              <Button
                size="lg"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white text-lg py-6">
                {isSubmitting ? (
                  <>
                    <Loader2 className="ml-2 w-6 h-6 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Confirm Request
                    <CheckCircle className="ml-2 w-6 h-6" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && submitSuccess && (
          <div className="animate-fade-in-up text-center space-y-8">
            <div className="w-32 h-32 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-20 h-20 text-green-500" />
            </div>

            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Request Submitted Successfully!
              </h1>
              <p className="text-xl text-gray-600">
                Our team will contact you within minutes
              </p>
            </div>

            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8 space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-bold">Request Number</span>
                  <span className="text-2xl font-bold text-[#ff6b35]">
                    #{Math.floor(10000 + Math.random() * 90000)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <Clock className="w-6 h-6 text-blue-500 mb-2" />
                    <div className="text-sm text-gray-600">
                      Expected Arrival
                    </div>
                    <div className="text-lg font-bold">
                      {urgencyLevel === "emergency"
                        ? "30-45 mins"
                        : urgencyLevel === "urgent"
                          ? "2-4 hours"
                          : "At scheduled time"}
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <Phone className="w-6 h-6 text-green-500 mb-2" />
                    <div className="text-sm text-gray-600">Contact Us</div>
                    <div className="text-lg font-bold">19654</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4 justify-center">
              <Button
                size="lg"
                onClick={resetForm}
                className="bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white px-8 py-6">
                New Request
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/")}
                className="px-8 py-6">
                Back to Home
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
