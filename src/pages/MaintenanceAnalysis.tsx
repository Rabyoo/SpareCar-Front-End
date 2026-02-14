import { useState, useEffect } from "react";
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
import {
  Calendar,
  DollarSign,
  Settings,
  Download,
  ShoppingCart,
  AlertCircle,
  Home,
  Bell,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface MaintenanceItem {
  part: string;
  partAr: string;
  icon: string;
  intervalKm: number | null;
  intervalMonths: number | null;
  nextServiceDate: string;
  cost: string;
  priority: "critical" | "high" | "medium" | "low";
}

interface MaintenanceSchedule {
  usageLevel: number;
  schedule: MaintenanceItem[];
  estimatedAnnualCost: string;
}

const priorityColors = {
  critical: "bg-red-50 border-red-300 text-red-900",
  high: "bg-orange-50 border-orange-300 text-orange-900",
  medium: "bg-yellow-50 border-yellow-300 text-yellow-900",
  low: "bg-green-50 border-green-300 text-green-900",
};

const priorityBadges = {
  critical: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-yellow-500",
  low: "bg-green-500",
};

const usageLevelNames = {
  1: { name: "Light Usage", nameAr: "استخدام خفيف", color: "text-green-600" },
  2: { name: "Normal Usage", nameAr: "استخدام عادي", color: "text-blue-600" },
  3: { name: "Heavy Usage", nameAr: "استخدام مكثف", color: "text-orange-600" },
};

export default function MaintenanceAnalysis() {
  const navigate = useNavigate();
  const [maintenanceData, setMaintenanceData] =
    useState<MaintenanceSchedule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMaintenanceSchedule();
  }, []);

  const fetchMaintenanceSchedule = async () => {
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

      // Check if user has usage level
      if (!user.usageLevel) {
        navigate("/usage-level-selector");
        return;
      }

      const response = await fetch(
        `${API_URL}/maintenance/schedule/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (data.success) {
        setMaintenanceData(data);
      } else {
        setError(data.message || "Failed to load maintenance schedule");
      }
    } catch (error: any) {
      console.error("Error fetching maintenance schedule:", error);
      setError("Failed to connect to server");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleChangeLevel = () => {
    navigate("/usage-level-selector");
  };

  const handleDownloadPDF = () => {
    alert("PDF download feature coming soon!");
  };

  const handleShop = () => {
    navigate("/products");
  };

  const handleGoHome = () => {
    navigate("/home");
  };

  const handleSetReminder = (part: string) => {
    alert(`Reminder set for ${part}! (Feature coming soon)`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">
            Loading your maintenance schedule...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
            <div className="mt-4 flex gap-3">
              <Button onClick={fetchMaintenanceSchedule} className="flex-1">
                Retry
              </Button>
              <Button
                onClick={() => navigate("/home")}
                variant="outline"
                className="flex-1">
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!maintenanceData) {
    return null;
  }

  const usageInfo =
    usageLevelNames[maintenanceData.usageLevel as keyof typeof usageLevelNames];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle className="text-3xl font-bold mb-2">
                  🔧 Your Car Maintenance Schedule
                </CardTitle>
                <CardDescription className="text-lg">
                  Based on:{" "}
                  <span className={`font-semibold ${usageInfo.color}`}>
                    Level {maintenanceData.usageLevel} - {usageInfo.name}
                  </span>
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleChangeLevel}
                  variant="outline"
                  className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Change Level
                </Button>
                <Button
                  onClick={handleGoHome}
                  variant="outline"
                  className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Home
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Services</p>
                  <p className="text-2xl font-bold">
                    {maintenanceData.schedule.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-full">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Est. Annual Cost</p>
                  <p className="text-2xl font-bold">
                    ${maintenanceData.estimatedAnnualCost}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 rounded-full">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Next Service</p>
                  <p className="text-xl font-bold">
                    {formatDate(maintenanceData.schedule[0].nextServiceDate)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Maintenance Timeline */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              📅 Maintenance Timeline
            </CardTitle>
            <CardDescription>
              Recommended service schedule for your vehicle
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {maintenanceData.schedule.map((item, index) => (
                <div
                  key={index}
                  className={`p-5 rounded-xl border-2 transition-all hover:shadow-md ${
                    priorityColors[item.priority]
                  }`}>
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="flex-1">
                      {/* Part Name with Icon */}
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">{item.icon}</span>
                        <div>
                          <h3 className="text-xl font-bold">{item.part}</h3>
                          <span
                            className={`inline-block px-2 py-1 text-xs font-semibold text-white rounded-full ${
                              priorityBadges[item.priority]
                            }`}>
                            {item.priority.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Interval Info */}
                      <div className="ml-12 space-y-1">
                        {item.intervalKm && (
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold">Distance:</span>{" "}
                            Every {item.intervalKm.toLocaleString()} km
                          </p>
                        )}
                        {item.intervalMonths && (
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold">Time:</span> Every{" "}
                            {item.intervalMonths} months
                          </p>
                        )}
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold">Next Service:</span>{" "}
                          <span className="font-bold text-blue-600">
                            {formatDate(item.nextServiceDate)}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Cost */}
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Est. Cost</p>
                      <p className="text-xl font-bold text-green-600">
                        ${item.cost}
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="ml-12 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs flex items-center gap-2"
                      onClick={() => handleSetReminder(item.part)}>
                      <Bell className="w-3 h-3" />
                      Set Reminder
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleDownloadPDF}
            className="flex-1 h-12 text-lg font-semibold flex items-center justify-center gap-2"
            variant="outline">
            <Download className="w-5 h-5" />
            Download PDF
          </Button>
          <Button
            onClick={handleShop}
            className="flex-1 h-12 text-lg font-semibold flex items-center justify-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Shop Spare Parts
          </Button>
        </div>

        {/* Info Note */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <p className="text-sm text-blue-800 text-center">
              💡 <strong>Tip:</strong> Regular maintenance extends your car's
              life and prevents costly repairs. Keep track of your service dates
              and consider setting reminders!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
