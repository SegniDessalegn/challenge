'use client';

import { Activity, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface SettingsCardProps {
  apiKey: string;
  setApiKey: (val: string) => void;
  modelName: string;
  setModelName: (val: string) => void;
}

export const SettingsCard = ({ apiKey, setApiKey, modelName, setModelName }: SettingsCardProps) => {
  return (
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
  );
};
