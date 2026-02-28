import { useEffect, useState } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';

export function useScrambleText(finalText: string, duration = 1200) {
  // start with a jumble of random chars to avoid ugly underscores
  const randomString = finalText
    .split('')
    .map((ch) => (ch === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)]))
    .join('');
  const [display, setDisplay] = useState(() => randomString);

  useEffect(() => {
    let frame = 0;
    const totalFrames = duration / 16; // ~60fps
    const revealed = new Array(finalText.length).fill(false);

    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;

      // Reveal characters from left to right as progress increases
      const revealUpTo = Math.floor(progress * finalText.length);
      for (let i = 0; i < revealUpTo; i++) revealed[i] = true;

      setDisplay(
        finalText
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' ';
            if (revealed[i]) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('')
      );

      if (frame >= totalFrames) clearInterval(interval);
    }, 16);

    return () => clearInterval(interval);
  }, [finalText, duration]);

  return display;
}
