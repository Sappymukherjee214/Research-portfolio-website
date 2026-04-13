import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { expertise, researchStatement } from "@/lib/data";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key not configured." }, { status: 500 });
    }

    const body = await req.json();
    const { profile } = body;

    if (!profile) {
      return NextResponse.json({ error: "Profile description is required." }, { status: 400 });
    }

    const systemInstruction = `You are a Collaboration Matcher AI for Saptarshi Mukherjee's research portfolio.
Saptarshi's Research Statement: ${researchStatement}
Saptarshi's Expertise: ${expertise.join(", ")}

The user will provide you with their background or project idea. 
Calculate a "Synergy Score" (0-100%) based on how well it aligns with Saptarshi's robust computer vision / multimodal AI / deep learning background.

YOU MUST ONLY OUTPUT RAW JSON:
{
  "score": 85,
  "reason": "Detailed explanation here."
}`;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: systemInstruction
    });

    const result = await model.generateContent(profile);
    const response = await result.response;
    let text = response.text();

    // Clean up potential markdown formatting from AI output
    text = text.replace(/```json|```/gi, "").trim();

    try {
      const parsed = JSON.parse(text);
      return NextResponse.json(parsed);
    } catch {
      return NextResponse.json({
        score: 50,
        reason: "Alignment detected, but structured parsing failed."
      });
    }

  } catch (err: any) {
    console.error("Error in /api/match:", err);
    return NextResponse.json({ error: `Gemini Error: ${err.message || "Unknown error"}` }, { status: 500 });
  }
}
