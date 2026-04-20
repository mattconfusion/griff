export const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
export const NOTES_FLAT = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

export const NOTE_TO_SEMITONE = {
  "C": 0, "C#": 1, "Db": 1, "D": 2, "D#": 3, "Eb": 3, "E": 4, "F": 5, "F#": 6, "Gb": 6, "G": 7, "G#": 8, "Ab": 8, "A": 9, "A#": 10, "Bb": 10, "B": 11
};

export function parseNote(noteStr) {
  const match = noteStr.match(/^([A-G][#b]?)(-?\d+)$/);
  if (!match) return null;
  const name = match[1];
  const octave = parseInt(match[2], 10);
  const semitone = (octave + 1) * 12 + NOTE_TO_SEMITONE[name];
  return { name, octave, semitone };
}

export function getNoteName(semitone, preferFlats = false) {
  const pc = ((semitone % 12) + 12) % 12;
  return preferFlats ? NOTES_FLAT[pc] : NOTES[pc];
}

export function getOctave(semitone) {
  return Math.floor(semitone / 12) - 1;
}

export function formatNote(semitone, preferFlats = false) {
  return `${getNoteName(semitone, preferFlats)}${getOctave(semitone)}`;
}
