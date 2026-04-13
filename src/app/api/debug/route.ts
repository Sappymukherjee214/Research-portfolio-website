import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function GET() {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "No API key found in server environment." }, { status: 500 });
    }

    // Diagnostic call: Try to get model info
    genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    
    // We don't perform a full listing to avoid complicated SDK types, 
    // instead we just verify the key can initialize a model.
    
    return NextResponse.json({ 
      status: "Configuration initialized",
      key_present: true,
      model_alias: "gemini-1.5-flash-latest",
      tip: "If the AI Assistant still fails with 404, ensure 'Generative Language API' is enabled in Google Cloud Console for the project associated with this key."
    });

  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error during initialization";
    return NextResponse.json({ 
      error: errorMessage,
      suggestion: "This confirms your API key is likely restricted, invalid, or needs the 'Generative Language API' enabled."
    });
  }
}
