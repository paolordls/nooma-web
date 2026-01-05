import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { tasksRepository } from "@/db/repositories/tasks";
import { Badge } from "@/components/ui/badge";
import { Plus, FolderKanban } from "lucide-react";
import { ProjectForm } from "./project-form";

export default async function ProjectsPage() {
  const [projects, tasks] = await Promise.all([
    tasksRepository.getProjects(),
    tasksRepository.getTasks(),
  ]);

  // Group tasks by project
  const tasksByProject = tasks.reduce((acc, task) => {
    const projectId = task.projectId || "inbox";
    if (!acc[projectId]) {
      acc[projectId] = { total: 0, done: 0 };
    }
    acc[projectId].total++;
    if (task.status === "done") {
      acc[projectId].done++;
    }
    return acc;
  }, {} as Record<string, { total: number; done: number }>);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Projects</h1>
        <p className="text-muted-foreground">Organize your tasks into projects</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* New Project Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Project
            </CardTitle>
            <CardDescription>Create a new project</CardDescription>
          </CardHeader>
          <CardContent>
            <ProjectForm />
          </CardContent>
        </Card>

        {/* Projects List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Projects</CardTitle>
            <CardDescription>{projects.length} project(s)</CardDescription>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <p className="text-sm text-muted-foreground">No projects yet. Create one to organize your tasks.</p>
            ) : (
              <ul className="space-y-4">
                {projects.map((project) => {
                  const stats = tasksByProject[project.id] || { total: 0, done: 0 };
                  const progress = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

                  return (
                    <li key={project.id} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: project.color || "#6366f1" }}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{project.name}</p>
                            <Badge variant="secondary" className="capitalize">{project.status}</Badge>
                          </div>
                          {project.description && (
                            <p className="text-sm text-muted-foreground">{project.description}</p>
                          )}
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>{stats.done}/{stats.total} tasks</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div
                            className="bg-primary rounded-full h-2 transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
