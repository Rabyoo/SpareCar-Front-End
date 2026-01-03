import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ShoppingCart,
  ArrowLeft,
  Minus,
  Plus,
  Star,
  Car,
  Loader2,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

interface Product {
  _id: string;
  name: string;
  arabicName?: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  carBrand: string;
  carModel: string;
  year?: string;
  partNumber: string;
  sku: string;
  stock: number;
  images: string[];
  specifications?: Record<string, any>;
  rating: number;
  reviews: number;
  discount?: number;
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
  // إضافة خصائص للحجم واللون
  availableSizes?: string[];
  availableColors?: string[];
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [mainImage, setMainImage] = useState("");

  // إضافة حالات للحجم واللون
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        // Use your API endpoint
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/products/${id}`
        );

        if (!response.ok) {
          throw new Error("Product not found");
        }

        const result = await response.json();

        if (result.success && result.product) {
          setProduct(result.product);
          setMainImage(result.product.images?.[0] || "");
          setError(false);

          // تعيين الحجم واللون الافتراضي إذا كانا متاحين
          if (
            result.product.availableSizes &&
            result.product.availableSizes.length > 0
          ) {
            setSelectedSize(result.product.availableSizes[0]);
          }
          if (
            result.product.availableColors &&
            result.product.availableColors.length > 0
          ) {
            setSelectedColor(result.product.availableColors[0]);
          }
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    // التحقق من اختيار الحجم واللون إذا كانا مطلوبين
    if (
      product.availableSizes &&
      product.availableSizes.length > 0 &&
      !selectedSize
    ) {
      toast.error("Please select a size");
      return;
    }

    if (
      product.availableColors &&
      product.availableColors.length > 0 &&
      !selectedColor
    ) {
      toast.error("Please select a color");
      return;
    }

    // إضافة المنتج مع الحجم واللون المختارين
    addToCart(
      product,
      quantity,
      selectedSize || undefined,
      selectedColor || undefined
    );
    toast.success("Product added to cart!");

    // الانتقال إلى السلة
    navigate("/cart");
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleImageClick = (imgUrl: string) => {
    setMainImage(imgUrl);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-xs">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">
            Product Not Found
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Sorry, we couldn't find the product you're looking for.
          </p>
          <Button
            onClick={() => navigate("/products")}
            className="text-sm bg-orange-500 hover:bg-orange-600">
            <ArrowLeft className="mr-1 h-3 w-3" />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const hasDiscount = product.discount && product.discount > 0;
  const discountedPrice = hasDiscount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  const displayName = product.name;

  const getStockStatus = () => {
    if (product.stock === 0) return "Out of Stock";
    if (product.stock < 5) return `Low Stock (${product.stock} left)`;
    return `In Stock (${product.stock})`;
  };

  const stockText = getStockStatus();
  const stockColor =
    product.stock === 0
      ? "text-red-600"
      : product.stock < 5
      ? "text-orange-600"
      : "text-green-600";

  // التحقق إذا كان المنتج يحتاج إلى اختيار حجم أو لون
  const needsSelection =
    (product.availableSizes && product.availableSizes.length > 0) ||
    (product.availableColors && product.availableColors.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/products")}
          className="mb-4 text-sm hover:bg-orange-50 hover:text-orange-600">
          <ArrowLeft className="mr-1 h-3 w-3" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <div className="mb-4 bg-white rounded-lg border p-4">
              <img
                src={
                  mainImage ||
                  product.images?.[0] ||
                  "https://via.placeholder.com/400x300?text=Product"
                }
                alt={displayName}
                className="w-full h-64 object-contain"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/400x300?text=Product";
                }}
              />
            </div>

            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleImageClick(img)}
                    className={`flex-shrink-0 w-16 h-16 rounded border ${
                      mainImage === img
                        ? "border-orange-500"
                        : "border-gray-300"
                    }`}>
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-contain p-1"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            {/* Badges */}
            <div className="flex gap-2">
              <Badge variant="secondary" className="text-xs">
                {product.category}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {product.brand}
              </Badge>
              {hasDiscount && (
                <Badge className="bg-red-500 text-white text-xs">
                  -{product.discount}%
                </Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="text-xl font-bold text-gray-900">{displayName}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating || 0)
                        ? "fill-orange-500 text-orange-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating?.toFixed(1)} ({product.reviews || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div>
              {hasDiscount ? (
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {discountedPrice.toFixed(2)}L.E
                  </span>
                  <span className="text-lg text-gray-400 line-through">
                    {product.price.toFixed(2)}
                    L.E
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-bold text-gray-900">
                  {product.price.toFixed(2)}
                  L.E
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Size Selection */}
            {product.availableSizes && product.availableSizes.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-900">Size:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.availableSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                        selectedSize === size
                          ? "border-orange-500 bg-orange-50 text-orange-700"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                      }`}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.availableColors && product.availableColors.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-900">Color:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.availableColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                        selectedColor === color
                          ? "border-orange-500 ring-2 ring-orange-300"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      style={{ backgroundColor: color }}>
                      <span className="sr-only">{color}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Car Info */}
            <Card className="bg-gray-50">
              <CardContent className="p-3">
                <div className="flex items-center gap-1 mb-2">
                  <Car className="w-4 h-4 text-gray-600" />
                  <h3 className="text-sm font-medium text-gray-900">
                    Vehicle Compatibility
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Brand:</span>
                    <p className="font-medium">{product.carBrand}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Model:</span>
                    <p className="font-medium">{product.carModel}</p>
                  </div>
                  {product.year && (
                    <div>
                      <span className="text-gray-600">Year:</span>
                      <p className="font-medium">{product.year}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-600">Part #:</span>
                    <p className="font-medium font-mono">
                      {product.partNumber}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Specifications */}
            {product.specifications &&
              Object.keys(product.specifications).length > 0 && (
                <Card>
                  <CardContent className="p-3">
                    <h3 className="text-sm font-medium mb-2">Specifications</h3>
                    <div className="space-y-1 text-sm">
                      {Object.entries(product.specifications).map(
                        ([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-600">{key}:</span>
                            <span className="font-medium">{String(value)}</span>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Stock */}
            <div className={`text-sm font-medium ${stockColor}`}>
              {stockText}
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center border rounded">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="h-8 w-8">
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val >= 1 && val <= (product.stock || 0)) {
                        setQuantity(val);
                      }
                    }}
                    className="w-16 text-center border-0 h-8"
                    min={1}
                    max={product.stock || 1}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={incrementQuantity}
                    disabled={quantity >= (product.stock || 0)}
                    className="h-8 w-8">
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <Button
                className={`w-full ${
                  product.stock === 0
                    ? " text-gray-600"
                    : "bg-[#d32e1d] hover:bg-[#d73725] rounded-none"
                }`}
                onClick={handleAddToCart}
                disabled={product.stock === 0}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
