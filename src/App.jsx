import React, { useEffect } from 'react';
import styles from './App.module.css';
import TuningBar from './components/TuningBar/TuningBar';
import Sequence from './components/Sequence/Sequence';
import FretboardEditor from './components/FretboardEditor/FretboardEditor';
import ChordInfo from './components/ChordInfo/ChordInfo';
import Toolbar from './components/Toolbar/Toolbar';
import { useAppStore } from './store/useAppStore';

function App() {
  const { sequence, activeShapeId, setActiveShape, addShape, reanalyzeAll } = useAppStore();

  useEffect(() => {
    // Ensure all shapes are analyzed on mount (in case storage was empty or for first run)
    reanalyzeAll();
    
    // Set first shape as active if none is active
    if (!activeShapeId && sequence.shapes.length > 0) {
      setActiveShape(sequence.shapes[0].id);
    }
  }, []); // Only on mount

  const activeShape = sequence.shapes.find(s => s.id === activeShapeId);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>Griff</h1>
        <div className={styles.controls}>
          <Toolbar />
        </div>
      </header>
      
      <main className={styles.main}>
        <section className={styles.tuningSection}>
          <TuningBar />
        </section>

        <section className={styles.sequenceSection}>
          <Sequence />
        </section>

        <section className={styles.editorSection}>
          <div className={styles.editorLayout}>
            {activeShape ? (
              <>
                <div className={styles.fretboardContainer}>
                  <FretboardEditor shape={activeShape} />
                </div>
                <div className={styles.infoContainer}>
                  <ChordInfo shape={activeShape} />
                </div>
              </>
            ) : (
              <div className={styles.emptyState}>
                <p>Select a chord or add a new one to start editing.</p>
                <button onClick={addShape}>Add Chord</button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
