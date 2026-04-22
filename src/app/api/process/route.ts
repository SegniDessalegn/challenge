import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';


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

    const modelName = clientModelName || process.env.NEXT_PUBLIC_GEMINI_MODEL_NAME || 'gemini-1.5-flash';

    const genAI = new GoogleGenerativeAI(apiKey);
    const buffer = await file.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString('base64');

    const model = genAI.getGenerativeModel({ model: modelName });

    const prompt = `
      Analyze this medical lab report PDF.
      1. Extract the patient's age and sex.
      2. Extract all biomarkers/lab results.
      3. Standardize all biomarker names and units into English.
      4. For each biomarker, classify the result as "optimal", "normal", or "out of range" based on the patient's age, sex, and the reference ranges provided in the report or standard clinical guidelines.
      
      Return the results strictly in the following JSON format:
      {
        "patientAge": "string",
        "patientSex": "string",
        "biomarkers": [
          {
            "name": "string",
            "value": "string",
            "unit": "string",
            "referenceRange": "string",
            "classification": "optimal | normal | out of range"
          }
        ]
      }
      
      Respond only with the JSON object.
    `;

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Data,
          mimeType: 'application/pdf',
        },
      },
      prompt,
    ]);

    const text = result.response.text();
    // Remove markdown code blocks if present
    const cleanJson = text.replace(/```json|```/g, '').trim();
    const data = JSON.parse(cleanJson);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error processing PDF:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
