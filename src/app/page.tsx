import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { financeRepository } from "@/db/repositories/finance";
import { tasksRepository } from "@/db/repositories/tasks";
import { notesRepository } from "@/db/repositories/notes";
import { DollarSign, CheckSquare, FileText, TrendingUp, TrendingDown, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const [financeInsights, taskStats, noteStats, recentTransactions, recentTasks, recentNotes] = await Promise.all([
    financeRepository.getInsights(),
    tasksRepository.getStats(),
    notesRepository.getStats(),
    financeRepository.getTransactions({ limit: 5 }),
    tasksRepository.getTasks({ status: "todo" }),
    notesRepository.getRecentNotes(5),
  ]);

  return (
    <div className="max-w-6xl space-y-10">
      {/* Header */}
      <header className="space-y-1">
        <p className="text-sm font-medium text-burgundy tracking-wide uppercase">Overview</p>
        <h1 className="text-balance">Dashboard</h1>
        <p className="text-muted-foreground text-lg">Your personal productivity at a glance.</p>
      </header>

      {/* Stats Overview */}
      <section className="grid gap-5 md:grid-cols-3">
        <Card className="card-hover stat-card group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Balance</CardTitle>
            <div className="h-9 w-9 rounded-full bg-burgundy/10 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-burgundy" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tabular-nums tracking-tight">
              ${financeInsights.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Across {financeInsights.accountCount} account{financeInsights.accountCount !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover stat-card group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open Tasks</CardTitle>
            <div className="h-9 w-9 rounded-full bg-burgundy/10 flex items-center justify-center">
              <CheckSquare className="h-4 w-4 text-burgundy" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tabular-nums tracking-tight">
              {taskStats.todoTasks + taskStats.inProgressTasks}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {taskStats.inProgressTasks} in progress
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover stat-card group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Notes</CardTitle>
            <div className="h-9 w-9 rounded-full bg-burgundy/10 flex items-center justify-center">
              <FileText className="h-4 w-4 text-burgundy" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tabular-nums tracking-tight">
              {noteStats.totalNotes}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {noteStats.pinnedNotes} pinned
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Finance Summary */}
      <section className="grid gap-5 md:grid-cols-2">
        <Card className="card-hover overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-success/60 to-success/20" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-5">
            <CardTitle className="text-sm font-medium text-muted-foreground">Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tabular-nums tracking-tight text-success">
              +${financeInsights.totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-destructive/60 to-destructive/20" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-5">
            <CardTitle className="text-sm font-medium text-muted-foreground">Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tabular-nums tracking-tight text-destructive">
              -${financeInsights.totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Recent Activity */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl">Recent Activity</h2>
          <div className="h-px flex-1 mx-6 bg-gradient-to-r from-border to-transparent" />
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <Card className="card-hover">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">Transactions</CardTitle>
                <Link href="/finance/transactions" className="text-burgundy hover:text-burgundy-dark transition-colors">
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <CardDescription>Latest financial activity</CardDescription>
            </CardHeader>
            <CardContent>
              {recentTransactions.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No transactions yet</p>
              ) : (
                <ul className="space-y-3">
                  {recentTransactions.slice(0, 5).map((tx) => (
                    <li key={tx.id} className="flex justify-between items-center text-sm py-1.5 border-b border-border/50 last:border-0">
                      <span className="truncate text-foreground/80">{tx.description}</span>
                      <span className={`font-medium tabular-nums ${tx.type === "income" ? "text-success" : "text-destructive"}`}>
                        {tx.type === "income" ? "+" : "-"}${(tx.amount || 0).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card className="card-hover">
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
              {recentTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No pending tasks</p>
              ) : (
                <ul className="space-y-3">
                  {recentTasks.slice(0, 5).map((task) => (
                    <li key={task.id} className="flex items-center gap-3 text-sm py-1.5 border-b border-border/50 last:border-0">
                      <div className="h-2 w-2 rounded-full bg-burgundy/60" />
                      <span className="truncate text-foreground/80">{task.title}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card className="card-hover">
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
              {recentNotes.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No notes yet</p>
              ) : (
                <ul className="space-y-3">
                  {recentNotes.map((note) => (
                    <li key={note.id} className="flex items-center gap-3 text-sm py-1.5 border-b border-border/50 last:border-0">
                      <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="truncate text-foreground/80">{note.title}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
