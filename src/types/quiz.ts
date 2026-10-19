export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Player {
  id: string;
  name: string; // Korean name (e.g. "손흥민")
  nameEn: string; // English name (e.g. "Son Heung-min")
  imageUrl: string; // High-res portrait or action photo
  difficulty: Difficulty;
  nationality: string; // e.g. "대한민국 🇰🇷"
  position: 'FW' | 'MF' | 'DF' | 'GK';
  positionDetail: string; // e.g. "레프트 윙어 / 스트라이커"
  club: string; // e.g. "토트넘 홋스퍼"
  era: string; // e.g. "현역", "은퇴/레전드"
  number?: number;
  highlight: string; // Key achievement / memorable fact for incorrect note and learning
  distractors?: string[]; // Plausible fake names if preset, else dynamically selected
}

export interface QuizQuestion {
  id: string;
  player: Player;
  options: string[]; // 4 multiple choice options
  correctOption: string;
  selectedOption: string | null;
  wrongAttempts: string[]; // Options clicked that were wrong
  isAnswered: boolean;
  isCorrect: boolean | null;
  solvedOnAttempt: 1 | 2 | null; // 1 for first try, 2 for second chance, null for failed
  timeSpent: number; // seconds spent
}

export interface QuizSessionSummary {
  difficulty: Difficulty;
  totalQuestions: number; // 10
  correctCount: number;
  firstTryCount: number;
  secondTryCount: number;
  wrongCount: number;
  score: number;
  accuracy: number;
  rankTitle: string;
  rankEmoji: string;
  timeBonus: number;
  questions: QuizQuestion[];
  date: string;
}

export interface MistakeNote {
  id: string;
  playerId: string;
  playerName: string;
  playerNameEn: string;
  playerImageUrl: string;
  nationality: string;
  position: string;
  club: string;
  highlight: string;
  difficulty: Difficulty;
  failedCount: number;
  lastTestedAt: number;
  userGuessedWrong: string[];
}
