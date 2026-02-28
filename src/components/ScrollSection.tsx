import React from 'react'
import { motion } from 'framer-motion'
import useInView from '../hooks/useInView'

// wrapper that animates children when scrolled into view
type ScrollProps = React.PropsWithChildren<{ delay?: number }>

export const ScrollSection: React.FC<ScrollProps> = ({ children, delay = 0 }) => {
  const { ref, inView } = useInView<HTMLDivElement>({ once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ type: 'spring', stiffness: 200, damping: 20, delay }}
    >
      {children}
    </motion.div>
  )
}

export default ScrollSection
