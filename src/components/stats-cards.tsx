"use client";

import { motion } from "framer-motion";
import { CardAnimated, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { springs } from "@/lib/animations";
import { cn } from "@/lib/utils";

type StatItem = {
  label: string;
  value: number;
  accent?: boolean;
  success?: boolean;
  icon?: React.ReactNode;
};

interface StatsCardsProps {
  stats: StatItem[];
  columns?: 3 | 4;
}

export function StatsCards({ stats, columns = 4 }: StatsCardsProps) {
  const gridCols = columns === 3 ? "md:grid-cols-3" : "md:grid-cols-4";

  return (
    <section className={cn("grid gap-5", gridCols)}>
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            ...springs.gentle,
            delay: index * 0.05,
          }}
        >
          <CardAnimated className="stat-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                {stat.label}
                {stat.icon}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={cn(
                  "text-3xl font-semibold tabular-nums",
                  stat.accent && "text-burgundy",
                  stat.success && "text-success"
                )}
              >
                {stat.value.toLocaleString()}
              </div>
            </CardContent>
          </CardAnimated>
        </motion.div>
      ))}
    </section>
  );
}
