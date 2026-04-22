'use client';

import { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, User, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Biomarker {
  name: string;
  value: string;
  unit: string;
  referenceRange: string;
  classification: 'optimal' | 'normal' | 'out of range';
}

interface LabData {
  patientAge: string;
  patientSex: string;
  biomarkers: Biomarker[];
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<LabData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [apiKey, setApiKey] = useState(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');
  const [modelName, setModelName] = useState(process.env.NEXT_PUBLIC_GEMINI_MODEL_NAME || 'gemini-3.1-flash-lite-preview');

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    const uploadedFile = e.dataTransfer.files[0];
    if (uploadedFile && uploadedFile.type === 'application/pdf') {
      setFile(uploadedFile);
      setError(null);
    } else {
      setError('Please upload a valid PDF file.');
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setError(null);
    }
  };

  const processReport = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setData(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('apiKey', apiKey);
    formData.append('modelName', modelName);

    try {
      const response = await fetch('/api/process', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process the report.');
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <header className="header">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Biomarker AI Analyzer
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Upload your lab report PDF and get instant insights from AI.
        </motion.p>
      </header>

      {!data && !loading && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="settings-card glass mb-8"
        >
          <div className="flex items-center gap-2 mb-6 text-primary">
            <Activity size={20} />
            <h3 className="m-0 text-lg">AI Configuration</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="input-group">
              <label htmlFor="apiKey" className="block text-sm font-medium mb-2 text-muted">Gemini API Key</label>
              <div className="relative">
                <input 
                  id="apiKey"
                  type="password" 
                  value={apiKey} 
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your Gemini API Key"
                  className="input-field pl-10"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                  <AlertCircle size={18} />
                </div>
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="modelName" className="block text-sm font-medium mb-2 text-muted">Model Name</label>
              <div className="relative">
                <input 
                  id="modelName"
                  type="text" 
                  value={modelName} 
                  onChange={(e) => setModelName(e.target.value)}
                  placeholder="gemini-3.1-flash-lite-preview"
                  className="input-field pl-10"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                  <Activity size={18} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {!data && !loading && (
        <div className="upload-card glass">
          <div 
            className={`drop-zone ${isDragActive ? 'active' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
            onDragLeave={() => setIsDragActive(false)}
            onDrop={onDrop}
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            <input 
              id="fileInput"
              type="file" 
              accept=".pdf" 
              onChange={handleFileChange} 
              style={{ display: 'none' }}
            />
            <div className="flex flex-col items-center">
              {file ? (
                <FileText size={64} color="var(--primary)" style={{ marginBottom: '1rem' }} />
              ) : (
                <Upload size={64} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
              )}
              <h2 className="text-xl font-semibold mb-2">
                {file ? file.name : 'Click or drag PDF here'}
              </h2>
              <p className="text-muted">Maximum file size: 10MB</p>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-4 rounded-lg bg-red-900/20 text-red-400 flex items-center gap-2"
              >
                <AlertCircle size={20} />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {file && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8"
            >
              <button className="btn btn-primary w-full py-4 text-lg" onClick={processReport}>
                Extract Biomarkers from {file.name}
              </button>
            </motion.div>
          )}
        </div>
      )}

      <AnimatePresence>
        {loading && (
          <div className="upload-card glass">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="loading-container"
            >
              <div className="loading-spinner"></div>
              <p className="text-lg font-medium">Analyzing your report with Gemini AI...</p>
              <p className="text-muted mt-2">Standardizing biomarkers and classifying results...</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {data && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="results-grid"
          >
            <aside className="patient-info glass">
              <div className="flex items-center gap-2 mb-6 text-primary">
                <User size={24} />
                <h3 className="m-0">Patient Profile</h3>
              </div>
              <div className="info-item">
                <span className="info-label">Age</span>
                <span className="font-bold">{data.patientAge}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Sex</span>
                <span className="font-bold capitalize">{data.patientSex}</span>
              </div>
              <div className="mt-8 p-4 rounded-xl bg-primary/5 border border-primary/10 mb-6">
                <p className="text-sm text-muted italic m-0">
                  Results are classified based on the patient's specific age and sex using clinical reference guidelines.
                </p>
              </div>
              <button 
                className="btn w-full justify-center bg-white/5 hover:bg-white/10 text-white"
                onClick={() => { setData(null); setFile(null); }}
              >
                Analyze Another Report
              </button>
            </aside>

            <section className="biomarker-table glass">
              <div className="flex items-center gap-2 mb-6 px-4">
                <Activity size={24} color="var(--primary)" />
                <h3 className="m-0">Biomarker Analysis</h3>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Biomarker</th>
                    <th>Result</th>
                    <th>Unit</th>
                    <th>Reference</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.biomarkers.map((bm, index) => (
                    <motion.tr 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td className="font-semibold">{bm.name}</td>
                      <td>{bm.value}</td>
                      <td className="text-muted">{bm.unit}</td>
                      <td className="text-muted">{bm.referenceRange}</td>
                      <td>
                        <span className={`status-badge status-${bm.classification.replace(/\s+/g, '-')}`}>
                          {bm.classification}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
