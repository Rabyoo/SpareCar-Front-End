import { useState } from "react";
import { Star, MapPin, Phone, Shield, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function DrivingSchools() {
  const [search, setSearch] = useState("");

  const schools = [
    {
      id: 1,
      name: "أكاديمية القاهرة الدولية",
      rating: 4.8,
      reviews: 1247,
      location: "القاهرة - مصر الجديدة",
      phone: "01012345678",
      certified: true,
      price: 3500,
    },
    {
      id: 2,
      name: "مركز الجيزة المتقدم",
      rating: 4.6,
      reviews: 892,
      location: "الجيزة - الدقي",
      phone: "01087654321",
      certified: true,
      price: 3200,
    },
    {
      id: 3,
      name: "أكاديمية الأسكندرية",
      rating: 4.7,
      reviews: 1103,
      location: "الإسكندرية - سيدي جابر",
      phone: "01055554444",
      certified: true,
      price: 3300,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            أكاديميات تعليم القيادة
          </h1>
          <p className="text-gray-600 mb-4">
            اختر من أفضل الأكاديميات المعتمدة
          </p>

          <div className="flex gap-3">
            <Input
              placeholder="ابحث عن أكاديمية..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            />
            <Button>بحث</Button>
          </div>
        </div>

        <div className="space-y-6">
          {schools.map((school) => (
            <Card key={school.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/4">
                    <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg p-6 text-center">
                      <div className="text-3xl font-bold text-orange-600 mb-2">
                        {school.price.toLocaleString()}
                      </div>
                      <div className="text-gray-600">ج.م</div>
                    </div>
                  </div>

                  <div className="md:w-3/4">
                    <div className="flex justify-between items-start mb-3">
                      <CardTitle className="text-xl">{school.name}</CardTitle>
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        <span className="font-bold">{school.rating}</span>
                        <span className="text-gray-500">
                          ({school.reviews})
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {school.location}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        {school.phone}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button className="bg-orange-500 hover:bg-orange-600">
                        احجز الآن
                      </Button>
                      <Button variant="outline">التفاصيل</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
