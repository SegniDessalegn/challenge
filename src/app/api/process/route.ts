import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_PROMPT, DEFAULT_MODEL } from '@/lib/constants';
import { LabData } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const clientApiKey = formData.get('apiKey') as string;
    const clientModelName = formData.get('modelName') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const apiKey = clientApiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API Key is missing' }, { status: 400 });
    }

    const modelName = clientModelName || process.env.NEXT_PUBLIC_GEMINI_MODEL_NAME || DEFAULT_MODEL;

    const genAI = new GoogleGenerativeAI(apiKey);
    const buffer = await file.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString('base64');

    const model = genAI.getGenerativeModel({ model: modelName });

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Data,
          mimeType: 'application/pdf',
        },
      },
      GEMINI_PROMPT,
    ]);

    const text = result.response.text();
    // Remove markdown code blocks if present
    const cleanJson = text.replace(/```json|```/g, '').trim();
    const data = JSON.parse(cleanJson) as LabData;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error processing PDF:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
