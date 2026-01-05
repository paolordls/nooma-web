"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createNote } from "./actions";
import { useActionState } from "react";

type Folder = {
  id: string;
  name: string;
};

export function NoteForm({ folders }: { folders: Folder[] }) {
  const [state, formAction, isPending] = useActionState(createNote, null);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="title" className="text-sm font-medium">Title</label>
        <Input id="title" name="title" placeholder="e.g., Meeting Notes" required />
      </div>

      <div>
        <label htmlFor="folderId" className="text-sm font-medium">Folder (optional)</label>
        <select
          id="folderId"
          name="folderId"
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="">No Folder</option>
          {folders.map((folder) => (
            <option key={folder.id} value={folder.id}>
              {folder.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="content" className="text-sm font-medium">Content (Markdown supported)</label>
        <textarea
          id="content"
          name="content"
          placeholder="Write your note here..."
          className="flex min-h-[150px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}

      {state?.success && (
        <p className="text-sm text-green-500">Note created!</p>
      )}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Creating..." : "Create Note"}
      </Button>
    </form>
  );
}
