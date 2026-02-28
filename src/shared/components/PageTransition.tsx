import React from 'react'
import type { ComponentType } from 'react'
import { motion, useAnimation } from 'framer-motion'
import type { Variants } from 'framer-motion'

const MDIV = motion.div as unknown as ComponentType<Record<string, unknown>>

const variants: Variants = {
  hidden: { opacity: 0, y: 8 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2,0.9,0.2,1] } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.35 } }
}

export const PageTransition: React.FC<React.PropsWithChildren> = ({ children }) => {
  const overlay = useAnimation()

  React.useEffect(() => {
    overlay.start({ x: '0%', transition: { duration: 0.3 } }).then(() => {
      overlay.start({ x: '100%', transition: { duration: 0.3 } })
    })
  }, [overlay])

  return (
    <>
      <motion.div
        className="fixed inset-0 bg-yellow z-50"
        initial={{ x: '-100%' }}
        animate={overlay}
      />
      <MDIV initial="hidden" animate="enter" exit="exit" variants={variants} className="relative w-full h-full">
        {children}
      </MDIV>
    </>
  )
}

export default PageTransition
