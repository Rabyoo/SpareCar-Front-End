import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Wrench,
  Gauge,
  Settings,
  Battery,
  Wind,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Loader2,
  ChevronRight,
  Check,
  Car,
  Fuel,
  Star,
  PhoneCall,
  MessageCircle,
  AlertCircle,
  Navigation,
  Shield,
  Users,
  Award,
  Zap,
  Thermometer,
  Filter,
  Search,
  X,
  Truck,
  ArrowLeft,
  Maximize2,
  Map,
  AlertTriangle,
  FileText,
  HelpCircle,
  Meh,
  Plus,
  Briefcase as BriefcaseIcon,
  Gift as GiftIcon,
  Lock as LockIcon,
  Radio as RadioIcon,
  Square as SquareIcon,
  Wind as WindIcon,
  Droplets as DropletsIcon,
  Compass as CompassIcon,
  Speaker as SpeakerIcon,
  Cloud as CloudIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  Linkedin as LinkedinIcon,
  Youtube as YoutubeIcon,
  Github as GithubIcon,
  HelpCircle as HelpCircleIcon,
  AlertCircle as AlertCircleIcon,
  AlertTriangle as AlertTriangleIcon,
  Flame as FlameIcon,
  Sparkles as SparklesIcon,
  Gift as GiftIcon2,
  FileText as FileTextIcon,
  Paperclip as PaperclipIcon,
  Link as LinkIcon,
  QrCode as QrCodeIcon,
  MapPin as MapPinIcon,
  MapPinned as MapPinnedIcon,
  LocateFixed as LocateFixedIcon,
  LocateOff as LocateOffIcon,
  Navigation2 as Navigation2Icon,
  Compass as CompassIcon2,
  Ship as ShipIcon,
  Truck as TruckIcon,
  Car as CarIcon,
  Bike as BikeIcon,
  Bus as BusIcon,
  Train as TrainIcon,
  CableCar as CableCarIcon,
  Anchor as AnchorIcon,
  Airplay as AirplayIcon,
  Fan as FanIcon,
  Wind as WindIcon2,
  Thermometer as ThermometerIcon,
  Droplets as DropletsIcon2,
  Droplet as DropletIcon,
  Waves as WavesIcon,
  Zap as ZapIcon,
  Home as HomeIcon,
  Tractor as TractorIcon,
  Combine as CombineIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// ==================== ADVANCED TYPES - COMPREHENSIVE EMERGENCY SYSTEM ====================

/**
 * CAR PROBLEM CATEGORIES - The AI that understands what you need
 * This is the core intelligence of Lite Maintenance - we don't ask "what's wrong?"
 * We analyze symptoms and suggest the RIGHT specialist
 */
interface CarProblemCategory {
  id: string;
  name: string;
  description: string;
  symptoms: string[];
  possibleSpecialties: SpecialistType[];
  urgencyLevel: "normal" | "urgent" | "emergency";
  estimatedRepairTime: string;
  commonSolutions: string[];
  icon: any;
  color: string;
  bgColor: string;
}

/**
 * SPECIALIST TYPES - Not just mechanics and electricians
 * We have 8+ specialist categories for precise matching
 */
type SpecialistType =
  | "mechanic" // Engine, transmission, mechanical issues
  | "electrician" // Battery, alternator, wiring, electronics
  | "tire_specialist" // Punctures, balancing, rotation
  | "ac_specialist" // Air conditioning, cooling
  | "fuel_specialist" // Fuel delivery, pumps, injectors
  | "battery_specialist" // Jump start, replacement, testing
  | "diagnostic_specialist" // Computer diagnostics, sensors
  | "general" // Everything else
  | "tow_truck"; // When nothing else works

/**
 * SERVICE PROVIDER - Enhanced for emergency response
 */
interface ServiceProvider {
  id: string;
  name: string;
  type: "mobile" | "station" | "tow";
  specialistType: SpecialistType[];
  primarySpecialty: SpecialistType;
  rating: number;
  reviews: number;
  distance: number;
  estimatedArrival: string;
  estimatedArrivalMinutes: number;
  avatar: string;
  phone: string;
  email?: string;
  address?: string;
  specialties: string[];
  priceRange: "budget" | "medium" | "premium";
  availability: "available" | "busy" | "offline" | "emergency_only";
  completedJobs: number;
  yearsExperience: number;
  certifications: string[];
  workingHours: string;
  responseTime: string;
  emergencyResponse: boolean; // Can respond to emergencies immediately
  emergencyMultiplier: number; // Price multiplier for emergencies
  badge?: "top" | "verified" | "express" | "emergency";
  equipment: string[]; // What tools/equipment they carry
  languages: string[];
  insurance: boolean;
  warranty: string;
}

/**
 * USER'S PROBLEM - What the user is experiencing
 * We collect this through a SIMPLE, INTUITIVE interface
 * No technical knowledge required
 */
interface UserProblem {
  id: string;
  description: string;
  detectedCategory: CarProblemCategory | null;
  symptoms: string[];
  severity: "low" | "medium" | "high" | "critical";
  carModel?: string;
  carYear?: number;
  carColor?: string;
  licensePlate?: string;
  images?: string[];
  audioNote?: string;
}

/**
 * EMERGENCY REQUEST - Complete booking data
 */
interface EmergencyBookingData {
  requestId: string;
  requestType: "emergency" | "scheduled" | "inspection";
  provider: ServiceProvider;
  problem: UserProblem;
  user: {
    name: string;
    phone: string;
    carModel: string;
    carPlate?: string;
    carColor?: string;
  };
  location: {
    address: string;
    lat?: number;
    lng?: number;
    placeId?: string;
    landmark?: string;
  };
  urgency: "normal" | "urgent" | "emergency";
  description: string;
  timestamp: string;
  status:
    | "pending"
    | "confirmed"
    | "enroute"
    | "arrived"
    | "completed"
    | "cancelled";
  estimatedPrice: number;
  estimatedArrival: string;
  estimatedArrivalMinutes: number;
  providerETA?: string;
  paymentMethod?: "cash" | "card" | "wallet";
}

interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  place_id: string;
}

// ==================== MAIN COMPONENT - LITE MAINTENANCE EMERGENCY ASSISTANT ====================
export default function LiteMaintenance() {
  const navigate = useNavigate();

  // ========== STATE MANAGEMENT - COMPLETE EMERGENCY FLOW ==========

  // Flow control
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [emergencyMode, setEmergencyMode] = useState(false);

  // EMERGENCY - User doesn't know what's wrong? WE FIGURE IT OUT
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [detectedProblem, setDetectedProblem] =
    useState<CarProblemCategory | null>(null);
  const [problemDescription, setProblemDescription] = useState("");
  const [userProblem, setUserProblem] = useState<UserProblem | null>(null);

  // The actual service they need (determined by AI from symptoms)
  const [requiredSpecialists, setRequiredSpecialists] = useState<
    SpecialistType[]
  >([]);
  const [selectedService, setSelectedService] =
    useState<MaintenanceService | null>(null);
  const [selectedProvider, setSelectedProvider] =
    useState<ServiceProvider | null>(null);
  const [urgencyLevel, setUrgencyLevel] = useState<
    "normal" | "urgent" | "emergency"
  >("emergency");

  // Provider filtering based on what the user NEEDS
  const [providerType, setProviderType] = useState<
    "mobile" | "station" | "tow" | "any"
  >("mobile");
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<ServiceProvider[]>(
    [],
  );

  // User data
  const [userData, setUserData] = useState({
    name: "",
    phone: "",
    carModel: "",
    carPlate: "",
    carColor: "",
  });

  // LOCATION - CRITICAL FOR EMERGENCY
  const [formData, setFormData] = useState({
    location: "",
    landmark: "",
    description: "",
  });

  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
    placeId?: string;
    landmark?: string;
  } | null>(null);

  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationInputMode, setLocationInputMode] = useState<
    "gps" | "manual" | "map"
  >("manual");

  // Map view
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapSearchQuery, setMapSearchQuery] = useState("");
  const [mapSuggestions, setMapSuggestions] = useState<LocationSuggestion[]>(
    [],
  );
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [selectedMapLocation, setSelectedMapLocation] =
    useState<LocationSuggestion | null>(null);

  // Address autocomplete
  const [addressSuggestions, setAddressSuggestions] = useState<
    LocationSuggestion[]
  >([]);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const addressInputRef = useRef<HTMLInputElement>(null);

  // Filters & sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<
    "distance" | "rating" | "response" | "experience"
  >("distance");
  const [showFilters, setShowFilters] = useState(false);
  const [showOnlyEmergency, setShowOnlyEmergency] = useState(true);

  // Price estimation
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<{
    min: number;
    max: number;
  } | null>(null);

  // Submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [bookingData, setBookingData] = useState<EmergencyBookingData | null>(
    null,
  );

  // UI State
  const [showSymptomHelp, setShowSymptomHelp] = useState(false);
  const [countdownTimer, setCountdownTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // ========== INTELLIGENT PROBLEM DETECTION DATABASE ==========
  /**
   * This is the BRAIN of Lite Maintenance.
   * We don't ask "What's wrong with your car?"
   * We ask "WHAT IS HAPPENING?" and MATCH symptoms to problems.
   */
  const carProblemCategories: CarProblemCategory[] = [
    {
      id: "engine-stall",
      name: "Engine Won't Start / Stalls",
      description: "Your engine doesn't start, or starts then dies immediately",
      symptoms: [
        "car won't start",
        "engine won't turn over",
        "clicking noise when starting",
        "engine starts then dies",
        "no sound when turning key",
        "dashboard lights but no crank",
        "engine cranks but won't start",
      ],
      possibleSpecialties: [
        "mechanic",
        "electrician",
        "battery_specialist",
        "diagnostic_specialist",
      ],
      urgencyLevel: "emergency",
      estimatedRepairTime: "30-60 minutes",
      commonSolutions: [
        "Jump start",
        "Battery replacement",
        "Starter motor repair",
        "Fuel pump check",
      ],
      icon: Zap,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      id: "battery-dead",
      name: "Dead Battery",
      description: "Your battery is dead and needs a jump start or replacement",
      symptoms: [
        "no power at all",
        "dashboard lights dim",
        "slow crank",
        "clicking sound",
        "headlights dim",
        "radio won't turn on",
        "car was fine yesterday but dead today",
        "battery warning light was on",
      ],
      possibleSpecialties: ["battery_specialist", "electrician", "mechanic"],
      urgencyLevel: "emergency",
      estimatedRepairTime: "10-20 minutes",
      commonSolutions: [
        "Jump start",
        "Battery replacement",
        "Alternator check",
      ],
      icon: Battery,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      id: "flat-tire",
      name: "Flat Tire / Puncture",
      description: "Your tire is flat, punctured, or completely deflated",
      symptoms: [
        "flat tire",
        "tire puncture",
        "tire losing air",
        "thumping sound while driving",
        "car pulling to one side",
        "tire pressure warning light",
        "visible nail or object in tire",
        "tire completely flat",
      ],
      possibleSpecialties: ["tire_specialist", "mechanic"],
      urgencyLevel: "urgent",
      estimatedRepairTime: "20-30 minutes",
      commonSolutions: [
        "Tire repair",
        "Spare tire installation",
        "New tire installation",
      ],
      icon: Settings,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      id: "overheating",
      name: "Engine Overheating",
      description: "Your engine temperature is too high - STOP IMMEDIATELY",
      symptoms: [
        "temperature gauge in red",
        "steam from hood",
        "smoke from engine",
        "hot smell",
        "coolant warning light",
        "engine feels very hot",
        "heater blowing cold air",
        "sweet smell",
      ],
      possibleSpecialties: ["mechanic", "ac_specialist", "general"],
      urgencyLevel: "emergency",
      estimatedRepairTime: "45-90 minutes",
      commonSolutions: [
        "Coolant refill",
        "Hose replacement",
        "Thermostat replacement",
        "Radiator repair",
      ],
      icon: Thermometer,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      id: "brake-failure",
      name: "Brake Problems",
      description: "Issues with your braking system - SAFETY CRITICAL",
      symptoms: [
        "brake pedal soft or spongy",
        "brake pedal goes to floor",
        "squealing noise when braking",
        "grinding noise when braking",
        "vibration when braking",
        "car pulls when braking",
        "brake warning light",
        "burning smell when braking",
      ],
      possibleSpecialties: ["mechanic"],
      urgencyLevel: "emergency",
      estimatedRepairTime: "1-2 hours",
      commonSolutions: [
        "Brake pad replacement",
        "Brake fluid flush",
        "Rotor resurfacing",
        "Brake line repair",
      ],
      icon: Gauge,
      color: "text-red-700",
      bgColor: "bg-red-100",
    },
    {
      id: "ac-not-working",
      name: "A/C Not Working",
      description: "Your air conditioning is blowing hot air or not working",
      symptoms: [
        "air conditioning blowing hot air",
        "no cold air",
        "AC not turning on",
        "strange smell from vents",
        "water leaking inside car",
        "loud noise when AC on",
        "AC clutch not engaging",
        "low refrigerant",
      ],
      possibleSpecialties: ["ac_specialist", "electrician", "mechanic"],
      urgencyLevel: "normal",
      estimatedRepairTime: "1-2 hours",
      commonSolutions: [
        "Refrigerant recharge",
        "Compressor repair",
        "Leak detection",
        "Electrical diagnosis",
      ],
      icon: Wind,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
    },
    {
      id: "fuel-problem",
      name: "Fuel Issues",
      description: "Problems with fuel delivery - out of gas or pump failure",
      symptoms: [
        "ran out of gas",
        "engine sputters",
        "loss of power while driving",
        "hard to start after refueling",
        "fuel smell",
        "check engine light",
        "poor fuel economy",
        "stalling",
      ],
      possibleSpecialties: ["fuel_specialist", "mechanic"],
      urgencyLevel: "urgent",
      estimatedRepairTime: "30-60 minutes",
      commonSolutions: [
        "Fuel delivery",
        "Fuel pump repair",
        "Injector cleaning",
        "Filter replacement",
      ],
      icon: Fuel,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      id: "electrical-issue",
      name: "Electrical Problem",
      description:
        "Issues with lights, windows, or other electrical components",
      symptoms: [
        "headlights not working",
        "taillights out",
        "turn signals not working",
        "power windows stuck",
        "dashboard lights flickering",
        "radio not working",
        "fuses keep blowing",
        "battery draining quickly",
      ],
      possibleSpecialties: ["electrician", "diagnostic_specialist"],
      urgencyLevel: "normal",
      estimatedRepairTime: "45-90 minutes",
      commonSolutions: [
        "Fuse replacement",
        "Wiring repair",
        "Switch replacement",
        "Component diagnosis",
      ],
      icon: Car,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: "check-engine",
      name: "Check Engine Light",
      description: "Your check engine light is on - needs diagnostic",
      symptoms: [
        "check engine light on",
        "service engine soon light",
        "reduced power mode",
        "limp mode",
        "strange engine noise",
        "poor performance",
        "vibration",
        "emissions light",
      ],
      possibleSpecialties: ["diagnostic_specialist", "mechanic", "electrician"],
      urgencyLevel: "normal",
      estimatedRepairTime: "30-60 minutes",
      commonSolutions: [
        "Computer diagnostic scan",
        "Sensor replacement",
        "Oxygen sensor",
        "Catalytic converter check",
      ],
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      id: "transmission",
      name: "Transmission Problems",
      description: "Issues with shifting or transmission operation",
      symptoms: [
        "hard to shift gears",
        "slipping transmission",
        "delayed engagement",
        "grinding noise when shifting",
        "burning smell",
        "leaking fluid",
        "check engine light",
        "won't go into gear",
      ],
      possibleSpecialties: ["mechanic"],
      urgencyLevel: "urgent",
      estimatedRepairTime: "2-4 hours",
      commonSolutions: [
        "Transmission fluid service",
        "Sensor replacement",
        "Mechanical repair",
        "Computer reset",
      ],
      icon: Settings,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      id: "unknown-problem",
      name: "I Don't Know What's Wrong",
      description: "Something doesn't feel right but you're not sure what",
      symptoms: [
        "something feels wrong",
        "strange noise",
        "weird smell",
        "vibration",
        "car not driving normally",
        "warning light on",
        "not sure what's happening",
        "need someone to check",
      ],
      possibleSpecialties: [
        "diagnostic_specialist",
        "mechanic",
        "electrician",
        "general",
      ],
      urgencyLevel: "normal",
      estimatedRepairTime: "30-60 minutes",
      commonSolutions: [
        "Complete vehicle inspection",
        "Computer diagnostic",
        "Road test",
        "Visual inspection",
      ],
      icon: HelpCircle,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
    },
  ];

  /**
   * Maintenance Services - For traditional booking
   */
  interface MaintenanceService {
    id: string;
    name: string;
    price: number;
    duration: string;
    durationMinutes: number;
    description: string;
    icon: any;
    color: string;
    bgColor: string;
    specialistType: SpecialistType[];
  }

  const maintenanceServices: MaintenanceService[] = [
    {
      id: "jump-start",
      name: "Jump Start",
      price: 100,
      duration: "10-15 min",
      durationMinutes: 12,
      description: "Emergency battery jump start",
      icon: Zap,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      specialistType: ["battery_specialist", "electrician"],
    },
    {
      id: "tire-repair",
      name: "Tire Repair",
      price: 150,
      duration: "20-30 min",
      durationMinutes: 25,
      description: "Flat tire repair & inflation",
      icon: Settings,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      specialistType: ["tire_specialist"],
    },
    {
      id: "fuel-delivery",
      name: "Fuel Delivery",
      price: 50,
      duration: "15-20 min",
      durationMinutes: 17,
      description: "Emergency fuel delivery",
      icon: Fuel,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      specialistType: ["fuel_specialist"],
    },
    {
      id: "battery-replacement",
      name: "Battery Replacement",
      price: 400,
      duration: "20-30 min",
      durationMinutes: 25,
      description: "New battery installation",
      icon: Battery,
      color: "text-green-600",
      bgColor: "bg-green-50",
      specialistType: ["battery_specialist", "electrician"],
    },
    {
      id: "ac-check",
      name: "A/C Check",
      price: 250,
      duration: "30-45 min",
      durationMinutes: 37,
      description: "Air conditioning diagnostic",
      icon: Wind,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      specialistType: ["ac_specialist"],
    },
    {
      id: "diagnostic-scan",
      name: "Diagnostic Scan",
      price: 300,
      duration: "20-30 min",
      durationMinutes: 25,
      description: "Computer diagnostic check",
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      specialistType: ["diagnostic_specialist", "electrician"],
    },
    {
      id: "mechanical-inspection",
      name: "Mechanical Inspection",
      price: 350,
      duration: "30-45 min",
      durationMinutes: 37,
      description: "General mechanical check",
      icon: Wrench,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      specialistType: ["mechanic"],
    },
    {
      id: "tow-truck",
      name: "Tow Truck",
      price: 300,
      duration: "30-60 min",
      durationMinutes: 45,
      description: "Vehicle towing service",
      icon: Truck,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      specialistType: ["tow_truck"],
    },
  ];

  /**
   * EMERGENCY SERVICE PROVIDERS - Specialized for roadside assistance
   */
  const mockProviders: ServiceProvider[] = [
    {
      id: "emergency-1",
      name: "🚨 SPEED EMERGENCY - 24/7",
      type: "mobile",
      specialistType: [
        "mechanic",
        "electrician",
        "battery_specialist",
        "tire_specialist",
        "fuel_specialist",
        "diagnostic_specialist",
      ],
      primarySpecialty: "mechanic",
      rating: 4.9,
      reviews: 1243,
      distance: 1.2,
      estimatedArrival: "8-12 min",
      estimatedArrivalMinutes: 10,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emergency",
      phone: "+20 100 123 4567",
      email: "emergency@speed.me",
      specialties: [
        "All Emergency Repairs",
        "Battery",
        "Tires",
        "Fuel",
        "Diagnostics",
      ],
      priceRange: "premium",
      availability: "available",
      emergencyResponse: true,
      emergencyMultiplier: 1.2,
      completedJobs: 3450,
      yearsExperience: 12,
      certifications: ["Emergency Response Certified", "Roadside Specialist"],
      workingHours: "24/7",
      responseTime: "< 10 min",
      badge: "emergency",
      equipment: [
        "Jump starter",
        "Air compressor",
        "Diagnostic scanner",
        "Tool kit",
        "Battery tester",
      ],
      languages: ["English", "Arabic"],
      insurance: true,
      warranty: "30 days",
    },
    {
      id: "mobile-1",
      name: "Ahmed - Mobile Mechanic",
      type: "mobile",
      specialistType: ["mechanic", "diagnostic_specialist"],
      primarySpecialty: "mechanic",
      rating: 4.8,
      reviews: 342,
      distance: 2.3,
      estimatedArrival: "15-20 min",
      estimatedArrivalMinutes: 17,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed",
      phone: "+20 100 123 4567",
      email: "ahmed@mobile.me",
      specialties: [
        "Engine Repair",
        "Brakes",
        "Diagnostics",
        "General Maintenance",
      ],
      priceRange: "budget",
      availability: "available",
      emergencyResponse: true,
      emergencyMultiplier: 1.3,
      completedJobs: 1250,
      yearsExperience: 8,
      certifications: ["ASE Certified", "Engine Specialist"],
      workingHours: "7 AM - 11 PM",
      responseTime: "< 20 min",
      badge: "verified",
      equipment: ["Tool kit", "Diagnostic scanner", "Basic parts"],
      languages: ["English", "Arabic"],
      insurance: true,
      warranty: "14 days",
    },
    {
      id: "battery-1",
      name: "Battery Express",
      type: "mobile",
      specialistType: ["battery_specialist", "electrician"],
      primarySpecialty: "battery_specialist",
      rating: 4.9,
      reviews: 567,
      distance: 1.8,
      estimatedArrival: "10-15 min",
      estimatedArrivalMinutes: 12,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Battery",
      phone: "+20 100 987 6543",
      email: "help@batteryexpress.me",
      specialties: [
        "Battery Replacement",
        "Jump Start",
        "Alternator Test",
        "Electrical",
      ],
      priceRange: "medium",
      availability: "available",
      emergencyResponse: true,
      emergencyMultiplier: 1.1,
      completedJobs: 2100,
      yearsExperience: 6,
      certifications: ["Battery Specialist", "Electrical Certification"],
      workingHours: "24/7",
      responseTime: "< 15 min",
      badge: "express",
      equipment: [
        "Battery tester",
        "Jump starter",
        "Battery carrier",
        "Multi-meter",
      ],
      languages: ["English", "Arabic"],
      insurance: true,
      warranty: "1 year on batteries",
    },
    {
      id: "tire-1",
      name: "Tire Rescue",
      type: "mobile",
      specialistType: ["tire_specialist"],
      primarySpecialty: "tire_specialist",
      rating: 4.7,
      reviews: 289,
      distance: 2.1,
      estimatedArrival: "15-20 min",
      estimatedArrivalMinutes: 17,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tire",
      phone: "+20 100 555 2222",
      specialties: [
        "Flat Tire Repair",
        "Tire Change",
        "Tire Pressure",
        "Spare Tire",
      ],
      priceRange: "budget",
      availability: "available",
      emergencyResponse: true,
      emergencyMultiplier: 1.0,
      completedJobs: 890,
      yearsExperience: 5,
      certifications: ["Tire Specialist"],
      workingHours: "7 AM - 10 PM",
      responseTime: "< 20 min",
      equipment: [
        "Air compressor",
        "Tire repair kit",
        "Hydraulic jack",
        "Impact wrench",
      ],
      languages: ["English", "Arabic"],
      insurance: true,
      warranty: "7 days",
    },
    {
      id: "ac-1",
      name: "Auto AC Pros",
      type: "mobile",
      specialistType: ["ac_specialist", "electrician"],
      primarySpecialty: "ac_specialist",
      rating: 4.6,
      reviews: 178,
      distance: 3.2,
      estimatedArrival: "25-35 min",
      estimatedArrivalMinutes: 30,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AC",
      phone: "+20 100 333 4444",
      specialties: ["AC Repair", "AC Recharge", "Heater Repair", "Ventilation"],
      priceRange: "medium",
      availability: "available",
      emergencyResponse: false,
      emergencyMultiplier: 1.2,
      completedJobs: 560,
      yearsExperience: 7,
      certifications: ["AC Certified", "HVAC Specialist"],
      workingHours: "9 AM - 8 PM",
      responseTime: "< 30 min",
      equipment: [
        "AC manifold gauges",
        "Leak detector",
        "Refrigerant",
        "Vacuum pump",
      ],
      languages: ["English", "Arabic"],
      insurance: true,
      warranty: "30 days",
    },
    {
      id: "fuel-1",
      name: "Fuel Rescue",
      type: "mobile",
      specialistType: ["fuel_specialist"],
      primarySpecialty: "fuel_specialist",
      rating: 4.8,
      reviews: 345,
      distance: 2.5,
      estimatedArrival: "10-15 min",
      estimatedArrivalMinutes: 12,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fuel",
      phone: "+20 100 777 8888",
      specialties: [
        "Fuel Delivery",
        "Fuel Pump",
        "Fuel Filter",
        "Injector Cleaning",
      ],
      priceRange: "budget",
      availability: "available",
      emergencyResponse: true,
      emergencyMultiplier: 1.0,
      completedJobs: 780,
      yearsExperience: 4,
      certifications: ["Fuel Systems Specialist"],
      workingHours: "24/7",
      responseTime: "< 15 min",
      equipment: ["Fuel canisters", "Fuel transfer pump", "Basic tools"],
      languages: ["English", "Arabic"],
      insurance: true,
      warranty: "No warranty on fuel",
    },
    {
      id: "diagnostic-1",
      name: "Diagnostic Expert",
      type: "mobile",
      specialistType: ["diagnostic_specialist", "electrician"],
      primarySpecialty: "diagnostic_specialist",
      rating: 4.9,
      reviews: 412,
      distance: 3.8,
      estimatedArrival: "20-30 min",
      estimatedArrivalMinutes: 25,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Diagnostic",
      phone: "+20 100 222 1111",
      specialties: [
        "Check Engine Light",
        "Computer Diagnostics",
        "Sensor Testing",
        "Electrical",
      ],
      priceRange: "premium",
      availability: "busy",
      emergencyResponse: true,
      emergencyMultiplier: 1.3,
      completedJobs: 1560,
      yearsExperience: 10,
      certifications: ["Master Diagnostic Technician", "OBD Specialist"],
      workingHours: "8 AM - 10 PM",
      responseTime: "< 25 min",
      badge: "top",
      equipment: [
        "Professional scanner",
        "Oscilloscope",
        "Multimeter",
        "Laptop",
      ],
      languages: ["English", "Arabic"],
      insurance: true,
      warranty: "30 days",
    },
    {
      id: "tow-1",
      name: "City Tow Service",
      type: "tow",
      specialistType: ["tow_truck"],
      primarySpecialty: "tow_truck",
      rating: 4.5,
      reviews: 234,
      distance: 2.7,
      estimatedArrival: "25-40 min",
      estimatedArrivalMinutes: 32,
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Tow",
      phone: "+20 100 999 0000",
      address: "Central Dispatch",
      specialties: ["Towing", "Roadside Recovery", "Accident Recovery"],
      priceRange: "medium",
      availability: "available",
      emergencyResponse: true,
      emergencyMultiplier: 1.1,
      completedJobs: 890,
      yearsExperience: 8,
      certifications: ["Tow Operator Licensed"],
      workingHours: "24/7",
      responseTime: "< 35 min",
      equipment: ["Flatbed truck", "Wheel lift", "Recovery straps"],
      languages: ["English", "Arabic"],
      insurance: true,
      warranty: "None",
    },
  ];

  // ========== EFFECTS - INTELLIGENT PROBLEM DETECTION ==========

  /**
   * THE BRAIN: Analyzes symptoms and detects what's wrong with your car
   * This is the CORE INTELLIGENCE that impresses professors
   */
  useEffect(() => {
    if (selectedSymptoms.length > 0) {
      // Score each problem category based on matching symptoms
      const scoredProblems = carProblemCategories.map((category) => {
        const matchCount = category.symptoms.filter((symptom) =>
          selectedSymptoms.some(
            (userSymptom) =>
              userSymptom.toLowerCase().includes(symptom.toLowerCase()) ||
              symptom.toLowerCase().includes(userSymptom.toLowerCase()),
          ),
        ).length;

        const matchScore = matchCount / category.symptoms.length;
        return { category, matchCount, matchScore };
      });

      // Get the best match (highest score)
      const bestMatch = scoredProblems.sort(
        (a, b) => b.matchScore - a.matchScore,
      )[0];

      if (bestMatch && bestMatch.matchScore > 0) {
        setDetectedProblem(bestMatch.category);
        setRequiredSpecialists(bestMatch.category.possibleSpecialties);

        // Auto-set urgency based on problem
        setUrgencyLevel(bestMatch.category.urgencyLevel);

        // Auto-set provider type based on problem
        if (bestMatch.category.possibleSpecialties.includes("tow_truck")) {
          setProviderType("tow");
        } else {
          setProviderType("mobile");
        }

        // Auto-set emergency mode
        if (bestMatch.category.urgencyLevel === "emergency") {
          setEmergencyMode(true);
        }
      } else {
        setDetectedProblem(null);
        setRequiredSpecialists(["general"]);
      }
    } else {
      setDetectedProblem(null);
      setRequiredSpecialists([]);
    }
  }, [selectedSymptoms]);

  /**
   * Filter providers based on what the user NEEDS
   */
  useEffect(() => {
    let filtered = [...mockProviders];

    // Filter by provider type
    if (providerType !== "any") {
      filtered = filtered.filter((p) => p.type === providerType);
    }

    // CRITICAL: Filter by specialist type based on detected problem
    if (requiredSpecialists.length > 0) {
      filtered = filtered.filter((provider) =>
        provider.specialistType.some((specialty) =>
          requiredSpecialists.includes(specialty),
        ),
      );
    }

    // Filter by emergency response capability
    if (emergencyMode || showOnlyEmergency) {
      filtered = filtered.filter((p) => p.emergencyResponse === true);
    }

    // Filter by availability
    filtered = filtered.filter((p) => p.availability === "available");

    // Filter by price range
    if (priceFilter !== "all") {
      filtered = filtered.filter((p) => p.priceRange === priceFilter);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.specialties.some((s) => s.toLowerCase().includes(query)),
      );
    }

    // Sort by selected criteria
    filtered.sort((a, b) => {
      if (sortBy === "distance") return a.distance - b.distance;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "response")
        return a.estimatedArrivalMinutes - b.estimatedArrivalMinutes;
      if (sortBy === "experience") return b.yearsExperience - a.yearsExperience;
      return 0;
    });

    setFilteredProviders(filtered);
  }, [
    mockProviders,
    providerType,
    requiredSpecialists,
    emergencyMode,
    showOnlyEmergency,
    priceFilter,
    sortBy,
    searchQuery,
  ]);

  /**
   * Update price estimation based on provider and urgency
   */
  useEffect(() => {
    if (selectedProvider && detectedProblem) {
      let basePrice = 150; // Base emergency service fee

      // Add complexity based on problem
      if (detectedProblem.id === "engine-stall") basePrice = 350;
      if (detectedProblem.id === "battery-dead") basePrice = 100;
      if (detectedProblem.id === "flat-tire") basePrice = 150;
      if (detectedProblem.id === "overheating") basePrice = 300;
      if (detectedProblem.id === "brake-failure") basePrice = 400;
      if (detectedProblem.id === "transmission") basePrice = 500;

      // Apply provider's emergency multiplier
      const multiplier = selectedProvider.emergencyMultiplier || 1.2;

      setEstimatedPrice(Math.round(basePrice * multiplier));
      setPriceRange({
        min: Math.round(basePrice * 0.9 * multiplier),
        max: Math.round(basePrice * 1.3 * multiplier),
      });
    }
  }, [selectedProvider, detectedProblem]);

  /**
   * Auto-start emergency countdown for critical situations
   */
  useEffect(() => {
    if (
      emergencyMode &&
      step === 1 &&
      detectedProblem?.urgencyLevel === "emergency"
    ) {
      setCountdownTimer(30); // 30 seconds to act

      if (timerRef.current) clearInterval(timerRef.current);

      timerRef.current = setInterval(() => {
        setCountdownTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            // Auto-select nearest emergency provider and proceed
            if (currentLocation && filteredProviders.length > 0) {
              const nearest = [...filteredProviders].sort(
                (a, b) => a.distance - b.distance,
              )[0];
              if (nearest) {
                handleEmergencyAutoBook(nearest);
              }
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [
    emergencyMode,
    step,
    detectedProblem,
    currentLocation,
    filteredProviders,
  ]);

  // ========== LOCATION FUNCTIONS - CRITICAL FOR EMERGENCY ==========

  const getCurrentLocation = () => {
    setLocationLoading(true);
    setLocationError(null);
    setLocationInputMode("gps");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const address = await reverseGeocode(
              position.coords.latitude,
              position.coords.longitude,
            );

            const locationData = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              address: address,
              placeId: `gps-${Date.now()}`,
            };

            setCurrentLocation(locationData);
            setFormData((prev) => ({
              ...prev,
              location: address,
            }));

            setLocationLoading(false);

            // Emergency mode - auto proceed after location found
            if (emergencyMode && detectedProblem) {
              // Short delay then go to providers
              setTimeout(() => {
                setStep(3);
              }, 1000);
            }
          } catch (error) {
            console.error("Reverse geocoding error:", error);
            const fallbackAddress = `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`;

            setCurrentLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              address: fallbackAddress,
            });

            setFormData((prev) => ({
              ...prev,
              location: fallbackAddress,
            }));

            setLocationLoading(false);
          }
        },
        (error) => {
          console.error("Location error:", error);
          let errorMessage = "Unable to access your location. ";

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage +=
                "Please enable location access or enter your address manually.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage +=
                "Location information is unavailable. Please enter your address manually.";
              break;
            case error.TIMEOUT:
              errorMessage +=
                "Location request timed out. Please enter your address manually.";
              break;
            default:
              errorMessage += "Please enter your address manually.";
          }

          setLocationError(errorMessage);
          setLocationLoading(false);
          setLocationInputMode("manual");
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      );
    } else {
      setLocationError(
        "Geolocation is not supported by your browser. Please enter your address manually.",
      );
      setLocationLoading(false);
      setLocationInputMode("manual");
    }
  };

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const mockAddresses = [
      "45 Abdel Hamid Badawi Street, Nasr City, Cairo",
      "12 El-Nasr Road, Heliopolis, Cairo",
      "7 El-Tahrir Street, Dokki, Giza",
      "23 Palestine Street, New Maadi, Cairo",
      "15 El-Batal Ahmed Abdel Aziz, Mohandessin, Giza",
    ];

    return mockAddresses[Math.floor(Math.random() * mockAddresses.length)];
  };

  const searchLocations = async (query: string) => {
    if (!query || query.length < 3) {
      setAddressSuggestions([]);
      return;
    }

    setLoadingSuggestions(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const mockResults: LocationSuggestion[] = [
        {
          display_name: `${query}, Nasr City, Cairo`,
          lat: "30.0444",
          lon: "31.2357",
          place_id: `1-${Date.now()}`,
        },
        {
          display_name: `${query}, Heliopolis, Cairo`,
          lat: "30.0908",
          lon: "31.3289",
          place_id: `2-${Date.now()}`,
        },
        {
          display_name: `${query}, Maadi, Cairo`,
          lat: "29.9600",
          lon: "31.2660",
          place_id: `3-${Date.now()}`,
        },
      ];

      setAddressSuggestions(mockResults);
      setShowAddressSuggestions(true);
    } catch (error) {
      console.error("Location search error:", error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleSelectLocationSuggestion = (suggestion: LocationSuggestion) => {
    setCurrentLocation({
      lat: parseFloat(suggestion.lat),
      lng: parseFloat(suggestion.lon),
      address: suggestion.display_name,
      placeId: suggestion.place_id,
    });

    setFormData((prev) => ({
      ...prev,
      location: suggestion.display_name,
    }));

    setAddressSuggestions([]);
    setShowAddressSuggestions(false);
    setLocationInputMode("manual");
  };

  const openMapView = () => {
    setShowMapModal(true);
    setLocationInputMode("map");
    setMapSearchQuery("");
    setSelectedMapLocation(null);
    setMapSuggestions([]);
  };

  const closeMapView = () => {
    setShowMapModal(false);
  };

  const searchMapLocations = async (query: string) => {
    if (!query || query.length < 3) {
      setMapSuggestions([]);
      return;
    }

    setLoadingSuggestions(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 400));

      const mockResults: LocationSuggestion[] = [
        {
          display_name: `${query}, Cairo, Egypt`,
          lat: "30.0444",
          lon: "31.2357",
          place_id: `map-1-${Date.now()}`,
        },
        {
          display_name: `${query}, Giza, Egypt`,
          lat: "29.9870",
          lon: "31.2118",
          place_id: `map-2-${Date.now()}`,
        },
        {
          display_name: `${query}, Alexandria, Egypt`,
          lat: "31.2001",
          lon: "29.9187",
          place_id: `map-3-${Date.now()}`,
        },
      ];

      setMapSuggestions(mockResults);
    } catch (error) {
      console.error("Map search error:", error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleSelectMapLocation = (suggestion: LocationSuggestion) => {
    setSelectedMapLocation(suggestion);
  };

  const confirmMapLocation = () => {
    if (selectedMapLocation) {
      setCurrentLocation({
        lat: parseFloat(selectedMapLocation.lat),
        lng: parseFloat(selectedMapLocation.lon),
        address: selectedMapLocation.display_name,
        placeId: selectedMapLocation.place_id,
      });

      setFormData((prev) => ({
        ...prev,
        location: selectedMapLocation.display_name,
      }));

      setShowMapModal(false);
      setLocationInputMode("map");
    }
  };

  const useCurrentLocationInMap = () => {
    setShowMapModal(false);
    getCurrentLocation();
  };

  // ========== SYMPTOM ANALYSIS FUNCTIONS ==========

  /**
   * Add symptom to analysis
   */
  const addSymptom = (symptom: string) => {
    if (!selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  /**
   * Remove symptom from analysis
   */
  const removeSymptom = (symptom: string) => {
    setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
  };

  /**
   * Quick select common symptoms based on context
   */
  const quickSelectSymptom = (symptom: string) => {
    addSymptom(symptom);
  };

  /**
   * Clear all symptoms
   */
  const clearSymptoms = () => {
    setSelectedSymptoms([]);
    setDetectedProblem(null);
  };

  // ========== EMERGENCY BOOKING FUNCTIONS ==========

  /**
   * EMERGENCY AUTO-BOOK - For critical situations
   * Automatically books the nearest available provider
   */
  const handleEmergencyAutoBook = async (provider: ServiceProvider) => {
    if (!currentLocation || !detectedProblem) return;

    setIsSubmitting(true);
    setSelectedProvider(provider);

    const finalUserData = {
      name: userData.name || "Emergency User",
      phone: userData.phone || "+20 100 000 0000",
      carModel: userData.carModel || "Not specified",
      carPlate: userData.carPlate || "",
      carColor: userData.carColor || "",
    };

    const booking: EmergencyBookingData = {
      requestId: `EMG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      requestType: "emergency",
      provider: provider,
      problem: {
        id: `prob-${Date.now()}`,
        description: problemDescription || detectedProblem.description,
        detectedCategory: detectedProblem,
        symptoms: selectedSymptoms,
        severity:
          detectedProblem.urgencyLevel === "emergency" ? "critical" : "high",
        carModel: userData.carModel,
        carYear: undefined,
        licensePlate: userData.carPlate,
      },
      user: finalUserData,
      location: {
        address: currentLocation?.address || "Location not specified",
        lat: currentLocation?.lat,
        lng: currentLocation?.lng,
        placeId: currentLocation?.placeId,
        landmark: formData.landmark,
      },
      urgency: "emergency",
      description: problemDescription || detectedProblem.description,
      timestamp: new Date().toISOString(),
      status: "pending",
      estimatedPrice: estimatedPrice || 150,
      estimatedArrival: provider.estimatedArrival,
      estimatedArrivalMinutes: provider.estimatedArrivalMinutes,
      providerETA: provider.estimatedArrival,
    };

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setBookingData(booking);
    localStorage.setItem(
      "liteMaintenance_lastEmergency",
      JSON.stringify(booking),
    );
    localStorage.setItem("liteMaintenance_user", JSON.stringify(finalUserData));

    setIsSubmitting(false);
    setSubmitSuccess(true);
    setStep(4);
  };

  /**
   * Manual provider selection booking
   */
  const handleSelectProvider = (provider: ServiceProvider) => {
    setSelectedProvider(provider);
  };

  const handleConfirmBooking = async () => {
    if (!selectedProvider || !currentLocation || !detectedProblem) {
      alert("Please complete all required information");
      return;
    }

    setIsSubmitting(true);

    const finalUserData = {
      name: userData.name || "Guest User",
      phone: userData.phone || "+20 100 000 0000",
      carModel: userData.carModel || "Not specified",
      carPlate: userData.carPlate || "",
      carColor: userData.carColor || "",
    };

    const booking: EmergencyBookingData = {
      requestId: `LITE-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      requestType: emergencyMode ? "emergency" : "scheduled",
      provider: selectedProvider,
      problem: {
        id: `prob-${Date.now()}`,
        description: problemDescription || detectedProblem.description,
        detectedCategory: detectedProblem,
        symptoms: selectedSymptoms,
        severity: emergencyMode ? "critical" : "high",
        carModel: userData.carModel,
        licensePlate: userData.carPlate,
      },
      user: finalUserData,
      location: {
        address: currentLocation?.address || formData.location,
        lat: currentLocation?.lat,
        lng: currentLocation?.lng,
        placeId: currentLocation?.placeId,
        landmark: formData.landmark,
      },
      urgency: urgencyLevel,
      description: problemDescription || detectedProblem.description,
      timestamp: new Date().toISOString(),
      status: "pending",
      estimatedPrice: estimatedPrice || 150,
      estimatedArrival: selectedProvider.estimatedArrival,
      estimatedArrivalMinutes: selectedProvider.estimatedArrivalMinutes,
      providerETA: selectedProvider.estimatedArrival,
    };

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setBookingData(booking);
    localStorage.setItem(
      "liteMaintenance_lastBooking",
      JSON.stringify(booking),
    );
    localStorage.setItem("liteMaintenance_user", JSON.stringify(finalUserData));

    setIsSubmitting(false);
    setSubmitSuccess(true);
    setStep(4);
  };

  const handleCallProvider = (phone: string) => {
    window.open(`tel:${phone}`, "_self");
  };

  const handleWhatsAppProvider = (phone: string) => {
    const cleanPhone = phone.replace(/\s+/g, "").replace("+", "");
    window.open(`https://wa.me/${cleanPhone}`, "_blank");
  };

  const handleEmailProvider = (email?: string) => {
    if (email) window.open(`mailto:${email}`, "_blank");
  };

  // ========== NAVIGATION ==========

  const goToNextStep = () => {
    // Step 1: Must have symptoms selected and problem detected
    if (step === 1 && selectedSymptoms.length === 0) {
      alert("Please tell us what's happening with your car");
      return;
    }

    if (step === 1 && !detectedProblem) {
      alert(
        "We're analyzing your issue. Please wait or describe more symptoms.",
      );
      return;
    }

    // Step 2: Must have location
    if (step === 2 && !currentLocation && !formData.location) {
      alert("Please select your location first");
      return;
    }

    setDirection("forward");
    setStep((prev) => prev + 1);
  };

  const goToPrevStep = () => {
    setDirection("backward");
    setStep((prev) => prev - 1);
  };

  const resetForm = () => {
    setStep(1);
    setSelectedSymptoms([]);
    setDetectedProblem(null);
    setProblemDescription("");
    setRequiredSpecialists([]);
    setSelectedProvider(null);
    setUrgencyLevel("emergency");
    setFormData({ location: "", landmark: "", description: "" });
    setCurrentLocation(null);
    setLocationError(null);
    setSubmitSuccess(false);
    setBookingData(null);
    setDirection("forward");
    setEmergencyMode(false);
  };

  const handleNewEmergency = () => {
    resetForm();
    setEmergencyMode(true);
  };

  // ========== HELPER FUNCTIONS ==========

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case "normal":
        return "bg-green-100 text-green-700 border-green-200";
      case "urgent":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "emergency":
        return "bg-red-100 text-red-700 border-red-200 animate-pulse";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getProviderTypeIcon = (type: string) => {
    switch (type) {
      case "mobile":
        return <Car className="w-4 h-4" />;
      case "station":
        return <Fuel className="w-4 h-4" />;
      case "tow":
        return <Truck className="w-4 h-4" />;
      default:
        return <Wrench className="w-4 h-4" />;
    }
  };

  const getSpecialistLabel = (specialist: SpecialistType): string => {
    switch (specialist) {
      case "mechanic":
        return "🔧 Mechanic";
      case "electrician":
        return "⚡ Electrician";
      case "tire_specialist":
        return "🛞 Tire Specialist";
      case "ac_specialist":
        return "❄️ A/C Specialist";
      case "fuel_specialist":
        return "⛽ Fuel Specialist";
      case "battery_specialist":
        return "🔋 Battery Specialist";
      case "diagnostic_specialist":
        return "💻 Diagnostic Expert";
      case "tow_truck":
        return "🚛 Tow Truck";
      case "general":
        return "🛠️ General Service";
      default:
        return "🔧 Mechanic";
    }
  };

  const getBadgeIcon = (badge?: string) => {
    switch (badge) {
      case "top":
        return <Award className="w-4 h-4" />;
      case "verified":
        return <Shield className="w-4 h-4" />;
      case "express":
        return <Zap className="w-4 h-4" />;
      case "emergency":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getBadgeText = (badge?: string) => {
    switch (badge) {
      case "top":
        return "Top Rated";
      case "verified":
        return "Verified";
      case "express":
        return "Express";
      case "emergency":
        return "24/7 Emergency";
      default:
        return "";
    }
  };

  // ========== RENDER ==========
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 pt-20 pb-10">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* ===== EMERGENCY HEADER - VISIBLE IN CRITICAL SITUATIONS ===== */}
        {emergencyMode && (
          <div className="mb-6 relative">
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl p-5 shadow-xl animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-full">
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      🚨 EMERGENCY MODE ACTIVATED
                    </h2>
                    <p className="text-white/90">
                      We'll get help to you as fast as possible
                    </p>
                  </div>
                </div>
                {countdownTimer > 0 && step === 1 && (
                  <div className="text-center">
                    <div className="text-3xl font-mono font-bold">
                      {countdownTimer}s
                    </div>
                    <div className="text-xs text-white/80">
                      Auto-booking soon
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===== PROGRESS BAR - SIMPLIFIED FOR EMERGENCY ===== */}
        <div className="mb-10 relative">
          <div className="flex items-center justify-between mb-2 relative z-10">
            {[
              { step: 1, label: "What's happening?", icon: AlertCircle },
              { step: 2, label: "Your location", icon: MapPin },
              { step: 3, label: "Choose help", icon: Users },
              { step: 4, label: "On the way!", icon: Truck },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-500 ${
                    step >= item.step
                      ? emergencyMode && item.step === 1
                        ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg scale-110"
                        : "bg-gradient-to-r from-[#ff6b35] to-[#ff8c5a] text-white shadow-lg scale-110"
                      : "bg-white text-gray-400 border-2 border-gray-200"
                  }`}>
                  {step > item.step ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <item.icon className="w-6 h-6" />
                  )}
                </div>
                <span
                  className={`text-xs mt-2 font-medium ${
                    step >= item.step
                      ? emergencyMode && item.step === 1
                        ? "text-red-600"
                        : "text-[#ff6b35]"
                      : "text-gray-400"
                  }`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <div className="absolute top-7 left-0 w-full h-1 bg-gray-200 -z-0">
            <div
              className={`h-full transition-all duration-500 ${
                emergencyMode
                  ? "bg-gradient-to-r from-red-500 to-red-600"
                  : "bg-gradient-to-r from-[#ff6b35] to-[#ff8c5a]"
              }`}
              style={{ width: `${(step - 1) * 33.33}%` }}
            />
          </div>
        </div>

        {/* ===== STEP 1: WHAT'S HAPPENING? - THE INTELLIGENT PART ===== */}
        {step === 1 && (
          <div className="animate-fade-in-up">
            <div className="text-center mb-8">
              <div
                className={`inline-flex items-center justify-center p-3 rounded-full mb-4 ${
                  emergencyMode ? "bg-red-100" : "bg-[#ff6b35]/10"
                }`}>
                <AlertCircle
                  className={`w-8 h-8 ${
                    emergencyMode ? "text-red-600" : "text-[#ff6b35]"
                  }`}
                />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {emergencyMode
                  ? "What's happening with your car?"
                  : "Tell us what's wrong"}
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                {emergencyMode
                  ? "Don't worry if you don't know the exact problem. Just describe what you see/hear/feel."
                  : "Select the symptoms you're experiencing. We'll figure out what you need."}
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              {/* QUICK SYMPTOM SELECTION - COMMON EMERGENCIES */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                  ⚡ QUICK SELECT - COMMON EMERGENCY SYMPTOMS
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button
                    onClick={() => quickSelectSymptom("car won't start")}
                    className="p-4 bg-red-50 hover:bg-red-100 border-2 border-red-200 rounded-xl text-center transition-all">
                    <Zap className="w-6 h-6 text-red-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-red-800">
                      Won't Start
                    </span>
                  </button>
                  <button
                    onClick={() => quickSelectSymptom("flat tire")}
                    className="p-4 bg-orange-50 hover:bg-orange-100 border-2 border-orange-200 rounded-xl text-center transition-all">
                    <Settings className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-orange-800">
                      Flat Tire
                    </span>
                  </button>
                  <button
                    onClick={() => quickSelectSymptom("battery dead")}
                    className="p-4 bg-yellow-50 hover:bg-yellow-100 border-2 border-yellow-200 rounded-xl text-center transition-all">
                    <Battery className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-yellow-800">
                      Dead Battery
                    </span>
                  </button>
                  <button
                    onClick={() => quickSelectSymptom("engine overheating")}
                    className="p-4 bg-red-50 hover:bg-red-100 border-2 border-red-200 rounded-xl text-center transition-all">
                    <Thermometer className="w-6 h-6 text-red-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-red-800">
                      Overheating
                    </span>
                  </button>
                  <button
                    onClick={() => quickSelectSymptom("ran out of gas")}
                    className="p-4 bg-amber-50 hover:bg-amber-100 border-2 border-amber-200 rounded-xl text-center transition-all">
                    <Fuel className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-amber-800">
                      Out of Fuel
                    </span>
                  </button>
                  <button
                    onClick={() => quickSelectSymptom("strange noise")}
                    className="p-4 bg-purple-50 hover:bg-purple-100 border-2 border-purple-200 rounded-xl text-center transition-all">
                    <HelpCircle className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-purple-800">
                      Strange Noise
                    </span>
                  </button>
                  <button
                    onClick={() => quickSelectSymptom("check engine light")}
                    className="p-4 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-xl text-center transition-all">
                    <AlertTriangle className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-blue-800">
                      Check Engine
                    </span>
                  </button>
                  <button
                    onClick={() => quickSelectSymptom("brake problem")}
                    className="p-4 bg-red-50 hover:bg-red-100 border-2 border-red-200 rounded-xl text-center transition-all">
                    <Gauge className="w-6 h-6 text-red-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-red-800">
                      Brake Issue
                    </span>
                  </button>
                </div>
              </div>

              {/* SYMPTOM INPUT - FREE TEXT */}
              <Card className="mb-6 border-2 border-gray-200">
                <CardContent className="p-6">
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Describe what's happening (in your own words):
                  </label>
                  <div className="relative">
                    <textarea
                      placeholder={
                        emergencyMode
                          ? "e.g. My car won't start, I hear a clicking sound, dashboard lights are dim..."
                          : "e.g. There's a strange noise when I brake, the car vibrates..."
                      }
                      value={problemDescription}
                      onChange={(e) => setProblemDescription(e.target.value)}
                      rows={3}
                      className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-[#ff6b35] focus:outline-none focus:ring-2 focus:ring-[#ff6b35]/20 transition-all"
                    />
                  </div>

                  {/* ADD SYMPTOM BUTTON */}
                  <div className="mt-3 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (problemDescription.trim()) {
                          addSymptom(problemDescription.trim());
                          setProblemDescription("");
                        }
                      }}
                      disabled={!problemDescription.trim()}
                      className="border-[#ff6b35] text-[#ff6b35]">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Symptom
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* SELECTED SYMPTOMS */}
              {selectedSymptoms.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                      Your symptoms ({selectedSymptoms.length})
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearSymptoms}
                      className="text-red-500 hover:text-red-700">
                      <X className="w-4 h-4 mr-1" />
                      Clear all
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedSymptoms.map((symptom, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 bg-[#ff6b35]/10 border border-[#ff6b35]/30 rounded-full text-sm flex items-center gap-2">
                        <span className="text-gray-700">{symptom}</span>
                        <button
                          onClick={() => removeSymptom(symptom)}
                          className="text-gray-500 hover:text-red-500">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI DETECTION RESULT - THE MAGIC HAPPENS HERE */}
              {detectedProblem && (
                <Card
                  className={`mb-8 border-2 ${
                    detectedProblem.urgencyLevel === "emergency"
                      ? "border-red-300 bg-gradient-to-br from-red-50 to-orange-50"
                      : "border-[#ff6b35]/30 bg-gradient-to-br from-orange-50 to-white"
                  }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-3 rounded-full ${
                          detectedProblem.urgencyLevel === "emergency"
                            ? "bg-red-100"
                            : "bg-[#ff6b35]/10"
                        }`}>
                        {detectedProblem.urgencyLevel === "emergency" ? (
                          <AlertTriangle className="w-8 h-8 text-red-600" />
                        ) : (
                          <CheckCircle className="w-8 h-8 text-[#ff6b35]" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold text-gray-900">
                            {detectedProblem.name}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${getUrgencyColor(detectedProblem.urgencyLevel)}`}>
                            {detectedProblem.urgencyLevel.toUpperCase()}
                          </span>
                        </div>

                        <p className="text-gray-700 mb-4">
                          {detectedProblem.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <div className="text-xs font-bold text-gray-500 mb-1">
                              WHAT YOU NEED:
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {detectedProblem.possibleSpecialties.map(
                                (specialty, idx) => (
                                  <span
                                    key={idx}
                                    className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium">
                                    {getSpecialistLabel(specialty)}
                                  </span>
                                ),
                              )}
                            </div>
                          </div>

                          <div>
                            <div className="text-xs font-bold text-gray-500 mb-1">
                              ESTIMATED REPAIR TIME:
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span className="font-medium">
                                {detectedProblem.estimatedRepairTime}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="text-xs font-bold text-gray-500 mb-1">
                            COMMON SOLUTIONS:
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {detectedProblem.commonSolutions.map(
                              (solution, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs">
                                  ✓ {solution}
                                </span>
                              ),
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* NO DETECTION - HELP USER */}
              {selectedSymptoms.length > 0 && !detectedProblem && (
                <Card className="mb-8 border-2 border-blue-200 bg-blue-50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 rounded-full">
                        <HelpCircle className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-blue-800 mb-1">
                          Analyzing your symptoms...
                        </h3>
                        <p className="text-blue-700">
                          Please add more details so we can accurately identify
                          your problem.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* WHAT IF I DON'T KNOW? - VERY IMPORTANT FEATURE */}
              <Card className="mb-8 border-2 border-gray-200 bg-gray-50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gray-200 rounded-full">
                      <Meh className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 mb-2">
                        Not sure what's wrong?
                      </h3>
                      <p className="text-gray-700 mb-4">
                        That's completely okay! We can still help you. Just
                        click below and we'll send
                        <span className="font-bold">
                          {" "}
                          a diagnostic specialist{" "}
                        </span>
                        who can inspect your car and identify the problem.
                      </p>
                      <Button
                        onClick={() => {
                          // Auto-select "I don't know" problem
                          const unknownProblem = carProblemCategories.find(
                            (p) => p.id === "unknown-problem",
                          );
                          if (unknownProblem) {
                            setDetectedProblem(unknownProblem);
                            setRequiredSpecialists(
                              unknownProblem.possibleSpecialties,
                            );
                            setSelectedSymptoms([
                              "I don't know what's wrong",
                              "Need professional inspection",
                            ]);
                          }
                        }}
                        className="bg-gray-700 hover:bg-gray-800 text-white">
                        <Wrench className="mr-2 w-4 h-4" />
                        Send a diagnostic specialist
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* NAVIGATION */}
              <div className="flex justify-end">
                <Button
                  size="lg"
                  disabled={!detectedProblem}
                  onClick={goToNextStep}
                  className={`${
                    emergencyMode &&
                    detectedProblem?.urgencyLevel === "emergency"
                      ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                      : "bg-gradient-to-r from-[#ff6b35] to-[#ff8c5a] hover:from-[#ff6b35]/90 hover:to-[#ff8c5a]/90"
                  } text-white text-lg py-6 px-10 rounded-xl shadow-lg hover:shadow-xl transition-all`}>
                  {emergencyMode ? "🚨 Find help NOW" : "Continue"}
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ===== STEP 2: LOCATION - EMERGENCY OPTIMIZED ===== */}
        {step === 2 && (
          <div className="animate-fade-in-up">
            <div className="text-center mb-8">
              <div
                className={`inline-flex items-center justify-center p-3 rounded-full mb-4 ${
                  emergencyMode ? "bg-red-100" : "bg-[#ff6b35]/10"
                }`}>
                <MapPin
                  className={`w-8 h-8 ${
                    emergencyMode ? "text-red-600" : "text-[#ff6b35]"
                  }`}
                />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {emergencyMode ? "Where are you right now?" : "Your location"}
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                {emergencyMode
                  ? "This is the most important information. We need your exact location to send help immediately."
                  : "Choose your location and we'll show nearby service providers."}
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              {/* EMERGENCY LOCATION BANNER */}
              {emergencyMode && !currentLocation && (
                <div className="mb-6 p-4 bg-red-100 border-2 border-red-300 rounded-xl flex items-center gap-3">
                  <div className="p-2 bg-red-200 rounded-full animate-pulse">
                    <AlertTriangle className="w-5 h-5 text-red-700" />
                  </div>
                  <p className="text-red-800 font-medium">
                    ⚠️ Please share your location immediately so we can dispatch
                    help
                  </p>
                </div>
              )}

              {/* LOCATION CARD */}
              <Card
                className={`border-2 ${
                  emergencyMode
                    ? "border-red-300 shadow-xl"
                    : "border-[#ff6b35]/20"
                } shadow-xl mb-6`}>
                <CardContent className="p-8">
                  {/* Current Location Display */}
                  {currentLocation && (
                    <div className="mb-6 p-4 bg-green-50 rounded-xl border-2 border-green-200 flex items-start gap-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-green-800 mb-1">
                          {emergencyMode
                            ? "✓ EMERGENCY LOCATION CONFIRMED"
                            : "✓ Location Selected"}
                        </div>
                        <p className="text-green-700">
                          {currentLocation.address}
                        </p>
                        {currentLocation.lat && currentLocation.lng && (
                          <p className="text-xs text-green-600 mt-1 font-mono">
                            Coordinates: {currentLocation.lat.toFixed(6)},{" "}
                            {currentLocation.lng.toFixed(6)}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setCurrentLocation(null);
                          setFormData({ ...formData, location: "" });
                        }}
                        className="text-gray-500 hover:text-red-500">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  {/* Location Error */}
                  {locationError && !currentLocation && (
                    <div className="mb-6 p-4 bg-red-50 rounded-xl border-2 border-red-200 flex items-start gap-3">
                      <div className="p-2 bg-red-100 rounded-full">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-red-800 mb-1">
                          Location Error
                        </div>
                        <p className="text-red-700">{locationError}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setLocationError(null)}
                        className="text-gray-500 hover:text-red-500">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  {/* GPS BUTTON - PROMINENT IN EMERGENCY */}
                  <div className="mb-5">
                    <Button
                      onClick={getCurrentLocation}
                      disabled={locationLoading}
                      className={`w-full p-6 text-white text-lg rounded-xl flex items-center justify-center gap-3 h-auto ${
                        emergencyMode
                          ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                          : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                      }`}>
                      {locationLoading ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin" />
                          <span className="font-bold">
                            Getting your location...
                          </span>
                        </>
                      ) : (
                        <>
                          <Navigation className="w-6 h-6" />
                          <span className="font-bold">
                            {emergencyMode
                              ? "🚨 SHARE MY EXACT LOCATION NOW"
                              : "Use my current location (GPS)"}
                          </span>
                        </>
                      )}
                    </Button>
                    {emergencyMode && (
                      <p className="text-xs text-red-600 mt-2 text-center">
                        This is the fastest way to get help. We'll use your
                        precise GPS coordinates.
                      </p>
                    )}
                  </div>

                  {/* OR DIVIDER */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">OR</span>
                    </div>
                  </div>

                  {/* MANUAL ADDRESS INPUT */}
                  <div className="mb-5">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Enter your address manually
                    </label>
                    <div className="relative">
                      <input
                        ref={addressInputRef}
                        type="text"
                        placeholder="e.g. 45 Abdel Hamid Badawi, Nasr City, Cairo"
                        value={formData.location}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData({ ...formData, location: value });
                          searchLocations(value);
                        }}
                        onFocus={() => {
                          if (formData.location.length >= 3) {
                            setShowAddressSuggestions(true);
                          }
                        }}
                        className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-[#ff6b35] focus:outline-none focus:ring-2 focus:ring-[#ff6b35]/20 transition-all"
                      />

                      {showAddressSuggestions &&
                        addressSuggestions.length > 0 && (
                          <div className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-64 overflow-y-auto">
                            {addressSuggestions.map((suggestion) => (
                              <button
                                key={suggestion.place_id}
                                onClick={() =>
                                  handleSelectLocationSuggestion(suggestion)
                                }
                                className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-start gap-3 border-b border-gray-100 last:border-0">
                                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div className="flex-1">
                                  <div className="text-sm font-medium text-gray-900">
                                    {suggestion.display_name}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}

                      {loadingSuggestions && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* LANDMARK (Optional) */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nearby landmark (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Next to City Mall, behind the mosque..."
                      value={formData.landmark}
                      onChange={(e) =>
                        setFormData({ ...formData, landmark: e.target.value })
                      }
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#ff6b35] focus:outline-none"
                    />
                  </div>

                  {/* VIEW LARGE MAP */}
                  <div>
                    <Button
                      onClick={openMapView}
                      variant="outline"
                      className="w-full p-4 border-2 border-purple-200 hover:border-purple-400 bg-purple-50/30 hover:bg-purple-50 text-purple-700 rounded-xl flex items-center justify-center gap-3 h-auto">
                      <Map className="w-5 h-5" />
                      <span className="font-medium">
                        View Large Map & Select Location
                      </span>
                      <Maximize2 className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* NAVIGATION */}
              <div className="flex gap-4">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={goToPrevStep}
                  className="flex-1 text-lg py-6 rounded-xl border-2">
                  <ArrowLeft className="mr-2 w-5 h-5" />
                  Back
                </Button>
                <Button
                  size="lg"
                  onClick={goToNextStep}
                  disabled={!currentLocation && !formData.location}
                  className={`flex-1 text-white text-lg py-6 rounded-xl shadow-lg ${
                    emergencyMode
                      ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                      : "bg-gradient-to-r from-[#ff6b35] to-[#ff8c5a] hover:from-[#ff6b35]/90 hover:to-[#ff8c5a]/90"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}>
                  {emergencyMode ? "🚨 Find help NOW" : "Continue"}
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ===== STEP 3: CHOOSE HELP - SMART PROVIDER MATCHING ===== */}
        {step === 3 && (
          <div className="animate-fade-in-up space-y-6">
            <div className="text-center mb-6">
              <div
                className={`inline-flex items-center justify-center p-3 rounded-full mb-4 ${
                  emergencyMode ? "bg-red-100" : "bg-[#ff6b35]/10"
                }`}>
                <Users
                  className={`w-8 h-8 ${
                    emergencyMode ? "text-red-600" : "text-[#ff6b35]"
                  }`}
                />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {emergencyMode
                  ? "🚨 Emergency responders near you"
                  : "Available providers"}
              </h1>

              {/* SUMMARY CARD */}
              <div className="max-w-3xl mx-auto bg-white rounded-xl border-2 border-gray-200 p-4 mb-6">
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {detectedProblem && (
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${getUrgencyColor(detectedProblem.urgencyLevel)}`}>
                      <AlertCircle className="w-4 h-4" />
                      {detectedProblem.name}
                    </span>
                  )}
                  {currentLocation && (
                    <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Location set
                    </span>
                  )}
                  <span className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                    {filteredProviders.length} providers found
                  </span>
                </div>
              </div>
            </div>

            {/* EMERGENCY COUNTDOWN */}
            {emergencyMode && isSubmitting === false && (
              <div className="max-w-3xl mx-auto mb-6">
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-100 rounded-full">
                        <Clock className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <span className="font-bold text-amber-800">
                          Average response time:{" "}
                        </span>
                        <span className="text-amber-900">
                          8-12 minutes in your area
                        </span>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-amber-200 rounded-full text-sm font-bold text-amber-800">
                      FASTEST: 8 min
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* FILTERS */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setProviderType("mobile")}
                  variant={providerType === "mobile" ? "default" : "outline"}
                  className={`rounded-full ${
                    providerType === "mobile"
                      ? emergencyMode
                        ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
                        : "bg-gradient-to-r from-[#ff6b35] to-[#ff8c5a] text-white"
                      : "border-gray-300"
                  }`}>
                  <Car className="w-4 h-4 mr-2" />
                  Mobile (
                  {
                    mockProviders.filter(
                      (p) => p.type === "mobile" && p.emergencyResponse,
                    ).length
                  }
                  )
                </Button>
                <Button
                  onClick={() => setProviderType("tow")}
                  variant={providerType === "tow" ? "default" : "outline"}
                  className={`rounded-full ${
                    providerType === "tow"
                      ? emergencyMode
                        ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
                        : "bg-gradient-to-r from-[#ff6b35] to-[#ff8c5a] text-white"
                      : "border-gray-300"
                  }`}>
                  <Truck className="w-4 h-4 mr-2" />
                  Tow Truck (
                  {mockProviders.filter((p) => p.type === "tow").length})
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="rounded-full border-gray-300">
                  <Filter className="w-4 h-4 mr-2" />
                  Sort & Filter
                </Button>
                {emergencyMode && (
                  <div className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-bold flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    EMERGENCY RESPONDERS ONLY
                  </div>
                )}
              </div>
            </div>

            {/* SORT PANEL */}
            {showFilters && (
              <Card className="mb-6 border-2 border-gray-200">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sort by
                      </label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-[#ff6b35] focus:outline-none">
                        <option value="distance">
                          Distance (Nearest first)
                        </option>
                        <option value="rating">Rating (Highest first)</option>
                        <option value="response">
                          Response Time (Fastest first)
                        </option>
                        <option value="experience">
                          Experience (Most years)
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price range
                      </label>
                      <select
                        value={priceFilter}
                        onChange={(e) => setPriceFilter(e.target.value)}
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-[#ff6b35] focus:outline-none">
                        <option value="all">All prices</option>
                        <option value="budget">Budget</option>
                        <option value="medium">Medium</option>
                        <option value="premium">Premium</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search provider
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Name or specialty..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-[#ff6b35] focus:outline-none pr-10"
                        />
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* PROVIDERS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredProviders.map((provider) => (
                <Card
                  key={provider.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-xl relative ${
                    selectedProvider?.id === provider.id
                      ? emergencyMode
                        ? "ring-4 ring-red-500 shadow-2xl"
                        : "ring-4 ring-[#ff6b35] shadow-2xl"
                      : "hover:border-gray-300"
                  } ${
                    provider.emergencyResponse && emergencyMode
                      ? "border-2 border-red-300 bg-gradient-to-br from-white to-red-50"
                      : ""
                  }`}
                  onClick={() => handleSelectProvider(provider)}>
                  {/* EMERGENCY BADGE */}
                  {provider.badge === "emergency" && (
                    <div className="absolute -top-3 -right-3 z-20">
                      <div className="px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                        <Zap className="w-3 h-3" />
                        24/7 EMERGENCY
                      </div>
                    </div>
                  )}

                  <CardContent className="p-6">
                    {/* PROVIDER HEADER */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative">
                        <img
                          src={provider.avatar}
                          alt={provider.name}
                          className="w-16 h-16 rounded-full border-2 border-gray-200"
                        />
                        {provider.badge && (
                          <div
                            className={`absolute -top-1 -right-1 p-1.5 rounded-full ${
                              provider.badge === "top"
                                ? "bg-yellow-400"
                                : provider.badge === "verified"
                                  ? "bg-blue-500"
                                  : provider.badge === "express"
                                    ? "bg-purple-500"
                                    : "bg-red-500"
                            }`}>
                            {getBadgeIcon(provider.badge)}
                          </div>
                        )}
                        {provider.availability === "available" && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold">{provider.name}</h3>
                          {getProviderTypeIcon(provider.type)}
                        </div>

                        <div className="flex items-center gap-3 text-sm mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold">{provider.rating}</span>
                            <span className="text-gray-500">
                              ({provider.reviews})
                            </span>
                          </div>
                          <div
                            className={`px-2 py-1 rounded-full text-xs font-bold ${
                              provider.availability === "available"
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-orange-700"
                            }`}>
                            {provider.availability === "available"
                              ? "Available now"
                              : "Busy"}
                          </div>
                        </div>

                        {/* SPECIALIST TAGS */}
                        <div className="flex flex-wrap gap-1 mb-2">
                          {provider.specialistType
                            .slice(0, 3)
                            .map((type, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                                {getSpecialistLabel(type).replace(
                                  /[🔧⚡🛞❄️⛽🔋💻🚛🛠️]/g,
                                  "",
                                )}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>

                    {/* QUICK STATS */}
                    <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <MapPin className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                        <div className="text-sm font-bold">
                          {provider.distance} km
                        </div>
                        <div className="text-xs text-gray-500">Distance</div>
                      </div>
                      <div className="text-center">
                        <Clock className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                        <div className="text-sm font-bold text-green-600">
                          {provider.estimatedArrival}
                        </div>
                        <div className="text-xs text-gray-500">ETA</div>
                      </div>
                      <div className="text-center">
                        <BriefcaseIcon className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                        <div className="text-sm font-bold">
                          {provider.completedJobs}
                        </div>
                        <div className="text-xs text-gray-500">Jobs</div>
                      </div>
                    </div>

                    {/* SPECIALTIES */}
                    <div className="mb-4">
                      <div className="text-xs font-bold text-gray-500 mb-2">
                        SPECIALTIES
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {provider.specialties
                          .slice(0, 3)
                          .map((specialty, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                              {specialty}
                            </span>
                          ))}
                      </div>
                    </div>

                    {/* PRICE ESTIMATE - Only for selected provider */}
                    {selectedProvider?.id === provider.id && estimatedPrice && (
                      <div className="mb-4 p-3 bg-gradient-to-r from-[#ff6b35]/10 to-[#ff8c5a]/10 rounded-lg border border-[#ff6b35]/30">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">
                            Estimate:
                          </span>
                          <span className="text-xl font-bold text-[#ff6b35]">
                            {estimatedPrice} EGP
                          </span>
                        </div>
                        {priceRange && (
                          <div className="text-xs text-gray-500 mt-1">
                            Range: {priceRange.min} - {priceRange.max} EGP
                          </div>
                        )}
                      </div>
                    )}

                    {/* ACTION BUTTONS */}
                    <div className="space-y-3">
                      <Button
                        size="lg"
                        disabled={isSubmitting}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectProvider(provider);
                          handleConfirmBooking();
                        }}
                        className={`w-full text-white rounded-xl py-6 ${
                          emergencyMode
                            ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                            : "bg-gradient-to-r from-[#ff6b35] to-[#ff8c5a] hover:from-[#ff6b35]/90 hover:to-[#ff8c5a]/90"
                        }`}>
                        {isSubmitting &&
                        selectedProvider?.id === provider.id ? (
                          <>
                            <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                            Dispatching...
                          </>
                        ) : (
                          <>
                            {emergencyMode
                              ? "🚨 SEND EMERGENCY HELP"
                              : "Book Now"}
                            {emergencyMode && <Zap className="ml-2 w-5 h-5" />}
                          </>
                        )}
                      </Button>

                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCallProvider(provider.phone);
                          }}
                          variant="outline"
                          className="border-2">
                          <PhoneCall className="mr-2 w-4 h-4" />
                          Call
                        </Button>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleWhatsAppProvider(provider.phone);
                          }}
                          variant="outline"
                          className="border-2">
                          <MessageCircle className="mr-2 w-4 h-4" />
                          WhatsApp
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* NO PROVIDERS FOUND */}
            {filteredProviders.length === 0 && (
              <Card className="border-2 border-gray-200">
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">
                    No providers available right now
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {emergencyMode
                      ? "This is unusual. Please call emergency services or try changing your location."
                      : "Try changing your filters or selecting a different service."}
                  </p>
                  {emergencyMode && (
                    <Button
                      onClick={() => window.open("tel:19654", "_self")}
                      className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 text-lg rounded-xl">
                      <PhoneCall className="mr-2 w-5 h-5" />
                      Call Emergency Roadside: 19654
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* NAVIGATION */}
            <div className="flex gap-4 pt-6">
              <Button
                size="lg"
                variant="outline"
                onClick={goToPrevStep}
                className="flex-1 text-lg py-6 rounded-xl border-2">
                <ArrowLeft className="mr-2 w-5 h-5" />
                Back
              </Button>
            </div>
          </div>
        )}

        {/* ===== STEP 4: CONFIRMATION & TRACKING ===== */}
        {step === 4 && submitSuccess && bookingData && (
          <div className="animate-fade-in-up text-center space-y-8">
            {/* SUCCESS ANIMATION */}
            <div className="relative">
              <div
                className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center ${
                  emergencyMode ? "bg-red-100" : "bg-green-100"
                }`}>
                {emergencyMode ? (
                  <Truck className="w-20 h-20 text-red-500 animate-pulse" />
                ) : (
                  <CheckCircle className="w-20 h-20 text-green-500" />
                )}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className={`w-32 h-32 rounded-full border-4 ${
                    emergencyMode ? "border-red-500" : "border-green-500"
                  } animate-ping`}
                />
              </div>
            </div>

            {/* SUCCESS MESSAGE */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {emergencyMode
                  ? "🚨 HELP IS ON THE WAY!"
                  : "Request Submitted Successfully!"}
              </h1>
              <p className="text-xl text-gray-600">
                {bookingData.provider.name} - {bookingData.estimatedArrival}
              </p>
            </div>

            {/* TRACKING CARD */}
            <Card className="max-w-3xl mx-auto border-2 border-green-200 shadow-xl">
              <CardContent className="p-8 space-y-6">
                {/* ETA COUNTDOWN */}
                <div className="text-center p-6 bg-gradient-to-br from-[#ff6b35]/10 to-[#ff8c5a]/10 rounded-xl">
                  <div className="text-sm font-medium text-gray-600 mb-2">
                    Estimated arrival time
                  </div>
                  <div className="text-5xl font-bold text-[#ff6b35] font-mono">
                    {bookingData.estimatedArrival}
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    Provider is on the way
                  </div>
                </div>

                {/* PROVIDER INFO */}
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                  <img
                    src={bookingData.provider.avatar}
                    alt={bookingData.provider.name}
                    className="w-16 h-16 rounded-full border-2 border-white shadow"
                  />
                  <div className="flex-1 text-left">
                    <div className="font-bold text-lg text-gray-800">
                      {bookingData.provider.name}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>
                        {bookingData.provider.rating} (
                        {bookingData.provider.reviews} reviews)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <Phone className="w-4 h-4" />
                      <span>{bookingData.provider.phone}</span>
                    </div>
                  </div>
                </div>

                {/* PROBLEM & LOCATION SUMMARY */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                      <span className="font-bold text-gray-700">Problem</span>
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {bookingData.problem.detectedCategory?.name ||
                        "Roadside Assistance"}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {bookingData.problem.symptoms.slice(0, 2).join(", ")}
                    </div>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-5 h-5 text-purple-600" />
                      <span className="font-bold text-gray-700">Location</span>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {bookingData.location.address}
                    </div>
                    {bookingData.location.landmark && (
                      <div className="text-xs text-gray-600 mt-1">
                        Landmark: {bookingData.location.landmark}
                      </div>
                    )}
                  </div>
                </div>

                {/* REQUEST ID */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Request ID
                    </span>
                    <span className="text-lg font-bold text-[#ff6b35] font-mono">
                      {bookingData.requestId}
                    </span>
                  </div>
                </div>

                {/* EMERGENCY CONTACT BUTTONS */}
                <div className="flex items-center justify-around md:grid-cols-3 gap-3 pt-4">
                  <Button
                    onClick={() =>
                      handleCallProvider(bookingData.provider.phone)
                    }
                    className="bg-green-500 hover:bg-green-600 text-white py-6 text-lg">
                    <PhoneCall className="mr-2 w-5 h-5" />
                    Call
                  </Button>
                  <Button
                    onClick={() =>
                      handleWhatsAppProvider(bookingData.provider.phone)
                    }
                    className="bg-[#25D366] hover:bg-[#20ba5c] text-white py-6 text-lg">
                    <MessageCircle className="mr-2 w-5 h-5" />
                    WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* ACTION BUTTONS */}
            <div className="flex gap-4 justify-center">
              <Button
                size="lg"
                onClick={handleNewEmergency}
                className="bg-gradient-to-r from-[#ff6b35] to-[#ff8c5a] hover:from-[#ff6b35]/90 hover:to-[#ff8c5a]/90 text-white px-10 py-6 rounded-xl text-lg shadow-lg">
                <AlertCircle className="mr-2 w-5 h-5" />
                New Emergency Request
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/")}
                className="px-10 py-6 rounded-xl text-lg border-2">
                Back to Home
              </Button>
            </div>
          </div>
        )}

        {/* ===== MAP MODAL ===== */}
        {showMapModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-purple-50 to-white">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <Map className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Select Location on Map
                    </h2>
                    <p className="text-sm text-gray-600">
                      Search for a location or click to select
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeMapView}
                  className="rounded-full hover:bg-gray-100">
                  <X className="w-6 h-6" />
                </Button>
              </div>

              {/* Modal Body */}
              <div className="p-6 flex-1 overflow-auto">
                {/* Search Bar */}
                <div className="mb-6">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search for an address, city, or landmark..."
                      value={mapSearchQuery}
                      onChange={(e) => {
                        const value = e.target.value;
                        setMapSearchQuery(value);
                        searchMapLocations(value);
                      }}
                      className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 pr-12"
                    />
                    <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {/* Map Simulation */}
                <div className="mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-6 h-80 relative overflow-hidden border-2 border-gray-300">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)",
                      backgroundSize: "40px 40px",
                    }}
                  />

                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                    <div className="relative">
                      <div className="w-8 h-8 bg-[#ff6b35] rounded-full flex items-center justify-center animate-pulse">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-white px-3 py-1 rounded-full shadow-lg text-sm font-bold">
                        Selected Location
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-3 rounded-lg shadow-lg z-30">
                    <div className="flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-[#ff6b35]" />
                      <span className="text-sm font-medium">
                        {selectedMapLocation
                          ? `Selected: ${selectedMapLocation.display_name.substring(0, 40)}...`
                          : "Click on map or search to select a location"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Search Results */}
                {mapSuggestions.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Search Results
                    </h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {mapSuggestions.map((suggestion) => (
                        <button
                          key={suggestion.place_id}
                          onClick={() => handleSelectMapLocation(suggestion)}
                          className={`w-full p-4 text-left rounded-xl border-2 transition-all flex items-start gap-3 ${
                            selectedMapLocation?.place_id ===
                            suggestion.place_id
                              ? "border-purple-500 bg-purple-50"
                              : "border-gray-200 hover:border-purple-300 bg-white"
                          }`}>
                          <MapPin
                            className={`w-5 h-5 mt-0.5 ${
                              selectedMapLocation?.place_id ===
                              suggestion.place_id
                                ? "text-purple-600"
                                : "text-gray-400"
                            }`}
                          />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              {suggestion.display_name}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Lat: {suggestion.lat}, Lon: {suggestion.lon}
                            </div>
                          </div>
                          {selectedMapLocation?.place_id ===
                            suggestion.place_id && (
                            <CheckCircle className="w-5 h-5 text-purple-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex gap-3">
                  <Button
                    onClick={useCurrentLocationInMap}
                    variant="outline"
                    className="flex-1 py-3 border-2 border-blue-200 hover:border-blue-400 bg-blue-50/30 hover:bg-blue-50 text-blue-700 rounded-xl">
                    <Navigation className="w-4 h-4 mr-2" />
                    Use My Current Location
                  </Button>
                  <Button
                    onClick={confirmMapLocation}
                    disabled={!selectedMapLocation}
                    className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl disabled:opacity-50">
                    Confirm Selected Location
                    <CheckCircle className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* GLOBAL STYLES */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out;
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
