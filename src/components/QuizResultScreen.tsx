import React, { useEffect } from 'react';
import { QuizSessionSummary, QuizQuestion, Difficulty } from '../types/quiz';
import { PlayerImage } from './PlayerImage';
import { DIFFICULTY_INFO } from '../data/quizManager';
import confetti from 'canvas-confetti';
import {
  Trophy,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  Sparkles,
  ArrowRight,
  Home,
} from 'lucide-react';

interface QuizResultScreenProps {
  summary: QuizSessionSummary;
  onRetry: () => void;
  onRetryMistakesOnly?: (missed: QuizQuestion[]) => void;
  onOpenMistakes: () => void;
  onGoHome: () => void;
}

export const QuizResultScreen: React.FC<QuizResultScreenProps> = ({
  summary,
  onRetry,
  onRetryMistakesOnly,
  onOpenMistakes,
  onGoHome,
}) => {
  const diffMeta = DIFFICULTY_INFO[summary.difficulty];
  const missedQuestions = summary.questions.filter((q) => !q.isCorrect);

  // Confetti trigger if score >= 700
  useEffect(() => {
    if (summary.score >= 700) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#ffffff'],
        });
      } catch {}
    }
  }, [summary.score]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 animate-fadeIn">
      {/* Top Header Card */}
      <div className="relative bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl mb-8 overflow-hidden text-center">
        {/* Glow ambient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border mb-4 bg-slate-800/80 text-slate-300 border-slate-700">
            <span>{diffMeta.icon}</span>
            <span>{diffMeta.title} 10문제 완료</span>
          </div>

          <div className="text-5xl sm:text-6xl mb-3 drop-shadow-lg">{summary.rankEmoji}</div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-1">
            {summary.rankTitle}
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 mb-6">
            축구 지식 테스트 결과! 총 점수와 랭크를 확인하세요.
          </p>

          {/* Key Metric Score Board */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl mb-6">
            <div className="bg-slate-800/60 rounded-2xl p-3 border border-slate-700/60">
              <span className="text-[11px] text-slate-400 block font-medium">최종 점수</span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-teko">
                {summary.score}점
              </span>
            </div>

            <div className="bg-slate-800/60 rounded-2xl p-3 border border-slate-700/60">
              <span className="text-[11px] text-slate-400 block font-medium">정답률</span>
              <span className="text-2xl sm:text-3xl font-black text-teal-300 font-teko">
                {summary.accuracy}%
              </span>
            </div>

            <div className="bg-slate-800/60 rounded-2xl p-3 border border-slate-700/60">
              <span className="text-[11px] text-slate-400 block font-medium">1차 시도 정답</span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-teko">
                {summary.firstTryCount} / 10
              </span>
            </div>

            <div className="bg-slate-800/60 rounded-2xl p-3 border border-slate-700/60">
              <span className="text-[11px] text-slate-400 block font-medium">2차 패자부활</span>
              <span className="text-2xl sm:text-3xl font-black text-amber-400 font-teko">
                {summary.secondTryCount}개
              </span>
            </div>
          </div>

          {/* Action Button Row */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition transform hover:-translate-y-0.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>새 10문제 도전</span>
            </button>

            {missedQuestions.length > 0 && onRetryMistakesOnly && (
              <button
                type="button"
                onClick={() => onRetryMistakesOnly(missedQuestions)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold text-sm transition transform hover:-translate-y-0.5"
              >
                <XCircle className="w-4 h-4 text-rose-400" />
                <span>틀린 {missedQuestions.length}문제 다시 풀기</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenMistakes}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-sm transition"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>오답노트 가기</span>
            </button>

            <button
              type="button"
              onClick={onGoHome}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700/60 font-semibold text-sm transition"
            >
              <Home className="w-4 h-4" />
              <span>난이도 변경</span>
            </button>
          </div>
        </div>
      </div>

      {/* Question by Question Review List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>문제별 정답 리뷰</span>
            <span className="text-xs text-slate-400 font-normal">
              (총 {summary.questions.length}문항)
            </span>
          </h2>
          <span className="text-xs text-slate-400">클릭하면 사진을 크게 볼 수 있습니다</span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {summary.questions.map((q, idx) => {
            const isFirstTry = q.solvedOnAttempt === 1;
            const isSecondTry = q.solvedOnAttempt === 2;
            const isMissed = !q.isCorrect;

            return (
              <div
                key={q.id}
                className={`relative bg-slate-900/80 border rounded-2xl p-4 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 transition hover:bg-slate-900 ${
                  isFirstTry
                    ? 'border-emerald-500/30'
                    : isSecondTry
                    ? 'border-amber-500/30'
                    : 'border-rose-500/30'
                }`}
              >
                {/* Left: Thumbnail & Player Details */}
                <div className="flex items-center gap-3.5 w-full sm:w-auto">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <PlayerImage player={q.player} size="thumb" className="shrink-0" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{q.correctOption}</h3>
                      <span className="text-xs text-slate-400 truncate">{q.player.nameEn}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span>{q.player.nationality}</span>
                      <span>•</span>
                      <span>{q.player.club}</span>
                      <span>•</span>
                      <span className="text-slate-300 font-medium">{q.player.position}</span>
                    </div>
                    <p className="text-xs text-slate-300/80 mt-1 line-clamp-1">{q.player.highlight}</p>
                  </div>
                </div>

                {/* Right: User Result Badge & Guesses */}
                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                  {isFirstTry && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>1차 정답 (+100점)</span>
                    </div>
                  )}

                  {isSecondTry && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>2차 통과 (+60점)</span>
                    </div>
                  )}

                  {isMissed && (
                    <div className="flex flex-col items-end text-xs">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-300 font-bold">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>오답 (0점)</span>
                      </span>
                      {q.wrongAttempts.length > 0 && (
                        <span className="text-[11px] text-slate-400 mt-1">
                          선택: {q.wrongAttempts.join(', ')}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
