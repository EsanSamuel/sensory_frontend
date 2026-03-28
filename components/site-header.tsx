"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { Moon, Sun, Search } from "lucide-react";
import { SignUpButton, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function SiteHeader() {
  const { setTheme } = useTheme();
  const { user } = useUser();
  const pathname = usePathname();

  const header = () => {
    switch (true) {
      case pathname === "/":
        return "Dashboard";
      case pathname === "/logs":
        return "Logs";
      case pathname === "/projects":
        return "Projects";
      case pathname.startsWith("/projects/"):
        return "Projects";
      case pathname === "/analytics":
        return "Analytics";
      case pathname === "/settings":
        return "Settings";
      case pathname === "/search":
        return "Search";
      case pathname === "/history":
        return "History";
      default:
        return "Dashboard";
    }
  };

  // Breadcrumb for project detail pages
  const breadcrumb = () => {
    if (pathname.startsWith("/projects/") && pathname !== "/projects") {
      return (
        <>
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <Link
            href="/projects"
            className="text-[12px] text-muted-foreground hover:text-foreground transition-colors xl:text-sm"
          >
            Projects
          </Link>
          <span className="text-muted-foreground text-[12px] xl:text-sm">
            /
          </span>
          <span className="text-[12px] font-medium xl:text-sm">Details</span>
        </>
      );
    }
    return null;
  };

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="font-medium text-[12px] xl:text-base">{header()}</h1>
        {breadcrumb()}
        <div className="ml-auto flex items-center gap-2">
          {/* Global Search Button */}
          <Button variant="outline" size="icon" asChild>
            <Link href="/search">
              <Search className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Search logs</span>
            </Link>
          </Button>

          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {!user && (
            <SignUpButton>
              <Button className="">Sign Up</Button>
            </SignUpButton>
          )}
        </div>
      </div>
    </header>
  );
}
