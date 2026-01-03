import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AdminSidebar from "@/components/AdminSidebar";
import {
  Users,
  UserPlus,
  ShoppingBag,
  DollarSign,
  Search,
  Eye,
  Mail,
  Phone,
  MapPin,
  RefreshCw,
  Calendar,
  PoundSterling,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    totalRevenue: 0,
    avgOrderValue: 0,
  });

  useEffect(() => {
    fetchCustomers();
  }, [searchQuery]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      let url = `${API_BASE_URL}/admin/customers?`;
      if (searchQuery) url += `search=${searchQuery}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setCustomers(data.customers);

        // Calculate stats
        const totalRevenue = data.customers.reduce(
          (sum, c) => sum + (c.totalSpent || 0),
          0
        );
        const totalOrders = data.customers.reduce(
          (sum, c) => sum + (c.totalOrders || 0),
          0
        );

        setStats({
          total: data.customers.length,
          active: data.customers.filter((c) => c.isActive).length,
          totalRevenue,
          avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
        });
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast.error("Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (customerId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/admin/customers/${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setSelectedCustomer(data.customer);
        setIsDetailDialogOpen(true);
      }
    } catch (error) {
      console.error("Error fetching customer details:", error);
      toast.error("Failed to load customer details");
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      customer.displayName?.toLowerCase().includes(query) ||
      customer.email?.toLowerCase().includes(query) ||
      customer.phone?.toLowerCase().includes(query)
    );
  });

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Customer Management
          </h1>
          <p className="text-gray-600 mt-2">
            View and manage your customer base
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Customers</p>
                  <p className="text-2xl font-bold mt-1">{stats.total}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Customers</p>
                  <p className="text-2xl font-bold mt-1">{stats.active}</p>
                </div>
                <UserPlus className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold mt-1">
                    {stats.totalRevenue.toFixed(2)} L.E
                  </p>
                </div>
                <PoundSterling className="w-8 h-8 text-purple-600" />
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
                </div>
                <ShoppingBag className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customers List */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>All Customers</CardTitle>
              <div className="flex gap-3">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search customers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" onClick={fetchCustomers}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredCustomers.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No customers found matching your criteria
                </div>
              ) : (
                filteredCustomers.map((customer) => (
                  <div
                    key={customer._id}
                    className="flex flex-col md:flex-row md:items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow bg-white">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">
                            {customer.displayName || "N/A"}
                          </h3>
                          <Badge
                            variant={
                              customer.isActive ? "default" : "secondary"
                            }>
                            {customer.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{customer.email || "N/A"}</span>
                          </div>
                          {customer.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <span>{customer.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                              Joined:{" "}
                              {format(
                                new Date(customer.createdAt),
                                "MMM dd, yyyy"
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-sm text-gray-600">Orders</p>
                        <p className="font-bold text-lg">
                          {customer.totalOrders || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Spent</p>
                        <p className="font-bold text-lg text-blue-600">
                          {(customer.totalSpent || 0).toFixed(2)} L.E
                        </p>
                      </div>
                      <div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(customer._id)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>
              Complete customer information and order history
            </DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-semibold">
                    {selectedCustomer.displayName || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold">
                    {selectedCustomer.email || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-semibold">
                    {selectedCustomer.phone || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge
                    variant={
                      selectedCustomer.isActive ? "default" : "secondary"
                    }>
                    {selectedCustomer.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Join Date</p>
                  <p className="font-semibold">
                    {format(
                      new Date(selectedCustomer.createdAt),
                      "MMMM dd, yyyy"
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Provider</p>
                  <p className="font-semibold capitalize">
                    {selectedCustomer.provider || "local"}
                  </p>
                </div>
              </div>

              {selectedCustomer.address && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Address</p>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-semibold">
                      {selectedCustomer.address.street || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedCustomer.address.city},{" "}
                      {selectedCustomer.address.state}{" "}
                      {selectedCustomer.address.zipCode}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedCustomer.address.country}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold">
                    {selectedCustomer.stats?.totalOrders || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {(selectedCustomer.stats?.totalSpent || 0).toFixed(2)} L.E
                  </p>
                </div>
              </div>

              {selectedCustomer.recentOrders &&
                selectedCustomer.recentOrders.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-3">Recent Orders</p>
                    <div className="space-y-2">
                      {selectedCustomer.recentOrders.map((order) => (
                        <div
                          key={order._id}
                          className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-semibold">
                              #{order.orderNumber}
                            </p>
                            <p className="text-sm text-gray-600">
                              {format(
                                new Date(order.createdAt),
                                "MMM dd, yyyy"
                              )}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">
                              {order.total.toFixed(2)} L.E
                            </p>
                            <Badge variant="secondary">{order.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              <div className="flex justify-end">
                <Button onClick={() => setIsDetailDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
