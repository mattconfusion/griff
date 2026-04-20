// Intervals are semitones from root (0)
// We exclude 0 from the list to match the logic in the plan
export const CHORD_TEMPLATES = [
  { name: "maj", intervals: [4, 7], priority: 10 },
  { name: "min", intervals: [3, 7], priority: 10 },
  { name: "(unison)", intervals: [], priority: 1 },
  { name: "5", intervals: [7], priority: 5 },
  { name: "(maj2)", intervals: [2], priority: 2 },
  { name: "(min3)", intervals: [3], priority: 2 },
  { name: "(maj3)", intervals: [4], priority: 2 },
  { name: "(perf4)", intervals: [5], priority: 2 },
  { name: "(tritone)", intervals: [6], priority: 2 },
  { name: "(maj6)", intervals: [9], priority: 2 },
  { name: "(min7)", intervals: [10], priority: 2 },
  { name: "(maj7)", intervals: [11], priority: 2 },
  { name: "dim", intervals: [3, 6], priority: 9 },
  { name: "aug", intervals: [4, 8], priority: 9 },
  { name: "sus2", intervals: [2, 7], priority: 9 },
  { name: "sus4", intervals: [5, 7], priority: 9 },
  
  { name: "maj7", intervals: [4, 7, 11], priority: 100 },
  { name: "7", intervals: [4, 7, 10], priority: 100 },
  { name: "m7", intervals: [3, 7, 10], priority: 100 },
  { name: "m7b5", intervals: [3, 6, 10], priority: 100 },
  { name: "dim7", intervals: [3, 6, 9], priority: 100 },
  { name: "mM7", intervals: [3, 7, 11], priority: 100 },
  { name: "aug7", intervals: [4, 8, 10], priority: 100 },

  { name: "6", intervals: [4, 7, 9], priority: 90 },
  { name: "m6", intervals: [3, 7, 9], priority: 90 },
  { name: "add9", intervals: [2, 4, 7], priority: 90 },
  { name: "madd9", intervals: [2, 3, 7], priority: 90 },
  { name: "6/9", intervals: [2, 4, 7, 9], priority: 110 },

  { name: "9", intervals: [2, 4, 7, 10], priority: 120 },
  { name: "maj9", intervals: [2, 4, 7, 11], priority: 120 },
  { name: "m9", intervals: [2, 3, 7, 10], priority: 120 },
  
  { name: "11", intervals: [2, 4, 5, 7, 10], priority: 130 },
  { name: "m11", intervals: [2, 3, 5, 7, 10], priority: 130 },
  
  { name: "13", intervals: [2, 4, 7, 9, 10], priority: 140 },
  { name: "maj13", intervals: [2, 4, 7, 9, 11], priority: 140 },

  { name: "7b5", intervals: [4, 6, 10], priority: 100 },
  { name: "7#5", intervals: [4, 8, 10], priority: 100 },
  { name: "7b9", intervals: [1, 4, 7, 10], priority: 110 },
  { name: "7#9", intervals: [3, 4, 7, 10], priority: 110 },
];

export const INTERVAL_NAMES = {
  0: "R",
  1: "b2",
  2: "2",
  3: "b3",
  4: "3",
  5: "4",
  6: "b5",
  7: "5",
  8: "b5", // or #5, context dependent
  9: "6",
  10: "b7",
  11: "7"
};

// More precise interval mapping for annotations
export function getIntervalLabel(semitones) {
  const map = {
    0: "R",
    1: "♭2",
    2: "2",
    3: "♭3",
    4: "3",
    5: "4",
    6: "♭5",
    7: "5",
    8: "♯5",
    9: "6",
    10: "♭7",
    11: "7"
  };
  return map[semitones % 12];
}
