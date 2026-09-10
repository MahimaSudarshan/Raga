export const BADGES = [
  {
    id: "first_note",
    icon: "🎵",
    name: "First Note",
    desc: "Complete your first practice session",
    check: (stats) => stats.totalSessions >= 1,
  },
  {
    id: "week_warrior",
    icon: "🔥",
    name: "Week Warrior",
    desc: "Achieve a 7-day practice streak",
    check: (stats) => stats.maxStreak >= 7,
  },
  {
    id: "fortnight",
    icon: "🔥",
    name: "Fortnight Sadhana",
    desc: "Achieve a 14-day practice streak",
    check: (stats) => stats.maxStreak >= 14,
  },
  {
    id: "monthly_sadhana",
    icon: "🔥",
    name: "Monthly Sadhana",
    desc: "Achieve a 30-day practice streak",
    check: (stats) => stats.maxStreak >= 30,
  },
  {
    id: "raga_explorer",
    icon: "🎼",
    name: "Raga Explorer",
    desc: "Practice 5 different ragas",
    check: (stats) => stats.uniqueRagas >= 5,
  },
  {
    id: "melakarta_master",
    icon: "🎼",
    name: "Melakarta Master",
    desc: "Practice 10 different ragas",
    check: (stats) => stats.uniqueRagas >= 10,
  },
  {
    id: "hour_of_riyaz",
    icon: "⏱",
    name: "Hour of Riyaz",
    desc: "Complete a single session of 60+ minutes",
    check: (stats) => stats.longestSession >= 3600,
  },
  {
    id: "taal_keeper",
    icon: "🥁",
    name: "Taal Keeper",
    desc: "Practice with 5 different taals",
    check: (stats) => stats.uniqueTaals >= 5,
  },
  {
    id: "pitch_perfect",
    icon: "🎤",
    name: "Pitch Perfect",
    desc: "Complete 10 sessions with drift detection on",
    check: (stats) => stats.totalSessions >= 10,
  },
  {
    id: "carnatic_explorer",
    icon: "🪗",
    name: "Carnatic Explorer",
    desc: "Complete 5 Carnatic practice sessions",
    check: (stats) => stats.carnaticSessions >= 5,
  },
  {
    id: "hindustani_explorer",
    icon: "🪗",
    name: "Hindustani Explorer",
    desc: "Complete 5 Hindustani practice sessions",
    check: (stats) => stats.hindustaniSessions >= 5,
  },
  {
    id: "both_traditions",
    icon: "🌟",
    name: "Both Traditions",
    desc: "Practice both Hindustani and Carnatic",
    check: (stats) => stats.carnaticSessions >= 1 && stats.hindustaniSessions >= 1,
  },
];

export const computeStats = (sessions) => {
  if (!sessions || sessions.length === 0) return {
    totalSessions: 0,
    maxStreak: 0,
    uniqueRagas: 0,
    uniqueTaals: 0,
    longestSession: 0,
    carnaticSessions: 0,
    hindustaniSessions: 0,
  };

  const totalSessions = sessions.length;
  const longestSession = Math.max(...sessions.map(s => s.duration || 0));
  const uniqueTaals = new Set(sessions.map(s => s.taal)).size;
  const uniqueRagas = new Set(sessions.filter(s => s.raga).map(s => s.raga)).size;
  const carnaticSessions = sessions.filter(s => s.tradition === "carnatic").length;
  const hindustaniSessions = sessions.filter(s => s.tradition === "hindustani").length;

  // Compute max streak from session dates
  const practiceDays = new Set(
    sessions
      .filter(s => s.date)
      .map(s => {
        const d = s.date.toDate ? s.date.toDate() : new Date(s.date);
        return d.toDateString();
      })
  );

  const sortedDays = [...practiceDays]
    .map(d => new Date(d))
    .sort((a, b) => a - b);

  let maxStreak = 0;
  let currentStreak = 1;

  for (let i = 1; i < sortedDays.length; i++) {
    const diff = (sortedDays[i] - sortedDays[i - 1]) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }
  if (sortedDays.length > 0) maxStreak = Math.max(maxStreak, currentStreak);

  return {
    totalSessions,
    maxStreak,
    uniqueRagas,
    uniqueTaals,
    longestSession,
    carnaticSessions,
    hindustaniSessions,
  };
};
