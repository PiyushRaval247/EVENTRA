import { NextResponse } from "next/server";

// Smart Mock AI Library for 100% Reliable Demos
const MOCK_TEMPLATES = {
  tech: [
    { title: "Future Tech Summit 2026", description: "Explore the cutting edge of AI, robotics, and quantum computing with industry leaders and hands-on workshops." },
    { title: "Next-Gen Web Workshop", description: "Master the latest framework architectures and performance optimization techniques in this intensive full-day session." }
  ],
  music: [
    { title: "Neon Nights Music Festival", description: "An immersive audio-visual experience featuring the world's best electronic artists and stunning laser displays." },
    { title: "Jazz & Soul Evening", description: "A sophisticated night of smooth rhythms and soulful performances in an intimate, upscale setting." }
  ],
  food: [
    { title: "Gourmet Flavors Expo", description: "Taste your way through global cuisines prepared by award-winning chefs. Features live cooking demos and wine pairings." },
    { title: "Farm to Table Experience", description: "Discover the journey of organic produce through a curated 5-course dinner hosted at our local sustainable gardens." }
  ],
  business: [
    { title: "Elite Leadership Masterclass", description: "Strategic insights for modern executives. Learn high-performance team management and global scaling strategies." },
    { title: "The Startup Launchpad", description: "Pitch your ideas to top VCs and learn the essential steps to securing your first round of funding." }
  ],
  health: [
    { title: "Holistic Wellness Retreat", description: "Rejuvenate your mind and body with yoga, meditation, and nutritional workshops led by certified practitioners." },
    { title: "Peak Performance Seminar", description: "Science-backed strategies to optimize your physical and mental health for maximum daily productivity." }
  ]
};

const CATEGORIES = ["tech", "music", "sports", "art", "food", "business", "health", "education", "gaming", "networking", "outdoor", "community"];

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const lowerPrompt = prompt.toLowerCase();
    
    // Find matching category
    let category = CATEGORIES.find(cat => lowerPrompt.includes(cat)) || "community";
    
    // Select template or generate from keywords
    const templates = MOCK_TEMPLATES[category] || MOCK_TEMPLATES["business"];
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];

    // Simulate AI "thinking" for a better demo feel
    await new Promise(resolve => setTimeout(resolve, 800));

    const eventData = {
      title: lowerPrompt.length < 30 ? `${prompt.charAt(0).toUpperCase() + prompt.slice(1)} Masterclass` : randomTemplate.title,
      description: randomTemplate.description,
      category: category,
      suggestedCapacity: Math.floor(Math.random() * (200 - 30 + 1)) + 30,
      suggestedTicketType: Math.random() > 0.5 ? "free" : "paid"
    };

    console.log("Mock AI Result:", eventData);

    return NextResponse.json(eventData);
  } catch (error) {
    console.error("Error in Mock AI:", error);
    return NextResponse.json({ error: "System error" }, { status: 500 });
  }
}
