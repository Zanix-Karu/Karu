/**
 * Easing functions for animations.
 * Extracted from AnimatedCounter.tsx for testability.
 */

export function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4)
}
