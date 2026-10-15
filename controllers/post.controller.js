import { store } from "../data/store.js";

// GET /api/posts
export const getPosts = (req, res) => {
  try {
    const { tag, search, sort } = req.query;
    let results = [...store.posts];

    if (tag && tag.toLowerCase() !== "all") {
      results = results.filter(
        (post) => post.tag.toLowerCase() === tag.toLowerCase()
      );
    }

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (post) =>
          post.title.toLowerCase().includes(q) ||
          post.content.toLowerCase().includes(q) ||
          post.author.name.toLowerCase().includes(q)
      );
    }

    if (sort === "popular") {
      results.sort((a, b) => b.likes - a.likes);
    } else {
      // Default: newest first
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return res.json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/posts/:id
export const getPostById = (req, res) => {
  try {
    const post = store.posts.find((p) => p.id === req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }
    return res.json({ success: true, data: post });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/posts
export const createPost = (req, res) => {
  try {
    const { title, content, tag, authorName, authorHandle } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required fields"
      });
    }

    const newPost = {
      id: `p-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      tag: tag?.trim() || "General",
      author: {
        name: authorName?.trim() || "Dev Explorer",
        handle: authorHandle?.trim() || "@devexplorer",
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`
      },
      likes: 0,
      likedByMe: false,
      createdAt: new Date().toISOString(),
      comments: []
    };

    store.posts.unshift(newPost);

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: newPost
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/posts/:id/like
export const toggleLike = (req, res) => {
  try {
    const post = store.posts.find((p) => p.id === req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    post.likedByMe = !post.likedByMe;
    post.likes += post.likedByMe ? 1 : -1;
    if (post.likes < 0) post.likes = 0;

    return res.json({
      success: true,
      data: {
        id: post.id,
        likes: post.likes,
        likedByMe: post.likedByMe
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/posts/:id/comments
export const addComment = (req, res) => {
  try {
    const { text, authorName } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment text cannot be empty"
      });
    }

    const post = store.posts.find((p) => p.id === req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const comment = {
      id: `c-${Date.now()}`,
      author: authorName?.trim() || "You",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      text: text.trim(),
      createdAt: new Date().toISOString()
    };

    post.comments.push(comment);

    return res.status(201).json({
      success: true,
      message: "Comment added",
      data: comment
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/posts/:id
export const deletePost = (req, res) => {
  try {
    const index = store.posts.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const deleted = store.posts.splice(index, 1)[0];
    return res.json({
      success: true,
      message: "Post deleted",
      data: deleted
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/stats
export const getStats = (req, res) => {
  try {
    const totalPosts = store.posts.length;
    const totalLikes = store.posts.reduce((acc, p) => acc + (p.likes || 0), 0);
    const totalComments = store.posts.reduce((acc, p) => acc + (p.comments?.length || 0), 0);
    const uniqueTags = Array.from(new Set(store.posts.map((p) => p.tag)));

    return res.json({
      success: true,
      data: {
        totalPosts,
        totalLikes,
        totalComments,
        tags: uniqueTags,
        activeUsers: store.users.length,
        serverTime: new Date().toISOString(),
        status: "Operational"
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/users
export const getUsers = (req, res) => {
  return res.json({
    success: true,
    data: store.users
  });
};
