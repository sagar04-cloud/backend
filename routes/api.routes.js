import express from "express";
import {
  getPosts,
  getPostById,
  createPost,
  toggleLike,
  addComment,
  deletePost,
  getStats,
  getUsers
} from "../controllers/post.controller.js";

const router = express.Router();

// Health check
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Analytics & users
router.get("/stats", getStats);
router.get("/users", getUsers);

// Post CRUD & interactions
router.get("/posts", getPosts);
router.get("/posts/:id", getPostById);
router.post("/posts", createPost);
router.post("/posts/:id/like", toggleLike);
router.post("/posts/:id/comments", addComment);
router.delete("/posts/:id", deletePost);

export default router;
