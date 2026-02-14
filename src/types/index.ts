// src/types/index.ts - ENHANCED VERSION

export interface Station {
  id: string;
  name: string;
  area: string;
  latitude: number;
  longitude: number;
  phone: string;
}

export interface User {
  id: string;
  _id: string;
  email: string;
  displayName: string;
  name: string;
  role: "customer" | "vendor" | "admin";
  token?: string;
  photoURL?: string;
  phone?: string;
  provider: string;
  usageLevel?: number;
  monthlyKm?: number;
  maintenanceStartDate?: string;
  maintenanceParts?: MaintenancePartData[];
  cars?: CarData[];
  carInfo?: CarInfo;
  notificationPreferences?: NotificationPreferences;
  createdAt: string;
  lastLogin?: string;
}

export interface CarData {
  _id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  licensePlate?: string;
  vin?: string;
  color?: string;
  engineType?: "petrol" | "diesel" | "hybrid" | "electric" | "";
  transmission?: "manual" | "automatic" | "";
  isPrimary: boolean;
  isActive: boolean;
  usageLevel: number;
  monthlyKm: number;
  maintenanceStartDate?: string;
  maintenanceParts?: MaintenancePartData[];
  notificationPreferences?: NotificationPreferences;
  insurance?: CarInsurance;
  registration?: CarRegistration;
  lastServiceDate?: string;
  nextServiceDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CarInsurance {
  provider: string;
  policyNumber: string;
  expiryDate: string;
  coverage: string;
}

export interface CarRegistration {
  expiryDate: string;
  registrationNumber: string;
}

export interface MaintenancePartData {
  partKey: string;
  lastReplacedDate: string;
  currentKm: number;
  replacementCount?: number;
  notes?: string;
}

export interface MaintenancePart {
  key: string;
  name: string;
  nameAr: string;
  icon: string;
  baselineKm: number;
  currentKm: number;
  maxKm: number;
  remainingKm: number;
  monthsLeft: number;
  daysLeft: number;
  percentage: number;
  status: "excellent" | "good" | "warning" | "critical";
  priority: "high" | "medium" | "low";
  cost: string;
  lastReplaced: string;
  replacementCount: number;
  notes: string;
  needsReplacement: boolean;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  daysBeforeAlert: number;
}

export interface CarInfo {
  brand: string;
  model: string;
  year: number;
  mileage?: number;
}

export interface MaintenanceAlert {
  carId: string;
  carName: string;
  part: MaintenancePart;
  alertType: "critical" | "warning" | "reminder";
  daysUntilDue: number;
  kmUntilDue: number;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
}

export interface ServiceRequest {
  name: string;
  phone: string;
  carType: string;
  issue: string;
  userLocation: UserLocation;
  stationId: string;
  carId?: string; // 🆕 Optional car selection
}

export interface StationWithDistance extends Station {
  distance: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  inStock: boolean;
  brand: string;
  model?: string;
  year: number;
  condition?: string;
  color?: string;
}

//* Product Types from API *//
export interface ApiProduct {
  _id: string;
  name: string;
  arabicName?: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  carBrand: string;
  carModel: string;
  year: string;
  partNumber: string;
  stock: number;
  images: string[];
  rating: number;
  reviews: number;
  discount?: number;
  isFeatured?: boolean;
  specifications?: Record<string, any>;
  compatibility?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem extends ApiProduct {
  quantity: number;
}

export interface ApiResponse {
  success: boolean;
  products: ApiProduct[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface AssistanceRequest {
  id: string;
  stationId: string;
  userId: string;
  carId?: string; // 🆕 Optional car selection
  location: UserLocation;
  serviceType: string;
  description: string;
  status: "pending" | "accepted" | "on_the_way" | "completed" | "cancelled";
  createdAt: Date;
}

// 🆕 Maintenance Statistics
export interface MaintenanceStatistics {
  totalParts: number;
  excellentParts: number;
  goodParts: number;
  warningParts: number;
  criticalParts: number;
  averageHealth: number;
  nextMaintenanceDate: string | null;
  estimatedMonthlyCost: number;
}

// 🆕 Car Performance Tracking
export interface CarPerformance {
  carId: string;
  monthlyKmAverage: number;
  maintenanceFrequency: number;
  totalMaintenanceCost: number;
  partsReplacedCount: number;
  healthScore: number; // 0-100
  efficiencyRating: "excellent" | "good" | "average" | "poor";
}
