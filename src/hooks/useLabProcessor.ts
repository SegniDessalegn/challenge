'use client';

import { useState, useCallback } from 'react';
import { LabData } from '@/types';

export const useLabProcessor = () => {
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

  const reset = () => {
    setData(null);
    setFile(null);
    setError(null);
  };

  return {
    file,
    data,
    loading,
    error,
    isDragActive,
    apiKey,
    modelName,
    setApiKey,
    setModelName,
    onDrop,
    setIsDragActive,
    handleFileChange,
    processReport,
    reset
  };
};
