import { NextResponse } from "next/server";

// Fallback Mock Library for reliability
const MOCK_TEMPLATES = {
  tech: [
    { title: "Future Tech Summit 2026", description: "Explore the cutting edge of AI, robotics, and quantum computing with industry leaders and hands-on workshops." },
    { title: "Next-Gen Web Workshop", description: "Master the latest framework architectures and performance optimization techniques in this intensive full-day session." }
  ],
  music: [
    { title: "Neon Nights Music Festival", description: "An immersive audio-visual experience featuring the world's best electronic artists and stunning laser displays." },
    { title: "Jazz & Soul Evening", description: "A sophisticated night of smooth rhythms and soulful performances in an intimate, upscale setting." }
  ],
  business: [
    { title: "Elite Leadership Masterclass", description: "Strategic insights for modern executives. Learn high-performance team management and global scaling strategies." },
    { title: "The Startup Launchpad", description: "Pitch your ideas to top VCs and learn the essential steps to securing your first round of funding." }
  ]
};

const CATEGORIES = ["tech", "music", "sports", "art", "food", "business", "health", "education", "gaming", "networking", "outdoor", "community"];

export async function POST(req) {
  const { prompt } = await req.json();

  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  const lowerPrompt = prompt.toLowerCase();
  let category = CATEGORIES.find(cat => lowerPrompt.includes(cat)) || "community";

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY is missing. Using Fallback Templates.");
    return handleFallback(prompt, category);
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`;
    
    const systemPrompt = `You are a professional event organizer. Based on the user's prompt, generate a detailed event object in JSON format.
Requirements:
1. Title: Compelling and professional.
2. Description: A comprehensive, high-quality, and persuasive description (at least 200 words). It should include multiple paragraphs covering the event overview, what attendees will learn or experience, why it's a must-attend, and who the target audience is. Make it sound professional, highly detailed, and extremely enticing.
3. Category: Choose from [${CATEGORIES.join(", ")}].
4. SuggestedCapacity: A realistic number of attendees (number).
5. SuggestedTicketType: either "free" or "paid".

Return ONLY valid JSON. Do not include markdown formatting like \`\`\`json.`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Gemini API Error Detail:", errorData);
      throw new Error(`Gemini API error: ${response.status} ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    let result = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!result) {
      throw new Error("No text returned from Gemini API");
    }

    // Sometimes AI adds quotes or markdown block, let's strip them
    result = result.replace(/^```json|```$/gi, '').trim();

    const eventData = JSON.parse(result);
    console.log("Gemini Result:", eventData);
    return NextResponse.json(eventData);

  } catch (aiError) {
    console.error("Gemini API Error, falling back to Mock:", aiError);
    return handleFallback(prompt, category);
  }
}

// Helper function for Fallback
function handleFallback(prompt, category) {
  const templates = MOCK_TEMPLATES[category] || MOCK_TEMPLATES["business"];
  const randomTemplate = templates[Math.floor(Math.random() * templates.length)];

  return NextResponse.json({
    title: prompt.length < 30 ? `${prompt.charAt(0).toUpperCase() + prompt.slice(1)} Masterclass` : randomTemplate.title,
    description: randomTemplate.description + " (Generated via Fallback System)",
    category: category,
    suggestedCapacity: Math.floor(Math.random() * 150) + 50,
    suggestedTicketType: "free"
  });
}
