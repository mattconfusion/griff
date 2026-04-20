import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styles from './ChordSlot.module.css';
import { useAppStore } from '../../store/useAppStore.js';
import { X } from 'lucide-react';
import { clsx } from 'clsx';

function ChordSlot({ shape }) {
  const { activeShapeId, setActiveShape, removeShape } = useAppStore();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: shape.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1
  };

  const isActive = activeShapeId === shape.id;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(styles.slot, isActive && styles.active)}
      onClick={() => setActiveShape(shape.id)}
    >
      <div className={styles.header} {...attributes} {...listeners}>
        <span className={styles.name}>{shape.analysis?.name || "???"}</span>
        <button 
          className={styles.removeBtn}
          onClick={(e) => {
            e.stopPropagation();
            removeShape(shape.id);
          }}
        >
          <X size={14} />
        </button>
      </div>
      
      <div className={styles.preview}>
        <MiniFretboard shape={shape} />
      </div>
      
      <div className={styles.footer}>
        pos {shape.position}
      </div>
    </div>
  );
}

function MiniFretboard({ shape }) {
  const numStrings = shape.strings.length;
  const numFrets = 4;
  
  return (
    <div className={styles.miniFretboard}>
      {Array(numStrings).fill(0).map((_, s) => (
        <div key={s} className={styles.string}>
          {Array(numFrets).fill(0).map((_, f) => {
            const stringData = shape.strings[s];
            const isFretted = stringData.state === 'fretted' && stringData.fret === shape.position + f;
            return (
              <div key={f} className={styles.fret}>
                {isFretted && <div className={styles.dot} />}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default ChordSlot;
