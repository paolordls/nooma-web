"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FileText, Pin, Sparkles, PenLine } from "lucide-react";
import { springs } from "@/lib/animations";

type Note = {
  id: string;
  title: string;
  contentPlain: string | null;
  isPinned: boolean | null;
  createdAt: string;
  updatedAt: string | null;
  source?: string | null;
};

interface NoteListProps {
  notes: Note[];
}

export function NoteList({ notes }: NoteListProps) {
  if (notes.length === 0) {
    return (
      <motion.div
        className="py-12 text-center"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springs.gentle}
      >
        <motion.div
          className="h-12 w-12 rounded-full bg-burgundy/10 mx-auto mb-4 flex items-center justify-center"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={springs.bouncy}
        >
          <PenLine className="h-6 w-6 text-burgundy" />
        </motion.div>
        <p className="text-base font-medium text-foreground/80 mb-1">Ready to capture ideas</p>
        <p className="text-sm text-muted-foreground">Create your first note to get started.</p>
      </motion.div>
    );
  }

  return (
    <ul className="space-y-2">
      <AnimatePresence mode="popLayout" initial={false}>
        {notes.map((note, index) => {
          const isAiAdded = note.source === "mcp";

          return (
            <motion.li
              key={note.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0,
                scale: 0.95,
                transition: { duration: 0.15 },
              }}
              transition={{
                ...springs.gentle,
                delay: index * 0.03,
              }}
              className="group p-4 rounded-lg border border-border/50 hover:border-border hover:bg-accent/30 transition-colors duration-150 cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{note.title}</p>
                    {isAiAdded && (
                      <span className="inline-flex items-center gap-1 text-xs text-burgundy/70" title="Added by Claude">
                        <Sparkles className="h-3 w-3" />
                      </span>
                    )}
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
                    {new Date(note.updatedAt || note.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
}
