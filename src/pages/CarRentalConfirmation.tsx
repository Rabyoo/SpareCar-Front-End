import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Download,
  Home,
  Car,
  Calendar,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CarRentalConfirmation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    const bookingId = searchParams.get("booking");
    const mockBooking = {
      id: bookingId || `CAR-${Date.now().toString().slice(-6)}`,
      car: "Toyota Corolla 2024",
      price: "$850",
      period: "3 days",
      date: new Date().toLocaleDateString(),
      location: "Cairo Airport",
      contact: "+20 100 123 4567",
    };
    setBooking(mockBooking);
  }, [searchParams]);

  if (!booking) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Booking Confirmed! 🎉
          </h1>
          <p className="text-gray-600">Your car rental is confirmed</p>
        </div>

        <Card className="mb-6">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
            <CardTitle className="flex justify-between">
              <span>Booking ID: {booking.id}</span>
              <span className="text-green-600">✅ Confirmed</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Car className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500">Car</div>
                  <div className="font-semibold">{booking.car}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500">Rental Period</div>
                  <div className="font-semibold">{booking.period}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500">Pickup Location</div>
                  <div className="font-semibold">{booking.location}</div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-blue-600">{booking.price}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 mb-8">
          <h3 className="font-bold text-lg">Next Steps:</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Pickup confirmation within 2 hours</li>
            <li>Bring your ID and driver license</li>
            <li>Inspect the car before leaving</li>
            <li>Keep booking ID for support</li>
          </ol>
        </div>

        <div className="flex gap-3">
          <Button className="flex-1" onClick={() => navigate("/car-rental")}>
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/profile")}
            className="flex-1">
            Track Booking
          </Button>
        </div>
      </div>
    </div>
  );
}
