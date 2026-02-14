import { useState } from "react";
import {
  FileText,
  AlertTriangle,
  Shield,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TrafficRules() {
  const rules = {
    speed: [
      { zone: "الطرق السريعة", limit: "90-120 كم/س" },
      { zone: "الطرق الرئيسية", limit: "80 كم/س" },
      { zone: "داخل المدن", limit: "50-60 كم/س" },
      { zone: "المدارس والمستشفيات", limit: "30 كم/س" },
    ],
    documents: [
      "رخصة قيادة سارية",
      "هوية شخصية",
      "تأمين المركبة",
      "ترخيص السيارة",
      "شهادة الفحص الدوري",
    ],
    penalties: [
      { violation: "التحدث بالهاتف أثناء القيادة", fine: "1500 ج.م" },
      { violation: "عدم ربط حزام الأمان", fine: "500 ج.م" },
      { violation: "السرعة الزائدة", fine: "300-3000 ج.م" },
      { violation: "تجاوز الإشارة الحمراء", fine: "1000 ج.م" },
      { violation: "القيادة بدون رخصة", fine: "5000 ج.م" },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <FileText className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            قواعد وإشارات المرور في مصر
          </h1>
          <p className="text-gray-600">دليل شامل لقوانين القيادة الآمنة</p>
        </div>

        <Tabs defaultValue="rules" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="rules">القواعد الأساسية</TabsTrigger>
            <TabsTrigger value="signals">الإشارات المرورية</TabsTrigger>
            <TabsTrigger value="penalties">المخالفات والعقوبات</TabsTrigger>
          </TabsList>

          <TabsContent value="rules" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  حدود السرعة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rules.speed.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span>{item.zone}</span>
                      <span className="font-bold text-orange-600">
                        {item.limit}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  المستندات المطلوبة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {rules.documents.map((doc, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      {doc}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signals">
            <Card>
              <CardContent className="pt-6">
                <img
                  src="/assets/traffic-signs.jpg"
                  alt="Traffic Signs"
                  className="w-full rounded-lg mb-4"
                />
                <div className="text-center">
                  <a
                    href="/assets/traffic-signs.pdf"
                    className="text-orange-600 hover:underline">
                    📥 تحميل كتيب الإشارات المرورية
                  </a>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="penalties">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  المخالفات والعقوبات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {rules.penalties.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between p-3 border-b">
                      <span>{item.violation}</span>
                      <span className="font-bold text-red-600">
                        {item.fine}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
