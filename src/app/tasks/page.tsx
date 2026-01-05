import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { tasksRepository } from "@/db/repositories/tasks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle, Circle, Clock, AlertTriangle, FolderKanban } from "lucide-react";
import Link from "next/link";
import { TaskForm } from "./task-form";
import { TaskActions } from "./task-actions";

const priorityColors = {
  low: "secondary",
  medium: "default",
  high: "warning",
  urgent: "destructive",
} as const;

const statusIcons = {
  todo: Circle,
  in_progress: Clock,
  blocked: AlertTriangle,
  done: CheckCircle,
} as const;

const statusColors = {
  todo: "text-muted-foreground",
  in_progress: "text-burgundy",
  blocked: "text-destructive",
  done: "text-success",
} as const;

export default async function TasksPage() {
  const [tasks, projects, stats] = await Promise.all([
    tasksRepository.getTasks(),
    tasksRepository.getProjects(),
    tasksRepository.getStats(),
  ]);

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
      <section className="grid gap-5 md:grid-cols-4">
        <Card className="card-hover stat-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Todo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tabular-nums">{stats.todoTasks}</div>
          </CardContent>
        </Card>

        <Card className="card-hover stat-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tabular-nums text-burgundy">{stats.inProgressTasks}</div>
          </CardContent>
        </Card>

        <Card className="card-hover stat-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tabular-nums text-success">{stats.completedTasks}</div>
          </CardContent>
        </Card>

        <Card className="card-hover stat-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tabular-nums">{stats.totalProjects}</div>
          </CardContent>
        </Card>
      </section>

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
            {tasks.length === 0 ? (
              <div className="py-12 text-center">
                <div className="h-12 w-12 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No tasks yet. Create one to get started.</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {tasks.map((task) => {
                  const StatusIcon = statusIcons[task.status as keyof typeof statusIcons] || Circle;
                  const statusColor = statusColors[task.status as keyof typeof statusColors] || "text-muted-foreground";
                  return (
                    <li
                      key={task.id}
                      className="group flex items-start gap-3 p-4 rounded-lg border border-border/50 hover:border-border hover:bg-accent/30 transition-all duration-200"
                    >
                      <StatusIcon className={`h-5 w-5 mt-0.5 ${statusColor}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className={`font-medium ${task.status === "done" ? "line-through text-muted-foreground" : ""}`}>
                            {task.title}
                          </p>
                          <Badge variant={priorityColors[task.priority as keyof typeof priorityColors] || "default"}>
                            {task.priority}
                          </Badge>
                        </div>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{task.description}</p>
                        )}
                        {task.dueDate && (
                          <p className="text-xs text-muted-foreground/80 mt-1.5">Due: {task.dueDate}</p>
                        )}
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <TaskActions taskId={task.id} currentStatus={task.status} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
