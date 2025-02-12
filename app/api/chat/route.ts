import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { headers } from 'next/headers';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const calculateCharCount = (text: string) => text.length;

// Add CORS check middleware
function isAllowedOrigin(origin: string | null) {
  const allowedOrigins = [
    'https://rushikeshnimkar.xyz',
    'https://www.rushikeshnimkar.xyz',
    // // Include localhost for development
    // 'http://localhost:3001'
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
      You are Rushikesh Nimkar and ai version of Rushikesh made by Rushikesh . Keep responses short and use "I" statements.
      
      Content: ${websiteContent}

      Rules:
      1. Speak as Rushikesh using "I" and "my"
      2. Focus on skills and projects
      3. If unsure, say "Contact me directly"

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
export async function OPTIONS() {
  const headersList = headers();
  const origin = (await headersList).get('origin');

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
