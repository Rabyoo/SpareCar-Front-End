import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Car, Gauge, Truck, AlertCircle } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface UsageLevel {
  id: number;
  title: string;
  titleAr: string;
  icon: JSX.Element;
  description: string;
  descriptionAr: string;
  features: string[];
  featuresAr: string[];
  kmRange: string;
  kmRangeAr: string;
  color: string;
  bgColor: string;
  borderColor: string;
  hoverColor: string;
}

const usageLevels: UsageLevel[] = [
  {
    id: 1,
    title: "Light Usage",
    titleAr: "استخدام خفيف",
    icon: <Car className="w-12 h-12" />,
    description: "Perfect for occasional drivers",
    descriptionAr: "مثالي للقيادة من حين لآخر",
    features: [
      "Drive occasionally",
      "Weekend trips & errands",
      "Short distances",
      "Park most of the time",
    ],
    featuresAr: [
      "قيادة عرضية",
      "رحلات نهاية الأسبوع",
      "مسافات قصيرة",
      "السيارة متوقفة معظم الوقت",
    ],
    kmRange: "5,000 - 10,000 km/year",
    kmRangeAr: "٥,٠٠٠ - ١٠,٠٠٠ كم/سنة",
    color: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-300",
    hoverColor: "hover:bg-green-100",
  },
  {
    id: 2,
    title: "Normal Usage",
    titleAr: "استخدام عادي",
    icon: <Gauge className="w-12 h-12" />,
    description: "For daily commuters",
    descriptionAr: "للتنقل اليومي",
    features: [
      "Daily commuting",
      "Regular city & highway driving",
      "Moderate distances",
      "Work & family trips",
    ],
    featuresAr: [
      "تنقلات يومية",
      "قيادة منتظمة في المدينة والطرق السريعة",
      "مسافات متوسطة",
      "رحلات العمل والعائلة",
    ],
    kmRange: "10,000 - 20,000 km/year",
    kmRangeAr: "١٠,٠٠٠ - ٢٠,٠٠٠ كم/سنة",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-300",
    hoverColor: "hover:bg-blue-100",
  },
  {
    id: 3,
    title: "Heavy Usage",
    titleAr: "استخدام مكثف",
    icon: <Truck className="w-12 h-12" />,
    description: "For extensive daily driving",
    descriptionAr: "للقيادة المكثفة يومياً",
    features: [
      "Drive extensively every day",
      "Long-distance trips",
      "Taxi, delivery, or rideshare",
      "On the road most of the time",
    ],
    featuresAr: [
      "قيادة مكثفة كل يوم",
      "رحلات طويلة",
      "تاكسي، توصيل، أو مشاركة رحلات",
      "على الطريق معظم الوقت",
    ],
    kmRange: "20,000+ km/year",
    kmRangeAr: "٢٠,٠٠٠+ كم/سنة",
    color: "text-orange-700",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-300",
    hoverColor: "hover:bg-orange-100",
  },
];

export default function UsageLevelSelector() {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectLevel = async () => {
    if (!selectedLevel) {
      setError("Please select a usage level");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (!token || !user._id) {
        setError("Please login first");
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_URL}/usage/set-level`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user._id,
          usageLevel: selectedLevel,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // تحديث بيانات المستخدم في localStorage
        const updatedUser = { ...user, usageLevel: selectedLevel };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // الانتقال إلى صفحة التحليل
        navigate("/maintenance-analysis");
      } else {
        setError(data.message || "Failed to save usage level");
      }
    } catch (error: any) {
      console.error("Error saving usage level:", error);
      setError("Failed to connect to server");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-gray-50 to-gray-200">
      <Card className="w-full max-w-4xl shadow-2xl">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-blue-100 rounded-full">
              <Car className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-4xl font-bold">
            Welcome to SpareCar! 🚗
          </CardTitle>
          <CardDescription className="text-lg">
            Tell us about your driving habits to get personalized maintenance
            recommendations
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {usageLevels.map((level) => (
              <button
                key={level.id}
                onClick={() => setSelectedLevel(level.id)}
                className={`
                  relative p-6 rounded-xl border-2 transition-all duration-300
                  ${level.borderColor} ${level.bgColor}
                  ${
                    selectedLevel === level.id
                      ? "ring-4 ring-blue-400 ring-opacity-50 scale-105"
                      : level.hoverColor
                  }
                  ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                `}
                disabled={isLoading}>
                {/* Selected Checkmark */}
                {selectedLevel === level.id && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle2 className="w-6 h-6 text-blue-600" />
                  </div>
                )}

                {/* Icon */}
                <div className={`flex justify-center mb-4 ${level.color}`}>
                  {level.icon}
                </div>

                {/* Title */}
                <h3
                  className={`text-xl font-bold text-center mb-2 ${level.color}`}>
                  {level.title}
                </h3>
                <p className="text-sm text-gray-600 text-center mb-4">
                  {level.description}
                </p>

                {/* KM Range */}
                <div className="mb-4 p-2 bg-white rounded-lg">
                  <p className="text-sm font-semibold text-center text-gray-700">
                    {level.kmRange}
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-2">
                  {level.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start text-sm text-gray-700">
                      <span className="mr-2 mt-0.5">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button
              onClick={handleSelectLevel}
              disabled={!selectedLevel || isLoading}
              className="flex-1 h-12 text-lg font-semibold">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                "Continue"
              )}
            </Button>
            <Button
              onClick={handleSkip}
              variant="outline"
              disabled={isLoading}
              className="flex-1 h-12 text-lg font-semibold">
              Skip for now
            </Button>
          </div>

          {/* Info Note */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 text-center">
              💡 Don't worry! You can always change this later from your profile
              settings.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
