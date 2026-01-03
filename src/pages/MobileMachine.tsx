import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Wrench, MapPin, Clock, Shield } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen mt-20 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Mobile Maintenance Service
          </h1>
          <p className="text-xl text-gray-600">
            We fix your car anywhere, anytime
          </p>
        </div>

        {/* Main CTA Button */}
        <div className="flex justify-center mb-16">
          <Button
            onClick={() => navigate("/request")}
            size="lg"
            className="text-2xl py-8 px-12 bg-slate-700 hover:bg-slate-800 shadow-xl transform hover:scale-105 transition-all duration-200">
            <Wrench className="mr-3 h-8 w-8" />
            Request Mobile Mechanic Now
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow border-slate-200">
            <CardHeader>
              <div className="mx-auto bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Wrench className="h-8 w-8 text-slate-700" />
              </div>
              <CardTitle>Professional Service</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Certified and highly experienced technicians
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow border-slate-200">
            <CardHeader>
              <div className="mx-auto bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <MapPin className="h-8 w-8 text-slate-700" />
              </div>
              <CardTitle>Live Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Track technician location on the map in real-time
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow border-slate-200">
            <CardHeader>
              <div className="mx-auto bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-slate-700" />
              </div>
              <CardTitle>Fast Arrival</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                We arrive in less than 30 minutes
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow border-slate-200">
            <CardHeader>
              <div className="mx-auto bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-slate-700" />
              </div>
              <CardTitle>Quality Guarantee</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Warranty on all maintenance work
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* How it Works */}
        <div className="bg-white rounded-lg shadow-lg p-8 border border-slate-200">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            How Does It Work?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-slate-700 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold text-lg mb-2">Request Service</h3>
              <p className="text-gray-600">
                Specify your car type, problem, and location
              </p>
            </div>
            <div className="text-center">
              <div className="bg-slate-700 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold text-lg mb-2">Track Technician</h3>
              <p className="text-gray-600">
                Watch the technician on their way to you
              </p>
            </div>
            <div className="text-center">
              <div className="bg-slate-700 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold text-lg mb-2">Get Repaired</h3>
              <p className="text-gray-600">
                Your car gets fixed at your location
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
