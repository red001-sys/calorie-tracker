import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CircularProgress from "../components/CircularProgress";
import MacroCard from "../components/MacroCard";
import MissionCard from "../components/MissionCard";
import FoodLogItem from "../components/FoodLogItem";
import { useXP } from "../hooks/useXP";
import { useStreak } from "../hooks/useStreak";
import { useNotifications } from "../hooks/useNotifications";
import { MISSIONS } from "../lib/gamification";

interface FoodEntry {
  id: string;
  emoji: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
  sodium: number;
  time: string;
  date: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { xp, level, levelUp, gainXP, xpProgress } = useXP();
  const { streak } = useStreak();
  const { notifications, addNotification } = useNotifications();

  const userName = localStorage.getItem("userName") || "Usuário";
  const avatar = localStorage.getItem("userAvatar") || "cat";
  const goal = parseInt(localStorage.getItem("userGoal") || "2000");

  const [foodLogs, setFoodLogs] = useState<FoodEntry[]>(() => {
    try {
      const saved = localStorage.getItem("foodLogs");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const totalCalories = foodLogs.reduce((sum, f) => sum + f.calories, 0);
  const totalProtein = foodLogs.reduce((sum, f) => sum + f.protein, 0);
  const totalCarbs = foodLogs.reduce((sum, f) => sum + f.carbs, 0);
  const totalFat = foodLogs.reduce((sum, f) => sum + f.fat, 0);

  // Mission progress
  const [missionProgress, setMissionProgress] = useState<Record<number, number>>({});
  const [claimedMissions, setClaimedMissions] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem("claimedMissions");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    // Update mission progress
    const today = new Date().toDateString();
    const todayLogs = foodLogs.filter((f) => new Date(f.date).toDateString() === today);
    const uniqueNames = new Set(todayLogs.map((f) => f.name));

    setMissionProgress({
      1: todayLogs.length, // 3 meals
      2: totalCalories >= goal ? 1 : 0, // goal reached
      3: todayLogs.some((f) => f.name.toLowerCase().includes("café") || f.name.toLowerCase().includes("breakfast")) ? 1 : 0,
      4: uniqueNames.size, // 5 different items
    });
  }, [foodLogs, totalCalories, goal]);

  const claimMission = (missionId: number) => {
    const mission = MISSIONS.find((m) => m.id === missionId);
    if (!mission || claimedMissions.includes(missionId)) return;

    setClaimedMissions((prev) => {
      const updated = [...prev, missionId];
      localStorage.setItem("claimedMissions", JSON.stringify(updated));
      return updated;
    });

    const result = gainXP(mission.xp);
    addNotification(`Missão completada: ${mission.text} (+${mission.xp} XP)`, "success");

    if (result.levelUp) {
      addNotification(`🎉 Level Up! Você alcançou o nível ${result.newLevel}!`, "levelup");
    }
  };

  const deleteFood = (id: string) => {
    setFoodLogs((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      localStorage.setItem("foodLogs", JSON.stringify(updated));
      return updated;
    });
  };

  const AVATAR_EMOJIS: Record<string, string> = {
    cat: "🐱", dog: "🐶", rabbit: "🐰", fox: "🦊", bear: "🐻",
    panda: "🐼", lion: "🦁", penguin: "🐧", owl: "🦉", frog: "🐸",
    unicorn: "🦄", dragon: "🐲",
  };

  return (
    <div className="px-4 pt-6 pb-8 space-y-6">
      {/* Level Up Toast */}
      {levelUp && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-yellow-500 text-black font-bold px-6 py-3 rounded-2xl shadow-lg shadow-yellow-500/30 animate-bounce">
          🎉 Level Up! Nível {level}!
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-3xl w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center border border-gray-800">
            {AVATAR_EMOJIS[avatar] || "🐱"}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Olá, {userName}!</h1>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>🔥 {streak} dias</span>
              <span>·</span>
              <span>⭐ Nível {level}</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate("/ajustes")}
          className="text-gray-400 hover:text-white text-xl p-2"
        >
          ⚙️
        </button>
      </div>

      {/* XP Bar */}
      <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-400">
            XP: {xp} / {xpProgress.needed}
          </span>
          <span className="text-sm font-bold text-yellow-400">Nível {level}</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-3">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400 transition-all duration-700"
            style={{ width: `${xpProgress.progress * 100}%` }}
          />
        </div>
      </div>

      {/* Calorie Circle */}
      <div className="flex justify-center">
        <CircularProgress
          value={totalCalories}
          max={goal}
          size={180}
          color={totalCalories > goal ? "#EF4444" : "#22C55E"}
        >
          <div className="text-3xl font-extrabold text-white">{totalCalories}</div>
          <div className="text-xs text-gray-400">/ {goal} kcal</div>
          <div className="text-xs text-gray-500 mt-1">
            {goal - totalCalories >= 0
              ? `${goal - totalCalories} restantes`
              : `${totalCalories - goal} acima da meta`}
          </div>
        </CircularProgress>
      </div>

      {/* Macros */}
      <div className="flex gap-3">
        <MacroCard label="Proteína" value={Math.round(totalProtein)} goal={150} color="#3B82F6" emoji="🥩" />
        <MacroCard label="Carbos" value={Math.round(totalCarbs)} goal={250} color="#F97316" emoji="🍞" />
        <MacroCard label="Gordura" value={Math.round(totalFat)} goal={65} color="#EAB308" emoji="🧈" />
      </div>

      {/* Missions */}
      <div>
        <h2 className="text-lg font-bold text-white mb-3">🎯 Missões Diárias</h2>
        <div className="space-y-2">
          {MISSIONS.map((m) => {
            const progress = missionProgress[m.id] || 0;
            const completed = progress >= m.goal && !claimedMissions.includes(m.id);
            return (
              <MissionCard
                key={m.id}
                text={m.text}
                progress={progress}
                goal={m.goal}
                xp={m.xp}
                completed={completed}
                onClaim={completed ? () => claimMission(m.id) : undefined}
              />
            );
          })}
        </div>
      </div>

      {/* Today's Food Logs */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-white">📋 Refeições de Hoje</h2>
          <button
            onClick={() => navigate("/alimentar")}
            className="text-sm text-green-400 hover:text-green-300 font-medium"
          >
            + Adicionar
          </button>
        </div>
        {foodLogs.length === 0 ? (
          <div className="bg-gray-900 rounded-2xl p-8 text-center border border-gray-800">
            <div className="text-4xl mb-3">🍽️</div>
            <p className="text-gray-400 text-sm">Nenhuma refeição registrada hoje.</p>
            <button
              onClick={() => navigate("/alimentar")}
              className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-medium rounded-xl transition-colors"
            >
              Registrar refeição
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {foodLogs
              .filter((f) => new Date(f.date).toDateString() === new Date().toDateString())
              .reverse()
              .map((food) => (
                <FoodLogItem
                  key={food.id}
                  emoji={food.emoji}
                  name={food.name}
                  calories={food.calories}
                  protein={Math.round(food.protein)}
                  carbs={Math.round(food.carbs)}
                  fat={Math.round(food.fat)}
                  time={food.time}
                  onDelete={() => deleteFood(food.id)}
                />
              ))}
          </div>
        )}
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-white mb-3">🔔 Notificações</h2>
          <div className="space-y-2">
            {notifications.slice(0, 5).map((n) => (
              <div
                key={n.id}
                className={`rounded-xl p-3 text-sm border ${
                  n.type === "levelup"
                    ? "bg-yellow-950/30 border-yellow-800 text-yellow-300"
                    : n.type === "success"
                    ? "bg-green-950/30 border-green-800 text-green-300"
                    : "bg-gray-900 border-gray-800 text-gray-300"
                }`}
              >
                {n.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
