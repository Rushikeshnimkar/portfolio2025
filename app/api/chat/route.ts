/* eslint-disable */
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";
import { ChatMessage } from "@/lib/chat/types";
import { ChatWorkflow } from "@/lib/chat/workflow";
import { needsWebSearch } from "@/lib/chat/intent-detector";

// JWT Configuration
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not defined");
}
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = process.env.JWT_EXPIRY || "1m";

// JWT Token verification function
function verifyToken(token: string): {
  valid: boolean;
  payload?: any;
  error?: string;
} {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { valid: true, payload: decoded };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return { valid: false, error: "Token expired" };
    } else if (error instanceof jwt.JsonWebTokenError) {
      return { valid: false, error: "Invalid token" };
    } else {
      return { valid: false, error: "Token verification failed" };
    }
  }
}

// Function to generate JWT token (you might want to use this in a separate auth endpoint)
export function generateToken(payload: any): string {
  const options = {
    expiresIn: JWT_EXPIRY,
  } as jwt.SignOptions;

  return jwt.sign(payload, JWT_SECRET, options);
}

// Add CORS check middleware
function isAllowedOrigin(origin: string | null) {
  const allowedOrigins = [
    "https://www.rushikeshnimkar.com",
    "https://www.www.rushikeshnimkar.com",

    // Include localhost for development(uncomment for development)
    // "http://localhost:3000",
  ];
  return origin && allowedOrigins.includes(origin);
}

export async function POST(req: Request) {
  // Performance monitoring
  const startTime = performance.now();

  // Check origin
  const headersList = await headers();
  const origin = headersList.get("origin");

  // If origin is not allowed, return 403 Forbidden
  if (!isAllowedOrigin(origin)) {
    return new NextResponse(
      JSON.stringify({ error: "Unauthorized origin lol noob" }),
      {
        status: 403,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  // JWT Authentication
  const authHeader = headersList.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new NextResponse(
      JSON.stringify({
        error: "Authentication required",
        message: "Missing or invalid authorization header",
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": origin || "",
        },
      }
    );
  }

  const token = authHeader.substring(7); // Remove "Bearer " prefix
  const tokenVerification = verifyToken(token);

  if (!tokenVerification.valid) {
    return new NextResponse(
      JSON.stringify({
        error: "Authentication failed",
        message: tokenVerification.error,
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": origin || "",
        },
      }
    );
  }

  // Optional: Add rate limiting based on JWT payload
  const userPayload = tokenVerification.payload;
  console.log("Authenticated user:", userPayload);

  try {
    const {
      prompt,
      messages: chatHistory,
      sessionId,
    } = (await req.json()) as {
      prompt: string;
      messages: ChatMessage[];
      sessionId?: string;
    };

    console.log("Received authenticated request with prompt:", prompt);

    // Check if the prompt likely needs web search
    const isSearchQuery = needsWebSearch(prompt);

    // Initialize workflow
    const workflow = new ChatWorkflow(isSearchQuery);

    // Process message
    const response = await workflow.processMessage(prompt, chatHistory);

    const endTime = performance.now();
    console.log(`Request processed in ${(endTime - startTime).toFixed(2)}ms`);

    return NextResponse.json({
      response: response.content,
      structuredContent: response.structuredContent,
      hasStructuredData: !!response.structuredContent,
      structuredDataType: response.structuredContent?.type,
      isSearchPerformed: isSearchQuery,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": origin || "",
        },
      }
    );
  }
}
