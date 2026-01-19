import { LogDataTable, type LogEntry } from "./data-table"

// Transform your JSON log data to match the schema
export const sampleLogs: LogEntry[] = [
  {
    id: "1",
    level: "INFO",
    timestamp: "2026-01-18T13:37:57Z",
    project: "Log Tracker",
    service: "",
    message: "Here's a summary of the post and its associated comments:\n\n**Post Summary**:\nThe original post highlights a observed trend of companies switching their backend services from Node.js to Go. The author seeks to understand the underlying reasons for this shift, speculating whether performance, concurrency, or other factors are primarily responsible.\n\n**Comment Thread Summary**:\nThe comments largely agree that multiple factors contribute to Go's growing preference over Node.js for backend services. Key recurring themes include:\n*   **Performance**: Go is noted for being faster due to its compiled nature, which converts code directly into machine code, leading to more efficient resource utilization compared to Node.js's reliance on the V8 JavaScript engine and a single-threaded event loop.\n*   **Concurrency**: Go's built-in concurrency primitives like goroutines and channels are highlighted as a significant advantage, making it easier to write efficient concurrent programs compared to Node.js's asynchronous callbacks and promises, which can become complex in large applications.\n*   **Type System**: Go's strong static typing is preferred for catching errors at compile-time, reducing runtime bugs, while Node.js's dynamic typing offers flexibility but can lead to unexpected issues.\n*   **Standard Library & Dependencies**: Go's robust standard library provides extensive functionality out-of-the-box, reducing the need for external packages. In contrast, Node.js often requires numerous npm packages, potentially increasing dependencies and security vulnerabilities.\n*   **Simplicity & Maintainability**: Go's enforced clean, minimalistic syntax and strong conventions are appreciated for improving code readability, team collaboration, and long-term maintenance, which can be inconsistent in Node.js projects due to greater coding style flexibility.\n\nOverall, while Node.js is acknowledged as suitable for specific use cases like lightweight, real-time applications, Go is favored for performance-critical and highly concurrent large-scale backend systems due to its speed, simplicity, and strong concurrency support.",
    runtime: {
      file: "C:/Users/Mikaelson/Desktop/reddit_clone/server/controllers/ai_controller.go",
      line: 71,
      fn: "github.com/EsanSamuel/Reddit_Clone/routes.UnProtectedRoutes.ThreadsSummary.func27",
    },
  },
  {
    id: "2",
    level: "ERROR",
    timestamp: "2026-01-18T13:39:56Z",
    project: "Log Tracker",
    service: "",
    message: "Tags not found!",
    runtime: {
      file: "C:/Users/Mikaelson/Desktop/reddit_clone/server/controllers/post_controller.go",
      line: 257,
      fn: "github.com/EsanSamuel/Reddit_Clone/routes.UnProtectedRoutes.GetTagPosts.func19",
    },
  },
  // Add more sample logs for testing
  {
    id: "3",
    level: "WARN",
    timestamp: "2026-01-18T13:40:12Z",
    project: "Log Tracker",
    service: "auth-service",
    message: "Rate limit approaching threshold for user authentication endpoint. Current rate: 85/100 requests per minute.",
    runtime: {
      file: "C:/Users/Mikaelson/Desktop/reddit_clone/server/middleware/rate_limiter.go",
      line: 45,
      fn: "github.com/EsanSamuel/Reddit_Clone/middleware.RateLimitMiddleware",
    },
  },
  {
    id: "4",
    level: "DEBUG",
    timestamp: "2026-01-18T13:40:45Z",
    project: "Log Tracker",
    service: "database",
    message: "Connection pool stats: Active: 12, Idle: 8, Max: 20, Wait count: 0, Wait duration: 0ms",
    runtime: {
      file: "C:/Users/Mikaelson/Desktop/reddit_clone/server/database/pool.go",
      line: 124,
      fn: "github.com/EsanSamuel/Reddit_Clone/database.LogPoolStats",
    },
  },
  {
    id: "5",
    level: "ERROR",
    timestamp: "2026-01-18T13:41:03Z",
    project: "Log Tracker",
    service: "api",
    message: "Failed to process webhook: invalid signature. Request ID: req_abc123xyz. Remote IP: 192.168.1.100",
    runtime: {
      file: "C:/Users/Mikaelson/Desktop/reddit_clone/server/handlers/webhook_handler.go",
      line: 89,
      fn: "github.com/EsanSamuel/Reddit_Clone/handlers.WebhookHandler.ProcessWebhook",
    },
  },
  {
    id: "6",
    level: "INFO",
    timestamp: "2026-01-18T13:41:30Z",
    project: "Log Tracker",
    service: "cache",
    message: "Cache hit rate for the last hour: 94.2%. Total requests: 15,234. Cache hits: 14,350. Cache misses: 884.",
    runtime: {
      file: "C:/Users/Mikaelson/Desktop/reddit_clone/server/cache/redis_cache.go",
      line: 203,
      fn: "github.com/EsanSamuel/Reddit_Clone/cache.LogCacheMetrics",
    },
  },
]

export default function LogsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Log Analysis</h1>
            <div className="hidden items-center gap-2 sm:flex">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-muted-foreground">Live</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </header>
      <main className="container flex-1 py-6">
        <LogDataTable data={sampleLogs} />
      </main>
    </div>
  )
}