// Profile.tsx - ENHANCED VERSION WITH MULTI-CAR SUPPORT
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { MdOutlineDashboard } from "react-icons/md";
import {
  User,
  Package,
  Mail,
  Calendar,
  Shield,
  ArrowLeft,
  Edit,
  X,
  Save,
  Phone,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Upload,
  Camera,
  Car,
  Gauge,
  Truck,
  Plus,
  Trash2,
  Star,
  Bell,
  Settings,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

//* TypeScript Interfaces */
interface CarData {
  _id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  licensePlate?: string;
  vin?: string;
  color?: string;
  engineType?: string;
  transmission?: string;
  isPrimary: boolean;
  isActive: boolean;
  usageLevel: number;
  monthlyKm: number;
  maintenanceStartDate?: string;
  maintenanceParts?: MaintenancePartData[];
  notificationPreferences?: {
    email: boolean;
    push: boolean;
    sms: boolean;
    daysBeforeAlert: number;
  };
  insurance?: {
    provider: string;
    policyNumber: string;
    expiryDate: string;
    coverage: string;
  };
  registration?: {
    expiryDate: string;
    registrationNumber: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface UserData {
  _id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  provider: string;
  phone?: string;
  createdAt: string;
  lastLogin?: string;
  usageLevel?: number;
  monthlyKm?: number;
  maintenanceStartDate?: string;
  maintenanceParts?: MaintenancePartData[];
  cars?: CarData[];
  carInfo?: {
    brand: string;
    model: string;
    year: number;
    mileage?: number;
  };
  notificationPreferences?: {
    email: boolean;
    push: boolean;
    sms: boolean;
    daysBeforeAlert: number;
  };
}

interface MaintenancePartData {
  partKey: string;
  lastReplacedDate: string;
  currentKm: number;
  replacementCount?: number;
  notes?: string;
}

interface MaintenancePart {
  key: string;
  name: string;
  nameAr: string;
  icon: string;
  baselineKm: number;
  currentKm: number;
  maxKm: number;
  monthsLeft: number;
  daysLeft: number;
  percentage: number;
  status: "excellent" | "good" | "warning" | "critical";
  priority: "high" | "medium" | "low";
  cost: string;
  lastReplaced: string;
  replacementCount: number;
  notes: string;
}

interface Order {
  _id: string;
  items: any[];
  total: number;
  status: string;
  createdAt: string;
}

export default function ProfileEnhanced() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState<CarData | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddCarModalOpen, setIsAddCarModalOpen] = useState(false);
  const [isEditCarModalOpen, setIsEditCarModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [maintenanceParts, setMaintenanceParts] = useState<MaintenancePart[]>(
    [],
  );
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const [editForm, setEditForm] = useState({
    displayName: "",
    phone: "",
    usageLevel: null as number | null,
    monthlyKm: 0,
    carBrand: "",
    carModel: "",
    carYear: new Date().getFullYear(),
    carMileage: 0,
  });

  const [newCarForm, setNewCarForm] = useState({
    name: "",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    mileage: 0,
    licensePlate: "",
    color: "",
    engineType: "",
    transmission: "",
    usageLevel: 2,
    monthlyKm: 0,
    isPrimary: false,
  });

  const [editCarForm, setEditCarForm] = useState({
    _id: "",
    name: "",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    mileage: 0,
    licensePlate: "",
    color: "",
    engineType: "",
    transmission: "",
    usageLevel: 2,
    monthlyKm: 0,
    isPrimary: false,
  });

  //* Baseline Data (Enhanced)
  const BASELINE_DATA = {
    engineOil: {
      km: 10000,
      nameAr: "زيت موتور",
      icon: "🛢️",
      cost: "$30-80",
      priority: "high",
    },
    oilFilter: {
      km: 10000,
      nameAr: "فلتر زيت",
      icon: "🔧",
      cost: "$10-30",
      priority: "high",
    },
    airFilter: {
      km: 15000,
      nameAr: "فلتر هواء",
      icon: "🌬️",
      cost: "$15-40",
      priority: "medium",
    },
    brakePads: {
      km: 30000,
      nameAr: "تيل فرامل",
      icon: "🚙",
      cost: "$80-250",
      priority: "high",
    },
    sparkPlugs: {
      km: 40000,
      nameAr: "بوجيهات",
      icon: "⚡",
      cost: "$50-150",
      priority: "medium",
    },
    tires: {
      km: 50000,
      nameAr: "كاوتش",
      icon: "🛞",
      cost: "$300-800",
      priority: "high",
    },
    transmissionOil: {
      km: 60000,
      nameAr: "زيت الفتيس",
      icon: "⚙️",
      cost: "$100-300",
      priority: "high",
    },
    battery: {
      km: 40000,
      nameAr: "بطارية",
      icon: "🔋",
      cost: "$80-200",
      priority: "high",
    },
    wiperBlades: {
      km: 12000,
      nameAr: "مساحات",
      icon: "🌧️",
      cost: "$15-40",
      priority: "low",
    },
    coolant: {
      km: 40000,
      nameAr: "مياه رادياتير",
      icon: "❄️",
      cost: "$20-60",
      priority: "medium",
    },
    brakeFluid: {
      km: 30000,
      nameAr: "زيت فرامل",
      icon: "💧",
      cost: "$20-50",
      priority: "high",
    },
    cabinFilter: {
      km: 20000,
      nameAr: "فلتر مكيف",
      icon: "🌀",
      cost: "$20-50",
      priority: "low",
    },
  };

  //* Usage Level Multipliers
  const USAGE_MULTIPLIERS = {
    1: 1.3,
    2: 1.0,
    3: 0.6,
  };

  //* Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      // Set selected car to primary car
      if (parsedUser.cars && parsedUser.cars.length > 0) {
        const primaryCar =
          parsedUser.cars.find((car: CarData) => car.isPrimary) ||
          parsedUser.cars[0];
        setSelectedCar(primaryCar);
      }
    }
    setLoading(false);
  }, []);

  //* Fetch Maintenance Schedule for selected car
  useEffect(() => {
    if (selectedCar && selectedCar.monthlyKm && selectedCar.usageLevel) {
      fetchCarMaintenance(selectedCar._id);
    }
  }, [selectedCar]);

  //* Fetch Car Maintenance
  const fetchCarMaintenance = async (carId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/user/cars/${carId}/maintenance`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();
      if (data.success) {
        setMaintenanceParts(data.schedule);
        setShowAnalysis(true);
      }
    } catch (error) {
      console.error("Error fetching maintenance:", error);
    }
  };

  //* Add New Car
  const handleAddCar = async () => {
    setIsSaving(true);
    setErrorMessage(null);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/user/cars`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCarForm),
      });

      const data = await response.json();

      if (data.success) {
        const updatedUser = { ...user, cars: data.cars };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));

        setSuccessMessage("✓ تم إضافة السيارة بنجاح!");
        setIsAddCarModalOpen(false);

        // Reset form
        setNewCarForm({
          name: "",
          brand: "",
          model: "",
          year: new Date().getFullYear(),
          mileage: 0,
          licensePlate: "",
          color: "",
          engineType: "",
          transmission: "",
          usageLevel: 2,
          monthlyKm: 0,
          isPrimary: false,
        });

        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setErrorMessage(data.message || "Failed to add car");
      }
    } catch (error: any) {
      console.error("Error adding car:", error);
      setErrorMessage("Failed to connect to server");
    } finally {
      setIsSaving(false);
    }
  };

  //* Open Edit Car Modal
  const handleOpenEditCar = (car: CarData) => {
    setEditCarForm({
      _id: car._id,
      name: car.name || "",
      brand: car.brand,
      model: car.model,
      year: car.year,
      mileage: car.mileage,
      licensePlate: car.licensePlate || "",
      color: car.color || "",
      engineType: car.engineType || "",
      transmission: car.transmission || "",
      usageLevel: car.usageLevel,
      monthlyKm: car.monthlyKm,
      isPrimary: car.isPrimary,
    });
    setIsEditCarModalOpen(true);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  //* Update Car
  const handleUpdateCar = async () => {
    setIsSaving(true);
    setErrorMessage(null);

    try {
      const token = localStorage.getItem("token");

      // First update the car details
      const response = await fetch(`${API_URL}/user/cars/${editCarForm._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editCarForm),
      });

      const data = await response.json();

      if (data.success) {
        // If isPrimary was changed to true, call set-primary endpoint
        if (editCarForm.isPrimary) {
          const primaryResponse = await fetch(
            `${API_URL}/user/cars/${editCarForm._id}/set-primary`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          const primaryData = await primaryResponse.json();

          if (primaryData.success) {
            const updatedUser = { ...user, cars: primaryData.cars };
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setSelectedCar(primaryData.primaryCar);
          }
        } else {
          // Just update normally
          const updatedUser = { ...user, cars: data.cars };
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));

          // Update selected car if it's the one being edited
          if (selectedCar?._id === editCarForm._id) {
            const updatedCar = data.cars.find(
              (c: CarData) => c._id === editCarForm._id,
            );
            if (updatedCar) setSelectedCar(updatedCar);
          }
        }

        setSuccessMessage("✓ Car updated successfully!");
        setIsEditCarModalOpen(false);

        setTimeout(() => {
          setSuccessMessage(null);
        }, 1000);
      } else {
        setErrorMessage(data.message || "Failed to update car");
      }
    } catch (error: any) {
      console.error("Error updating car:", error);
      setErrorMessage("Failed to connect to server");
    } finally {
      setIsSaving(false);
    }
  };

  //* Delete Car
  const handleDeleteCar = async (carId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه السيارة؟")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/user/cars/${carId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        const updatedUser = { ...user, cars: data.cars };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Update selected car
        if (data.primaryCar) {
          setSelectedCar(data.primaryCar);
        }

        setSuccessMessage("✓ تم حذف السيارة بنجاح!");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setErrorMessage(data.message || "Failed to delete car");
      }
    } catch (error) {
      console.error("Error deleting car:", error);
      setErrorMessage("Failed to delete car");
    }
  };

  //* Set Primary Car
  const handleSetPrimaryCar = async (carId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/user/cars/${carId}/set-primary`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (data.success) {
        const updatedUser = { ...user, cars: data.cars };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setSelectedCar(data.primaryCar);

        setSuccessMessage("✓ تم تعيين السيارة الرئيسية!");
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (error) {
      console.error("Error setting primary car:", error);
    }
  };

  //* Reset Part
  const handlePartReplacement = async (partKey: string) => {
    if (!selectedCar) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/user/cars/${selectedCar._id}/reset-part`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ partKey }),
        },
      );

      const data = await response.json();
      if (data.success) {
        // Update selected car
        const updatedCar = data.car;
        setSelectedCar(updatedCar);

        // Update user cars
        const updatedCars = user?.cars?.map((car) =>
          car._id === updatedCar._id ? updatedCar : car,
        );
        const updatedUser = { ...user, cars: updatedCars };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Refresh maintenance
        fetchCarMaintenance(selectedCar._id);

        setSuccessMessage("✓ تم تسجيل استبدال القطعة!");
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (error) {
      console.error("Error resetting part:", error);
    }
  };

  //* Get usage level info
  const getUsageLevelInfo = (level: number | undefined) => {
    if (!level) return null;

    const levels = {
      1: {
        name: "Light Usage",
        nameAr: "استخدام خفيف",
        icon: <Car className="w-5 h-5" />,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-300",
      },
      2: {
        name: "Normal Usage",
        nameAr: "استخدام عادي",
        icon: <Gauge className="w-5 h-5" />,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-300",
      },
      3: {
        name: "Heavy Usage",
        nameAr: "استخدام مكثف",
        icon: <Truck className="w-5 h-5" />,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-300",
      },
    };

    return levels[level as keyof typeof levels];
  };

  //* Get progress bar color
  const getProgressColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-500";
      case "good":
        return "bg-yellow-500";
      case "warning":
        return "bg-orange-500";
      case "critical":
        return "bg-red-500";
      default:
        return "bg-slate-500";
    }
  };

  //* Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "low":
        return "bg-green-100 text-green-700 border-green-300";
      default:
        return "bg-slate-100 text-slate-700 border-slate-300";
    }
  };

  //* Get provider name
  const getProviderName = (provider: string) => {
    switch (provider) {
      case "google":
        return "Google";
      case "facebook":
        return "Facebook";
      case "microsoft":
        return "Microsoft";
      default:
        return "Email/Password";
    }
  };

  //* Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // التحقق من نوع الملف
      if (!file.type.startsWith("image/")) {
        setErrorMessage("Please select an image file");
        return;
      }

      // التحقق من حجم الملف (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("Image size should be less than 5MB");
        return;
      }

      setImageFile(file);

      // عرض معاينة الصورة
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  //* Upload image to server
  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;

    setIsUploadingImage(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("profileImage", imageFile);

      const response = await fetch(`${API_URL}/user/upload-profile-image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      console.log("📸 Upload response:", data);

      if (data.success) {
        const fullImageUrl = data.imageUrl.startsWith("http")
          ? data.imageUrl
          : `${API_URL.replace(/\/api$/, "")}${data.imageUrl}`;

        console.log("✅ Full image URL:", fullImageUrl);
        return fullImageUrl;
      } else {
        setErrorMessage(data.message || "Failed to upload image");
        return null;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setErrorMessage("Failed to upload image");
      return null;
    } finally {
      setIsUploadingImage(false);
    }
  };

  //* Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "monthlyKm" || name === "carYear" || name === "carMileage") {
      setEditForm({
        ...editForm,
        [name]: parseInt(value) || 0,
      });
    } else {
      setEditForm({
        ...editForm,
        [name]: value,
      });
    }
  };

  //* Open edit modal
  const openEditModal = () => {
    if (!user) return;

    setEditForm({
      displayName: user.displayName || "",
      phone: user.phone || "",
      usageLevel: user.usageLevel || null,
      monthlyKm: user.monthlyKm || 0,
      carBrand: user.carInfo?.brand || "",
      carModel: user.carInfo?.model || "",
      carYear: user.carInfo?.year || new Date().getFullYear(),
      carMileage: user.carInfo?.mileage || 0,
    });

    setPreviewImage(user.photoURL || null);
    setImageFile(null);
    setIsEditModalOpen(true);
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  //* Close edit modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setErrorMessage(null);
    setPreviewImage(null);
    setImageFile(null);
  };

  //* Save Profile
  const handleSaveProfile = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const token = localStorage.getItem("token");

      // رفع الصورة أولاً (إذا كانت موجودة)
      let newPhotoURL = user?.photoURL;
      if (imageFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          newPhotoURL = uploadedUrl;
          console.log("🔄 New photo URL:", newPhotoURL);
        }
      }

      // التحقق من تغيير Car Information
      const carInfoChanged =
        editForm.carBrand !== user?.carInfo?.brand ||
        editForm.carModel !== user?.carInfo?.model ||
        editForm.carYear !== user?.carInfo?.year ||
        editForm.carMileage !== user?.carInfo?.mileage ||
        editForm.monthlyKm !== user?.monthlyKm;

      // تنظيف البيانات قبل الإرسال
      const updateData = {
        displayName: String(editForm.displayName || "").trim(),
        phone: String(editForm.phone || "").trim(),
        usageLevel: Number(editForm.usageLevel) || null,
        monthlyKm: Number(editForm.monthlyKm) || 0,
        photoURL: newPhotoURL || "",
        carBrand: String(editForm.carBrand || "").trim(),
        carModel: String(editForm.carModel || "").trim(),
        carYear: Number(editForm.carYear) || new Date().getFullYear(),
        carMileage: Number(editForm.carMileage) || 0,
        resetMaintenance: carInfoChanged ? true : false,
        maintenanceStartDate: carInfoChanged
          ? new Date().toISOString()
          : user?.maintenanceStartDate,
      };

      // إضافة maintenanceStartDate إذا كان أول مرة
      if (editForm.monthlyKm > 0 && !user?.maintenanceStartDate) {
        updateData.maintenanceStartDate = new Date().toISOString();
      }

      console.log("🚗 Car info changed:", carInfoChanged);
      console.log("📅 New maintenance date:", updateData.maintenanceStartDate);

      const response = await fetch(`${API_URL}/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (data.success) {
        const updatedUser = {
          ...user,
          ...data.user,
          photoURL: newPhotoURL,
          maintenanceStartDate:
            updateData.maintenanceStartDate || data.user?.maintenanceStartDate,
          maintenanceParts: carInfoChanged
            ? []
            : data.user?.maintenanceParts || user?.maintenanceParts,
        };

        console.log("👤 Updated user with car info:", updatedUser.carInfo);
        console.log(
          "📊 Maintenance start date:",
          updatedUser.maintenanceStartDate,
        );

        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setSuccessMessage("✓ Profile updated successfully!");

        setTimeout(() => {
          setIsEditModalOpen(false);
          setSuccessMessage(null);
          window.location.reload();
        }, 1500);
      } else {
        setErrorMessage(data.message || "Failed to update profile");
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setErrorMessage("Failed to connect to server");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-3 border-slate-300 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-3 font-medium transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
              <p className="text-slate-600 mt-1 text-sm">
                Manage your account, cars and maintenance schedule
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate("/dashboard")}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium text-sm">
                <MdOutlineDashboard className="w-4 h-4" />
                Dashboard
              </button>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium text-sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-lg font-medium text-sm">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg font-medium text-sm">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Profile & Cars */}
          <div className="lg:col-span-1 space-y-4">
            {/* Profile Card */}
            <Card className="overflow-hidden shadow-sm border-slate-200">
              <CardHeader className="bg-gradient-to-br from-slate-900 to-slate-700 text-white p-4">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-3 overflow-hidden">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName}
                        className="w-full h-full rounded-full object-cover border-4 shadow-2xl shadow-blue-500/20 transition-all duration-300 border-orange-600"
                        crossOrigin="anonymous"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          console.error(
                            "❌ Failed to load image:",
                            user.photoURL,
                          );
                          const target = e.currentTarget;
                          target.style.display = "none";
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="w-full h-full rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 border-4 border-white/30 shadow-2xl shadow-blue-500/20 flex items-center justify-center relative overflow-hidden group">
                                <div class="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-transparent"></div>
                                <div class="relative z-10">
                                  <svg class="w-12 h-12 text-white/80 group-hover:scale-110 transition-transform duration-300" 
                                       fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" 
                                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" 
                                          clip-rule="evenodd"/>
                                  </svg>
                                  <div class="absolute -inset-2 rounded-full border-2 border-white/20 animate-pulse"></div>
                                </div>
                                <div class="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-400/20 rounded-full blur-md"></div>
                                <div class="absolute -top-2 -left-2 w-8 h-8 bg-purple-400/20 rounded-full blur-md"></div>
                              </div>
                            `;
                          }
                        }}
                        onLoad={() => {
                          console.log("✅ Image loaded successfully");
                          const img = document.querySelector(
                            `img[src="${user.photoURL}"]`,
                          );
                          if (img) {
                            img.classList.add("animate-fadeIn");
                          }
                        }}
                      />
                    ) : (
                      <User className="w-10 h-10 text-white" />
                    )}
                  </div>
                  <h2 className="text-lg font-bold">{user.displayName}</h2>
                  <p className="text-white/80 text-xs mt-1">{user.email}</p>
                </div>
              </CardHeader>

              <CardContent className="p-4 space-y-3">
                <InfoItem
                  icon={<Mail className="w-4 h-4 text-slate-500" />}
                  label="Email"
                  value={user.email}
                />
                <Separator className="bg-slate-200" />
                <InfoItem
                  icon={<Phone className="w-4 h-4 text-slate-500" />}
                  label="Phone"
                  value={user.phone || "Not provided"}
                />
                <Separator className="bg-slate-200" />
                <InfoItem
                  icon={<Shield className="w-4 h-4 text-slate-500" />}
                  label="Provider"
                  value={getProviderName(user.provider)}
                />
                <Separator className="bg-slate-200" />
                <InfoItem
                  icon={<Calendar className="w-4 h-4 text-slate-500" />}
                  label="Member Since"
                  value={new Date(user.createdAt).toLocaleDateString()}
                />
              </CardContent>
            </Card>

            {/* Cars List */}
            <Card className="shadow-sm border-2 border-slate-200">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Car className="w-4 h-4 text-slate-700" />
                    My Cars ({user.cars?.length || 0})
                  </CardTitle>
                  <button
                    onClick={() => setIsAddCarModalOpen(true)}
                    className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="pb-4 space-y-2">
                {user.cars && user.cars.length > 0 ? (
                  user.cars.map((car) => (
                    <div
                      key={car._id}
                      className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                        selectedCar?._id === car._id
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                      onClick={() => setSelectedCar(car)}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-sm text-slate-900">
                              {car.brand} {car.model}
                            </p>
                            {car.isPrimary && (
                              <Badge className="bg-blue-100 text-blue-700 text-xs">
                                <Star className="w-3 h-3 mr-1 fill-current" />
                                Primary
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-slate-600">
                            {car.year} • {car.mileage?.toLocaleString()} km
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditCar(car);
                            }}
                            className="text-blue-600 hover:text-blue-700 p-1">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCar(car._id);
                            }}
                            className="text-red-600 hover:text-red-700 p-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-slate-500">
                    <Car className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm">No cars added yet</p>
                    <button
                      onClick={() => setIsAddCarModalOpen(true)}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Add your first car
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Maintenance Analysis */}
          <div className="lg:col-span-2 space-y-4">
            {/* Maintenance Analysis Card */}
            <Card className="shadow-sm border-2 border-slate-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-slate-700" />
                      Live Maintenance Schedule
                    </CardTitle>
                    {selectedCar && (
                      <p className="text-xs text-slate-600 mt-1">
                        {selectedCar.brand} {selectedCar.model} (
                        {selectedCar.year})
                      </p>
                    )}
                  </div>
                  {selectedCar && (
                    <Badge className="bg-slate-900 text-white">
                      {maintenanceParts.length} Parts
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {showAnalysis && maintenanceParts.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {maintenanceParts.map((part, index) => (
                      <Card
                        key={index}
                        className={`border-2 hover:shadow-md transition-shadow ${
                          part.status === "critical"
                            ? "border-red-300 bg-red-50/50"
                            : ""
                        }`}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <span className="text-3xl">{part.icon}</span>
                            <div className="flex-1 min-w-0">
                              {/* Part Header */}
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-bold text-slate-900 text-base truncate">
                                    {part.name}
                                  </h4>
                                  <p className="text-xs text-slate-600">
                                    {part.nameAr}
                                  </p>
                                </div>
                                <div className="ml-2 flex flex-col gap-1">
                                  {part.status === "excellent" && (
                                    <Badge className="bg-green-100 text-green-700 border-green-300 text-xs">
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      Good
                                    </Badge>
                                  )}
                                  {part.status === "good" && (
                                    <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300 text-xs">
                                      OK
                                    </Badge>
                                  )}
                                  {part.status === "warning" && (
                                    <Badge className="bg-orange-100 text-orange-700 border-orange-300 text-xs">
                                      <Bell className="w-3 h-3 mr-1" />
                                      Soon
                                    </Badge>
                                  )}
                                  {part.status === "critical" && (
                                    <Badge className="bg-red-100 text-red-700 border-red-300 text-xs">
                                      <AlertTriangle className="w-3 h-3 mr-1" />
                                      Now!
                                    </Badge>
                                  )}
                                  <Badge
                                    className={`text-xs ${getPriorityColor(part.priority)}`}>
                                    {part.priority}
                                  </Badge>
                                </div>
                              </div>

                              {/* Progress Bar */}
                              <div className="mb-2">
                                <Progress
                                  value={part.percentage}
                                  className="h-2"
                                  indicatorClassName={getProgressColor(
                                    part.status,
                                  )}
                                />
                                <div className="flex justify-between text-xs text-slate-600 mt-1">
                                  <span>
                                    {part.currentKm.toLocaleString()} km
                                  </span>
                                  <span>{part.percentage}%</span>
                                  <span>{part.maxKm.toLocaleString()} km</span>
                                </div>
                              </div>

                              {/* Part Details */}
                              <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                                <div className="bg-slate-50 p-1.5 rounded text-center">
                                  <p className="text-slate-600">Time</p>
                                  <p className="font-bold text-slate-900">
                                    {part.daysLeft < 30
                                      ? `${part.daysLeft}D`
                                      : `${Math.floor(part.daysLeft / 30)}M`}
                                  </p>
                                </div>
                                <div className="bg-slate-50 p-1.5 rounded text-center">
                                  <p className="text-slate-600">Cost</p>
                                  <p className="font-bold text-slate-900 text-xs">
                                    {part.cost.split("-")[0]}
                                  </p>
                                </div>
                                <div className="bg-slate-50 p-1.5 rounded text-center">
                                  <p className="text-slate-600">Changed</p>
                                  <p className="font-bold text-slate-900">
                                    {part.replacementCount}x
                                  </p>
                                </div>
                              </div>

                              {/* Replace Button */}
                              {part.percentage >= 80 && (
                                <Button
                                  onClick={() =>
                                    handlePartReplacement(part.key)
                                  }
                                  size="sm"
                                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs h-8">
                                  Mark as Replaced
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
                    <BarChart3 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 font-medium">
                      {!selectedCar
                        ? "Please select a car to view maintenance schedule"
                        : !selectedCar.monthlyKm || !selectedCar.usageLevel
                          ? "Please set monthly kilometers and usage level for this car"
                          : "Loading maintenance data..."}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 rounded-t-xl flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <Edit className="w-5 h-5" />
                <h2 className="text-xl font-semibold">Edit Profile</h2>
              </div>
              <button
                onClick={closeEditModal}
                className="hover:bg-slate-800 p-2 rounded transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Success/Error Messages */}
              {successMessage && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-lg text-sm font-medium">
                  {successMessage}
                </div>
              )}

              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg text-sm font-medium">
                  {errorMessage}
                </div>
              )}

              {/* Profile Picture */}
              <div>
                <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Profile Picture
                </h3>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="cursor-pointer">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-medium">
                        <Upload className="w-4 h-4" />
                        Choose Image
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-slate-500 mt-2">
                      JPG, PNG or GIF. Max size 5MB.
                    </p>
                  </div>
                </div>
              </div>

              <Separator className="bg-slate-200" />

              {/* Basic Information */}
              <div>
                <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Basic Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Full Name
                    </Label>
                    <Input
                      type="text"
                      name="displayName"
                      value={editForm.displayName}
                      onChange={handleInputChange}
                      className="w-full"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <Label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Phone Number
                    </Label>
                    <Input
                      type="tel"
                      name="phone"
                      value={editForm.phone}
                      onChange={handleInputChange}
                      className="w-full"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <Label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Monthly Kilometers
                    </Label>
                    <Input
                      type="number"
                      name="monthlyKm"
                      value={editForm.monthlyKm}
                      onChange={handleInputChange}
                      className="w-full"
                      placeholder="e.g., 2000"
                      min="0"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      💡 Average kilometers you drive per month
                    </p>
                  </div>
                </div>
              </div>

              <Separator className="bg-slate-200" />

              {/* Car Information */}
              <div>
                <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Car className="w-4 h-4" />
                  Car Information
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Car Brand
                      </Label>
                      <Input
                        type="text"
                        name="carBrand"
                        value={editForm.carBrand}
                        onChange={handleInputChange}
                        className="w-full"
                        placeholder="e.g., Toyota"
                      />
                    </div>
                    <div>
                      <Label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Model
                      </Label>
                      <Input
                        type="text"
                        name="carModel"
                        value={editForm.carModel}
                        onChange={handleInputChange}
                        className="w-full"
                        placeholder="e.g., Camry"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Year
                      </Label>
                      <Input
                        type="number"
                        name="carYear"
                        value={editForm.carYear}
                        onChange={handleInputChange}
                        className="w-full"
                        placeholder="e.g., 2020"
                        min="1900"
                        max={new Date().getFullYear() + 1}
                      />
                    </div>
                    <div>
                      <Label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Current Mileage (KM)
                      </Label>
                      <Input
                        type="number"
                        name="carMileage"
                        value={editForm.carMileage}
                        onChange={handleInputChange}
                        className="w-full"
                        placeholder="e.g., 50000"
                        min="0"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">
                    🚗 This info will be used when requesting services
                  </p>
                </div>
              </div>

              <Separator className="bg-slate-200" />

              {/* Usage Level */}
              <div>
                <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Usage Level
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3].map((level) => {
                    const info = getUsageLevelInfo(level);
                    if (!info) return null;

                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() =>
                          setEditForm({ ...editForm, usageLevel: level })
                        }
                        className={`p-3 rounded-lg border-2 transition-all ${
                          editForm.usageLevel === level
                            ? `${info.borderColor} ${info.bgColor} ring-2 ring-offset-2`
                            : "border-slate-200 hover:border-slate-300"
                        }`}>
                        <div
                          className={`flex justify-center mb-2 ${info.color}`}>
                          {info.icon}
                        </div>
                        <p className={`text-xs font-bold ${info.color}`}>
                          Level {level}
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          {info.nameAr}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 p-5 rounded-b-xl flex gap-3 sticky bottom-0 border-t border-slate-200">
              <button
                onClick={closeEditModal}
                disabled={isSaving || isUploadingImage}
                className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors font-medium disabled:opacity-50">
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={isSaving || isUploadingImage}
                className="flex-1 px-4 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50">
                {isSaving || isUploadingImage ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>
                      {isUploadingImage ? "Uploading..." : "Saving..."}
                    </span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Car Modal */}
      {isAddCarModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-slate-900 text-white p-5 rounded-t-xl flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <Car className="w-5 h-5" />
                <h2 className="text-xl font-semibold">Add New Car</h2>
              </div>
              <button
                onClick={() => setIsAddCarModalOpen(false)}
                className="hover:bg-slate-800 p-2 rounded transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Car Basic Info */}
              <div>
                <h3 className="text-base font-semibold text-slate-900 mb-4">
                  Car Information
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Brand *</Label>
                      <Input
                        value={newCarForm.brand}
                        onChange={(e) =>
                          setNewCarForm({
                            ...newCarForm,
                            brand: e.target.value,
                          })
                        }
                        placeholder="e.g., Toyota"
                      />
                    </div>
                    <div>
                      <Label>Model *</Label>
                      <Input
                        value={newCarForm.model}
                        onChange={(e) =>
                          setNewCarForm({
                            ...newCarForm,
                            model: e.target.value,
                          })
                        }
                        placeholder="e.g., Camry"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Year *</Label>
                      <Input
                        type="number"
                        value={newCarForm.year}
                        onChange={(e) =>
                          setNewCarForm({
                            ...newCarForm,
                            year: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>Mileage (KM)</Label>
                      <Input
                        type="number"
                        value={newCarForm.mileage}
                        onChange={(e) =>
                          setNewCarForm({
                            ...newCarForm,
                            mileage: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>License Plate</Label>
                      <Input
                        value={newCarForm.licensePlate}
                        onChange={(e) =>
                          setNewCarForm({
                            ...newCarForm,
                            licensePlate: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Monthly Kilometers *</Label>
                    <Input
                      type="number"
                      value={newCarForm.monthlyKm}
                      onChange={(e) =>
                        setNewCarForm({
                          ...newCarForm,
                          monthlyKm: parseInt(e.target.value),
                        })
                      }
                      placeholder="e.g., 2000"
                    />
                  </div>

                  <div>
                    <Label>Usage Level *</Label>
                    <div className="grid grid-cols-3 gap-3 mt-2">
                      {[1, 2, 3].map((level) => {
                        const info = getUsageLevelInfo(level);
                        if (!info) return null;

                        return (
                          <button
                            key={level}
                            type="button"
                            onClick={() =>
                              setNewCarForm({
                                ...newCarForm,
                                usageLevel: level,
                              })
                            }
                            className={`p-3 rounded-lg border-2 transition-all ${
                              newCarForm.usageLevel === level
                                ? `${info.borderColor} ${info.bgColor}`
                                : "border-slate-200 hover:border-slate-300"
                            }`}>
                            <div
                              className={`flex justify-center mb-2 ${info.color}`}>
                              {info.icon}
                            </div>
                            <p className={`text-xs font-bold ${info.color}`}>
                              Level {level}
                            </p>
                            <p className="text-xs text-slate-600 mt-1">
                              {info.nameAr}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Set as Primary Car Checkbox */}
                  <div className="flex items-center gap-3 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                    <input
                      type="checkbox"
                      id="isPrimary"
                      checked={newCarForm.isPrimary}
                      onChange={(e) =>
                        setNewCarForm({
                          ...newCarForm,
                          isPrimary: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-blue-600 border-2 border-blue-400 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    />
                    <label
                      htmlFor="isPrimary"
                      className="flex items-center gap-2 cursor-pointer flex-1">
                      <Star className="w-5 h-5 text-blue-600 fill-blue-600" />
                      <div>
                        <p className="font-semibold text-slate-900">
                          Set as Primary Car
                        </p>
                        <p className="text-xs text-slate-600">
                          This car will be selected by default
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-b-xl flex gap-3 sticky bottom-0 border-t border-slate-200">
              <button
                onClick={() => setIsAddCarModalOpen(false)}
                disabled={isSaving}
                className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors font-medium disabled:opacity-50">
                Cancel
              </button>
              <button
                onClick={handleAddCar}
                disabled={isSaving || !newCarForm.brand || !newCarForm.model}
                className="flex-1 px-4 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50">
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Add Car</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Car Modal */}
      {isEditCarModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-slate-900 text-white p-5 rounded-t-xl flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <Edit className="w-5 h-5" />
                <h2 className="text-xl font-semibold">Edit Car</h2>
              </div>
              <button
                onClick={() => setIsEditCarModalOpen(false)}
                className="hover:bg-slate-800 p-2 rounded transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg text-sm font-medium">
                  {errorMessage}
                </div>
              )}

              {/* Car Basic Info */}
              <div>
                <h3 className="text-base font-semibold text-slate-900 mb-4">
                  Car Information
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Brand *</Label>
                      <Input
                        value={editCarForm.brand}
                        onChange={(e) =>
                          setEditCarForm({
                            ...editCarForm,
                            brand: e.target.value,
                          })
                        }
                        placeholder="e.g., Toyota"
                      />
                    </div>
                    <div>
                      <Label>Model *</Label>
                      <Input
                        value={editCarForm.model}
                        onChange={(e) =>
                          setEditCarForm({
                            ...editCarForm,
                            model: e.target.value,
                          })
                        }
                        placeholder="e.g., Camry"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Year *</Label>
                      <Input
                        type="number"
                        value={editCarForm.year}
                        onChange={(e) =>
                          setEditCarForm({
                            ...editCarForm,
                            year: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>Mileage (KM)</Label>
                      <Input
                        type="number"
                        value={editCarForm.mileage}
                        onChange={(e) =>
                          setEditCarForm({
                            ...editCarForm,
                            mileage: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>License Plate</Label>
                      <Input
                        value={editCarForm.licensePlate}
                        onChange={(e) =>
                          setEditCarForm({
                            ...editCarForm,
                            licensePlate: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Monthly Kilometers *</Label>
                    <Input
                      type="number"
                      value={editCarForm.monthlyKm}
                      onChange={(e) =>
                        setEditCarForm({
                          ...editCarForm,
                          monthlyKm: parseInt(e.target.value),
                        })
                      }
                      placeholder="e.g., 2000"
                    />
                  </div>

                  <div>
                    <Label>Usage Level *</Label>
                    <div className="grid grid-cols-3 gap-3 mt-2">
                      {[1, 2, 3].map((level) => {
                        const info = getUsageLevelInfo(level);
                        if (!info) return null;

                        return (
                          <button
                            key={level}
                            type="button"
                            onClick={() =>
                              setEditCarForm({
                                ...editCarForm,
                                usageLevel: level,
                              })
                            }
                            className={`p-3 rounded-lg border-2 transition-all ${
                              editCarForm.usageLevel === level
                                ? `${info.borderColor} ${info.bgColor}`
                                : "border-slate-200 hover:border-slate-300"
                            }`}>
                            <div
                              className={`flex justify-center mb-2 ${info.color}`}>
                              {info.icon}
                            </div>
                            <p className={`text-xs font-bold ${info.color}`}>
                              Level {level}
                            </p>
                            <p className="text-xs text-slate-600 mt-1">
                              {info.nameAr}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Set as Primary Car Checkbox */}
                  <div className="flex items-center gap-3 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                    <input
                      type="checkbox"
                      id="isPrimaryEdit"
                      checked={editCarForm.isPrimary}
                      onChange={(e) =>
                        setEditCarForm({
                          ...editCarForm,
                          isPrimary: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-blue-600 border-2 border-blue-400 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    />
                    <label
                      htmlFor="isPrimaryEdit"
                      className="flex items-center gap-2 cursor-pointer flex-1">
                      <Star className="w-5 h-5 text-blue-600 fill-blue-600" />
                      <div>
                        <p className="font-semibold text-slate-900">
                          Set as Primary Car
                        </p>
                        <p className="text-xs text-slate-600">
                          This car will be selected by default
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-b-xl flex gap-3 sticky bottom-0 border-t border-slate-200">
              <button
                onClick={() => setIsEditCarModalOpen(false)}
                disabled={isSaving}
                className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors font-medium disabled:opacity-50">
                Cancel
              </button>
              <button
                onClick={handleUpdateCar}
                disabled={isSaving || !editCarForm.brand || !editCarForm.model}
                className="flex-1 px-4 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50">
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Update Car</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Component
function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <div className="flex-1">
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
          {label}
        </p>
        <p className="text-sm text-slate-900 font-medium mt-0.5 break-words">
          {value}
        </p>
      </div>
    </div>
  );
}
