import React from 'react'
import { motion } from 'framer-motion'

export const CircleDecoration: React.FC = () => (
  <motion.div
    className="fixed top-4 right-4 w-32 h-32 bg-(--hero-accent,#0ff) mix-blend-multiply rounded-full z-20"
    animate={{ rotate: 360 }}
    transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
  >
    <span className="absolute inset-0 flex items-center justify-center">
      <span className="block w-full h-px bg-(--color-acid)" />
      <span className="block h-full w-px bg-(--color-acid)" />
    </span>
  </motion.div>
)

export default CircleDecoration
