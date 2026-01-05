"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, FileText } from "lucide-react";
import { searchNotes } from "./actions";

type Note = {
  id: string;
  title: string;
  contentPlain: string | null;
  updatedAt: string;
};

export function SearchNotes() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Note[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const notes = await searchNotes(query);
      setResults(notes);
      setSearched(true);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          Search Notes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or content..."
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </Button>
        </form>

        {searched && (
          <div className="mt-4">
            {results.length === 0 ? (
              <p className="text-sm text-muted-foreground">No notes found matching &quot;{query}&quot;</p>
            ) : (
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Found {results.length} note(s)
                </p>
                <ul className="space-y-2">
                  {results.map((note) => (
                    <li key={note.id} className="p-2 border rounded flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{note.title}</p>
                        {note.contentPlain && (
                          <p className="text-xs text-muted-foreground truncate max-w-md">
                            {note.contentPlain.substring(0, 80)}...
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
