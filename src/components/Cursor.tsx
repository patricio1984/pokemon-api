import React, { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useSettings } from '../hooks/useSettings'

export const Cursor: React.FC = () => {
  const { settings } = useSettings()
  const [isTouch, setIsTouch] = React.useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
  )

  useEffect(() => {
    const mql = window.matchMedia('(pointer: coarse)')
    const onChange = (e: MediaQueryListEvent) => setIsTouch(e.matches)
    if (mql.addEventListener) {
      mql.addEventListener('change', onChange)
    } else {
      // fallback for older browsers
      (mql as MediaQueryList).addListener(onChange as (this: MediaQueryList, ev: MediaQueryListEvent) => void)
    }
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener('change', onChange)
      } else {
        // fallback for older browsers
        (mql as MediaQueryList).removeListener(onChange as (this: MediaQueryList, ev: MediaQueryListEvent) => void)
      }
    }
  }, [])

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  const dotX = useSpring(cursorX, { stiffness: 500, damping: 30 })
  const dotY = useSpring(cursorY, { stiffness: 500, damping: 30 })
  const ringX = useSpring(cursorX, { stiffness: 120, damping: 20 })
  const ringY = useSpring(cursorY, { stiffness: 120, damping: 20 })

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 6)
      cursorY.set(e.clientY - 6)
    }
    window.addEventListener('mousemove', moveCursor)
    return () => window.removeEventListener('mousemove', moveCursor)
  }, [cursorX, cursorY])

  const blendMode = settings.colorScheme === 'light' ? 'normal' : 'difference'

  if (isTouch) return null

  return (
    <>
      {/* main dot */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed w-3 h-3 rounded-full bg-current"
        style={{
          left: dotX,
          top: dotY,
          zIndex: 9999,
          mixBlendMode: blendMode,
        }}
      />
      {/* outer ring */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed w-8 h-8 rounded-full border border-current/40"
        style={{
          left: ringX,
          top: ringY,
          zIndex: 9998,
          translateX: '-25%',
          translateY: '-25%',
          mixBlendMode: blendMode,
        }}
      />
    </>
  )
}

