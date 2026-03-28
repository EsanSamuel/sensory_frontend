import React from "react";
import Link from "next/link";
import { 
  IconCloudDataConnection, 
  IconServer, 
  IconDatabase, 
  IconDeviceDesktopAnalytics,
  IconTerminal2,
  IconArrowRight
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "How It Works | Sensory",
  description: "Learn how the Sensory real-time log management platform works from end to end.",
};

export default function HowItWorksPage() {
  const steps = [
    {
      id: "01",
      title: "Application Integration",
      subtitle: "The Client",
      icon: <IconTerminal2 className="size-8 text-blue-500" />,
      description: (
        <>
          <p className="mb-4">
            The integration process begins with the lightweight <strong>Sensory Log Client</strong> (available for Go). Developers can incorporate the logger into their services by initializing it with their unique Project API Key.
          </p>
          <p className="mb-4">
            When the application starts, the SDK establishes a secure, persistent <strong>WebSocket connection</strong> directly to the Sensory server. Whenever an event or error occurs and a log is recorded, the SDK works continuously in the background to automatically enrich your log with precise runtime context:
          </p>
          <ul className="mb-6 list-inside list-disc space-y-2 text-muted-foreground">
            <li>The exact <strong>file</strong> where the log was triggered.</li>
            <li>The <strong>line number</strong> causing the issue.</li>
            <li>The <strong>function name</strong> that executed the code.</li>
          </ul>
          <p>
            This enriched payload is instantly streamed over the active WebSocket connection without slowing down your application's main thread.
          </p>
        </>
      ),
      code: `package config

import (
	"fmt"
	"os"

	logClient "github.com/EsanSamuel/sensory/LogClient"
)

func InitLogger() *logClient.Client {

	api_key := os.Getenv("SENSORY_API_KEY")

	logger, err := logClient.New(api_key)
	if err != nil {
		fmt.Println("Logger connection failed:", err.Error())
		return logClient.NewNoOp()
	}

	fmt.Println("Logger connected successfully")
	return logger
}

/* ------------------------------------- */

// In your application code:

var logger = config.InitLogger()

logger.INFO(summary)
logger.DEBUG("Debug detail")
logger.WARN("Retry limit approaching")
logger.ERROR("Database connection failed")
logger.FATAL("Unexpected system crash")`
    },
    {
      id: "02",
      title: "Real-Time Ingestion",
      subtitle: "The Server",
      icon: <IconServer className="size-8 text-purple-500" />,
      description: (
        <>
          <p className="mb-4">
            The central <strong>Sensory Server</strong> runs a high-performance WebSocket Gateway that listens for incoming data streams from multiple clients simultaneously.
          </p>
          <ul className="space-y-4 text-muted-foreground">
            <li>
              <strong className="text-foreground">Continuous Listening:</strong> As JSON log entries arrive, the server parses them in real-time.
            </li>
            <li>
              <strong className="text-foreground">Authentication & Verification:</strong> The server cross-references the API key attached to the log against the database, securely mapping the incoming data to the correct Project and User.
            </li>
            <li>
              <strong className="text-foreground">Intelligent Deduplication:</strong> To protect against log spam (such as an infinite loop rapidly firing the exact same error), Sensory incorporates smart deduplication logic. It checks for duplicate occurrences of identical messages and timestamps within the same project to keep your logs clean and manageable.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "03",
      title: "Storage & Actionable Alerts",
      subtitle: "The Database & Workers",
      icon: <IconDatabase className="size-8 text-green-500" />,
      description: (
        <>
          <p className="mb-4">
            Once a log is validated and authenticated, the system ensures data permanence and triggers necessary alerts:
          </p>
          <ul className="space-y-4 text-muted-foreground">
            <li>
              <strong className="text-foreground">Secure Storage:</strong> The entry is firmly persisted in the database, fully indexed and ready for deep search and analytics.
            </li>
            <li>
              <strong className="text-foreground">Live Metrics:</strong> The system instantly increments your project's <code>log_counts</code>, providing real-time telemetry back to the main dashboard.
            </li>
            <li>
              <strong className="text-foreground">Automated Email Queue:</strong> A specialized background worker kicks into action. The platform looks up the developer or team responsible for the project and dispatches instantaneous email notifications for critical logs, ensuring that developers are immediately alerted the moment an anomaly is detected.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "04",
      title: "The Dashboard Experience",
      subtitle: "The Developer UI",
      icon: <IconDeviceDesktopAnalytics className="size-8 text-orange-500" />,
      description: (
        <>
          <p className="mb-4">
            Because everything flows through WebSockets and real-time triggers, the end result is a highly responsive developer dashboard. 
          </p>
          <p className="text-muted-foreground">
            You can watch your logs stream in live, visualize volume spikes, filter by service or severity level, and pinpoint exactly which line of code is failing all in one unified interface.
          </p>
        </>
      ),
    }
  ];

  return (
    <div className="flex flex-col pb-24">
      {/* HEADER SECTION */}
      <section className="relative overflow-hidden bg-muted/30 pt-24 pb-20 lg:pt-32 lg:pb-28">
        <div className="absolute inset-0 z-0 bg-background bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.2),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
        
        <div className="container relative z-10 mx-auto max-w-5xl px-4 text-center lg:px-8">
          <div className="mx-auto inline-flex items-center justify-center rounded-full border bg-background/50 px-3 py-1 mb-6 text-sm font-medium text-muted-foreground backdrop-blur-sm shadow-sm">
            <IconCloudDataConnection className="mr-2 size-4 text-primary" />
            Architecture Overview
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            How Sensory Works
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Sensory is a real-time log management and monitoring platform designed for speed, reliability, and ease of use. It establishes a seamless pipeline from your application code straight to your monitoring dashboard using low-latency WebSockets.
          </p>
        </div>
      </section>

      {/* STEPS SECTION */}
      <section className="container mx-auto max-w-5xl px-4 py-16 lg:px-8">
        <div className="space-y-24 lg:space-y-32">
          {steps.map((step, index) => (
            <div 
              key={step.id} 
              className={`flex flex-col gap-12 lg:flex-row ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
            >
              {/* Content Side */}
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-muted/50 border shadow-sm">
                    {step.icon}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-primary tracking-wider uppercase">Step {step.id} &mdash; {step.subtitle}</span>
                    <h2 className="text-3xl font-bold tracking-tight">{step.title}</h2>
                  </div>
                </div>
                <div className="text-lg leading-relaxed text-foreground/90">
                  {step.description}
                </div>
              </div>

              {/* Visual/Code Side */}
              <div className="flex-1 lg:mt-0 mt-8">
                {step.code ? (
                  <div className="overflow-hidden rounded-xl border bg-[#0d1117] shadow-xl">
                    <div className="flex items-center px-4 py-3 border-b border-gray-800 bg-[#161b22]">
                      <div className="flex gap-1.5">
                        <div className="size-3 rounded-full bg-red-500/80" />
                        <div className="size-3 rounded-full bg-yellow-500/80" />
                        <div className="size-3 rounded-full bg-green-500/80" />
                      </div>
                      <div className="ml-4 text-xs font-mono text-gray-400">client.go</div>
                    </div>
                    <div className="p-4 overflow-x-auto text-sm">
                      <pre className="font-mono text-gray-300 leading-relaxed">
                        <code>{step.code}</code>
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-xl border bg-muted/20 p-8 shadow-inner relative overflow-hidden">
                    {/* Abstract illustration based on step */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50"></div>
                    {step.id === "02" && (
                      <div className="relative flex flex-col items-center gap-4 w-full max-w-xs">
                        <div className="flex w-full justify-between px-4">
                          <div className="size-3 rounded-full bg-blue-500 animate-pulse"></div>
                          <div className="size-3 rounded-full bg-green-500 animate-pulse delay-75"></div>
                          <div className="size-3 rounded-full bg-yellow-500 animate-pulse delay-150"></div>
                        </div>
                        <div className="h-24 w-full rounded-xl border-2 border-dashed border-primary/30 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                          <IconServer className="size-10 text-primary/50" />
                        </div>
                        <div className="h-2 w-1/2 bg-gradient-to-r from-transparent via-primary/50 to-transparent rounded-full"></div>
                      </div>
                    )}
                    {step.id === "03" && (
                      <div className="relative flex flex-col items-center gap-6 w-full max-w-xs">
                        <div className="grid grid-cols-2 w-full gap-4">
                           <div className="h-16 rounded-lg bg-card border shadow-sm flex items-center justify-center">
                             <IconDatabase className="size-6 text-green-500/70" />
                           </div>
                           <div className="h-16 rounded-lg bg-card border shadow-sm flex items-center justify-center">
                             <IconDeviceDesktopAnalytics className="size-6 text-blue-500/70" />
                           </div>
                        </div>
                      </div>
                    )}
                    {step.id === "04" && (
                      <div className="relative flex flex-col items-center w-full max-w-sm rounded-lg border bg-card shadow-sm overflow-hidden z-10">
                        <div className="h-8 border-b bg-muted/50 flex items-center px-3">
                           <div className="h-3 w-20 rounded bg-muted"></div>
                        </div>
                        <div className="p-4 space-y-2 w-full">
                           <div className="flex justify-between items-center">
                             <div className="h-4 w-1/3 rounded bg-red-500/20"></div>
                             <div className="h-3 w-10 rounded bg-muted"></div>
                           </div>
                           <div className="h-2 w-full rounded bg-muted/30"></div>
                           <div className="h-2 w-3/4 rounded bg-muted/30"></div>
                           <div className="h-2 w-5/6 rounded bg-muted/30"></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="container mx-auto max-w-4xl px-4 mt-12 lg:px-8 text-center border-t pt-16">
        <h2 className="text-3xl font-bold tracking-tight mb-4">
          Ready to build with Sensory?
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Integrate our lightweight SDK to your application and start monitoring in just 2 minutes.
        </p>
        <Link href="/">
          <Button size="lg" className="h-12 px-8 text-base">
            Get Started <IconArrowRight className="ml-2 size-4" />
          </Button>
        </Link>
      </section>
    </div>
  );
}
