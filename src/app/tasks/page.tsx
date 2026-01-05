import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { tasksRepository } from "@/db/repositories/tasks";
import { Button } from "@/components/ui/button";
import { Plus, FolderKanban } from "lucide-react";
import Link from "next/link";
import { TaskForm } from "./task-form";
import { TaskList } from "@/components/task-list";
import { StatsCards } from "@/components/stats-cards";

export default async function TasksPage() {
  const [tasks, projects, stats] = await Promise.all([
    tasksRepository.getTasks(),
    tasksRepository.getProjects(),
    tasksRepository.getStats(),
  ]);

  const statsData = [
    { label: "Todo", value: stats.todoTasks },
    { label: "In Progress", value: stats.inProgressTasks, accent: true },
    { label: "Completed", value: stats.completedTasks, success: true },
    { label: "Projects", value: stats.totalProjects },
  ];

  return (
    <div className="max-w-6xl space-y-10">
      {/* Header */}
      <header className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-sm font-medium text-burgundy tracking-wide uppercase">Productivity</p>
          <h1 className="text-balance">Tasks</h1>
          <p className="text-muted-foreground text-lg">Manage your tasks and stay organized.</p>
        </div>
        <Link href="/tasks/projects">
          <Button variant="outline" className="gap-2">
            <FolderKanban className="h-4 w-4" />
            Projects
          </Button>
        </Link>
      </header>

      {/* Stats */}
      <StatsCards stats={statsData} />

      <div className="grid gap-6 lg:grid-cols-5">
        {/* New Task Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="h-8 w-8 rounded-full bg-burgundy/10 flex items-center justify-center">
                <Plus className="h-4 w-4 text-burgundy" />
              </div>
              New Task
            </CardTitle>
            <CardDescription>Create a new task to track</CardDescription>
          </CardHeader>
          <CardContent>
            <TaskForm projects={projects} />
          </CardContent>
        </Card>

        {/* Tasks List */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">All Tasks</CardTitle>
              <span className="text-sm text-muted-foreground tabular-nums">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</span>
            </div>
          </CardHeader>
          <CardContent className="max-h-[540px] overflow-y-auto">
            <TaskList tasks={tasks} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
