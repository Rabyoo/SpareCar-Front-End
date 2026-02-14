import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  CreditCard,
  Shield,
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  AlertCircle,
  Car,
  BookOpen,
  Star,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
// import { DatePicker } from "@/components/ui/datepicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

export default function DrivingBooking() {
  const { schoolId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    nationalId: "",
    address: "",
    preferredTime: "morning",
    emergencyContact: "",
    medicalConditions: "",
    hasExperience: "no",
  });

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedPackage, setSelectedPackage] = useState("basic");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit");

  const packages = [
    {
      id: "basic",
      name: "الباقة الأساسية",
      price: 3200,
      originalPrice: 3800,
      duration: "4 أسابيع",
      hours: 30,
      features: [
        "30 ساعة تدريب عملي",
        "كتاب النظري مجاناً",
        "تدريب في الملعب",
        "امتحان داخلي مجاني",
        "شهادة معتمدة",
      ],
    },
    {
      id: "premium",
      name: "الباقة المتميزة",
      price: 4500,
      originalPrice: 5200,
      duration: "5 أسابيع",
      hours: 40,
      features: [
        "40 ساعة تدريب عملي",
        "محاكاة القيادة المتقدمة",
        "تدريب ليلي (5 ساعات)",
        "مراجعة قبل الامتحان",
        "تأمين على المتدرب",
        "شهادة معتمدة دولياً",
      ],
    },
    {
      id: "vip",
      name: "الباقة VIP",
      price: 6000,
      originalPrice: 7000,
      duration: "6 أسابيع",
      hours: 50,
      features: [
        "50 ساعة تدريب عملي",
        "مدرب خاص (1:1)",
        "سيارة تدريب خاصة",
        "تدريب على الطرق السريعة",
        "ضمان النجاح في الامتحان",
        "شهادة ذهبية معتمدة",
        "متابعة بعد التخرج",
      ],
    },
  ];

  const timeSlots = [
    { id: "morning", label: "الصباح (8 ص - 12 ظ)", icon: "☀️" },
    { id: "afternoon", label: "الظهر (12 ظ - 4 م)", icon: "⏰" },
    { id: "evening", label: "المساء (4 م - 8 م)", icon: "🌙" },
  ];

  const handleSubmit = async () => {
    try {
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

      // Generate booking ID
      const bookingId = `DRV-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

      // In production, send to backend
      console.log("Booking data:", {
        schoolId,
        bookingId,
        formData,
        selectedPackage,
        selectedDate,
        paymentMethod,
      });

      toast({
        title: "تم الحجز بنجاح! 🎉",
        description: `رقم حجزك: ${bookingId}`,
        className: "bg-green-500 text-white",
      });

      navigate(`/learn-driving/confirmation?booking=${bookingId}`);
    } catch (error) {
      toast({
        title: "خطأ في الحجز",
        description: "حدث خطأ أثناء عملية الحجز",
        variant: "destructive",
      });
    }
  };

  const selectedPackageData = packages.find((p) => p.id === selectedPackage);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/learn-driving")}
            className="mb-4">
            <ChevronLeft className="w-4 h-4 mr-2" />
            العودة لصفحة الأكاديميات
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                حجز كورس تعليم القيادة
              </h1>
              <p className="text-gray-600 mt-2">
                أكاديمية القاهرة الدولية للقيادة - رقم التسجيل: {schoolId}
              </p>
            </div>

            <div className="text-right">
              <div className="text-sm text-gray-500">رقم الحجز</div>
              <div className="text-xl font-bold text-orange-600">
                DRV-{Date.now().toString().slice(-6)}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`flex items-center ${s < 4 ? "flex-1" : ""}`}>
                <div
                  className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold
                  ${step >= s ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-500"}
                  ${s === step ? "ring-4 ring-orange-200" : ""}
                `}>
                  {s}
                </div>
                {s < 4 && (
                  <div
                    className={`flex-1 h-2 mx-4 rounded-full ${step > s ? "bg-orange-500" : "bg-gray-300"}`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between text-sm px-2">
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
              الدفع الآمن
            </span>
            <span
              className={
                step >= 4 ? "font-bold text-orange-500" : "text-gray-500"
              }>
              التأكيد
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Step 1: Choose Package */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">
                    اختر الباقة المناسبة لك
                  </CardTitle>
                  <CardDescription>
                    اختر الباقة التي تناسب احتياجاتك وميزانيتك
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {packages.map((pkg) => (
                      <Card
                        key={pkg.id}
                        className={`cursor-pointer transition-all border-2 hover:border-orange-300 ${
                          selectedPackage === pkg.id
                            ? "border-orange-500 bg-orange-50"
                            : "border-gray-200"
                        }`}
                        onClick={() => setSelectedPackage(pkg.id)}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-xl font-bold">{pkg.name}</h3>
                              <p className="text-gray-600">
                                {pkg.duration} • {pkg.hours} ساعة
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-orange-600">
                                {pkg.price.toLocaleString()} ج.م
                              </div>
                              <div className="text-sm text-gray-500 line-through">
                                {pkg.originalPrice.toLocaleString()} ج.م
                              </div>
                            </div>
                          </div>

                          <ul className="space-y-2 mb-4">
                            {pkg.features.map((feature, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>

                          {selectedPackage === pkg.id && (
                            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                              <div className="flex items-center gap-2 text-green-700">
                                <Star className="w-4 h-4" />
                                <span className="font-semibold">
                                  الباقة المختارة
                                </span>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="flex justify-between mt-8">
                    <Button
                      variant="outline"
                      onClick={() => navigate("/learn-driving")}>
                      إلغاء
                    </Button>
                    <Button
                      onClick={() => setStep(2)}
                      className="bg-orange-500 hover:bg-orange-600">
                      التالي: البيانات الشخصية
                      <ChevronLeft className="w-4 h-4 mr-2" />
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
                  <CardDescription>
                    يرجى ملء بياناتك الشخصية بدقة
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="fullName">الاسم بالكامل *</Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              fullName: e.target.value,
                            })
                          }
                          placeholder="أحمد محمد علي"
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
                          placeholder="01XXXXXXXXX"
                        />
                      </div>

                      <div>
                        <Label htmlFor="nationalId">
                          رقم البطاقة الوطنية *
                        </Label>
                        <Input
                          id="nationalId"
                          value={formData.nationalId}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              nationalId: e.target.value,
                            })
                          }
                          placeholder="14 رقم"
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
                          placeholder="example@email.com"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="address">العنوان</Label>
                        <Textarea
                          id="address"
                          value={formData.address}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: e.target.value,
                            })
                          }
                          placeholder="المحافظة - المدينة - الحي - الشارع"
                          rows={2}
                        />
                      </div>
                    </div>

                    {/* Experience */}
                    <div>
                      <Label className="mb-3 block">
                        هل لديك خبرة سابقة في القيادة؟
                      </Label>
                      <RadioGroup
                        value={formData.hasExperience}
                        onValueChange={(value) =>
                          setFormData({ ...formData, hasExperience: value })
                        }
                        className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="no-exp" />
                          <Label htmlFor="no-exp">لا، مبتدئ تماماً</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="little" id="little-exp" />
                          <Label htmlFor="little-exp">قليل من الخبرة</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="yes-exp" />
                          <Label htmlFor="yes-exp">نعم، لدي خبرة</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Preferred Time */}
                    <div>
                      <Label className="mb-3 block">الوقت المفضل للتدريب</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {timeSlots.map((slot) => (
                          <Card
                            key={slot.id}
                            className={`cursor-pointer border-2 ${formData.preferredTime === slot.id ? "border-orange-500 bg-orange-50" : "border-gray-200"}`}
                            onClick={() =>
                              setFormData({
                                ...formData,
                                preferredTime: slot.id,
                              })
                            }>
                            <CardContent className="pt-6 text-center">
                              <div className="text-2xl mb-2">{slot.icon}</div>
                              <div className="font-medium">{slot.label}</div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Emergency Contact */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="emergencyContact">رقم للطوارئ</Label>
                        <Input
                          id="emergencyContact"
                          value={formData.emergencyContact}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              emergencyContact: e.target.value,
                            })
                          }
                          placeholder="رقم أحد الأقارب"
                        />
                      </div>

                      <div>
                        <Label htmlFor="medicalConditions">
                          حالات مرضية (إن وجدت)
                        </Label>
                        <Input
                          id="medicalConditions"
                          value={formData.medicalConditions}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              medicalConditions: e.target.value,
                            })
                          }
                          placeholder="أمراض مزمنة، أدوية..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between mt-8">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      رجوع
                    </Button>
                    <Button
                      onClick={() => setStep(3)}
                      className="bg-orange-500 hover:bg-orange-600">
                      التالي: الدفع الآمن
                      <ChevronLeft className="w-4 h-4 mr-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">الدفع الآمن</CardTitle>
                  <CardDescription>
                    اختر طريقة الدفع المناسبة لك
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="credit">
                        <CreditCard className="w-4 h-4 mr-2" /> بطاقة ائتمان
                      </TabsTrigger>
                      <TabsTrigger value="vodafone">
                        <Phone className="w-4 h-4 mr-2" /> فودافون كاش
                      </TabsTrigger>
                      <TabsTrigger value="bank">
                        <Shield className="w-4 h-4 mr-2" /> تحويل بنكي
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="credit" className="space-y-4 mt-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>رقم البطاقة</Label>
                          <Input placeholder="1234 5678 9012 3456" />
                        </div>
                        <div>
                          <Label>تاريخ الانتهاء</Label>
                          <Input placeholder="MM/YY" />
                        </div>
                        <div>
                          <Label>رمز الحماية (CVV)</Label>
                          <Input placeholder="123" type="password" />
                        </div>
                        <div>
                          <Label>اسم حامل البطاقة</Label>
                          <Input placeholder="كما هو مدون على البطاقة" />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="vodafone" className="mt-6">
                      <Alert>
                        <Phone className="w-4 h-4" />
                        <AlertDescription>
                          سوف تتلقى رسالة على هاتفك رقم {formData.phone} لإتمام
                          عملية الدفع عبر فودافون كاش
                        </AlertDescription>
                      </Alert>
                    </TabsContent>

                    <TabsContent value="bank" className="mt-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-100 rounded-lg">
                          <p className="font-bold mb-2">البنك الأهلي المصري</p>
                          <p className="text-sm">
                            رقم الحساب:{" "}
                            <span className="font-mono">123456789012</span>
                          </p>
                          <p className="text-sm">
                            IBAN:{" "}
                            <span className="font-mono">
                              EG123456789012345678901
                            </span>
                          </p>
                          <p className="text-sm">
                            اسم المستفيد: أكاديمية القاهرة للقيادة
                          </p>
                        </div>
                        <Input placeholder="رقم العملية البنكية" />
                      </div>
                    </TabsContent>
                  </Tabs>

                  {/* Terms */}
                  <div className="mt-6 p-4 border rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="terms"
                        checked={agreedToTerms}
                        onCheckedChange={(checked) =>
                          setAgreedToTerms(checked as boolean)
                        }
                      />
                      <div className="space-y-2">
                        <Label htmlFor="terms" className="font-semibold">
                          أوافق على الشروط والأحكام
                        </Label>
                        <p className="text-sm text-gray-600">
                          أوافق على جميع الشروط والأحكام الخاصة بدورة تعليم
                          القيادة، وأقر بأن جميع البيانات المقدمة صحيحة، وأتعهد
                          بالالتزام بمواعيد التدريب وقواعد الأكاديمية.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between mt-8">
                    <Button variant="outline" onClick={() => setStep(2)}>
                      رجوع
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={!agreedToTerms}>
                      <Shield className="w-4 h-4 mr-2" />
                      تأكيد الحجز والدفع
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader className="bg-gray-50">
                <CardTitle className="text-xl">ملخص الحجز</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {selectedPackageData && (
                  <>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-bold text-lg">
                          {selectedPackageData.name}
                        </h3>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-gray-600">
                            {selectedPackageData.duration}
                          </span>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-orange-600">
                              {selectedPackageData.price.toLocaleString()} ج.م
                            </div>
                            <div className="text-sm text-gray-500 line-through">
                              {selectedPackageData.originalPrice.toLocaleString()}{" "}
                              ج.م
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>عدد الساعات</span>
                          <span className="font-medium">
                            {selectedPackageData.hours} ساعة
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>ضريبة القيمة المضافة</span>
                          <span className="font-medium">14%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>رسوم التسجيل</span>
                          <span className="font-medium">200 ج.م</span>
                        </div>
                      </div>

                      <div className="flex justify-between text-lg font-bold">
                        <span>المجموع النهائي</span>
                        <span className="text-green-600">
                          {(
                            selectedPackageData.price * 1.14 +
                            200
                          ).toLocaleString()}{" "}
                          ج.م
                        </span>
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="mt-6 pt-6 border-t">
                      <h4 className="font-bold mb-3">مميزات الباقة:</h4>
                      <ul className="space-y-2">
                        {selectedPackageData.features
                          .slice(0, 3)
                          .map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </>
                )}

                {/* Security Badge */}
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <Shield className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-semibold text-green-700">
                        حجز آمن 100%
                      </p>
                      <p className="text-xs text-green-600">
                        بياناتك مشفرة ومحمية
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
