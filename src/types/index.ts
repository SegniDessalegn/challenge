export interface Biomarker {
  name: string;
  value: string;
  unit: string;
  referenceRange: string;
  classification: 'optimal' | 'normal' | 'out of range';
}

export interface LabData {
  patientAge: string;
  patientSex: string;
  biomarkers: Biomarker[];
}

export interface GeminiConfig {
  apiKey: string;
  modelName: string;
}
