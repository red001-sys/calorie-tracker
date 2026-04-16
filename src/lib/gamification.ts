export const XP_RULES = {
  MEAL_LOGGED: 10,
  GOAL_REACHED: 50,
  MISSION_COMPLETED: 5,
  FEED_VOTE_CORRECT: 2,
};

export const LEVELS = [
  { level: 1, minXP: 0, maxXP: 99 },
  { level: 2, minXP: 100, maxXP: 249 },
  { level: 3, minXP: 250, maxXP: 499 },
  { level: 4, minXP: 500, maxXP: 999 },
  { level: 5, minXP: 1000, maxXP: Infinity },
];

export const MISSIONS = [
  { id: 1, text: "Registre 3 refeições hoje", goal: 3, type: "meals", xp: 30 },
  { id: 2, text: "Bata sua meta calórica", goal: 1, type: "goal", xp: 50 },
  { id: 3, text: "Registre o café da manhã", goal: 1, type: "breakfast", xp: 20 },
  { id: 4, text: "Registre 5 alimentos diferentes", goal: 5, type: "items", xp: 40 },
];

export const ACHIEVEMENTS = [
  { id: "first_meal", text: "Primeira refeição registrada", emoji: "🥇", condition: (s: any) => s.totalMeals >= 1 },
  { id: "streak_7", text: "Sequência de 7 dias", emoji: "🔥", condition: (s: any) => s.streak >= 7 },
  { id: "level_2", text: "Atingiu nível 2", emoji: "⭐", condition: (s: any) => s.level >= 2 },
  { id: "missions_10", text: "Completou 10 missões", emoji: "🎯", condition: (s: any) => s.totalMissions >= 10 },
  { id: "meals_30", text: "Registrou 30 refeições", emoji: "🏆", condition: (s: any) => s.totalMeals >= 30 },
];

export function getLevelFromXP(xp: number) {
  return LEVELS.findLast(l => xp >= l.minXP) || LEVELS[0];
}

export function checkStreak() {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const lastLog = localStorage.getItem('lastLogDate');
  let streak = parseInt(localStorage.getItem('userStreak') || '0');

  if (lastLog === today) return streak;
  if (lastLog === yesterday) streak++;
  else streak = 0;

  localStorage.setItem('userStreak', streak.toString());
  return streak;
}

export function addXP(amount: number) {
  const current = parseInt(localStorage.getItem('userXP') || '0');
  const newXP = current + amount;
  const oldLevel = getLevelFromXP(current).level;
  const newLevel = getLevelFromXP(newXP).level;
  localStorage.setItem('userXP', newXP.toString());
  localStorage.setItem('userLevel', newLevel.toString());
  return { newXP, levelUp: newLevel > oldLevel, newLevel };
}
