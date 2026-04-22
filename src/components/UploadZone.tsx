'use client';

import { Upload, FileText, AlertCircle, Activity } from 'lucide-react';
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
            <FileText size={48} className="upload-icon-active" />
          ) : (
            <Upload size={48} className="upload-icon" />
          )}
          <h2 className="upload-title">
            {file ? file.name : 'Click or drag PDF here'}
          </h2>
          <p className="upload-subtitle">Supports medical lab reports in PDF format (up to 10MB)</p>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="error-message"
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {file && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <button className="btn btn-primary btn-large w-full" onClick={onProcess}>
            <Activity size={20} />
            <span>Extract Biomarkers</span>
          </button>
        </motion.div>
      )}

    </div>
  );
};
