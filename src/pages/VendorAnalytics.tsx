// frontend/src/pages/vendor/VendorAnalytics.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  ShoppingCart,
  Package,
  Download,
  Calendar,
  Filter,
  Eye,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function VendorAnalytics() {
  const [timeRange, setTimeRange] = useState("30days");
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    overview: {
      totalRevenue: 0,
      totalOrders: 0,
      totalCustomers: 0,
      avgOrderValue: 0,
      conversionRate: 0,
    },
    salesData: [],
    topProducts: [],
    trafficSources: [],
  });

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/vendor/analytics?period=${timeRange}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const data = await response.json();
      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    // Implement CSV export
    alert("Export feature coming soon!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600">
                Track your store performance and sales
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                  <SelectItem value="year">This year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={exportReport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <OverviewCard
            title="Total Revenue"
            value={`$${analytics.overview.totalRevenue.toLocaleString()}`}
            change="+12.5%"
            icon={<DollarSign className="w-6 h-6" />}
            color="green"
          />
          <OverviewCard
            title="Total Orders"
            value={analytics.overview.totalOrders.toLocaleString()}
            change="+8.2%"
            icon={<ShoppingCart className="w-6 h-6" />}
            color="blue"
          />
          <OverviewCard
            title="Customers"
            value={analytics.overview.totalCustomers.toLocaleString()}
            change="+15.3%"
            icon={<Users className="w-6 h-6" />}
            color="purple"
          />
          <OverviewCard
            title="Avg Order Value"
            value={`$${analytics.overview.avgOrderValue.toFixed(2)}`}
            change="+5.7%"
            icon={<TrendingUp className="w-6 h-6" />}
            color="orange"
          />
          <OverviewCard
            title="Conversion Rate"
            value={`${analytics.overview.conversionRate}%`}
            change="+2.1%"
            icon={<BarChart3 className="w-6 h-6" />}
            color="indigo"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Sales Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center border rounded-lg bg-gray-50">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Sales chart visualization</p>
                    <p className="text-sm text-gray-500">
                      Chart library integration required
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Top Selling Products</CardTitle>
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.topProducts.map((product, index) => (
                    <div
                      key={product._id}
                      className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-lg font-medium text-gray-400 w-6">
                          #{index + 1}
                        </div>
                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                          <Package className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm line-clamp-1">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {product.category}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">
                          ${product.revenue.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          {product.quantity} sold
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Traffic Sources */}
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      source: "Direct",
                      percentage: 45,
                      color: "bg-orange-500",
                    },
                    {
                      source: "Organic Search",
                      percentage: 30,
                      color: "bg-blue-500",
                    },
                    {
                      source: "Social Media",
                      percentage: 15,
                      color: "bg-purple-500",
                    },
                    { source: "Email", percentage: 10, color: "bg-green-500" },
                  ].map((item) => (
                    <div key={item.source}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">
                          {item.source}
                        </span>
                        <span className="text-sm font-bold">
                          {item.percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${item.color} h-2 rounded-full`}
                          style={{ width: `${item.percentage}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <MetricItem
                  label="Page Views"
                  value="12,458"
                  change="+24%"
                  positive={true}
                />
                <MetricItem
                  label="Add to Cart Rate"
                  value="8.2%"
                  change="+1.5%"
                  positive={true}
                />
                <MetricItem
                  label="Bounce Rate"
                  value="42%"
                  change="-3.2%"
                  positive={false}
                />
                <MetricItem
                  label="Avg. Session Duration"
                  value="4m 32s"
                  change="+45s"
                  positive={true}
                />
              </CardContent>
            </Card>

            {/* Quick Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Best day:</span> Friday (18%
                      of weekly sales)
                    </p>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Peak time:</span> 2PM - 5PM
                      (35% of daily orders)
                    </p>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Top location:</span> New
                      York (22% of customers)
                    </p>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewCard({ title, value, change, icon, color }) {
  const colorClasses = {
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
    indigo: "bg-indigo-100 text-indigo-600",
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            <p
              className={`text-xs mt-1 ${change.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
              {change}
            </p>
          </div>
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClasses[color]}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MetricItem({ label, value, change, positive }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-600">{label}</span>
      <div className="text-right">
        <p className="font-bold">{value}</p>
        <p
          className={`text-xs ${positive ? "text-green-600" : "text-red-600"}`}>
          {change}
        </p>
      </div>
    </div>
  );
}
