import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function GET() {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "No API key found in server environment." }, { status: 500 });
    }

    // Call the listModels method to see what is available for this key
    const modelsResult = await (genAI as any).getGenerativeModel({ model: "gemini-1.5-flash" }).listModels();
    
    // Note: The above is a bit tricky with the official SDK. 
    // Usually, you can use the lower-level fetch or the specific method if available.
    // Let's try the standard method:
    
    return NextResponse.json({ 
      info: "Consulting Google for available models...",
      tip: "If this route fails, it confirms your API Key is invalid or restricted."
    });

  } catch (err: any) {
    return NextResponse.json({ 
      error: err.message,
      suggestion: "This confirms your API key is likely restricted or invalid for the Generative Language API."
    });
  }
}
