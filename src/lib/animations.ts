/**
 * Nooma Animation System
 * Restrained delight: purposeful, fast, never blocking
 */

// Spring configurations - natural physics-based motion
export const springs = {
  // Snappy: buttons, toggles, quick feedback (≈150ms settle)
  snappy: { type: "spring", stiffness: 400, damping: 30 } as const,

  // Gentle: cards, modals, content transitions (≈200ms settle)
  gentle: { type: "spring", stiffness: 300, damping: 25 } as const,

  // Stiff: drag operations, precise control (≈100ms settle)
  stiff: { type: "spring", stiffness: 600, damping: 35 } as const,

  // Bouncy: celebratory moments only - use sparingly (≈250ms settle)
  bouncy: { type: "spring", stiffness: 500, damping: 15 } as const,
} as const;

// Duration-based animations (max 200ms per design requirement)
export const durations = {
  instant: 0.1, // 100ms - micro-feedback
  fast: 0.15, // 150ms - state changes
  normal: 0.2, // 200ms - transitions (max)
} as const;

// Easing curves for non-spring animations
export const easings = {
  easeOut: [0.0, 0.0, 0.2, 1] as const,
  easeInOut: [0.4, 0.0, 0.2, 1] as const,
  // Custom "snap" easing - quick out, soft land
  snap: [0.25, 0.1, 0.25, 1] as const,
} as const;

// Pre-built animation variants
export const variants = {
  // Fade in/out
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },

  // Scale + fade (for cards, modals)
  scaleIn: {
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.96 },
  },

  // Slide up (for lists, content)
  slideUp: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -4 },
  },

  // Slide in from right (for toasts, sidebars)
  slideRight: {
    initial: { opacity: 0, x: 16 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 16 },
  },

  // Task completion - scale down and fade
  taskComplete: {
    exit: {
      opacity: 0,
      scale: 0.95,
      height: 0,
      marginBottom: 0,
      transition: {
        opacity: { duration: 0.15 },
        scale: { duration: 0.15 },
        height: { duration: 0.2, delay: 0.1 },
        marginBottom: { duration: 0.2, delay: 0.1 },
      },
    },
  },

  // Stagger container for lists
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.02,
      },
    },
  },

  // Stagger child item
  staggerItem: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
  },

  // Button press
  buttonPress: {
    tap: { scale: 0.97 },
  },

  // Card hover lift
  cardHover: {
    rest: { y: 0, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" },
    hover: { y: -2, boxShadow: "0 8px 24px rgba(91,58,58,0.12)" },
  },

  // Shake for errors (3 cycles, gentle)
  shake: {
    animate: {
      x: [0, -4, 4, -4, 4, 0],
      transition: { duration: 0.4 },
    },
  },

  // Pulse for loading
  pulse: {
    animate: {
      opacity: [1, 0.6, 1],
      transition: { duration: 1.2, repeat: Infinity },
    },
  },
} as const;

// Transition presets
export const transitions = {
  spring: springs.snappy,
  springGentle: springs.gentle,
  fast: { duration: durations.fast, ease: easings.easeOut },
  normal: { duration: durations.normal, ease: easings.easeOut },
} as const;
