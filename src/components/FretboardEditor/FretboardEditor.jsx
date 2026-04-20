import React from 'react';
import styles from './FretboardEditor.module.css';
import { useAppStore } from '../../store/useAppStore.js';
import { clsx } from 'clsx';
import { ChevronUp, ChevronDown } from 'lucide-react';

function FretboardEditor({ shape }) {
  const { updateShape } = useAppStore();
  const numStrings = shape.strings.length;
  const numFrets = 5;

  const handleFretClick = (stringIndex, fretNumber) => {
    const stringData = shape.strings[stringIndex];
    let newStrings = [...shape.strings];
    
    if (stringData.state === 'fretted' && stringData.fret === fretNumber) {
      newStrings[stringIndex] = { ...stringData, state: 'muted', fret: 0 };
    } else {
      newStrings[stringIndex] = { ...stringData, state: 'fretted', fret: fretNumber };
    }
    
    updateShape(shape.id, { strings: newStrings });
  };

  const handleNutClick = (stringIndex) => {
    const stringData = shape.strings[stringIndex];
    let newStrings = [...shape.strings];
    
    if (stringData.state === 'open') {
      newStrings[stringIndex] = { ...stringData, state: 'muted' };
    } else {
      newStrings[stringIndex] = { ...stringData, state: 'open', fret: 0 };
    }
    
    updateShape(shape.id, { strings: newStrings });
  };

  const setPosition = (pos) => {
    updateShape(shape.id, { position: Math.max(1, pos) });
  };

  const toggleBarre = (fret) => {
    if (shape.barre && shape.barre.fret === fret) {
      updateShape(shape.id, { barre: null });
    } else {
      updateShape(shape.id, { barre: { fret, fromString: 0, toString: numStrings - 1 } });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.positionSelector}>
        <button onClick={() => setPosition(shape.position + 1)}><ChevronUp size={20} /></button>
        <span className={styles.posLabel}>{shape.position}</span>
        <button onClick={() => setPosition(shape.position - 1)}><ChevronDown size={20} /></button>
      </div>

      <div className={styles.fretboard}>
        {/* Nut area */}
        <div className={styles.nutRow}>
          <div className={styles.spacer}></div>
          {shape.strings.map((s, i) => (
            <div 
              key={i} 
              className={clsx(styles.nutCell, styles[s.state])}
              onClick={() => handleNutClick(i)}
            >
              {s.state === 'open' && <div className={styles.openDot} />}
              {s.state === 'muted' && <span className={styles.mutedX}>×</span>}
            </div>
          ))}
        </div>

        {/* Frets */}
        {Array(numFrets).fill(0).map((_, f) => {
          const currentFret = shape.position + f;
          const isBarre = shape.barre && shape.barre.fret === currentFret;

          return (
            <div key={f} className={styles.fretRow}>
              <div 
                className={clsx(styles.fretNumber, isBarre && styles.barreActive)}
                onClick={() => toggleBarre(currentFret)}
                title="Toggle Barre"
              >
                {currentFret}
              </div>
              <div className={styles.cellsContainer}>
                {isBarre && <div className={styles.barreLine} />}
                {Array(numStrings).fill(0).map((_, s) => {
                  const stringData = shape.strings[s];
                  const isFretted = stringData.state === 'fretted' && stringData.fret === currentFret;
                  const noteLabel = shape.analysis?.notes?.find(n => n.string === s)?.label;

                  return (
                    <div 
                      key={s} 
                      className={styles.fretCell}
                      onClick={() => handleFretClick(s, currentFret)}
                    >
                      <div className={styles.stringLine} />
                      {isFretted && (
                        <div className={clsx(styles.fretDot, styles[`interval_${noteLabel?.replace('♭', 'b')?.replace('♯', 's')}`])}>
                          {noteLabel}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
  }
export default FretboardEditor;
