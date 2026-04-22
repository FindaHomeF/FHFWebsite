/**
 * Single source for motion timing (Framer Motion + CSS transitions).
 * Easing matches a smooth ease-out curve used across entrances and hovers.
 */

export const MOTION_EASE = [0.4, 0, 0.2, 1]

export const MOTION_DURATION = {
  /** Tooltips, cursor-follow, small UI */
  micro: 0.2,
  /** Carousels, cross-fades */
  quick: 0.3,
  /** Hero lines, scroll reveals, in-view sections */
  base: 0.5,
}

export const MOTION_DELAY = {
  heroSubtitle: 0.08,
  heroCta: 0.14,
  /** Staggered blocks (e.g. About counters row) */
  block1: 0.2,
  block2: 0.4,
}

/** Multiply by index for chained `<RevealOnScroll>` sections */
/** Stagger unit (seconds) for chained scroll reveals — `motionSectionDelay(3)` → 0.06s */
export const MOTION_SECTION_STEP = 0.02

export function motionSectionDelay(units) {
  return units * MOTION_SECTION_STEP
}

export const REVEAL = {
  y: 20,
  viewportAmount: 0.2,
}

/** Framer Motion transition objects */
export const motionTransition = {
  reveal: (delay = 0) => ({
    duration: MOTION_DURATION.base,
    ease: MOTION_EASE,
    delay,
  }),
  heroTitle: () => ({
    duration: MOTION_DURATION.base,
    ease: MOTION_EASE,
  }),
  heroSubtitle: () => ({
    duration: MOTION_DURATION.base,
    ease: MOTION_EASE,
    delay: MOTION_DELAY.heroSubtitle,
  }),
  heroCta: () => ({
    duration: MOTION_DURATION.base,
    ease: MOTION_EASE,
    delay: MOTION_DELAY.heroCta,
  }),
  inView: (delay = 0) => ({
    duration: MOTION_DURATION.base,
    ease: MOTION_EASE,
    delay,
  }),
  testimonialSlide: {
    x: { type: 'spring', stiffness: 200, damping: 25 },
    opacity: { duration: MOTION_DURATION.quick, ease: MOTION_EASE },
    scale: { duration: MOTION_DURATION.quick, ease: MOTION_EASE },
  },
  micro: () => ({
    duration: MOTION_DURATION.micro,
    ease: MOTION_EASE,
  }),
}

/**
 * Tailwind-friendly transition classes aligned with MOTION_DURATION.quick
 * and MOTION_EASE (approximated with ease-out).
 */
export const MOTION_INTERACTION_CLASS =
  `duration-[${Math.round(MOTION_DURATION.quick * 1000)}ms] ease-out`
