export function exportToASCII(sequence) {
  const { shapes, tuning } = sequence;
  const numStrings = tuning.strings.length;
  const CHUNK_SIZE = 6;
  
  let output = "";
  
  for (let i = 0; i < shapes.length; i += CHUNK_SIZE) {
    const chunk = shapes.slice(i, i + CHUNK_SIZE);
    
    // Header with chord names for this row
    let nameLine = "      ";
    chunk.forEach(shape => {
      const name = shape.analysis?.name || "???";
      nameLine += name.padEnd(10);
    });
    output += nameLine + "\n";

    // Strings from high to low (standard display)
    for (let sIdx = numStrings - 1; sIdx >= 0; sIdx--) {
      const stringName = tuning.strings[sIdx].replace(/\d/, "");
      let line = `${stringName.padEnd(2)} |--`;
      
      chunk.forEach(shape => {
        const s = shape.strings[sIdx];
        let val = "X";
        if (s.state === 'open') val = "0";
        if (s.state === 'fretted') val = s.fret.toString();
        
        line += val.padEnd(3) + "--|  |--";
      });
      
      // Remove trailing |-- and add to output
      output += line.slice(0, -4) + "\n";
    }
    
    output += "\n"; // Newline between rows of 6
  }
  
  return output;
}
