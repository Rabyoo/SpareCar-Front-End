// Cart.tsx (النسخة النهائية المصححة)
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getCartCount,
  } = useCart();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCheckout = () => {
    if (!user) {
      toast.error("Please login first to complete your purchase");
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }
    navigate("/checkout");
  };

  

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">
          Add some products to get started
        </p>
        <Link to="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  // Get the first image from the images array
  const getFirstImage = (product: any) => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    return "/placeholder-image.jpg";
  };

  // Get product ID (handles both _id and id)
  const getProductId = (product: any) => {
    return product._id || product.id;
  };

  return (
    <div className="container mt-20 mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

      {/* Show cart summary */}
      <div className="mb-4 text-lg">
        <span className="font-semibold">Total Items: </span> {getCartCount()} |
        <span className="font-semibold ml-4">Unique Products: </span>{" "}
        {cartItems.length}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item, index) => (
            <Card
              key={`${getProductId(item.product)}-${item.size || "default"}-${
                item.color || "default"
              }-${index}`}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <img
                    src={getFirstImage(item.product)}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/placeholder-image.jpg";
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {item.product.category}
                    </p>

                    {/* Show size and color if they exist */}
                    {item.size && (
                      <p className="text-sm text-muted-foreground">
                        Size: {item.size}
                      </p>
                    )}
                    {item.color && (
                      <p className="text-sm text-muted-foreground">
                        Color: {item.color}
                      </p>
                    )}

                    {/* Show brand and part number if available */}
                    {item.product.brand && (
                      <p className="text-sm text-muted-foreground">
                        Brand: {item.product.brand}
                      </p>
                    )}
                    {item.product.partNumber && (
                      <p className="text-sm text-muted-foreground">
                        Part No: {item.product.partNumber}
                      </p>
                    )}

                    <p className="text-lg font-bold text-blue-600 mt-2">
                      {item.product.price?.toFixed(2) || "0.00"} L.E
                    </p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        removeFromCart(
                          getProductId(item.product),
                          item.size,
                          item.color
                        )
                      }>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                    <div className="flex items-center border rounded-md">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          updateQuantity(
                            getProductId(item.product),
                            item.quantity - 1,
                            item.size,
                            item.color
                          )
                        }>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (val >= 1) {
                            updateQuantity(
                              getProductId(item.product),
                              val,
                              item.size,
                              item.color
                            );
                          }
                        }}
                        className="w-16 text-center border-0"
                        min={1}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          updateQuantity(
                            getProductId(item.product),
                            item.quantity + 1,
                            item.size,
                            item.color
                          )
                        }>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-20">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items</span>
                  <span className="font-medium">{getCartCount()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Unique Products</span>
                  <span className="font-medium">{cartItems.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">
                    {getCartTotal().toFixed(2)} L.E
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">
                    {getCartTotal() > 100 ? "FREE" : "9.99 L.E"}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">
                    {(
                      getCartTotal() + (getCartTotal() > 100 ? 0 : 9.99)
                    ).toFixed(2)}{" "}
                    L.E
                  </span>
                </div>
              </div>
              {getCartTotal() < 100 && (
                <p className="text-sm text-muted-foreground mb-4">
                  Add {(100 - getCartTotal()).toFixed(2)} L.E more for free
                  shipping
                </p>
              )}
              <Button
                className="w-full"
                size="lg"
                onClick={() => handleCheckout()}>
                Proceed to Checkout
              </Button>
              <Link to="/products">
                <Button variant="outline" className="w-full mt-2">
                  Continue Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
