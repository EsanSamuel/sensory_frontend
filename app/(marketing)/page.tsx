"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignUpButton, SignInButton, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  IconActivityHeartbeat,
  IconChartBar,
  IconBellRinging,
  IconSearch,
  IconLock,
  IconRocket,
  IconTerminal2,
  IconArrowRight,
  IconCloudLockOpen,
} from "@tabler/icons-react";

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  // If the user lands on "/" but is already signed in, redirect to dashboard
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || isSignedIn) {
    return null; // Avoid flashing the landing page before redirecting
  }

  const features = [
    {
      title: "Real-time Log Tailing",
      description:
        "Watch your logs stream in real-time with zero latency. Never refresh a page again while debugging.",
      icon: <IconTerminal2 className="size-6 text-primary" />,
    },
    {
      title: "Deep Analytics",
      description:
        "Automatically visualize log volumes, error hotspots, and peak activity across all your services.",
      icon: <IconChartBar className="size-6 text-primary" />,
    },
    {
      title: "Instant Alerts",
      description:
        "Get notified in Slack, via Email, or custom Webhooks the second an unexpected ERROR level log occurs.",
      icon: <IconBellRinging className="size-6 text-primary" />,
    },
    {
      title: "Global Search",
      description:
        "Find a needle in a haystack. Spotlight-style search lets you filter millions of logs instantly.",
      icon: <IconSearch className="size-6 text-primary" />,
    },
    {
      title: "Secure by Default",
      description:
        "Enterprise-grade security with Clerk authentication, RBAC, and encrypted log storage.",
      icon: <IconLock className="size-6 text-primary" />,
    },
    {
      title: "Unlimited Projects",
      description:
        "Monitor your entire microservice fleet from a single unified dashboard.",
      icon: <IconCloudLockOpen className="size-6 text-primary" />,
    },
  ];

  return (
    <div className="flex flex-col">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-24 pb-32 lg:pt-36 lg:pb-40">
        <div className="absolute inset-0 z-0 bg-background bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
        
        <div className="container relative z-10 mx-auto max-w-7xl px-4 text-center lg:px-8">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-6">
            <div className="inline-flex items-center rounded-full border bg-muted/50 px-3 py-1 text-sm text-muted-foreground backdrop-blur-sm">
              <span className="flex size-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              Sensory 2.0 is now live
            </div>
            
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
              Log management that <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                doesn't suck.
              </span>
            </h1>
            
            <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Monitor, search, and analyze your application logs in real-time. 
              Sensory gives you the observability you need to debug faster and sleep better.
            </p>
            
            <div className="mt-4 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <SignUpButton mode="modal">
                <Button size="lg" className="h-12 w-full px-8 text-base font-semibold sm:w-auto overflow-hidden group">
                  Start Monitoring Free
                  <IconArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </SignUpButton>
              <SignInButton mode="modal">
                <Button size="lg" variant="outline" className="h-12 w-full px-8 text-base font-semibold sm:w-auto">
                  View Live Demo
                </Button>
              </SignInButton>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              No credit card required. Free forever for individuals.
            </p>
          </div>
          
          {/* Dashboard Preview Image */}
          <div className="mx-auto mt-16 max-w-5xl md:mt-24">
            <div className="relative rounded-xl border bg-card p-2 shadow-2xl shadow-primary/20">
              <div className="flex items-center gap-1.5 border-b bg-muted/50 px-4 py-3">
                <div className="size-3 rounded-full bg-red-500/80" />
                <div className="size-3 rounded-full bg-yellow-500/80" />
                <div className="size-3 rounded-full bg-green-500/80" />
                <div className="ml-4 flex h-6 w-full max-w-xs items-center justify-center rounded-md border bg-background/50 text-[10px] text-muted-foreground font-mono">
                  sensory.app/dashboard
                </div>
              </div>
              <div className="aspect-[16/9] w-full bg-muted/20 relative overflow-hidden rounded-b-lg">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                
                {/* Mock Dashboard UI */}
                <div className="flex h-full w-full p-4">
                  {/* Sidebar Mock */}
                  <div className="hidden w-48 shrink-0 flex-col gap-2 border-r pr-4 sm:flex">
                    <div className="h-8 w-24 rounded bg-primary/20" />
                    <div className="mt-4 h-6 w-full rounded bg-muted" />
                    <div className="h-6 w-3/4 rounded bg-muted/50" />
                    <div className="h-6 w-5/6 rounded bg-muted/50" />
                    <div className="h-6 w-full rounded bg-muted/50" />
                  </div>
                  {/* Content Mock */}
                  <div className="flex-1 flex-col gap-4 sm:pl-4 flex">
                    <div className="flex items-center justify-between">
                      <div className="h-8 w-32 rounded bg-muted" />
                      <div className="h-8 w-24 rounded bg-primary/20" />
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="h-24 rounded-lg bg-card border shadow-sm p-4 flex flex-col justify-between">
                         <div className="h-3 w-1/2 rounded bg-muted" />
                         <div className="h-6 w-3/4 rounded bg-primary/40" />
                      </div>
                      <div className="h-24 rounded-lg bg-card border shadow-sm p-4 flex flex-col justify-between">
                         <div className="h-3 w-1/2 rounded bg-muted" />
                         <div className="h-6 w-3/4 rounded bg-primary/40" />
                      </div>
                      <div className="hidden sm:flex h-24 rounded-lg bg-card border shadow-sm p-4 flex-col justify-between">
                         <div className="h-3 w-1/2 rounded bg-muted" />
                         <div className="h-6 w-3/4 rounded bg-primary/40" />
                      </div>
                      <div className="hidden md:flex h-24 rounded-lg bg-card border shadow-sm p-4 flex-col justify-between">
                         <div className="h-3 w-1/2 rounded bg-muted" />
                         <div className="h-6 w-3/4 rounded bg-primary/40" />
                      </div>
                    </div>
                    <div className="flex-1 rounded-lg border bg-card p-4">
                      <div className="mb-4 h-4 w-1/4 rounded bg-muted" />
                      <div className="space-y-3">
                        <div className="h-8 w-full rounded bg-muted/30" />
                        <div className="h-8 w-full rounded bg-muted/30" />
                        <div className="h-8 w-full rounded bg-muted/30" />
                        <div className="h-8 w-full rounded bg-muted/30" />
                        <div className="h-8 w-1/2 rounded bg-muted/30" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="bg-muted/30 py-20 lg:py-32">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center md:max-w-2xl md:mx-auto">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to debug instantly
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Sensory provides a fully-loaded observability stack out of the box. 
              Stop parsing logs in the terminal and start analyzing them visually.
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <div 
                key={i} 
                className="group relative overflow-hidden rounded-2xl border bg-background p-8 shadow-sm transition-all hover:shadow-md"
              >
                <div className="mb-4 inline-flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10" />
        <div className="container relative z-10 mx-auto max-w-4xl px-4 text-center lg:px-8">
          <IconRocket className="mx-auto mb-6 size-12 text-primary" />
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Ready to gain deep insights?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground sm:text-xl">
            Join developers who have transformed their debugging workflow with Sensory's intuitive, real-time log monitoring.
          </p>
          <div className="mt-8 flex justify-center">
            <SignUpButton mode="modal">
              <Button size="lg" className="h-14 px-10 text-lg font-semibold w-full sm:w-auto">
                Get Started for Free
              </Button>
            </SignUpButton>
          </div>
        </div>
      </section>
    </div>
  );
}
