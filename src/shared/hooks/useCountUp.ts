import { useEffect, useRef } from 'react';
import { useMotionValue, animate } from 'framer-motion';

export function useCountUp(
  target: number,
  duration = 2000,
  start = true
) {
  const ref = useRef<HTMLElement>(null);
  const motionValue = useMotionValue(0);

  useEffect(() => {
    if (!start) {
      motionValue.set(0);
      if (ref.current) ref.current.textContent = '0';
      return;
    }

    const controls = animate(motionValue, target, {
      duration: duration / 1000,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        if (ref.current) {
          ref.current.textContent = target % 1 !== 0
            ? latest.toFixed(1)
            : Math.floor(latest).toString();
        }
      },
    });

    return () => controls.stop();
  }, [target, duration, start, motionValue]);

  // count = 0 only used as placeholder; display is handled via ref
  return { ref, count: target };
}
