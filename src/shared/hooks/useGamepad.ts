import { useEffect } from 'react'

// very simple gamepad hook that fires callback with direction string
export function useGamepad(onDirection: (dir: 'up' | 'down' | 'left' | 'right' | 'a') => void) {
  useEffect(() => {
    let raf: number

    const poll = () => {
      const pads = navigator.getGamepads()
      for (const pad of pads) {
        if (!pad) continue
        const dpadX = pad.axes[9] ?? 0
        const dpadY = pad.axes[10] ?? 0
        if (dpadY < -0.5) onDirection('up')
        if (dpadY > 0.5) onDirection('down')
        if (dpadX < -0.5) onDirection('left')
        if (dpadX > 0.5) onDirection('right')
        // buttons for A
        if (pad.buttons[0]?.pressed) onDirection('a')
      }
      raf = requestAnimationFrame(poll)
    }
    raf = requestAnimationFrame(poll)
    return () => cancelAnimationFrame(raf)
  }, [onDirection])
}
