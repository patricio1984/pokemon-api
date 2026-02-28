import { useEffect, useRef, useState } from 'react';

const LINES = [
  'POKÉDEX OS v2.0.1 — INITIALIZING...',
  'MOUNTING FILESYSTEMS...',
  'LOADING SPECIES DATABASE... [████████] 100%',
  'STARTING GRAPHICS DRIVER...',
  'NETWORK: CONNECTED — api.pokedex.premium',
  'INITIALIZING UI MODULES...',
  'STATUS: ALL SYSTEMS NOMINAL',
];

export function useBootSequence(onLine?: (line: string) => void) {
  const [lines, setLines] = useState<string[]>([]);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    let lineIndex = 0;
    const addLine = () => {
      if (lineIndex >= LINES.length) return;
      const text = LINES[lineIndex];
      setLines(prev => [...prev, text]);
      onLine?.(text);
      lineIndex++;
      setTimeout(addLine, 600);
    };
    setTimeout(addLine, 300);
  }, [onLine]);

  return lines;
}
