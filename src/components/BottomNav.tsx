import { useLocation, useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  { path: "/", label: "Início", emoji: "🏠" },
  { path: "/alimentar", label: "Alimentar", emoji: "🍽️" },
  { path: "/feed", label: "Feed", emoji: "📱" },
  { path: "/profissionais", label: "Profissionais", emoji: "👨‍⚕️" },
  { path: "/perfil", label: "Perfil", emoji: "👤" },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-gray-950 border-t border-gray-800 z-40">
      <div className="flex items-center justify-around py-2">
        {NAV_ITEMS.map((item) => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-all min-w-0 ${
                active
                  ? "text-green-400"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <span className="text-lg">{item.emoji}</span>
              <span className="text-xs truncate">{item.label}</span>
              {active && (
                <div className="w-1 h-1 rounded-full bg-green-400" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
