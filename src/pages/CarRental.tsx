// frontend/src/pages/services/CarRental.tsx
import { useState } from "react";
import {
  Car,
  Filter,
  MapPin,
  Calendar,
  Users,
  Fuel,
  Settings,
  Shield,
  Star,
  CreditCard,
  Phone,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
// import { DatePicker } from "@/components/ui/datepicker";
import { Slider } from "@/components/ui/slider";

export default function CarRental() {
  const [pickupLocation, setPickupLocation] = useState("");
  const [returnLocation, setReturnLocation] = useState("");
  const [pickupDate, setPickupDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [carType, setCarType] = useState("all");
  const [priceRange, setPriceRange] = useState([500, 5000]);
  const [features, setFeatures] = useState<string[]>([]);

  // بيانات شركات إيجار السيارات
  const rentalCompanies = [
    {
      id: 1,
      name: "السيارات الذهبية",
      logo: "/assets/rental-companies/golden-cars.jpg",
      rating: 4.7,
      reviews: 892,
      cars: [
        {
          id: 101,
          name: "تويوتا كورولا 2024",
          image:
            "https://tse4.mm.bing.net/th/id/OIP.g0Xl1PHjzAcjb5lCWxK5PAHaEK?rs=1&pid=ImgDetMain&o=7&rm=3",
          type: "اقتصادية",
          price: 800,
          seats: 5,
          transmission: "أوتوماتيك",
          fuel: "بنزين",
          features: ["تكييف", "بلوتوث", "كاميرا خلفية"],
        },
        {
          id: 102,
          name: "هيونداي النترا 2024",
          image:
            "https://tse4.mm.bing.net/th/id/OIP.kK7ysYzduZRPmbZ3MvCNlwHaEK?rs=1&pid=ImgDetMain&o=7&rm=3",
          type: "اقتصادية",
          price: 850,
          seats: 5,
          transmission: "أوتوماتيك",
          fuel: "بنزين",
          features: ["شاشة لمس", "ملاحة", "تحكم كروز"],
        },
      ],
      contact: "16789",
      locations: ["القاهرة", "الجيزة", "الإسكندرية"],
    },
    {
      id: 2,
      name: "دلتا للسيارات",
      logo: "/assets/rental-companies/delta-cars.jpg",
      rating: 4.8,
      reviews: 1204,
      cars: [
        {
          id: 201,
          name: "مرسيدس C200 2024",
          image:
            "https://auto.ahram.org.eg/Media/News/2024/12/17/19_2024-638700482351024473-102.jpg",
          type: "فاخرة",
          price: 2500,
          seats: 5,
          transmission: "أوتوماتيك",
          fuel: "بنزين",
          features: ["جلد", "شاشة مزدوجة", "مساعدات قيادة"],
        },
        {
          id: 202,
          name: "بي إم دبليو X5 2024",
          image:
            "https://tse3.mm.bing.net/th/id/OIP.Zu199GZHY486cgKy2rd5wgHaEK?rs=1&pid=ImgDetMain&o=7&rm=3",
          type: "دفع رباعي",
          price: 4000,
          seats: 7,
          transmission: "أوتوماتيك",
          fuel: "بنزين",
          features: ["شاشة بانوراما", "مقاعد تدفئة", "نظام صوت متميز"],
        },
      ],
      contact: "19991",
      locations: ["القاهرة", "شرم الشيخ", "الغردقة"],
    },
  ];

  const carTypes = [
    { value: "all", label: "جميع الأنواع" },
    { value: "economy", label: "اقتصادية" },
    { value: "suv", label: "دفع رباعي" },
    { value: "luxury", label: "فاخرة" },
    { value: "van", label: "عائلية" },
  ];

  const carFeatures = [
    { id: "ac", label: "تكييف" },
    { id: "bluetooth", label: "بلوتوث" },
    { id: "gps", label: "ملاحة" },
    { id: "camera", label: "كاميرا خلفية" },
    { id: "automatic", label: "أوتوماتيك" },
    { id: "leather", label: "مقاعد جلد" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-black to-gray-900 text-white">
        <div className="absolute inset-0">
          <img
            src="/assets/carRental.jpg"
            alt="Car Rental"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center">
              إيجار <span className="text-orange-500">سيارات</span> في مصر
            </h1>
            <p className="text-xl mb-8 text-gray-300 text-center">
              اختر من بين أفضل شركات إيجار السيارات، سيارات متنوعة، أسعار
              تنافسية، وحجز آمن
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="font-semibold">تصفية:</span>
            </div>

            <Select value={carType} onValueChange={setCarType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="نوع السيارة" />
              </SelectTrigger>
              <SelectContent>
                {carTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="w-64">
              <label className="block text-sm mb-2">
                نطاق السعر: {priceRange[0]} - {priceRange[1]} ج.م/يوم
              </label>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={10000}
                step={100}
                className="w-full"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm mb-2">المميزات:</label>
              <div className="flex flex-wrap gap-2">
                {carFeatures.map((feature) => (
                  <div key={feature.id} className="flex items-center gap-1">
                    <Checkbox
                      id={feature.id}
                      checked={features.includes(feature.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFeatures([...features, feature.id]);
                        } else {
                          setFeatures(features.filter((f) => f !== feature.id));
                        }
                      }}
                    />
                    <label htmlFor={feature.id} className="text-sm">
                      {feature.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rental Companies */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="space-y-8">
            {rentalCompanies.map((company) => (
              <Card key={company.id} className="border-2 shadow-lg">
                <CardHeader className="bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <img
                        src={company.logo}
                        alt={company.name}
                        className="w-16 h-16 rounded-lg"
                      />
                      <div>
                        <h2 className="text-2xl font-bold">{company.name}</h2>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                            <span className="font-bold">{company.rating}</span>
                            <span className="text-gray-500">
                              ({company.reviews})
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <span className="font-semibold">
                              {company.contact}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Badge className="bg-green-100 text-green-800">
                      <Shield className="w-3 h-3 mr-1" /> مضمون
                    </Badge>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="font-semibold">الفروع:</span>
                      {company.locations.map((loc, idx) => (
                        <Badge key={idx} variant="outline" className="mx-1">
                          {loc}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {company.cars.map((car) => (
                      <Card
                        key={car.id}
                        className="hover:shadow-md transition-shadow">
                        <div className="relative">
                          <img
                            src={car.image}
                            alt={car.name}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                          <Badge className="absolute top-2 right-2 bg-orange-500">
                            {car.price.toLocaleString()} ج.م/يوم
                          </Badge>
                        </div>

                        <CardContent className="pt-4">
                          <h3 className="text-xl font-bold mb-2">{car.name}</h3>

                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-gray-500" />
                              <span>{car.seats} مقاعد</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Settings className="w-4 h-4 text-gray-500" />
                              <span>{car.transmission}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Fuel className="w-4 h-4 text-gray-500" />
                              <span>{car.fuel}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Car className="w-4 h-4 text-gray-500" />
                              <span>{car.type}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {car.features.map((feature, idx) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="text-sm">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>

                        <CardFooter>
                          <Button className="w-full bg-orange-500 hover:bg-orange-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            احجز هذه السيارة
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Steps */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            خطوات <span className="text-orange-500">الحجز</span> البسيطة
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                icon: <Search className="w-8 h-8" />,
                title: "ابحث واختر",
                desc: "ابحث عن السيارة المثالية وأضفها للحجز",
              },
              {
                step: "2",
                icon: <CreditCard className="w-8 h-8" />,
                title: "ادفع أونلاين",
                desc: "ادفع ببطاقتك بشكل آمن ومشفر",
              },
              {
                step: "3",
                icon: <Shield className="w-8 h-8" />,
                title: "تأكيد الحجز",
                desc: "استلم تأكيد الحجز مع جميع التفاصيل",
              },
              {
                step: "4",
                icon: <Car className="w-8 h-8" />,
                title: "استلام السيارة",
                desc: "استلم سيارتك من أقرب فرع لك",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-orange-500">{item.icon}</div>
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Insurance Info */}
      <section className="py-12 border-t">
        <div className="container mx-auto px-4">
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-4">
                <Shield className="w-8 h-8 text-orange-500" />
                <h3 className="text-2xl font-bold">معلومات التأمين والحماية</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-bold mb-2">تأمين ضد التلفيات</h4>
                  <p className="text-gray-600">
                    تغطية شاملة للتلفيات العرضية مع تحمل مبلغ 2000 ج.م
                  </p>
                </div>

                <div>
                  <h4 className="font-bold mb-2">تأمين ضد الحوادث</h4>
                  <p className="text-gray-600">
                    تغطية طبية للمسافرين تصل إلى 100,000 ج.م للشخص
                  </p>
                </div>

                <div>
                  <h4 className="font-bold mb-2">مساعدات الطريق</h4>
                  <p className="text-gray-600">
                    خدمة سحب وإصلاح على الطريق متاحة 24/7
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
