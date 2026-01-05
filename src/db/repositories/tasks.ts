import { db } from "../client";
import { projects, tasks, taskTags, tasksToTags } from "../schema";
import { eq, desc, and, isNull } from "drizzle-orm";

export const tasksRepository = {
  // Projects
  async getProjects() {
    return db.select().from(projects).orderBy(desc(projects.createdAt));
  },

  async getProject(id: string) {
    const result = await db.select().from(projects).where(eq(projects.id, id));
    return result[0];
  },

  async createProject(data: {
    name: string;
    description?: string;
    color?: string;
    dueDate?: string;
  }) {
    const result = db.insert(projects).values(data).returning();
    return result.get();
  },

  async updateProject(id: string, data: Partial<{
    name: string;
    description: string;
    color: string;
    status: "active" | "completed" | "archived";
    dueDate: string;
  }>) {
    const result = db.update(projects)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(projects.id, id))
      .returning();
    return result.get();
  },

  async deleteProject(id: string) {
    // Delete associated tasks first
    await db.delete(tasks).where(eq(tasks.projectId, id));
    return db.delete(projects).where(eq(projects.id, id));
  },

  // Tasks
  async getTasks(filters?: {
    projectId?: string;
    status?: string;
    priority?: string;
  }) {
    let query = db.select().from(tasks);

    const conditions = [];
    if (filters?.projectId) conditions.push(eq(tasks.projectId, filters.projectId));
    if (filters?.status) conditions.push(eq(tasks.status, filters.status as "todo" | "in_progress" | "done" | "blocked"));
    if (filters?.priority) conditions.push(eq(tasks.priority, filters.priority as "low" | "medium" | "high" | "urgent"));

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query;
    }

    return query.orderBy(desc(tasks.createdAt));
  },

  async getInboxTasks() {
    return db.select().from(tasks)
      .where(isNull(tasks.projectId))
      .orderBy(desc(tasks.createdAt));
  },

  async getTask(id: string) {
    const result = await db.select().from(tasks).where(eq(tasks.id, id));
    return result[0];
  },

  async createTask(data: {
    title: string;
    description?: string;
    projectId?: string;
    priority?: "low" | "medium" | "high" | "urgent";
    dueDate?: string;
  }) {
    const result = db.insert(tasks).values({
      title: data.title,
      description: data.description,
      projectId: data.projectId,
      priority: data.priority || "medium",
      status: "todo",
      dueDate: data.dueDate,
    }).returning();
    return result.get();
  },

  async updateTask(id: string, data: Partial<{
    title: string;
    description: string;
    projectId: string;
    status: "todo" | "in_progress" | "done" | "blocked";
    priority: "low" | "medium" | "high" | "urgent";
    dueDate: string;
  }>) {
    const updateData: Record<string, unknown> = { ...data, updatedAt: new Date().toISOString() };

    if (data.status === "done") {
      updateData.completedAt = new Date().toISOString();
    }

    const result = db.update(tasks)
      .set(updateData)
      .where(eq(tasks.id, id))
      .returning();
    return result.get();
  },

  async completeTask(id: string) {
    return this.updateTask(id, { status: "done" });
  },

  async deleteTask(id: string) {
    // Delete tag associations first
    await db.delete(tasksToTags).where(eq(tasksToTags.taskId, id));
    return db.delete(tasks).where(eq(tasks.id, id));
  },

  // Tags
  async getTags() {
    return db.select().from(taskTags).orderBy(taskTags.name);
  },

  async createTag(data: { name: string; color?: string }) {
    const result = db.insert(taskTags).values(data).returning();
    return result.get();
  },

  // Stats
  async getStats() {
    const allTasks = await db.select().from(tasks);
    const allProjects = await db.select().from(projects);

    return {
      totalTasks: allTasks.length,
      todoTasks: allTasks.filter(t => t.status === "todo").length,
      inProgressTasks: allTasks.filter(t => t.status === "in_progress").length,
      completedTasks: allTasks.filter(t => t.status === "done").length,
      totalProjects: allProjects.length,
      activeProjects: allProjects.filter(p => p.status === "active").length,
    };
  },
};
