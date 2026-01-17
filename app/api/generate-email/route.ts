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
    const systemPrompt = `You are an AI assistant helping a visitor draft an email to Rushikesh Nimkar. 
    The email should be written from the perspective of the visitor/user, addressed to Rushikesh.
    Use the user's prompt to determine the intent (e.g., job offer, collaboration, question).
    
    Requirements:
    - Address the email to "Rushikesh" or "Mr. Nimkar".
    - Maintain a professional and polite tone.
    - If the user provides their name/details in the prompt, include them. Otherwise, use placeholders like "[Your Name]".
    - Format properly with a clear subject line (if applicable) and body.
    - Do NOT include any explanations, just the email content.`;

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
          "HTTP-Referer": "https://www.rushikeshnimkar.com",
          "X-Title": "Rushikesh's Portfolio",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mistralai/devstral-2512:free",
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
