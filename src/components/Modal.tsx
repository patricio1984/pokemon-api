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
    <MDIV
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', background: 'var(--modal-overlay)' }}
      initial="hidden" animate="visible" variants={backdrop} onClick={onClose}
    >
      <MDIV
        className="relative w-full max-w-md mx-4 max-h-[90dvh] overflow-y-auto rounded-2xl p-6"
        style={{
          color: 'var(--modal-text)',
          background: 'var(--modal-bg)',
          backdropFilter: 'blur(24px) saturate(160%)',
          WebkitBackdropFilter: 'blur(24px) saturate(160%)',
          border: '1px solid var(--modal-border)',
          boxShadow: '0 8px 48px rgba(0,0,0,0.35), inset 0 1px 0 var(--modal-inset)',
        }}
        variants={modal} initial="hidden" animate="visible" onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        {children}
      </MDIV>
    </MDIV>
  )
}

export default Modal
