import { ClipboardCheck, Clock, AlertCircle, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DrivingExams() {
  const exams = [
    {
      stage: "Theoretical Exam",
      questions: 40,
      passing: 32,
      duration: "45 minutes",
      topics: ["Traffic Signs", "Road Rules", "Safety Regulations"],
    },
    {
      stage: "Medical Check",
      items: ["Vision Test", "Hearing Test", "General Health"],
      duration: "30 minutes",
      notes: "Must be completed at approved medical centers",
    },
    {
      stage: "Practical Test - Yard",
      skills: ["Parallel Parking", "Slope Start", "Reversing", "Figure 8"],
      duration: "20 minutes",
      passing: "All maneuvers must be completed correctly",
    },
    {
      stage: "Practical Test - Road",
      skills: [
        "Traffic Navigation",
        "Lane Changes",
        "Intersections",
        "Parking",
      ],
      duration: "30 minutes",
      passing: "No major violations",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <ClipboardCheck className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Driving License Exams
          </h1>
          <p className="text-gray-600">
            Complete guide to driving tests and requirements
          </p>
        </div>

        <div className="space-y-6">
          {exams.map((exam, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  {exam.stage}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      Duration: {exam.duration}
                    </div>
                    {exam.questions && (
                      <div className="text-sm">
                        <div className="font-medium">
                          Questions: {exam.questions}
                        </div>
                        <div className="text-green-600">
                          Passing: {exam.passing}+ correct
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    {exam.topics && (
                      <div>
                        <div className="font-medium mb-2">Topics:</div>
                        <div className="flex flex-wrap gap-2">
                          {exam.topics.map((topic, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {exam.skills && (
                      <div>
                        <div className="font-medium mb-2">Skills Tested:</div>
                        <div className="flex flex-wrap gap-2">
                          {exam.skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {exam.notes && (
                      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center gap-2 text-yellow-800">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {exam.notes}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-orange-500" />
              <div>
                <div className="font-bold">Tips for Success</div>
                <div className="text-sm text-gray-600">
                  • Practice with official question banks
                  <br />
                  • Take mock tests before the real exam
                  <br />
                  • Arrive early with all required documents
                  <br />• Stay calm and read questions carefully
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
