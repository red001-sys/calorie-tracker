interface MacroCardProps {
  label: string;
  value: number;
  goal: number;
  color: string;
  emoji: string;
}

export default function MacroCard({ label, value, goal, color, emoji }: MacroCardProps) {
  const pct = goal > 0 ? Math.min((value / goal) * 100, 100) : 0;

  return (
    <div className="flex-1 bg-gray-900 rounded-2xl p-3 text-center border border-gray-800">
      <div className="text-lg mb-1">{emoji}</div>
      <div className="text-xs text-gray-400 mb-1">{label}</div>
      <div className="text-sm font-bold" style={{ color }}>
        {value}g
      </div>
      <div className="text-xs text-gray-500">/ {goal}g</div>
      <div className="w-full bg-gray-800 rounded-full h-1.5 mt-2">
        <div
          className="h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
