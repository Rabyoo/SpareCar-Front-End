// src/pages/Orders.tsx
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Truck,
  Home,
  XCircle,
  CheckCircle,
  AlertCircle,
  Clock,
  ShoppingBag,
  Download,
  Star,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  RefreshCw,
  Eye,
  MessageCircle,
  Ban,
  Undo2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface OrderItem {
  product: {
    _id?: string;
    id?: string;
    name: string;
    price: number;
    images?: string[];
  };
  quantity: number;
  size?: string;
  color?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  transactionId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  date: string;
  estimatedDelivery: string;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    zipCode: string;
    email: string;
    phone: string;
  };
  paymentMethod: string;
  status:
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "returned"
    | "pending";
  trackingNumber?: string;
  carrier?: string;
  canCancel: boolean;
  canReturn: boolean;
  canReview: boolean;
  cancellationReason?: string;
  cancellationDate?: string;
}

type CancellationReason =
  | "changed-mind"
  | "found-cheaper"
  | "wrong-item"
  | "delivery-delay"
  | "financial-reasons"
  | "no-longer-needed"
  | "product-not-as-expected"
  | "other";

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancellationReason, setCancellationReason] =
    useState<CancellationReason>("changed-mind");
  const [cancellationNote, setCancellationNote] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancellationPassword, setCancellationPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    // Add missing properties to old orders
    const enhancedOrders = savedOrders.map((order: any, index: number) => ({
      ...order,
      id: order.id || `order-${Date.now()}-${index}`,
      subtotal:
        order.subtotal ||
        order.items.reduce(
          (sum: number, item: any) =>
            sum + (item.product.price || 0) * item.quantity,
          0
        ),
      shipping: order.shipping || (order.subtotal > 100 ? 0 : 9.99),
      shippingAddress: order.shippingAddress ||
        order.shipping || {
          fullName: "John Doe",
          address: "123 Main St",
          city: "New York",
          zipCode: "10001",
          email: "customer@example.com",
          phone: "+1234567890",
        },
      status:
        order.status ||
        (new Date(order.date) > new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
          ? "processing"
          : "delivered"),
      estimatedDelivery:
        order.estimatedDelivery ||
        new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      canCancel:
        !["cancelled", "delivered", "shipped"].includes(order.status) &&
        new Date(order.date) > new Date(Date.now() - 24 * 60 * 60 * 1000),
      canReturn:
        order.status === "delivered" &&
        new Date(order.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      canReview:
        order.status === "delivered" &&
        !order.items.some((item: any) => item.reviewed),
      trackingNumber:
        order.trackingNumber ||
        `TRK${Math.random().toString(36).substr(2, 10).toUpperCase()}`,
      carrier:
        order.carrier ||
        ["FedEx", "UPS", "DHL", "Aramex"][Math.floor(Math.random() * 4)],
    }));
    setOrders(enhancedOrders);
  };

  const getStatusDetails = (status: string) => {
    switch (status) {
      case "processing":
        return {
          text: "Processing",
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: <Clock className="h-4 w-4" />,
          progress: 25,
        };
      case "shipped":
        return {
          text: "Shipped",
          color: "bg-blue-100 text-blue-800 border-blue-200",
          icon: <Truck className="h-4 w-4" />,
          progress: 60,
        };
      case "delivered":
        return {
          text: "Delivered",
          color: "bg-green-100 text-green-800 border-green-200",
          icon: <CheckCircle className="h-4 w-4" />,
          progress: 100,
        };
      case "cancelled":
        return {
          text: "Cancelled",
          color: "bg-red-100 text-red-800 border-red-200",
          icon: <XCircle className="h-4 w-4" />,
          progress: 0,
        };
      case "returned":
        return {
          text: "Returned",
          color: "bg-purple-100 text-purple-800 border-purple-200",
          icon: <RefreshCw className="h-4 w-4" />,
          progress: 0,
        };
      case "pending":
        return {
          text: "Pending",
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: <Clock className="h-4 w-4" />,
          progress: 10,
        };
      default:
        return {
          text: "Unknown",
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: <AlertCircle className="h-4 w-4" />,
          progress: 0,
        };
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "card":
        return "💳 Credit Card";
      case "paypal":
        return "📱 PayPal";
      case "applepay":
        return " Apple Pay";
      case "cash":
        return "💵 Cash on Delivery";
      default:
        return "💳 Credit Card";
    }
  };

  const getCancellationReasonText = (reason: CancellationReason) => {
    switch (reason) {
      case "changed-mind":
        return "Changed my mind";
      case "found-cheaper":
        return "Found cheaper elsewhere";
      case "wrong-item":
        return "Ordered wrong item";
      case "delivery-delay":
        return "Delivery is taking too long";
      case "financial-reasons":
        return "Financial reasons";
      case "no-longer-needed":
        return "No longer needed";
      case "product-not-as-expected":
        return "Product not as expected";
      case "other":
        return "Other reason";
      default:
        return "Other reason";
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!selectedOrder) return;

    // Check if password is entered for security
    if (cancellationPassword !== "confirm123") {
      // In real app, use proper authentication
      toast.error("Please enter the correct confirmation password");
      return;
    }

    setIsCancelling(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        const cancellationData = {
          status: "cancelled" as const,
          canCancel: false,
          canReturn: false,
          cancellationReason: getCancellationReasonText(cancellationReason),
          cancellationNote: cancellationNote || undefined,
          cancellationDate: new Date().toISOString(),
        };

        return {
          ...order,
          ...cancellationData,
        };
      }
      return order;
    });

    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    // Show refund information based on payment method
    let refundInfo = "";
    if (selectedOrder.paymentMethod === "cash") {
      refundInfo =
        "Since you chose Cash on Delivery, no payment was processed.";
    } else {
      refundInfo =
        "Refund will be processed within 5-7 business days to your original payment method.";
    }

    toast.success("🎉 Order cancelled successfully", {
      description: `Order ${selectedOrder.orderNumber} has been cancelled. ${refundInfo}`,
      duration: 5000,
    });

    setIsCancelling(false);
    setSelectedOrder(null);
    setCancellationPassword("");
    setCancellationNote("");
  };

  const handleQuickCancel = (order: Order) => {
    setSelectedOrder(order);
    setCancellationReason("changed-mind");
    toast.info("Cancelling Order", {
      description: "Please confirm cancellation details",
      action: {
        label: "Open Dialog",
        onClick: () =>
          document.getElementById(`cancel-dialog-${order.id}`)?.click(),
      },
    });
  };

  const handleUndoCancel = async (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    setIsCancelling(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const updatedOrders = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          status: "processing" as const,
          canCancel: true,
          cancellationReason: undefined,
          cancellationNote: undefined,
          cancellationDate: undefined,
        };
      }
      return o;
    });

    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    toast.success("✅ Order restored", {
      description: `Order ${order.orderNumber} has been restored to processing status.`,
    });

    setIsCancelling(false);
  };

  const handleTrackOrder = (order: Order) => {
    window.open(
      `https://tracking.example.com?tracking=${order.trackingNumber}`,
      "_blank"
    );
    toast.info("📦 Tracking opened", {
      description: `Tracking page opened in new tab for ${order.trackingNumber}`,
    });
  };

  const handleBuyAgain = (order: Order) => {
    toast.success("🛒 Items added to cart", {
      description: "All items from this order have been added to your cart",
      action: {
        label: "View Cart",
        onClick: () => navigate("/cart"),
      },
    });
  };

  const handleDownloadInvoice = (order: Order) => {
    // Create invoice content
    const invoiceContent = `
      INVOICE
      Order Number: ${order.orderNumber}
      Date: ${new Date(order.date).toLocaleDateString()}
      
      BILL TO:
      ${order.shippingAddress.fullName}
      ${order.shippingAddress.address}
      ${order.shippingAddress.city}, ${order.shippingAddress.zipCode}
      ${order.shippingAddress.email}
      ${order.shippingAddress.phone}
      
      ITEMS:
      ${order.items
        .map(
          (item) => `
        • ${item.product.name}
          Qty: ${item.quantity} x ${item.product.price.toFixed(2)} L.E
          Total: ${(item.product.price * item.quantity).toFixed(2)} L.E
      `
        )
        .join("")}
      
      SUBTOTAL: ${order.subtotal.toFixed(2)} L.E
      SHIPPING: ${order.shipping.toFixed(2)} L.E
      TOTAL: ${order.total.toFixed(2)} L.E
      
      Payment Method: ${order.paymentMethod}
      Status: ${order.status}
    `;

    const blob = new Blob([invoiceContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${order.orderNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("📄 Invoice downloaded", {
      description: `Invoice for order ${order.orderNumber} has been downloaded`,
    });
  };

  const handleContactSupport = (order: Order) => {
    navigate(
      `/contact?order=${order.orderNumber}&subject=Order%20${order.orderNumber}%20Issue`
    );
  };

  const handleWriteReview = (order: Order) => {
    navigate(`/reviews/new?order=${order.orderNumber}`);
  };

  const handleReturnOrder = (order: Order) => {
    navigate(`/returns/new?order=${order.orderNumber}`);
  };

  const getDaysRemaining = (date: string) => {
    const deliveryDate = new Date(date);
    const today = new Date();
    const diffTime = deliveryDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getCancellationPolicy = (order: Order) => {
    const orderDate = new Date(order.date);
    const now = new Date();
    const hoursPassed =
      (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60);

    if (hoursPassed < 1) {
      return "You can cancel this order free of charge within 1 hour of placing it.";
    } else if (hoursPassed < 24) {
      return "Cancellation may incur a 10% restocking fee.";
    } else {
      return "Cancellation is no longer available. Please contact support for assistance.";
    }
  };

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Package className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-4">No Orders Yet</h2>
        <p className="text-muted-foreground mb-6">
          You haven't placed any orders yet. Start shopping to see your orders
          here!
        </p>
        <Button
          onClick={() => navigate("/products")}
          className="bg-[#d32e1d] hover:bg-[#b3281a]">
          <ShoppingBag className="mr-2 h-4 w-4" />
          Start Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">My Orders</h1>
          <p className="text-gray-600 mt-2">
            {orders.length} order{orders.length !== 1 ? "s" : ""} placed
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/")}>
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Filter Orders
                <ChevronRight className="ml-2 h-4 w-4 rotate-90" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => loadOrders()}>
                All Orders
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  setOrders(orders.filter((o) => o.status === "processing"))
                }>
                Processing
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  setOrders(orders.filter((o) => o.status === "shipped"))
                }>
                Shipped
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  setOrders(orders.filter((o) => o.status === "delivered"))
                }>
                Delivered
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  setOrders(orders.filter((o) => o.status === "cancelled"))
                }>
                Cancelled
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Cancellation Alert */}
      {orders.some((order) => order.canCancel) && (
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            You have {orders.filter((order) => order.canCancel).length} order
            {orders.filter((order) => order.canCancel).length !== 1
              ? "s"
              : ""}{" "}
            that can still be cancelled.
          </AlertDescription>
        </Alert>
      )}

      {/* Orders Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">To Ship</p>
                <p className="text-2xl font-bold">
                  {orders.filter((o) => o.status === "processing").length}
                </p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Shipping</p>
                <p className="text-2xl font-bold">
                  {orders.filter((o) => o.status === "shipped").length}
                </p>
              </div>
              <Truck className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Delivered</p>
                <p className="text-2xl font-bold">
                  {orders.filter((o) => o.status === "delivered").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Cancelled</p>
                <p className="text-2xl font-bold">
                  {orders.filter((o) => o.status === "cancelled").length}
                </p>
              </div>
              <Ban className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {orders
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .map((order) => {
            const statusDetails = getStatusDetails(order.status);
            const daysRemaining = getDaysRemaining(order.estimatedDelivery);
            const canCancel = order.canCancel;

            return (
              <Card
                key={order.id}
                className="hover:shadow-lg transition-shadow border">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">
                          Order: {order.orderNumber}
                        </CardTitle>
                        <Badge className={statusDetails.color}>
                          {statusDetails.icon}
                          <span className="ml-1">{statusDetails.text}</span>
                        </Badge>
                        {order.status === "cancelled" &&
                          order.cancellationReason && (
                            <Badge variant="outline" className="text-xs">
                              Reason: {order.cancellationReason}
                            </Badge>
                          )}
                      </div>
                      <p className="text-sm text-gray-500">
                        Placed on{" "}
                        {new Date(order.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                        {order.cancellationDate && (
                          <span className="text-red-600 ml-2">
                            • Cancelled on{" "}
                            {new Date(
                              order.cancellationDate
                            ).toLocaleDateString()}
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        Total:{" "}
                        <span className="font-bold text-lg text-green-600">
                          {order.total.toFixed(2)} L.E
                        </span>
                      </span>
                      <span className="text-gray-400 mx-2">•</span>
                      <span className="text-sm text-gray-600">
                        {getPaymentMethodIcon(order.paymentMethod)}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Quick Cancel Button for Processing Orders */}
                  {canCancel && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-red-800">
                              Want to cancel this order?
                            </h4>
                            <p className="text-sm text-red-600 mt-1">
                              {getCancellationPolicy(order)}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="sm"
                                id={`cancel-dialog-${order.id}`}
                                onClick={() => setSelectedOrder(order)}>
                                <Ban className="mr-2 h-4 w-4" />
                                Cancel Order
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <XCircle className="h-5 w-5 text-red-500" />
                                  Cancel Order #{order.orderNumber}
                                </DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to cancel this order?
                                  This action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label>Why are you cancelling?</Label>
                                  <Select
                                    value={cancellationReason}
                                    onValueChange={(
                                      value: CancellationReason
                                    ) => setCancellationReason(value)}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="changed-mind">
                                        Changed my mind
                                      </SelectItem>
                                      <SelectItem value="financial-reasons">
                                        Financial reasons
                                      </SelectItem>
                                      <SelectItem value="no-longer-needed">
                                        No longer needed
                                      </SelectItem>
                                      <SelectItem value="found-cheaper">
                                        Found cheaper elsewhere
                                      </SelectItem>
                                      <SelectItem value="wrong-item">
                                        Ordered wrong item
                                      </SelectItem>
                                      <SelectItem value="product-not-as-expected">
                                        Product not as expected
                                      </SelectItem>
                                      <SelectItem value="delivery-delay">
                                        Delivery is taking too long
                                      </SelectItem>
                                      <SelectItem value="other">
                                        Other reason
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Additional notes (optional)</Label>
                                  <Textarea
                                    placeholder="Please tell us more about why you're cancelling..."
                                    value={cancellationNote}
                                    onChange={(e) =>
                                      setCancellationNote(e.target.value)
                                    }
                                    rows={3}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="password">
                                    Type "confirm123" to confirm cancellation
                                  </Label>
                                  <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter confirmation"
                                    value={cancellationPassword}
                                    onChange={(e) =>
                                      setCancellationPassword(e.target.value)
                                    }
                                  />
                                  <p className="text-xs text-gray-500 mt-1">
                                    For security, please confirm your
                                    cancellation
                                  </p>
                                </div>
                                <Alert className="bg-yellow-50 border-yellow-200">
                                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                                  <AlertDescription className="text-yellow-700 text-sm">
                                    {order.paymentMethod === "cash"
                                      ? "Since you chose Cash on Delivery, no payment was processed."
                                      : "Refund will be processed within 5-7 business days to your original payment method."}
                                  </AlertDescription>
                                </Alert>
                              </div>
                              <DialogFooter className="flex gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => setSelectedOrder(null)}
                                  className="flex-1">
                                  Keep Order
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => handleCancelOrder(order.id)}
                                  disabled={
                                    isCancelling ||
                                    cancellationPassword !== "confirm123"
                                  }
                                  className="flex-1">
                                  {isCancelling ? (
                                    <>
                                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                                      Cancelling...
                                    </>
                                  ) : (
                                    <>
                                      <Ban className="mr-2 h-4 w-4" />
                                      Confirm Cancellation
                                    </>
                                  )}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickCancel(order)}>
                            Quick Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Restore Button for Cancelled Orders */}
                  {order.status === "cancelled" && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Undo2 className="h-5 w-5 text-green-600" />
                          <div>
                            <h4 className="font-medium text-green-800">
                              Changed your mind?
                            </h4>
                            <p className="text-sm text-green-600">
                              You can restore this order if you want to proceed
                              with the purchase.
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-green-300 text-green-700 hover:bg-green-100"
                          onClick={() => handleUndoCancel(order.id)}
                          disabled={isCancelling}>
                          <Undo2 className="mr-2 h-4 w-4" />
                          Restore Order
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Order Progress */}
                  {order.status !== "cancelled" &&
                    order.status !== "returned" && (
                      <div className="mb-6">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Order Progress</span>
                          <span className="font-medium">
                            {statusDetails.progress}%
                          </span>
                        </div>
                        <Progress
                          value={statusDetails.progress}
                          className="h-2"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                          <span>Order Placed</span>
                          <span>Processing</span>
                          <span>Shipped</span>
                          <span>Delivered</span>
                        </div>
                      </div>
                    )}

                  {/* Order Items Preview */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4" />
                      Order Items ({order.items.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {order.items.slice(0, 3).map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 border rounded-lg">
                          <img
                            src={
                              item.product.images?.[0] ||
                              "https://via.placeholder.com/60"
                            }
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium line-clamp-1">
                              {item.product.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              Qty: {item.quantity}
                              {item.size && ` • Size: ${item.size}`}
                              {item.color && ` • Color: ${item.color}`}
                            </p>
                            <p className="text-sm font-bold mt-1">
                              {(
                                (item.product.price || 0) * item.quantity
                              ).toFixed(2)}{" "}
                              L.E
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="flex items-center justify-center p-3 border rounded-lg">
                          <p className="text-sm text-gray-500">
                            +{order.items.length - 3} more items
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Delivery Information */}
                  {order.status !== "cancelled" &&
                    order.status !== "returned" && (
                      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Truck className="h-5 w-5 text-blue-600" />
                              <h4 className="font-medium">
                                Delivery Information
                              </h4>
                            </div>
                            <p className="text-sm text-gray-600">
                              Estimated delivery:{" "}
                              <span className="font-semibold">
                                {new Date(
                                  order.estimatedDelivery
                                ).toLocaleDateString()}
                              </span>{" "}
                              (
                              {daysRemaining > 0
                                ? `${daysRemaining} day${
                                    daysRemaining !== 1 ? "s" : ""
                                  } remaining`
                                : "Delayed"}
                              )
                            </p>
                            {order.trackingNumber && (
                              <p className="text-sm text-gray-600 mt-1">
                                Tracking:{" "}
                                <span className="font-mono">
                                  {order.trackingNumber}
                                </span>
                                {" • "}
                                Carrier:{" "}
                                <span className="font-semibold">
                                  {order.carrier}
                                </span>
                              </p>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTrackOrder(order)}
                            className="whitespace-nowrap">
                            Track Package
                          </Button>
                        </div>
                      </div>
                    )}

                  {/* Shipping Address */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-2 mb-2">
                      <MapPin className="h-5 w-5 text-gray-600" />
                      <h4 className="font-medium">Shipping Address</h4>
                    </div>
                    <p className="text-sm">
                      {order.shippingAddress.fullName}
                      <br />
                      {order.shippingAddress.address}
                      <br />
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.zipCode}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {order.shippingAddress.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {order.shippingAddress.email}
                      </span>
                    </div>
                  </div>
                </CardContent>

                <Separator />

                <CardFooter className="flex flex-wrap gap-2 pt-6">
                  {order.canCancel && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
                          <XCircle className="mr-2 h-4 w-4" />
                          Cancel Order
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Cancel Order</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to cancel order{" "}
                            {order.orderNumber}? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Reason for cancellation</Label>
                            <Select
                              value={cancellationReason}
                              onValueChange={(value: CancellationReason) =>
                                setCancellationReason(value)
                              }>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="changed-mind">
                                  Changed my mind
                                </SelectItem>
                                <SelectItem value="found-cheaper">
                                  Found cheaper elsewhere
                                </SelectItem>
                                <SelectItem value="wrong-item">
                                  Ordered wrong item
                                </SelectItem>
                                <SelectItem value="delivery-delay">
                                  Delivery is taking too long
                                </SelectItem>
                                <SelectItem value="financial-reasons">
                                  Financial reasons
                                </SelectItem>
                                <SelectItem value="no-longer-needed">
                                  No longer needed
                                </SelectItem>
                                <SelectItem value="product-not-as-expected">
                                  Product not as expected
                                </SelectItem>
                                <SelectItem value="other">
                                  Other reason
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Additional notes (optional)</Label>
                            <Textarea
                              placeholder="Please provide more details..."
                              value={cancellationNote}
                              onChange={(e) =>
                                setCancellationNote(e.target.value)
                              }
                              rows={3}
                            />
                          </div>
                          <Alert className="bg-yellow-50 border-yellow-200">
                            <AlertCircle className="h-4 w-4 text-yellow-600" />
                            <AlertDescription className="text-yellow-700 text-sm">
                              Refunds for cancelled orders are processed within
                              5-7 business days.
                            </AlertDescription>
                          </Alert>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setSelectedOrder(null)}>
                            Keep Order
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleCancelOrder(order.id)}
                            disabled={isCancelling}>
                            {isCancelling ? "Cancelling..." : "Cancel Order"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}

                  {order.canReturn && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReturnOrder(order)}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Return Items
                    </Button>
                  )}

                  {order.canReview && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleWriteReview(order)}>
                      <Star className="mr-2 h-4 w-4" />
                      Write Review
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBuyAgain(order)}>
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Buy Again
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadInvoice(order)}>
                    <Download className="mr-2 h-4 w-4" />
                    Invoice
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/orders/${order.id}`)}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleContactSupport(order)}>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Contact Support
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
      </div>

      {/* Empty state for filtered orders */}
      {orders.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium mb-2">
            No orders match your filter
          </h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your filter or view all orders
          </p>
          <Button onClick={loadOrders} variant="outline">
            View All Orders
          </Button>
        </div>
      )}
    </div>
  );
}
