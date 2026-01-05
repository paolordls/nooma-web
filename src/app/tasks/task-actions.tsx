"use client";

import { Button } from "@/components/ui/button";
import { completeTask, deleteTask } from "./actions";
import { Check, Trash2 } from "lucide-react";

export function TaskActions({ taskId, currentStatus }: { taskId: string; currentStatus: string }) {
  return (
    <div className="flex gap-1">
      {currentStatus !== "done" && (
        <form action={completeTask.bind(null, taskId)}>
          <Button type="submit" variant="ghost" size="icon" className="h-8 w-8" title="Complete">
            <Check className="h-4 w-4" />
          </Button>
        </form>
      )}
      <form action={deleteTask.bind(null, taskId)}>
        <Button type="submit" variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700" title="Delete">
          <Trash2 className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
