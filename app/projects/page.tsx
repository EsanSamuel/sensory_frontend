"use client"

import { useState } from "react"
import {
  IconAlertTriangle,
  IconCalendar,
  IconChevronRight,
  IconCircleCheckFilled,
  IconClock,
  IconDotsVertical,
  IconPlus,
  IconTrendingDown,
  IconTrendingUp,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

interface Project {
  id: string
  name: string
  description: string
  status: "active" | "paused" | "archived"
  errorCount: number
  warningCount: number
  totalLogs: number
  lastActivity: string
  createdAt: string
  trend: "up" | "down"
  trendPercentage: number
}

// Sample projects data
const sampleProjects: Project[] = [
  {
    id: "1",
    name: "Log Tracker",
    description: "Main application logging and monitoring system",
    status: "active",
    errorCount: 12,
    warningCount: 45,
    totalLogs: 15234,
    lastActivity: "2 minutes ago",
    createdAt: "2024-01-15",
    trend: "down",
    trendPercentage: 12.5,
  },
  {
    id: "2",
    name: "Reddit Clone",
    description: "Social media platform with real-time features",
    status: "active",
    errorCount: 3,
    warningCount: 8,
    totalLogs: 8456,
    lastActivity: "15 minutes ago",
    createdAt: "2024-02-20",
    trend: "up",
    trendPercentage: 8.3,
  },
  {
    id: "3",
    name: "E-commerce API",
    description: "Backend services for online store",
    status: "active",
    errorCount: 23,
    warningCount: 67,
    totalLogs: 23456,
    lastActivity: "1 hour ago",
    createdAt: "2024-01-10",
    trend: "up",
    trendPercentage: 15.2,
  },
  {
    id: "4",
    name: "Payment Gateway",
    description: "Secure payment processing system",
    status: "paused",
    errorCount: 0,
    warningCount: 2,
    totalLogs: 1234,
    lastActivity: "3 days ago",
    createdAt: "2023-12-05",
    trend: "down",
    trendPercentage: 45.0,
  },
]

const Project = () => {
  const [projects, setProjects] = useState<Project[]>(sampleProjects)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
  })

  const handleCreateProject = () => {
    const project: Project = {
      id: String(projects.length + 1),
      name: newProject.name,
      description: newProject.description,
      status: "active",
      errorCount: 0,
      warningCount: 0,
      totalLogs: 0,
      lastActivity: "Just now",
      createdAt: new Date().toISOString().split("T")[0],
      trend: "up",
      trendPercentage: 0,
    }

    setProjects([...projects, project])
    setNewProject({ name: "", description: "" })
    setIsDialogOpen(false)
  }

  const getStatusBadge = (status: Project["status"]) => {
    const variants = {
      active: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30",
      paused: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
      archived: "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/30",
    }

    return (
      <Badge variant="outline" className={variants[status]}>
        {status === "active" && <IconCircleCheckFilled className="mr-1 size-3" />}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

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
                <Label htmlFor="project-description">Description</Label>
                <Textarea
                  id="project-description"
                  placeholder="Brief description of your project..."
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject({ ...newProject, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
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

      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="group relative cursor-pointer transition-all hover:shadow-md"
          >
            <Link href={`/projects/123`}>
            <CardHeader>
              <div className="mb-3 flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    {getStatusBadge(project.status)}
                  </div>
                  <CardDescription className="line-clamp-2">
                    {project.description}
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
                    <DropdownMenuItem>
                      <IconChevronRight className="mr-2 size-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>Edit Project</DropdownMenuItem>
                    <DropdownMenuItem>
                      {project.status === "active" ? "Pause" : "Resume"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Archive</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Stats */}
              <div className="space-y-3 border-t pt-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Logs</span>
                  <span className="font-mono font-semibold">
                    {project.totalLogs.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <IconAlertTriangle className="size-4 text-red-500" />
                    <span className="font-mono font-medium">
                      {project.errorCount}
                    </span>
                    <span className="text-muted-foreground">errors</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <IconAlertTriangle className="size-4 text-amber-500" />
                    <span className="font-mono font-medium">
                      {project.warningCount}
                    </span>
                    <span className="text-muted-foreground">warnings</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t pt-3 text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <IconClock className="size-3.5" />
                    <span>{project.lastActivity}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {project.trend === "up" ? (
                      <>
                        <IconTrendingUp className="size-3.5 text-red-500" />
                        <span className="text-red-600 dark:text-red-400">
                          +{project.trendPercentage}%
                        </span>
                      </>
                    ) : (
                      <>
                        <IconTrendingDown className="size-3.5 text-green-500" />
                        <span className="text-green-600 dark:text-green-400">
                          -{project.trendPercentage}%
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            </Link>
          </Card>
        ))}

        {/* Empty State */}
        {projects.length === 0 && (
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
      {projects.length > 0 && (
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
                {projects.filter((p) => p.status === "active").length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Errors</CardDescription>
              <CardTitle className="text-2xl font-bold tabular-nums text-red-600 dark:text-red-400">
                {projects.reduce((sum, p) => sum + p.errorCount, 0)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Logs</CardDescription>
              <CardTitle className="text-2xl font-bold tabular-nums">
                {projects
                  .reduce((sum, p) => sum + p.totalLogs, 0)
                  .toLocaleString()}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      )}
    </div>
  )
}

export default Project