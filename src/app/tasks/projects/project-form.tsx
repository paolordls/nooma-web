"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createProject } from "./actions";
import { useActionState } from "react";

export function ProjectForm() {
  const [state, formAction, isPending] = useActionState(createProject, null);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="name" className="text-sm font-medium">Project Name</label>
        <Input id="name" name="name" placeholder="e.g., Website Redesign" required />
      </div>

      <div>
        <label htmlFor="description" className="text-sm font-medium">Description (optional)</label>
        <Input id="description" name="description" placeholder="Add details..." />
      </div>

      <div>
        <label htmlFor="color" className="text-sm font-medium">Color</label>
        <Input id="color" name="color" type="color" defaultValue="#6366f1" className="h-10 w-full" />
      </div>

      <div>
        <label htmlFor="dueDate" className="text-sm font-medium">Due Date (optional)</label>
        <Input id="dueDate" name="dueDate" type="date" />
      </div>

      {state?.error && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}

      {state?.success && (
        <p className="text-sm text-green-500">Project created!</p>
      )}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Creating..." : "Create Project"}
      </Button>
    </form>
  );
}
