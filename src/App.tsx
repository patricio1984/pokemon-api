import React from 'react'
import ErrorBoundary from './components/ErrorBoundary'
import Hero from './components/Hero'
import PageTransition from './components/PageTransition'
import { Cursor } from './components/Cursor'
import { motion, useScroll, useTransform } from 'framer-motion'
import useInView from './hooks/useInView'
import { useGamepad } from './hooks/useGamepad'
import Modal from './components/Modal'
import SettingsPanel from './components/SettingsPanel'
import { useAudio } from './hooks/useAudio'
import { useInfiniteQuery } from '@tanstack/react-query'
import { AnimatePresence } from 'framer-motion'

interface Stat {
  name: string
  value: number
}

interface Pokemon {
  id: number
  name: string
  types: string[]
  stats: Stat[]
}

interface PokemonDetail {
  id: number
  name: string
  types: Array<{ type: { name: string } }>
  stats: Array<{ stat: { name: string }; base_stat: number }>
}

const handleGlow = (e: React.MouseEvent<HTMLElement>) => {
  const rect = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
  e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
}

const typeColors: Record<string,string> = {
  fire: '#FF6B35',
  water: '#4FC3F7',
  electric: '#FFD600',
  psychic: '#FF6B9D',
  grass: '#7BD389',
  dragon: '#7B61FF',
}

const PokemonRow: React.FC<{
  pokemon: Pokemon,
  delay: number,
  selected?: boolean,
  onClick?: () => void
}> = ({ pokemon, delay, selected, onClick }) => {
  const { ref } = useInView<HTMLLIElement>({ threshold: 0.12 })
  const primaryType = pokemon.types[0]?.toLowerCase() ?? 'neutral'
  const highlight = typeColors[primaryType] ?? '#0FF'

  return (
    <motion.li
      ref={ref as React.RefObject<HTMLLIElement>}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 140, damping: 18, delay: delay * 0.06 }}
      viewport={{ once: true, margin: '-40px' }}
      className="group outline-none"
    >
      <motion.button
        onMouseMove={handleGlow}
        onClick={onClick}
        aria-label={`Open ${pokemon.name}`}
        tabIndex={selected ? 0 : -1}
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98, transition: { type: 'spring', stiffness: 400, damping: 17 } }}
        transition={{ type: 'spring', stiffness: 180, damping: 20 }}
        className={`cursor-glow relative w-full text-left flex items-center gap-4 py-4 px-4 rounded-lg transition-colors duration-300`}
        style={{ cursor: 'pointer', background: selected ? 'rgba(255,255,255,0.02)' : undefined }}
      >
        <motion.div
          className="shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-surface flex items-center justify-center"
          whileHover={{ scale: 1.06 }}
          transition={{ type: 'spring', stiffness: 220, damping: 20 }}
        >
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
            alt={pokemon.name}
            className="w-full h-full object-contain"
            loading="lazy"
            style={{ filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.6))' }}
          />
        </motion.div>

        <div className="flex-1 flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="font-mono text-xs text-white/40">NO. {String(pokemon.id).padStart(3, '0')}</span>
            <span className="font-display text-xl md:text-2xl font-light tracking-tight mt-1">{pokemon.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex gap-2">
              {pokemon.types.map((t) => (
                <span
                  key={t}
                  className="text-[11px] px-3 py-1 rounded-full font-mono uppercase"
                  style={{ background: 'rgba(255,255,255,0.03)', letterSpacing: '0.12em' }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* subtle colored highlight tied to primary type */}
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            boxShadow: `inset 0 0 40px ${highlight}10`,
            background: `linear-gradient(90deg, ${highlight}10 0%, transparent 40%)`,
            opacity: 0,
          }}
          whileHover={{ opacity: 0.06 }}
          transition={{ duration: 0.25 }}
        />
      </motion.button>
    </motion.li>
  )
}


const PokemonGridCard: React.FC<{
  pokemon: Pokemon,
  onClick?: () => void
}> = ({ pokemon, onClick }) => {
  const primaryType = pokemon.types[0]?.toLowerCase() ?? 'neutral'
  const highlight = typeColors[primaryType] ?? '#0FF'

  return (
    <motion.button
      layout
      onMouseMove={handleGlow}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileTap={{ scale: 0.95, transition: { type: 'spring', stiffness: 400, damping: 17 } }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      onClick={onClick}
      className="cursor-glow relative flex flex-col items-center p-6 rounded-xl bg-white/2 border border-white/4 hover:bg-white/4 hover:border-white/10 transition-colors group aspect-square justify-center gap-4 overflow-hidden"
    >
      <div className="absolute top-3 left-3 font-mono text-[10px] text-white/30 group-hover:text-white/50 transition-colors">
        #{String(pokemon.id).padStart(3, '0')}
      </div>
      
      <motion.div
        whileHover={{ y: -8, scale: 1.1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        className="w-24 h-24 relative z-10"
      >
        <img
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
          alt={pokemon.name}
          className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_var(--card-shadow)]"
          loading="lazy"
        />
      </motion.div>
      
      <div className="text-center relative z-10">
        <span className="font-display text-lg font-light tracking-tight uppercase block leading-none mb-2">{pokemon.name}</span>
        <div className="flex gap-1 justify-center">
          {pokemon.types.map(t => (
            <span key={t} className="text-[9px] font-mono tracking-widest px-2 py-0.5 bg-black/40 rounded-full uppercase" style={{ color: typeColors[t] ?? '#fff' }}>{t}</span>
          ))}
        </div>
      </div>

      {/* subtle ambient light from bottom */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-1/2 rounded-b-xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at bottom, ${highlight}, transparent 70%)`
        }}
      />
    </motion.button>
  )
}

function App() {
  const [focused, setFocused] = React.useState<number>(0)
  const [modalOpen, setModalOpen] = React.useState(false)
  const [settingsOpen, setSettingsOpen] = React.useState(false)
  const clickSound = useAudio('/sounds/click.wav')


const fetchPage = async ({ pageParam = 0 }) => {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${pageParam}&limit=20`)
    const json = await res.json()
    const details = await Promise.all(
      json.results.map(async (item: { url: string }) => {
        const dRes = await fetch(item.url)
        return dRes.json() as Promise<PokemonDetail>
      })
    )
    return {
      nextOffset: pageParam + 20,
      results: details.map((d: PokemonDetail) => ({
        id: d.id,
        name: d.name,
        types: d.types.map((t) => t.type.name),
        stats: d.stats.map((s) => ({ name: s.stat.name, value: s.base_stat })),
      })),
    }
  }

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['pokemon'],
    queryFn: fetchPage,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset,
  })

  const fullList = React.useMemo(
    () => data?.pages.flatMap((page) => page.results) ?? [],
    [data],
  )

  // filtering/search state for "Explore the Data"
  const [searchQuery, setSearchQuery] = React.useState('')
  const [filterType, setFilterType] = React.useState('all')

  const availableTypes = React.useMemo(() => {
    const types = new Set<string>()
    fullList.forEach(p => p.types.forEach((t: string) => types.add(t)))
    return Array.from(types).sort()
  }, [fullList])

  const filteredList = React.useMemo(() => {
    return fullList
      .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .filter(p => filterType === 'all' ? true : p.types.includes(filterType))
  }, [fullList, searchQuery, filterType])

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (fullList.length > 0) {
        if (e.key === 'ArrowDown' || e.key === 's') {
          setFocused((f) => Math.min(f + 1, fullList.length - 1))
          e.preventDefault()
        } else if (e.key === 'ArrowUp' || e.key === 'w') {
          setFocused((f) => Math.max(f - 1, 0))
          e.preventDefault()
        } else if (e.key === 'Enter') {
          setModalOpen(true)
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [fullList])

  useGamepad((dir) => {
    if (fullList.length === 0) return
    if (dir === 'down') setFocused((f) => Math.min(f + 1, fullList.length - 1))
    if (dir === 'up') setFocused((f) => Math.max(f - 1, 0))
    if (dir === 'a') setModalOpen(true)
  })

  const { ref: loadMoreRef, inView: loadMoreInView } = useInView<HTMLLIElement>({ threshold: 0, rootMargin: '200px' })
  const fetchedRef = React.useRef(false)
  React.useEffect(() => {
    if (loadMoreInView) {
      if (!fetchedRef.current && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
        fetchedRef.current = true
      }
    } else {
      fetchedRef.current = false
    }
  }, [loadMoreInView, hasNextPage, isFetchingNextPage, fetchNextPage])

  const appRef = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: appRef, offset: ['start start', 'end end'] })
  const progressHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <div ref={appRef} className="min-h-screen text-white bg-bg-primary overflow-x-hidden selection:bg-white/20">
      
      {/* Cinematic Progress Bar */}
      <motion.div 
        style={{ height: progressHeight }} 
        className="fixed top-0 left-0 w-0.5 bg-white/20 z-50 origin-top"
      />

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9, transition: { type: 'spring', stiffness: 400, damping: 17 } }}
        className="fixed top-8 right-8 bg-panel/50 backdrop-blur-md border border-white/10 text-white/60 hover:text-white hover:bg-surface-hover transition-colors z-50 rounded-full p-2"
        onClick={() => { clickSound(); setSettingsOpen(true) }}
        aria-label="Settings"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
      </motion.button>

      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <Cursor />
      
      <ErrorBoundary>
        <PageTransition>
          <Hero />
          
          <main id="data" className="relative max-w-5xl mx-auto px-6 py-32">
            
            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
              {fullList[focused] && (
                <div className="space-y-8 p-4">
                  <div className="flex flex-col items-center gap-4">
                    <p className="font-mono tracking-widest text-white/30 text-sm">NO. {String(fullList[focused].id).padStart(3, '0')}</p>
                    <h2 className="text-4xl md:text-6xl font-display font-light tracking-tight uppercase">{fullList[focused].name}</h2>
                    <div className="flex gap-2 mt-2">
                        {fullList[focused].types.map((t) => (
                          <span key={t} className="px-3 py-1 border border-white/20 bg-white/5 rounded-full text-[10px] uppercase font-mono tracking-wider">
                            {t}
                          </span>
                        ))}
                    </div>
                  </div>
                  
                  <div className="relative aspect-square w-full max-w-60 mx-auto overflow-hidden rounded-2xl bg-linear-to-tr from-white/5 to-transparent p-8 shadow-inner shadow-white/5">
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${fullList[focused].id}.png`}
                        alt={fullList[focused].name}
                        className="w-full h-full object-contain filter drop-shadow-[0_0_15px_var(--glow-shadow)]"
                        loading="lazy"
                      />
                  </div>

                  <div className="grid grid-cols-2 gap-px bg-white/10 p-px rounded-lg overflow-hidden">
                    {fullList[focused].stats.map((s) => (
                      <div key={s.name} className="flex justify-between items-center bg-surface p-4">
                        <span className="font-mono text-xs text-white/50 uppercase tracking-wider">{s.name.replace('-', ' ')}</span>
                        <span className="font-display text-xl">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Modal>

            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-16 flex flex-col gap-2 border-b border-white/10 pb-6"
            >
              <h2 className="font-display text-3xl font-light tracking-tight">Available Endpoint Data</h2>
              <p className="font-mono text-sm text-white/40 tracking-wide">Select an entry to view structured base statistics.</p>
            </motion.div>

            <ul className="flex flex-col">
              {!data
                ? Array.from({ length: 8 }).map((_, i) => <li key={i} className="h-24 bg-white/2 mb-2 skeleton rounded-lg" />)
                : fullList.map((p, idx) => (
                    <PokemonRow
                      key={p?.id ?? idx}
                      pokemon={p}
                      delay={idx * 0.05}
                      selected={idx === focused}
                      onClick={() => { clickSound(); setFocused(idx); setModalOpen(true) }}
                    />
                  ))}
              <li ref={loadMoreRef} className="h-32 flex items-center justify-center">
                <span className="font-mono text-xs tracking-widest text-white/30 uppercase">
                  {isFetchingNextPage ? (
                  'Fetching subsequent records...'
                ) : hasNextPage ? (
                  <span className="link-underline">Scroll to load additional data</span>
                ) : (
                  'End of dataset.'
                )}
                </span>
              </li>
            </ul>
          
            {/* EXPLORE THE DATA SECTION */}
            <motion.div
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="mt-32 border-t border-white/10 pt-16"
            >
              <div className="mb-12">
                  <motion.h2
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 }
                      }}
                      transition={{
                        duration: 0.6,
                        ease: [0.16, 1, 0.3, 1]
                      }}
                      className="font-display text-3xl font-light tracking-tight mb-8"
                    >
                      Explore the Data
                    </motion.h2>
                  
                  <div className="flex flex-col md:flex-row gap-6 items-end">
                    <div className="relative w-full md:max-w-md group">
                      <input 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by species name..."
                        className="w-full bg-transparent border-0 border-b border-white/20 pb-2 px-0 text-lg font-display focus:border-white focus:ring-0 outline-none transition-colors peer placeholder:text-white/20 rounded-none blend-glow"
                        spellCheck={false}
                      />
                      <motion.div 
                        className="absolute bottom-0 left-0 h-px bg-acid origin-left pointer-events-none"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: searchQuery ? 1 : 0 }}
                        style={{ width: '100%' }}
                        layout
                      />
                      <label className="absolute -top-5 left-0 font-mono text-[10px] tracking-widest text-white/40 uppercase opacity-0 peer-focus:opacity-100 transition-opacity">Query executing...</label>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 flex-1 justify-end">
                      <motion.button whileTap={{ scale: 0.93 }}
                        onClick={() => setFilterType('all')}
                        className={`font-mono text-xs px-4 py-2 rounded-full border transition-colors ${filterType === 'all' ? 'bg-white text-black border-white' : 'border-white/10 hover:border-white/30 text-white/60'}`}
                      >
                        All Elements
                      </motion.button>
                      {availableTypes.map(type => (
                        <motion.button key={type} whileTap={{ scale: 0.93 }}
                          onClick={() => setFilterType(type)}
                          className={`font-mono text-xs px-4 py-2 rounded-full border transition-colors ${filterType === type ? 'bg-white text-black border-white' : 'border-white/10 hover:border-white/30 text-white/60'}`}
                        >
                          {type}
                        </motion.button>
                      ))}
                    </div>
                  </div>
              </div>

              {/* ANIMATED GRID */}
              <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <AnimatePresence mode="popLayout">
                  {filteredList.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} layout
                      className="col-span-full py-20 text-center flex flex-col items-center justify-center border border-white/5 rounded-2xl bg-white/1"
                    >
                      <p className="font-display font-light text-2xl text-white/30 mb-2">No matching records found.</p>
                      <p className="font-mono text-xs tracking-widest text-white/20 uppercase">Adjust query parameters</p>
                    </motion.div>
                  ) : (
                    filteredList.map((pokemon) => (
                      <PokemonGridCard key={pokemon.id} pokemon={pokemon} onClick={() => { clickSound(); setFocused(fullList.findIndex(p => p.id === pokemon.id)); setModalOpen(true); }} />
                    ))
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </main>
        </PageTransition>
      </ErrorBoundary>
    </div>
  )
}

export default App
