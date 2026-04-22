'use client';

import { motion } from 'framer-motion';
import { User, Activity } from 'lucide-react';
import { LabData } from '@/types';

interface ResultsViewProps {
  data: LabData;
  onReset: () => void;
}

export const ResultsView = ({ data, onReset }: ResultsViewProps) => {
  return (
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
          <p className="text-sm text-muted italic m-0 text-center">
            Results are classified based on the patient's specific age and sex using clinical reference guidelines.
          </p>
        </div>
        <button 
          className="btn w-full justify-center bg-white/5 hover:bg-white/10 text-white"
          onClick={onReset}
        >
          Analyze Another Report
        </button>
      </aside>

      <section className="biomarker-table glass">
        <div className="flex items-center gap-2 mb-6 px-4">
          <Activity size={24} color="var(--primary)" />
          <h3 className="m-0">Biomarker Analysis</h3>
        </div>
        <div className="table-wrapper overflow-x-auto">
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
                  <td className="font-semibold text-white">{bm.name}</td>
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
        </div>
      </section>
    </motion.div>
  );
};
