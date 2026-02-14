import { useState } from "react";
import {
  Store,
  CheckCircle2,
  AlertCircle,
  FileText,
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Globe,
  CreditCard,
  ArrowRight,
  ArrowLeft,
  Loader,
  Upload,
  X,
  Image as ImageIcon,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function VendorRegister() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    vendorName: "",
    businessName: "",
    businessType: "individual",
    taxId: "",
    registrationNumber: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    website: "",
    street: "",
    city: "",
    state: "",
    country: "Egypt",
    postalCode: "",
    storeDescription: "",
    storeLogo: "",
    storeBanner: "",
    returnPolicy: "",
    shippingPolicy: "",
    bankName: "",
    accountNumber: "",
    accountHolder: "",
    swiftCode: "",
    iban: "",
    commercialRegisterImages: [],
  });

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      const isValid = file.type.startsWith("image/") && file.size <= 5000000;
      if (!isValid && file.size > 5000000) {
        setError("Image size must be less than 5MB");
      }
      return isValid;
    });

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          commercialRegisterImages: [
            ...prev.commercialRegisterImages,
            {
              file: file,
              preview: reader.result,
              name: file.name,
            },
          ],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      commercialRegisterImages: prev.commercialRegisterImages.filter(
        (_, i) => i !== index,
      ),
    }));
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.vendorName || !formData.businessName) {
        setError(
          "Please fill all required fields (Vendor Name & Business Name)",
        );
        return false;
      }
      if (formData.commercialRegisterImages.length === 0) {
        setError("Please upload at least one commercial register image");
        return false;
      }
    }
    if (step === 2) {
      if (!formData.email || !formData.phone || !formData.password) {
        setError("Please fill all required fields (Email, Phone & Password)");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords don't match");
        return false;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        return false;
      }
    }
    if (step === 3) {
      if (!formData.street || !formData.city) {
        setError("Please fill required address fields (Street & City)");
        return false;
      }
    }
    if (step === 4) {
      if (!formData.storeDescription) {
        setError("Store description is required");
        return false;
      }
    }
    if (step === 5) {
      if (
        !formData.bankName ||
        !formData.accountNumber ||
        !formData.accountHolder
      ) {
        setError(
          "Please fill all banking fields (Bank Name, Account Number & Account Holder)",
        );
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    // التحقق النهائي من الحقول المطلوبة
    const missingFields = [];

    if (!formData.vendorName) missingFields.push("Vendor Name");
    if (!formData.businessName) missingFields.push("Business Name");
    if (!formData.email) missingFields.push("Email");
    if (!formData.phone) missingFields.push("Phone");
    if (!formData.password) missingFields.push("Password");
    if (!formData.confirmPassword) missingFields.push("Confirm Password");
    if (!formData.street) missingFields.push("Street");
    if (!formData.city) missingFields.push("City");
    if (!formData.storeDescription) missingFields.push("Store Description");
    if (!formData.bankName) missingFields.push("Bank Name");
    if (!formData.accountNumber) missingFields.push("Account Number");
    if (!formData.accountHolder) missingFields.push("Account Holder");
    if (formData.commercialRegisterImages.length === 0)
      missingFields.push("Commercial Register Images");

    if (missingFields.length > 0) {
      setError(`Missing required fields: ${missingFields.join(", ")}`);
      return;
    }

    // ✅ تحقق من تطابق كلمة المرور في الفرونت قبل الإرسال
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match. Please check both fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // ✅ استخدام FormData لإرسال البيانات والصور
      const submitData = new FormData();

      // إضافة البيانات النصية - إرسال حتى لو فارغة
      const textFields = [
        "vendorName",
        "businessName",
        "businessType",
        "taxId",
        "registrationNumber",
        "phone",
        "email",
        "password",
        "confirmPassword", // ⭐ تأكد من إضافة هذا
        "website",
        "street",
        "city",
        "state",
        "country",
        "postalCode",
        "storeDescription",
        "returnPolicy",
        "shippingPolicy",
        "bankName",
        "accountNumber",
        "accountHolder",
        "swiftCode",
        "iban",
      ];

      textFields.forEach((field) => {
        // ⭐ أرسل القيمة حتى لو كانت "" (سلسلة فارغة)
        const value = formData[field as keyof typeof formData];
        submitData.append(
          field,
          value !== undefined && value !== null ? String(value) : "",
        );
      });

      // ✅ إضافة الصور كملفات فعلية
      formData.commercialRegisterImages.forEach((img, index) => {
        submitData.append("commercialRegisterImages", img.file);
      });

      console.log("📤 Sending vendor registration with FormData...");
      console.log("🔑 Password:", formData.password);
      console.log("🔑 Confirm Password:", formData.confirmPassword);
      console.log("🖼 Images:", formData.commercialRegisterImages.length);

      const response = await fetch(`${API_URL}/auth/register-vendor`, {
        method: "POST",
        // ❌ لا تضيف Content-Type header - المتصفح يضيفه تلقائياً مع FormData
        body: submitData,
      });

      const data = await response.json();
      console.log("📥 Response from server:", data);

      if (response.ok && data.success) {
        setSuccess(
          "✅ Vendor application submitted successfully! You are now logged in.",
        );

        // حفظ التوكن والبيانات
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        // توجيه إلى الداشبورد المناسب
        setTimeout(() => {
          if (data.user?.role === "vendor") {
            window.location.href = "/vendor/dashboard";
          } else if (data.user?.role === "admin") {
            window.location.href = "/admin";
          } else {
            window.location.href = "/home";
          }
        }, 1500);
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err: any) {
      console.error("❌ Network Error:", err);
      setError(
        `Connection failed: ${err.message}. Please check if backend is running on ${API_URL}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, label: "Basic", icon: User },
    { num: 2, label: "Contact", icon: Phone },
    { num: 3, label: "Address", icon: MapPin },
    { num: 4, label: "Store", icon: Store },
    { num: 5, label: "Banking", icon: CreditCard },
    { num: 6, label: "Review", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full mb-4 shadow-lg">
            <Store className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Become a Vendor
          </h1>
          <p className="text-gray-600 text-lg">
            Join thousands of sellers worldwide
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8 bg-white rounded-xl p-6 shadow-md border">
          <div className="flex justify-between items-center">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={s.num} className="flex flex-col items-center flex-1">
                  <div className="flex items-center w-full">
                    {idx > 0 && (
                      <div
                        className={`flex-1 h-1 ${step > s.num - 1 ? "bg-orange-500" : "bg-gray-200"}`}
                      />
                    )}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                        step >= s.num
                          ? "bg-orange-500 border-orange-500 text-white scale-110"
                          : step > s.num
                            ? "bg-green-500 border-green-500 text-white"
                            : "border-gray-300 bg-white text-gray-400"
                      }`}>
                      {step > s.num ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    {idx < steps.length - 1 && (
                      <div
                        className={`flex-1 h-1 ${step > s.num ? "bg-orange-500" : "bg-gray-200"}`}
                      />
                    )}
                  </div>
                  <span
                    className={`text-xs mt-2 font-medium ${step >= s.num ? "text-orange-600" : "text-gray-500"}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}
        {success && (
          <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-green-800 font-medium">{success}</p>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6">
            <h2 className="text-2xl font-bold text-white">
              {step === 1 && "Basic Information"}
              {step === 2 && "Contact Details"}
              {step === 3 && "Business Address"}
              {step === 4 && "Store Information"}
              {step === 5 && "Banking Details"}
              {step === 6 && "Review & Submit"}
            </h2>
          </div>

          <div className="p-8">
            {/* Step 1 */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Vendor Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.vendorName}
                      onChange={(e) =>
                        updateField("vendorName", e.target.value)
                      }
                      className="w-full px-4 py-3 border-2 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                      placeholder="AutoPartsPro"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Business Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.businessName}
                      onChange={(e) =>
                        updateField("businessName", e.target.value)
                      }
                      className="w-full px-4 py-3 border-2 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                      placeholder="Official name"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Business Type *
                    </label>
                    <select
                      value={formData.businessType}
                      onChange={(e) =>
                        updateField("businessType", e.target.value)
                      }
                      className="w-full px-4 py-3 border-2 rounded-lg focus:border-orange-500">
                      <option value="individual">Individual</option>
                      <option value="company">Company</option>
                      <option value="partnership">Partnership</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Tax ID *
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.taxId}
                      minLength={9}
                      maxLength={9}
                      onChange={(e) => updateField("taxId", e.target.value)}
                      className="w-full px-4 py-3 border-2 rounded-lg focus:border-orange-500"
                      placeholder="123-456-789"
                    />
                  </div>
                </div>

                <div className="mt-8 border-t-2 pt-6">
                  <label className="block text-sm font-semibold mb-4">
                    Commercial Register Images *
                    <span className="text-gray-500 font-normal text-xs ml-2">
                      (Upload clear images of your business registration
                      documents)
                    </span>
                  </label>

                  <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-orange-800">
                        <p className="font-semibold mb-1">
                          Security Requirement
                        </p>
                        <p>
                          Please upload official commercial register documents
                          for verification. This ensures platform security and
                          prevents fraud.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-orange-500 transition-colors">
                    <input
                      required
                      type="file"
                      id="commercial-register"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="commercial-register"
                      className="flex flex-col items-center justify-center cursor-pointer">
                      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                        <Upload className="w-8 h-8 text-orange-600" />
                      </div>
                      <p className="text-gray-700 font-semibold mb-1">
                        Click to upload images
                      </p>
                      <p className="text-gray-500 text-sm">
                        PNG, JPG up to 5MB (Multiple files allowed)
                      </p>
                    </label>
                  </div>

                  {/* Preview uploaded images */}
                  {formData.commercialRegisterImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                      {formData.commercialRegisterImages.map((img, index) => (
                        <div
                          key={index}
                          className="relative group border-2 rounded-lg overflow-hidden">
                          <img
                            src={img.preview}
                            alt={`Register ${index + 1}`}
                            className="w-full h-32 object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                            <button
                              onClick={() => removeImage(index)}
                              className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all">
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                            <p className="text-white text-xs truncate">
                              {img.name}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {formData.commercialRegisterImages.length > 0 && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-green-700">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>
                        {formData.commercialRegisterImages.length} image(s)
                        uploaded
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Email *
                    </label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className="w-full px-4 py-3 border-2 rounded-lg focus:border-orange-500"
                      placeholder="vendor@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Phone *
                    </label>
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className="w-full px-4 py-3 border-2 rounded-lg focus:border-orange-500"
                      placeholder="+1 555 123 4567"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Password *
                    </label>
                    <input
                      required
                      type="password"
                      value={formData.password}
                      onChange={(e) => updateField("password", e.target.value)}
                      className="w-full px-4 py-3 border-2 rounded-lg focus:border-orange-500"
                      placeholder="Min 6 characters"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Confirm Password *
                    </label>
                    <input
                      required
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        updateField("confirmPassword", e.target.value)
                      }
                      className="w-full px-4 py-3 border-2 rounded-lg focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Street Address *
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.street}
                    onChange={(e) => updateField("street", e.target.value)}
                    className="w-full px-4 py-3 border-2 rounded-lg focus:border-orange-500"
                    placeholder="123 Main St"
                  />
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      City *
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      className="w-full px-4 py-3 border-2 rounded-lg focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => updateField("state", e.target.value)}
                      className="w-full px-4 py-3 border-2 rounded-lg focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) =>
                        updateField("postalCode", e.target.value)
                      }
                      className="w-full px-4 py-3 border-2 rounded-lg focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4 */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Store Description *
                  </label>
                  <textarea
                    value={formData.storeDescription}
                    onChange={(e) =>
                      updateField("storeDescription", e.target.value)
                    }
                    required
                    className="w-full px-4 py-3 border-2 rounded-lg focus:border-orange-500 resize-none"
                    rows="4"
                    placeholder="Tell customers about your store..."
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Return Policy
                    </label>
                    <textarea
                      value={formData.returnPolicy}
                      onChange={(e) =>
                        updateField("returnPolicy", e.target.value)
                      }
                      rows="3"
                      className="w-full px-4 py-3 border-2 rounded-lg focus:border-orange-500 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Shipping Policy
                    </label>
                    <textarea
                      value={formData.shippingPolicy}
                      onChange={(e) =>
                        updateField("shippingPolicy", e.target.value)
                      }
                      rows="3"
                      className="w-full px-4 py-3 border-2 rounded-lg focus:border-orange-500 resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5 */}
            {step === 5 && (
              <div className="space-y-6">
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800 font-medium">
                    Banking info for payment processing - All data encrypted
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Bank Name *
                  </label>
                  <input
                    required
                    minLength={0}
                    maxLength={200}
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => updateField("bankName", e.target.value)}
                    className="w-full px-4 py-3 border-2 rounded-lg focus:border-orange-500"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Account Number *
                    </label>
                    <input
                      required
                      minLength={14}
                      maxLength={14}
                      type="text"
                      value={formData.accountNumber}
                      onChange={(e) =>
                        updateField("accountNumber", e.target.value)
                      }
                      className="w-full px-4 py-3 border-2 rounded-lg focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Account Holder *
                    </label>
                    <input
                      maxLength={5}
                      type="text"
                      value={formData.accountHolder}
                      onChange={(e) =>
                        updateField("accountHolder", e.target.value)
                      }
                      className="w-full px-4 py-3 border-2 rounded-lg focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 6 - Review */}
            {step === 6 && (
              <div className="space-y-6">
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-4">
                    Review Your Information
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="border-b pb-2">
                      <p className="font-semibold text-gray-600 mb-1">
                        Basic Info
                      </p>
                      <p>
                        <strong>Vendor:</strong> {formData.vendorName}
                      </p>
                      <p>
                        <strong>Business:</strong> {formData.businessName}
                      </p>
                      <p>
                        <strong>Type:</strong> {formData.businessType}
                      </p>
                    </div>

                    <div className="border-b pb-2">
                      <p className="font-semibold text-gray-600 mb-1">
                        Contact
                      </p>
                      <p>
                        <strong>Email:</strong> {formData.email}
                      </p>
                      <p>
                        <strong>Phone:</strong> {formData.phone}
                      </p>
                    </div>

                    <div className="border-b pb-2">
                      <p className="font-semibold text-gray-600 mb-1">
                        Address
                      </p>
                      <p>
                        <strong>Street:</strong> {formData.street}
                      </p>
                      <p>
                        <strong>City:</strong> {formData.city}
                      </p>
                      {formData.state && (
                        <p>
                          <strong>State:</strong> {formData.state}
                        </p>
                      )}
                    </div>

                    <div className="border-b pb-2">
                      <p className="font-semibold text-gray-600 mb-1">Store</p>
                      <p>
                        <strong>Description:</strong>{" "}
                        {formData.storeDescription.substring(0, 100)}
                        {formData.storeDescription.length > 100 ? "..." : ""}
                      </p>
                    </div>

                    <div className="border-b pb-2">
                      <p className="font-semibold text-gray-600 mb-1">
                        Banking
                      </p>
                      <p>
                        <strong>Bank Name:</strong>{" "}
                        {formData.bankName || "⚠️ Missing"}
                      </p>
                      <p>
                        <strong>Account Number:</strong>{" "}
                        {formData.accountNumber || "⚠️ Missing"}
                      </p>
                      <p>
                        <strong>Account Holder:</strong>{" "}
                        {formData.accountHolder || "⚠️ Missing"}
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold text-gray-600 mb-1">
                        Documents
                      </p>
                      <p>
                        <strong>Commercial Register Images:</strong>{" "}
                        {formData.commercialRegisterImages.length} uploaded
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    ⚠️ By submitting, you agree to our Terms of Service. Your
                    application will be reviewed within 24-48 hours.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-semibold flex items-center gap-2">
                  <ArrowLeft className="w-5 h-5" /> Previous
                </button>
              )}
              {step < 6 ? (
                <button
                  onClick={() => {
                    if (validateStep()) setStep(step + 1);
                  }}
                  className="ml-auto px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold flex items-center gap-2">
                  Continue <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="ml-auto px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold flex items-center gap-2 disabled:opacity-50">
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" /> Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" /> Submit Application
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {[
            {
              icon: Building,
              title: "Reach Millions",
              desc: "Access to global customer base",
            },
            {
              icon: Store,
              title: "Full Control",
              desc: "Manage products & inventory",
            },
            {
              icon: CheckCircle2,
              title: "Secure Payments",
              desc: "Regular & reliable payouts",
            },
          ].map((benefit, i) => (
            <div key={i} className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <benefit.icon className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
              <p className="text-gray-600 text-sm">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
