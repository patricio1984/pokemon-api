import { useCallback, useEffect, useRef } from 'react'
import { useSettings } from '../../features/settings/useSettings'

// simple hook that returns a function to play an audio asset
export function useAudio(src: string) {
  const { settings } = useSettings()
  const audioRef = useRef(new Audio(src))
  
  useEffect(() => {
    audioRef.current.preload = 'auto'
  }, [])

  const play = useCallback(() => {
    if (!settings.audio) return
    audioRef.current.currentTime = 0
    audioRef.current.play().catch(() => {
      // if the asset fails to load (missing file etc) fall back to a
      // brief synthesized beep so the caller still hears something. this
      // makes the feature work even when there are no wav files in
      // public/sounds/ (which is currently the case in the repo).
      try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        const ctx = new AudioContextClass()
        const osc = ctx.createOscillator()
        osc.type = 'square'
        osc.frequency.value = 440
        osc.connect(ctx.destination)
        osc.start()
        osc.stop(ctx.currentTime + 0.1)
      } catch {
        // ignore if the Web Audio API isn't available
      }
    })
  }, [settings.audio])

  return play
}
