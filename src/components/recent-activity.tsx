"use client";

import { motion } from "framer-motion";
import { CardAnimated, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, FileText, CheckCircle, Inbox, Sparkles } from "lucide-react";
import Link from "next/link";
import { springs } from "@/lib/animations";

type Transaction = {
  id: string;
  description: string;
  amount: number | null;
  type: string;
};

type Task = {
  id: string;
  title: string;
};

type Note = {
  id: string;
  title: string;
};

interface RecentActivityProps {
  transactions: Transaction[];
  tasks: Task[];
  notes: Note[];
}

export function RecentActivity({ transactions, tasks, notes }: RecentActivityProps) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ...springs.gentle, delay: 0.35 }}
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl">Recent Activity</h2>
        <div className="h-px flex-1 mx-6 bg-gradient-to-r from-border to-transparent" />
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {/* Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.gentle, delay: 0.4 }}
        >
          <CardAnimated>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">Transactions</CardTitle>
                <Link
                  href="/finance/transactions"
                  className="text-burgundy hover:text-burgundy-dark transition-colors"
                >
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <CardDescription>Latest financial activity</CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <EmptyState icon={Inbox} message="No transactions yet" />
              ) : (
                <ul className="space-y-3">
                  {transactions.slice(0, 5).map((tx) => (
                    <li
                      key={tx.id}
                      className="flex justify-between items-center text-sm py-1.5 border-b border-border/50 last:border-0"
                    >
                      <span className="truncate text-foreground/80">{tx.description}</span>
                      <span
                        className={`font-medium tabular-nums ${
                          tx.type === "income" ? "text-success" : "text-destructive"
                        }`}
                      >
                        {tx.type === "income" ? "+" : "-"}${(tx.amount || 0).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </CardAnimated>
        </motion.div>

        {/* Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.gentle, delay: 0.45 }}
        >
          <CardAnimated>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">Pending Tasks</CardTitle>
                <Link href="/tasks" className="text-burgundy hover:text-burgundy-dark transition-colors">
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <CardDescription>Waiting for action</CardDescription>
            </CardHeader>
            <CardContent>
              {tasks.length === 0 ? (
                <EmptyState icon={CheckCircle} message="All caught up!" positive />
              ) : (
                <ul className="space-y-3">
                  {tasks.slice(0, 5).map((task) => (
                    <li
                      key={task.id}
                      className="flex items-center gap-3 text-sm py-1.5 border-b border-border/50 last:border-0"
                    >
                      <div className="h-2 w-2 rounded-full bg-burgundy/60" />
                      <span className="truncate text-foreground/80">{task.title}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </CardAnimated>
        </motion.div>

        {/* Notes */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.gentle, delay: 0.5 }}
        >
          <CardAnimated>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">Recent Notes</CardTitle>
                <Link href="/notes" className="text-burgundy hover:text-burgundy-dark transition-colors">
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <CardDescription>Recently modified</CardDescription>
            </CardHeader>
            <CardContent>
              {notes.length === 0 ? (
                <EmptyState icon={FileText} message="No notes yet" />
              ) : (
                <ul className="space-y-3">
                  {notes.map((note) => (
                    <li
                      key={note.id}
                      className="flex items-center gap-3 text-sm py-1.5 border-b border-border/50 last:border-0"
                    >
                      <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="truncate text-foreground/80">{note.title}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </CardAnimated>
        </motion.div>
      </div>
    </motion.section>
  );
}

function EmptyState({
  icon: Icon,
  message,
  positive = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  message: string;
  positive?: boolean;
}) {
  return (
    <div className="py-4 text-center">
      <div
        className={`h-8 w-8 rounded-full mx-auto mb-2 flex items-center justify-center ${
          positive ? "bg-success/10" : "bg-muted"
        }`}
      >
        <Icon className={`h-4 w-4 ${positive ? "text-success" : "text-muted-foreground"}`} />
      </div>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
