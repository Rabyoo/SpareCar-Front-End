// frontend/src/pages/VendorLogin.tsx
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
import {
  Store,
  Lock,
  Mail,
  AlertCircle,
  CheckCircle2,
  Wrench,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function VendorLogin() {
  const [email, setEmail] = useState("vendor@test.com"); // قيمة افتراضية للاختبار
  const [password, setPassword] = useState("password123"); // قيمة افتراضية للاختبار
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const navigate = useNavigate();

  // دالة لإنشاء vendor اختباري
  const createTestVendor = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("🛠 Creating test vendor...");
      const response = await fetch(`${API_URL}/auth/create-test-vendor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("🛠 Test vendor creation response:", data);

      if (data.success) {
        setSuccessMessage(
          `✅ Test vendor created! Email: ${data.credentials.email}, Password: ${data.credentials.password}`,
        );
        setEmail(data.credentials.email);
        setPassword(data.credentials.password);
      } else {
        setError(data.message || "Failed to create test vendor");
      }
    } catch (err) {
      console.error("🛠 Error creating test vendor:", err);
      setError("Failed to create test vendor");
    } finally {
      setLoading(false);
    }
  };

  // دالة لجلب معلومات التصحيح
  const fetchDebugInfo = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/debug-users`);
      const data = await response.json();
      console.log("🔍 Debug info:", data);
      setDebugInfo(data);
    } catch (err) {
      console.error("🔍 Error fetching debug info:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      console.log("========== VENDOR LOGIN ==========");
      console.log("📤 Vendor login attempt:", { email, password });

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          role: "vendor", // ⭐ مهم: أضف role هنا
        }),
      });

      console.log("🔍 Response status:", response.status);

      const data = await response.json();
      console.log("🔍 Response data:", data);

      if (response.ok && data.success) {
        // تحقق أن المستخدم فعلاً vendor
        if (data.user.role !== "vendor") {
          setError("❌ This account is not registered as a vendor");
          return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        console.log("✅ Login successful! Token saved.");
        setSuccessMessage(
          `✅ Welcome back, ${data.user.displayName}! Redirecting...`,
        );

        setTimeout(() => {
          navigate("/vendor/dashboard");
        }, 1500);
      } else {
        console.log("❌ Login failed:", data.message);
        setError(data.message || "Invalid email or password");
      }
    } catch (err: any) {
      console.error("❌ Vendor login error:", err);
      setError("❌ Failed to connect to server. Please check your connection.");
    } finally {
      setLoading(false);
      console.log("========== LOGIN COMPLETE ==========");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-blue-100 px-4 py-6">
      <Card className="w-full max-w-md shadow-xl border-2">
        <CardHeader className="space-y-1 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-4">
            <Store className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Vendor Portal</CardTitle>
          <CardDescription className="text-gray-700">
            Sign in to your vendor account
          </CardDescription>
        </CardHeader>

        <CardContent>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800 font-medium">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {successMessage && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 font-medium">
                  {successMessage}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Business Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="vendor@yourbusiness.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 border-2"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11 border-2"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 text-sm text-gray-600">
                  Remember me
                </label>
              </div>
              <button
                type="button"
                className="text-sm font-medium text-orange-600 hover:underline">
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-orange-500 hover:bg-orange-600"
              disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign In as Vendor"
              )}
            </Button>

            <div className="text-center text-sm text-gray-600 mt-4">
              Don't have a vendor account?{" "}
              <Link
                to="/vendor/register"
                className="text-orange-600 hover:underline font-medium">
                Apply Now
              </Link>
            </div>

            <div className="text-center text-sm text-gray-600">
              Are you a customer?{" "}
              <Link
                to="/user/login"
                className="text-blue-600 hover:underline font-medium">
                Customer Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
