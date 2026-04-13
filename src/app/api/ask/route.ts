import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { retrieveRelevantProjects } from "@/lib/retriever";
import { researchStatement, expertise } from "@/lib/data";

// Initialize Gemini client
// IMPORTANT: You need to set GEMINI_API_KEY in your .env.local file.
// If GEMINI_API_KEY is not set, this will throw an error or we need to handle it gracefully.
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "", 
});

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    if (!question) {
      return NextResponse.json(
        { error: "Question is required." },
        { status: 400 }
      );
    }

    // 1. Check for API key (so we don't crash mysteriously if user forgot)
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key is missing. Please add it to your .env.local file." },
        { status: 500 }
      );
    }

    // 2. Retrieve context from our local RAG array
    const relevantProjects = retrieveRelevantProjects(question, 3);
    
    let projectsContext = relevantProjects.map((p, idx) => `Project ${idx + 1}: ${p.title}\nDescription: ${p.description}`).join('\n\n');
    
    if (relevantProjects.length === 0) {
      projectsContext = "No specific match found, but standard expertise applies.";
    }

    // 3. Construct the flexible prompt
    const systemInstruction = `
You are a highly capable AI research assistant representing me on my portfolio website. 
Your primary role is to intelligently discuss and explain my research portfolio. However, you are also fully capable of answering ANY general questions related to research, academia, AI, or related fields.

Guidelines:
- For questions about me or my work: Rely on the provided context below.
- For general research questions: Use your extensive pre-trained knowledge to provide accurate, insightful, and comprehensive answers.
- Maintain a highly professional and academic tone at all times.
- If the query is completely unrelated to research, AI, or my portfolio, you may politely steer the conversation back to research topics.

Context about my work (use for portfolio-specific queries):
My Research Statement: ${researchStatement}
My Core Expertise: ${expertise.join(", ")}

Relevant Portfolio Projects to consider:
${projectsContext}
`;

    // 4. Call LLM
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: question,
      config: {
        systemInstruction,
        temperature: 0.2, // Low temperature for factual consistency
      }
    });

    const answer = response.text || "No generated response.";

    return NextResponse.json({ answer });

  } catch (error) {
    console.error("Error in /api/ask:", error);
    return NextResponse.json(
      { error: "An error occurred while generating the answer. Make sure the API key is correct." },
      { status: 500 }
    );
  }
}
