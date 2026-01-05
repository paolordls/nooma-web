import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { notesRepository } from "@/db/repositories/notes";
import { Plus, FileText, Pin, Archive, Folder } from "lucide-react";
import { NoteForm } from "./note-form";
import { SearchNotes } from "./search-notes";

export default async function NotesPage() {
  const [notes, folders, stats] = await Promise.all([
    notesRepository.getNotes({ isArchived: false }),
    notesRepository.getFolders(),
    notesRepository.getStats(),
  ]);

  return (
    <div className="max-w-6xl space-y-10">
      {/* Header */}
      <header className="space-y-1">
        <p className="text-sm font-medium text-burgundy tracking-wide uppercase">Knowledge</p>
        <h1 className="text-balance">Notes</h1>
        <p className="text-muted-foreground text-lg">Capture and organize your thoughts.</p>
      </header>

      {/* Stats */}
      <section className="grid gap-5 md:grid-cols-4">
        <Card className="card-hover stat-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Total Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tabular-nums">{stats.totalNotes}</div>
          </CardContent>
        </Card>

        <Card className="card-hover stat-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Pin className="h-4 w-4" />
              Pinned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tabular-nums text-warning">{stats.pinnedNotes}</div>
          </CardContent>
        </Card>

        <Card className="card-hover stat-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Archive className="h-4 w-4" />
              Archived
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tabular-nums text-muted-foreground">{stats.archivedNotes}</div>
          </CardContent>
        </Card>

        <Card className="card-hover stat-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Folder className="h-4 w-4" />
              Folders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tabular-nums">{stats.totalFolders}</div>
          </CardContent>
        </Card>
      </section>

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
              <span className="text-sm text-muted-foreground tabular-nums">{notes.length} note{notes.length !== 1 ? 's' : ''}</span>
            </div>
          </CardHeader>
          <CardContent className="max-h-[540px] overflow-y-auto">
            {notes.length === 0 ? (
              <div className="py-12 text-center">
                <div className="h-12 w-12 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No notes yet. Create one to get started.</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {notes.map((note) => (
                  <li
                    key={note.id}
                    className="group p-4 rounded-lg border border-border/50 hover:border-border hover:bg-accent/30 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">{note.title}</p>
                          {note.isPinned && (
                            <Pin className="h-3.5 w-3.5 text-warning shrink-0" />
                          )}
                        </div>
                        {note.contentPlain && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {note.contentPlain.substring(0, 120)}
                            {note.contentPlain.length > 120 ? "..." : ""}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground/70 mt-2">
                          {new Date(note.updatedAt || note.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
