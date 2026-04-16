import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AvatarCreator from "../components/AvatarCreator";
import { useXP } from "../hooks/useXP";
import { useStreak } from "../hooks/useStreak";
import { getLevelFromXP, ACHIEVEMENTS } from "../lib/gamification";

export default function Perfil() {
  const navigate = useNavigate();
  const { xp, level } = useXP();
  const { streak } = useStreak();

  const userName = localStorage.getItem("userName") || "Usuário";
  const goal = parseInt(localStorage.getItem("userGoal") || "2000");
  const weight = parseInt(localStorage.getItem("userWeight") || "70");
  const [avatar, setAvatar] = useState(localStorage.getItem("userAvatar") || "cat");
  const [showAvatarCreator, setShowAvatarCreator] = useState(false);

  const lvl = getLevelFromXP(xp);
  const xpProgress = lvl.maxXP === Infinity
    ? 1
    : (xp - lvl.minXP) / (lvl.maxXP - lvl.minXP);

  const totalMeals = (() => {
    try {
      const saved = localStorage.getItem("foodLogs");
      return saved ? JSON.parse(saved).length : 0;
    } catch {
      return 0;
    }
  })();

  const totalMissions = (() => {
    try {
      const saved = localStorage.getItem("claimedMissions");
      return saved ? JSON.parse(saved).length : 0;
    } catch {
      return 0;
    }
  })();

  const achievementState = { totalMeals, streak, level, totalMissions };

  const AVATAR_EMOJIS: Record<string, string> = {
    cat: "🐱", dog: "🐶", rabbit: "🐰", fox: "🦊", bear: "🐻",
    panda: "🐼", lion: "🦁", penguin: "🐧", owl: "🦉", frog: "🐸",
    unicorn: "🦄", dragon: "🐲",
  };

  if (showAvatarCreator) {
    return (
      <div className="px-4 pt-6 pb-8">
        <button
          onClick={() => setShowAvatarCreator(false)}
          className="text-gray-400 hover:text-white text-xl mb-6 block"
        >
          ← Voltar
        </button>
        <AvatarCreator
          onSelect={(a) => {
            setAvatar(a);
            localStorage.setItem("userAvatar", a);
            setShowAvatarCreator(false);
          }}
          currentAvatar={avatar}
        />
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-8 space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white text-xl">
          ←
        </button>
        <h1 className="text-xl font-bold text-white">👤 Perfil</h1>
      </div>

      {/* Avatar Card */}
      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 text-center">
        <button
          onClick={() => setShowAvatarCreator(true)}
          className="text-6xl mb-3 hover:scale-110 transition-transform inline-block"
        >
          {AVATAR_EMOJIS[avatar] || "🐱"}
        </button>
        <h2 className="text-xl font-bold text-white">{userName}</h2>
        <p className="text-sm text-gray-400">Toque no avatar para trocar</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
          <div className="text-2xl font-bold text-yellow-400">⭐ {level}</div>
          <div className="text-xs text-gray-400">Nível</div>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
          <div className="text-2xl font-bold text-orange-400">🔥 {streak}</div>
          <div className="text-xs text-gray-400">Dias seguidos</div>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
          <div className="text-2xl font-bold text-green-400">{xp}</div>
          <div className="text-xs text-gray-400">XP Total</div>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
          <div className="text-2xl font-bold text-blue-400">{totalMeals}</div>
          <div className="text-xs text-gray-400">Refeições</div>
        </div>
      </div>

      {/* XP Progress */}
      <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">Nível {lvl.level}</span>
          <span className="text-gray-400">
            {xp - lvl.minXP} / {lvl.maxXP - lvl.minXP} XP
          </span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-3">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400 transition-all duration-700"
            style={{ width: `${Math.min(xpProgress, 1) * 100}%` }}
          />
        </div>
      </div>

      {/* User Data */}
      <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800 space-y-3">
        <h3 className="text-sm font-bold text-white">📊 Seus Dados</h3>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Meta calórica</span>
          <span className="text-white font-medium">{goal} kcal</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Peso alvo</span>
          <span className="text-white font-medium">{weight} kg</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Missões completas</span>
          <span className="text-white font-medium">{totalMissions}</span>
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h3 className="text-lg font-bold text-white mb-3">🏆 Conquistas</h3>
        <div className="space-y-2">
          {ACHIEVEMENTS.map((a) => {
            const unlocked = a.condition(achievementState);
            return (
              <div
                key={a.id}
                className={`flex items-center gap-3 rounded-xl p-3 border transition-all ${
                  unlocked
                    ? "bg-yellow-950/20 border-yellow-800"
                    : "bg-gray-900 border-gray-800 opacity-50"
                }`}
              >
                <span className="text-2xl">{a.emoji}</span>
                <div>
                  <div className="text-sm font-medium text-white">{a.text}</div>
                  <div className="text-xs text-gray-500">
                    {unlocked ? "Desbloqueada!" : "Bloqueada"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
