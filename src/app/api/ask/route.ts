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
You are a highly capable AI research assistant representing me on my portfolio website. 
Your primary role is to intelligently discuss and explain my research portfolio. However, you are also fully capable of answering ANY general questions related to research, academia, AI, or related fields.

Guidelines:
- For questions about me or my work: Rely on the provided context below.
- For general research questions: Use your pre-trained knowledge to provide accurate answers.
- Maintain a highly professional and academic tone.

Context about my work:
My Research Statement: ${researchStatement}
My Core Expertise: ${expertise.join(", ")}

Relevant Portfolio Projects:
${projectsContext}
`;

    // 3. Initialize model with system instruction
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: systemInstruction
    });

    // 4. Generate content
    const result = await model.generateContent(question);
    const response = await result.response;
    const answer = response.text();

    return NextResponse.json({ answer });

  } catch (error) {
    console.error("Error in /api/ask:", error);
    return NextResponse.json(
      { error: "AI generation failed. Please verify the GEMINI_API_KEY in your deployment dashboard." },
      { status: 500 }
    );
  }
}
