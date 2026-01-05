"use client";

import { Button } from "@/components/ui/button";
import { completeTask, deleteTask } from "./actions";
import { Check, Trash2 } from "lucide-react";
import { haptic } from "@/lib/haptics";

export function TaskActions({ taskId, currentStatus }: { taskId: string; currentStatus: string }) {
  const handleComplete = () => {
    haptic.success();
  };

  const handleDelete = () => {
    haptic.medium();
  };

  return (
    <div className="flex gap-1">
      {currentStatus !== "done" && (
        <form action={completeTask.bind(null, taskId)}>
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-success/10 hover:text-success"
            title="Complete"
            onClick={handleComplete}
          >
            <Check className="h-4 w-4" />
          </Button>
        </form>
      )}
      <form action={deleteTask.bind(null, taskId)}>
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
          title="Delete"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
