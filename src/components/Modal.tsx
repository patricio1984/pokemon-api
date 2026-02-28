import React from 'react'
import { motion } from 'framer-motion'
import type { ComponentType } from 'react'

const MDIV = motion.div as unknown as ComponentType<Record<string, unknown>>

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

const modal = {
  hidden: { opacity: 0, scale: 0.98, y: -8 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 28 } }
}

type Props = {
  open: boolean
  onClose: () => void
  children?: React.ReactNode
}

export const Modal: React.FC<Props> = ({ open, onClose, children }) => {
  if (!open) return null

  return (
    <MDIV className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop" initial="hidden" animate="visible" variants={backdrop} onClick={onClose}>
      <MDIV className="bg-surface/95 glass rounded-2xl p-6 w-full max-w-md mx-4" variants={modal} initial="hidden" animate="visible" onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
        {children}
      </MDIV>
    </MDIV>
  )
}

export default Modal
