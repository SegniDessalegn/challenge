'use client';

import { motion } from 'framer-motion';

export const Header = () => {
  return (
    <header className="header text-center">
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
  );
};
