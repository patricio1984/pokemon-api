import { motion } from 'framer-motion'

const items = ['REST API', '◆', '1025 POKÉMON', '◆', 'FAST & FREE', '◆', '40+ ENDPOINTS', '◆']

export function Ticker() {
  return (
    <div className="overflow-hidden bg-(--color-yellow) py-2">
      <motion.div
        className="flex gap-8 whitespace-nowrap font-mono text-xs font-bold tracking-widest text-black uppercase"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        {[...items, ...items].map((item, i) => (
          <span key={i}>{item}</span>
        ))}
      </motion.div>
    </div>
  )
}
