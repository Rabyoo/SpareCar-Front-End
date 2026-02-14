import { FileText, BookOpen, Download, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Documentation() {
  const sections = [
    {
      title: "Traffic Laws",
      items: ["Speed Limits", "Traffic Signs", "Right of Way", "Parking Rules"],
    },
    {
      title: "Driving License",
      items: ["Requirements", "Application Process", "Tests", "Renewal"],
    },
    {
      title: "Vehicle Documents",
      items: ["Registration", "Insurance", "Inspection", "Ownership Transfer"],
    },
    {
      title: "Safety Guidelines",
      items: [
        "Defensive Driving",
        "Emergency Procedures",
        "Weather Conditions",
        "Night Driving",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Driving Documentation
          </h1>
          <p className="text-gray-600 mb-6">
            Complete guide to traffic rules and regulations
          </p>

          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input placeholder="Search documentation..." className="pl-10" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {sections.map((section, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full mt-4">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-bold mb-4">Quick Reference</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="font-bold mb-2">Emergency Numbers</div>
                <div className="text-sm text-gray-600">
                  Police: 122
                  <br />
                  Ambulance: 123
                  <br />
                  Traffic Police: 128
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="font-bold mb-2">Useful Links</div>
                <div className="text-sm space-y-1">
                  <a href="#" className="text-blue-600 hover:underline block">
                    Traffic Department
                  </a>
                  <a href="#" className="text-blue-600 hover:underline block">
                    License Services
                  </a>
                  <a href="#" className="text-blue-600 hover:underline block">
                    Fine Inquiry
                  </a>
                </div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="font-bold mb-2">Download Center</div>
                <div className="text-sm space-y-2">
                  <Button size="sm" variant="outline" className="w-full">
                    <FileText className="w-3 h-3 mr-2" />
                    Traffic Law PDF
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    <FileText className="w-3 h-3 mr-2" />
                    Sign Guide PDF
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
