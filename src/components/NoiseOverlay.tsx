// the overlay component used to render extra noise over the entire
// viewport. noise is now driven by a CSS rule that checks
// `html[data-noise="true"]` and the `useSettings` hook already manages
// that attribute, so this component is effectively a no-op. it remains here
// only for backwards compatibility in case someone still imports it.

export function NoiseOverlay() {
  return null
}
