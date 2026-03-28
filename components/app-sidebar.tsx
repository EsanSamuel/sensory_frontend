"use client";

import * as React from "react";
import {
  IconActivity,
  IconAlertTriangle,
  IconChartLine,
  IconClock,
  IconHelp,
  IconSearch,
  IconSettings,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { File, Folder, FolderCheck } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { useAuth } from "@clerk/nextjs";

const data = {
  user: {
    name: "Admin User",
    email: "admin@logtracker.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconActivity,
    },
    {
      title: "Projects",
      url: "/projects",
      icon: FolderCheck,
    },
    {
      title: "Logs",
      url: "/logs",
      icon: IconAlertTriangle,
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: IconChartLine,
    },
    {
      title: "History",
      url: "/history",
      icon: IconClock,
    },
  ],
  navSecondary: [
    {
      title: "Search",
      url: "/search",
      icon: IconSearch,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettings,
    },
    {
      title: "Help",
      url: "/help",
      icon: IconHelp,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { userId } = useAuth();
  const { user } = useUser(userId!);
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/">
                <div className="flex size-5 items-center justify-center rounded bg-gradient-to-br bg-blue-500">
                  <IconActivity className="!size-3 text-white" />
                </div>
                <span className="text-base font-semibold">Sensory</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
