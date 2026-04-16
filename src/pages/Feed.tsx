import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useXP } from "../hooks/useXP";
import { XP_RULES } from "../lib/gamification";
import { useNotifications } from "../hooks/useNotifications";

interface FeedPost {
  id: string;
  user: string;
  avatar: string;
  content: string;
  votes: { up: number; down: number };
  userVote?: "up" | "down";
  time: string;
}

const SAMPLE_POSTS: FeedPost[] = [
  {
    id: "1",
    user: "Maria",
    avatar: "🐰",
    content: "Dica: Beber 500ml de água antes das refeições ajuda a controlar a saciedade! 💧",
    votes: { up: 24, down: 2 },
    time: "2h",
  },
  {
    id: "2",
    user: "João",
    avatar: "🦊",
    content: "Consegui bater minha meta calórica 5 dias seguidos! 🔥",
    votes: { up: 18, down: 0 },
    time: "4h",
  },
  {
    id: "3",
    user: "Ana",
    avatar: "🐱",
    content: "Receita rápida: frango desfiado com batata doce no micro-ondas. 350kcal, super proteico! 🍗",
    votes: { up: 31, down: 1 },
    time: "6h",
  },
  {
    id: "4",
    user: "Carlos",
    avatar: "🐻",
    content: "Alguém tem dica de lanche low-carb para a tarde? Preciso de algo prático.",
    votes: { up: 7, down: 0 },
    time: "8h",
  },
  {
    id: "5",
    user: "Lucia",
    avatar: "🦉",
    content: "Meal prep domingo: dividi frango, arroz e brócolis em 5 marmitas. Semana resolvida! ✅",
    votes: { up: 42, down: 1 },
    time: "12h",
  },
];

export default function Feed() {
  const navigate = useNavigate();
  const { gainXP } = useXP();
  const { addNotification } = useNotifications();
  const [posts, setPosts] = useState<FeedPost[]>(SAMPLE_POSTS);
  const [newPost, setNewPost] = useState("");

  const vote = (postId: string, direction: "up" | "down") => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        if (p.userVote === direction) {
          // Undo vote
          return {
            ...p,
            userVote: undefined,
            votes: { ...p.votes, [direction]: p.votes[direction] - 1 },
          };
        }
        // Switch or new vote
        const oldVote = p.userVote;
        const newVotes = { ...p.votes };
        if (oldVote) newVotes[oldVote]--;
        newVotes[direction]++;
        return { ...p, userVote: direction, votes: newVotes };
      })
    );

    // XP for correct vote (upvote on popular posts)
    if (direction === "up") {
      gainXP(XP_RULES.FEED_VOTE_CORRECT);
    }
  };

  const addPost = () => {
    if (!newPost.trim()) return;
    const post: FeedPost = {
      id: crypto.randomUUID(),
      user: localStorage.getItem("userName") || "Você",
      avatar: localStorage.getItem("userAvatar") || "🐱",
      content: newPost.trim(),
      votes: { up: 1, down: 0 },
      time: "agora",
    };
    setPosts((prev) => [post, ...prev]);
    setNewPost("");
    addNotification("Post publicado no Feed! 📱", "success");
  };

  return (
    <div className="px-4 pt-6 pb-8 space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white text-xl">
          ←
        </button>
        <h1 className="text-xl font-bold text-white">📱 Feed da Comunidade</h1>
      </div>

      {/* New Post */}
      <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Compartilhe uma dica, receita ou conquista..."
          rows={2}
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 resize-none text-sm"
        />
        <button
          onClick={addPost}
          disabled={!newPost.trim()}
          className="mt-2 px-6 py-2 bg-green-600 hover:bg-green-500 disabled:opacity-40 text-white text-sm font-medium rounded-xl transition-colors"
        >
          Publicar
        </button>
      </div>

      {/* Posts */}
      {posts.map((post) => (
        <div key={post.id} className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{post.avatar}</span>
            <span className="text-sm font-medium text-white">{post.user}</span>
            <span className="text-xs text-gray-500">· {post.time}</span>
          </div>
          <p className="text-sm text-gray-200 mb-3">{post.content}</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => vote(post.id, "up")}
              className={`flex items-center gap-1 text-sm px-3 py-1 rounded-lg transition-colors ${
                post.userVote === "up"
                  ? "bg-green-900/50 text-green-400"
                  : "text-gray-400 hover:bg-gray-800"
              }`}
            >
              ▲ {post.votes.up}
            </button>
            <button
              onClick={() => vote(post.id, "down")}
              className={`flex items-center gap-1 text-sm px-3 py-1 rounded-lg transition-colors ${
                post.userVote === "down"
                  ? "bg-red-900/50 text-red-400"
                  : "text-gray-400 hover:bg-gray-800"
              }`}
            >
              ▼ {post.votes.down}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
