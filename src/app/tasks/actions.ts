"use server";

import { tasksRepository } from "@/db/repositories/tasks";
import { revalidatePath } from "next/cache";

export async function createTask(_prevState: unknown, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const projectId = formData.get("projectId") as string;
    const priority = formData.get("priority") as string;
    const dueDate = formData.get("dueDate") as string;

    if (!title) {
      return { error: "Title is required" };
    }

    await tasksRepository.createTask({
      title,
      description: description || undefined,
      projectId: projectId || undefined,
      priority: (priority || "medium") as "low" | "medium" | "high" | "urgent",
      dueDate: dueDate || undefined,
    });

    revalidatePath("/tasks");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error creating task:", error);
    return { error: "Failed to create task" };
  }
}

export async function completeTask(taskId: string) {
  try {
    await tasksRepository.completeTask(taskId);
    revalidatePath("/tasks");
    revalidatePath("/");
  } catch (error) {
    console.error("Error completing task:", error);
  }
}

export async function deleteTask(taskId: string) {
  try {
    await tasksRepository.deleteTask(taskId);
    revalidatePath("/tasks");
    revalidatePath("/");
  } catch (error) {
    console.error("Error deleting task:", error);
  }
}
