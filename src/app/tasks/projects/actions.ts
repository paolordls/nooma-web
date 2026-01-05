"use server";

import { tasksRepository } from "@/db/repositories/tasks";
import { revalidatePath } from "next/cache";

export async function createProject(_prevState: unknown, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const color = formData.get("color") as string;
    const dueDate = formData.get("dueDate") as string;

    if (!name) {
      return { error: "Project name is required" };
    }

    await tasksRepository.createProject({
      name,
      description: description || undefined,
      color: color || undefined,
      dueDate: dueDate || undefined,
    });

    revalidatePath("/tasks");
    revalidatePath("/tasks/projects");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error creating project:", error);
    return { error: "Failed to create project" };
  }
}
