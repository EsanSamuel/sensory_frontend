"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {
  IconArrowLeft,
  IconArrowRight,
  IconCircleCheckFilled,
  IconClock,
  IconCopy,
  IconDotsVertical,
  IconKey,
  IconPlus,
  IconRefresh,
  IconServer,
  IconShieldCheck,
  IconTrash,
  IconX,
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { useProxyProject } from "@/hooks/useProxyProject";
import type { ProxyProject } from "@/hooks/api/proxy-api";

export default function ProxyProjectsPage() {
  const { user } = useUser();
  const { createProject, isCreating, projects, isLoadingProjects, generateApiKey, isGeneratingKey } =
    useProxyProject(user?.id);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProxyProject | null>(null);
  const [generatedApiKey, setGeneratedApiKey] = useState("");

  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
  });
  const [backendUrls, setBackendUrls] = useState<string[]>([""]);

  const addUrlField = () => setBackendUrls([...backendUrls, ""]);
  const removeUrlField = (index: number) => {
    if (backendUrls.length <= 1) return;
    setBackendUrls(backendUrls.filter((_, i) => i !== index));
  };
  const updateUrl = (index: number, value: string) => {
    const updated = [...backendUrls];
    updated[index] = value;
    setBackendUrls(updated);
  };

  const handleCreateProject = async () => {
    const filteredUrls = backendUrls.filter((u) => u.trim() !== "");
    if (filteredUrls.length === 0) {
      toast.error("Please add at least one backend URL");
      return;
    }

    try {
      await createProject({
        project_name: newProject.name,
        description: newProject.description,
        user_id: user?.id!,
        backend_urls: filteredUrls,
      });
      toast.success("Proxy project created successfully");
      setNewProject({ name: "", description: "" });
      setBackendUrls([""]);
      setIsDialogOpen(false);
    } catch (err) {
      toast.error("Failed to create project");
    }
  };

  const handleGenerateApiKey = async (projectId: string) => {
    try {
      const apiKey = await generateApiKey(projectId);
      setGeneratedApiKey(apiKey);
      toast.success("API Key generated successfully");
    } catch (err) {
      toast.error("Failed to generate API key");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const openApiKeyDialog = (project: ProxyProject) => {
    setSelectedProject(project);
    setGeneratedApiKey("");
    setIsApiKeyDialogOpen(true);
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMins < 60)
      return `${diffInMins} minute${diffInMins !== 1 ? "s" : ""} ago`;
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
    return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/proxy">
            <Button variant="ghost" size="icon" className="size-8">
              <IconArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold lg:text-3xl">Proxy Projects</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Create and manage your reverse proxy configurations
            </p>
          </div>
        </div>

        {/* Create Project Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <IconPlus className="size-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Proxy Project</DialogTitle>
              <DialogDescription>
                Set up a new reverse proxy with your backend service URLs
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="proxy-project-name">Project Name</Label>
                <Input
                  id="proxy-project-name"
                  placeholder="e.g., My API Gateway"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  disabled={isCreating}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="proxy-project-description">Description</Label>
                <Textarea
                  id="proxy-project-description"
                  placeholder="Brief description of your proxy setup..."
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject({ ...newProject, description: e.target.value })
                  }
                  rows={2}
                  disabled={isCreating}
                />
              </div>

              {/* Backend URLs */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Backend URLs</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={addUrlField}
                    className="h-7 gap-1 text-xs"
                    disabled={isCreating}
                  >
                    <IconPlus className="size-3" />
                    Add URL
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Add your backend server URLs. Requests will be load-balanced across them.
                </p>
                <div className="space-y-2">
                  {backendUrls.map((url, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="flex size-6 shrink-0 items-center justify-center rounded bg-muted text-[10px] font-medium text-muted-foreground">
                        {index + 1}
                      </div>
                      <Input
                        placeholder="https://api.example.com:8080"
                        value={url}
                        onChange={(e) => updateUrl(index, e.target.value)}
                        className="font-mono text-sm"
                        disabled={isCreating}
                      />
                      {backendUrls.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
                          onClick={() => removeUrlField(index)}
                          disabled={isCreating}
                        >
                          <IconX className="size-3.5" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isCreating}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateProject}
                disabled={!newProject.name.trim() || isCreating}
              >
                {isCreating ? (
                  <>
                    <IconRefresh className="size-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <IconPlus className="size-4" />
                    Create Project
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {isLoadingProjects
          ? [1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-5 w-2/3 rounded bg-muted" />
                  <div className="mt-2 h-4 w-1/2 rounded bg-muted" />
                  <div className="mt-6 space-y-2">
                    <div className="h-3 w-full rounded bg-muted" />
                    <div className="h-3 w-3/4 rounded bg-muted" />
                  </div>
                </CardHeader>
              </Card>
            ))
          : projects?.map((project: ProxyProject) => (
              <Card
                key={project.project_id}
                className="group relative transition-all hover:shadow-md"
              >
                <CardHeader>
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <CardTitle className="text-lg">{project.project_name}</CardTitle>
                        {project.api_key ? (
                          <Badge
                            variant="outline"
                            className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          >
                            <IconCircleCheckFilled className="mr-1 size-3" />
                            Active
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          >
                            No Key
                          </Badge>
                        )}
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
                        >
                          <IconDotsVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Link href={`/proxy/logs/${project.project_id}`}>
                          <DropdownMenuItem>
                            <IconArrowRight className="mr-2 size-4" />
                            View Logs
                          </DropdownMenuItem>
                        </Link>
                        {project.api_key && (
                          <DropdownMenuItem
                            onClick={() => copyToClipboard(project.api_key)}
                          >
                            <IconCopy className="mr-2 size-4" />
                            Copy API Key
                          </DropdownMenuItem>
                        )}
                        {!project.api_key && (
                          <DropdownMenuItem onClick={() => openApiKeyDialog(project)}>
                            <IconKey className="mr-2 size-4" />
                            Generate API Key
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive">
                          <IconTrash className="mr-2 size-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Stats */}
                  <div className="space-y-3 border-t pt-3">
                    {/* Backend URLs */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Backends:</span>
                      <div className="flex flex-wrap gap-1">
                        {project.backend_urls?.slice(0, 2).map((url, i) => (
                          <Badge key={i} variant="secondary" className="font-mono text-[10px]">
                            {new URL(url).host}
                          </Badge>
                        ))}
                        {(project.backend_urls?.length ?? 0) > 2 && (
                          <Badge variant="secondary" className="text-[10px]">
                            +{project.backend_urls.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* API Key */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <IconKey className="size-3.5" />
                        API Key
                      </span>
                      {project.api_key ? (
                        <button
                          onClick={() => copyToClipboard(project.api_key)}
                          className="flex items-center gap-1.5 font-mono text-xs transition-colors hover:text-foreground"
                        >
                          <span>{project.api_key.slice(0, 12)}...****</span>
                          <IconCopy className="size-3" />
                        </button>
                      ) : (
                        <button
                          onClick={() => openApiKeyDialog(project)}
                          className="flex items-center gap-1.5 text-xs font-medium text-violet-600 transition-colors hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
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
              </Card>
            ))}

        {/* Empty State */}
        {!isLoadingProjects && projects?.length === 0 && (
          <div className="col-span-full flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed">
            <div className="text-center">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-violet-500/10">
                <IconServer className="size-6 text-violet-500" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">No proxy projects yet</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Create your first reverse proxy project
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <IconPlus className="size-4" />
                Create Project
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* API Key Dialog */}
      <Dialog open={isApiKeyDialogOpen} onOpenChange={setIsApiKeyDialogOpen}>
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
                    This API key will only be shown once. Make sure to copy and
                    store it securely.
                  </AlertDescription>
                </Alert>

                <div className="rounded-lg border bg-muted/50 p-4">
                  <h4 className="mb-2 text-sm font-semibold">
                    Use this API key to:
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5">•</span>
                      <span>Authenticate requests through the reverse proxy</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5">•</span>
                      <span>Route traffic to your registered backend services</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5">•</span>
                      <span>Monitor and log all proxied requests</span>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <Alert className="border-emerald-500/50 bg-emerald-500/10">
                  <IconShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
                  <AlertTitle className="text-emerald-600 dark:text-emerald-400">
                    API Key Generated
                  </AlertTitle>
                  <AlertDescription className="text-emerald-600/80 dark:text-emerald-400/80">
                    Your API key has been generated successfully. Copy it now.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label>Your API Key</Label>
                  <div className="flex gap-2">
                    <Input value={generatedApiKey} readOnly className="font-mono text-sm" />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => copyToClipboard(generatedApiKey)}
                    >
                      <IconCopy className="size-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Set this as the <code className="rounded bg-muted px-1 py-0.5 text-[11px]">X-API-KEY</code> header in your requests.
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
                  onClick={() => handleGenerateApiKey(selectedProject?.project_id ?? "")}
                  disabled={isGeneratingKey}
                >
                  {isGeneratingKey ? (
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
              <Button onClick={() => setIsApiKeyDialogOpen(false)}>Done</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Summary Stats */}
      {projects && projects.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
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
              <CardDescription>With API Keys</CardDescription>
              <CardTitle className="text-2xl font-bold tabular-nums">
                {projects.filter((p) => p.api_key).length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Backends</CardDescription>
              <CardTitle className="text-2xl font-bold tabular-nums">
                {projects.reduce(
                  (sum, p) => sum + (p.backend_urls?.length ?? 0),
                  0,
                )}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      )}
    </div>
  );
}
