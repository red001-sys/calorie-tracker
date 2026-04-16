import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logFoodByText } from "../lib/anthropic";
import { useXP } from "../hooks/useXP";
import { useStreak } from "../hooks/useStreak";
import { XP_RULES } from "../lib/gamification";
import { useNotifications } from "../hooks/useNotifications";

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

export default function Alimentar() {
  const navigate = useNavigate();
  const { gainXP } = useXP();
  const { logToday } = useStreak();
  const { addNotification } = useNotifications();

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setPreview(null);

    try {
      const result = await logFoodByText(input.trim());
      setPreview(result);
    } catch (err: any) {
      setError(err.message || "Erro ao analisar alimento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!preview) return;

    const entry: FoodEntry = {
      id: crypto.randomUUID(),
      emoji: preview.emoji || "🍽️",
      name: preview.name || input.trim(),
      calories: preview.calories || 0,
      protein: preview.protein || 0,
      carbs: preview.carbs || 0,
      fat: preview.fat || 0,
      sugar: preview.sugar || 0,
      sodium: preview.sodium || 0,
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      date: new Date().toISOString(),
    };

    // Save to localStorage
    try {
      const saved = localStorage.getItem("foodLogs");
      const logs: FoodEntry[] = saved ? JSON.parse(saved) : [];
      logs.push(entry);
      localStorage.setItem("foodLogs", JSON.stringify(logs));
    } catch {
      // ignore
    }

    // Streak
    logToday();

    // XP
    const result = gainXP(XP_RULES.MEAL_LOGGED);
    addNotification(`+${XP_RULES.MEAL_LOGGED} XP por registrar refeição!`, "success");

    if (result.levelUp) {
      addNotification(`🎉 Level Up! Nível ${result.newLevel}!`, "levelup");
    }

    // Reset
    setInput("");
    setPreview(null);
    addNotification(`${entry.emoji} ${entry.name} registrado com sucesso!`, "success");
  };

  return (
    <div className="px-4 pt-6 pb-8 space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white text-xl">
          ←
        </button>
        <h1 className="text-xl font-bold text-white">🍽️ Registrar Alimento</h1>
      </div>

      {/* Input */}
      <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
        <label className="text-sm font-medium text-gray-400 mb-2 block">
          Descreva o que você comeu
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ex: 200g de arroz com frango, salada de tomate..."
          rows={3}
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 resize-none"
        />
        <button
          onClick={handleAnalyze}
          disabled={loading || !input.trim()}
          className="w-full mt-3 py-3 bg-green-600 hover:bg-green-500 disabled:opacity-40 text-white font-bold rounded-xl transition-colors"
        >
          {loading ? "Analisando..." : "Analisar com IA"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-950/30 border border-red-800 rounded-xl p-4 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Preview */}
      {preview && (
        <div className="bg-gray-900 rounded-2xl p-4 border border-green-800 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{preview.emoji || "🍽️"}</span>
            <div>
              <h3 className="text-lg font-bold text-white">{preview.name}</h3>
              <span className="text-green-400 font-bold text-xl">{preview.calories} kcal</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-800 rounded-lg p-2 text-center">
              <div className="text-xs text-gray-400">Proteína</div>
              <div className="text-sm font-bold text-blue-400">{preview.protein}g</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-2 text-center">
              <div className="text-xs text-gray-400">Carbos</div>
              <div className="text-sm font-bold text-orange-400">{preview.carbs}g</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-2 text-center">
              <div className="text-xs text-gray-400">Gordura</div>
              <div className="text-sm font-bold text-yellow-400">{preview.fat}g</div>
            </div>
          </div>

          {(preview.sugar > 0 || preview.sodium > 0) && (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800 rounded-lg p-2 text-center">
                <div className="text-xs text-gray-400">Açúcar</div>
                <div className="text-sm font-bold text-pink-400">{preview.sugar}g</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-2 text-center">
                <div className="text-xs text-gray-400">Sódio</div>
                <div className="text-sm font-bold text-purple-400">{preview.sodium}mg</div>
              </div>
            </div>
          )}

          <button
            onClick={handleSave}
            className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-colors"
          >
            ✓ Salvar Refeição
          </button>
        </div>
      )}

      {/* Quick tips */}
      {!preview && !loading && (
        <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
          <h3 className="text-sm font-bold text-white mb-2">💡 Dicas</h3>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• Seja específico: "200g de arroz" em vez de "arroz"</li>
            <li>• Inclua todos os itens da refeição</li>
            <li>• Mencione o método de preparo se relevante</li>
          </ul>
        </div>
      )}
    </div>
  );
}
