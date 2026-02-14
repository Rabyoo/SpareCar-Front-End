// frontend/src/pages/vendor/EditProduct.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  X,
  Image as ImageIcon,
  Package,
  Save,
  ArrowLeft,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

const categories = [
  "Engine",
  "Brakes",
  "Suspension",
  "Electrical",
  "Transmission",
  "Exhaust",
  "Cooling",
  "Body",
  "Interior",
  "Accessories",
];

const carBrands = [
  "Toyota",
  "Honda",
  "Nissan",
  "Hyundai",
  "Kia",
  "Mazda",
  "Ford",
  "BMW",
  "Mercedes-Benz",
  "Volkswagen",
  "Chevrolet",
  "Audi",
  "Peugeot",
  "Renault",
  "Citroen",
  "Fiat",
];

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    carBrand: "",
    carModel: "",
    partNumber: "",
    sku: "",
    stock: "",
    specifications: {
      material: "",
      weight: "",
      dimensions: "",
      warranty: "",
      condition: "new",
      manufacturer: "",
      compatibility: [],
    },
  });

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/vendor/products/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = await response.json();
      if (data.success) {
        const product = data.product;
        setFormData({
          name: product.name || "",
          description: product.description || "",
          price: product.price || "",
          category: product.category || "",
          carBrand: product.carBrand || "",
          carModel: product.carModel || "",
          partNumber: product.partNumber || "",
          sku: product.sku || "",
          stock: product.stock || "",
          specifications: product.specifications || {
            material: "",
            weight: "",
            dimensions: "",
            warranty: "",
            condition: "new",
            manufacturer: "",
            compatibility: [],
          },
        });
        setExistingImages(product.images || []);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + existingImages.length + files.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    setImages([
      ...images,
      ...files.slice(0, 5 - (images.length + existingImages.length)),
    ]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      const productData = new FormData();

      // Add form data
      Object.keys(formData).forEach((key) => {
        if (key === "specifications") {
          productData.append(key, JSON.stringify(formData[key]));
        } else {
          productData.append(key, formData[key]);
        }
      });

      // Add new images
      images.forEach((image, index) => {
        productData.append(`newImages`, image);
      });

      // Add existing images to keep
      productData.append("existingImages", JSON.stringify(existingImages));

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/vendor/products/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: productData,
        },
      );

      const data = await response.json();
      if (data.success) {
        toast.success("Product updated successfully");
        navigate("/vendor/products");
      } else {
        toast.error(data.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/vendor/products/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = await response.json();
      if (data.success) {
        toast.success("Product deleted successfully");
        navigate("/vendor/products");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/vendor/products")}
              className="hover:bg-orange-50 hover:text-orange-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
              <p className="text-gray-600">Update your product details</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="destructive"
              onClick={deleteProduct}
              className="hover:bg-red-600">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Images */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Product Images
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Existing Images */}
                    {existingImages.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Current Images
                        </h4>
                        <div className="grid grid-cols-3 gap-2">
                          {existingImages.map((img, index) => (
                            <div key={index} className="relative">
                              <img
                                src={img}
                                alt={`Product ${index + 1}`}
                                className="w-full h-24 object-cover rounded"
                              />
                              <button
                                type="button"
                                onClick={() => removeExistingImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* New Images Upload */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 transition-colors">
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 mb-2">Upload New Images</p>
                      <p className="text-sm text-gray-500 mb-4">
                        {existingImages.length + images.length} of 5 images
                      </p>
                      <input
                        type="file"
                        id="image-upload"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={existingImages.length + images.length >= 5}
                      />
                      <Label
                        htmlFor="image-upload"
                        className={`inline-block px-4 py-2 rounded cursor-pointer ${
                          existingImages.length + images.length >= 5
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-orange-500 text-white hover:bg-orange-600"
                        }`}>
                        Add Images
                      </Label>
                    </div>

                    {/* New Images Preview */}
                    {images.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          New Images
                        </h4>
                        <div className="grid grid-cols-3 gap-2">
                          {images.map((image, index) => (
                            <div key={index} className="relative">
                              <img
                                src={URL.createObjectURL(image)}
                                alt={`New ${index + 1}`}
                                className="w-full h-24 object-cover rounded"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Product Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status</span>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Last Updated
                      </span>
                      <span className="text-sm font-medium">Just now</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Views</span>
                      <span className="text-sm font-medium">1,245</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Orders</span>
                      <span className="text-sm font-medium">42</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Product Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Product Name *</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label>Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          setFormData({ ...formData, category: value })
                        }>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Description *</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Price (USD) *</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label>Stock Quantity *</Label>
                      <Input
                        type="number"
                        value={formData.stock}
                        onChange={(e) =>
                          setFormData({ ...formData, stock: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label>SKU *</Label>
                      <Input
                        value={formData.sku}
                        onChange={(e) =>
                          setFormData({ ...formData, sku: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Vehicle Compatibility */}
              <Card>
                <CardHeader>
                  <CardTitle>Vehicle Compatibility</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Car Brand *</Label>
                      <Select
                        value={formData.carBrand}
                        onValueChange={(value) =>
                          setFormData({ ...formData, carBrand: value })
                        }>
                        <SelectTrigger>
                          <SelectValue placeholder="Select brand" />
                        </SelectTrigger>
                        <SelectContent>
                          {carBrands.map((brand) => (
                            <SelectItem key={brand} value={brand}>
                              {brand}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Car Model *</Label>
                      <Input
                        value={formData.carModel}
                        onChange={(e) =>
                          setFormData({ ...formData, carModel: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Part Number *</Label>
                    <Input
                      value={formData.partNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, partNumber: e.target.value })
                      }
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Specifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Specifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Material</Label>
                      <Input
                        value={formData.specifications.material}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            specifications: {
                              ...formData.specifications,
                              material: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>Weight (kg)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.specifications.weight}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            specifications: {
                              ...formData.specifications,
                              weight: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Dimensions (LxWxH)</Label>
                      <Input
                        value={formData.specifications.dimensions}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            specifications: {
                              ...formData.specifications,
                              dimensions: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>Warranty</Label>
                      <Input
                        value={formData.specifications.warranty}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            specifications: {
                              ...formData.specifications,
                              warranty: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Condition</Label>
                      <Select
                        value={formData.specifications.condition}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            specifications: {
                              ...formData.specifications,
                              condition: value,
                            },
                          })
                        }>
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="used">Used</SelectItem>
                          <SelectItem value="refurbished">
                            Refurbished
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Manufacturer</Label>
                      <Input
                        value={formData.specifications.manufacturer}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            specifications: {
                              ...formData.specifications,
                              manufacturer: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Buttons */}
              <div className="flex gap-3">
                <Button
                  type="submit"
                  loading={saving}
                  className="bg-orange-500 hover:bg-orange-600 flex-1 py-6 text-lg">
                  <Save className="w-5 h-5 mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/vendor/products")}
                  className="py-6 text-lg">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function Badge({ variant = "default", children }) {
  const variantClasses = {
    default: "bg-gray-100 text-gray-800",
    secondary: "bg-orange-100 text-orange-800",
    destructive: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${variantClasses[variant]}`}>
      {children}
    </span>
  );
}
