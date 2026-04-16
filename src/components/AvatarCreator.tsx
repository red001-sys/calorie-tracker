import { useState } from "react";

const AVATAR_OPTIONS = [
  { id: "cat", emoji: "🐱", label: "Gato" },
  { id: "dog", emoji: "🐶", label: "Cachorro" },
  { id: "rabbit", emoji: "🐰", label: "Coelho" },
  { id: "fox", emoji: "🦊", label: "Raposa" },
  { id: "bear", emoji: "🐻", label: "Urso" },
  { id: "panda", emoji: "🐼", label: "Panda" },
  { id: "lion", emoji: "🦁", label: "Leão" },
  { id: "penguin", emoji: "🐧", label: "Pinguim" },
  { id: "owl", emoji: "🦉", label: "Coruja" },
  { id: "frog", emoji: "🐸", label: "Sapo" },
  { id: "unicorn", emoji: "🦄", label: "Unicórnio" },
  { id: "dragon", emoji: "🐲", label: "Dragão" },
];

interface AvatarCreatorProps {
  onSelect: (avatar: string) => void;
  currentAvatar?: string;
}

export default function AvatarCreator({ onSelect, currentAvatar }: AvatarCreatorProps) {
  const [selected, setSelected] = useState(currentAvatar || AVATAR_OPTIONS[0].id);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white">Escolha seu avatar</h3>
      <div className="text-6xl text-center py-4 bg-gray-900 rounded-2xl border border-gray-800">
        {AVATAR_OPTIONS.find((a) => a.id === selected)?.emoji}
      </div>
      <div className="grid grid-cols-4 gap-3">
        {AVATAR_OPTIONS.map((avatar) => (
          <button
            key={avatar.id}
            onClick={() => setSelected(avatar.id)}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
              selected === avatar.id
                ? "border-green-500 bg-green-950/30 scale-105"
                : "border-gray-800 bg-gray-900 hover:border-gray-700"
            }`}
          >
            <span className="text-2xl">{avatar.emoji}</span>
            <span className="text-xs text-gray-400">{avatar.label}</span>
          </button>
        ))}
      </div>
      <button
        onClick={() => onSelect(selected)}
        className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-colors"
      >
        Confirmar Avatar
      </button>
    </div>
  );
}
