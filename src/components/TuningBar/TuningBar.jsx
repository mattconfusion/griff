import React from 'react';
import styles from './TuningBar.module.css';
import { useAppStore } from '../../store/useAppStore.js';
import { PRESETS } from '../../theory/tuning.js';

function TuningBar() {
  const { tuning, setTuning, updateTuningString } = useAppStore();

  const handlePresetChange = (e) => {
    const preset = PRESETS.find(p => p.name === e.target.value);
    if (preset) {
      setTuning(preset);
    }
  };

  const handleStringChange = (index, value) => {
    updateTuningString(index, value.toUpperCase());
  };

  return (
    <div className={styles.tuningBar}>
      <div className={styles.currentTuning}>
        <span className={styles.label}>Tuning:</span>
        <div className={styles.stringList}>
          {tuning.strings.map((s, i) => (
            <input
              key={i}
              className={styles.stringInput}
              value={s}
              onChange={(e) => handleStringChange(i, e.target.value)}
              title="String pitch (e.g. E2, G#3)"
            />
          ))}
        </div>
      </div>
      
      <div className={styles.presets}>
        <select onChange={handlePresetChange} value={tuning.name || ""}>
          <option value="" disabled>Presets...</option>
          {PRESETS.map(p => (
            <option key={p.name} value={p.name}>{p.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default TuningBar;
