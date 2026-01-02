const ACHIEVEMENTS = [
  {
    id: "first-step",
    name: "Primeiro Passo",
    description: "Complete sua primeira rotina",
    icon: "👣",
    condition: (history) => history.some(h => h.completedMorning || h.completedNight),
    rarity: "common",
  },
  {
    id: "morning-warrior",
    name: "Guerreira da Manhã",
    description: "Complete 5 rotinas de manhã",
    icon: "☀️",
    condition: (history) => history.filter(h => h.completedMorning).length >= 5,
    rarity: "common",
  },
  {
    id: "night-owl",
    name: "Coruja Noturna",
    description: "Complete 5 rotinas de noite",
    icon: "🌙",
    condition: (history) => history.filter(h => h.completedNight).length >= 5,
    rarity: "common",
  },
  {
    id: "perfect-day",
    name: "Dia Perfeito",
    description: "Complete manhã e noite no mesmo dia",
    icon: "✨",
    condition: (history) => history.some(h => h.completedMorning && h.completedNight),
    rarity: "rare",
  },
  {
    id: "week-warrior",
    name: "Semana de Ouro",
    description: "7 dias consecutivos de rotina",
    icon: "🏆",
    condition: (history) => getMaxConsecutiveDays(history) >= 7,
    rarity: "rare",
  },
  {
    id: "month-master",
    name: "Mestre do Mês",
    description: "30 dias consecutivos de rotina",
    icon: "👑",
    condition: (history) => getMaxConsecutiveDays(history) >= 30,
    rarity: "epic",
  },
  {
    id: "hundred-days",
    name: "Centésimo Dia",
    description: "100 dias consecutivos de rotina",
    icon: "💎",
    condition: (history) => getMaxConsecutiveDays(history) >= 100,
    rarity: "legendary",
  },
  {
    id: "consistency-queen",
    name: "Rainha da Consistência",
    description: "Complete 50 rotinas no total",
    icon: "👸",
    condition: (history) => history.filter(h => h.completedMorning || h.completedNight).length >= 50,
    rarity: "epic",
  },
  {
    id: "double-duty",
    name: "Dupla Jornada",
    description: "Complete 10 dias com manhã e noite",
    icon: "⚡",
    condition: (history) => history.filter(h => h.completedMorning && h.completedNight).length >= 10,
    rarity: "rare",
  },
  {
    id: "skincare-devotee",
    name: "Devota de Skincare",
    description: "Complete 100 rotinas no total",
    icon: "💕",
    condition: (history) => history.filter(h => h.completedMorning || h.completedNight).length >= 100,
    rarity: "legendary",
  },
];

function getMaxConsecutiveDays(history) {
  if (!history || history.length === 0) return 0;

  const sorted = [...history].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  let maxConsecutive = 0;
  let currentConsecutive = 0;
  let lastDate = null;

  for (const entry of sorted) {
    if (entry.completedMorning || entry.completedNight) {
      const entryDate = new Date(entry.date);

      if (lastDate === null) {
        currentConsecutive = 1;
        lastDate = entryDate;
      } else {
        const daysDiff = (lastDate - entryDate) / (1000 * 60 * 60 * 24);

        if (daysDiff === 1) {
          currentConsecutive++;
          lastDate = entryDate;
        } else {
          maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
          currentConsecutive = 1;
          lastDate = entryDate;
        }
      }
    }
  }

  maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
  return maxConsecutive;
}

function getUnlockedAchievements(history) {
  return ACHIEVEMENTS.filter(achievement => achievement.condition(history));
}

function getStatistics(history) {
  const morningCount = history.filter(h => h.completedMorning).length;
  const nightCount = history.filter(h => h.completedNight).length;
  const totalCount = history.filter(h => h.completedMorning || h.completedNight).length;
  const perfectDayCount = history.filter(h => h.completedMorning && h.completedNight).length;
  const consecutiveDays = getMaxConsecutiveDays(history);

  const totalDays = history.length;
  const completionRate = totalDays > 0 ? (totalCount / totalDays) * 100 : 0;

  return {
    morningCount,
    nightCount,
    totalCount,
    perfectDayCount,
    consecutiveDays,
    completionRate,
    totalDays,
  };
}

module.exports = {
  ACHIEVEMENTS,
  getMaxConsecutiveDays,
  getUnlockedAchievements,
  getStatistics,
};
