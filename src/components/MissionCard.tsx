interface MissionCardProps {
  text: string;
  progress: number;
  goal: number;
  xp: number;
  completed: boolean;
  onClaim?: () => void;
}

export default function MissionCard({ text, progress, goal, xp, completed, onClaim }: MissionCardProps) {
  const pct = Math.min((progress / goal) * 100, 100);

  return (
    <div className={`rounded-2xl p-4 border transition-all ${
      completed
        ? "bg-green-950/30 border-green-800"
        : "bg-gray-900 border-gray-800"
    }`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-white">{text}</span>
        <span className="text-xs font-bold text-yellow-400">+{xp} XP</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${
            completed ? "bg-green-500" : "bg-blue-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {progress}/{goal}
        </span>
        {completed && onClaim && (
          <button
            onClick={onClaim}
            className="text-xs bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded-full font-medium transition-colors"
          >
            Resgatar
          </button>
        )}
      </div>
    </div>
  );
}
