import { NextRequest, NextResponse } from "next/server";

// Parse allowed origins from env variable, with production defaults
function getAllowedOrigins(): string[] {
  if (process.env.ALLOWED_ORIGINS) {
    return process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim());
  }
  // Fallback defaults (production)
  return [
    "https://www.rushikeshnimkar.com",
    "https://www.www.rushikeshnimkar.com",
  ];
}

// Shared origin check — import this in all API routes
export function isAllowedOrigin(origin: string | null): boolean {
  const allowedOrigins = getAllowedOrigins();
  return !!origin && allowedOrigins.includes(origin);
}

// Development environment check
const isDevelopment = process.env.NODE_ENV === "development";

export function corsMiddleware(req: NextRequest) {
  const origin = req.headers.get("origin") || "";

  if (isDevelopment) {
    return NextResponse.json(
      { error: "CORS check passed (development mode)" },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Credentials": "true",
        },
      }
    );
  }

  if (!isAllowedOrigin(origin)) {
    return NextResponse.json(
      { error: "Not allowed by CORS" },
      {
        status: 403,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  return NextResponse.json(
    { success: true },
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "true",
      },
    }
  );
}

export function applyCors(
  req: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  if (req.method === "OPTIONS") {
    return corsMiddleware(req);
  }

  const origin = req.headers.get("origin") || "";

  if (isDevelopment) {
    return handler(req);
  }

  if (!isAllowedOrigin(origin)) {
    return NextResponse.json({ error: "Not allowed by CORS" }, { status: 403 });
  }

  return handler(req).then((response) => {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    response.headers.set("Access-Control-Allow-Credentials", "true");

    return response;
  });
}
