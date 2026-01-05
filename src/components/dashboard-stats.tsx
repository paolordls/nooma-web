"use client";

import { motion } from "framer-motion";
import { CardAnimated, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, CheckSquare, FileText } from "lucide-react";
import { springs } from "@/lib/animations";

interface DashboardStatsProps {
  totalBalance: number;
  accountCount: number;
  openTasks: number;
  inProgressTasks: number;
  totalNotes: number;
  pinnedNotes: number;
}

export function DashboardStats({
  totalBalance,
  accountCount,
  openTasks,
  inProgressTasks,
  totalNotes,
  pinnedNotes,
}: DashboardStatsProps) {
  const stats = [
    {
      label: "Total Balance",
      value: `$${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      subtitle: `Across ${accountCount} account${accountCount !== 1 ? "s" : ""}`,
      icon: DollarSign,
    },
    {
      label: "Open Tasks",
      value: openTasks,
      subtitle: `${inProgressTasks} in progress`,
      icon: CheckSquare,
    },
    {
      label: "Total Notes",
      value: totalNotes,
      subtitle: `${pinnedNotes} pinned`,
      icon: FileText,
    },
  ];

  return (
    <section className="grid gap-5 md:grid-cols-3">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            ...springs.gentle,
            delay: 0.1 + index * 0.06,
          }}
        >
          <CardAnimated className="stat-card group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <div className="h-9 w-9 rounded-full bg-burgundy/10 flex items-center justify-center">
                <stat.icon className="h-4 w-4 text-burgundy" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold tabular-nums tracking-tight">
                {stat.value}
              </div>
              <p className="text-sm text-muted-foreground mt-1">{stat.subtitle}</p>
            </CardContent>
          </CardAnimated>
        </motion.div>
      ))}
    </section>
  );
}
