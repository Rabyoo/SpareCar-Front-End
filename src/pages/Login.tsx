import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Mail, AlertCircle, CheckCircle2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      console.log("📤 Attempting login with:", email);
      console.log("🔗 API URL:", `${API_URL}/auth/login`);

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("📥 Response:", data);

      if (data.success) {
        console.log("✅ Login successful!");

        // Save token and user data
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setSuccessMessage(`Welcome back, ${data.user.displayName}!`);

        // Redirect based on role
        setTimeout(() => {
          if (data.user.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/dashboard");
          }
        }, 1500);
      } else {
        console.log("❌ Login failed:", data.message);
        setError(data.message || "Invalid email or password");
      }
    } catch (err: any) {
      console.error("❌ Login error:", err);
      setError("Failed to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-6 sm:py-8">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 px-4 sm:px-6 pt-6 pb-4">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-center">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center text-gray-700 text-sm sm:text-base">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                <AlertDescription className="text-red-800 font-medium text-sm">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Success Alert */}
            {successMessage && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                <AlertDescription className="text-green-800 font-medium text-sm">
                  ✅ {successMessage}
                </AlertDescription>
              </Alert>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-800">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 sm:pl-10 h-11 sm:h-12 border-2 border-gray-200 focus:border-blue-500 transition-all text-sm sm:text-base"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-800">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 sm:pl-10 h-11 sm:h-12 border-2 border-gray-200 focus:border-blue-500 transition-all text-sm sm:text-base"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-end">
              <button
                type="button"
                className="text-sm font-medium hover:underline text-blue-600 hover:text-blue-700">
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-11 sm:h-12 transition-all shadow-lg hover:shadow-xl text-sm sm:text-base"
              disabled={loading}
              onClick={() => {
                setTimeout(() => window.location.reload(), 100);
              }}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </Button>

            {/* Register Link */}
            <div className="text-center text-sm text-gray-600 mt-4">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-gray-950 hover:text-gray-900 hover:underline font-medium">
                Create Account
              </Link>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="px-3 sm:px-4 bg-white text-gray-500 font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() =>
                  (window.location.href = `${API_URL}/auth/google`)
                }
                className="flex items-center justify-center px-2 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
                aria-label="Sign in with Google">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                  <path
                    fill="#111111"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#111111"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#111111"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#111111"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </button>

              <button
                type="button"
                onClick={() =>
                  (window.location.href = `${API_URL}/auth/facebook`)
                }
                className="flex items-center justify-center px-2 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
                aria-label="Sign in with Facebook">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="#111"
                  viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() =>
                  (window.location.href = `${API_URL}/auth/microsoft`)
                }
                className="flex items-center justify-center px-2 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
                aria-label="Sign in with Microsoft">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 23 23">
                  <path fill="#111" d="M0 0h11v11H0z" />
                  <path fill="#111" d="M12 0h11v11H12z" />
                  <path fill="#111" d="M0 12h11v11H0z" />
                  <path fill="#111" d="M12 12h11v11H12z" />
                </svg>
              </button>
            </div>

            {/* Info Alert */}
            <Alert className="mt-6 bg-blue-50 border-blue-200">
              <AlertDescription className="text-xs sm:text-sm text-gray-800">
                <strong className="font-semibold">💡 Note:</strong> If you don't
                have an account, you can{" "}
                <Link
                  to="/register"
                  className="underline font-medium hover:text-gray-950">
                  create one here
                </Link>{" "}
                or sign in with Google/Facebook/Microsoft.
              </AlertDescription>
            </Alert>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
