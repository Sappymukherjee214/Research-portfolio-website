import { NextResponse } from "next/server";
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { retrieveRelevantProjects } from "@/lib/retriever";
import { researchStatement, expertise } from "@/lib/data";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Helper function for exponential backoff retries
async function generateWithRetry(model: GenerativeModel, prompt: string, retries = 3, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      const isStatus503 = error.message?.includes("503") || error.message?.includes("Service Unavailable");
      if (isStatus503 && i < retries - 1) {
        console.log(`Gemini 503 detected. Retrying in ${delay}ms... (Attempt ${i + 1}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
        continue;
      }
      throw error; // If not 503 or last retry, rethrow
    }
  }
}

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    if (!question) {
      return NextResponse.json({ error: "Question is required." }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key is missing." }, { status: 500 });
    }

    const relevantProjects = retrieveRelevantProjects(question, 3);
    let projectsContext = relevantProjects.map((p, idx) => `Project ${idx + 1}: ${p.title}\nDescription: ${p.description}`).join('\n\n');
    
    if (relevantProjects.length === 0) {
      projectsContext = "No specific match found.";
    }

    const systemInstruction = `
You are a Tier-1 AI Research Assistant for Saptarshi Mukherjee's portfolio. 
Context:
Statement: ${researchStatement}
Expertise: ${expertise.join(", ")}
Projects: ${projectsContext}

Guidelines:
- Maintain a highly professional, academic tone.
- Be precise and insightful.
`;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: systemInstruction
    });

    // Use retry logic to handle 503 "High Demand" errors automatically
    const answer = await generateWithRetry(model, question);

    return NextResponse.json({ answer });

  } catch (error: unknown) {
    console.error("Error in /api/ask:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Gemini Error: ${msg}. If this is a 503, please wait 30 seconds and refresh.` },
      { status: 500 }
    );
  }
}
