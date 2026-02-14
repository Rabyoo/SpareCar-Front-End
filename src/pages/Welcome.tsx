// frontend/src/pages/Welcome.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Store,
  User,
  ShoppingCart,
  Package,
  Shield,
  TrendingUp,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import Logo from "/public/favicon.jpg";
import Logo2 from "/public/Logo.png";

export default function Welcome() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("");

  const handleContinue = () => {
    if (selectedType === "customer") {
      navigate("/user/login");
    } else if (selectedType === "vendor") {
      navigate("/vendor/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/home" className="flex items-center gap-3">
              <div className=" w-12 h-12 flex items-center justify-center">
                <img src={Logo} alt="logo" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">SpareCar</h1>
                <p className="text-sm text-gray-600">Auto Parts Marketplace</p>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <Link
                to="/home"
                className="px-6 py-2.5 rounded-lg font-semibold text-gray-700 border-2 border-gray-200 bg-white hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-300 shadow-sm hover:shadow-lg hover:scale-105 active:scale-95">
                Shop Now !
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6">
            <img src={Logo2} alt="logo" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-orange-600">SpareCar</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join Egypt's largest auto parts marketplace. Choose how you want to
            use our platform.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Customer Card */}
          <Card
            className={`cursor-pointer transition-all duration-300 hover:shadow-xl border-2 ${
              selectedType === "customer"
                ? "border-orange-500 bg-orange-50"
                : "border-gray-200 hover:border-orange-300"
            }`}
            onClick={() => setSelectedType("customer")}>
            <CardHeader>
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    selectedType === "customer"
                      ? "bg-orange-500"
                      : "bg-gray-100"
                  }`}>
                  <User
                    className={`w-6 h-6 ${
                      selectedType === "customer"
                        ? "text-white"
                        : "text-gray-600"
                    }`}
                  />
                </div>
                <CardTitle className="text-2xl">I'm a Customer</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Buy genuine auto parts for your vehicle</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Access millions of parts from trusted suppliers</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Fast delivery and secure payment</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>24/7 customer support</span>
                </div>

                <div className="pt-6">
                  <Button
                    variant={
                      selectedType === "customer" ? "default" : "outline"
                    }
                    className={`w-full ${
                      selectedType === "customer"
                        ? "bg-orange-500 hover:bg-orange-600"
                        : "hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/user/login"); // ⭐ صفحة الدخول للعملاء
                    }}>
                    Continue as Customer
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vendor Card */}
          <Card
            className={`cursor-pointer transition-all duration-300 hover:shadow-xl border-2 ${
              selectedType === "vendor"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-300"
            }`}
            onClick={() => setSelectedType("vendor")}>
            <CardHeader>
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    selectedType === "vendor" ? "bg-blue-500" : "bg-gray-100"
                  }`}>
                  <Store
                    className={`w-6 h-6 ${
                      selectedType === "vendor" ? "text-white" : "text-gray-600"
                    }`}
                  />
                </div>
                <CardTitle className="text-2xl">I'm a Vendor</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span>Sell your auto parts to millions of customers</span>
                </div>
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-green-500" />
                  <span>Complete store management dashboard</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span>Secure payments and regular payouts</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Marketing and promotional support</span>
                </div>

                <div className="pt-6">
                  <Button
                    variant={selectedType === "vendor" ? "default" : "outline"}
                    className={`w-full ${
                      selectedType === "vendor"
                        ? "bg-blue-500 hover:bg-blue-600"
                        : "hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/vendor/login");
                    }}>
                    Continue as Vendor
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for More Info */}
        <Tabs defaultValue="features" className="mb-12">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger
              value="features"
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Features
            </TabsTrigger>
            <TabsTrigger
              value="benefits"
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Benefits
            </TabsTrigger>
            <TabsTrigger
              value="stats"
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Stats
            </TabsTrigger>
          </TabsList>

          <TabsContent value="features" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <ShoppingCart className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Easy Shopping</h3>
                <p className="text-gray-600">
                  Find parts by vehicle make, model, and year with our smart
                  catalog.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Store className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Vendor Tools</h3>
                <p className="text-gray-600">
                  Complete dashboard to manage products, orders, and analytics.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Secure Transactions</h3>
                <p className="text-gray-600">
                  Protected payments and escrow system for safe transactions.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="benefits" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-bold text-lg mb-3 text-orange-600">
                  For Customers
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>Access to genuine OEM and aftermarket parts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>Competitive prices from multiple vendors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>Vehicle-specific part compatibility</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-bold text-lg mb-3 text-blue-600">
                  For Vendors
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>Reach millions of potential customers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>No setup fees, pay only when you sell</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>Complete inventory and order management</span>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="stats" className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  50K+
                </div>
                <div className="text-gray-600">Active Customers</div>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">2K+</div>
                <div className="text-gray-600">Verified Vendors</div>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  500K+
                </div>
                <div className="text-gray-600">Parts Available</div>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  100K+
                </div>
                <div className="text-gray-600">Orders Delivered</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
            Join thousands of satisfied customers and vendors who trust SpareCar
            for their auto parts needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-orange-600 hover:bg-orange-50"
              onClick={() => navigate("/user/register")}>
              <User className="w-5 h-5 mr-2" />
              Create Customer Account
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white/10"
              onClick={() => navigate("/vendor/register")}>
              <Store className="w-5 h-5 mr-2" />
              Apply as Vendor
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t text-center">
          <p className="text-gray-600">
            By continuing, you agree to our{" "}
            <Link to="/terms" className="text-orange-600 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-orange-600 hover:underline">
              Privacy Policy
            </Link>
          </p>
          <p className="text-sm text-gray-500 mt-4">
            © 2024 SpareCar. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
