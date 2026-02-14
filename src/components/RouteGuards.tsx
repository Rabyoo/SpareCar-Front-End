// frontend/src/components/RouteGuards.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useVendor } from "../context/VendorContext";

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
  </div>
);

/* =======================
   Public Route
   ======================= */
export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  const publicAuthPages = [
    "/user/login",
    "/user/register",
    "/vendor/login",
    "/vendor/register",
  ];

  // ✅ Welcome page متاحة للجميع
  if (location.pathname === "/") {
    return <>{children}</>;
  }

  return <>{children}</>;
};

/* =======================
   Customer Route
   ======================= */
export const CustomerRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/user/login" replace />;
  }

  if (user.role !== "customer") {
    if (user.role === "vendor") {
      return <Navigate to="/vendor/dashboard" replace />;
    }
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
  }

  return <>{children}</>;
};

/* =======================
   Vendor Route
   ======================= */
export const VendorRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/vendor/login" replace />;
  }

  if (user.role !== "vendor") {
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

/* =======================
   Admin Route
   ======================= */
export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
