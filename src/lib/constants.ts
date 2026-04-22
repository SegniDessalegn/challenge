export const GEMINI_PROMPT = `
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

export const DEFAULT_MODEL = 'gemini-3.1-flash-lite-preview';
