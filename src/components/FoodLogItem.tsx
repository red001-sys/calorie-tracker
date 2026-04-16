interface FoodLogItemProps {
  emoji: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
  onDelete?: () => void;
}

export default function FoodLogItem({ emoji, name, calories, protein, carbs, fat, time, onDelete }: FoodLogItemProps) {
  return (
    <div className="flex items-center gap-3 bg-gray-900 rounded-xl p-3 border border-gray-800 hover:border-gray-700 transition-colors">
      <div className="text-2xl w-10 h-10 flex items-center justify-center bg-gray-800 rounded-lg">
        {emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-white truncate">{name}</div>
        <div className="text-xs text-gray-400">
          P: {protein}g · C: {carbs}g · G: {fat}g
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-bold text-green-400">{calories} kcal</div>
        <div className="text-xs text-gray-500">{time}</div>
      </div>
      {onDelete && (
        <button
          onClick={onDelete}
          className="text-gray-600 hover:text-red-400 transition-colors p-1"
          aria-label="Remover"
        >
          ✕
        </button>
      )}
    </div>
  );
}
