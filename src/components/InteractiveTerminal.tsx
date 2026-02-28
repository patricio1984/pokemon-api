import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

interface OutputLine {
  id: number
  text: string
  type: 'stdout' | 'error'
}

const commands: Record<string, (args: string[]) => Promise<string>> = {
  help: async () => {
    return 'Available commands: help, fetch <name>, clear'
  },
  clear: async () => {
    return ''
  },
  fetch: async (args: string[]) => {
    if (!args[0]) return 'Usage: fetch <pokemon>'
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${args[0].toLowerCase()}`)
      if (!res.ok) throw new Error('not found')
      const data = await res.json()
      return JSON.stringify(data, null, 2)
    } catch (e) {
      return `Error: ${(e as Error).message}`
    }
  },
}

const InteractiveTerminal: React.FC = () => {
  const [output, setOutput] = useState<OutputLine[]>([])
  const [cmd, setCmd] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  const addOutput = (text: string, type: 'stdout' | 'error' = 'stdout') => {
    setOutput((o) => [...o, { id: o.length + 1, text, type }])
  }

  const handleCommand = async (input: string) => {
    addOutput(`> ${input}`)
    const [c, ...args] = input.split(' ').filter(Boolean)
    if (!c) return
    const fn = commands[c]
    if (fn) {
      const res = await fn(args)
      if (c === 'clear') {
        setOutput([])
      } else {
        addOutput(res)
      }
    } else {
      addOutput(`Unknown command: ${c}`, 'error')
    }
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleCommand(cmd)
    setCmd('')
  }

  useEffect(() => {
    containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' })
  }, [output])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="terminal-window glass-panel mx-auto mt-8 text-white text-left font-code text-sm max-w-md"
      style={{ borderTop: '1px solid var(--color-acid)' }}
    >
      <div className="terminal-bar flex items-center gap-2 px-2 py-1 relative">
        <div className="absolute top-1 left-1 flex space-x-1">
          <span className="btn btn-clear" />
          <span className="btn btn-maximize" />
          <span className="btn btn-minimize" />
        </div>
        <span className="ml-8 text-white/70 text-xs">INTERACTIVE — zsh — 80x24</span>
      </div>
      <div
        ref={containerRef}
        className="p-4 h-48 overflow-y-auto whitespace-pre-wrap"
      >
        {output.map((line) => (
          <div
            key={line.id}
            className={line.type === 'error' ? 'text-red-400' : ''}
          >
            {line.text}
          </div>
        ))}
      </div>
      <form onSubmit={onSubmit} className="px-4 pb-4">
        <span className="text-acid">$</span>{' '}
        <input
          value={cmd}
          onChange={(e) => setCmd(e.target.value)}
          className="bg-transparent focus:outline-none w-full"
          autoFocus
        />
      </form>
    </motion.div>
  )
}

export default InteractiveTerminal
