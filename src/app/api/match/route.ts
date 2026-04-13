import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { expertise, researchStatement } from "@/lib/data";

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

export async function POST(req: NextRequest) {
  try {
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key not configured." }, { status: 500 });
    }

    const body = await req.json();
    const { profile } = body;

    if (!profile) {
      return NextResponse.json({ error: "Profile description is required." }, { status: 400 });
    }

    const systemInstructions = `You are a Collaboration Matcher AI for Saptarshi Mukherjee's research portfolio.
Saptarshi's Research Statement: \${researchStatement}
Saptarshi's Expertise: \${expertise.join(", ")}

The user will provide you with their background or project idea. 
You must calculate a highly accurate "Synergy Score" (0-100%) based entirely on how well their background aligns with Saptarshi's robust computer vision / multimodal AI / deep learning background.
If they mention completely unrelated fields (like agriculture or basic web dev), give a low score (e.g. 10-20%). If they mention PyTorch, CV, deepfakes, or RAG, give a high score (80-99%).

You MUST strictly format your response exactly like this JSON:
{
  "score": 85,
  "reason": "You both specialize in computer vision and deep learning architectures like ViT."
}
Do not use markdown blocks like \`\`\`json. Just output the raw JSON object.`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: profile,
      config: {
        systemInstruction: systemInstructions,
        temperature: 0.2, // Low temp for more analytical/consistent scoring
      }
    });

    try {
      const parsed = JSON.parse(response.text || "{}");
      return NextResponse.json(parsed);
    } catch {
      // Fallback if model fails to format JSON
      return NextResponse.json({
        score: 50,
        reason: "Unable to calculate exact match score, but there may be overlap."
      });
    }

  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown backend error" }, { status: 500 });
  }
}
