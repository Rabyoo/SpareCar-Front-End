import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Package,
  Mail,
  Calendar,
  Shield,
  ArrowLeft,
  Edit,
  X,
  Save,
  Phone,
  MapPin,
  CreditCard,
  TrendingUp,
  Award,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

//* TypeScript Interfaces */
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
interface ProductInOrder {
  _id: string;
  name: string;
  price: number;
  image?: string;
}
interface OrderItem {
  product: ProductInOrder;
  quantity: number;
  price: number;
}
interface Order {
  _id: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  //* Load user from localStorage on mount */
  const storedUser = localStorage.getItem("user");
  useEffect(() => {
    if (storedUser) setUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  //* Fetch user data on component mount */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(`${API_URL}/orders/my-orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data.success) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setEditForm({
        ...editForm,
        address: {
          ...editForm.address,
          [addressField]: value,
        },
      });
    } else {
      setEditForm({
        ...editForm,
        [name]: value,
      });
    }
  };

  // Open edit modal
  const openEditModal = () => {
    setIsEditModalOpen(true);
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  // Close edit modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setErrorMessage(null);
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        setSuccessMessage("✓ Profile updated successfully!");

        // Close modal after 2 seconds
        setTimeout(() => {
          setIsEditModalOpen(false);
          setSuccessMessage(null);
        }, 2000);
      } else {
        setErrorMessage(data.message || "Failed to update profile");
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setErrorMessage("Failed to connect to server");
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-600 hover:bg-emerald-700";
      case "pending":
        return "bg-blue-600 hover:bg-blue-700";
      case "rejected":
        return "bg-amber-600 hover:bg-amber-700";
      default:
        return "bg-slate-600 hover:bg-slate-700";
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-3 border-slate-300 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <h1 className="text-3xl font-bold text-slate-900">My Account</h1>
          <p className="text-slate-600 mt-1">
            Manage your profile and view your order history
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info Card */}
          <div className="lg:col-span-1">
            <Card className="border border-slate-200 shadow-sm">
              <CardHeader className="border-b border-slate-200">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="w-5 h-5 text-slate-700" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Profile Image */}
                <div className="flex flex-col items-center">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      className="w-24 h-24 rounded-full border-2 border-slate-200 object-cover mb-3"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center text-white text-3xl font-semibold mb-3">
                      {user.displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <h3 className="text-xl font-semibold text-slate-900 text-center">
                    {user.displayName}
                  </h3>
                  <p className="text-sm text-slate-600 text-center mt-1">
                    {user.email}
                  </p>
                  <Badge className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white border-0">
                    Verified Account
                  </Badge>
                </div>

                <Separator className="bg-slate-200" />

                {/* User Details */}
                <div className="space-y-4">
                  <InfoItem
                    icon={<Mail className="w-4 h-4 text-slate-600" />}
                    label="Email"
                    value={user.email}
                  />
                  <InfoItem
                    icon={<Shield className="w-4 h-4 text-slate-600" />}
                    label="Auth Method"
                    value={getProviderName(user.provider)}
                  />
                  <InfoItem
                    icon={<Calendar className="w-4 h-4 text-slate-600" />}
                    label="Member Since"
                    value={new Date(user.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  />
                  {user.phone && (
                    <InfoItem
                      icon={<Phone className="w-4 h-4 text-slate-600" />}
                      label="Phone"
                      value={user.phone}
                    />
                  )}
                </div>

                <Separator className="bg-slate-200" />

                {/* Edit Profile Button */}
                <button
                  onClick={openEditModal}
                  className="w-full bg-slate-900 text-white py-2.5 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 font-medium">
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </button>
              </CardContent>
            </Card>
          </div>

          {/* Order History */}
          <div className="lg:col-span-2">
            <Card className="border border-slate-200 shadow-sm">
              <CardHeader className="border-b border-slate-200">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="w-5 h-5 text-slate-700" />
                  Order History
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {orders.length > 0 ? (
                  <div className="space-y-3">
                    {orders.map(() => (
                      <div className="space-y-3">
                        {orders.map((order) => (
                          <div
                            key={order._id}
                            className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors bg-white">
                            <div className="flex justify-between items-start mb-3">
                              <div className="space-y-1">
                                {order.items.map((item, index) => (
                                  <div key={index}>
                                    <p className="font-semibold text-slate-900">
                                      {item.product.name} × {item.quantity}
                                    </p>
                                    <p className="text-sm text-slate-600">
                                      {item.product.price} L.E
                                    </p>
                                  </div>
                                ))}

                                <p className="text-sm text-slate-600 mt-2 flex items-center gap-2">
                                  <Calendar className="w-3.5 h-3.5" />
                                  {new Date(order.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    }
                                  )}
                                </p>
                              </div>

                              <Badge
                                className={`${getStatusColor(
                                  order.status
                                )} text-white px-3 py-1 border-0`}>
                                {order.status.charAt(0).toUpperCase() +
                                  order.status.slice(1)}
                              </Badge>
                            </div>

                            <Separator className="my-3 bg-slate-200" />

                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2 text-slate-600">
                                <Package className="w-4 h-4" />
                                <p className="text-sm font-medium">
                                  {order.items.length} item
                                  {order.items.length !== 1 ? "s" : ""}
                                </p>
                              </div>

                              <p className="font-bold text-lg text-slate-900">
                                {order.total.toFixed(2)} L.E
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 text-base font-medium">
                      No orders yet
                    </p>
                    <p className="text-slate-400 text-sm mt-1">
                      Start shopping to see your orders here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <StatCard
                label="Total Orders"
                value={orders.length.toString()}
                icon={<Package className="w-5 h-5" />}
              />
              <StatCard
                label="Total Spent"
                value={`${orders
                  .reduce((sum, order) => sum + order.total, 0)
                  .toFixed(2)} L.E`}
                icon={<CreditCard className="w-5 h-5" />}
              />
              <StatCard
                label="Rewards Points"
                value="125"
                icon={<Award className="w-5 h-5" />}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 rounded-t-lg flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <Edit className="w-5 h-5" />
                <h2 className="text-xl font-semibold">Edit Profile</h2>
              </div>
              <button
                onClick={closeEditModal}
                className="hover:bg-slate-800 p-2 rounded transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Success/Error Messages */}
              {successMessage && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-lg text-sm font-medium">
                  {successMessage}
                </div>
              )}

              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg text-sm font-medium">
                  {errorMessage}
                </div>
              )}

              {/* Basic Information */}
              <div>
                <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Basic Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="displayName"
                      value={editForm.displayName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Email Address (Read-only)
                    </label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg text-slate-600 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={editForm.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              <Separator className="bg-slate-200" />

              {/* Address Information */}
              <div>
                <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Address Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="address.street"
                      value={editForm.address.street}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        City
                      </label>
                      <input
                        type="text"
                        name="address.city"
                        value={editForm.address.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                        placeholder="New York"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        State
                      </label>
                      <input
                        type="text"
                        name="address.state"
                        value={editForm.address.state}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                        placeholder="NY"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        name="address.zipCode"
                        value={editForm.address.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                        placeholder="10001"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Country
                      </label>
                      <input
                        type="text"
                        name="address.country"
                        value={editForm.address.country}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                        placeholder="United States"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 p-5 rounded-b-lg flex gap-3 sticky bottom-0 border-t border-slate-200">
              <button
                onClick={closeEditModal}
                disabled={isSaving}
                className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors font-medium disabled:opacity-50">
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="flex-1 px-4 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50">
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Components
function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <div className="flex-1">
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
          {label}
        </p>
        <p className="text-sm text-slate-900 font-medium mt-0.5 break-words">
          {value}
        </p>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 hover:border-slate-300 transition-colors">
      <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center text-white mb-3">
        {icon}
      </div>
      <p className="text-xs text-slate-600 font-medium uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}
