import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { PRESETS } from '../theory/tuning.js';
import { analyzeShape } from '../theory/analyser.js';
import { resolveTuning } from '../theory/tuning.js';

const createDefaultShape = (numStrings = 6) => ({
  id: uuidv4(),
  position: 1,
  strings: Array(numStrings).fill(0).map((_, i) => ({ string: i, state: 'muted', fret: 0 })),
  barre: null,
  analysis: null
});

export const useAppStore = create(
  persist(
    (set, get) => ({
      tuning: PRESETS[0],
      sequence: {
        id: uuidv4(),
        name: "Untitled Sequence",
        shapes: [createDefaultShape(6)]
      },
      activeShapeId: null,
      
      setTuning: (tuning) => {
        set({ tuning });
        get().reanalyzeAll();
      },

      updateTuningString: (index, newNote) => {
        set((state) => {
          const newStrings = [...state.tuning.strings];
          newStrings[index] = newNote;
          return {
            tuning: {
              ...state.tuning,
              name: "Custom",
              strings: newStrings
            }
          };
        });
        get().reanalyzeAll();
      },

      setSequenceName: (name) => {
        set((state) => ({
          sequence: {
            ...state.sequence,
            name
          }
        }));
      },
      
      addShape: () => {
        const newShape = createDefaultShape(get().tuning.strings.length);
        set((state) => ({
          sequence: {
            ...state.sequence,
            shapes: [...state.sequence.shapes, newShape]
          },
          activeShapeId: newShape.id
        }));
        get().reanalyzeShape(newShape.id);
      },
      
      updateShape: (shapeId, updates) => {
        set((state) => ({
          sequence: {
            ...state.sequence,
            shapes: state.sequence.shapes.map(s => 
              s.id === shapeId ? { ...s, ...updates } : s
            )
          }
        }));
        get().reanalyzeShape(shapeId);
      },

      removeShape: (shapeId) => {
        set((state) => ({
          sequence: {
            ...state.sequence,
            shapes: state.sequence.shapes.filter(s => s.id !== shapeId)
          },
          activeShapeId: state.activeShapeId === shapeId ? null : state.activeShapeId
        }));
      },

      setActiveShape: (id) => set({ activeShapeId: id }),

      reanalyzeShape: (shapeId) => {
        const state = get();
        const tuningBase = resolveTuning(state.tuning.strings);
        const shape = state.sequence.shapes.find(s => s.id === shapeId);
        if (!shape) return;

        const analysis = analyzeShape(shape, tuningBase);
        
        set((state) => ({
          sequence: {
            ...state.sequence,
            shapes: state.sequence.shapes.map(s => 
              s.id === shapeId ? { ...s, analysis } : s
            )
          }
        }));
      },

      reanalyzeAll: () => {
        const state = get();
        state.sequence.shapes.forEach(s => get().reanalyzeShape(s.id));
      },

      reorderShapes: (newShapes) => {
        set((state) => ({
          sequence: {
            ...state.sequence,
            shapes: newShapes
          }
        }));
      }
    }),
    {
      name: 'griff-storage',
    }
  )
);
