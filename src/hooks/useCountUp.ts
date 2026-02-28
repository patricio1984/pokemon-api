import { useEffect, useRef, useState } from 'react';

export function useCountUp(
  target: number,
  duration = 2000,
  start = true
) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) {
      // reset if asked
      const id = setTimeout(() => setCount(0), 0);
      return () => clearTimeout(id);
    }

    let startTime: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out expo
      const eased = 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
      else setCount(target);
    };

    requestAnimationFrame(animate);
  }, [target, duration, start]);

  return { ref, count };
}
