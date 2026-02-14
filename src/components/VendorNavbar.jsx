// frontend/src/components/vendor/VendorNavbar.jsx
import { Link, useLocation } from "react-router-dom";
import {
  Store,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  Bell,
  LogOut,
} from "lucide-react";

export default function VendorNavbar() {
  const location = useLocation();

  const navItems = [
    { path: "/vendor/dashboard", icon: Store, label: "Dashboard" },
    { path: "/vendor/products", icon: Package, label: "Products" },
    { path: "/vendor/orders", icon: ShoppingCart, label: "Orders" },
    { path: "/vendor/analytics", icon: BarChart3, label: "Analytics" },
    { path: "/vendor/settings", icon: Settings, label: "Settings" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-white border-r border-gray-200 w-64 min-h-screen">
      {/* Logo */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
            <Store className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">SpareCar Vendor</h2>
            <p className="text-xs text-gray-600">Seller Center</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive(item.path)
                ? "bg-orange-50 text-orange-700 border border-orange-200"
                : "text-gray-700 hover:bg-gray-100"
            }`}>
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Quick Stats */}
      <div className="p-4 border-t">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            Quick Stats
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-gray-600">Today's Orders</span>
              <span className="text-sm font-bold">12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-600">Revenue</span>
              <span className="text-sm font-bold text-green-600">$1,245</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
