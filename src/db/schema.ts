import { sqliteTable, text, integer, real, primaryKey } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// ============================================================================
// FINANCE SCHEMA
// ============================================================================

// Accounts (checking, savings, credit cards, etc.)
export const accounts = sqliteTable("accounts", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  type: text("type", { enum: ["checking", "savings", "credit_card", "cash", "investment"] }).notNull(),
  currency: text("currency").default("USD").notNull(),
  balance: real("balance").default(0).notNull(),
  creditLimit: real("credit_limit"),
  institution: text("institution"),
  accountNumber: text("account_number"),
  isActive: integer("is_active", { mode: "boolean" }).default(true).notNull(),
  createdAt: text("created_at").default(sql`(datetime('now'))`).notNull(),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`).notNull(),
});

// Categories for transactions
export const categories = sqliteTable("categories", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  type: text("type", { enum: ["income", "expense"] }).notNull(),
  icon: text("icon"),
  color: text("color"),
  parentId: text("parent_id"),
  createdAt: text("created_at").default(sql`(datetime('now'))`).notNull(),
});

// Transactions (income and expenses)
export const transactions = sqliteTable("transactions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  accountId: text("account_id").references(() => accounts.id).notNull(),
  categoryId: text("category_id").references(() => categories.id),
  type: text("type", { enum: ["income", "expense", "transfer"] }).notNull(),
  amount: real("amount").notNull(),
  description: text("description").notNull(),
  notes: text("notes"),
  date: text("date").notNull(),
  isRecurring: integer("is_recurring", { mode: "boolean" }).default(false),
  recurringPattern: text("recurring_pattern"),
  transferToAccountId: text("transfer_to_account_id"),
  createdAt: text("created_at").default(sql`(datetime('now'))`).notNull(),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`).notNull(),
});

// Budgets
export const budgets = sqliteTable("budgets", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  categoryId: text("category_id").references(() => categories.id).notNull(),
  amount: real("amount").notNull(),
  period: text("period", { enum: ["weekly", "monthly", "quarterly", "yearly"] }).notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  isActive: integer("is_active", { mode: "boolean" }).default(true).notNull(),
  createdAt: text("created_at").default(sql`(datetime('now'))`).notNull(),
});

// ============================================================================
// TASKS SCHEMA
// ============================================================================

// Projects to group tasks
export const projects = sqliteTable("projects", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description"),
  color: text("color"),
  icon: text("icon"),
  status: text("status", { enum: ["active", "archived", "completed"] }).default("active").notNull(),
  dueDate: text("due_date"),
  createdAt: text("created_at").default(sql`(datetime('now'))`).notNull(),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`).notNull(),
});

// Tags for tasks
export const taskTags = sqliteTable("task_tags", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull().unique(),
  color: text("color"),
  createdAt: text("created_at").default(sql`(datetime('now'))`).notNull(),
});

// Tasks
export const tasks = sqliteTable("tasks", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  projectId: text("project_id").references(() => projects.id),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status", { enum: ["todo", "in_progress", "blocked", "done", "cancelled"] }).default("todo").notNull(),
  priority: text("priority", { enum: ["low", "medium", "high", "urgent"] }).default("medium").notNull(),
  dueDate: text("due_date"),
  estimatedMinutes: integer("estimated_minutes"),
  actualMinutes: integer("actual_minutes"),
  completedAt: text("completed_at"),
  createdAt: text("created_at").default(sql`(datetime('now'))`).notNull(),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`).notNull(),
});

// Task-Tag junction table
export const tasksToTags = sqliteTable("tasks_to_tags", {
  taskId: text("task_id").references(() => tasks.id, { onDelete: "cascade" }).notNull(),
  tagId: text("tag_id").references(() => taskTags.id, { onDelete: "cascade" }).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.taskId, table.tagId] }),
}));

// Task dependencies
export const taskDependencies = sqliteTable("task_dependencies", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  taskId: text("task_id").references(() => tasks.id, { onDelete: "cascade" }).notNull(),
  dependsOnTaskId: text("depends_on_task_id").references(() => tasks.id, { onDelete: "cascade" }).notNull(),
  type: text("type", { enum: ["blocks", "required_by"] }).default("blocks").notNull(),
  createdAt: text("created_at").default(sql`(datetime('now'))`).notNull(),
});

// ============================================================================
// NOTES SCHEMA
// ============================================================================

// Folders/Notebooks
export const folders = sqliteTable("folders", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  icon: text("icon"),
  color: text("color"),
  parentId: text("parent_id"),
  sortOrder: integer("sort_order").default(0),
  createdAt: text("created_at").default(sql`(datetime('now'))`).notNull(),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`).notNull(),
});

// Note tags
export const noteTags = sqliteTable("note_tags", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull().unique(),
  color: text("color"),
  createdAt: text("created_at").default(sql`(datetime('now'))`).notNull(),
});

// Notes
export const notes = sqliteTable("notes", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  folderId: text("folder_id").references(() => folders.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  contentPlain: text("content_plain"),
  isPinned: integer("is_pinned", { mode: "boolean" }).default(false),
  isArchived: integer("is_archived", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`(datetime('now'))`).notNull(),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`).notNull(),
});

// Note-Tag junction table
export const notesToTags = sqliteTable("notes_to_tags", {
  noteId: text("note_id").references(() => notes.id, { onDelete: "cascade" }).notNull(),
  tagId: text("tag_id").references(() => noteTags.id, { onDelete: "cascade" }).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.noteId, table.tagId] }),
}));

// Note links (for wiki-style linking)
export const noteLinks = sqliteTable("note_links", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  sourceNoteId: text("source_note_id").references(() => notes.id, { onDelete: "cascade" }).notNull(),
  targetNoteId: text("target_note_id").references(() => notes.id, { onDelete: "cascade" }).notNull(),
  createdAt: text("created_at").default(sql`(datetime('now'))`).notNull(),
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;

export type Budget = typeof budgets.$inferSelect;
export type NewBudget = typeof budgets.$inferInsert;

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;

export type TaskTag = typeof taskTags.$inferSelect;
export type NewTaskTag = typeof taskTags.$inferInsert;

export type Folder = typeof folders.$inferSelect;
export type NewFolder = typeof folders.$inferInsert;

export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;

export type NoteTag = typeof noteTags.$inferSelect;
export type NewNoteTag = typeof noteTags.$inferInsert;
