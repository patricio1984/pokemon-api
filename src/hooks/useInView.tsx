import { useEffect, useRef, useState } from 'react'

type UseInViewOptions = IntersectionObserverInit & {
  /** Stop observing after the element first enters the viewport */
  once?: boolean
  /** Shorthand alias for rootMargin (e.g. '-100px') */
  margin?: string
}

export function useInView<T extends HTMLElement>(options?: UseInViewOptions) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  const once = options?.once
  const margin = options?.margin ?? options?.rootMargin
  const threshold = options?.threshold
  const root = options?.root

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true)
            if (once) obs.disconnect()
          } else if (!once) {
            setInView(false)
          }
        })
      },
      {
        root: root ?? null,
        rootMargin: margin ?? '0px',
        threshold: threshold ?? 0.12,
      }
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [once, margin, threshold, root])

  return { ref, inView }
}

export default useInView
