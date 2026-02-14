// frontend/src/components/layouts/VendorLayout.tsx
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Store,
  ChevronRight,
  Bell,
  HelpCircle,
  CreditCard,
  Shield,
  TrendingUp,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function VendorLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [vendorData, setVendorData] = useState<any>(null);
  const [notifications, setNotifications] = useState(3);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/vendor/login");
      return;
    }

    // Fetch vendor data
    fetchVendorData();
  }, []);

  const fetchVendorData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/vendor/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = await response.json();
      if (data.success) {
        setVendorData(data.vendor);
      }
    } catch (error) {
      console.error("Error fetching vendor data:", error);
    }
  };

  const navItems = [
    { path: "/vendor/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/vendor/products", label: "Products", icon: Package },
    { path: "/vendor/orders", label: "Orders", icon: ShoppingCart },
    { path: "/vendor/analytics", label: "Analytics", icon: BarChart3 },
    { path: "/vendor/settings", label: "Settings", icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("vendorId");
    toast.success("Logged out successfully");
    navigate("/vendor/login");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-white border-r border-gray-200 w-64 fixed lg:relative h-full z-50 lg:z-auto transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-lg">Vendor Panel</h2>
              <p className="text-xs text-gray-500">Automotive Parts</p>
            </div>
          </div>

          {/* Vendor Info */}
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 border-2 border-white">
                <AvatarImage
                  src={vendorData?.logo || vendorData?.avatar}
                  alt={vendorData?.businessName}
                />
                <AvatarFallback className="bg-orange-500 text-white">
                  {vendorData?.businessName
                    ? getInitials(vendorData.businessName)
                    : "V"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {vendorData?.businessName || "Loading..."}
                </p>
                <p className="text-xs text-gray-600 truncate">
                  {vendorData?.email || ""}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-orange-50 text-orange-600 font-semibold border-l-4 border-orange-500"
                    : "text-gray-600 hover:bg-gray-50"
                }`}>
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
                {isActive && (
                  <ChevronRight className="w-4 h-4 ml-auto text-orange-500" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Quick Links */}
        <div className="p-4 border-t border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Quick Links
          </h3>
          <div className="space-y-2">
            <a
              href="#"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-600 p-2 rounded hover:bg-gray-50">
              <HelpCircle className="w-4 h-4" />
              Help Center
            </a>
            <a
              href="#"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-600 p-2 rounded hover:bg-gray-50">
              <CreditCard className="w-4 h-4" />
              Payments
            </a>
            <a
              href="#"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-600 p-2 rounded hover:bg-gray-50">
              <Shield className="w-4 h-4" />
              Security
            </a>
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-colors">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        {/* Store Status */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Store Status</p>
              <Badge className="mt-1 bg-green-100 text-green-800 hover:bg-green-100">
                Online
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Rating</p>
              <div className="flex items-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-500 text-xs">
                    ★
                  </span>
                ))}
                <span className="text-xs text-gray-600 ml-1">4.8</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
                <Menu className="w-5 h-5" />
              </button>

              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {navItems.find((item) => item.path === location.pathname)
                    ?.label || "Dashboard"}
                </h1>
                <p className="text-sm text-gray-600">
                  Manage your store and track performance
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <div className="relative">
                <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                  <Bell className="w-5 h-5 text-gray-600" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </button>
              </div>

              {/* Store Link */}
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium">
                <Home className="w-4 h-4" />
                View Store
              </a>

              {/* Earnings Preview */}
              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <div className="text-right">
                  <p className="text-xs text-gray-600">This Month</p>
                  <p className="font-bold text-green-700">$2,845</p>
                </div>
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-orange-500 text-white">
                      {vendorData?.businessName
                        ? getInitials(vendorData.businessName)
                        : "V"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium">
                      {vendorData?.vendorName || "Vendor"}
                    </p>
                    <p className="text-xs text-gray-500">Store Owner</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
            <div className="mb-2 md:mb-0">
              © {new Date().getFullYear()} AutoParts Vendor Panel. All rights
              reserved.
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-orange-600">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-orange-600">
                Terms of Service
              </a>
              <a href="#" className="hover:text-orange-600">
                Support
              </a>
              <span>v1.0.0</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
