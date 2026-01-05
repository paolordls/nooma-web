"use client";

import { motion } from "framer-motion";
import { springs } from "@/lib/animations";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getTimeEmoji(): string {
  const hour = new Date().getHours();
  if (hour < 6) return "🌙";
  if (hour < 12) return "☀️";
  if (hour < 17) return "🌤️";
  if (hour < 21) return "🌆";
  return "🌙";
}

export function DashboardHeader() {
  const greeting = getGreeting();

  return (
    <motion.header
      className="space-y-1"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.gentle}
    >
      <p className="text-sm font-medium text-burgundy tracking-wide uppercase">
        {greeting}
      </p>
      <h1 className="text-balance">Dashboard</h1>
      <p className="text-muted-foreground text-lg">
        Your personal productivity at a glance.
      </p>
    </motion.header>
  );
}
