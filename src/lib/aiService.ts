// frontend/src/lib/aiService.ts
const API_BASE_URL = import.meta.env.BACKEND_URL || "http://localhost:5000";
const GROQ_API_KEY = import.meta.env.GROQ_API_KEY;

export const analyzeCarProblem = async (message: string) => {
  if (!message) message = "تم رفع صورة للتحليل";

  const response = await fetch("http://localhost:5000/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({ message }),
  });

  const data = await response.json();
  return data;
};

