import React from 'react'
import { motion } from 'framer-motion'
import type { ComponentType } from 'react'
import useInView from '../hooks/useInView'
import { useMagneticEffect } from '../hooks/useMagneticEffect'

const MDIV = motion.div as unknown as ComponentType<Record<string, unknown>>

type Props = {
  id: number
  name: string
  types: string[]
  stats?: Array<{name:string,value:number}>
}

export const PokemonCard: React.FC<Props> = ({ id = 0, name = '—', types = [], stats = [] }) => {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.12 })
  const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
  // compute color from first type
  const map: Record<string,string> = {
    fire: '#FF6B35',
    water: '#4FC3F7',
    electric: '#FFD600',
    psychic: '#FF6B9D',
    dragon: '#7B61FF'
  }

  // magnetic effect for sprite
  const { ref: magRef, springX: magX, springY: magY, handleMouseMove: magHandleMove, handleMouseLeave: magHandleLeave } = useMagneticEffect(0.4)

  // stats bar widths based on value / 255
  const statWidth = (val: number) => `${Math.min(100, Math.round((val / 255) * 100))}%`

  return (
    <MDIV
      ref={ref as React.RefObject<HTMLDivElement>}
      initial={{ opacity: 0, y: 10 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4 }}
      // no backgroundColor animation, glow-hover utility handles visual effects
      className="relative w-full h-30 overflow-hidden transition-all glow-hover"
    >
      {/* background layer */}
      <div className="absolute inset-0 card-bg backdrop-blur-xl border border-white/10 z-0" />
      {/* content layer */}
      <div className="relative z-10 flex items-center w-full h-full"
        style={{ backgroundColor: types.length ? `${map[types[0].toLowerCase()] || '#fff'}0D` : 'rgba(255,255,255,0.05)' }}
      >
      {/* entry number */}
      <div className="pl-4 w-20 text-[#333333] font-terminal text-[60px]">{id}</div>

      {/* name + status */}
      <div className="flex-1 pl-4 relative">
        <span className="absolute inset-0 flex items-center justify-start text-[5rem] font-black text-white/6 pointer-events-none select-none">
          {id}
        </span>
        <div className="flex items-center gap-2 relative z-10">
          <span className="font-display font-bold text-white text-[1.1rem] uppercase">
            {name}
          </span>
          <span className="status-dot" />
        </div>
        <hr className="border-t border-white/20 mt-1" />
      </div>

      {/* types tags */}
      <div className="flex gap-2 mx-4 items-center">
        {types.map((t) => (
          <div key={t} className="flex items-center gap-1">
            <span className="font-mono text-xs uppercase text-slate-500">{t}</span>
            <span className="w-1 h-1 bg-green-400 rounded-full" />
          </div>
        ))}
      </div>

      {/* stats bars (HP, ATK, DEF) */}
      <div className="flex-1 max-w-[30%] ml-4 mr-4 flex items-center space-x-1">
        {['hp','attack','defense'].map((key) => {
          const stat = stats.find((s) => s.name.toLowerCase().includes(key))
          return (
            <div key={key} className="flex-1 h-0.5 bg-yellow" style={{ width: stat ? statWidth(stat.value) : '0%' }} />
          )
        })}
      </div>

      {/* artwork overflow */}
      <div className="w-20 h-20 relative">
        {/* magnetic sprite */}
        <motion.img
          ref={magRef as React.RefObject<HTMLImageElement>}
          src={img}
          alt={name}
          className="absolute top-0 right-4 w-20 h-20 object-contain transform -translate-y-4"
          style={{ x: magX, y: magY }}
          onMouseMove={magHandleMove}
          onMouseLeave={magHandleLeave}
        />
      </div>
      </div> {/* end content layer */}
    </MDIV>
  )
}

export default PokemonCard
