import { financeRepository } from "@/db/repositories/finance";
import { tasksRepository } from "@/db/repositories/tasks";
import { notesRepository } from "@/db/repositories/notes";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardStats } from "@/components/dashboard-stats";
import { FinanceSummary } from "@/components/finance-summary";
import { RecentActivity } from "@/components/recent-activity";

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
      <DashboardHeader />

      <DashboardStats
        totalBalance={financeInsights.totalBalance}
        accountCount={financeInsights.accountCount}
        openTasks={taskStats.todoTasks + taskStats.inProgressTasks}
        inProgressTasks={taskStats.inProgressTasks}
        totalNotes={noteStats.totalNotes}
        pinnedNotes={noteStats.pinnedNotes}
      />

      <FinanceSummary
        totalIncome={financeInsights.totalIncome}
        totalExpenses={financeInsights.totalExpenses}
      />

      <RecentActivity
        transactions={recentTransactions}
        tasks={recentTasks}
        notes={recentNotes}
      />
    </div>
  );
}
