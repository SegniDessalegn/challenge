'use client';

import { Upload, FileText, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadZoneProps {
  file: File | null;
  isDragActive: boolean;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: string | null;
  onProcess: () => void;
}

export const UploadZone = ({
  file,
  isDragActive,
  onDrop,
  onDragOver,
  onDragLeave,
  handleFileChange,
  error,
  onProcess
}: UploadZoneProps) => {
  return (
    <div className="upload-card glass">
      <div 
        className={`drop-zone ${isDragActive ? 'active' : ''}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
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
        <div className="flex flex-col items-center text-center">
          {file ? (
            <FileText size={64} color="var(--primary)" style={{ marginBottom: '1rem' }} />
          ) : (
            <Upload size={64} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
          )}
          <h2 className="text-xl font-semibold mb-2 text-white">
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
          <button className="btn btn-primary w-full py-4 text-lg" onClick={onProcess}>
            Extract Biomarkers from {file.name}
          </button>
        </motion.div>
      )}
    </div>
  );
};
