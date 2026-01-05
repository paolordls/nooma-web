import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { notesRepository } from "@/db/repositories/notes";
import { Plus, FileText, Pin, Archive, Folder } from "lucide-react";
import { NoteForm } from "./note-form";
import { SearchNotes } from "./search-notes";
import { NoteList } from "@/components/note-list";
import { StatsCards } from "@/components/stats-cards";

export default async function NotesPage() {
  const [notes, folders, stats] = await Promise.all([
    notesRepository.getNotes({ isArchived: false }),
    notesRepository.getFolders(),
    notesRepository.getStats(),
  ]);

  const statsData = [
    { label: "Total Notes", value: stats.totalNotes, icon: <FileText className="h-4 w-4" /> },
    { label: "Pinned", value: stats.pinnedNotes, accent: true, icon: <Pin className="h-4 w-4" /> },
    { label: "Archived", value: stats.archivedNotes, icon: <Archive className="h-4 w-4" /> },
    { label: "Folders", value: stats.totalFolders, icon: <Folder className="h-4 w-4" /> },
  ];

  return (
    <div className="max-w-6xl space-y-10">
      {/* Header */}
      <header className="space-y-1">
        <p className="text-sm font-medium text-burgundy tracking-wide uppercase">Knowledge</p>
        <h1 className="text-balance">Notes</h1>
        <p className="text-muted-foreground text-lg">Capture and organize your thoughts.</p>
      </header>

      {/* Stats */}
      <StatsCards stats={statsData} />

      {/* Search */}
      <SearchNotes />

      <div className="grid gap-6 lg:grid-cols-5">
        {/* New Note Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="h-8 w-8 rounded-full bg-burgundy/10 flex items-center justify-center">
                <Plus className="h-4 w-4 text-burgundy" />
              </div>
              New Note
            </CardTitle>
            <CardDescription>Create a new note</CardDescription>
          </CardHeader>
          <CardContent>
            <NoteForm folders={folders} />
          </CardContent>
        </Card>

        {/* Notes List */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Your Notes</CardTitle>
              <span className="text-sm text-muted-foreground tabular-nums">
                {notes.length} note{notes.length !== 1 ? "s" : ""}
              </span>
            </div>
          </CardHeader>
          <CardContent className="max-h-[540px] overflow-y-auto">
            <NoteList notes={notes} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
