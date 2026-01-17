import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import * as dotenv from "dotenv";
import { Document } from "@langchain/core/documents";

// Load environment variables (ensure this runs if not already handled globally)
dotenv.config();

// --- Constants ---
const THEME_INDEX_NAME = "theme";
const GOOGLE_EMBEDDING_MODEL = "text-embedding-004";
const MAX_CONTEXT_RESULTS = 5; // Increased for better context retrieval

// --- Helper: Initialize services (consider moving to a shared lib if used elsewhere) ---
let pinecone: Pinecone | null = null;
let embeddings: GoogleGenerativeAIEmbeddings | null = null;
let vectorStore: PineconeStore | null = null;

async function initializeServices() {
  if (vectorStore) return; // Already initialized

  if (!process.env.PINECONE_API_KEY || !process.env.GOOGLE_API_KEY) {
    throw new Error("Missing API keys in environment variables.");
  }

  try {
    pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
    const pineconeIndex = pinecone.Index(THEME_INDEX_NAME);

    embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_API_KEY,
      model: GOOGLE_EMBEDDING_MODEL,
    });

    vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex,
      // namespace: "theme-structure", // Add namespace if you used one during embedding
    });
    console.log("🔌 Initializing Pinecone and embeddings services...");
    console.log("✅ Pinecone vector store successfully initialized.");
    // Test connectivity with a simple query
    console.log("🧪 Testing vector store connectivity...");
    const testQuery = await vectorStore.similaritySearch("test", 1);
    console.log(
      `✅ Vector store test query successful. Retrieved ${testQuery.length} documents.`
    );
  } catch (error) {
    console.error("❌ CRITICAL ERROR initializing services:", error);
    console.trace("Stack trace for initialization error:");
    // Reset to allow retry on next request
    pinecone = null;
    embeddings = null;
    vectorStore = null;
    throw new Error("Failed to initialize vector store connection.");
  }
}

// Add CORS check middleware
function isAllowedOrigin(origin: string | null) {
  const allowedOrigins = [
    "https://www.rushikeshnimkar.com",
    "https://www.www.rushikeshnimkar.com",
    // "http://localhost:3000",
  ];
  return origin && allowedOrigins.includes(origin);
}

// Improved page/component detection function
function isPageOrComponentSpecific(prompt: string): boolean {
  const promptLower = prompt.toLowerCase();

  // Expanded project-specific terms to ensure detection
  const projectTerms = [
    "project",
    "projects",
    "project page",
    "projects page",
    "project section",
    "projects section",
    "project card",
    "project modal",
    "project title",
    "project description",
    "project-page",
    "projects-page",
    "project-card",
    "project-modal",
    "project-grid",
    "project-title",
    "project-description",
  ];

  // Check for any project-related terms
  for (const term of projectTerms) {
    if (promptLower.includes(term)) {
      console.log(`🎯 Detected project-specific term: "${term}" in prompt`);
      return true;
    }
  }

  // Check for common page names
  const pages = ["home", "about", "skills", "contact", "resume"];

  // Check if prompt mentions specific pages or IDs
  if (
    pages.some(
      (page) =>
        promptLower.includes(`${page} page`) ||
        promptLower.includes(`${page}-page`)
    ) ||
    promptLower.includes("section") ||
    promptLower.includes("#") || // Looking for IDs
    /header|title|card|container|profile/.test(promptLower) // Common components
  ) {
    console.log(`🎯 Detected page-specific term: "${prompt}"`);
    return true;
  }

  console.log("⚠️ No specific page/component detected in prompt");
  return false;
}

export async function POST(req: Request) {
  console.log("\n\n🚀 ====== NEW THEME API REQUEST ======");
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
    await initializeServices(); // Ensure services are ready

    const { prompt: userPrompt } = await req.json();
    const cleanUserPrompt = userPrompt.replace(/^Theme:\s*/i, "");

    console.log(`📝 User prompt: "${cleanUserPrompt}"`);

    // Project-specific override - force project context retrieval if project-related
    const isProjectRequest = cleanUserPrompt.toLowerCase().includes("project");
    const isSpecific =
      isProjectRequest || isPageOrComponentSpecific(cleanUserPrompt);

    console.log(
      `🔍 Request classification: ${isProjectRequest
        ? "PROJECT-SPECIFIC"
        : isSpecific
          ? "PAGE/COMPONENT-SPECIFIC"
          : "GENERAL"
      }`
    );

    let contextText = "";

    // Only use Pinecone for specific requests
    if (isSpecific) {
      console.log("🔄 Initializing Pinecone services for specific request");
      try {
        await initializeServices();

        if (vectorStore) {
          // For project requests, try multiple specific queries
          if (isProjectRequest) {
            console.log("🔍 Performing enhanced project-specific search");

            // Try multiple queries to improve retrieval for projects
            const projectQueries = [
              "project page structure",
              "projects page",
              "project card layout",
              cleanUserPrompt,
            ];

            let allResults: Document[] = [];

            for (const query of projectQueries) {
              console.log(`📊 Searching Pinecone with query: "${query}"`);
              try {
                const results = await vectorStore.similaritySearch(query, 2);
                console.log(
                  `Found ${results.length} results for query "${query}"`
                );
                allResults = [...allResults, ...results];
              } catch (queryError) {
                console.error(`Error in query "${query}":`, queryError);
              }
            }

            // Remove duplicates
            const uniqueResults = [];
            const seenContent = new Set();

            for (const doc of allResults) {
              // Use first 100 chars as a simple deduplication key
              const key = doc.pageContent.substring(0, 100);
              if (!seenContent.has(key)) {
                seenContent.add(key);
                uniqueResults.push(doc);
              }
            }

            console.log(
              `📚 Retrieved ${uniqueResults.length} unique documents for project content`
            );

            // Log each document
            uniqueResults.forEach((doc, i) => {
              console.log(`\n--- Document ${i + 1} ---`);
              console.log(
                `Content preview: ${doc.pageContent.substring(0, 150)}...`
              );
            });

            contextText = uniqueResults
              .map((doc) => doc.pageContent)
              .join("\n\n---\n\n");
          } else {
            // Standard retrieval for non-project specific requests
            console.log(`🔍 Standard search for: "${cleanUserPrompt}"`);
            const contextResults = await vectorStore.similaritySearch(
              cleanUserPrompt,
              MAX_CONTEXT_RESULTS
            );

            console.log(`📚 Retrieved ${contextResults.length} documents`);
            contextResults.forEach((doc, i) => {
              console.log(`\n--- Document ${i + 1} ---`);
              console.log(
                `Content preview: ${doc.pageContent.substring(0, 150)}...`
              );
            });

            contextText = contextResults
              .map((doc) => doc.pageContent)
              .join("\n\n---\n\n");
          }

          console.log(
            `📏 Final context length: ${contextText.length} characters`
          );
        } else {
          console.warn("⚠️ Vector store not initialized");

          // Fallback for project page if vectorStore failed
          if (isProjectRequest) {
            console.log("📋 Using fallback project page structure");
            contextText = `
PROJECT PAGE STRUCTURE
The projects page is identified by the ID "projects-page" and showcases portfolio projects.
The main container has ID "projects-page" and holds all project-related content.
The content container has ID "projects-container" with controlled width and padding.
The page title has ID "projects-title" and features a gradient effect.
Projects are displayed in a responsive grid with ID "projects-grid".
Each project card has ID "project-card-{id}" where {id} is the project identifier.
Project cards contain media section "project-media-{id}", title "project-title-{id}", 
description "project-description-{id}", tags "project-tags-{id}", and links "project-links-{id}".
The modal has ID "project-modal-backdrop" with a content area "project-modal-{id}".`;
          }
        }
      } catch (error) {
        console.error("❌ Error retrieving context:", error);
        console.trace("Stack trace for context retrieval error:");

        // Fallback for project page
        if (isProjectRequest) {
          console.log("📋 Using fallback project page structure after error");
          contextText = `
PROJECT PAGE STRUCTURE
The projects page is identified by the ID "projects-page" and showcases portfolio projects.
The main container has ID "projects-page" and holds all project-related content.
The content container has ID "projects-container" with controlled width and padding.
The page title has ID "projects-title" and features a gradient effect.
Projects are displayed in a responsive grid with ID "projects-grid".
Each project card has ID "project-card-{id}" where {id} is the project identifier.
Project cards contain media section "project-media-{id}", title "project-title-{id}", 
description "project-description-{id}", tags "project-tags-{id}", and links "project-links-{id}".
The modal has ID "project-modal-backdrop" with a content area "project-modal-{id}".`;
        }
      }
    } else {
      console.log("🔄 General request - skipping Pinecone lookup");
    }

    // Enhanced system prompt with explicit instructions for reporting changes
    const systemPrompt = `You are a UI/Theme modification assistant that generates JavaScript code to modify a website's appearance based on the user's request.

${contextText
        ? `Use the following page structure information as context to understand the elements you can modify:
--- START CONTEXT ---
${contextText}
--- END CONTEXT ---`
        : "No specific page structure context available."
      }

Your task is to:
1. Analyze the user's UI customization request
2. Generate a JavaScript function that uses DOM manipulation to implement the requested changes
3. Ensure the code is robust with error handling
4. Try to make many visible changes to the website

CRITICAL REQUIREMENTS:
- ALWAYS add console.log statements to show what elements are being targeted

Special note for background changes:
- To change the page background color, target #page-background-base
- To modify gradient blobs, target #gradient-blob-1, #gradient-blob-2, etc.
- To hide/show the entire gradient background, target #gradient-background

For project-specific changes:
- Project cards: document.querySelectorAll('.bg-neutral-900.rounded-xl.overflow-hidden') or #projects-grid > div
- Project titles: document.querySelectorAll('.text-lg.font-bold.text-neutral-200') or h2 elements within project cards
- Project descriptions: document.querySelectorAll('.text-sm.text-neutral-400') within project cards

IMPORTANT: Respond ONLY with the JavaScript function 'applyThemeChanges' wrapped in triple backticks with js language identifier. Function MUST return a non-empty array of changes.`;

    console.log(
      "📤 Sending request to LLM API with context length:",
      contextText.length
    );

    // Call OpenRouter with the enhanced prompt
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
          model: "tngtech/tng-r1t-chimera:free", // Use a consistent model with your existing setup
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: cleanUserPrompt,
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

    // Add safety checks to prevent "Cannot read properties of undefined"
    if (
      !data ||
      !data.choices ||
      !data.choices.length ||
      !data.choices[0] ||
      !data.choices[0].message
    ) {
      console.error("Unexpected API response format:", data);
      throw new Error("OpenRouter API returned an unexpected response format");
    }

    let aiResponse = data.choices[0].message.content;

    // Extract the JavaScript function code
    const functionMatch = aiResponse.match(/```js\s*([\s\S]*?)\s*```/);
    if (functionMatch && functionMatch[1]) {
      let functionCode = functionMatch[1];

      // Check if the function might not be reporting changes properly
      const hasReturnChanges = functionCode.includes("return changes");
      const hasPushToChanges = functionCode.includes("changes.push(");

      if (!hasReturnChanges || !hasPushToChanges) {
        console.log(
          "⚠️ Generated code might not report changes properly, adding verification"
        );

        // Modify the function to ensure it reports changes
        functionCode = functionCode.replace(
          /function applyThemeChanges\(\)\s*{/,
          `function applyThemeChanges() {
  console.log("🎨 Theme changes function executing...");`
        );

        // Ensure there's a changes array declaration
        if (
          !functionCode.includes("const changes = []") &&
          !functionCode.includes("let changes = []")
        ) {
          functionCode = functionCode.replace(
            /function applyThemeChanges\(\)\s*{([^}]*)/,
            `function applyThemeChanges() {$1
  const changes = [];
`
          );
        }

        // Ensure the function returns the changes array
        if (!hasReturnChanges) {
          functionCode = functionCode.replace(
            /}(\s*)$/,
            `  console.log("🔄 Theme changes completed, returning:", changes);
  return changes.length > 0 ? changes : ["Applied visual updates to the page"];
}$1`
          );
        }

        // Wrap in code block again
        aiResponse = "```js\n" + functionCode + "\n```";
      }
    }

    console.log("📥 Received response from API");

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
    console.error("❌ Theme API Error:", error);
    console.trace("Stack trace for API error:");

    // Enhanced error response with more details
    return new NextResponse(
      JSON.stringify({
        error: "Failed to generate theme changes",
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
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
