import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import AdminSidebar from "@/components/AdminSidebar";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Tag,
  Package,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    icon: "📦",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/admin/dashboard/category-stats`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      if (data.success) {
        const formattedCategories = data.categories.map((cat, index) => ({
          _id: cat._id,
          name: cat._id,
          description: `${cat._id} category products`,
          productCount: cat.productCount,
          totalSales: cat.totalStock * cat.avgPrice || 0,
          icon: getIconForCategory(cat._id),
        }));
        setCategories(formattedCategories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const getIconForCategory = (name) => {
    const icons = {
      Engine: "🔧",
      Brakes: "🛑",
      Suspension: "⚙️",
      Electrical: "⚡",
      Transmission: "🔄",
      Exhaust: "💨",
      Cooling: "❄️",
      Body: "🚗",
      Interior: "🪑",
      Accessories: "🛠️",
      Filters: "🔍",
    };
    return icons[name] || "📦";
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    toast.info(
      "Categories are managed through products. Add products with new categories!"
    );
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditCategory = async (e) => {
    e.preventDefault();
    toast.info("Category editing coming soon!");
    setIsEditDialogOpen(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = () => {
    toast.warning(
      "Cannot delete categories that have products. Remove all products first."
    );
    setDeleteCategoryId(null);
  };

  const resetForm = () => {
    setNewCategory({
      name: "",
      description: "",
      icon: "📦",
    });
  };

  const totalProducts = categories.reduce((sum, c) => sum + c.productCount, 0);
  const totalSales = categories.reduce((sum, c) => sum + c.totalSales, 0);

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
            Category Management
          </h1>
          <p className="text-gray-600 mt-2">
            View product categories and statistics
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Categories</p>
                  <p className="text-2xl font-bold mt-1">{categories.length}</p>
                </div>
                <Tag className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold mt-1">{totalProducts}</p>
                </div>
                <Package className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold mt-1">
                    {totalSales.toLocaleString()} L.E
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Categories Grid */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>All Categories</CardTitle>
              <Button onClick={fetchCategories} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <Card
                  key={category._id}
                  className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-4xl">{category.icon}</div>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {category.description}
                    </p>
                    <div className="flex gap-2 mb-2">
                      <Badge variant="secondary">
                        {category.productCount} Products
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      Value: {category.totalSales.toLocaleString()} L.E
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
