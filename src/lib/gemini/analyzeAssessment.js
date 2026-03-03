import { GoogleGenerativeAI} from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function analyzeAssessment(assessment) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  // Use the configuration object to enforce JSON mode
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

const prompt = `Analyze this candidate's assessment and return STRICT JSON:

{
  "employabilityIndex": number,
  "aptitudeScore": number,
  "criticalSkillGaps": ["gap1","gap2","gap3","gap4","gap5"],
  "nextBestActions": ["action1","action2","action3","action4","action5"],
  "readinessBreakdown": {
    "skills": number,
    "aptitude": number,
    "experience": number,
    "consistency": number
  }
}

Rules:
- Only return JSON
- No markdown
- No explanation

Data: ${JSON.stringify(assessment)}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Safety check: LLMs can occasionally return empty strings or hallucinate text
    if (!text) throw new Error("Empty response from Gemini");

    return JSON.parse(text);
  } catch (error) {
    console.error("[analyzeAssessment] Gemini error:", error.message);
    // Provide a fallback or re-throw
    throw new Error(`Failed to analyze assessment: ${error.message}`);
  }
}
