import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Ajustes() {
  const navigate = useNavigate();

  const [goal, setGoal] = useState(localStorage.getItem("userGoal") || "2000");
  const [weight, setWeight] = useState(localStorage.getItem("userWeight") || "70");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem("userGoal", goal);
    localStorage.setItem("userWeight", weight);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (confirm("Tem certeza? Isso apagará todos os seus dados.")) {
      localStorage.clear();
      navigate("/");
      window.location.reload();
    }
  };

  return (
    <div className="px-4 pt-6 pb-8 space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white text-xl">
          ←
        </button>
        <h1 className="text-xl font-bold text-white">⚙️ Ajustes</h1>
      </div>

      {/* Goal */}
      <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800 space-y-4">
        <h3 className="text-sm font-bold text-white">🎯 Meta Calórica</h3>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Calorias diárias (kcal)</label>
          <input
            type="number"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Peso alvo (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500"
          />
        </div>
        <button
          onClick={handleSave}
          className={`w-full py-3 font-bold rounded-xl transition-colors ${
            saved
              ? "bg-green-500 text-white"
              : "bg-green-600 hover:bg-green-500 text-white"
          }`}
        >
          {saved ? "✓ Salvo!" : "Salvar"}
        </button>
      </div>

      {/* Info */}
      <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800 space-y-3">
        <h3 className="text-sm font-bold text-white">ℹ️ Sobre o App</h3>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Versão</span>
          <span className="text-white">1.0.0</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">IA</span>
          <span className="text-white">Claude (Anthropic)</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Dados</span>
          <span className="text-white">Local (localStorage)</span>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-950/20 rounded-2xl p-4 border border-red-900 space-y-3">
        <h3 className="text-sm font-bold text-red-400">⚠️ Zona de Perigo</h3>
        <p className="text-xs text-gray-400">
          Resetar apagará todos os dados: refeições, XP, missões, avatar e configurações.
        </p>
        <button
          onClick={handleReset}
          className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-colors"
        >
          Resetar Todos os Dados
        </button>
      </div>
    </div>
  );
}
