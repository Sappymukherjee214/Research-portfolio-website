import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { expertise, researchStatement } from "@/lib/data";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Helper for retries
async function generateWithRetry(model: any, prompt: string, retries = 3, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      const isStatus503 = error.message?.includes("503") || error.message?.includes("Service Unavailable");
      if (isStatus503 && i < retries - 1) {
        await new Promise(res => setTimeout(res, delay));
        delay *= 2;
        continue;
      }
      throw error;
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key not configured." }, { status: 500 });
    }

    const body = await req.json();
    const { profile } = body;

    const systemInstruction = `You are a Collaboration Matcher AI for Saptarshi Mukherjee's research portfolio.
Statement: ${researchStatement}
Expertise: ${expertise.join(", ")}

Output strictly JSON:
{
  "score": number,
  "reason": "string"
}`;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: systemInstruction
    });

    let text = await generateWithRetry(model, profile);
    text = text.replace(/```json|```/gi, "").trim();

    try {
      const parsed = JSON.parse(text);
      return NextResponse.json(parsed);
    } catch {
      return NextResponse.json({ score: 50, reason: "Synergy detected." });
    }

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Gemini Error: ${msg}` }, { status: 500 });
  }
}
