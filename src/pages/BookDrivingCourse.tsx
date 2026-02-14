// frontend/src/pages/services/BookDrivingCourse.tsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CreditCard,
  Shield,
  Phone,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
// import { DatePicker } from "@/components/ui/datepicker";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

export default function BookDrivingCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    nationalId: "",
    address: "",
    preferredTime: "",
    emergencyContact: "",
    medicalConditions: "",
    paymentMethod: "visa",
  });

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedPackage, setSelectedPackage] = useState("basic");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const packages = [
    {
      id: "basic",
      name: "الباقة الأساسية",
      price: 3200,
      features: ["30 ساعة تدريب", "كتاب نظري", "تدريب ملعب", "امتحان داخلي"],
    },
    {
      id: "premium",
      name: "الباقة المتميزة",
      price: 4500,
      features: [
        "40 ساعة تدريب",
        "محاكاة متقدمة",
        "تدريب ليلي",
        "مراجعة قبل الامتحان",
      ],
    },
    {
      id: "vip",
      name: "الباقة VIP",
      price: 6000,
      features: ["50 ساعة تدريب", "مدرب خاص", "سيارة خاصة", "ضمان النجاح"],
    },
  ];

  const handleSubmit = async () => {
    try {
      // 1. التحقق من البيانات
      if (!formData.fullName || !formData.phone || !formData.nationalId) {
        toast({
          title: "بيانات ناقصة",
          description: "يرجى ملء جميع الحقول المطلوبة",
          variant: "destructive",
        });
        return;
      }

      if (!agreedToTerms) {
        toast({
          title: "الشروط والأحكام",
          description: "يجب الموافقة على الشروط والأحكام",
          variant: "destructive",
        });
        return;
      }

      // 2. تشفير البيانات الحساسة
      const encryptedData = {
        ...formData,
        nationalId: btoa(formData.nationalId), // تشفير بسيط (في production استخدم crypto)
        timestamp: new Date().toISOString(),
        bookingId: `DRV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };

      // 3. إرسال البيانات للسيرفر
      const response = await fetch("/api/bookings/driving", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(encryptedData),
      });

      if (response.ok) {
        toast({
          title: "تم الحجز بنجاح!",
          description: "ستتلقى رسالة تأكيد على بريدك الإلكتروني",
          className: "bg-green-500 text-white",
        });

        navigate("/learn-driving/confirmation");
      }
    } catch (error) {
      toast({
        title: "خطأ في الحجز",
        description: "حدث خطأ أثناء عملية الحجز",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`flex items-center ${s < 4 ? "flex-1" : ""}`}>
                <div
                  className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${step >= s ? "bg-orange-500 text-white" : "bg-gray-300 text-gray-600"}
                  ${s === step ? "ring-4 ring-orange-200" : ""}
                `}>
                  {s}
                </div>
                {s < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${step > s ? "bg-orange-500" : "bg-gray-300"}`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between text-sm">
            <span
              className={
                step >= 1 ? "font-bold text-orange-500" : "text-gray-500"
              }>
              اختر الباقة
            </span>
            <span
              className={
                step >= 2 ? "font-bold text-orange-500" : "text-gray-500"
              }>
              البيانات الشخصية
            </span>
            <span
              className={
                step >= 3 ? "font-bold text-orange-500" : "text-gray-500"
              }>
              الدفع
            </span>
            <span
              className={
                step >= 4 ? "font-bold text-orange-500" : "text-gray-500"
              }>
              التأكيد
            </span>
          </div>
        </div>

        {/* Step 1: Choose Package */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">اختر الباقة المناسبة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {packages.map((pkg) => (
                  <Card
                    key={pkg.id}
                    className={`cursor-pointer transition-all ${
                      selectedPackage === pkg.id
                        ? "border-2 border-orange-500 shadow-lg"
                        : ""
                    }`}
                    onClick={() => setSelectedPackage(pkg.id)}>
                    <CardContent className="pt-6">
                      <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
                      <div className="text-3xl font-bold text-orange-500 mb-4">
                        {pkg.price.toLocaleString()} ج.م
                      </div>
                      <ul className="space-y-2 mb-4">
                        {pkg.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => navigate(-1)}>
                  رجوع
                </Button>
                <Button onClick={() => setStep(2)}>
                  التالي: البيانات الشخصية
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Personal Information */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">البيانات الشخصية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label htmlFor="fullName">الاسم بالكامل *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="phone">رقم الهاتف *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="nationalId">رقم البطاقة *</Label>
                  <Input
                    id="nationalId"
                    value={formData.nationalId}
                    onChange={(e) =>
                      setFormData({ ...formData, nationalId: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="address">العنوان</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  رجوع
                </Button>
                <Button onClick={() => setStep(3)}>التالي: الدفع</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">الدفع الآمن</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="visa" className="mb-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="visa">
                    <CreditCard className="w-4 h-4 mr-2" /> بطاقة ائتمان
                  </TabsTrigger>
                  <TabsTrigger value="vodafone">
                    <Phone className="w-4 h-4 mr-2" /> فودافون كاش
                  </TabsTrigger>
                  <TabsTrigger value="bank">
                    <Shield className="w-4 h-4 mr-2" /> تحويل بنكي
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="visa">
                  <div className="space-y-4">
                    <Input placeholder="رقم البطاقة" />
                    <div className="grid grid-cols-2 gap-4">
                      <Input placeholder="Expire Date (MM/YY)" />
                      <Input placeholder="CVV" />
                    </div>
                    <Input placeholder="اسم حامل البطاقة" />
                  </div>
                </TabsContent>

                <TabsContent value="vodafone">
                  <Alert>
                    <AlertCircle className="w-4 h-4" />
                    <AlertDescription>
                      سوف تتلقى رسالة على هاتفك لإتمام عملية الدفع
                    </AlertDescription>
                  </Alert>
                </TabsContent>

                <TabsContent value="bank">
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-100 rounded-lg">
                      <p className="font-bold">بنك القاهرة</p>
                      <p>رقم الحساب: 123456789012</p>
                      <p>IBAN: EG123456789012345678901</p>
                    </div>
                    <Input placeholder="رقم العملية البنكية" />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex items-center space-x-2 mb-6">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="terms" className="text-sm">
                  أوافق على{" "}
                  <a href="/terms" className="text-orange-500 underline">
                    الشروط والأحكام
                  </a>
                  و{" "}
                  <a href="/privacy" className="text-orange-500 underline">
                    سياسة الخصوصية
                  </a>
                </label>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  رجوع
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="bg-green-600 hover:bg-green-700">
                  <Shield className="w-4 h-4 mr-2" /> تأكيد الحجز والدفع
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Security Badge */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 p-4 bg-white rounded-lg shadow">
            <Shield className="w-6 h-6 text-green-500" />
            <span className="font-semibold">
              حجز آمن ومشفر - بياناتك محمية 100%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
