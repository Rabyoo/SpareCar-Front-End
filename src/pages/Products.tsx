import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FiSearch,
  FiX,
  FiFilter,
  FiChevronDown,
  FiChevronUp,
  FiLoader,
  FiStar,
  FiTrendingUp,
  FiAward,
  FiZap,
  FiShield,
  FiTruck,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";
import ProductCard from "@/components/ProductCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";

//* Carousel
import { carouselItems } from "../data/Content_Option";

// Product type definition
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
  stock: number;
  images: string[];
  rating: number;
  reviews: number;
  discount?: number;
  isFeatured?: boolean;
  specifications?: Record<string, any>;
}

const PRODUCTS_PER_PAGE = 12;

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get("category")
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Advanced Filters State
  const [filters, setFilters] = useState({
    brand: "",
    carBrand: "",
    carModel: "",
    year: "",
    minPrice: "",
    maxPrice: "",
    inStock: "",
  });

  // Featured Clients Data
  const featuredClients = [
    {
      name: "Toyota",
      logo: "https://tse4.mm.bing.net/th/id/OIP.qdBJTQnvR2DY9x9FWDlWywHaE0?rs=1&pid=ImgDetMain&o=7&rm=3",
      count: 520,
    },
    {
      name: "Honda",
      logo: "https://logos-world.net/wp-content/uploads/2021/03/Honda-Logo.png",
      count: 410,
    },
    {
      name: "Nissan",
      logo: "https://logos-world.net/wp-content/uploads/2020/04/Nissan-Logo.png",
      count: 360,
    },
    {
      name: "Mazda",
      logo: "https://th.bing.com/th/id/R.43975efaca6ef3f890c1fbd1b1d8edd6?rik=3jjsREVWGqwY9Q&pid=ImgRaw&r=0",
      count: 280,
    },
    {
      name: "Hyundai",
      logo: "https://www.freepnglogos.com/uploads/hyundai-logo-2.jpg",
      count: 320,
    },
    {
      name: "Kia",
      logo: "https://th.bing.com/th/id/OIP.PWhbke2Dt8EcogJ3QrgvzAHaD0?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3",
      count: 300,
    },
    {
      name: "BMW",
      logo: "https://logos-world.net/wp-content/uploads/2020/04/BMW-Logo.png",
      count: 450,
    },
    {
      name: "Mercedes-Benz",
      logo: "https://th.bing.com/th/id/R.18e165468625e67f5e588e3a266c1b2c?rik=lI1HyJuA4kcmFQ&pid=ImgRaw&r=0",
      count: 380,
    },
    {
      name: "Audi",
      logo: "https://tse4.mm.bing.net/th/id/OIP.IuEITakqGIm_znfUMw26mgHaEo?rs=1&pid=ImgDetMain&o=7&rm=3",
      count: 340,
    },
    {
      name: "Volkswagen",
      logo: "https://tse4.mm.bing.net/th/id/OIP.ZPPv2KDe9xWm07cqjz4W6wHaEK?rs=1&pid=ImgDetMain&o=7&rm=3",
      count: 290,
    },
    {
      name: "Ford",
      logo: "https://tse4.mm.bing.net/th/id/OIP.7UQ0MI9wBt5OSBYonrsmqgHaFV?rs=1&pid=ImgDetMain&o=7&rm=3",
      count: 390,
    },
    {
      name: "Chevrolet",
      logo: "https://tse1.mm.bing.net/th/id/OIP.PWKJGM7bgbkDkfKqIP1gCAHaEK?rs=1&pid=ImgDetMain&o=7&rm=3",
      count: 310,
    },
    {
      name: "Peugeot",
      logo: "https://logos-world.net/wp-content/uploads/2021/03/Peugeot-Logo.png",
      count: 240,
    },
    {
      name: "Renault",
      logo: "https://logos-world.net/wp-content/uploads/2021/03/Renault-Logo.png",
      count: 230,
    },
    {
      name: "Citroen",
      logo: "https://tse4.mm.bing.net/th/id/OIP.mvZh6IQuc36KIfBgN98XIAHaEK?rs=1&pid=ImgDetMain&o=7&rm=3",
      count: 220,
    },
    {
      name: "Fiat",
      logo: "https://th.bing.com/th/id/OIP.2fpXLOeI2wsfqpO4F-RqhQHaEK?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3",
      count: 210,
    },
  ];

  // Testimonials Data
  const testimonials = [
    {
      name: "John Smith",
      rating: 5,
      text: "Genuine products and excellent quality. Fast delivery and very competitive prices!",
    },
    {
      name: "Sarah Johnson",
      rating: 5,
      text: "Amazing customer service and helped me choose the right parts for my car.",
    },
    {
      name: "Michael Brown",
      rating: 4,
      text: "Wide selection of spare parts, found everything I needed easily.",
    },
  ];

  // Fetch products from API
  useEffect(() => {
    fetchProducts();

    // Apply filters from URL params
    const category = searchParams.get("category");
    const carBrand = searchParams.get("carBrand");
    const carModel = searchParams.get("carModel");
    const engine = searchParams.get("engine");
    const year = searchParams.get("year");
    const search = searchParams.get("search");

    // Set category if exists
    if (category) {
      setSelectedCategory(category);
    }

    // Set search term if exists
    if (search) {
      setSearchTerm(search);
    }

    // Set vehicle filters if exist
    if (carBrand || carModel) {
      setFilters((prev) => ({
        ...prev,
        carBrand: carBrand || "",
        carModel: carModel || "",
        year: year || "",
        engine: engine || "",
      }));
    }
  }, [searchParams]); // Important: add searchParams as dependency

  // Apply filters when they change
  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedCategory, filters, products]);

  useEffect(() => {
    window.scrollTo({
      top: window.scrollY,
      behavior: "instant",
    });
  }, [currentSlide]);

  // Update displayed products when filtered products or page changes
  useEffect(() => {
    const startIndex = 0;
    const endIndex = currentPage * PRODUCTS_PER_PAGE;
    setDisplayedProducts(filteredProducts.slice(startIndex, endIndex));
  }, [filteredProducts, currentPage]);

  //* Carousel Handlers
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
  };
  useEffect(() => {
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentItem = carouselItems[currentSlide];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/products?limit=10000`
      );

      if (response.data.success) {
        setProducts(response.data.products);
        setFilteredProducts(response.data.products);
        console.log(
          `✅ Loaded ${response.data.products.length} products from API`
        );
      } else {
        setError("Failed to load products");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  // Extract unique values from real products
  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  );
  const uniqueBrands = Array.from(
    new Set(products.map((p) => p.brand).filter(Boolean))
  );
  const uniqueCarBrands = Array.from(
    new Set(products.map((p) => p.carBrand).filter(Boolean))
  );
  const uniqueCarModels = Array.from(
    new Set(products.map((p) => p.carModel).filter(Boolean))
  );
  const uniqueYears = Array.from(
    new Set(products.map((p) => p.year).filter(Boolean))
  ).sort();

  const applyFilters = () => {
    let filtered = [...products];

    // Category Filter - IMPORTANT: Check for exact match OR contains
    if (selectedCategory) {
      filtered = filtered.filter((p) => {
        // Check if category matches exactly
        if (p.category === selectedCategory) return true;

        // Check if category contains the search term (for subcategories)
        if (p.category?.toLowerCase().includes(selectedCategory.toLowerCase()))
          return true;

        // Check if subcategory matches
        if (p.subcategory === selectedCategory) return true;

        return false;
      });
    }

    // Search Term Filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(term) ||
          p.arabicName?.toLowerCase().includes(term) ||
          p.description?.toLowerCase().includes(term) ||
          p.brand?.toLowerCase().includes(term) ||
          p.carBrand?.toLowerCase().includes(term) ||
          p.carModel?.toLowerCase().includes(term) ||
          p.partNumber?.toLowerCase().includes(term) ||
          p.category?.toLowerCase().includes(term)
      );
    }

    // Advanced Filters
    if (filters.brand) {
      filtered = filtered.filter((p) => p.brand === filters.brand);
    }

    if (filters.carBrand) {
      filtered = filtered.filter((p) => p.carBrand === filters.carBrand);
    }

    if (filters.carModel) {
      filtered = filtered.filter((p) => p.carModel === filters.carModel);
    }

    if (filters.year) {
      filtered = filtered.filter((p) => p.year === filters.year);
    }

    if (filters.minPrice) {
      filtered = filtered.filter(
        (p) => p.price >= parseFloat(filters.minPrice)
      );
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(
        (p) => p.price <= parseFloat(filters.maxPrice)
      );
    }

    if (filters.inStock === "true") {
      filtered = filtered.filter((p) => p.stock > 0);
    } else if (filters.inStock === "false") {
      filtered = filtered.filter((p) => p.stock === 0);
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const handleBrandClick = (brandName: string) => {
    // تعيين فلتر البراند في الـ filters
    setFilters((prev) => ({
      ...prev,
      carBrand: brandName,
    }));

    // إغلاق الـ advanced filters إذا كانت مفتوحة
    setShowAdvancedFilters(true);

    // تمرير إلى URL للتوافق مع الروابط الأخرى
    setSearchParams({
      carBrand: brandName,
      filter: "brand",
    });

    // التمرير للقسم العلوي
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const handleCategoryClick = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
      setSearchParams({});
    } else {
      setSelectedCategory(category);
      setSearchParams({ category });
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
    setSearchParams({});
    setFilters({
      brand: "",
      carBrand: "",
      carModel: "",
      year: "",
      minPrice: "",
      maxPrice: "",
      inStock: "",
    });
    setCurrentPage(1);
  };

  const handleShowMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const activeFiltersCount =
    Object.values(filters).filter(Boolean).length + (selectedCategory ? 1 : 0);

  const hasMoreProducts = displayedProducts.length < filteredProducts.length;
  const remainingProducts = filteredProducts.length - displayedProducts.length;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="h-12 w-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading products from database...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 mt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2">Error Loading Products</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button
            onClick={fetchProducts}
            className="bg-orange-500 hover:bg-orange-600 text-white">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="container mx-auto px-4 py-8 mt-20">
      {/* Hero Banner with Real Car Parts Images */}
      <div className="mb-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl overflow-hidden shadow-2xl">
        <div className="grid md:grid-cols-2 gap-0 h-[400px] md:h-[500px]">
          <div className="p-8 md:p-12 flex flex-col justify-center h-full">
            {/* Badge */}
            <div className="flex items-center gap-2 mb-4">
              <FiZap className="h-6 w-6 text-white" />
              <span className="text-sm font-semibold uppercase tracking-wider text-white bg-white/20 px-3 py-1 rounded-full">
                {currentItem.badge}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              {currentItem.title}
            </h2>

            {/* Price */}
            <div className="mb-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <FiTrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {currentItem.price}
                  </p>
                  <p className="text-sm text-white/80">Best Price Guarantee</p>
                </div>
              </div>
            </div>

            {/* Subtitle */}
            <p className="text-orange-100 text-lg mb-6 line-clamp-2">
              {currentItem.subtitle}
            </p>

            {/* Features */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <FiCheckCircle className="h-5 w-5 text-green-300" />
                <span className="text-white text-sm">1-Year Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCheckCircle className="h-5 w-5 text-green-300" />
                <span className="text-white text-sm">Free Shipping</span>
              </div>
            </div>

            {/* Navigation Dots */}
            <div className="flex gap-2">
              {carouselItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "w-8 bg-white"
                      : "w-2 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Image Container - ارتفاع ثابت */}
          <div className="relative h-full min-h-[400px] md:min-h-[500px] overflow-hidden">
            <div className="absolute inset-0">
              <img
                src={currentItem.image}
                alt={currentItem.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-orange-600/30"></div>
            </div>
          </div>
        </div>
      </div>

      <h1 className="text-4xl font-bold mb-8 animate-fade-in">
        Car Parts Store
      </h1>

      {/* Featured Brands Section with Real Images */}
      <div className="mb-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 animate-fade-in animation-delay-100">
        <div className="flex items-center gap-2 mb-6">
          <FiAward className="h-6 w-6 text-orange-500" />
          <h3 className="text-xl font-bold">Featured Brands</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {featuredClients.map((client, index) => (
            <div
              key={index}
              onClick={() => handleBrandClick(client.name)}
              className="bg-white rounded-lg p-4 text-center hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 group hover:-translate-y-1 hover:border-orange-500"
              style={{ animationDelay: `${index * 100}ms` }}>
              <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-orange-500 transition-colors">
                <img
                  src={client.logo}
                  alt={client.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <p className="font-semibold text-gray-800">{client.name}</p>
              <p className="text-xs text-gray-500">{client.count}+ Parts</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in animation-delay-200">
        <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 group hover:-translate-y-1">
          <FiShield className="h-10 w-10 text-orange-500 mb-3 group-hover:scale-110 transition-transform" />
          <h4 className="font-bold text-lg mb-2">Quality Guarantee</h4>
          <p className="text-gray-600 text-sm">
            100% genuine parts with manufacturer warranty
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 group hover:-translate-y-1">
          <FiTruck className="h-10 w-10 text-orange-500 mb-3 group-hover:scale-110 transition-transform" />
          <h4 className="font-bold text-lg mb-2">Fast Delivery</h4>
          <p className="text-gray-600 text-sm">
            Express shipping available, track your order in real-time
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 group hover:-translate-y-1">
          <FiClock className="h-10 w-10 text-orange-500 mb-3 group-hover:scale-110 transition-transform" />
          <h4 className="font-bold text-lg mb-2">24/7 Support</h4>
          <p className="text-gray-600 text-sm">
            Expert technical support available around the clock
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6 animate-fade-in animation-delay-300">
        <div className="relative max-w-md">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search products, brands, car models..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats Info */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200 animate-fade-in animation-delay-400">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-600">Total products:</p>
            <p className="text-2xl font-bold text-blue-600">
              {products.length} products
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Currently filtered:</p>
            <p className="text-2xl font-bold text-orange-600">
              {filteredProducts.length} products
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Showing on page:</p>
            <p className="text-2xl font-bold text-green-600">
              {displayedProducts.length} products
            </p>
          </div>
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="flex items-center gap-2 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300 transition-colors">
          <FiFilter className="h-4 w-4" />
          Advanced Filters
          {activeFiltersCount > 0 && (
            <Badge variant="default" className="ml-2 bg-orange-500">
              {activeFiltersCount}
            </Badge>
          )}
          {showAdvancedFilters ? (
            <FiChevronUp className="h-4 w-4" />
          ) : (
            <FiChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <Card className="mb-6 border-orange-200 animate-slide-down">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Brand Filter */}
              <div>
                <Label htmlFor="brand">Part Brand</Label>
                <Select
                  value={filters.brand}
                  onValueChange={(value) => handleFilterChange("brand", value)}>
                  <SelectTrigger id="brand">
                    <SelectValue placeholder="All Brands" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brands</SelectItem>
                    {uniqueBrands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Car Brand Filter */}
              <div>
                <Label htmlFor="carBrand">Car Brand</Label>
                <Select
                  value={filters.carBrand}
                  onValueChange={(value) =>
                    handleFilterChange("carBrand", value)
                  }>
                  <SelectTrigger id="carBrand">
                    <SelectValue placeholder="All Car Brands" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Car Brands</SelectItem>
                    {uniqueCarBrands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Car Model Filter */}
              <div>
                <Label htmlFor="carModel">Car Model</Label>
                <Select
                  value={filters.carModel}
                  onValueChange={(value) =>
                    handleFilterChange("carModel", value)
                  }>
                  <SelectTrigger id="carModel">
                    <SelectValue placeholder="All Car Models" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Car Models</SelectItem>
                    {uniqueCarModels.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Year Filter */}
              <div>
                <Label htmlFor="year">Year</Label>
                <Select
                  value={filters.year}
                  onValueChange={(value) => handleFilterChange("year", value)}>
                  <SelectTrigger id="year">
                    <SelectValue placeholder="All Years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {uniqueYears.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Min Price Filter */}
              <div>
                <Label htmlFor="minPrice">Min Price (L.E)</Label>
                <Input
                  id="minPrice"
                  type="number"
                  placeholder="0"
                  value={filters.minPrice}
                  onChange={(e) =>
                    handleFilterChange("minPrice", e.target.value)
                  }
                />
              </div>

              {/* Max Price Filter */}
              <div>
                <Label htmlFor="maxPrice">Max Price (L.E)</Label>
                <Input
                  id="maxPrice"
                  type="number"
                  placeholder="10000"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    handleFilterChange("maxPrice", e.target.value)
                  }
                />
              </div>

              {/* Stock Filter */}
              <div>
                <Label htmlFor="inStock">Stock Status</Label>
                <Select
                  value={filters.inStock}
                  onValueChange={(value) =>
                    handleFilterChange("inStock", value)
                  }>
                  <SelectTrigger id="inStock">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="true">In Stock</SelectItem>
                    <SelectItem value="false">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters Button */}
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={clearAllFilters}
                  className="w-full hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300">
                  <FiX className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Filter */}
      <div className="mb-8">
        <h3 className="font-semibold mb-4">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`cursor-pointer transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300"
              }`}
              onClick={() => handleCategoryClick(category)}>
              {category}
              {selectedCategory === category && (
                <FiX className="ml-1 h-3 w-3" />
              )}
            </Badge>
          ))}
        </div>
      </div>

      {/* Active Filters Summary */}
      {activeFiltersCount > 0 && (
        <div className="mb-6 flex items-center gap-2 flex-wrap animate-fade-in">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {selectedCategory && (
            <Badge
              variant="secondary"
              className="gap-1 bg-orange-100 text-orange-700">
              Category: {selectedCategory}
              <FiX
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchParams({});
                }}
              />
            </Badge>
          )}
          {filters.brand && (
            <Badge
              variant="secondary"
              className="gap-1 bg-orange-100 text-orange-700">
              Brand: {filters.brand}
              <FiX
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange("brand", "")}
              />
            </Badge>
          )}
          {filters.carBrand && (
            <Badge
              variant="secondary"
              className="gap-1 bg-orange-100 text-orange-700">
              Car Brand: {filters.carBrand}
              <FiX
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange("carBrand", "")}
              />
            </Badge>
          )}
          {filters.carModel && (
            <Badge
              variant="secondary"
              className="gap-1 bg-orange-100 text-orange-700">
              Model: {filters.carModel}
              <FiX
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange("carModel", "")}
              />
            </Badge>
          )}
          {filters.year && (
            <Badge
              variant="secondary"
              className="gap-1 bg-orange-100 text-orange-700">
              Year: {filters.year}
              <FiX
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange("year", "")}
              />
            </Badge>
          )}
          {filters.inStock && (
            <Badge
              variant="secondary"
              className="gap-1 bg-orange-100 text-orange-700">
              Stock: {filters.inStock === "true" ? "In Stock" : "Out of Stock"}
              <FiX
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange("inStock", "")}
              />
            </Badge>
          )}
          {(filters.minPrice || filters.maxPrice) && (
            <Badge
              variant="secondary"
              className="gap-1 bg-orange-100 text-orange-700">
              Price: ${filters.minPrice || "0"} - ${filters.maxPrice || "∞"}
              <FiX
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  handleFilterChange("minPrice", "");
                  handleFilterChange("maxPrice", "");
                }}
              />
            </Badge>
          )}
        </div>
      )}

      {/* Products Count */}
      <div className="mb-4">
        <p className="text-muted-foreground">
          Showing {displayedProducts.length} of {filteredProducts.length}{" "}
          product
          {filteredProducts.length !== 1 ? "s" : ""}
          {products.length !== filteredProducts.length &&
            ` (filtered from ${products.length} total)`}
        </p>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 place-items-center mx-auto max-w-6xl mb-8">
            {displayedProducts.map((product, index) => (
              <div
                key={product._id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Show More Button */}
          {hasMoreProducts && (
            <div className="text-center mb-8 animate-fade-in">
              <Button
                onClick={handleShowMore}
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                Show More ({remainingProducts} products remaining)
                <FiChevronDown className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 animate-fade-in">
          <p className="text-muted-foreground text-lg">No products found</p>
          <p className="text-gray-500 mb-4">
            Try changing your filters or search term
          </p>
          <Button
            variant="outline"
            className="mt-4 hover:bg-orange-50 hover:text-orange-600"
            onClick={clearAllFilters}>
            Clear All Filters
          </Button>
        </div>
      )}

      {/* Testimonials Section */}
      <div className="mt-12 mb-8 bg-gradient-to-br from-gray-50 to-[#e5eaed] rounded-xl p-8 border border-gray-300 animate-fade-in">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-2">Customer Reviews</h3>
          <p className="text-gray-600">What our customers say about us</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FiStar
                    key={i}
                    className="h-5 w-5 fill-orange-500 text-orange-500"
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
              <p className="font-semibold text-gray-900">{testimonial.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA Banner with Image */}
      <div className="mt-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl overflow-hidden shadow-2xl animate-fade-in">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-3 text-white">
              Can't Find What You're Looking For?
            </h3>
            <p className="text-gray-300 mb-6 text-lg">
              Contact our technical support team and we'll help you find the
              right part for your vehicle
            </p>
            <Link
              to="/contactUs"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-lg hover:shadow-xl transition-all w-fit px-6 py-3 rounded-lg inline-block">
              Contact Us
            </Link>
          </div>
          <div className="relative h-64 md:h-auto">
            <img
              src="https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=800&h=600&fit=crop"
              alt="Auto Parts"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/50 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Custom CSS for Animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes zoom-in {
          from {
            transform: scale(1.1);
          }
          to {
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out;
        }

        .animate-slide-down {
          animation: slide-down 0.4s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out;
        }

        .animate-zoom-in {
          animation: zoom-in 1.5s ease-out;
        }

        .animation-delay-100 {
          animation-delay: 0.1s;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
}
