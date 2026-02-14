import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { FaFacebook, FaGoogle, FaMicrosoft } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

export default function Register() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setError(null);
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    // طباعة البيانات للتشخيص
    console.log("=== Form Submission Started ===");
    console.log("Full Form Data:", formData);
    console.log(
      "Full Name:",
      formData.fullName,
      "| Length:",
      formData.fullName?.length || 0,
    );
    console.log(
      "Email:",
      formData.email,
      "| Length:",
      formData.email?.length || 0,
    );
    console.log(
      "Phone:",
      formData.phone,
      "| Length:",
      formData.phone?.length || 0,
    );
    console.log(
      "Password:",
      formData.password,
      "| Length:",
      formData.password?.length || 0,
    );
    console.log(
      "Confirm Password:",
      formData.confirmPassword,
      "| Length:",
      formData.confirmPassword?.length || 0,
    );

    // Basic validation - Fixed!
    const trimmedFullName = (formData.fullName || "").trim();
    const trimmedEmail = (formData.email || "").trim();
    const trimmedPassword = (formData.password || "").trim();
    const trimmedConfirmPassword = (formData.confirmPassword || "").trim();

    if (!trimmedFullName) {
      console.log("❌ Validation Error: Full name is empty");
      setError("Please enter your full name");
      setIsLoading(false);
      return;
    }

    if (!trimmedEmail) {
      console.log("❌ Validation Error: Email is empty");
      setError("Please enter your email");
      setIsLoading(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      console.log("❌ Validation Error: Invalid email format");
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    if (!trimmedPassword) {
      console.log("❌ Validation Error: Password is empty");
      setError("Please enter a password");
      setIsLoading(false);
      return;
    }

    if (trimmedPassword.length < 6) {
      console.log(
        "❌ Validation Error: Password too short (",
        trimmedPassword.length,
        "characters)",
      );
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    if (!trimmedConfirmPassword) {
      console.log("❌ Validation Error: Confirm password is empty");
      setError("Please confirm your password");
      setIsLoading(false);
      return;
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      console.log("❌ Validation Error: Passwords don't match");
      console.log("Password:", trimmedPassword);
      console.log("Confirm:", trimmedConfirmPassword);
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    console.log("✅ All validations passed!");

    try {
      const registrationData = {
        fullName: trimmedFullName,
        email: trimmedEmail.toLowerCase(),
        password: trimmedPassword,
        phone: (formData.phone || "").trim(),
      };

      console.log("📤 Sending registration data:", registrationData);
      console.log("📍 API URL:", `${API_URL}/auth/register`);

      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      });

      console.log("📥 Response Status:", response.status, response.statusText);

      const data = await response.json();
      console.log("📥 Response Data:", data);

      if (response.ok && data.success) {
        console.log("✅ Registration successful!");
        setSuccessMessage("✅ Account created successfully!");

        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          console.log("💾 Token and user saved to localStorage");
        }

        setTimeout(() => {
          console.log("🔄 Redirecting to dashboard...");
          window.location.href = "/dashboard";
        }, 1500);
      } else {
        console.log("❌ Registration failed:", data.message);
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err: any) {
      console.error("❌ Network/Connection Error:", err);
      console.error("Error details:", err.message);
      setError("Connection error. Please check your server is running.");
    } finally {
      setIsLoading(false);
      console.log("=== Form Submission Ended ===");
    }
  };

  const handleSocialLogin = (provider: string) => {
    setSocialLoading(provider);
    window.location.href = `${API_URL}/auth/${provider}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 px-6 pt-6 pb-4">
          <CardTitle className="text-3xl font-bold text-center">
            Create Account
          </CardTitle>
          <CardDescription className="text-center text-gray-700">
            Join SpareCar and manage your car maintenance
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <AlertDescription className="text-red-800 font-medium text-sm">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Success Alert */}
            {successMessage && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <AlertDescription className="text-green-800 font-medium text-sm">
                  {successMessage}
                </AlertDescription>
              </Alert>
            )}

            {/* Full Name */}
            <div>
              <Label htmlFor="fullName" className="text-sm font-medium">
                Full Name *
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="mt-1.5"
                disabled={isLoading}
                autoComplete="name"
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1.5"
                disabled={isLoading}
                autoComplete="email"
              />
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1.5"
                disabled={isLoading}
                autoComplete="tel"
              />
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="text-sm font-medium">
                Password *
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-1.5"
                disabled={isLoading}
                autoComplete="new-password"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password *
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="mt-1.5"
                disabled={isLoading}
                autoComplete="new-password"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-11 font-medium mt-6 bg-blue-600 hover:bg-blue-700"
              disabled={isLoading || socialLoading !== null}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* Social Login */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => handleSocialLogin("google")}
              disabled={socialLoading !== null}
              className="flex items-center justify-center px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50">
              <FaGoogle className="w-5 h-5 text-gray-700" />
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin("facebook")}
              disabled={socialLoading !== null}
              className="flex items-center justify-center px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50">
              <FaFacebook className="w-5 h-5 text-gray-700" />
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin("microsoft")}
              disabled={socialLoading !== null}
              className="flex items-center justify-center px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50">
              <FaMicrosoft className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          <div className="mt-4 text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Link
              to="/login"
              className="text-blue-600 hover:underline font-medium">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
