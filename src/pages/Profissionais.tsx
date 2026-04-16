import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfessionalChat from "../components/ProfessionalChat";
import { PROFESSIONAL_LIST, getProfessionalSystem } from "../lib/professionals";

export default function Profissionais() {
  const navigate = useNavigate();
  const [selectedProf, setSelectedProf] = useState<string | null>(null);

  const userData = {
    name: localStorage.getItem("userName") || "Usuário",
    goal: parseInt(localStorage.getItem("userGoal") || "2000"),
    weight: parseInt(localStorage.getItem("userWeight") || "70"),
    level: parseInt(localStorage.getItem("userLevel") || "1"),
    streak: parseInt(localStorage.getItem("userStreak") || "0"),
  };

  if (selectedProf) {
    return (
      <ProfessionalChat
        professionalId={selectedProf}
        userData={userData}
        onClose={() => setSelectedProf(null)}
      />
    );
  }

  return (
    <div className="px-4 pt-6 pb-8 space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white text-xl">
          ←
        </button>
        <h1 className="text-xl font-bold text-white">👨‍⚕️ Profissionais</h1>
      </div>

      <p className="text-sm text-gray-400">
        Converse com especialistas em saúde e bem-estar powered by IA.
      </p>

      {PROFESSIONAL_LIST.map((section) => (
        <div key={section.section}>
          <h2 className="text-sm font-bold text-gray-300 mb-3">{section.section}</h2>
          <div className="grid grid-cols-1 gap-2">
            {section.items.map((id) => {
              const prof = getProfessionalSystem(id, userData);
              return (
                <button
                  key={id}
                  onClick={() => setSelectedProf(id)}
                  className="flex items-center gap-3 bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 rounded-xl p-4 transition-all text-left"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                    style={{ backgroundColor: prof.color + "20" }}
                  >
                    {prof.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">{prof.name}</div>
                    <div className="text-xs text-gray-500">Toque para conversar</div>
                  </div>
                  <span className="text-gray-600">→</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
