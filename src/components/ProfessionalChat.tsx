import { useState } from "react";
import { callAnthropic } from "../lib/anthropic";
import { getProfessionalSystem } from "../lib/professionals";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ProfessionalChatProps {
  professionalId: string;
  userData: { name: string; goal: number; weight: number; level: number; streak: number };
  onClose: () => void;
}

export default function ProfessionalChat({ professionalId, userData, onClose }: ProfessionalChatProps) {
  const profile = getProfessionalSystem(professionalId, userData);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Olá! Eu sou ${profile.name} ${profile.emoji}. Como posso te ajudar hoje?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const chatHistory = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const reply = await callAnthropic(profile.system, chatHistory);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Desculpe, ocorreu um erro. Tente novamente." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-800">
        <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">
          ←
        </button>
        <div className="text-2xl">{profile.emoji}</div>
        <div>
          <div className="font-bold text-white">{profile.name}</div>
          <div className="text-xs text-green-400">Online</div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs rounded-2xl px-4 py-2 text-sm ${
                msg.role === "user"
                  ? "bg-green-600 text-white rounded-br-sm"
                  : "bg-gray-800 text-gray-100 rounded-bl-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 rounded-2xl px-4 py-2 text-sm text-gray-400">
              Digitando...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-800 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Digite sua pergunta..."
          className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white px-4 py-2 rounded-xl font-medium transition-colors"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
