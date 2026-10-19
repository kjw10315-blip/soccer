import { BEGINNER_PLAYERS } from './playersBeginner';
import { INTERMEDIATE_PLAYERS } from './playersIntermediate';
import { ADVANCED_PLAYERS } from './playersAdvanced';
import { Difficulty, Player, QuizQuestion, QuizSessionSummary, MistakeNote } from '../types/quiz';

export const ALL_PLAYERS: Record<Difficulty, Player[]> = {
  beginner: BEGINNER_PLAYERS,
  intermediate: INTERMEDIATE_PLAYERS,
  advanced: ADVANCED_PLAYERS,
};

export const DIFFICULTY_INFO = {
  beginner: {
    title: '초급 (초등학생 수준)',
    sub: '손흥민, 메시, 호날두 등 전 세계가 다 아는 월드클래스 슈퍼스타',
    count: BEGINNER_PLAYERS.length,
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    accentColor: '#10b981',
    icon: '⚽',
  },
  intermediate: {
    title: '중급 (중학생 수준)',
    sub: '유럽 5대 리그 주전, 국가대표 주축, 축구 팬이라면 누구나 아는 스타',
    count: INTERMEDIATE_PLAYERS.length,
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    accentColor: '#f59e0b',
    icon: '🔥',
  },
  advanced: {
    title: '고급 (고등학생 수준)',
    sub: '불멸의 레전드, 전술적 마에스트로, 철벽 수비수와 라이징 원더키드',
    count: ADVANCED_PLAYERS.length,
    badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
    accentColor: '#f43f5e',
    icon: '👑',
  },
};

// Fisher-Yates shuffle
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Generate 4 plausible options for a player
export function generateOptionsForPlayer(player: Player, pool: Player[]): string[] {
  // Try to pick distractors from same pool
  const candidatePool = pool.filter((p) => p.name !== player.name);

  // Preference for same position or same nationality if available
  const samePos = candidatePool.filter((p) => p.position === player.position);
  const otherPos = candidatePool.filter((p) => p.position !== player.position);

  const pickedDistractors: string[] = [];
  const shuffledSamePos = shuffleArray(samePos);
  const shuffledOtherPos = shuffleArray(otherPos);

  // Take up to 2 from same position, rest from others
  for (const p of shuffledSamePos) {
    if (pickedDistractors.length < 2 && !pickedDistractors.includes(p.name)) {
      pickedDistractors.push(p.name);
    }
  }

  for (const p of shuffledOtherPos) {
    if (pickedDistractors.length < 3 && !pickedDistractors.includes(p.name)) {
      pickedDistractors.push(p.name);
    }
  }

  // If still not 3, fallback
  for (const p of candidatePool) {
    if (pickedDistractors.length < 3 && !pickedDistractors.includes(p.name)) {
      pickedDistractors.push(p.name);
    }
  }

  const all4 = [player.name, ...pickedDistractors];
  return shuffleArray(all4);
}

// Generate a random 10-question quiz session
export function generateQuizSession(
  difficulty: Difficulty,
  count = 10,
  excludePlayerIds: string[] = []
): QuizQuestion[] {
  const pool = ALL_PLAYERS[difficulty] || BEGINNER_PLAYERS;
  
  // Filter out recent if possible, or fallback to full pool
  let eligible = pool.filter((p) => !excludePlayerIds.includes(p.id));
  if (eligible.length < count) {
    eligible = pool;
  }

  const shuffledPlayers = shuffleArray(eligible).slice(0, count);

  return shuffledPlayers.map((player, index) => {
    const options = generateOptionsForPlayer(player, pool);
    return {
      id: `q-${index + 1}-${player.id}-${Date.now()}`,
      player,
      options,
      correctOption: player.name,
      selectedOption: null,
      wrongAttempts: [],
      isAnswered: false,
      isCorrect: null,
      solvedOnAttempt: null,
      timeSpent: 0,
    };
  });
}

// Generate a quiz session from mistake notes (for "오답 다시 풀기")
export function generateRetrySession(mistakes: MistakeNote[], count = 10): QuizQuestion[] {
  const shuffledMistakes = shuffleArray(mistakes).slice(0, count);

  return shuffledMistakes.map((mistake, index) => {
    // Find player from database to have full data
    const pool = ALL_PLAYERS[mistake.difficulty] || BEGINNER_PLAYERS;
    const player = pool.find((p) => p.id === mistake.playerId) || {
      id: mistake.playerId,
      name: mistake.playerName,
      nameEn: mistake.playerNameEn,
      imageUrl: mistake.playerImageUrl,
      difficulty: mistake.difficulty,
      nationality: mistake.nationality,
      position: (mistake.position as 'FW' | 'MF' | 'DF' | 'GK') || 'FW',
      positionDetail: mistake.position,
      club: mistake.club,
      era: '현역',
      highlight: mistake.highlight,
    };

    const options = generateOptionsForPlayer(player, pool);

    return {
      id: `retry-q-${index + 1}-${player.id}-${Date.now()}`,
      player,
      options,
      correctOption: player.name,
      selectedOption: null,
      wrongAttempts: [],
      isAnswered: false,
      isCorrect: null,
      solvedOnAttempt: null,
      timeSpent: 0,
    };
  });
}

// Calculate score and rank
export function evaluateSession(
  difficulty: Difficulty,
  questions: QuizQuestion[],
  totalTimeRemainingSec: number
): QuizSessionSummary {
  const totalQuestions = questions.length;
  let correctCount = 0;
  let firstTryCount = 0;
  let secondTryCount = 0;
  let wrongCount = 0;
  let rawScore = 0;

  questions.forEach((q) => {
    if (q.solvedOnAttempt === 1) {
      firstTryCount++;
      correctCount++;
      rawScore += 100;
    } else if (q.solvedOnAttempt === 2) {
      secondTryCount++;
      correctCount++;
      rawScore += 60; // Partial score for second chance
    } else {
      wrongCount++;
    }
  });

  // Time bonus: up to 10 points per question depending on speed
  const timeBonus = Math.min(200, Math.round(totalTimeRemainingSec * 2));
  const finalScore = rawScore + (correctCount > 0 ? timeBonus : 0);
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  // Rank titles based on score & accuracy
  let rankTitle = '유스 아카데미 연습생';
  let rankEmoji = '⚽';

  if (finalScore >= 1100 || (firstTryCount === 10 && timeBonus > 100)) {
    rankTitle = '발롱도르 수상자';
    rankEmoji = '🏆';
  } else if (finalScore >= 950) {
    rankTitle = '프리미어리그 득점왕';
    rankEmoji = '🥇';
  } else if (finalScore >= 750) {
    rankTitle = '국가대표 에이스';
    rankEmoji = '🥈';
  } else if (finalScore >= 500) {
    rankTitle = '1군 주전 스타';
    rankEmoji = '🥉';
  } else if (finalScore >= 300) {
    rankTitle = '특급 유망주';
    rankEmoji = '🌟';
  }

  const now = new Date();
  const dateStr = `${now.getMonth() + 1}월 ${now.getDate()}일 ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

  return {
    difficulty,
    totalQuestions,
    correctCount,
    firstTryCount,
    secondTryCount,
    wrongCount,
    score: finalScore,
    accuracy,
    rankTitle,
    rankEmoji,
    timeBonus,
    questions,
    date: dateStr,
  };
}

// LocalStorage persistence for Mistake Notes
const MISTAKES_KEY = 'football_quiz_mistakes_v1';
const HISTORY_KEY = 'football_quiz_history_v1';

export function getStoredMistakes(): MistakeNote[] {
  try {
    const raw = localStorage.getItem(MISTAKES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveMistake(
  player: Player,
  userWrongAnswers: string[],
  difficulty: Difficulty
): MistakeNote[] {
  const current = getStoredMistakes();
  const existingIdx = current.findIndex((m) => m.playerId === player.id);

  if (existingIdx >= 0) {
    current[existingIdx].failedCount += 1;
    current[existingIdx].lastTestedAt = Date.now();
    current[existingIdx].userGuessedWrong = Array.from(
      new Set([...current[existingIdx].userGuessedWrong, ...userWrongAnswers])
    );
  } else {
    current.unshift({
      id: `mistake-${player.id}-${Date.now()}`,
      playerId: player.id,
      playerName: player.name,
      playerNameEn: player.nameEn,
      playerImageUrl: player.imageUrl,
      nationality: player.nationality,
      position: player.positionDetail || player.position,
      club: player.club,
      highlight: player.highlight,
      difficulty,
      failedCount: 1,
      lastTestedAt: Date.now(),
      userGuessedWrong: userWrongAnswers,
    });
  }

  localStorage.setItem(MISTAKES_KEY, JSON.stringify(current));
  return current;
}

export function removeMistake(playerId: string): MistakeNote[] {
  const current = getStoredMistakes().filter((m) => m.playerId !== playerId);
  localStorage.setItem(MISTAKES_KEY, JSON.stringify(current));
  return current;
}

export function clearAllMistakes(): void {
  localStorage.removeItem(MISTAKES_KEY);
}

// Quiz Session History
export function getStoredHistory(): QuizSessionSummary[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSessionToHistory(session: QuizSessionSummary): void {
  const history = getStoredHistory();
  history.unshift(session);
  // Keep last 30
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 30)));
}
