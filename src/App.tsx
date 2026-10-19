/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Difficulty, QuizQuestion, QuizSessionSummary, MistakeNote } from './types/quiz';
import { FootballBackground } from './components/FootballBackground';
import { DifficultySelectScreen } from './components/DifficultySelectScreen';
import { QuizPlayScreen } from './components/QuizPlayScreen';
import { QuizResultScreen } from './components/QuizResultScreen';
import { MistakesNotebookModal } from './components/MistakesNotebookModal';
import { PlayerEncyclopediaModal } from './components/PlayerEncyclopediaModal';
import {
  generateQuizSession,
  generateRetrySession,
  evaluateSession,
  getStoredMistakes,
  removeMistake,
  clearAllMistakes,
  saveSessionToHistory,
} from './data/quizManager';
import { sound } from './utils/soundEffects';

type ScreenView = 'home' | 'quiz' | 'result';

export default function App() {
  const [view, setView] = useState<ScreenView>('home');
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty>('beginner');
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);
  const [sessionSummary, setSessionSummary] = useState<QuizSessionSummary | null>(null);

  // Mistakes & modals
  const [mistakes, setMistakes] = useState<MistakeNote[]>([]);
  const [isMistakesModalOpen, setIsMistakesModalOpen] = useState(false);
  const [isEncyclopediaOpen, setIsEncyclopediaOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(sound.getMuted());

  // Load mistakes from localStorage on mount
  useEffect(() => {
    setMistakes(getStoredMistakes());
  }, []);

  // Audio mute toggle
  const handleToggleMute = () => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
  };

  // Start new 10-question session for selected difficulty
  const handleStartDifficulty = (diff: Difficulty) => {
    setCurrentDifficulty(diff);
    sound.playWhistle();
    const questions = generateQuizSession(diff, 10);
    setActiveQuestions(questions);
    setView('quiz');
  };

  // Complete quiz session
  const handleFinishQuiz = (completedQuestions: QuizQuestion[], totalTimeSavedSec: number) => {
    const summary = evaluateSession(currentDifficulty, completedQuestions, totalTimeSavedSec);
    setSessionSummary(summary);
    saveSessionToHistory(summary);
    // Refresh mistakes list
    setMistakes(getStoredMistakes());
    setView('result');
  };

  // Retry new questions for same difficulty
  const handleRetryCurrent = () => {
    sound.playWhistle();
    const questions = generateQuizSession(currentDifficulty, 10);
    setActiveQuestions(questions);
    setView('quiz');
  };

  // Retry only the questions missed in current session
  const handleRetryMistakesOnly = (missed: QuizQuestion[]) => {
    sound.playWhistle();
    const mockMistakes: MistakeNote[] = missed.map((q) => ({
      id: `session-miss-${q.player.id}`,
      playerId: q.player.id,
      playerName: q.player.name,
      playerNameEn: q.player.nameEn,
      playerImageUrl: q.player.imageUrl,
      nationality: q.player.nationality,
      position: q.player.positionDetail || q.player.position,
      club: q.player.club,
      highlight: q.player.highlight,
      difficulty: q.player.difficulty,
      failedCount: 1,
      lastTestedAt: Date.now(),
      userGuessedWrong: q.wrongAttempts,
    }));

    const questions = generateRetrySession(mockMistakes, mockMistakes.length);
    setActiveQuestions(questions);
    setView('quiz');
  };

  // Start retry session directly from mistakes modal
  const handleStartRetryFromModal = (filteredMistakes: MistakeNote[]) => {
    sound.playWhistle();
    const questions = generateRetrySession(filteredMistakes, Math.min(10, filteredMistakes.length));
    setActiveQuestions(questions);
    setView('quiz');
  };

  // Remove single mistake
  const handleRemoveMistake = (playerId: string) => {
    const updated = removeMistake(playerId);
    setMistakes(updated);
  };

  // Clear all mistakes
  const handleClearAllMistakes = () => {
    clearAllMistakes();
    setMistakes([]);
  };

  return (
    <div className="relative min-h-screen text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950 font-sans">
      {/* Dynamic Background with Stadium, pitch lines, and player silhouettes */}
      <FootballBackground difficulty={view === 'quiz' ? currentDifficulty : undefined} />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {view === 'home' && (
          <DifficultySelectScreen
            onSelectDifficulty={handleStartDifficulty}
            mistakesCount={mistakes.length}
            onOpenMistakes={() => setIsMistakesModalOpen(true)}
            onOpenEncyclopedia={() => setIsEncyclopediaOpen(true)}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
          />
        )}

        {view === 'quiz' && activeQuestions.length > 0 && (
          <QuizPlayScreen
            difficulty={currentDifficulty}
            questions={activeQuestions}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            onFinish={handleFinishQuiz}
            onQuit={() => setView('home')}
          />
        )}

        {view === 'result' && sessionSummary && (
          <QuizResultScreen
            summary={sessionSummary}
            onRetry={handleRetryCurrent}
            onRetryMistakesOnly={handleRetryMistakesOnly}
            onOpenMistakes={() => setIsMistakesModalOpen(true)}
            onGoHome={() => setView('home')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-slate-500 border-t border-slate-900/60 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2">
          <span>⚽ 축구 선수 이름 맞추기 퀴즈 게임</span>
          <span>•</span>
          <span>초등 초급 · 중등 중급 · 고등 고급 300+ 문항 DB</span>
        </div>
      </footer>

      {/* Mistakes Notebook Modal */}
      <MistakesNotebookModal
        isOpen={isMistakesModalOpen}
        onClose={() => setIsMistakesModalOpen(false)}
        mistakes={mistakes}
        onRemoveMistake={handleRemoveMistake}
        onClearAll={handleClearAllMistakes}
        onStartRetrySession={handleStartRetryFromModal}
      />

      {/* Player Encyclopedia Modal */}
      <PlayerEncyclopediaModal
        isOpen={isEncyclopediaOpen}
        onClose={() => setIsEncyclopediaOpen(false)}
      />
    </div>
  );
}
