import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY);
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString('base64');

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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
