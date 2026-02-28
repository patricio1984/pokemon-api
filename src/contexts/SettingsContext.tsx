import React, { useState, useEffect } from 'react'
import { SettingsContext } from './settings-context-object'
import type { Settings, SettingsContextValue } from './settings-context-object'

const DEFAULT: Settings = {
  noise: true,
  scanlines: true,
  colorScheme: 'dark',
  audio: true,
}

// Re-export types for convenience
export type { Settings, SettingsContextValue }

export function SettingsProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const stored = localStorage.getItem('pokedex-settings')
      if (stored) return { ...DEFAULT, ...JSON.parse(stored) }
    } catch {
      // ignore
    }
    return DEFAULT
  })

  useEffect(() => {
    localStorage.setItem('pokedex-settings', JSON.stringify(settings))
    document.documentElement.setAttribute('data-color-scheme', settings.colorScheme)
    document.documentElement.setAttribute('data-noise', settings.noise ? 'true' : 'false')
    if (settings.scanlines) {
      document.body.setAttribute('data-scanlines', 'true')
    } else {
      document.body.removeAttribute('data-scanlines')
    }
  }, [settings])

  function toggle(key: keyof Omit<Settings, 'colorScheme'>) {
    setSettings((s) => ({ ...s, [key]: !s[key] }))
  }

  function toggleColorScheme(scheme: 'dark' | 'light') {
    setSettings((s) => ({ ...s, colorScheme: scheme }))
  }

  return (
    <SettingsContext.Provider value={{ settings, toggle, toggleColorScheme, setSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}
