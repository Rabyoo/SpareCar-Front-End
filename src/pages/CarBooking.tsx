import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Car,
  Calendar,
  Clock,
  CreditCard,
  Shield,
  User,
  Phone,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function CarBooking() {
  const { carId } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    license: "",
  });

  const carData = {
    id: carId || "1",
    name: "Toyota Corolla 2024",
    price: 800,
    type: "Economy",
    seats: 5,
    image: "/assets/cars/toyota-corolla.jpg",
  };

  const handleSubmit = () => {
    const bookingId = `CAR-${Date.now().toString().slice(-6)}`;
    console.log("Booking created:", { carId, bookingId, formData });
    navigate(`/car-rental/confirmation?booking=${bookingId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/car-rental")}
            className="mb-4">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Cars
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Book Car Rental
              </h1>
              <p className="text-gray-600">
                Complete your booking in 3 simple steps
              </p>
            </div>
            <div className="text-orange-600 font-bold text-xl">
              Booking: CAR-{Date.now().toString().slice(-6)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Full Name *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Phone Number *</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Driver License Number *</Label>
                    <Input
                      value={formData.license}
                      onChange={(e) =>
                        setFormData({ ...formData, license: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button
                      variant="outline"
                      onClick={() => navigate("/car-rental")}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => setStep(2)}
                      className="bg-orange-500 hover:bg-orange-600">
                      Next: Payment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <CreditCard className="w-5 h-5" />
                        <span className="font-semibold">Credit Card</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="Card Number" />
                        <Input placeholder="Expiry Date" />
                        <Input placeholder="CVV" />
                        <Input placeholder="Cardholder Name" />
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setStep(1)}>
                        Back
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        className="bg-green-600 hover:bg-green-700">
                        <Shield className="w-4 h-4 mr-2" />
                        Confirm Booking
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <Card className="sticky top-8">
              <CardHeader className="bg-gray-50">
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Car className="w-8 h-8 text-blue-500" />
                    <div>
                      <div className="font-bold">{carData.name}</div>
                      <div className="text-sm text-gray-500">
                        {carData.type} • {carData.seats} seats
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between">
                      <span>Daily Rate</span>
                      <span className="font-bold">${carData.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Insurance</span>
                      <span>$30/day</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (14%)</span>
                      <span>${(carData.price * 0.14).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-green-600">
                        $
                        {(carData.price + 30 + carData.price * 0.14).toFixed(2)}
                        /day
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <Shield className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm font-semibold">Secure Booking</p>
                        <p className="text-xs text-green-600">100% protected</p>
                      </div>
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
