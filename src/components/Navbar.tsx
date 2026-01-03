import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import {
  LogOut,
  LayoutDashboard,
  X,
  Search,
  Wrench,
  Shield,
  Car,
  Plus,
} from "lucide-react";
import {
  ChevronRight,
  Package,
  ShoppingCart,
  User,
  Truck,
  Settings,
  Droplets,
  Zap,
  Filter,
  Circle,
  Gauge,
  Wind,
} from "lucide-react";
import { GiCarWheel, GiStoneWheel, GiTyre } from "react-icons/gi";
import { IoIosColorFill } from "react-icons/io";
import { LiaFilterSolid } from "react-icons/lia";
import { PiGarageLight } from "react-icons/pi";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

//* Imported Images
import logo from "../../public/Logo.png";
import { useEffect, useState } from "react";
import { FaCar, FaMotorcycle, FaOilCan } from "react-icons/fa";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [garageOpen, setGarageOpen] = useState(false);
  const [myVehicles, setMyVehicles] = useState([
    { id: 1, name: "BMW 320i", year: "2018" },
  ]);
  const { getCartCount } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const cartCount = getCartCount();

  // Car Brands List
  // const carBrands = [
  //   "Toyota",
  //   "Honda",
  //   "Nissan",
  //   "Mazda",
  //   "Hyundai",
  //   "Kia",
  //   "BMW",
  //   "Mercedes-Benz",
  //   "Audi",
  //   "Volkswagen",
  //   "Ford",
  //   "Chevrolet",
  //   "Peugeot",
  //   "Renault",
  //   "Citroen",
  //   "Fiat",
  // ];

  // Car Parts Categories - بدون subcategories
  const carPartsCategories = [
    {
      name: "Car Brands",
      icon: FaCar,
      category: "brands", // معرف خاص للبراندات
    },
    {
      name: "Engine oil",
      icon: Droplets,
      category: "Engine Oil",
    },
    {
      name: "Tyres",
      icon: Circle,
      category: "Tyres",
    },
    {
      name: "Oils and fluids",
      icon: Droplets,
      category: "Oils and fluids",
    },
    {
      name: "Brakes",
      icon: Shield,
      category: "Brakes",
    },
    {
      name: "Filters",
      icon: Filter,
      category: "Filters",
    },
    {
      name: "Engine",
      icon: Settings,
      category: "Engine",
    },
    {
      name: "Electrics",
      icon: Zap,
      category: "Electrics",
    },
    {
      name: "Suspension",
      icon: Gauge,
      category: "Suspension",
    },
    {
      name: "Wiper and washer system",
      icon: Wind,
      category: "Wiper and washer system",
    },
    {
      name: "Ignition and preheating",
      icon: Zap,
      category: "Ignition and preheating",
    },
    {
      name: "Damping",
      icon: Gauge,
      category: "Damping",
    },
    {
      name: "Belts, chains, rollers",
      icon: Settings,
      category: "Belts, chains, rollers",
    },
  ];

  // حدّد وقت انتهاء العرض
  const targetDate = new Date("2025-12-31T23:59:59").getTime();

  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft(null);
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // دالة البحث الشاملة
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(
        `/products?search=${encodeURIComponent(searchQuery)}&filter=all`
      );
    }
  };

  // دالة للتعامل مع الضغط على المنتج
  const handleCategoryClick = (category) => {
    if (category.category === "products") {
      // إذا كان Car Brands، نعرض كل البراندات
      navigate(`/products`);
    } else {
      // للمنتجات الأخرى، ننتقل مباشرة للكاتيجوري
      navigate(`/products`);
    }
    setMenuOpen(false);
  };

  const addVehicle = () => {
    const vehicleName = prompt("Enter vehicle name (e.g., BMW 320i):");
    const vehicleYear = prompt("Enter vehicle year:");
    if (vehicleName && vehicleYear) {
      setMyVehicles([
        ...myVehicles,
        { id: Date.now(), name: vehicleName, year: vehicleYear },
      ]);
    }
  };

  const userIsAdmin = isAdmin();

  return (
    <>
      {/* Top Bar - Hidden for Admin */}
      {!userIsAdmin && (
        <div className="w-full z-50 bg-[#041a24] p-3 sm:px-6">
          <div className="w-full font-semibold relative left-0 mx-auto flex items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm">
            <Link
              to="/products"
              className="text-gray-300 focus:text-[#ff8555] hover:text-[#ff8555]  font-medium">
              SHOP
            </Link>
            <Link
              to="/ourServices"
              className="text-gray-300 focus:text-[#ff8555] hover:text-[#ff8555] transition-colors">
              OUR SERVICES
            </Link>
          </div>

          <div className="w-full bg-gradient-to-r mt-5 from-orange-500 to-orange-600 text-white text-xs">
            <div className="max-w-7xl mx-auto flex justify-around items-center px-3">
              <div className="overflow-hidden w-[%90] bg-orange-600 py-2">
                <div className="whitespace-nowrap animate-marquee inline-block">
                  <span className="font-medium text-[14px] text-white px-4">
                    Celebrate the holiday with Christmas deals! Up to{" "}
                    <strong>-32%</strong> compared to the RRP
                  </span>
                </div>
              </div>

              {timeLeft && (
                <span
                  style={{ letterSpacing: "2px" }}
                  className="flex items-center gap-1 font-semibold whitespace-nowrap">
                  OFFER ENDS IN:
                  <span
                    style={{ letterSpacing: "2px" }}
                    className="bg-white/20 px-2 rounded">
                    {String(timeLeft.hours).padStart(2, "0")}:
                    {String(timeLeft.minutes).padStart(2, "0")}:
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <nav
        className={`${
          !userIsAdmin ? "top-[42px]" : "top-0"
        } w-full bg-[#132530] z-50 shadow-lg border-b border-[#1a3a5a]`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-2 sm:gap-6">
            {/* Left Section - Menu Button & Logo (Mobile) */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Dropdown Menu */}
              {!userIsAdmin && (
                <div className="relative top-9 -left-5">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-2 bg-[#041a24] text-white px-24 py-2.5 rounded "
                    aria-label="Car parts menu">
                    <div className="flex relative right-20 items-center gap-2 w-full text-left">
                      <FaCar className="text-lg flex-shrink-0" />
                      <span className="text-sm  font-semibold flex-shrink-0">
                        Car parts
                      </span>
                    </div>

                    <ChevronRight
                      size={16}
                      className="transition-transform border-l-2 border-gray-800 absolute right-0 mr-2"
                    />
                  </button>
                </div>
              )}

              {/* Logo - Visible on Mobile */}
              <Link to="/" className="flex md:hidden items-center">
                <img
                  src={logo}
                  alt="SpareCar"
                  className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                />
                <h1
                  style={{ fontFamily: "Orbitron, sans-serif" }}
                  className="text-sm sm:text-base text-white font-bold tracking-widest ml-1">
                  SPARECAR
                </h1>
              </Link>
            </div>

            {/* Center Section - Logo & Search (Desktop) */}
            {!userIsAdmin && (
              <div className="hidden md:flex flex-1 max-w-3xl flex-col items-center justify-center gap-3">
                <Link to="/" className="flex items-center important mr-20">
                  <img
                    src={logo}
                    alt="SpareCar"
                    className="w-14 h-14 lg:w-16 lg:h-16 object-contain"
                  />
                  <h1
                    style={{ fontFamily: "Orbitron, sans-serif" }}
                    className="text-base lg:text-2xl text-white font-bold tracking-widest">
                    SPARECAR
                  </h1>
                </Link>
                {/* Search Bar */}
                <div className="searchBar flex mr-5 gap-2 w-full">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSearch(e);
                      }
                    }}
                    placeholder="Enter the part number, name, or brand"
                    className="flex-1 bg-white text-gray-900 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#ff6b35] placeholder:text-gray-500 text-sm"
                  />
                  <button
                    onClick={handleSearch}
                    className="bg-[#007bff] hover:bg-[#0056b3] text-white px-4 lg:px-6 py-2.5  flex items-center gap-2 transition-colors font-medium text-sm whitespace-nowrap">
                    <Search size={16} />
                    <span className="hidden sm:inline">SEARCH</span>
                  </button>

                  {/* Cart - Customer Only */}
                  {!userIsAdmin && (
                    <Link
                      to="/cart"
                      className=" absolute right-0 mr-12 bg-[#041a24] p-1 px-5 max-w-full group flex items-center">
                      <div className="flex  items-center gap-5 text-gray-300 hover:text-white transition-colors">
                        <div className="relative">
                          <ShoppingCart size={22} className="" />
                          {cartCount > 0 && (
                            <Badge className="absolute -top-2 -right-2 h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center p-0 text-xs bg-[#ff6b35] text-white hover:bg-[#ff6b35] border-2 border-[#0d1b2a]">
                              {cartCount}
                            </Badge>
                          )}
                        </div>
                        <div className="hidden sm:flex items-center gap-1 text-xs mt-1">
                          <div>
                            <h2 className="text-gray-100 text-[16px] font-medium flex flex-col-reverse">
                              <span>0</span> items
                            </h2>
                          </div>
                          <span className="text-white font-medium text-[16px] ml-5">
                            £0.00
                          </span>
                        </div>
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Right Section - Icons & User */}
            <div className="flex mb-8 items-center gap-2 sm:gap-4">
              {/* My Garage - Customer Only */}
              {!userIsAdmin && (
                <div className="relative">
                  <button
                    onClick={() => setGarageOpen(!garageOpen)}
                    className="hidden lg:flex flex-col items-center text-gray-300 hover:text-white transition-colors group">
                    <div className="flex items-center gap-1">
                      <PiGarageLight
                        size={20}
                        className="group-hover:text-[#ff6b35]"
                      />
                      <span className="text-xs">My Garage</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {myVehicles.length} vehicle
                      {myVehicles.length !== 1 ? "s" : ""}
                    </span>
                  </button>

                  {/* Garage Dropdown */}
                  {garageOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setGarageOpen(false)}
                      />
                      <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-lg shadow-xl z-50 overflow-hidden">
                        <div className="bg-[#0d1b2a] text-white p-4">
                          <h3 className="font-semibold text-lg">My Garage</h3>
                          <p className="text-xs text-gray-300 mt-1">
                            Manage your vehicles
                          </p>
                        </div>
                        <div className="p-4 max-h-64 overflow-y-auto">
                          {myVehicles.map((vehicle) => (
                            <div
                              key={vehicle.id}
                              className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg mb-2 cursor-pointer">
                              <Car size={24} className="text-[#007bff]" />
                              <div>
                                <p className="font-medium text-gray-900">
                                  {vehicle.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {vehicle.year}
                                </p>
                              </div>
                            </div>
                          ))}
                          <button
                            onClick={addVehicle}
                            className="w-full mt-2 flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#007bff] hover:bg-blue-50 transition-colors text-gray-600 hover:text-[#007bff]">
                            <Plus size={20} />
                            <span className="text-sm font-medium">
                              Add Vehicle
                            </span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* User Menu */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex flex-col items-center text-gray-300 hover:text-white transition-colors group">
                      <User size={18} className="group-hover:text-[#ff6b35]" />
                      <span className="hidden sm:block text-xs mt-1">
                        {userIsAdmin ? "Admin" : "My SPARECAR"}
                      </span>
                      <span className="hidden lg:block text-xs text-gray-500">
                        {user.name}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 bg-[#0d1b2a] border-[#1a3a5a] text-white">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                      {userIsAdmin && (
                        <Badge className="mt-1 bg-[#ff6b35]">Admin</Badge>
                      )}
                    </div>
                    <DropdownMenuSeparator className="bg-[#1a3a5a]" />

                    {!userIsAdmin && (
                      <DropdownMenuItem
                        onClick={() => navigate("/profile")}
                        className="hover:bg-[#1a3a5a] cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profile & Orders
                      </DropdownMenuItem>
                    )}

                    {userIsAdmin && (
                      <DropdownMenuItem
                        onClick={() => navigate("/admin")}
                        className="hover:bg-[#1a3a5a] cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator className="bg-[#1a3a5a]" />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="hover:bg-[#1a3a5a] cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/login">
                  <button className="flex flex-col items-center text-gray-300 hover:text-white transition-colors group">
                    <User size={18} className="group-hover:text-[#ff6b35]" />
                    <span className="hidden sm:block text-xs mt-1">
                      My SPARECAR
                    </span>
                    <span className="hidden sm:block text-xs text-gray-500">
                      Sign in
                    </span>
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Secondary Navigation Bar - Customer Only */}
        {!userIsAdmin && (
          <div className="bg-[#132530] min-w-full flex justify-center items-center p-2 scrollbar-hide">
            <div className="max-w-full mx-auto px-3 sm:px-6 py-2">
              <div className="flex items-center gap-3 lg:gap-12 sm:gap-6 text-xs sm:text-sm whitespace-nowrap">
                <Link
                  to="/products?category=Truck Parts"
                  className="text-gray-400 font-semibold hover:text-[#ff6b35] transition-colors flex items-center gap-2">
                  <Truck size={22} className="sm:w-[22px] sm:h-[22px]" />
                  <span className="font-semibold">Truck parts</span>
                </Link>
                <Link
                  to="/products?category=Accessories"
                  className="text-gray-400 font-semibold hover:text-[#ff6b35] transition-colors flex items-center gap-2">
                  <IoIosColorFill
                    size={22}
                    className="sm:w-[22px] sm:h-[22px]"
                  />
                  <span className="font-semibold">Car Accessories</span>
                </Link>
                <Link
                  to="/products?category=Engine Oil"
                  className="text-gray-400 font-semibold hover:text-[#ff6b35] transition-colors flex items-center gap-2">
                  <FaOilCan size={22} className="sm:w-[22px] sm:h-[22px]" />
                  <span className="font-semibold">Engine oil</span>
                </Link>
                <Link
                  to="/products?category=Filters"
                  className="text-gray-400 font-semibold hover:text-[#ff6b35] transition-colors flex items-center gap-2">
                  <LiaFilterSolid
                    size={22}
                    className="sm:w-[22px] sm:h-[22px]"
                  />
                  <span className="font-semibold">Filters</span>
                </Link>
                <Link
                  to="/products?category=Brakes"
                  className="text-gray-400 font-semibold hover:text-[#ff6b35] transition-colors flex items-center gap-2">
                  <GiStoneWheel size={22} className="sm:w-[22px] sm:h-[22px]" />
                  <span className="font-semibold">Brakes</span>
                </Link>
                <Link
                  to="/products?category=Motorcycle"
                  className="text-gray-400 font-semibold hover:text-[#ff6b35] transition-colors flex items-center gap-2">
                  <FaMotorcycle size={22} className="sm:w-[22px] sm:h-[22px]" />
                  <span className="font-semibold">Motorcycle parts</span>
                </Link>
                <Link
                  to="/products?category=Tyres"
                  className="hidden sm:flex text-gray-400 font-semibold hover:text-[#ff6b35] transition-colors items-center gap-2">
                  <GiTyre size={22} />
                  <span className="font-semibold">Tyres</span>
                </Link>
                <Link
                  to="/products?category=Wheels"
                  className="hidden md:flex text-gray-400 font-semibold hover:text-[#ff6b35] transition-colors items-center gap-2">
                  <GiCarWheel size={22} />
                  <span className="font-semibold">Wheels</span>
                </Link>
                <Link
                  to="/products?category=Tools"
                  className="hidden lg:flex text-gray-400 font-semibold hover:text-[#ff6b35] transition-colors items-center gap-2">
                  <Wrench size={22} />
                  <span className="font-semibold">Tools</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Overlay & Sidebar - Customer Only */}
      {!userIsAdmin && (
        <>
          {/* Overlay */}
          <div
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-300 ${
              menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
            onClick={() => setMenuOpen(false)}
          />

          {/* Sidebar with Car Parts Menu */}
          <div
            className={`fixed top-0 left-0 h-full w-full sm:w-[380px] md:w-[320px] bg-[#fff] shadow-2xl z-50 transition-transform duration-300 overflow-y-auto ${
              menuOpen ? "translate-x-0" : "translate-x-[-100%]"
            }`}>
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-end bg-[#fff] border-b border-gray-700 px-4 py-4">
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="text-gray-900 transition-colors hover:text-gray-800">
                <X size={24} />
              </button>
            </div>

            {/* Search in Sidebar - Mobile Only */}
            <div className="md:hidden px-4 py-3 bg-[#eee] border-b border-gray-500">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSearch(e);
                    }
                  }}
                  placeholder="Search parts or brands..."
                  className="w-full bg-[#eee] text-[#111] px-4 py-2.5 pr-12 rounded-md focus:outline-none focus:ring-2 focus:ring-[#111] placeholder:text-gray-900 text-sm border border-gray-600"
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#007bff] hover:bg-[#0056b3] text-white p-2 rounded-md transition-colors">
                  <Search size={16} />
                </button>
              </div>
            </div>

            {/* Car Parts Categories - بدون Subcategories */}
            <div className="px-4 bg-[#fff] sm:px-6 py-4">
              {carPartsCategories.map((category, index) => {
                const IconComponent = category.icon;

                return (
                  <div
                    key={index}
                    onClick={() => handleCategoryClick(category)}
                    className="mb-3 cursor-pointer">
                    <div className="w-full flex items-center justify-between py-3 px-4 bg-white hover:bg-[#ff6b35] transition-all rounded-lg border border-gray-200 hover:border-[#ff6b35]">
                      <div className="flex items-center gap-3">
                        <IconComponent size={20} className="text-[#111]" />
                        <h3 className="text-sm sm:text-base text-gray-950 font-medium">
                          {category.name}
                        </h3>
                      </div>

                    </div>
                  </div>
                );
              })}

              {/* Additional Menu Sections */}
              <div className="mt-6 pt-6 border-t border-gray-500">
                <h3 className="text-[#222] font-semibold mb-3 px-3">
                  Quick Links
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      navigate("/products");
                      setMenuOpen(false);
                    }}
                    className="w-full text-left text-gray-900 hover:bg-[#2222221f] px-3 py-2.5 rounded-lg flex items-center gap-3">
                    <Package size={18} className="text-[#ff6b35]" />
                    <span>All Products</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate("/cart");
                      setMenuOpen(false);
                    }}
                    className="w-full text-left text-gray-900 hover:bg-[#2222221f]  px-3 py-2.5 rounded-lg flex items-center gap-3">
                    <ShoppingCart size={18} className="text-[#ff6b35]" />
                    <span>Shopping Cart</span>
                  </button>
                  {user && (
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setMenuOpen(false);
                      }}
                      className="w-full text-left text-gray-900 hover:bg-[#2222221f]  px-3 py-2.5 rounded-lg flex items-center gap-3">
                      <User size={18} className="text-[#ff6b35]" />
                      <span>My Orders</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

type TimeBoxProps = {
  label: string;
  value: number;
};

function TimeBox({ label, value }: TimeBoxProps) {
  return (
    <div className="bg-white/20 px-3 py-1 rounded-md min-w-[60px]">
      <div className="text-lg font-bold leading-none">{value}</div>
      <div className="text-xs uppercase">{label}</div>
    </div>
  );
}
