// frontend/src/pages/vendor/AddProduct.tsx
import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
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
  AlertCircle,
  CheckCircle,
} from "lucide-react";

// تعريف الأنواع
interface Specifications {
  material: string;
  weight: string;
  dimensions: string;
  warranty: string;
  [key: string]: string;
}

interface FormData {
  name: string;
  description: string;
  price: string;
  category: string;
  carBrand: string;
  carModel: string;
  partNumber: string;
  sku: string;
  stock: string;
  brand: string;
  specifications: Specifications;
}

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

export default function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    price: "",
    category: "",
    carBrand: "",
    carModel: "",
    partNumber: "",
    sku: "",
    stock: "1",
    brand: "",
    specifications: {
      material: "",
      weight: "",
      dimensions: "",
      warranty: "",
    },
  });

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      // تحديد 5 صور كحد أقصى
      const remainingSlots = 5 - images.length;
      if (remainingSlots > 0) {
        const newImages = files.slice(0, remainingSlots);
        setImages([...images, ...newImages]);
      } else {
        setMessage({
          type: "error",
          text: "Maximum 5 images allowed",
        });
      }
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // دالة مساعدة لطباعة FormData
  const logFormData = (formData: FormData) => {
    console.log("📋 FormData Contents:");
    for (let [key, value] of (formData as any).entries()) {
      if (value instanceof File) {
        console.log(
          `${key}: File - ${value.name} (${value.type}, ${value.size} bytes)`,
        );
      } else {
        console.log(`${key}:`, value);
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      console.log("🔍 ====== START PRODUCT SUBMISSION ======");

      // التحقق من الحقول المطلوبة
      const requiredFields = [
        "name",
        "description",
        "price",
        "category",
        "carBrand",
        "carModel",
        "partNumber",
        "sku",
        "stock",
      ];

      const missingFields = requiredFields.filter((field) => {
        const value = formData[field as keyof FormData];
        return !value || value.toString().trim() === "";
      });

      if (missingFields.length > 0) {
        throw new Error(
          `❌ Missing required fields: ${missingFields.join(", ")}`,
        );
      }

      // ⭐⭐ الطريقة الجديدة: إرسال كـ JSON مع ملفات منفصلة
      const API_URL =
        import.meta.env.VITE_API_URL || "http://localhost:5000/api";

      // 1. أولاً: رفع الصور بشكل منفصل
      let uploadedImages: string[] = [];

      if (images.length > 0) {
        console.log("📤 Uploading images first...");

        const imageFormData = new FormData();
        images.forEach((image, index) => {
          imageFormData.append("images", image);
        });

        const uploadResponse = await fetch(`${API_URL}/vendor/upload-images`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: imageFormData,
        });

        const uploadData = await uploadResponse.json();

        if (uploadData.success) {
          uploadedImages = uploadData.imageUrls;
          console.log("✅ Images uploaded:", uploadedImages);
        } else {
          console.warn("⚠️ Could not upload images:", uploadData.message);
        }
      }

      // 2. ثانياً: إرسال بيانات المنتج كـ JSON
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        carBrand: formData.carBrand,
        carModel: formData.carModel.trim(),
        partNumber: formData.partNumber.trim(),
        sku: formData.sku.trim(),
        stock: parseInt(formData.stock) || 1,
        brand: formData.brand.trim() || formData.carBrand,
        specifications: {
          material: formData.specifications.material || "",
          weight: formData.specifications.weight || "",
          dimensions: formData.specifications.dimensions || "",
          warranty: formData.specifications.warranty || "",
        },
        images: uploadedImages, // روابط الصور المرفوعة
      };

      console.log("📦 Sending product data:", productData);

      const response = await fetch(`${API_URL}/vendor/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      console.log("📨 Response status:", response.status);

      const data = await response.json();
      console.log("📨 Response data:", data);

      if (!response.ok) {
        throw new Error(data.message || `Server error: ${response.status}`);
      }

      if (data.success) {
        console.log("✅ Product added successfully!");
        setMessage({
          type: "success",
          text: "✅ Product added successfully! Waiting for admin approval.",
        });

        // إعادة تعيين النموذج
        setTimeout(() => {
          setFormData({
            name: "",
            description: "",
            price: "",
            category: "",
            carBrand: "",
            carModel: "",
            partNumber: "",
            sku: "",
            stock: "1",
            brand: "",
            specifications: {
              material: "",
              weight: "",
              dimensions: "",
              warranty: "",
            },
          });
          setImages([]);

          setTimeout(() => {
            navigate("/vendor/products");
          }, 2000);
        }, 1500);
      } else {
        throw new Error(data.message || "Unknown error from server");
      }
    } catch (error: any) {
      console.error("❌ Error adding product:", error);
      setMessage({
        type: "error",
        text:
          error.message ||
          "Failed to add product. Please check the console for details.",
      });
    } finally {
      setLoading(false);
      console.log("🔍 ====== END PRODUCT SUBMISSION ======");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Add New Product
            </h1>
            <p className="text-gray-600">List your auto parts for sale</p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate("/vendor/products")}
            className="hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300">
            Cancel
          </Button>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}>
            {message.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Images */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Product Images
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Image Upload Area */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-500 transition-colors">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">
                        Drag & drop images here
                      </p>
                      <p className="text-sm text-gray-500 mb-4">or</p>
                      <input
                        type="file"
                        id="image-upload"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={images.length >= 5}
                      />
                      <Label
                        htmlFor="image-upload"
                        className={`inline-block px-4 py-2 rounded cursor-pointer ${
                          images.length >= 5
                            ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                            : "bg-orange-500 text-white hover:bg-orange-600"
                        }`}>
                        Browse Files ({images.length}/5)
                      </Label>
                      <p className="text-xs text-gray-500 mt-4">
                        Up to 5 images • Max 2MB each
                      </p>
                    </div>

                    {/* Preview Images */}
                    {images.length > 0 && (
                      <div className="grid grid-cols-3 gap-2">
                        {images.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Preview ${index + 1}`}
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
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Form */}
            <div className="lg:col-span-2 space-y-8">
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
                      <Label className="flex items-center gap-1">
                        Product Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="e.g., Brake Pads Set"
                        required
                      />
                    </div>
                    <div>
                      <Label className="flex items-center gap-1">
                        Category <span className="text-red-500">*</span>
                      </Label>
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
                    <Label className="flex items-center gap-1">
                      Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={4}
                      placeholder="Describe your product in detail..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="flex items-center gap-1">
                        Price (USD) <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div>
                      <Label className="flex items-center gap-1">
                        Stock Quantity <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="number"
                        min="1"
                        value={formData.stock}
                        onChange={(e) =>
                          setFormData({ ...formData, stock: e.target.value })
                        }
                        placeholder="1"
                        required
                      />
                    </div>
                    <div>
                      <Label className="flex items-center gap-1">
                        SKU <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={formData.sku}
                        onChange={(e) =>
                          setFormData({ ...formData, sku: e.target.value })
                        }
                        placeholder="SKU-001"
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
                      <Label className="flex items-center gap-1">
                        Car Brand <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.carBrand}
                        onValueChange={(value) =>
                          setFormData({ ...formData, carBrand: value })
                        }>
                        <SelectTrigger>
                          <SelectValue placeholder="Select car brand" />
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
                      <Label className="flex items-center gap-1">
                        Car Model <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={formData.carModel}
                        onChange={(e) =>
                          setFormData({ ...formData, carModel: e.target.value })
                        }
                        placeholder="e.g., Camry, Civic"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="flex items-center gap-1">
                      Part Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={formData.partNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, partNumber: e.target.value })
                      }
                      placeholder="e.g., BP-1234"
                      required
                    />
                  </div>
                  <div>
                    <Label>Brand (Manufacturer)</Label>
                    <Input
                      value={formData.brand}
                      onChange={(e) =>
                        setFormData({ ...formData, brand: e.target.value })
                      }
                      placeholder="e.g., Bosch, Denso"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      If left empty, will use Car Brand
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Specifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Specifications (Optional)</CardTitle>
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
                        placeholder="e.g., Steel, Aluminum"
                      />
                    </div>
                    <div>
                      <Label>Weight (kg)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
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
                        placeholder="0.00"
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
                        placeholder="e.g., 10x5x2 cm"
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
                        placeholder="e.g., 1 Year"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-orange-500 hover:bg-orange-600 flex-1 py-6 text-lg disabled:bg-orange-300">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Adding Product...
                    </span>
                  ) : (
                    "Add Product"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/vendor/products")}
                  className="py-6 text-lg">
                  Cancel
                </Button>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Your product will be reviewed by an
                  admin before appearing on the main website. You will be
                  notified once it's approved.
                </p>
                <p className="text-xs text-blue-700 mt-2">
                  <strong>Required fields:</strong> All fields marked with{" "}
                  <span className="text-red-500">*</span> are required.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
