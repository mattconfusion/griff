# Griff — Guitar Chord Sequence App
## Product Plan & Architecture

---

## 1. Overview

**Griff** is a browser-based single-page application for guitarists to compose, analyse, and export sequences of chord shapes in any tuning. It combines a visual fretboard editor with a real-time music theory engine that names chords and annotates the harmonic function of each note.

**Target user:** guitarists who work across alternate tunings (DADGAD, open G, drop D, etc.) and need a lightweight, shareable way to notate chord voicings without a full DAW or notation editor.

---

## 2. Core Feature Set

### 2.1 Tuning Definition
- User defines the tuning of each string (default: E A D G B E, standard)
- Input: note name + octave per string (e.g. `D2`, `A2`, `D3`, `G3`, `B3`, `E4`)
- Named presets: Standard, Drop D, Open G, Open D, DADGAD, Half-step Down, etc.
- Custom tunings can be saved locally and reused across sequences
- Tuning change re-analyses all shapes in the current sequence

### 2.2 Chord Shape Editor
- Visual fretboard grid: configurable number of strings (4–8) and fret span (typically 4–5 frets)
- Per-shape controls:
  - Click a cell to toggle a fretted note; click open-string dot to mark it open; X to mute
  - Barre indicator: drag across a fret row to mark a barre
  - Position selector: set the lowest fret number shown (for capo / upper-position shapes)
  - Optional fingering labels (1–4, T)
- Each shape lives in a **sequence slot** (numbered, reorderable via drag-and-drop)
- Add / duplicate / delete / reorder slots

### 2.3 Chord Recognition & Theory Engine

This is the analytical core of the app. All logic runs client-side (no server).

#### 2.3.1 Note Resolution
Given a shape and a tuning, resolve each sounding string to an absolute pitch:

```
pitch = tuning_open_note + fret_number   (in semitones from C0)
```

Collect the unique pitch-classes (mod 12) present in the shape.

#### 2.3.2 Chord Identification
- Build a **pitch-class set** from the resolved notes
- For every possible root candidate, compare the interval set against a **chord template library**:
  - Triads: maj, min, dim, aug, sus2, sus4
  - Seventh chords: maj7, 7, min7, minMaj7, dim7, m7b5, aug7
  - Extended: 9, maj9, add9, 11, 13, 6, 6/9
  - Altered: 7b5, 7#5, 7b9, 7#9, 7b5b9, 7#11
  - Power chord / dyad / unison edge cases
- Score candidates by: completeness of match → fewest extra notes → most common voicing
- Output: primary name + enharmonic alias + inversion marker (e.g. `Dm7/F` for first inversion)
- Display name uses standard notation: `A♯m7♭5`, `Cmaj7`, `G7sus4`, etc.
- If no clean match: display pitch-class set as a "cluster" label

#### 2.3.3 Note Function Annotation
For each sounding note in a recognised chord, label its harmonic role:

| Label | Meaning |
|---|---|
| **R** | Root |
| **♭2 / 2** | Flat/natural second (ninth) |
| **♭3 / 3** | Minor/major third |
| **4 / ♯4** | Perfect/augmented fourth (eleventh) |
| **♭5 / 5 / ♯5** | Diminished/perfect/augmented fifth |
| **♭6 / 6** | Minor/major sixth (thirteenth) |
| **♭7 / 7** | Minor/major seventh |

Each fretted cell in the diagram is colour-coded and labelled by function (toggleable overlay).

---

## 3. User Interface Layout

```
┌─────────────────────────────────────────────────────────┐
│  Griff                          [Tuning] [⚙] [?]   │
├─────────────────────────────────────────────────────────┤
│  Tuning bar:  E2 A2 D3 G3 B3 E4   [Presets ▾] [Edit]   │
├─────────────────────────────────────────────────────────┤
│  Sequence:                                              │
│  ┌──────┐ ┌──────┐ ┌──────┐  [+ Add Shape]             │
│  │ Dm7  │ │ G7   │ │ Cmaj7│                             │
│  │[grid]│ │[grid]│ │[grid]│                             │
│  │ pos3 │ │ pos1 │ │ pos5 │                             │
│  └──────┘ └──────┘ └──────┘                             │
│  ← drag to reorder →                                    │
├─────────────────────────────────────────────────────────┤
│  Active Shape Editor                                    │
│  ┌─────────────────────────────────┐                   │
│  │  Fretboard grid (4–5 frets)     │  Chord Info       │
│  │  strings: ○ ● ● ● ○ ×          │  ──────────       │
│  │  fret labels + barre indicator  │  Name: Dm7        │
│  │                                 │  Root: D          │
│  │  [Function overlay toggle]      │  Intervals:       │
│  └─────────────────────────────────┘  R  ♭3  5  ♭7    │
│                                       D   F   A   C    │
├─────────────────────────────────────────────────────────┤
│  [Save Sequence] [Export ASCII Tab] [Export JSON]       │
│  [Import JSON]   [Load Sequence ▾]                      │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Data Model

### 4.1 Tuning
```json
{
  "id": "uuid",
  "name": "DADGAD",
  "strings": ["D2","A2","D3","G3","A3","D4"]
}
```

### 4.2 ChordShape
```json
{
  "id": "uuid",
  "label": "Dm7",
  "position": 5,
  "strings": [
    { "string": 0, "state": "muted" },
    { "string": 1, "state": "open" },
    { "string": 2, "fret": 7 },
    { "string": 3, "fret": 5 },
    { "string": 4, "fret": 6 },
    { "string": 5, "fret": 5 }
  ],
  "barre": { "fret": 5, "fromString": 1, "toString": 5 },
  "fingering": [null, 0, 3, 1, 2, 1],
  "analysis": {
    "pitchClasses": [2, 5, 9, 0],
    "root": "D",
    "name": "Dm7",
    "intervals": ["R", "♭3", "5", "♭7"],
    "inversion": 0
  }
}
```

### 4.3 Sequence
```json
{
  "id": "uuid",
  "name": "ii-V-I in C",
  "tuning": { ... },
  "shapes": [ { ... }, { ... }, { ... } ],
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

---

## 5. ASCII Tab Export Format

Export renders each chord as a vertical "frame" in standard ASCII tablature style:

```
  Dm7      G7       Cmaj7
E |--5--|  |--3--|  |--8--|
B |--6--|  |--3--|  |--8--|
G |--5--|  |--4--|  |--9--|
D |--7--|  |--5--|  |--10-|
A |--5--|  |--5--|  |--10-|
E |--X--|  |--3--|  |--8--|
```

Options:
- Show chord name above
- Show function labels below each string column
- Show finger numbers inside the fret cells

---

## 6. JSON Import / Export

Full sequences export as self-contained JSON including the embedded tuning definition, so they are portable across sessions and shareable as files. Import validates the schema and resolves any tuning differences before loading.

---

## 7. Storage Strategy

| Data | Mechanism |
|---|---|
| Sequences in progress | `localStorage` (auto-save on change) |
| Named saved sequences | `localStorage` keyed by sequence id |
| Custom tuning presets | `localStorage` |
| Export / import | File download / `<input type="file">` |

No backend or account required. All data stays in the browser.

---

## 8. Technology Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | **React** (via Vite) | Component model maps cleanly to shape/sequence structure |
| State | **Zustand** | Lightweight, no boilerplate, easy persistence middleware |
| Music theory | **Custom JS module** (`theory.js`) | No dependency bloat; full control over chord templates |
| Styling | **CSS Modules** + custom properties | Scoped, no runtime overhead |
| Drag-and-drop | **@dnd-kit/core** | Accessible, modern, no jQuery |
| Storage | `localStorage` via Zustand persist | Zero-config |
| Testing | **Vitest** + **@testing-library/react** | |

The theory engine (`theory.js`) is a standalone, framework-agnostic module and can be extracted and reused independently (e.g. in the MCP server context).

---

## 9. Module Breakdown

```
src/
├── App.jsx
├── components/
│   ├── TuningBar/          # Tuning display, preset picker, editor modal
│   ├── Sequence/           # Horizontal scroll of chord slots
│   ├── ChordSlot/          # Thumbnail fretboard + chord name
│   ├── FretboardEditor/    # Active shape editing grid
│   ├── ChordInfo/          # Name, intervals, note function table
│   └── Toolbar/            # Save, export, import controls
├── theory/
│   ├── notes.js            # Note → semitone maps, enharmonics
│   ├── tuning.js           # Tuning resolution, open note parsing
│   ├── chordTemplates.js   # Interval set → chord name dictionary
│   ├── analyser.js         # Shape + tuning → analysis object
│   └── asciiExport.js      # Sequence → ASCII tab string
├── store/
│   └── useAppStore.js      # Zustand store: tuning, sequence, UI state
└── utils/
    ├── storage.js           # localStorage helpers
    └── exportImport.js      # JSON schema, validation, file I/O
```

---

## 10. Theory Engine Design Notes

### Chord Template Structure
Each template is stored as a **frozenset of intervals** (semitones from root, root = 0 excluded):

```javascript
const TEMPLATES = [
  { intervals: [4, 7],          name: "maj",     priority: 10 },
  { intervals: [3, 7],          name: "min",     priority: 10 },
  { intervals: [4, 7, 11],      name: "maj7",    priority: 9  },
  { intervals: [4, 7, 10],      name: "7",       priority: 9  },
  { intervals: [3, 7, 10],      name: "m7",      priority: 9  },
  { intervals: [3, 6, 10],      name: "m7♭5",   priority: 8  },
  // ... etc
];
```

### Inversion Detection
After matching, check if the lowest-pitched sounding note equals the root. If not, identify bass note and append slash notation: `Dm7/F`.

### Enharmonic Normalisation
Internally use integer pitch-classes (0–11). Display names are resolved through a context-sensitive enharmonic map (prefer flats in flat keys, sharps in sharp keys — defaulting to sharps for now, user-selectable).

---

## 11. Phased Delivery

### Phase 1 — Core (MVP)
- Tuning bar with standard presets
- Single chord shape editor (fretboard grid, open/muted/fretted)
- Chord recognition and name display
- Sequence of up to 16 shapes

### Phase 2 — Theory Overlay
- Note function colour coding (R / ♭3 / 5 / ♭7 etc.)
- Inversion detection and slash chord notation
- Extended / altered chord templates

### Phase 3 — Persistence & Export
- `localStorage` save/load with named sequences
- ASCII tab export
- JSON export / import

### Phase 4 — Polish
- Barre chord visual indicator
- Fingering number display
- Custom tuning save/name
- Drag-and-drop sequence reorder
- Mobile touch support on fretboard grid

---

## 12. Out of Scope (v1)

- Audio playback / MIDI output
- Scale / mode suggestions relative to sequence
- Multi-instrument support (bass, ukulele — though string count is configurable)
- User accounts or cloud sync
- Collaborative editing
