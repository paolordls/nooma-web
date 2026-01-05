"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createTask } from "./actions";
import { useActionState } from "react";

type Project = {
  id: string;
  name: string;
};

export function TaskForm({ projects }: { projects: Project[] }) {
  const [state, formAction, isPending] = useActionState(createTask, null);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="title" className="text-sm font-medium">Title</label>
        <Input id="title" name="title" placeholder="e.g., Review pull request" required />
      </div>

      <div>
        <label htmlFor="description" className="text-sm font-medium">Description (optional)</label>
        <Input id="description" name="description" placeholder="Add details..." />
      </div>

      <div>
        <label htmlFor="projectId" className="text-sm font-medium">Project (optional)</label>
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
        <label htmlFor="priority" className="text-sm font-medium">Priority</label>
        <select
          id="priority"
          name="priority"
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="low">Low</option>
          <option value="medium" selected>Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      <div>
        <label htmlFor="dueDate" className="text-sm font-medium">Due Date (optional)</label>
        <Input id="dueDate" name="dueDate" type="date" />
      </div>

      {state?.error && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}

      {state?.success && (
        <p className="text-sm text-green-500">Task created!</p>
      )}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Creating..." : "Create Task"}
      </Button>
    </form>
  );
}
