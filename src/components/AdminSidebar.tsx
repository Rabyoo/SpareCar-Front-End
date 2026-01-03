import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  FileText,
  Tag,
  TrendingUp,
  Truck,
  MessageSquare,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import logo from "../../public/favicon.jpg";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Package, label: "Products", path: "/admin/products" },
  { icon: ShoppingCart, label: "Orders", path: "/admin/orders" },
  { icon: Users, label: "Customers", path: "/admin/customers" },
  { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
  { icon: Tag, label: "Categories", path: "/admin/categories" },
  { icon: Truck, label: "Shipping", path: "/admin/shipping" },
  { icon: MessageSquare, label: "Reviews", path: "/admin/reviews" },
  { icon: FileText, label: "Reports", path: "/admin/reports" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

export default function AdminSidebar() {
  const location = useLocation();

  return (
    <div className="hidden md:flex flex-col w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white border-r border-gray-700 h-screen fixed left-0 top-0 z-40">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <img src={logo} alt="logo" className="w-10 h-10" />
          <div>
            <h1 className="text-xl font-bold tracking-tight">Spare Car Shop</h1>
            <p className="text-sm text-[#ff6600] mt-1">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation with custom scrollbar */}
      <nav className="flex-1 overflow-y-auto py-6 scrollbar-thin scrollbar-thumb-blue-900 scrollbar-track-gray-800 hover:scrollbar-thumb-blue-800">
        <div className="px-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative",
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg"
                    : "text-gray-300 hover:text-white hover:bg-gray-800"
                )}>
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-lg transition-all",
                    isActive
                      ? "bg-white bg-opacity-20"
                      : "bg-gray-800 group-hover:bg-gray-700"
                  )}>
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-transform",
                      isActive && "scale-110"
                    )}
                  />
                </div>
                <span className="font-medium">{item.label}</span>

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                )}

                {/* Hover effect */}
                {!isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 rounded-lg transition-opacity" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Help Section */}
      <div className="p-1 border-t border-gray-700">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-2 border border-gray-700">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white">Need help?</h3>
              <p className="text-sm text-gray-400 mt-1">
                Check our documentation for guidance
              </p>
              <button className="mt-3 flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors group">
                View Documentation
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Global scrollbar styles */}
      <style jsx global>{`
        /* For Webkit browsers (Chrome, Safari, Edge) */
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: #1f2937; /* gray-800 */
          border-radius: 3px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #1e3a8a; /* blue-900 */
          border-radius: 3px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #1e40af; /* blue-800 */
        }

        .scrollbar-thin::-webkit-scrollbar-corner {
          background: #1f2937;
        }

        /* For Firefox */
        * {
          scrollbar-width: thin;
          scrollbar-color: #1e3a8a #1f2937;
        }

        /* Optional: Smooth scrolling */
        .scrollbar-thin {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}
