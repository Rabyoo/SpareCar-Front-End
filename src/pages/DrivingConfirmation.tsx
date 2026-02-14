import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Download,
  Printer,
  Share2,
  Home,
  Car,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DrivingConfirmation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState<any>(null);

  useEffect(() => {
    const bookingId = searchParams.get("booking");

    // Mock booking data
    const mockBooking = {
      id: bookingId || `DRV-${Date.now().toString().slice(-6)}`,
      name: "أحمد محمد",
      school: "أكاديمية القاهرة الدولية",
      package: "الباقة المتميزة",
      price: "4,500",
      date: new Date().toLocaleDateString("ar-EG"),
      time: "9:00 صباحاً",
      duration: "40 ساعة",
      location: "القاهرة - مصر الجديدة",
      phone: "01012345678",
    };

    setBookingData(mockBooking);
  }, [searchParams]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const content = `
      Booking Confirmation
      --------------------
      Booking ID: ${bookingData?.id}
      Name: ${bookingData?.name}
      School: ${bookingData?.school}
      Package: ${bookingData?.package}
      Price: ${bookingData?.price} EGP
      Date: ${bookingData?.date}
      Time: ${bookingData?.time}
    `;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `booking-${bookingData?.id}.txt`;
    a.click();
  };

  if (!bookingData) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            تم تأكيد حجزك بنجاح! 🎉
          </h1>
          <p className="text-gray-600">
            تم تأكيد حجزك وسيتم التواصل معك خلال 24 ساعة
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100">
            <CardTitle className="flex justify-between items-center">
              <span>رقم الحجز: {bookingData.id}</span>
              <span className="text-green-600">✅ مؤكد</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500">الاسم</div>
                  <div className="font-semibold">{bookingData.name}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Car className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500">الأكاديمية</div>
                  <div className="font-semibold">{bookingData.school}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500">التاريخ والوقت</div>
                  <div className="font-semibold">
                    {bookingData.date} - {bookingData.time}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500">المدة</div>
                  <div className="font-semibold">{bookingData.duration}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500">الموقع</div>
                  <div className="font-semibold">{bookingData.location}</div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">المجموع</span>
                  <span className="text-2xl font-bold text-orange-600">
                    {bookingData.price} ج.م
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3 mb-8">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            طباعة
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            تحميل
          </Button>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-lg">الخطوات التالية:</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>سيتصل بك منسق الأكاديمية خلال 24 ساعة</li>
            <li>ستحدد موعد بدء التدريب</li>
            <li>تأكد من إحضار المستندات المطلوبة</li>
            <li>احتفظ برقم الحجز للاستفسارات</li>
          </ol>
        </div>

        <div className="mt-8 flex gap-3">
          <Button className="flex-1" onClick={() => navigate("/learn-driving")}>
            <Home className="w-4 h-4 mr-2" />
            العودة للرئيسية
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/profile")}
            className="flex-1">
            متابعة الحجز
          </Button>
        </div>
      </div>
    </div>
  );
}
