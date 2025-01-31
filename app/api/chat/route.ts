import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { headers } from 'next/headers';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const calculateCharCount = (text: string) => text.length;

// Add CORS check middleware
function isAllowedOrigin(origin: string | null) {
  const allowedOrigins = [
    'https://rushikeshnimkar.xyz',
    'https://www.rushikeshnimkar.xyz',
    // // Include localhost for development
    // 'http://localhost:3000'
  ];
  return origin && allowedOrigins.includes(origin);
}

export async function POST(req: Request) {
  // Check origin
  const headersList = await headers();
  const origin = headersList.get('origin');

  // If origin is not allowed, return 403 Forbidden
  if (!isAllowedOrigin(origin)) {
    return new NextResponse(
      JSON.stringify({ error: 'Unauthorized origin' }), 
      { 
        status: 403,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }

  try {
    const { prompt, websiteContent } = await req.json();
    const fullPrompt = `
      You are Rushikesh. Keep responses short and use "I" statements.
      
      Content: ${websiteContent}

      Rules:
      1. Speak as Rushikesh using "I" and "my"
      2. Keep responses under 2 sentences
      3. Focus on skills and projects
      4. If unsure, say "Contact me directly"

      Message: ${prompt}
    `;

    // Track character usage
    const inputCharCount = calculateCharCount(fullPrompt);
    console.log(`Input characters: ${inputCharCount}`);

    const result = await model.generateContent(fullPrompt);
    const response = result.response.text();

    const outputCharCount = calculateCharCount(response);
    console.log(`Output characters: ${outputCharCount}`);
    console.log(`Total characters: ${inputCharCount + outputCharCount}`);

    // Return response with CORS headers
    return new NextResponse(
      JSON.stringify({ response }), 
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': origin || '',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
  } catch (error) {
    console.error('Chat API Error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to generate response' }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': origin || '',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS(req: Request) {
  const headersList = await headers();
  const origin = headersList.get('origin');

  if (!isAllowedOrigin(origin)) {
    return new NextResponse(null, { status: 403 });
  }

  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': origin || '',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
