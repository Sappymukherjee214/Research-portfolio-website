import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { retrieveRelevantProjects } from "@/lib/retriever";
import { researchStatement, expertise } from "@/lib/data";

// Initialize Gemini client with the official SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    if (!question) {
      return NextResponse.json(
        { error: "Question is required." },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key is missing in server environment." },
        { status: 500 }
      );
    }

    // 1. Retrieve context
    const relevantProjects = retrieveRelevantProjects(question, 3);
    
    let projectsContext = relevantProjects.map((p, idx) => `Project ${idx + 1}: ${p.title}\nDescription: ${p.description}`).join('\n\n');
    
    if (relevantProjects.length === 0) {
      projectsContext = "No specific match found, but standard expertise applies.";
    }

    // 2. Construct the system instruction
    const systemInstruction = `
You are a Tier-1 AI Research Assistant integrated into Saptarshi Mukherjee's professional portfolio. 
Your objective is to provide elite, insightful, and technically accurate responses.

Core Directives:
1. **Portfolio Domain**: For queries regarding Saptarshi's work, use the provided context to explain technical nuances, methodologies, and findings.
2. **General Research**: You are a master of Computer Vision, Machine Learning, and Robust AI. Provide comprehensive, state-of-the-art answers to any general technical or academic questions.
3. **Tone**: Maintain a sophisticated, academic, yet accessible tone. Use professional terminology (e.g., "stochastic," "robustness," "multimodal latent space") appropriately.
4. **Formatting**: Use clear structure. If relevant, suggest how Saptarshi's expertise aligns with the user's general research question.

Context about Saptarshi's work:
Statement: ${researchStatement}
Expertise: ${expertise.join(", ")}

Relevant Projects Context:
${projectsContext}
`;

    // 3. Initialize model with system instruction
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-latest",
      systemInstruction: systemInstruction
    });

    // 4. Generate content
    const result = await model.generateContent(question);
    const response = await result.response;
    const answer = response.text();

    return NextResponse.json({ answer });

  } catch (error: unknown) {
    console.error("Error in /api/ask:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Gemini Error: ${errorMessage}. Please check your GEMINI_API_KEY and Quota.` },
      { status: 500 }
    );
  }
}
