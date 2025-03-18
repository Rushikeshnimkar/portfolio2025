import { NextResponse, NextRequest } from "next/server";
import { applyCors, corsMiddleware } from "@/lib/cors";

// Set a longer timeout for the API route
export const config = {
  runtime: "edge",
  regions: ["iad1"],
};

async function handler(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    // System prompt for email generation
    const systemPrompt = `You are an AI email assistant. Generate a professional email based on the following prompt. 
    The email should be well-structured, clear, and maintain a professional tone.
    
    Format the email with proper greeting, body, and signature.
    no exlpaination needed, just generate the email.
    Keep the language natural but professional.`;

    // Format messages for OpenRouter
    const messages = [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: prompt,
      },
    ];

    // Make direct API call to OpenRouter with a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // Reduced to 25 seconds to ensure we stay within Vercel limits

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://rushikeshnimkar.xyz",
          "X-Title": "Rushikesh's Portfolio",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "nousresearch/deephermes-3-llama-3-8b-preview:free",
          messages: messages,
          max_tokens: 10000, // Limit response size
          temperature: 0.2, // Add temperature for more consistent responses
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenRouter API error:", errorData);
      throw new Error(`OpenRouter API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    return NextResponse.json({ generatedContent });
  } catch (error: unknown) {
    console.error("Error generating email:", error);

    // Check if it's an abort error (timeout)
    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        {
          error: "Request timed out. The email generation is taking too long.",
        },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate email" },
      { status: 500 }
    );
  }
}

export const POST = (req: NextRequest) => applyCors(req, handler);
export const OPTIONS = (req: NextRequest) => corsMiddleware(req);
