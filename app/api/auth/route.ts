// Create this file at: app/api/auth/route.ts
import { NextResponse } from "next/server";
import { generateToken } from "../chat/route"; // Import the generateToken function
import { headers } from "next/headers";

// Function to check if origin is allowed (same as in your chat route)
function isAllowedOrigin(origin: string | null) {
  const allowedOrigins = [
    "https://www.rushikeshnimkar.com",
    "https://www.www.rushikeshnimkar.com",
    // "http://localhost:3000", // for development
  ];
  return origin && allowedOrigins.includes(origin);
}

// POST endpoint to generate JWT token
export async function POST(req: Request) {
  try {
    // Check origin
    const headersList = await headers();
    const origin = headersList.get("origin");

    if (!isAllowedOrigin(origin)) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized origin " }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const body = await req.json();
    const { type = "anonymous" } = body;

    // Create payload for the token
    const payload = {
      type,
      timestamp: Date.now(),
      // Add any other user identification you need
      ...(body.userId && { userId: body.userId }),
      ...(body.sessionId && { sessionId: body.sessionId }),
    };

    // Generate the token
    const token = generateToken(payload);

    return new NextResponse(
      JSON.stringify({
        token,
        expiresIn: process.env.JWT_EXPIRY || "1m",
        message: "Token generated successfully",
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
    console.error("Token generation error:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Failed to generate token",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  const headersList = await headers();
  const origin = headersList.get("origin");

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
