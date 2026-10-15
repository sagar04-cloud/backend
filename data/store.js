// In-memory data store with realistic seed data
export const store = {
  users: [
    {
      id: "u1",
      name: "Alex Rivera",
      handle: "@alexrivera",
      role: "Lead Architect",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "u2",
      name: "Sophia Chen",
      handle: "@sophiacodes",
      role: "Full-Stack Dev",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "u3",
      name: "Marcus Vance",
      handle: "@marcus_v",
      role: "Product Designer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    }
  ],
  posts: [
    {
      id: "p-101",
      title: "Building High-Throughput REST APIs with Node.js & Express",
      content: "Just deployed our new microservices pipeline with graceful degradation and sub-10ms response times. Key takeaway: optimize payload serialization and configure connection pooling early!",
      author: {
        name: "Alex Rivera",
        handle: "@alexrivera",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
      },
      tag: "Engineering",
      likes: 24,
      likedByMe: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      comments: [
        {
          id: "c-1",
          author: "Sophia Chen",
          avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
          text: "What connection pooling library did you settle on for Postgres?",
          createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString()
        }
      ]
    },
    {
      id: "p-102",
      title: "Design Tokens & Glassmorphism in Modern Web UIs",
      content: "Sleek dark modes with 1px border glows and backdrop filters transform good software into delightful experiences. Contrast ratios should never be sacrificed for aesthetic flair though.",
      author: {
        name: "Marcus Vance",
        handle: "@marcus_v",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
      },
      tag: "Design",
      likes: 42,
      likedByMe: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      comments: [
        {
          id: "c-2",
          author: "Alex Rivera",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          text: "100% agreed. Subtlety is the difference between pro-grade and gimmicky.",
          createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString()
        }
      ]
    },
    {
      id: "p-103",
      title: "Frontend State Management: Simplicity First",
      content: "Before reaching for complex third-party global state stores, see how far vanilla reactive event dispatching and clean component contracts take you. Minimal dependencies keep bundles lean and maintenance low.",
      author: {
        name: "Sophia Chen",
        handle: "@sophiacodes",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80"
      },
      tag: "Frontend",
      likes: 31,
      likedByMe: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
      comments: []
    }
  ]
};
