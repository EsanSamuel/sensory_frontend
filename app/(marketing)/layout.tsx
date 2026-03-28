import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconActivityHeartbeat, IconMenu2 } from "@tabler/icons-react";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            {/* Mobile Nav Toggle */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <IconMenu2 className="size-5" />
                  <span className="sr-only">Toggle mobile menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] p-6">
                <nav className="flex flex-col gap-4 mt-6">
                  <Link href="/" className="flex items-center gap-2 mb-4">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <IconActivityHeartbeat className="size-5" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Sensory</span>
                  </Link>
                  <Link href="#features" className="text-lg font-medium hover:text-primary">
                    Features
                  </Link>
                  <Link href="/how-it-works" className="text-lg font-medium hover:text-primary">
                    How it Works
                  </Link>
                  <Link href="#pricing" className="text-lg font-medium hover:text-primary">
                    Pricing
                  </Link>
                  <div className="mt-8 flex flex-col gap-3">
                    <SignInButton mode="modal">
                      <Button variant="outline" className="w-full">Log In</Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button className="w-full">Get Started</Button>
                    </SignUpButton>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <IconActivityHeartbeat className="size-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">Sensory</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="/how-it-works"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              How it Works
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Pricing
            </Link>
          </nav>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center gap-3">
            <SignInButton mode="modal">
              <Button variant="ghost">
                Log In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button>Get Started</Button>
            </SignUpButton>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t py-12 md:py-16">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex size-6 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <IconActivityHeartbeat className="size-4" />
                </div>
                <span className="text-lg font-bold tracking-tight">Sensory</span>
              </div>
              <p className="max-w-xs text-sm text-muted-foreground">
                Next-generation log monitoring and observability platform for
                modern teams.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Product</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">Features</Link></li>
                <li><Link href="#" className="hover:text-foreground">Integrations</Link></li>
                <li><Link href="#" className="hover:text-foreground">Pricing</Link></li>
                <li><Link href="#" className="hover:text-foreground">Changelog</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Company</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">About Us</Link></li>
                <li><Link href="#" className="hover:text-foreground">Careers</Link></li>
                <li><Link href="#" className="hover:text-foreground">Blog</Link></li>
                <li><Link href="#" className="hover:text-foreground">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Sensory, Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
