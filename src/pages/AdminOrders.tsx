import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AdminSidebar from "@/components/AdminSidebar";
import { toast } from "sonner";
import {
  ShoppingCart,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Eye,
  Download,
  Clock,
  RefreshCw,
} from "lucide-react";
import { format } from "date-fns";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusIcons = {
  pending: Clock,
  paid: Package,
  shipped: Truck,
  completed: CheckCircle,
  cancelled: XCircle,
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    paid: 0,
    shipped: 0,
    completed: 0,
  });

  useEffect(() => {
    fetchOrders();
  }, [filterStatus, searchQuery]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      let url = `${API_BASE_URL}/admin/orders?`;
      if (filterStatus !== "all") url += `status=${filterStatus}&`;
      if (searchQuery) url += `search=${searchQuery}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);

        // Calculate stats
        const statusCount = {
          total: data.orders.length,
          pending: data.orders.filter((o) => o.status === "pending").length,
          paid: data.orders.filter((o) => o.status === "paid").length,
          shipped: data.orders.filter((o) => o.status === "shipped").length,
          completed: data.orders.filter((o) => o.status === "completed").length,
        };
        setStats(statusCount);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/admin/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success("Order status updated successfully!");
        fetchOrders();
      } else {
        toast.error(data.message || "Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  const handleViewDetails = async (orderId) => {
    try {
      const order = orders.find((o) => o._id === orderId);
      setSelectedOrder(order);
      setIsDetailDialogOpen(true);
    } catch (error) {
      console.error("Error viewing order details:", error);
      toast.error("Failed to load order details");
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-2">Track and manage customer orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <ShoppingCart className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold mt-1">{stats.total}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold mt-1">{stats.pending}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Paid</p>
                <p className="text-2xl font-bold mt-1">{stats.paid}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Truck className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Shipped</p>
                <p className="text-2xl font-bold mt-1">{stats.shipped}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold mt-1">{stats.completed}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>All Orders</CardTitle>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full md:w-40">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={fetchOrders}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No orders found matching your criteria
                </div>
              ) : (
                orders.map((order) => {
                  const StatusIcon = statusIcons[order.status];
                  return (
                    <div
                      key={order._id}
                      className="flex flex-col md:flex-row md:items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow bg-white">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">
                            #{order.orderNumber}
                          </h3>
                          <Badge className={statusColors[order.status]}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Customer: {order.user?.displayName || "N/A"}
                        </p>
                        <p className="text-sm text-gray-600">
                          Email: {order.user?.email || "N/A"}
                        </p>
                        <p className="text-sm text-gray-600">
                          Date:{" "}
                          {format(new Date(order.createdAt), "MMM dd, yyyy")}
                        </p>
                        <p className="text-sm text-gray-600">
                          Items: {order.items.length}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-2xl text-blue-600">
                          {order.total.toFixed(2)} L.E
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Select
                          value={order.status}
                          onValueChange={(value) =>
                            handleStatusChange(order._id, value)
                          }>
                          <SelectTrigger className="w-full md:w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(order._id)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Complete information about the order
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order Number</p>
                  <p className="font-semibold">#{selectedOrder.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge className={statusColors[selectedOrder.status]}>
                    {selectedOrder.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="font-semibold">
                    {selectedOrder.user?.displayName || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold">
                    {selectedOrder.user?.email || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-semibold">
                    {format(new Date(selectedOrder.createdAt), "MMMM dd, yyyy")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="font-semibold text-blue-600">
                    {selectedOrder.total.toFixed(2)} L.E
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-3">Order Items</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold">
                          {item.product?.name || "Product N/A"}
                        </p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold">
                        {(item.price * item.quantity).toFixed(2)} L.E
                      </p>
                    </div>
                  ))}
                </div>
              </div>

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
