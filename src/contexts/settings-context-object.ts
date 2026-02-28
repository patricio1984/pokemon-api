import { createContext } from 'react'
import type React from 'react'

export type Settings = {
  noise: boolean
  scanlines: boolean
  colorScheme: 'dark' | 'light'
  audio: boolean
}

export type SettingsContextValue = {
  settings: Settings
  toggle: (key: keyof Omit<Settings, 'colorScheme'>) => void
  toggleColorScheme: (scheme: 'dark' | 'light') => void
  setSettings: React.Dispatch<React.SetStateAction<Settings>>
}

export const SettingsContext = createContext<SettingsContextValue | null>(null)
