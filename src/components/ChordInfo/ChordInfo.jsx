import React from 'react';
import styles from './ChordInfo.module.css';

function ChordInfo({ shape }) {
  const { analysis } = shape;

  if (!analysis) {
    return (
      <div className={styles.container}>
        <p className={styles.empty}>No notes selected</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.chordName}>{analysis.name}</h2>
      
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Details</h3>
        <div className={styles.grid}>
          <span className={styles.label}>Root:</span>
          <span className={styles.value}>{analysis.root}</span>
          <span className={styles.label}>Bass:</span>
          <span className={styles.value}>{analysis.bass}</span>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Intervals</h3>
        <div className={styles.intervals}>
          {analysis.intervals?.map((interval, i) => (
            <div key={i} className={styles.intervalChip}>
              {interval}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Notes</h3>
        <div className={styles.noteList}>
          {analysis.notes?.map((note, i) => (
            <div key={i} className={styles.noteItem}>
              <span className={styles.noteString}>Str {note.string + 1}:</span>
              <span className={styles.noteLabel}>{note.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChordInfo;
