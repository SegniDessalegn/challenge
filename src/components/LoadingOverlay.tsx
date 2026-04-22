'use client';

import { motion } from 'framer-motion';

export const LoadingOverlay = () => {
  return (
    <div className="upload-card glass">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="loading-container"
      >
        <div className="loading-spinner"></div>
        <p className="text-lg font-medium text-white">Analyzing your report with Gemini AI...</p>
        <p className="text-muted mt-2 text-center">Standardizing biomarkers and classifying results based on demographics...</p>
      </motion.div>
    </div>
  );
};
