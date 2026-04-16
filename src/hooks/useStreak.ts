import { useState, useEffect, useCallback } from "react";
import { checkStreak } from "../lib/gamification";

export function useStreak() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const s = checkStreak();
    setStreak(s);
  }, []);

  const logToday = useCallback(() => {
    const today = new Date().toDateString();
    localStorage.setItem("lastLogDate", today);
    const newStreak = checkStreak();
    setStreak(newStreak);
    return newStreak;
  }, []);

  return { streak, logToday };
}
