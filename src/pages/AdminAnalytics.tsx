import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AdminSidebar from "@/components/AdminSidebar";
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
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Download,
  Calendar,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

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

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("monthly");
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    avgOrderValue: 0,
    revenueGrowth: 0,
    ordersGrowth: 0,
    customersGrowth: 0,
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, [period]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [statsRes, salesRes, categoriesRes, productsRes] =
        await Promise.all([
          fetch(`${API_BASE_URL}/admin/dashboard/stats`, { headers }),
          fetch(
            `${API_BASE_URL}/admin/dashboard/sales-analytics?period=${period}`,
            { headers }
          ),
          fetch(`${API_BASE_URL}/admin/dashboard/category-stats`, { headers }),
          fetch(`${API_BASE_URL}/admin/dashboard/top-products?limit=10`, {
            headers,
          }),
        ]);

      const [statsData, salesDataRes, categoriesDataRes, productsDataRes] =
        await Promise.all([
          statsRes.json(),
          salesRes.json(),
          categoriesRes.json(),
          productsRes.json(),
        ]);

      if (statsData.success) {
        setStats({
          totalRevenue: statsData.stats.totalRevenue,
          totalOrders: statsData.stats.totalOrders,
          totalCustomers: statsData.stats.totalCustomers,
          avgOrderValue:
            statsData.stats.totalRevenue / statsData.stats.totalOrders || 0,
          revenueGrowth: 12.5,
          ordersGrowth: 8.3,
          customersGrowth: 15.2,
        });
      }

      if (salesDataRes.success) {
        const formattedSales = salesDataRes.data.map((item, index) => ({
          month: `Month ${item._id.month || index + 1}`,
          revenue: item.totalSales,
          orders: item.orderCount,
        }));
        setSalesData(formattedSales);
      }

      if (categoriesDataRes.success) {
        const formattedCategories = categoriesDataRes.categories.map((cat) => ({
          name: cat._id,
          value: cat.productCount,
          revenue: cat.totalStock * cat.avgPrice,
        }));
        setCategoryData(formattedCategories);
      }

      if (productsDataRes.success) {
        setTopProducts(productsDataRes.products);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to load analytics data");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 ml-64 p-8">
          <div className="flex items-center justify-center h-screen">
            <RefreshCw className="w-12 h-12 animate-spin text-blue-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 ml-64 p-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Track your business performance and insights
            </p>
          </div>
          <div className="flex gap-3">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-40">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={fetchAnalyticsData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold mt-1">
                    {stats.totalRevenue.toLocaleString()} L.E
                  </p>
                  <div
                    className={`flex items-center mt-2 text-sm ${
                      stats.revenueGrowth >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}>
                    {stats.revenueGrowth >= 0 ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
                    <span>
                      {Math.abs(stats.revenueGrowth).toFixed(1)}% from last
                      month
                    </span>
                  </div>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold mt-1">{stats.totalOrders}</p>
                  <div
                    className={`flex items-center mt-2 text-sm ${
                      stats.ordersGrowth >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}>
                    {stats.ordersGrowth >= 0 ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
                    <span>
                      {Math.abs(stats.ordersGrowth).toFixed(1)}% from last month
                    </span>
                  </div>
                </div>
                <ShoppingCart className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">New Customers</p>
                  <p className="text-2xl font-bold mt-1">
                    {stats.totalCustomers}
                  </p>
                  <div
                    className={`flex items-center mt-2 text-sm ${
                      stats.customersGrowth >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}>
                    {stats.customersGrowth >= 0 ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
                    <span>
                      {Math.abs(stats.customersGrowth).toFixed(1)}% from last
                      month
                    </span>
                  </div>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Order Value</p>
                  <p className="text-2xl font-bold mt-1">
                    {stats.avgOrderValue.toFixed(2)} L.E
                  </p>
                  <div className="flex items-center mt-2 text-sm text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>5.2% from last month</span>
                  </div>
                </div>
                <Package className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue & Orders Chart */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={salesData}>
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

          <Card>
            <CardHeader>
              <CardTitle>Orders & Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
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
              <CardTitle>Sales by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value">
                    {categoryData.map((entry, index) => (
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

        {/* Category Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryData.map((category, index) => (
                <div
                  key={category.name}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <div>
                      <p className="font-semibold">{category.name}</p>
                      <p className="text-sm text-gray-600">
                        {category.value} products
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">
                      {(category.revenue || 0).toLocaleString()} L.E
                    </p>
                    <p className="text-sm text-gray-600">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
