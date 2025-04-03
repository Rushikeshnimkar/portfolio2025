import { NextResponse } from "next/server";
import { headers } from "next/headers";

// Add CORS check middleware
function isAllowedOrigin(origin: string | null) {
  const allowedOrigins = [
    "https://rushikeshnimkar.xyz",
    "https://www.rushikeshnimkar.xyz",
    // "http://localhost:3000",
  ];
  return origin && allowedOrigins.includes(origin);
}

export async function POST(req: Request) {
  // Check origin
  const headersList = await headers();
  const origin = headersList.get("origin");

  // If origin is not allowed, return 403 Forbidden
  if (!isAllowedOrigin(origin)) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized origin" }), {
      status: 403,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  try {
    const { prompt } = await req.json();

    // Call OpenRouter with a model specialized for code generation
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
          model: "deepseek/deepseek-chat-v3-0324:free",
          messages: [
            {
              role: "system",
              content: `You are a UI/Theme modification assistant that generates JavaScript code to modify a website's appearance based on the user's request.

Your task is to:
1. Analyze the user's UI customization request
2. Generate a JavaScript function that uses DOM manipulation to implement the requested changes
3. Ensure the code is robust with error handling
4. try to make many changes to the website

Special note for background changes:
- To change the page background color, target #page-background-base
- To modify gradient blobs, target #gradient-blob-1, #gradient-blob-2, etc.
- To hide/show the entire gradient background, target #gradient-background

Your response should ONLY include a JavaScript function called 'applyThemeChanges' that:
- Uses standard DOM methods like querySelector, style manipulation, classList, etc.
- Includes plenty of error handling with try/catch blocks
- Has good comments explaining the changes
- Returns an array of text descriptions of the changes made (for UI feedback)
- Can handle any UI modification request including colors, layout, hiding elements, rearranging content, etc.

IMPORTANT: Respond ONLY with the JavaScript function wrapped in triple backticks with js language identifier.
Do not include any other explanation or markdown formatting.

Example response format:
\`\`\`js
function applyThemeChanges() {
  const changes = [];
  
  try {
    // Change background color
    document.body.style.backgroundColor = '#121212';
    changes.push('Changed background color to dark mode');
    
    // More changes...
  } catch (error) {
    console.error('Error applying theme changes:', error);
  }
  
  return changes;
}
\`\`\``,
            },
            {
              role: "user",
              content: prompt.replace(/^Theme:\s*/i, ""), // Remove the Theme: prefix before sending to AI
            },
          ],
          max_tokens: 2000,
          temperature: 0.2,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenRouter API error:", errorData);
      throw new Error(`OpenRouter API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new NextResponse(
      JSON.stringify({
        response: aiResponse,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": origin || "",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (error) {
    console.error("Theme API Error:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Failed to generate theme changes",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": origin || "",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  }
}

export async function OPTIONS() {
  const headersList = headers();
  const origin = (await headersList).get("origin");

  if (!isAllowedOrigin(origin)) {
    return new NextResponse(null, { status: 403 });
  }

  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": origin || "",
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
