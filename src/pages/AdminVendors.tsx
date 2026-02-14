// frontend/src/pages/admin/AdminVendors.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  Eye,
  AlertCircle,
  Download,
  RefreshCw,
  UserCheck,
  UserX,
  Store,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminVendors() {
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    filterVendors();
  }, [vendors, searchQuery, statusFilter, dateFilter]);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/vendors`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = await response.json();
      if (data.success) {
        setVendors(data.vendors);
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterVendors = () => {
    let filtered = [...vendors];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (vendor) =>
          vendor.businessName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          vendor.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vendor.email.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (vendor) => vendor.verificationStatus === statusFilter,
      );
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const cutoffDate = new Date();

      switch (dateFilter) {
        case "today":
          cutoffDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case "month":
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
      }

      filtered = filtered.filter(
        (vendor) => new Date(vendor.createdAt) >= cutoffDate,
      );
    }

    setFilteredVendors(filtered);
  };

  const updateVendorStatus = async (vendorId, status) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/vendors/${vendorId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        },
      );

      const data = await response.json();
      if (data.success) {
        fetchVendors(); // Refresh list
      }
    } catch (error) {
      console.error("Error updating vendor status:", error);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: { className: "bg-yellow-100 text-yellow-800", label: "Pending" },
      approved: { className: "bg-green-100 text-green-800", label: "Approved" },
      rejected: { className: "bg-red-100 text-red-800", label: "Rejected" },
      suspended: { className: "bg-gray-100 text-gray-800", label: "Suspended" },
    };

    const variant = variants[status] || variants.pending;
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - Assuming AdminSidebar component exists */}
      <div className="flex">
        <AdminSidebar />

        <div className="flex-1 ml-64 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Vendor Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage and monitor registered vendors on the platform
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Vendors"
              value={vendors.length}
              icon={<Store className="w-6 h-6" />}
              color="blue"
            />
            <StatCard
              title="Pending Review"
              value={
                vendors.filter((v) => v.verificationStatus === "pending").length
              }
              icon={<AlertCircle className="w-6 h-6" />}
              color="yellow"
            />
            <StatCard
              title="Active Vendors"
              value={
                vendors.filter((v) => v.verificationStatus === "approved")
                  .length
              }
              icon={<CheckCircle className="w-6 h-6" />}
              color="green"
            />
            <StatCard
              title="Suspended"
              value={
                vendors.filter((v) => v.verificationStatus === "suspended")
                  .length
              }
              icon={<UserX className="w-6 h-6" />}
              color="red"
            />
          </div>

          {/* Filters Card */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search vendors by name, email, or business..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Date Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">Last 7 Days</SelectItem>
                    <SelectItem value="month">Last 30 Days</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={fetchVendors}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vendors Table */}
          <Card>
            <CardHeader>
              <CardTitle>Vendors List</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading vendors...</p>
                </div>
              ) : filteredVendors.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No vendors found matching your criteria
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Business</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Products</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredVendors.map((vendor) => (
                        <TableRow key={vendor._id} className="hover:bg-gray-50">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                {vendor.logo ? (
                                  <img
                                    src={vendor.logo}
                                    alt={vendor.vendorName}
                                    className="w-10 h-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <Store className="w-5 h-5 text-gray-600" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium">
                                  {vendor.vendorName}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {vendor.businessType}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium">{vendor.businessName}</p>
                            <p className="text-sm text-gray-600">
                              {vendor.address?.city || "N/A"}
                            </p>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium">{vendor.email}</p>
                            <p className="text-sm text-gray-600">
                              {vendor.phone || "N/A"}
                            </p>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(vendor.verificationStatus)}
                          </TableCell>
                          <TableCell>
                            <div className="text-center">
                              <p className="font-bold">
                                {vendor.totalProducts || 0}
                              </p>
                              <p className="text-xs text-gray-600">Products</p>
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(vendor.createdAt)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                {vendor.verificationStatus === "pending" && (
                                  <>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        updateVendorStatus(
                                          vendor._id,
                                          "approved",
                                        )
                                      }
                                      className="text-green-600">
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      Approve
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        updateVendorStatus(
                                          vendor._id,
                                          "rejected",
                                        )
                                      }
                                      className="text-red-600">
                                      <XCircle className="w-4 h-4 mr-2" />
                                      Reject
                                    </DropdownMenuItem>
                                  </>
                                )}

                                {vendor.verificationStatus === "approved" && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      updateVendorStatus(
                                        vendor._id,
                                        "suspended",
                                      )
                                    }
                                    className="text-red-600">
                                    <UserX className="w-4 h-4 mr-2" />
                                    Suspend
                                  </DropdownMenuItem>
                                )}

                                {(vendor.verificationStatus === "rejected" ||
                                  vendor.verificationStatus ===
                                    "suspended") && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      updateVendorStatus(vendor._id, "approved")
                                    }
                                    className="text-green-600">
                                    <UserCheck className="w-4 h-4 mr-2" />
                                    Activate
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Pagination */}
              {filteredVendors.length > 0 && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-gray-600">
                    Showing {filteredVendors.length} of {vendors.length} vendors
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm">
                      1
                    </Button>
                    <Button variant="outline" size="sm">
                      2
                    </Button>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Vendor Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    action: "New vendor registration",
                    vendor: "AutoParts Pro",
                    time: "2 hours ago",
                    type: "pending",
                  },
                  {
                    action: "Vendor approved",
                    vendor: "CarTech Solutions",
                    time: "Yesterday",
                    type: "approved",
                  },
                  {
                    action: "Product added",
                    vendor: "Motor Masters",
                    time: "2 days ago",
                    type: "product",
                  },
                  {
                    action: "Vendor suspended",
                    vendor: "Quick Fix Auto",
                    time: "3 days ago",
                    type: "suspended",
                  },
                  {
                    action: "Documents uploaded",
                    vendor: "Genuine Parts Co",
                    time: "4 days ago",
                    type: "document",
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 border rounded-lg">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.type === "pending"
                          ? "bg-yellow-100"
                          : activity.type === "approved"
                            ? "bg-green-100"
                            : activity.type === "suspended"
                              ? "bg-red-100"
                              : "bg-blue-100"
                      }`}>
                      {activity.type === "pending" && (
                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                      )}
                      {activity.type === "approved" && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                      {activity.type === "suspended" && (
                        <UserX className="w-4 h-4 text-red-600" />
                      )}
                      {activity.type === "product" && (
                        <Store className="w-4 h-4 text-blue-600" />
                      )}
                      {activity.type === "document" && (
                        <Eye className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.vendor}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function AdminSidebar() {
  // This should be your existing AdminSidebar component
  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200">
      {/* Sidebar content */}
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    yellow: "bg-yellow-100 text-yellow-600",
    green: "bg-green-100 text-green-600",
    red: "bg-red-100 text-red-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
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
