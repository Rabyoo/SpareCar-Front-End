// frontend/src/pages/services/LearnDriving.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Car,
  Shield,
  Star,
  Clock,
  MapPin,
  Users,
  Award,
  CheckCircle,
  Phone,
  Calendar,
  CreditCard,
  Filter,
  Search,
  ChevronRight,
  Download,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
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
import { Progress } from "@/components/ui/progress";

export default function LearnDriving() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");

  // Driving schools data
  const drivingSchools = [
    {
      id: 1,
      name: "Cairo Driving Academy",
      logo: "/assets/driving-schools/cairo-academy.jpg",
      rating: 4.8,
      reviews: 1247,
      price: 3500,
      duration: "30 hours",
      location: "Cairo - Heliopolis",
      features: [
        "Practical Training",
        "Complete Theory",
        "Modern Cars",
        "Certified Instructors",
      ],
      certified: true,
      successRate: 95,
      availableSlots: 15,
      contact: "01001234567",
    },
    {
      id: 2,
      name: "Giza Advanced Driving Center",
      logo: "/assets/driving-schools/giza-center.jpg",
      rating: 4.6,
      reviews: 892,
      price: 3200,
      duration: "28 hours",
      location: "Giza - Dokki",
      features: [
        "Driving Simulation",
        "Night Training",
        "Student Insurance",
        "Certified Certificate",
      ],
      certified: true,
      successRate: 92,
      availableSlots: 8,
      contact: "01001234568",
    },
    {
      id: 3,
      name: "Alexandria Driving Academy",
      logo: "/assets/driving-schools/alexandria-academy.jpg",
      rating: 4.7,
      reviews: 1103,
      price: 3300,
      duration: "32 hours",
      location: "Alexandria - Sidi Gaber",
      features: [
        "Coastal Training",
        "Automatic Vehicles",
        "Emergency Training",
        "Post-Graduation Follow-up",
      ],
      certified: true,
      successRate: 94,
      availableSlots: 12,
      contact: "01001234569",
    },
    {
      id: 4,
      name: "Cairo International Driving Center",
      logo: "/assets/driving-schools/cairo-international.jpg",
      rating: 4.9,
      reviews: 2105,
      price: 4500,
      duration: "40 hours",
      location: "Cairo - Nasr City",
      features: [
        "VIP Training",
        "Luxury Cars",
        "Advanced Simulation",
        "International Certificate",
      ],
      certified: true,
      successRate: 98,
      availableSlots: 5,
      contact: "01001234570",
    },
  ];

  const cities = [
    { value: "all", label: "All Governorates" },
    { value: "cairo", label: "Cairo" },
    { value: "giza", label: "Giza" },
    { value: "alexandria", label: "Alexandria" },
    { value: "sharqia", label: "Sharqia" },
    { value: "daqahlia", label: "Daqahlia" },
  ];

  const priceRanges = [
    { value: "all", label: "All Prices" },
    { value: "budget", label: "Budget (Less than 3000)" },
    { value: "standard", label: "Standard (3000 - 4000)" },
    { value: "premium", label: "Premium (More than 4000)" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 text-white overflow-hidden">
        <img
          src="/assets/learn-driving.avif"
          alt="Learn Driving Hero"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="absolute inset-0 bg-black/50 z-[1]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Learn <span className="text-orange-500">Driving</span> from Zero
              to Professional
            </h1>
            <p className="text-xl mb-8 text-gray-300">
              Choose the best driving academies in Egypt, certified instructors,
              modern cars, and guarantee your success in the test
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6 bg-white rounded-xl shadow-lg border">
              <Shield className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Certified Instructors</h3>
              <p className="text-gray-600">
                Qualified and licensed instructors from official authorities
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-lg border">
              <Award className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Certified Certificates</h3>
              <p className="text-gray-600">
                Locally and internationally recognized certificates
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-lg border">
              <CheckCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Success Guarantee</h3>
              <p className="text-gray-600">Success rate up to 98% in exams</p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Input
                  placeholder="Search for academy..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>

              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose Governorate" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.value} value={city.value}>
                      {city.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedPriceRange}
                onValueChange={setSelectedPriceRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  {priceRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedRating} onValueChange={setSelectedRating}>
                <SelectTrigger>
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="4.5+">4.5+ ⭐</SelectItem>
                  <SelectItem value="4+">4+ ⭐</SelectItem>
                  <SelectItem value="3.5+">3.5+ ⭐</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Driving Schools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drivingSchools.map((school) => (
              <Card
                key={school.id}
                className="hover:shadow-xl transition-shadow duration-300 border-2">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl font-bold">
                        {school.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">{school.location}</span>
                      </div>
                    </div>
                    {school.certified && (
                      <Badge className="bg-green-100 text-green-800">
                        <Shield className="w-3 h-3 mr-1" /> Certified
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <span className="font-bold">{school.rating}</span>
                      <span className="text-gray-500">
                        ({school.reviews} reviews)
                      </span>
                    </div>
                    <div className="text-orange-600 font-bold text-xl">
                      {school.price.toLocaleString()} EGP
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>Duration: {school.duration}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span>{school.availableSlots} seats available</span>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Success Rate</span>
                        <span>{school.successRate}%</span>
                      </div>
                      <Progress value={school.successRate} className="h-2" />
                    </div>

                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Features:</h4>
                      <div className="flex flex-wrap gap-2">
                        {school.features.map((feature, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-sm">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex gap-3 pt-4 border-t">
                  <Button className="flex-1 bg-orange-500 hover:bg-orange-600">
                    <Phone className="w-4 h-4 mr-2" />
                    Contact: {school.contact}
                  </Button>
                  <Link
                    to={`/learn-driving/book/${school.id}`}
                    className="flex-1">
                    <Button variant="outline" className="w-full">
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Now
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <BookOpen className="inline w-8 h-8 mr-2 text-orange-500" />
              Driving Rules and Guidelines in Egypt
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Learn about all traffic laws and guidelines for safe and
              successful driving
            </p>
          </div>

          <Tabs defaultValue="rules" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="rules">Basic Rules</TabsTrigger>
              <TabsTrigger value="signs">Traffic Signs</TabsTrigger>
              <TabsTrigger value="exams">Exams</TabsTrigger>
            </TabsList>

            <TabsContent value="rules" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Allowed Driving Speed",
                    content: "Highways: 90-120 km/h, Within cities: 50-60 km/h",
                  },
                  {
                    title: "Required Driving Documents",
                    content:
                      "Valid driving license, personal ID, vehicle insurance",
                  },
                  {
                    title: "Safety Rules",
                    content: "Seatbelt mandatory, no phone use while driving",
                  },
                  {
                    title: "Alcohol Limits",
                    content:
                      "Absolute zero - no alcohol allowed before driving",
                  },
                ].map((item, idx) => (
                  <Card key={idx}>
                    <CardHeader>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{item.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="signs">
              <div className="text-center">
                <img
                  src="/assets/traffic-signs.jpg"
                  alt="Traffic signs in Egypt"
                  className="rounded-lg shadow-lg mx-auto mb-6"
                />
                <Button>
                  <Download className="mr-2" /> Download Traffic Signs Booklet
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="exams">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-4">
                    Driving Test Stages
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        step: "1",
                        title: "Theory Exam",
                        desc: "40 questions - must answer 32 correctly",
                      },
                      {
                        step: "2",
                        title: "Medical Examination",
                        desc: "Vision, hearing, and general health checkup",
                      },
                      {
                        step: "3",
                        title: "Driving in the Yard",
                        desc: "Basic maneuvers and parallel parking",
                      },
                      {
                        step: "4",
                        title: "Road Driving",
                        desc: "Actual street driving with the examiner",
                      },
                    ].map((exam) => (
                      <div
                        key={exam.step}
                        className="flex gap-4 p-4 border rounded-lg">
                        <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                          {exam.step}
                        </div>
                        <div>
                          <h4 className="font-bold">{exam.title}</h4>
                          <p className="text-gray-600">{exam.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
