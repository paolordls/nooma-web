"use server";

import { notesRepository } from "@/db/repositories/notes";
import { revalidatePath } from "next/cache";

export async function createNote(_prevState: unknown, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const folderId = formData.get("folderId") as string;

    if (!title) {
      return { error: "Title is required" };
    }

    await notesRepository.createNote({
      title,
      content: content || undefined,
      folderId: folderId || undefined,
    });

    revalidatePath("/notes");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error creating note:", error);
    return { error: "Failed to create note" };
  }
}

export async function searchNotes(query: string) {
  try {
    const results = await notesRepository.searchNotes(query);
    return results;
  } catch (error) {
    console.error("Error searching notes:", error);
    return [];
  }
}
