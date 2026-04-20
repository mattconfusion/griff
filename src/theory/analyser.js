import { CHORD_TEMPLATES, getIntervalLabel } from './chordTemplates.js';
import { getNoteName } from './notes.js';

export function analyzeShape(shape, tuningBaseSemitones) {
  const soundingNotes = [];
  shape.strings.forEach((s, i) => {
    if (s.state === 'fretted') {
      soundingNotes.push({
        string: i,
        semitone: tuningBaseSemitones[i] + s.fret,
        pc: (tuningBaseSemitones[i] + s.fret) % 12
      });
    } else if (s.state === 'open') {
      soundingNotes.push({
        string: i,
        semitone: tuningBaseSemitones[i],
        pc: tuningBaseSemitones[i] % 12
      });
    }
  });

  if (soundingNotes.length === 0) return null;

  // Sort sounding notes by pitch to find the bass note
  soundingNotes.sort((a, b) => a.semitone - b.semitone);
  const bassNote = soundingNotes[0];
  const uniquePCs = [...new Set(soundingNotes.map(n => n.pc))];

  // Special case for single note / unisons
  if (uniquePCs.length === 1) {
    const rootName = getNoteName(uniquePCs[0]);
    return {
      name: rootName + " (unison)",
      root: rootName,
      bass: getNoteName(bassNote.pc),
      notes: soundingNotes.map(n => ({ ...n, label: "R" })),
      intervals: ["R"]
    };
  }

  let bestMatch = null;

  // Try each unique pitch class as a potential root
  uniquePCs.forEach(rootPC => {
    const relativeIntervals = uniquePCs
      .map(pc => (pc - rootPC + 12) % 12)
      .filter(interval => interval !== 0)
      .sort((a, b) => a - b);

    CHORD_TEMPLATES.forEach(template => {
      // Check if template intervals are a subset of relativeIntervals
      const match = template.intervals.every(ti => relativeIntervals.includes(ti));
      if (match) {
        const extraNotes = relativeIntervals.filter(ri => !template.intervals.includes(ri));
        const score = template.priority - extraNotes.length * 2;
        
        if (!bestMatch || score > bestMatch.score) {
          bestMatch = {
            rootPC,
            template,
            extraNotes,
            score,
            relativeIntervals: [0, ...relativeIntervals]
          };
        }
      }
    });
  });

  // Fallback if no template matches: identify as a cluster based on the lowest note
  if (!bestMatch) {
    const bassRootName = getNoteName(bassNote.pc);
    const clusterNotes = uniquePCs.map(pc => getNoteName(pc)).join(" ");
    
    return {
      name: `Cluster: ${clusterNotes}`,
      root: bassRootName,
      bass: bassRootName,
      notes: soundingNotes.map(n => {
        const interval = (n.pc - bassNote.pc + 12) % 12;
        return { ...n, label: getIntervalLabel(interval) };
      }),
      intervals: uniquePCs.map(pc => getIntervalLabel((pc - bassNote.pc + 12) % 12))
    };
  }

  const rootName = getNoteName(bestMatch.rootPC);
  const bassName = getNoteName(bassNote.pc);
  let chordName = rootName + bestMatch.template.name;
  
  if (bestMatch.rootPC !== bassNote.pc) {
    chordName += "/" + bassName;
  }

  // Annotate each sounding note with its function relative to the recognized root
  const annotatedNotes = soundingNotes.map(n => {
    const interval = (n.pc - bestMatch.rootPC + 12) % 12;
    return {
      ...n,
      label: getIntervalLabel(interval)
    };
  });

  return {
    name: chordName,
    root: rootName,
    bass: bassName,
    notes: annotatedNotes,
    intervals: bestMatch.relativeIntervals.map(getIntervalLabel)
  };
}
