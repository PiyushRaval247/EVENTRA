import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const systemPrompt = `You are an event planning assistant. Generate event details based on the user's description.

CRITICAL: Return ONLY valid JSON with properly escaped strings. No newlines in string values - use spaces instead.

Return this exact JSON structure:
{
  "title": "Event title (catchy and professional, single line)",
  "description": "Detailed event description in a single paragraph. Use spaces instead of line breaks. Make it 2-3 sentences describing what attendees will learn and experience.",
  "category": "One of: tech, music, sports, art, food, business, health, education, gaming, networking, outdoor, community",
  "suggestedCapacity": 50,
  "suggestedTicketType": "free"
}

User's event idea: ${prompt}

Rules:
- Return ONLY the JSON object, no markdown, no explanation
- All string values must be on a single line with no line breaks
- Use spaces instead of \\n or line breaks in description
- Make title catchy and under 80 characters
- Description should be 2-3 sentences, informative, single paragraph
- suggestedTicketType should be either "free" or "paid"
`;

    const result = await model.generateContent(systemPrompt);

    const response = await result.response;
    const text = response.text();

    // Clean the response (remove markdown code blocks if present)
    let cleanedText = text.trim();
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "");
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/```\n?/g, "");
    }

    console.log(cleanedText);

    const eventData = JSON.parse(cleanedText);

    return NextResponse.json(eventData);
  } catch (error) {
    console.error("Error generating event:", error);
    
    // Check for rate limit error (status 429)
    const isRateLimit = 
      error.status === 429 || 
      error.response?.status === 429 || 
      error.message?.includes("429") ||
      error.message?.toLowerCase().includes("too many requests") ||
      error.message?.toLowerCase().includes("quota");

    if (isRateLimit) {
      return NextResponse.json(
        { 
          error: "AI Rate Limit Exceeded", 
          details: "You've made too many requests recently. Please wait about 60 seconds before trying again. (Free tier limit: 5 requests per minute)" 
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate event: " + (error.message || "Unknown error") },
      { status: 500 }
    );
  }
}
