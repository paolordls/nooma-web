"use client";

import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { springs, durations, variants, transitions } from "@/lib/animations";
import { ComponentProps, forwardRef } from "react";

// Re-export for convenience
export { motion, AnimatePresence, LayoutGroup };

// Re-export animation configs
export { springs, durations, variants, transitions };

/**
 * Check if user prefers reduced motion
 */
export function usePrefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Get transition based on reduced motion preference
 */
export function getTransition(prefersReduced: boolean) {
  return prefersReduced
    ? { duration: 0 }
    : transitions.spring;
}

/**
 * Motion-enabled div with common presets
 */
export const MotionDiv = motion.div;

/**
 * Fade in wrapper - simple opacity transition
 */
export const FadeIn = forwardRef<
  HTMLDivElement,
  ComponentProps<typeof motion.div>
>(function FadeIn({ children, ...props }, ref) {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: durations.fast }}
      {...props}
    >
      {children}
    </motion.div>
  );
});

/**
 * Scale in wrapper - for modals, cards
 */
export const ScaleIn = forwardRef<
  HTMLDivElement,
  ComponentProps<typeof motion.div>
>(function ScaleIn({ children, ...props }, ref) {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={springs.gentle}
      {...props}
    >
      {children}
    </motion.div>
  );
});

/**
 * Slide up wrapper - for lists, content
 */
export const SlideUp = forwardRef<
  HTMLDivElement,
  ComponentProps<typeof motion.div>
>(function SlideUp({ children, ...props }, ref) {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={springs.gentle}
      {...props}
    >
      {children}
    </motion.div>
  );
});

/**
 * Stagger container - wraps children with staggered animation
 */
export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.04,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="initial"
      animate="animate"
      variants={{
        animate: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.02,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger item - child of StaggerContainer
 */
export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
      }}
      transition={springs.gentle}
    >
      {children}
    </motion.div>
  );
}

/**
 * List item with exit animation - for task lists
 */
export const ListItem = forwardRef<
  HTMLLIElement,
  ComponentProps<typeof motion.li> & { layoutId?: string }
>(function ListItem({ children, layoutId, ...props }, ref) {
  return (
    <motion.li
      ref={ref}
      layout={!!layoutId}
      layoutId={layoutId}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{
        opacity: 0,
        scale: 0.95,
        transition: { duration: durations.fast },
      }}
      transition={springs.gentle}
      {...props}
    >
      {children}
    </motion.li>
  );
});
