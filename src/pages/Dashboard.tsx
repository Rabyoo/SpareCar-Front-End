import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  Calendar,
  Shield,
  LogOut,
  UserCircle,
  Package,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface UserData {
  _id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  provider: string;
  phone?: string;
  createdAt: string;
  lastLogin?: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.log("❌ No token found, redirecting to register");
          navigate("/register");
          return;
        }

        console.log(
          "🔍 Fetching user data with token:",
          token.substring(0, 20) + "..."
        );

        const response = await fetch(`${API_URL}/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log("📥 Response:", data);

        if (data.success) {
          setUser(data.user);
          // Save user to localStorage for Profile page
          localStorage.setItem("user", JSON.stringify(data.user));
          console.log("✅ User data loaded:", data.user.email);
        } else {
          throw new Error(data.message || "Failed to load user data");
        }
      } catch (error: any) {
        console.error("❌ Error fetching user:", error);
        setError(error.message);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setTimeout(() => navigate("/register"), 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/register");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-slate-300 border-t-slate-800 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-700 font-medium">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center border border-red-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Error Occurred
          </h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/register")}
            className="bg-slate-900 text-white px-6 py-2.5 rounded-lg hover:bg-slate-800 transition-colors">
            Back to Register
          </button>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const getProviderName = (provider: string) => {
    switch (provider) {
      case "google":
        return "Google";
      case "facebook":
        return "Facebook";
      case "microsoft":
        return "Microsoft";
      default:
        return "Email/Password";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Bar */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">SC</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              SpareCar Dashboard
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
            <LogOut className="w-4 h-4" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Card */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6 border border-slate-200">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            <div className="flex items-center gap-6">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-20 h-20 rounded-full border-2 border-slate-200 object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center text-white text-2xl font-semibold">
                  {user.displayName.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Welcome back, {user.displayName}
                </h2>
                <p className="text-slate-600 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium border border-emerald-200">
                    Account Active
                  </span>
                </div>
              </div>
            </div>
            <Link
              to="/profile"
              className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg hover:bg-slate-800 transition-colors">
              <UserCircle className="w-5 h-5" />
              <span className="font-medium">View Full Profile</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <StatsCard
            icon={<User className="w-6 h-6" />}
            label="Account Status"
            value="Verified"
          />
          <StatsCard
            icon={<Shield className="w-6 h-6" />}
            label="Security Level"
            value="High"
          />
          <StatsCard
            icon={<Package className="w-6 h-6" />}
            label="Total Orders"
            value="0"
          />
        </div>

        {/* Info Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Account Information */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-slate-700" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                Account Information
              </h3>
            </div>
            <div className="space-y-4">
              <InfoRow
                icon={<User className="w-4 h-4 text-slate-600" />}
                label="Full Name"
                value={user.displayName}
              />
              <InfoRow
                icon={<Mail className="w-4 h-4 text-slate-600" />}
                label="Email Address"
                value={user.email}
              />
              <InfoRow
                icon={<Shield className="w-4 h-4 text-slate-600" />}
                label="Authentication Method"
                value={getProviderName(user.provider)}
              />
              {user.phone && (
                <InfoRow
                  icon={<User className="w-4 h-4 text-slate-600" />}
                  label="Phone Number"
                  value={user.phone}
                />
              )}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-slate-700" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                Activity Timeline
              </h3>
            </div>
            <div className="space-y-4">
              <InfoRow
                icon={<Calendar className="w-4 h-4 text-slate-600" />}
                label="Account Created"
                value={new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              />
              {user.lastLogin && (
                <InfoRow
                  icon={<Calendar className="w-4 h-4 text-slate-600" />}
                  label="Last Login"
                  value={new Date(user.lastLogin).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                />
              )}
              <InfoRow
                icon={<User className="w-4 h-4 text-slate-600" />}
                label="User ID"
                value={user._id.substring(0, 12) + "..."}
              />
            </div>
          </div>
        </div>

        {/* Success Banner */}
        <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-emerald-900 mb-1">
                Account Successfully Created
              </h3>
              <p className="text-emerald-800 text-sm">
                Your account has been securely created and all your data is
                safely stored in our database. You can now access all features
                of SpareCar platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stats Card Component
function StatsCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200 hover:border-slate-300 transition-colors">
      <div className="w-11 h-11 bg-slate-900 rounded-lg flex items-center justify-center text-white mb-4">
        {icon}
      </div>
      <p className="text-slate-600 text-sm font-medium mb-1">{label}</p>
      <p className="text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

// Info Row Component
function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-slate-100 last:border-0">
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-slate-600 font-medium text-sm">{label}</span>
      </div>
      <span className="text-slate-900 font-semibold text-sm text-right max-w-[60%] break-words">
        {value}
      </span>
    </div>
  );
}
