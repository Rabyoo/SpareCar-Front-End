import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AdminSidebar from "@/components/AdminSidebar";
import { toast } from "sonner";
import {
  Package,
  Users,
  ShoppingCart,
  ArrowUpRight,
  PoundSterling,
  Bell,
  Settings,
  RefreshCw,
  Clock,
  Eye,
  AlertTriangle,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalProducts: 0,
    todayOrders: 0,
    todayRevenue: 0,
    monthlyRevenue: 0,
    pendingOrders: 0,
    outOfStockProducts: 0,
    lowStockProducts: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [salesAnalytics, setSalesAnalytics] = useState([]);

  useEffect(() => {
    if (!user || !isAdmin()) {
      toast.error("Unauthorized access!");
      navigate("/login");
    }
  }, [user, isAdmin, navigate]);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("No authentication token found");
        navigate("/login");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const [statsRes, ordersRes, productsRes, categoriesRes, salesRes] =
        await Promise.all([
          fetch(`${API_BASE_URL}/admin/dashboard/stats`, { headers }),
          fetch(`${API_BASE_URL}/admin/dashboard/recent-orders?limit=10`, {
            headers,
          }),
          fetch(`${API_BASE_URL}/admin/dashboard/top-products?limit=5`, {
            headers,
          }),
          fetch(`${API_BASE_URL}/admin/dashboard/category-stats`, { headers }),
          fetch(
            `${API_BASE_URL}/admin/dashboard/sales-analytics?period=monthly`,
            { headers }
          ),
        ]);

      if (statsRes.status === 401 || statsRes.status === 403) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const [statsData, ordersData, productsData, categoriesData, salesData] =
        await Promise.all([
          statsRes.json(),
          ordersRes.json(),
          productsRes.json(),
          categoriesRes.json(),
          salesRes.json(),
        ]);

      if (statsData.success) setDashboardStats(statsData.stats);
      if (ordersData.success) setRecentOrders(ordersData.orders);
      if (productsData.success) setTopProducts(productsData.products);
      if (categoriesData.success) {
        const formattedCategories = categoriesData.categories.map((cat) => ({
          name: cat._id,
          value: cat.productCount,
          products: cat.productCount,
        }));
        setCategoryStats(formattedCategories);
      }
      if (salesData.success) {
        const formattedSales = salesData.data.map((item) => ({
          month: `Month ${item._id.month}`,
          revenue: item.totalSales,
          orders: item.orderCount,
        }));
        setSalesAnalytics(formattedSales);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchDashboardData();
    toast.success("Dashboard refreshed!");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 ml-64 p-8">
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-lg text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 ml-64">
        {/* Top Navigation */}
        <div className="bg-white border-b sticky top-0 z-40">
          <div className="flex items-center justify-between px-8 py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500">
                {format(new Date(), "EEEE, MMMM d, yyyy")}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}>
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Products
                    </p>
                    <p className="text-3xl font-bold mt-2">
                      {dashboardStats.totalProducts}
                    </p>
                    <div className="flex items-center mt-2 text-sm text-orange-600">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      <span>{dashboardStats.lowStockProducts} low stock</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Revenue
                    </p>
                    <p className="text-3xl font-bold mt-2">
                      {dashboardStats.totalRevenue.toLocaleString()} L.E
                    </p>
                    <div className="flex items-center mt-2 text-sm text-green-600">
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                      <span>
                        Today: {dashboardStats.todayRevenue.toLocaleString()}{" "}
                        L.E
                      </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <PoundSterling className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Orders
                    </p>
                    <p className="text-3xl font-bold mt-2">
                      {dashboardStats.totalOrders}
                    </p>
                    <div className="flex items-center mt-2 text-sm">
                      <Clock className="w-4 h-4 mr-1 text-orange-600" />
                      <span className="text-orange-600">
                        Pending: {dashboardStats.pendingOrders}
                      </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Customers
                    </p>
                    <p className="text-3xl font-bold mt-2">
                      {dashboardStats.totalCustomers}
                    </p>
                    <div className="flex items-center mt-2 text-sm text-blue-600">
                      <Users className="w-4 h-4 mr-1" />
                      <span>Active users</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={salesAnalytics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Orders & Customers Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Orders Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesAnalytics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="orders"
                      stroke="#10b981"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Category Distribution & Top Products */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value">
                      {categoryStats.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topProducts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="totalQuantity"
                      fill="#3b82f6"
                      name="Units Sold"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">Recent Orders</CardTitle>
                <Link to="/admin/orders">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No recent orders
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 text-sm font-medium">
                          Order ID
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium">
                          Customer
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium">
                          Date
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium">
                          Amount
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr
                          key={order._id}
                          className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm">
                            #{order.orderNumber}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {order.customerName}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-sm font-medium">
                            {order.totalAmount.toLocaleString()} L.E
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <Badge
                              variant={
                                order.status === "completed"
                                  ? "default"
                                  : "secondary"
                              }>
                              {order.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
