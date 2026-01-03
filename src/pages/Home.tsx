import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ShoppingCart,
  Shield,
  Truck,
  Wrench,
  ArrowRight,
  Star,
  Car,
  Search,
  Filter,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { mockProducts } from "@/lib/mockData";

//* Import data from content_option
import {
  carouselSlides,
  accessories,
  manufacturers,
  carBrands,
  carModels,
  engineTypes,
} from "../data/Content_Option.js";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedMaker, setSelectedMaker] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedEngine, setSelectedEngine] = useState("");
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [regNumber, setRegNumber] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showProducts, setShowProducts] = useState(false);

  //* Carousel auto-slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  //* Handle Add to Cart
  const handleAddToCart = (product) => {
    addToCart(product);
  };

  //* Featured products
  const featuredProducts = mockProducts.slice(0, 5);

  //* Search Handlers
  const handleRegSearch = () => {
    if (!regNumber.trim()) {
      alert("Please enter a registration number");
      return;
    }
    setSearchResults({
      type: "registration",
      regNumber: regNumber,
      found: true,
      vehicle: {
        maker: "Ford",
        model: "Focus",
        year: "2018",
        engine: "1.6L Petrol",
      },
    });
    setShowProducts(false);
  };

  //* Manual Search Handler
  const handleManualSearch = () => {
    if (!selectedMaker || !selectedModel || !selectedEngine) {
      alert("Please select maker, model and engine");
      return;
    }
    setSearchResults({
      type: "manual",
      found: true,
      vehicle: {
        maker: selectedMaker,
        model: selectedModel,
        engine: selectedEngine,
      },
    });
    setShowProducts(false);
  };

  //* Reset Search
  const handleReset = () => {
    setRegNumber("");
    setSelectedMaker("");
    setSelectedModel("");
    setSelectedEngine("");
    setSearchResults(null);
    setProducts([]);
    setShowProducts(false);
    setSelectedCategory("all");
  };

  //* Fetch Products with Vehicle Filter - النسخة المحسنة
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://raw.githubusercontent.com/Rabyoo/api-products-sparecar/refs/heads/main/products.json"
      );
      const data = await response.json();

      // إذا لم يتم اختيار ماركة، اعرض كل المنتجات
      let filteredData = data;

      if (searchResults?.vehicle?.maker) {
        const selectedBrand = searchResults.vehicle.maker;

        // فلترة بسيطة: المنتجات التي carBrand تحتوي على الماركة المختارة
        filteredData = data.filter((product) => {
          // تأكد من وجود carBrand في المنتج
          if (!product.carBrand) return false;

          // تحقق مما إذا كان carBrand يحتوي على الماركة المختارة
          return product.carBrand
            .toLowerCase()
            .includes(selectedBrand.toLowerCase());
        });
      }

      setProducts(filteredData);
      setShowProducts(true);

      // إذا لم توجد منتجات
      if (filteredData.length === 0 && searchResults?.vehicle?.maker) {
        toast.error(`No products found for ${searchResults.vehicle.maker}`);
        setShowProducts(false);
        return;
      }

      // الانتقال إلى صفحة المنتجات مع الفلتر
      if (searchResults?.vehicle?.maker) {
        navigate(`/products?carBrand=${searchResults.vehicle.maker}`);
      } else {
        navigate("/products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const categories =
    products.length > 0
      ? ["all", ...new Set(products.map((p) => p.category))]
      : ["all"];

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  if (showProducts) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header with vehicle info */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <Car className="text-[#0066cc]" size={40} />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {searchResults?.vehicle?.maker}{" "}
                    {searchResults?.vehicle?.model}
                  </h2>
                  <p className="text-gray-600">
                    {searchResults?.vehicle?.engine}
                    {searchResults?.vehicle?.year &&
                      ` • ${searchResults.vehicle.year}`}
                  </p>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded font-medium hover:bg-gray-300 transition-colors">
                <X size={18} />
                New Search
              </button>
            </div>
          </div>

          {/* Categories Filter */}
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Filter size={20} className="text-gray-600" />
              <h3 className="font-bold text-gray-900">Filter by Category</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded font-medium transition-colors ${
                    selectedCategory === cat
                      ? "bg-[#0066cc] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}>
                  {cat === "all" ? "All Parts" : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <div
                  key={product._id || product.id || index}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="aspect-square bg-gray-100 flex items-center justify-center p-4">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name || "Product"}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="text-gray-400 text-center">
                        <Car size={64} />
                        <p className="mt-2 text-sm">No Image</p>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    {product.category && (
                      <span className="inline-block px-2 py-1 bg-[#ff6600] text-white text-xs font-bold rounded mb-2">
                        {product.category}
                      </span>
                    )}

                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
                      {product.name || "Unnamed Product"}
                    </h3>

                    {product.partNumber && (
                      <p className="text-sm text-gray-600 mb-2">
                        Part #: {product.partNumber}
                      </p>
                    )}

                    {product.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-4">
                      <div>
                        <span className="text-2xl font-bold text-[#0066cc]">
                          £{product.price?.toFixed(2) || "0.00"}
                        </span>
                        {product.stock !== undefined && (
                          <p
                            className={`text-sm ${
                              product.stock > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}>
                            {product.stock > 0
                              ? `✓ In Stock (${product.stock})`
                              : "✗ Out of Stock"}
                          </p>
                        )}
                      </div>

                      <button
                        className="bg-[#0066cc] text-white px-4 py-2 rounded font-medium hover:bg-[#0052a3] transition-colors flex items-center gap-2"
                        disabled={product.stock === 0}>
                        <ShoppingCart size={18} />
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-12 border border-gray-200 text-center">
              <p className="text-gray-600 text-lg">
                {products.length === 0
                  ? "Loading products..."
                  : "No products found in this category."}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section with Carousel and Search */}
      <section className="bg-white pt-32 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Side - Search Form */}
            <div className="min-h-screen bg-gray-50 p-4">
              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                  <div className="">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Find car parts for your vehicle
                    </h3>

                    <div className="space-y-3">
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#ff6600] rounded-full flex items-center justify-center text-white text-xs font-bold z-10">
                          1
                        </div>
                        <select
                          value={selectedMaker}
                          onChange={(e) => {
                            setSelectedMaker(e.target.value);
                            setSelectedModel("");
                            setSelectedEngine("");
                          }}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#0066cc] appearance-none bg-white cursor-pointer">
                          <option value="">Select maker</option>
                          {carBrands.map((brand) => (
                            <option key={brand} value={brand}>
                              {brand}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="relative">
                        <div
                          className={`absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 ${
                            selectedMaker ? "bg-[#ff6600]" : "bg-gray-300"
                          } rounded-full flex items-center justify-center text-white text-xs font-bold z-10`}>
                          2
                        </div>
                        <select
                          value={selectedModel}
                          onChange={(e) => {
                            setSelectedModel(e.target.value);
                            setSelectedEngine("");
                          }}
                          disabled={!selectedMaker}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#0066cc] appearance-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed cursor-pointer">
                          <option value="">Select model</option>
                          {selectedMaker &&
                            carModels[selectedMaker]?.map((model) => (
                              <option key={model} value={model}>
                                {model}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div className="relative">
                        <div
                          className={`absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 ${
                            selectedModel ? "bg-[#ff6600]" : "bg-gray-300"
                          } rounded-full flex items-center justify-center text-white text-xs font-bold z-10`}>
                          3
                        </div>
                        <select
                          value={selectedEngine}
                          onChange={(e) => setSelectedEngine(e.target.value)}
                          disabled={!selectedModel}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#0066cc] appearance-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed cursor-pointer">
                          <option value="">Select engine</option>
                          {selectedModel &&
                            engineTypes.default.map((engine) => (
                              <option key={engine} value={engine}>
                                {engine}
                              </option>
                            ))}
                        </select>
                      </div>

                      <button
                        onClick={handleManualSearch}
                        disabled={
                          !selectedMaker || !selectedModel || !selectedEngine
                        }
                        className="w-full bg-[#0066cc] text-white py-3 rounded font-bold hover:bg-[#0052a3] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        <Search size={18} />
                        Search
                      </button>
                    </div>

                    <div className="mt-4 text-center">
                      <a
                        href="#"
                        className="text-[#0066cc] text-sm hover:underline font-medium">
                        CAN'T FIND YOUR CAR IN THE CATALOGUE?
                      </a>
                    </div>
                  </div>
                </div>

                {searchResults && !showProducts && (
                  <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm mt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Car className="text-[#0066cc]" size={32} />
                      <h3 className="text-xl font-bold text-gray-900">
                        Search Results
                      </h3>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded p-4 mb-4">
                      <p className="text-green-800 font-medium">
                        ✓ Vehicle found!
                      </p>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Maker:</span>
                        <span className="font-bold text-gray-900">
                          {searchResults.vehicle.maker}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Model:</span>
                        <span className="font-bold text-gray-900">
                          {searchResults.vehicle.model}
                        </span>
                      </div>
                      {searchResults.vehicle.year && (
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-gray-600">Year:</span>
                          <span className="font-bold text-gray-900">
                            {searchResults.vehicle.year}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Engine:</span>
                        <span className="font-bold text-gray-900">
                          {searchResults.vehicle.engine}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={fetchProducts}
                        disabled={loading}
                        className="flex-1 bg-[#0066cc] text-white py-3 rounded font-bold hover:bg-[#0052a3] transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2">
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Loading...
                          </>
                        ) : (
                          <>
                            <ShoppingCart size={18} />
                            View Available Parts
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleReset}
                        className="px-6 bg-gray-200 text-gray-700 py-3 rounded font-bold hover:bg-gray-300 transition-colors">
                        New Search
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Carousel */}
            <div className="relative h-[500px] rounded-lg overflow-hidden">
              {carouselSlides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === currentSlide ? "opacity-100" : "opacity-0"
                  }`}>
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-black/70 to-black/50`}>
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover mix-blend-overlay"
                    />
                  </div>
                  <div className="relative h-full flex flex-col justify-center px-12 text-white">
                    <h2 className="text-4xl font-bold mb-2">{slide.title}</h2>
                    <p className="text-2xl mb-6">{slide.subtitle}</p>
                    <Link
                      to={slide.link}
                      className="bg-[#ff6600] text-white px-8 py-3 rounded font-bold hover:bg-[#e55a00] transition-colors w-fit">
                      {slide.buttonText}
                    </Link>
                  </div>
                </div>
              ))}

              {/* Carousel Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {carouselSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentSlide ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            SPARECAR AUTO PARTS STORE: BUY CAR PARTS ONLINE
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category, i) => (
              <Link key={i} to={`/products?category=${category.name}`}>
                <div className="bg-white rounded-lg p-4 text-center hover:shadow-lg transition-shadow cursor-pointer border border-gray-200">
                  <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden bg-gray-100">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Accessories Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            CAR ESSENTIALS, ACCESSORIES, CLEANING PRODUCTS & TOOLS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {accessories.map((item, i) => (
              <Link key={i} to={`/products?category=${item.name}`}>
                <div className="relative h-64 rounded-lg overflow-hidden group cursor-pointer">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                    <h3 className="text-xl font-bold text-white">
                      {item.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Car Brands Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            BUY AUTO PARTS FOR THE MOST POPULAR CAR BRANDS
          </h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {carBrands.map((brand, i) => (
              <Link key={i} to={`/products?brand=${brand}`}>
                <div className="bg-white rounded-lg p-4 text-center hover:shadow-lg transition-shadow cursor-pointer border border-gray-200">
                  <p className="text-sm font-bold text-gray-900">{brand}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Shield className="w-12 h-12 text-[#0066cc] flex-shrink-0" />
              <div>
                <h3 className="font-bold text-gray-900 mb-1">
                  Low-cost delivery
                </h3>
                <p className="text-sm text-gray-600">Fast shipping worldwide</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Truck className="w-12 h-12 text-[#0066cc] flex-shrink-0" />
              <div>
                <h3 className="font-bold text-gray-900 mb-1">
                  Secure payments
                </h3>
                <p className="text-sm text-gray-600">SSL encrypted checkout</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Wrench className="w-12 h-12 text-[#0066cc] flex-shrink-0" />
              <div>
                <h3 className="font-bold text-gray-900 mb-1">
                  Extended warranty on returns
                </h3>
                <p className="text-sm text-gray-600">365 days return policy</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <ShoppingCart className="w-12 h-12 text-[#0066cc] flex-shrink-0" />
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Original parts</h3>
                <p className="text-sm text-gray-600">
                  Genuine quality guaranteed
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              SPARECAR BESTSELLERS: BUY AUTO CAR PARTS ONLINE AT A GOOD PRICE
            </h2>
            <Link to="/products">
              <button className="text-[#0066cc] hover:text-[#0052a3] flex items-center gap-2 font-medium">
                View All <ArrowRight size={20} />
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow border border-gray-200">
                <Link to={`/products/${product.id}`}>
                  <div className="relative">
                    {product.discount && (
                      <span className="absolute top-2 right-2 bg-[#ff6600] text-white text-xs font-bold px-2 py-1 rounded">
                        -{product.discount}%
                      </span>
                    )}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                </Link>

                <div className="p-4">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < 4
                            ? "fill-[#ffd700] text-[#ffd700]"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-xs text-gray-600 ml-1">(24)</span>
                  </div>

                  <Link to={`/products/${product.id}`}>
                    <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 hover:text-[#0066cc]">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="mb-3">
                    <span className="text-2xl font-bold text-gray-900">
                      £{product.price.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-[#cc0000] text-white py-2 font-bold hover:bg-[#b30000] transition-colors text-sm">
                    Add to basket
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Manufacturers Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            GET GREAT DEALS ON CAR SPARES FROM THE BEST MANUFACTURERS IN OUR
            ONLINE SHOP
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-4">
            {manufacturers.map((manufacturer, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-lg p-4 flex items-center justify-center hover:shadow-md transition-shadow cursor-pointer border border-gray-200">
                <img
                  src={manufacturer.logo}
                  alt={manufacturer.name}
                  className="max-w-full h-8 object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            COMPREHENSIVE GUIDE ON CAR REPAIRS & MAINTENANCE
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-black rounded-lg overflow-hidden">
              <div className="grid grid-cols-2 divide-x divide-white">
                <div className="p-4">
                  <h3 className="text-white font-bold mb-4 text-center">
                    BEFORE
                  </h3>
                  <img
                    src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80"
                    alt="Before"
                    className="w-full h-64 object-cover rounded"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-white font-bold mb-4 text-center">
                    AFTER
                  </h3>
                  <img
                    src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&q=80"
                    alt="After"
                    className="w-full h-64 object-cover rounded"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">
                  Step-by-step guides
                </h3>
                <p className="text-sm text-gray-600">
                  Detailed instructions for common repairs and maintenance tasks
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">
                  Video tutorials
                </h3>
                <p className="text-sm text-gray-600">
                  Watch professional mechanics demonstrate repair procedures
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">Expert tips</h3>
                <p className="text-sm text-gray-600">
                  Learn from experienced technicians and save money on repairs
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
