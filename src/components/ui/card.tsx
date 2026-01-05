"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { springs } from "@/lib/animations";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative rounded-lg border border-border/60 bg-card text-card-foreground",
        "shadow-sm shadow-burgundy/[0.02]",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

/**
 * Animated Card with hover lift effect
 * Use for interactive cards that should respond to hover/touch
 */
interface CardAnimatedProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  disableHover?: boolean;
}

const CardAnimated = React.forwardRef<HTMLDivElement, CardAnimatedProps>(
  ({ className, disableHover = false, ...props }, ref) => (
    <motion.div
      ref={ref}
      className={cn(
        "relative rounded-lg border border-border/60 bg-card text-card-foreground",
        "shadow-sm shadow-burgundy/[0.02]",
        className
      )}
      initial={false}
      whileHover={
        disableHover
          ? undefined
          : {
              y: -2,
              boxShadow: "0 8px 24px rgba(91, 58, 58, 0.1)",
            }
      }
      whileTap={
        disableHover
          ? undefined
          : {
              y: 0,
              scale: 0.995,
            }
      }
      transition={springs.gentle}
      {...props}
    />
  )
);
CardAnimated.displayName = "CardAnimated";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("font-semibold leading-none tracking-tight font-sans", className)}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardAnimated, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
