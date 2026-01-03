import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import AdminSidebar from "@/components/AdminSidebar";
import {
  Download,
  Filter,
  Calendar,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Eye,
  Printer,
  Share2,
  FileText,
  BarChart3,
  PieChart,
  LineChart as LineChartIcon,
  RefreshCw,
  PoundSterling,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartPie,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { format } from "date-fns";
import { toast } from "sonner";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AdminReports() {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("month");
  const [reportType, setReportType] = useState("sales");
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    conversionRate: 3.2,
    growth: "+23.5%",
  });

  useEffect(() => {
    fetchReportsData();
  }, [dateRange]);

  const fetchReportsData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [statsRes, salesRes, categoriesRes, productsRes] =
        await Promise.all([
          fetch(`${API_BASE_URL}/admin/dashboard/stats`, { headers }),
          fetch(
            `${API_BASE_URL}/admin/dashboard/sales-analytics?period=monthly`,
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
          avgOrderValue:
            statsData.stats.totalRevenue / statsData.stats.totalOrders || 0,
          conversionRate: 3.2,
          growth: "+23.5%",
        });
      }

      if (salesDataRes.success) {
        const formatted = salesDataRes.data.map((item, index) => ({
          month: `Month ${item._id.month || index + 1}`,
          sales: item.totalSales,
          orders: item.orderCount,
          revenue: item.totalSales,
        }));
        setSalesData(formatted);
      }

      if (categoriesDataRes.success) {
        const formatted = categoriesDataRes.categories.map((cat, index) => ({
          name: cat._id,
          value: cat.productCount,
          color: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][
            index % 5
          ],
        }));
        setCategoryData(formatted);
      }

      if (productsDataRes.success) {
        const formatted = productsDataRes.products.map((p) => ({
          name: p.name,
          sales: p.totalQuantity,
          revenue: p.totalRevenue,
        }));
        setTopProducts(formatted);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to load reports data");
      setLoading(false);
    }
  };

  const handleExportReport = (format) => {
    toast.info(`Exporting report as ${format.toUpperCase()}...`);
  };

  const handlePrintReport = () => {
    window.print();
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
      <div className="flex-1 ml-64 p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Reports & Analytics
            </h1>
            <p className="text-gray-600 mt-2">
              Detailed insights and performance metrics
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportReport("pdf")}>
              <FileText className="w-4 h-4 mr-2" />
              PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportReport("excel")}>
              <FileText className="w-4 h-4 mr-2" />
              Excel
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrintReport}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm" onClick={fetchReportsData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 space-y-2">
                <Label className="text-sm">Date Range</Label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <Calendar className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 space-y-2">
                <Label className="text-sm">Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales Report</SelectItem>
                    <SelectItem value="products">Products Report</SelectItem>
                    <SelectItem value="customers">Customers Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold mt-2">
                    {stats.totalRevenue.toLocaleString()} L.E
                  </p>
                  <Badge
                    variant="outline"
                    className="mt-2 bg-green-50 text-green-700">
                    {stats.growth} growth
                  </Badge>
                </div>
                <PoundSterling className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Orders
                  </p>
                  <p className="text-2xl font-bold mt-2">{stats.totalOrders}</p>
                  <p className="text-sm text-gray-500 mt-2">Last 30 days</p>
                </div>
                <ShoppingCart className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Avg Order Value
                  </p>
                  <p className="text-2xl font-bold mt-2">
                    {stats.avgOrderValue.toFixed(2)} L.E
                  </p>
                  <p className="text-sm text-gray-500 mt-2">Per order</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Conversion Rate
                  </p>
                  <p className="text-2xl font-bold mt-2">
                    {stats.conversionRate}%
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Visitor to customer
                  </p>
                </div>
                <Users className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <Tabs defaultValue="sales" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-xl">
            <TabsTrigger value="sales">
              <LineChartIcon className="w-4 h-4 mr-2" />
              Sales
            </TabsTrigger>
            <TabsTrigger value="products">
              <Package className="w-4 h-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="categories">
              <PieChart className="w-4 h-4 mr-2" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="revenue">
              <BarChart3 className="w-4 h-4 mr-2" />
              Revenue
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sales">
            <Card>
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>
                  Monthly sales and order trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="sales"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.1}
                    />
                    <Area
                      type="monotone"
                      dataKey="orders"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.1}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>
                  Best selling products by revenue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={topProducts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sales" fill="#3b82f6" name="Units Sold" />
                    <Bar
                      dataKey="revenue"
                      fill="#10b981"
                      name="Revenue (L.E)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
                <CardDescription>Sales by product category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RechartPie>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={120}
                      dataKey="value">
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartPie>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Detailed Report Table */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Sales Report</CardTitle>
            <CardDescription>Complete breakdown of sales data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Product</th>
                    <th className="text-left py-3 px-4 font-medium">
                      Category
                    </th>
                    <th className="text-left py-3 px-4 font-medium">
                      Units Sold
                    </th>
                    <th className="text-left py-3 px-4 font-medium">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{product.name}</td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary">
                          {categoryData[index % categoryData.length]?.name ||
                            "N/A"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">{product.sales}</td>
                      <td className="py-3 px-4 font-medium">
                        {product.revenue.toLocaleString()} L.E
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-sm text-gray-500">
              Report generated: {format(new Date(), "MMM d, yyyy h:mm a")}
            </p>
            <Button size="sm" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Full Report
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
