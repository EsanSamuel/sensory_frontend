"use client";

import { useState } from "react";
import {
  IconAlertTriangle,
  IconChevronRight,
  IconCircleCheckFilled,
  IconClock,
  IconCopy,
  IconDotsVertical,
  IconKey,
  IconPlus,
  IconRefresh,
  IconShieldCheck,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useProject } from "@/hooks/useProject";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import axios from "axios";
import { api } from "@/hooks/api/api";

interface Project {
  _id: string;
  project_id: string;
  project_name: string;
  description: string;
  user_id: string;
  api_key: string;
  service: string;
  log_counts: number;
  created_at: string;
  updated_at: string;
}

const Project = () => {
  const { user } = useUser();
  const { createProject, projects } = useProject("", user?.id);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [generatedApiKey, setGeneratedApiKey] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    service: "",
  });

  const handleCreateProject = async () => {
    const response = await createProject({
      project_name: newProject.name,
      description: newProject.description,
      user_id: user?.id!,
    });
    console.log("Project: ", response);
    setNewProject({ name: "", description: "", service: "" });
    setIsDialogOpen(false);
  };

  const handleGenerateApiKey = async (projectId: string) => {
    if (!selectedProject) return;

    setIsGenerating(true);
    try {
      const response = await api.post(`/project/api_key/${projectId}`);
      console.log(response.data.apikey);
      setGeneratedApiKey(response.data.apikey);

      toast.success("API Key generated successfully");
    } catch (error) {
      toast.error("Failed to generate API key");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyApiKey = (apiKey: string) => {
    navigator.clipboard.writeText(apiKey);
    toast.success("API Key copied to clipboard");
  };

  const openApiKeyDialog = (project: Project) => {
    setSelectedProject(project);``
    setGeneratedApiKey("");
    setIsApiKeyDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMins < 60) {
      return `${diffInMins} minute${diffInMins !== 1 ? "s" : ""} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
    } else {
      return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
    }
  };

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold lg:text-3xl">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage and monitor your log tracking projects
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <IconPlus className="size-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Add a new project to start tracking logs
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  placeholder="e.g., My Application"
                  value={newProject.name}
                  onChange={(e) =>
                    setNewProject({ ...newProject, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-service">Service (Optional)</Label>
                <Input
                  id="project-service"
                  placeholder="e.g., API, Database, Auth"
                  value={newProject.service}
                  onChange={(e) =>
                    setNewProject({ ...newProject, service: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-description">Description</Label>
                <Textarea
                  id="project-description"
                  placeholder="Brief description of your project..."
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateProject}
                disabled={!newProject.name.trim()}
              >
                Create Project
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* API Key Generation Modal */}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects?.map((project: Project) => (
          <Card
            key={project._id}
            className="group relative cursor-pointer transition-all hover:shadow-md"
          >
            <CardHeader>
              <div className="mb-3 flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <CardTitle className="text-lg">
                      {project.project_name}
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30"
                    >
                      <IconCircleCheckFilled className="mr-1 size-3" />
                      Active
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {project.description || "No description provided"}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={(e) => e.preventDefault()}
                    >
                      <IconDotsVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <Link href={`/projects/${project.project_id}`}>
                      <DropdownMenuItem>
                        <IconChevronRight className="mr-2 size-4" />
                        View Details
                      </DropdownMenuItem>
                    </Link>
                    {project.api_key && (
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.preventDefault();
                          copyApiKey(project.api_key);
                        }}
                      >
                        <IconCopy className="mr-2 size-4" />
                        Copy API Key
                      </DropdownMenuItem>
                    )}
                    {!project.api_key && (
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.preventDefault();
                          openApiKeyDialog(project);
                        }}
                      >
                        <IconKey className="mr-2 size-4" />
                        Generate API Key
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem>Edit Project</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Stats */}
              <div className="space-y-3 border-t pt-3">
                {/* Service Badge */}
                {project.service && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      Service:
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {project.service}
                    </Badge>
                  </div>
                )}

                {/* Log Count */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Logs</span>
                  <span className="font-mono font-semibold">
                    {project.log_counts.toLocaleString()}
                  </span>
                </div>

                {/* API Key (masked) */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <IconKey className="size-3.5" />
                    API Key
                  </span>
                  {project.api_key ? (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        copyApiKey(project.api_key);
                      }}
                      className="flex items-center gap-1.5 font-mono text-xs hover:text-foreground transition-colors"
                    >
                      <span>{project.api_key.slice(0, 12)}...****</span>
                      <IconCopy className="size-3" />
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        openApiKeyDialog(project);
                      }}
                      className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-medium"
                    >
                      <IconKey className="size-3.5" />
                      Generate
                    </button>
                  )}
                </div>

                {/* Timestamps */}
                <div className="flex items-center justify-between border-t pt-3 text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <IconClock className="size-3.5" />
                    <span>Updated {getTimeAgo(project.updated_at)}</span>
                  </div>
                  <span className="text-muted-foreground">
                    {formatDate(project.created_at)}
                  </span>
                </div>
              </div>
            </CardHeader>
            <Dialog
              open={isApiKeyDialogOpen}
              onOpenChange={setIsApiKeyDialogOpen}
            >
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <IconKey className="size-5" />
                    Generate API Key
                  </DialogTitle>
                  <DialogDescription>
                    Generate a new API key for {selectedProject?.project_name}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  {!generatedApiKey ? (
                    <>
                      <Alert>
                        <IconShieldCheck className="size-4" />
                        <AlertTitle>Important</AlertTitle>
                        <AlertDescription>
                          This API key will only be shown once. Make sure to
                          copy and store it securely.
                        </AlertDescription>
                      </Alert>

                      <div className="rounded-lg border bg-muted/50 p-4">
                        <h4 className="mb-2 text-sm font-semibold">
                          What you can do with this API key:
                        </h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <span className="mt-0.5">•</span>
                            <span>Send logs to your project</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="mt-0.5">•</span>
                            <span>Authenticate API requests</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="mt-0.5">•</span>
                            <span>Access project-specific data</span>
                          </li>
                        </ul>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <Alert className="border-green-500/50 bg-green-500/10">
                        <IconShieldCheck className="size-4 text-green-600 dark:text-green-400" />
                        <AlertTitle className="text-green-600 dark:text-green-400">
                          API Key Generated
                        </AlertTitle>
                        <AlertDescription className="text-green-600/80 dark:text-green-400/80">
                          Your API key has been generated successfully. Copy it
                          now.
                        </AlertDescription>
                      </Alert>

                      <div className="space-y-2">
                        <Label>Your API Key</Label>
                        <div className="flex gap-2">
                          <Input
                            value={generatedApiKey}
                            readOnly
                            className="font-mono text-sm"
                          />
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => copyApiKey(generatedApiKey)}
                          >
                            <IconCopy className="size-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Make sure to copy this key now. You won't be able to
                          see it again.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <DialogFooter>
                  {!generatedApiKey ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => setIsApiKeyDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleGenerateApiKey(project.project_id)}
                        disabled={isGenerating}
                      >
                        {isGenerating ? (
                          <>
                            <IconRefresh className="size-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <IconKey className="size-4" />
                            Generate Key
                          </>
                        )}
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsApiKeyDialogOpen(false)}>
                      Done
                    </Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Card>
        ))}

        {/* Empty State */}
        {projects?.length === 0 && (
          <div className="col-span-full flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed">
            <div className="text-center">
              <h3 className="mb-2 text-lg font-semibold">No projects yet</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Create your first project to start tracking logs
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <IconPlus className="size-4" />
                Create Project
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {projects?.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Projects</CardDescription>
              <CardTitle className="text-2xl font-bold tabular-nums">
                {projects.length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Active Projects</CardDescription>
              <CardTitle className="text-2xl font-bold tabular-nums">
                {projects.length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Logs</CardDescription>
              <CardTitle className="text-2xl font-bold tabular-nums">
                {projects
                  .reduce((sum: number, p: Project) => sum + p.log_counts, 0)
                  .toLocaleString()}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Services</CardDescription>
              <CardTitle className="text-2xl font-bold tabular-nums">
                {
                  new Set(
                    projects
                      .filter((p: Project) => p.service)
                      .map((p: Project) => p.service),
                  ).size
                }
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Project;
