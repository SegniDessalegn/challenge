'use client';

import { AnimatePresence } from 'framer-motion';
import { Header } from '@/components/Header';
import { SettingsCard } from '@/components/SettingsCard';
import { UploadZone } from '@/components/UploadZone';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { ResultsView } from '@/components/ResultsView';
import { useLabProcessor } from '@/hooks/useLabProcessor';

export default function Home() {
  const {
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
  } = useLabProcessor();

  return (
    <main className="container">
      <Header />

      {!data && !loading && (
        <div className="setup-container">
          <SettingsCard 
            apiKey={apiKey}
            setApiKey={setApiKey}
            modelName={modelName}
            setModelName={setModelName}
          />
          
          <UploadZone 
            file={file}
            isDragActive={isDragActive}
            onDrop={onDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
            onDragLeave={() => setIsDragActive(false)}
            handleFileChange={handleFileChange}
            error={error}
            onProcess={processReport}
          />
        </div>
      )}

      <AnimatePresence>
        {loading && <LoadingOverlay />}
      </AnimatePresence>

      <AnimatePresence>
        {data && <ResultsView data={data} onReset={reset} />}
      </AnimatePresence>
    </main>
  );
}
