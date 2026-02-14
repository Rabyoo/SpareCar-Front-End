import { Shield, CheckCircle, AlertCircle, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RentalInsurance() {
  const coverages = [
    {
      type: "Collision Damage Waiver",
      covered: ["Accidental damage", "Theft", "Vandalism"],
      notCovered: ["Intentional damage", "Drunk driving", "Off-road use"],
      deductible: "$2000",
    },
    {
      type: "Personal Accident Insurance",
      covered: ["Medical expenses", "Accidental death", "Permanent disability"],
      notCovered: ["Pre-existing conditions", "Sports injuries"],
      limit: "$100,000 per person",
    },
    {
      type: "Third Party Liability",
      covered: ["Damage to others' property", "Injury to other people"],
      limit: "$1,000,000",
      notes: "Mandatory by law",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Shield className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Rental Car Insurance
          </h1>
          <p className="text-gray-600">
            Complete protection for your rental journey
          </p>
        </div>

        <div className="space-y-6 mb-8">
          {coverages.map((coverage, index) => (
            <Card key={index}>
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                <CardTitle className="text-xl">{coverage.type}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="font-bold mb-3 flex items-center gap-2 text-green-700">
                      <CheckCircle className="w-5 h-5" />
                      What's Covered
                    </div>
                    <ul className="space-y-2">
                      {coverage.covered.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="font-bold mb-3 flex items-center gap-2 text-red-700">
                      <AlertCircle className="w-5 h-5" />
                      What's Not Covered
                    </div>
                    <ul className="space-y-2">
                      {coverage.notCovered.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {coverage.deductible && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="font-bold">
                      Deductible: {coverage.deductible}
                    </div>
                    <div className="text-sm text-gray-600">
                      Amount you pay in case of claim
                    </div>
                  </div>
                )}

                {coverage.limit && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <div className="font-bold">
                      Coverage Limit: {coverage.limit}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Important Notes</h3>
              <div className="space-y-2 text-gray-600">
                <div className="flex items-start gap-2">
                  <FileText className="w-5 h-5 text-orange-500 mt-0.5" />
                  <span>
                    Insurance is valid only when driving in allowed areas
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <FileText className="w-5 h-5 text-orange-500 mt-0.5" />
                  <span>
                    Report any accident within 24 hours to police and rental
                    company
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <FileText className="w-5 h-5 text-orange-500 mt-0.5" />
                  <span>
                    Additional drivers must be registered and approved
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <FileText className="w-5 h-5 text-orange-500 mt-0.5" />
                  <span>Keep all documents in the car at all times</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
