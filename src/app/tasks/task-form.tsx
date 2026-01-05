"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createTask } from "./actions";
import { useActionState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { springs } from "@/lib/animations";
import { haptic } from "@/lib/haptics";
import { useToast } from "@/components/ui/toast";

type Project = {
  id: string;
  name: string;
};

export function TaskForm({ projects }: { projects: Project[] }) {
  const [state, formAction, isPending] = useActionState(createTask, null);
  const formRef = useRef<HTMLFormElement>(null);
  const { addToast } = useToast();

  // Handle success/error feedback
  useEffect(() => {
    if (state?.success) {
      haptic.success();
      addToast("Task created successfully", "success");
      formRef.current?.reset();
    } else if (state?.error) {
      haptic.error();
      addToast(state.error, "error");
    }
  }, [state, addToast]);

  return (
    <motion.form
      ref={formRef}
      action={formAction}
      className="space-y-4"
      animate={state?.error ? { x: [0, -4, 4, -4, 4, 0] } : undefined}
      transition={{ duration: 0.4 }}
    >
      <div>
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <Input id="title" name="title" placeholder="e.g., Review pull request" required />
      </div>

      <div>
        <label htmlFor="description" className="text-sm font-medium">
          Description (optional)
        </label>
        <Input id="description" name="description" placeholder="Add details..." />
      </div>

      <div>
        <label htmlFor="projectId" className="text-sm font-medium">
          Project (optional)
        </label>
        <select
          id="projectId"
          name="projectId"
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="">No Project (Inbox)</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="priority" className="text-sm font-medium">
          Priority
        </label>
        <select
          id="priority"
          name="priority"
          defaultValue="medium"
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      <div>
        <label htmlFor="dueDate" className="text-sm font-medium">
          Due Date (optional)
        </label>
        <Input id="dueDate" name="dueDate" type="date" />
      </div>

      <AnimatePresence mode="wait">
        {state?.error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={springs.snappy}
            className="flex items-center gap-2 text-sm text-destructive"
          >
            <AlertCircle className="h-4 w-4" />
            {state.error}
          </motion.div>
        )}
      </AnimatePresence>

      <Button type="submit" disabled={isPending} className="w-full relative">
        <AnimatePresence mode="wait">
          {isPending ? (
            <motion.span
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating...
            </motion.span>
          ) : (
            <motion.span
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Create Task
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
    </motion.form>
  );
}
