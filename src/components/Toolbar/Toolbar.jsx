import React from 'react';
import styles from './Toolbar.module.css';
import { useAppStore } from '../../store/useAppStore.js';
import { exportToASCII } from '../../theory/asciiExport.js';
import { FileText, Download, Trash2 } from 'lucide-react';

function Toolbar() {
  const { sequence, tuning } = useAppStore();

  const handleExportASCII = () => {
    const text = exportToASCII({ shapes: sequence.shapes, tuning });
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sequence.name}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const data = {
      version: "1.0",
      sequence,
      tuning,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sequence.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear the sequence?")) {
      localStorage.removeItem('griff-storage');
      window.location.reload();
    }
  };

  return (
    <div className={styles.toolbar}>
      <button className={styles.btn} onClick={handleExportASCII} title="Export ASCII">
        <FileText size={18} />
        <span>ASCII Tab</span>
      </button>
      <button className={styles.btn} onClick={handleExportJSON} title="Export JSON">
        <Download size={18} />
        <span>Save JSON</span>
      </button>
      <button className={clsx(styles.btn, styles.danger)} onClick={handleClear} title="Clear All">
        <Trash2 size={18} />
      </button>
    </div>
  );
}

// Utility to combine classes
const clsx = (...classes) => classes.filter(Boolean).join(' ');

export default Toolbar;
