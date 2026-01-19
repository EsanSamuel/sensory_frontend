import { LogEntry } from "@/components/data-table";

export const currentPeriodLogs: LogEntry[] = [
  {
    id: "1",
    level: "INFO",
    timestamp: "2026-01-18T13:37:57Z",
    project: "Log Tracker",
    service: "api",
    message:
      "Here's a summary of the post and its associated comments:\n\n**Post Summary**:\nThe original post highlights a observed trend of companies switching their backend services from Node.js to Go. The author seeks to understand the underlying reasons for this shift, speculating whether performance, concurrency, or other factors are primarily responsible.\n\n**Comment Thread Summary**:\nThe comments largely agree that multiple factors contribute to Go's growing preference over Node.js for backend services.",
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
    service: "database",
    message: "Tags not found!",
    runtime: {
      file: "C:/Users/Mikaelson/Desktop/reddit_clone/server/controllers/post_controller.go",
      line: 257,
      fn: "github.com/EsanSamuel/Reddit_Clone/routes.UnProtectedRoutes.GetTagPosts.func19",
    },
  },
  {
    id: "3",
    level: "WARN",
    timestamp: "2026-01-18T13:40:12Z",
    project: "Log Tracker",
    service: "auth-service",
    message:
      "Rate limit approaching threshold for user authentication endpoint. Current rate: 85/100 requests per minute.",
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
    message:
      "Connection pool stats: Active: 12, Idle: 8, Max: 20, Wait count: 0, Wait duration: 0ms",
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
    message:
      "Failed to process webhook: invalid signature. Request ID: req_abc123xyz. Remote IP: 192.168.1.100",
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
    message:
      "Cache hit rate for the last hour: 94.2%. Total requests: 15,234. Cache hits: 14,350. Cache misses: 884.",
    runtime: {
      file: "C:/Users/Mikaelson/Desktop/reddit_clone/server/cache/redis_cache.go",
      line: 203,
      fn: "github.com/EsanSamuel/Reddit_Clone/cache.LogCacheMetrics",
    },
  },
  {
    id: "7",
    level: "WARN",
    timestamp: "2026-01-18T14:15:22Z",
    project: "Log Tracker",
    service: "database",
    message:
      "Slow query detected: SELECT * FROM posts took 2.5s. Consider adding index on created_at column.",
    runtime: {
      file: "C:/Users/Mikaelson/Desktop/reddit_clone/server/database/query_logger.go",
      line: 67,
      fn: "github.com/EsanSamuel/Reddit_Clone/database.LogSlowQuery",
    },
  },
  {
    id: "8",
    level: "ERROR",
    timestamp: "2026-01-18T14:22:15Z",
    project: "Log Tracker",
    service: "api",
    message:
      "Authentication failed: invalid token for user ID 12345. Token expired at 2026-01-18T14:00:00Z",
    runtime: {
      file: "C:/Users/Mikaelson/Desktop/reddit_clone/server/middleware/auth.go",
      line: 112,
      fn: "github.com/EsanSamuel/Reddit_Clone/middleware.AuthMiddleware.ValidateToken",
    },
  },
  {
    id: "9",
    level: "INFO",
    timestamp: "2026-01-18T14:30:45Z",
    project: "Log Tracker",
    service: "scheduler",
    message:
      "Scheduled job 'daily-cleanup' completed successfully. Processed 1,234 records in 45.2s",
    runtime: {
      file: "C:/Users/Mikaelson/Desktop/reddit_clone/server/jobs/cleanup.go",
      line: 156,
      fn: "github.com/EsanSamuel/Reddit_Clone/jobs.DailyCleanup.Execute",
    },
  },
  {
    id: "10",
    level: "DEBUG",
    timestamp: "2026-01-18T14:35:12Z",
    project: "Log Tracker",
    service: "api",
    message:
      "Request processed: GET /api/posts?page=1&limit=20 - Duration: 45ms - Status: 200",
    runtime: {
      file: "C:/Users/Mikaelson/Desktop/reddit_clone/server/middleware/logger.go",
      line: 34,
      fn: "github.com/EsanSamuel/Reddit_Clone/middleware.RequestLogger",
    },
  },
];

// Previous period logs for comparison (with fewer errors to show improvement)
export const previousPeriodLogs: LogEntry[] = [
  {
    id: "p1",
    level: "INFO",
    timestamp: "2026-01-17T13:37:57Z",
    project: "Log Tracker",
    service: "api",
    message: "Application started successfully",
    runtime: {
      file: "C:/Users/Mikaelson/Desktop/reddit_clone/server/main.go",
      line: 25,
      fn: "main.Start",
    },
  },
  {
    id: "p2",
    level: "ERROR",
    timestamp: "2026-01-17T14:22:15Z",
    project: "Log Tracker",
    service: "database",
    message: "Connection timeout",
    runtime: {
      file: "C:/Users/Mikaelson/Desktop/reddit_clone/server/database/connection.go",
      line: 89,
      fn: "github.com/EsanSamuel/Reddit_Clone/database.Connect",
    },
  },
  {
    id: "p3",
    level: "ERROR",
    timestamp: "2026-01-17T15:10:30Z",
    project: "Log Tracker",
    service: "api",
    message: "Request timeout",
    runtime: {
      file: "C:/Users/Mikaelson/Desktop/reddit_clone/server/handlers/request.go",
      line: 45,
      fn: "github.com/EsanSamuel/Reddit_Clone/handlers.ProcessRequest",
    },
  },
  {
    id: "p4",
    level: "ERROR",
    timestamp: "2026-01-17T16:05:22Z",
    project: "Log Tracker",
    service: "cache",
    message: "Redis connection failed",
    runtime: {
      file: "C:/Users/Mikaelson/Desktop/reddit_clone/server/cache/redis.go",
      line: 78,
      fn: "github.com/EsanSamuel/Reddit_Clone/cache.Connect",
    },
  },
  {
    id: "p5",
    level: "WARN",
    timestamp: "2026-01-17T17:20:11Z",
    project: "Log Tracker",
    service: "api",
    message: "High memory usage detected",
    runtime: {
      file: "C:/Users/Mikaelson/Desktop/reddit_clone/server/monitoring/health.go",
      line: 92,
      fn: "github.com/EsanSamuel/Reddit_Clone/monitoring.CheckHealth",
    },
  },
  {
    id: "p6",
    level: "INFO",
    timestamp: "2026-01-17T18:15:33Z",
    project: "Log Tracker",
    service: "scheduler",
    message: "Backup completed",
    runtime: {
      file: "C:/Users/Mikaelson/Desktop/reddit_clone/server/jobs/backup.go",
      line: 134,
      fn: "github.com/EsanSamuel/Reddit_Clone/jobs.Backup.Run",
    },
  },
  {
    id: "p7",
    level: "DEBUG",
    timestamp: "2026-01-17T19:22:45Z",
    project: "Log Tracker",
    service: "api",
    message: "Request processed",
    runtime: {
      file: "C:/Users/Mikaelson/Desktop/reddit_clone/server/middleware/logger.go",
      line: 34,
      fn: "github.com/EsanSamuel/Reddit_Clone/middleware.RequestLogger",
    },
  },
];