import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import styles from './Sequence.module.css';
import ChordSlot from '../ChordSlot/ChordSlot.jsx';
import { useAppStore } from '../../store/useAppStore.js';
import { Plus } from 'lucide-react';

function Sequence() {
  const { sequence, reorderShapes, addShape, setSequenceName } = useAppStore();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = sequence.shapes.findIndex((s) => s.id === active.id);
      const newIndex = sequence.shapes.findIndex((s) => s.id === over.id);
      reorderShapes(arrayMove(sequence.shapes, oldIndex, newIndex));
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <input 
          className={styles.titleInput}
          value={sequence.name}
          onChange={(e) => setSequenceName(e.target.value)}
          placeholder="Sequence Title..."
        />
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sequence.shapes.map(s => s.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className={styles.list}>
            {sequence.shapes.map((shape) => (
              <ChordSlot key={shape.id} shape={shape} />
            ))}
            <button className={styles.addButton} onClick={addShape}>
              <Plus size={24} />
              <span>Add Shape</span>
            </button>
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default Sequence;
