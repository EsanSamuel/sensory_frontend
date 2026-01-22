"use client";

import { useState } from "react";
import { IconCirclePlusFilled, IconPlus, type Icon } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useProject } from "@/hooks/useProject";
import { useUser } from "@clerk/nextjs";
import type { LucideIcon } from "lucide-react";

interface NavMainProps {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon
    badge?: string;
  }[];
  onCreateProject?: (project: {
    name: string;
    description: string;
    service: string;
  }) => void | Promise<void>;
}

export function NavMain({ items, onCreateProject }: NavMainProps) {
  const { user } = useUser();
  const { createProject, projects } = useProject("", user?.id);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    service: "",
  });
  const [isCreating, setIsCreating] = useState(false);

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

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        {/* Quick Create Button */}
        <SidebarMenu>
          <SidebarMenuItem>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <SidebarMenuButton
                  tooltip="Quick Create Project"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground duration-200 ease-linear"
                >
                  <IconCirclePlusFilled />
                  <span>Quick Create</span>
                </SidebarMenuButton>
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
                      disabled={isCreating}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="project-service">Service (Optional)</Label>
                    <Input
                      id="project-service"
                      placeholder="e.g., API, Database, Auth"
                      value={newProject.service}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          service: e.target.value,
                        })
                      }
                      disabled={isCreating}
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
                      disabled={isCreating}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={isCreating}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateProject}
                    disabled={!newProject.name.trim() || isCreating}
                  >
                    {isCreating ? (
                      <>
                        <IconPlus className="size-4 animate-spin" />
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
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Navigation Items */}
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <Link href={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  {item.badge && (
                    <span className="ml-auto text-xs font-medium text-primary">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
