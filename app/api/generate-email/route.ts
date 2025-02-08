import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const systemPrompt = `You are an AI email assistant. Generate a professional email based on the following prompt. 
    The email should be well-structured, clear, and maintain a professional tone.
    
    Format the email with proper greeting, body, and signature.
    Keep the language natural but professional.
    
    User's prompt: ${prompt}`;

    const result = await model.generateContent(systemPrompt);
    const generatedContent = result.response.text();

    return NextResponse.json({ generatedContent });
  } catch (error) {
    console.error('Error generating email:', error);
    return NextResponse.json(
      { error: 'Failed to generate email' },
      { status: 500 }
    );
  }
} 