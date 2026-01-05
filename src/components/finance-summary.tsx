"use client";

import { motion } from "framer-motion";
import { CardAnimated, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { springs } from "@/lib/animations";

interface FinanceSummaryProps {
  totalIncome: number;
  totalExpenses: number;
}

export function FinanceSummary({ totalIncome, totalExpenses }: FinanceSummaryProps) {
  return (
    <section className="grid gap-5 md:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springs.gentle, delay: 0.25 }}
      >
        <CardAnimated className="overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-success/60 to-success/20" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-5">
            <CardTitle className="text-sm font-medium text-muted-foreground">Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tabular-nums tracking-tight text-success">
              +${totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </CardAnimated>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springs.gentle, delay: 0.3 }}
      >
        <CardAnimated className="overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-destructive/60 to-destructive/20" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-5">
            <CardTitle className="text-sm font-medium text-muted-foreground">Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tabular-nums tracking-tight text-destructive">
              -${totalExpenses.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </CardAnimated>
      </motion.div>
    </section>
  );
}
