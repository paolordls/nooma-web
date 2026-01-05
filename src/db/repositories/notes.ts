import { db } from "../client";
import { folders, notes, noteTags, notesToTags } from "../schema";
import { eq, desc, and, like, or } from "drizzle-orm";

export const notesRepository = {
  // Folders
  async getFolders() {
    return db.select().from(folders).orderBy(folders.sortOrder, folders.name);
  },

  async getFolder(id: string) {
    const result = await db.select().from(folders).where(eq(folders.id, id));
    return result[0];
  },

  async createFolder(data: {
    name: string;
    icon?: string;
    color?: string;
    parentId?: string;
  }) {
    const result = db.insert(folders).values(data).returning();
    return result.get();
  },

  async updateFolder(id: string, data: Partial<{
    name: string;
    icon: string;
    color: string;
    parentId: string;
    sortOrder: number;
  }>) {
    const result = db.update(folders)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(folders.id, id))
      .returning();
    return result.get();
  },

  async deleteFolder(id: string) {
    // Delete associated notes first
    await db.delete(notes).where(eq(notes.folderId, id));
    return db.delete(folders).where(eq(folders.id, id));
  },

  // Notes
  async getNotes(filters?: {
    folderId?: string;
    isPinned?: boolean;
    isArchived?: boolean;
    limit?: number;
  }) {
    let query = db.select().from(notes);

    const conditions = [];
    if (filters?.folderId) conditions.push(eq(notes.folderId, filters.folderId));
    if (filters?.isPinned !== undefined) conditions.push(eq(notes.isPinned, filters.isPinned));
    if (filters?.isArchived !== undefined) conditions.push(eq(notes.isArchived, filters.isArchived));

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query;
    }

    return query.orderBy(desc(notes.isPinned), desc(notes.updatedAt)).limit(filters?.limit || 100);
  },

  async getRecentNotes(limit: number = 10) {
    return db.select().from(notes)
      .where(eq(notes.isArchived, false))
      .orderBy(desc(notes.updatedAt))
      .limit(limit);
  },

  async getPinnedNotes() {
    return db.select().from(notes)
      .where(and(eq(notes.isPinned, true), eq(notes.isArchived, false)))
      .orderBy(desc(notes.updatedAt));
  },

  async getNote(id: string) {
    const result = await db.select().from(notes).where(eq(notes.id, id));
    return result[0];
  },

  async createNote(data: {
    title: string;
    content?: string;
    folderId?: string;
  }) {
    const contentPlain = data.content?.replace(/[#*`_~\[\]()]/g, "") || "";

    const result = db.insert(notes).values({
      title: data.title,
      content: data.content || "",
      contentPlain,
      folderId: data.folderId,
    }).returning();
    return result.get();
  },

  async updateNote(id: string, data: Partial<{
    title: string;
    content: string;
    folderId: string;
    isPinned: boolean;
    isArchived: boolean;
  }>) {
    const updateData: Record<string, unknown> = { ...data, updatedAt: new Date().toISOString() };

    if (data.content !== undefined) {
      updateData.contentPlain = data.content.replace(/[#*`_~\[\]()]/g, "");
    }

    const result = db.update(notes)
      .set(updateData)
      .where(eq(notes.id, id))
      .returning();
    return result.get();
  },

  async deleteNote(id: string) {
    // Delete tag associations first
    await db.delete(notesToTags).where(eq(notesToTags.noteId, id));
    return db.delete(notes).where(eq(notes.id, id));
  },

  async searchNotes(query: string) {
    const searchTerm = `%${query}%`;
    return db.select().from(notes)
      .where(
        and(
          eq(notes.isArchived, false),
          or(
            like(notes.title, searchTerm),
            like(notes.contentPlain, searchTerm)
          )
        )
      )
      .orderBy(desc(notes.updatedAt))
      .limit(50);
  },

  // Tags
  async getTags() {
    return db.select().from(noteTags).orderBy(noteTags.name);
  },

  async createTag(data: { name: string; color?: string }) {
    const result = db.insert(noteTags).values(data).returning();
    return result.get();
  },

  // Stats
  async getStats() {
    const allNotes = await db.select().from(notes);
    const allFolders = await db.select().from(folders);

    return {
      totalNotes: allNotes.length,
      pinnedNotes: allNotes.filter(n => n.isPinned === true).length,
      archivedNotes: allNotes.filter(n => n.isArchived === true).length,
      totalFolders: allFolders.length,
    };
  },
};
