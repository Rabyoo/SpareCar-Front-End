// frontend/src/App.tsx
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

//* Global Declarations for Google Translate */
declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// 🔴 NEW PAGES - نظام الاختيار الأولي
import Welcome from "./pages/Welcome";

// Existing Pages
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import UserLogin from "./pages/UserLogin";
import UserRegister from "./pages/UserRegister";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import SingleLogo from "../public/Logo.png";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";
import ShippingInfo from "./pages/ShippingInfo";
import Returns from "./pages/Returns";
import FAQ from "./pages/FAQ";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import AdminCustomers from "./pages/AdminCustomers";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminCategories from "./pages/AdminCategories";
import AdminShipping from "./pages/AdminShipping";
import AdminReviews from "./pages/AdminReviews";
import LiteRoad from "./pages/LiteRoad";
import RequestMechanic from "./pages/RequestMechanic";
import TrackOrder from "./pages/TrackOrder";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import OurServices from "./pages/OurServices";
import CustomerSupport from "./pages/CustomerSupport";
import ScrollToTop from "./components/ScrollToTop";

// Vendor Pages
import VendorRegister from "./pages/VendorRegister";
import VendorDashboard from "./pages/VendorDashboard";
import AddProduct from "./pages/AddProduct";
import VendorProducts from "./pages/VendorProducts";
import VendorOrders from "./pages/VendorOrders";
import EditProduct from "./pages/EditProduct";
import VendorAnalytics from "./pages/VendorAnalytics";
import VendorSettings from "./pages/VendorSettings";

// ⭐⭐ Usage Level & Maintenance Pages
import UsageLevelSelector from "./pages/UsageLevelSelector";
import MaintenanceAnalysis from "./pages/MaintenanceAnalysis";

// Route Guards
import {
  PublicRoute,
  CustomerRoute,
  VendorRoute,
  AdminRoute,
} from "./components/RouteGuards";
import AuthSuccess from "./components/AuthSuccess";
import Dashboard from "./pages/Dashboard";
import AdminReports from "./pages/AdminReports";
import AdminSettings from "./pages/AdminSettings";
import Orders from "./pages/Orders";
import AdminVendors from "./pages/AdminVendors";
import VendorLogin from "./pages/VendorLogin";
import RequestMobileProfessional from "./pages/MobileMechanic";
import WinchHelpo from "./pages/WinchHelpo";
import RegularMaintenance from "./pages/RegularMaintenance";
import AIChatbot from "./components/AIChatbot";
import WashlyServicePage from "./pages/Washly";
import VendorLayout from "./layouts/VendorLayout";

// ==================== 🚀 الخدمات الجديدة ====================
// 1️⃣ خدمة تعلم القيادة
import LearnDriving from "./pages/LearnDriving";
import DrivingBooking from "./pages/DrivingBooking";
import DrivingConfirmation from "./pages/DrivingConfirmation";
import TrafficRules from "./pages/TrafficRules";
import DrivingSchools from "./pages/DrivingSchools";

// 2️⃣ خدمة إيجار السيارات
import CarRental from "./pages/CarRental";
import CarBooking from "./pages/CarBooking";
import CarRentalConfirmation from "./pages/CarRentalConfirmation";
// import RentalCompanies from "./pages/RentalCompanies";

// 3️⃣ صفحات التوثيق والمعلومات
import Documentation from "./pages/Documentation";
import DrivingExams from "./pages/DrivingExams";
// import RentalInsurance from "./pages/RentalInsurance";

// 4️⃣ صفحات إدارية جديدة
import AdminDrivingSchools from "./pages/DrivingSchools";
// import AdminRentalCompanies from "./pages/AdminRentalCompanies";
// import AdminBookings from "./pages/AdminBookings";

const queryClient = new QueryClient();

function AppWrapper() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");
  const isVendorPage = location.pathname.startsWith("/vendor");
  const isAuthPage = [
    "/",
    "/user/login",
    "/user/register",
    "/vendor/login",
    "/vendor/register",
    "/login",
    "/register",
  ].includes(location.pathname);
  const [isLoading, setIsLoading] = useState(true);

  //* Tracking Language Direction Changes */
  useEffect(() => {
    const checkLanguage = (): void => {
      if (document.body.classList.contains("translated-rtl")) {
        document.body.dir = "rtl";
      } else {
        document.body.dir = "ltr";
      }
    };

    const observer = new MutationObserver(checkLanguage);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Show Navbar only for non-admin, non-vendor, non-auth pages */}
      {!isAdminPage && !isVendorPage && !isAuthPage && <Navbar />}

      <main className="flex-1">
        {isLoading ? (
          <div className="flex justify-center items-center flex-col min-h-screen bg-[#fff]">
            <img
              className="w-[200px] animate-splash"
              src={SingleLogo}
              alt="loading"
            />
            <h3
              style={{ letterSpacing: "1.5px", textTransform: "uppercase" }}
              className="absolute top-[80%] text-center text-[#111] font-semibold text-lg">
              Loading...
            </h3>
          </div>
        ) : (
          <Routes>
            {/* 🔴 صفحة الاختيار الأولى */}
            <Route path="/" element={<Welcome />} />

            {/* 🔴 مسارات المستخدم العادي */}
            <Route
              path="/user/login"
              element={
                <PublicRoute>
                  <UserLogin />
                </PublicRoute>
              }
            />
            <Route
              path="/user/register"
              element={
                <PublicRoute>
                  <UserRegister />
                </PublicRoute>
              }
            />

            {/* ===== مسارات التاجر المحمية ===== */}
            <Route path="/vendor/login" element={<VendorLogin />} />
            <Route path="/vendor/register" element={<VendorRegister />} />
            <Route
              path="/vendor"
              element={
                <VendorRoute>
                  <VendorLayout />
                </VendorRoute>
              }>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<VendorDashboard />} />
              <Route path="products" element={<VendorProducts />} />
              <Route path="products/add" element={<AddProduct />} />
              <Route path="products/edit/:id" element={<EditProduct />} />
              <Route path="orders" element={<VendorOrders />} />
              <Route path="analytics" element={<VendorAnalytics />} />
              <Route path="settings" element={<VendorSettings />} />
            </Route>

            <Route
              path="/request-mobile-professional"
              element={<RequestMobileProfessional />}
            />

            {/* ====== 🚗 مسارات خدمة تعلم القيادة ====== */}
            <Route path="/learn-driving" element={<LearnDriving />} />
            <Route path="/learn-driving/schools" element={<DrivingSchools />} />
            <Route
              path="/learn-driving/book/:schoolId"
              element={
                <CustomerRoute>
                  <DrivingBooking />
                </CustomerRoute>
              }
            />
            <Route
              path="/learn-driving/confirmation"
              element={
                <CustomerRoute>
                  <DrivingConfirmation />
                </CustomerRoute>
              }
            />
            <Route path="/traffic-rules" element={<TrafficRules />} />
            <Route path="/driving-exams" element={<DrivingExams />} />
            <Route path="/documentation" element={<Documentation />} />

            {/* ====== 🚙 مسارات خدمة إيجار السيارات ====== */}
            <Route path="/car-rental" element={<CarRental />} />
            {/* <Route path="/rental-companies" element={<RentalCompanies />} /> */}
            <Route
              path="/car-rental/book/:carId"
              element={
                <CustomerRoute>
                  <CarBooking />
                </CustomerRoute>
              }
            />
            <Route
              path="/car-rental/confirmation"
              element={
                <CustomerRoute>
                  <CarRentalConfirmation />
                </CustomerRoute>
              }
            />
            {/* <Route path="/rental-insurance" element={<RentalInsurance />} /> */}

            {/* ===== مسارات عامة ===== */}
            <Route path="/home" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/contactUs" element={<ContactUs />} />
            <Route path="/aboutUs" element={<AboutUs />} />
            <Route path="/shippingInfo" element={<ShippingInfo />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/auth/success" element={<AuthSuccess />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/ourServices" element={<OurServices />} />
            <Route path="/services/liteRoad" element={<LiteRoad />} />
            <Route path="/customerSupport" element={<CustomerSupport />} />
            <Route path="/services/washly" element={<WashlyServicePage />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/rescue-winch" element={<WinchHelpo />} />
            <Route
              path="/regular-maintenance"
              element={<RegularMaintenance />}
            />

            {/* ⭐⭐ Usage Level & Maintenance Routes */}
            <Route
              path="/usage-level-selector"
              element={
                <CustomerRoute>
                  <UsageLevelSelector />
                </CustomerRoute>
              }
            />
            <Route
              path="/maintenance-analysis"
              element={
                <CustomerRoute>
                  <MaintenanceAnalysis />
                </CustomerRoute>
              }
            />

            {/* ===== مسارات التاجر المحمية ===== */}
            <Route
              path="/vendor/dashboard"
              element={
                <VendorRoute>
                  <VendorDashboard />
                </VendorRoute>
              }
            />
            <Route
              path="/vendor/products"
              element={
                <VendorRoute>
                  <VendorProducts />
                </VendorRoute>
              }
            />
            <Route
              path="/vendor/products/add"
              element={
                <VendorRoute>
                  <AddProduct />
                </VendorRoute>
              }
            />
            <Route
              path="/vendor/products/edit/:id"
              element={
                <VendorRoute>
                  <EditProduct />
                </VendorRoute>
              }
            />
            <Route
              path="/vendor/orders"
              element={
                <VendorRoute>
                  <VendorOrders />
                </VendorRoute>
              }
            />
            <Route
              path="/vendor/analytics"
              element={
                <VendorRoute>
                  <VendorAnalytics />
                </VendorRoute>
              }
            />
            <Route
              path="/vendor/settings"
              element={
                <VendorRoute>
                  <VendorSettings />
                </VendorRoute>
              }
            />

            {/* ===== مسارات المستخدم المحمية ===== */}
            <Route
              path="/cart"
              element={
                <CustomerRoute>
                  <Cart />
                </CustomerRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <CustomerRoute>
                  <Checkout />
                </CustomerRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <CustomerRoute>
                  <Profile />
                </CustomerRoute>
              }
            />
            <Route
              path="/request"
              element={
                <CustomerRoute>
                  <RequestMechanic />
                </CustomerRoute>
              }
            />
            <Route
              path="/track/:orderId"
              element={
                <CustomerRoute>
                  <TrackOrder />
                </CustomerRoute>
              }
            />

            {/* ===== مسارات الإدارة المحمية ===== */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <AdminRoute>
                  <AdminProducts />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <AdminRoute>
                  <AdminOrders />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/customers"
              element={
                <AdminRoute>
                  <AdminCustomers />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <AdminRoute>
                  <AdminAnalytics />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <AdminRoute>
                  <AdminCategories />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/shipping"
              element={
                <AdminRoute>
                  <AdminShipping />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/reviews"
              element={
                <AdminRoute>
                  <AdminReviews />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <AdminRoute>
                  <AdminReports />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <AdminRoute>
                  <AdminSettings />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/vendors"
              element={
                <AdminRoute>
                  <AdminVendors />
                </AdminRoute>
              }
            />

            {/* ====== 🚀 مسارات إدارية جديدة ====== */}
            <Route
              path="/admin/driving-schools"
              element={
                <AdminRoute>
                  <AdminDrivingSchools />
                </AdminRoute>
              }
            />
            {/* <Route
              path="/admin/rental-companies"
              element={
                <AdminRoute>
                  <AdminRentalCompanies />
                </AdminRoute>
              }
            /> */}
            {/* <Route
              path="/admin/bookings"
              element={
                <AdminRoute>
                  <AdminBookings />
                </AdminRoute>
              }
            /> */}

            {/* ===== مسارات قديمة للتوافق ===== */}
            <Route
              path="/login"
              element={<Navigate to="/user/login" replace />}
            />
            <Route
              path="/register"
              element={<Navigate to="/user/register" replace />}
            />

            {/* ===== 404 ===== */}
            <Route path="*" element={<NotFound />} />
            <Route path="/robots" element={<NotFound />} />
          </Routes>
        )}
      </main>

      {/* Show Footer only for non-admin, non-vendor, non-auth pages */}
      {!isAdminPage && !isVendorPage && !isAuthPage && <Footer />}
      {!isAdminPage && !isVendorPage && !isAuthPage && <ScrollToTop />}
      {!isAdminPage && !isVendorPage && !isAuthPage && <AIChatbot />}

      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <BrowserRouter>
              <AppWrapper />
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
