"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Circle, Clock, AlertTriangle, CheckCircle, Sparkles } from "lucide-react";
import { TaskActions } from "@/app/tasks/task-actions";
import { springs } from "@/lib/animations";

type Task = {
  id: string;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  dueDate: string | null;
  source?: string | null;
};

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

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <motion.div
        className="py-12 text-center"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springs.gentle}
      >
        <motion.div
          className="h-12 w-12 rounded-full bg-success/10 mx-auto mb-4 flex items-center justify-center"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={springs.bouncy}
        >
          <CheckCircle className="h-6 w-6 text-success" />
        </motion.div>
        <p className="text-base font-medium text-foreground/80 mb-1">All caught up!</p>
        <p className="text-sm text-muted-foreground">Create a task to get started.</p>
      </motion.div>
    );
  }

  return (
    <ul className="space-y-2">
      <AnimatePresence mode="popLayout" initial={false}>
        {tasks.map((task, index) => {
          const StatusIcon = statusIcons[task.status as keyof typeof statusIcons] || Circle;
          const statusColor = statusColors[task.status as keyof typeof statusColors] || "text-muted-foreground";
          const isAiAdded = task.source === "mcp";

          return (
            <motion.li
              key={task.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0,
                scale: 0.95,
                transition: { duration: 0.15 },
              }}
              transition={{
                ...springs.gentle,
                delay: index * 0.03,
              }}
              className="group flex items-start gap-3 p-4 rounded-lg border border-border/50 hover:border-border hover:bg-accent/30 transition-colors duration-150"
            >
              <StatusIcon className={`h-5 w-5 mt-0.5 ${statusColor} transition-colors`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className={`font-medium ${task.status === "done" ? "line-through text-muted-foreground" : ""}`}>
                    {task.title}
                  </p>
                  {isAiAdded && (
                    <span className="inline-flex items-center gap-1 text-xs text-burgundy/70" title="Added by Claude">
                      <Sparkles className="h-3 w-3" />
                    </span>
                  )}
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
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <TaskActions taskId={task.id} currentStatus={task.status} />
              </div>
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
}
