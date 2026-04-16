import { useState, useEffect, useCallback } from "react";
import { addXP, getLevelFromXP } from "../lib/gamification";

export function useXP() {
  const [xp, setXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [levelUp, setLevelUp] = useState(false);

  useEffect(() => {
    const savedXP = parseInt(localStorage.getItem("userXP") || "0");
    const savedLevel = parseInt(localStorage.getItem("userLevel") || "1");
    setXP(savedXP);
    setLevel(savedLevel);
  }, []);

  const gainXP = useCallback((amount: number) => {
    const result = addXP(amount);
    setXP(result.newXP);
    setLevel(result.newLevel);
    setLevelUp(result.levelUp);
    if (result.levelUp) {
      setTimeout(() => setLevelUp(false), 3000);
    }
    return result;
  }, []);

  const xpForCurrentLevel = (() => {
    const lvl = getLevelFromXP(xp);
    const progress = lvl.maxXP === Infinity
      ? 1
      : (xp - lvl.minXP) / (lvl.maxXP - lvl.minXP);
    return { current: xp - lvl.minXP, needed: lvl.maxXP - lvl.minXP, progress: Math.min(progress, 1) };
  })();

  return { xp, level, levelUp, gainXP, xpProgress: xpForCurrentLevel };
}
