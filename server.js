import "dotenv/config";
import express from "express";
import cors from "cors";
import apiRoutes from "./routes/api.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Parse allowed frontend URLs from environment variable
const rawFrontendUrls = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((url) => url.trim().replace(/\/+$/, ""))
  .filter(Boolean);

const defaultAllowedOrigins = [
  "https://frontend-delta-amber-unkm3rwye7.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5000",
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  ...rawFrontendUrls
];

function isOriginAllowed(origin) {
  // Allow requests with no origin (curl, mobile, server-to-server, Railway health checks)
  if (!origin) return true;

  // Allow all origins in non-production or if wildcard configured
  if (process.env.FRONTEND_URL === "*" || process.env.NODE_ENV !== "production") {
    return true;
  }

  const cleanOrigin = origin.replace(/\/+$/, "");

  // Match explicitly allowed origins
  if (defaultAllowedOrigins.includes(cleanOrigin)) return true;

  // Allow any Vercel deployment preview or production domain (*.vercel.app)
  if (/^https:\/\/[a-zA-Z0-9_\-.]+\.vercel\.app$/i.test(cleanOrigin)) {
    return true;
  }

  // Allow localhost on any port
  if (/^http:\/\/(localhost|127\.0\.0\.1):\d+$/i.test(cleanOrigin)) {
    return true;
  }

  return false;
}

// Configure CORS
app.use(
  cors({
    origin(origin, callback) {
      if (isOriginAllowed(origin)) {
        return callback(null, true);
      }
      // Deny cleanly without throwing an unhandled server exception
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Pre-flight handling
app.options("*", cors());

// Parse JSON request bodies
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    console.log(
      `[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${Date.now() - start}ms)`
    );
  });
  next();
});

// Root Discovery endpoint
app.get("/", (req, res) => {
  res.json({
    name: "FB Full-Stack API Gateway",
    status: "online",
    deployment: "Railway / Node.js",
    endpoints: {
      health: "/api/health",
      stats: "/api/stats",
      posts: "/api/posts",
      users: "/api/users",
      docs: "/api-docs"
    }
  });
});

// API Documentation / Directory
app.get("/api-docs", (req, res) => {
  res.json({
    name: "FB Full-Stack API Service",
    status: "online",
    endpoints: {
      health: "GET /api/health",
      stats: "GET /api/stats",
      users: "GET /api/users",
      posts: "GET /api/posts",
      createPost: "POST /api/posts",
      likePost: "POST /api/posts/:id/like",
      comment: "POST /api/posts/:id/comments",
      deletePost: "DELETE /api/posts/:id"
    }
  });
});

// Mount modular API routes (/api/health, /api/posts, /api/stats, /api/users)
app.use("/api", apiRoutes);

// Catch-all 404 handler for unhandled routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message || "Internal server error"
  });
});

// Start server on 0.0.0.0 (required for Railway and cloud containers)
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log("==================================");
  console.log("🚀 FB Full-Stack API is running");
  console.log(`Port:      ${PORT}`);
  console.log(`Health:    http://localhost:${PORT}/api/health`);
  console.log(`API docs:  http://localhost:${PORT}/api-docs`);
  console.log("==================================");
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, closing server...");
  server.close(() => console.log("Server closed"));
});
process.on("SIGINT", () => {
  console.log("SIGINT received, closing server...");
  server.close(() => console.log("Server closed"));
});
