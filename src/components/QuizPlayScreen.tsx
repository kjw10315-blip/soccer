import React, { useState, useEffect, useRef, useCallback } from 'react';
import { QuizQuestion, Difficulty } from '../types/quiz';
import { PlayerImage } from './PlayerImage';
import { sound } from '../utils/soundEffects';
import { saveMistake, DIFFICULTY_INFO } from '../data/quizManager';
import {
  Timer,
  Heart,
  Volume2,
  VolumeX,
  ChevronRight,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Flag,
  Sparkles,
} from 'lucide-react';

interface QuizPlayScreenProps {
  difficulty: Difficulty;
  questions: QuizQuestion[];
  isMuted: boolean;
  onToggleMute: () => void;
  onFinish: (completedQuestions: QuizQuestion[], totalTimeSavedSec: number) => void;
  onQuit: () => void;
}

const QUESTION_TIME_LIMIT = 15; // 15 seconds as requested

export const QuizPlayScreen: React.FC<QuizPlayScreenProps> = ({
  difficulty,
  questions,
  isMuted,
  onToggleMute,
  onFinish,
  onQuit,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionQuestions, setSessionQuestions] = useState<QuizQuestion[]>(questions);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [wrongOptions, setWrongOptions] = useState<string[]>([]);
  const [attemptsLeft, setAttemptsLeft] = useState(2); // 2 lives per question (1st try + 1 retry)
  const [feedbackState, setFeedbackState] = useState<'idle' | 'first-wrong' | 'correct' | 'failed' | 'timeout'>('idle');
  const [totalSavedSeconds, setTotalSavedSeconds] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const currentQ = sessionQuestions[currentIndex];
  const diffMeta = DIFFICULTY_INFO[difficulty];
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const autoAdvanceRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    };
  }, []);

  // Timer loop
  useEffect(() => {
    if (isAnswered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    setTimeLeft(QUESTION_TIME_LIMIT);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }

        // Ticking audio when under 5 seconds
        if (prev <= 5) {
          sound.playTick(prev <= 3);
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isAnswered]);

  // Handle timeout
  const handleTimeout = useCallback(() => {
    sound.playWrongFinal();
    setIsAnswered(true);
    setFeedbackState('timeout');

    // Save as mistake
    saveMistake(currentQ.player, wrongOptions, difficulty);

    setSessionQuestions((prev) => {
      const copy = [...prev];
      copy[currentIndex] = {
        ...copy[currentIndex],
        selectedOption: null,
        wrongAttempts: wrongOptions,
        isAnswered: true,
        isCorrect: false,
        solvedOnAttempt: null,
        timeSpent: QUESTION_TIME_LIMIT,
      };
      return copy;
    });
  }, [currentIndex, currentQ, difficulty, wrongOptions]);

  // Handle option selection
  const handleSelectOption = (option: string) => {
    if (isAnswered) return;
    if (wrongOptions.includes(option)) return;

    sound.playClick();
    setSelectedOption(option);

    const isCorrect = option === currentQ.correctOption;

    if (isCorrect) {
      // Correct!
      sound.playCorrect();
      setIsAnswered(true);
      setFeedbackState('correct');
      const solvedAttempt = attemptsLeft === 2 ? 1 : 2;
      const timeSpent = QUESTION_TIME_LIMIT - timeLeft;
      setTotalSavedSeconds((prev) => prev + Math.max(0, timeLeft));

      setSessionQuestions((prev) => {
        const copy = [...prev];
        copy[currentIndex] = {
          ...copy[currentIndex],
          selectedOption: option,
          wrongAttempts: wrongOptions,
          isAnswered: true,
          isCorrect: true,
          solvedOnAttempt: solvedAttempt,
          timeSpent,
        };
        return copy;
      });
    } else {
      // Wrong option chosen
      const updatedWrong = [...wrongOptions, option];
      setWrongOptions(updatedWrong);

      if (attemptsLeft === 2) {
        // First wrong attempt -> Give second chance!
        sound.playWarningChance();
        setAttemptsLeft(1);
        setFeedbackState('first-wrong');
      } else {
        // Second wrong attempt -> Failed question
        sound.playWrongFinal();
        setIsAnswered(true);
        setFeedbackState('failed');

        // Save to mistake notes
        saveMistake(currentQ.player, updatedWrong, difficulty);

        setSessionQuestions((prev) => {
          const copy = [...prev];
          copy[currentIndex] = {
            ...copy[currentIndex],
            selectedOption: option,
            wrongAttempts: updatedWrong,
            isAnswered: true,
            isCorrect: false,
            solvedOnAttempt: null,
            timeSpent: QUESTION_TIME_LIMIT - timeLeft,
          };
          return copy;
        });
      }
    }
  };

  // Next Question
  const handleNext = () => {
    sound.playClick();
    if (currentIndex + 1 < sessionQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setTimeLeft(QUESTION_TIME_LIMIT);
      setIsAnswered(false);
      setSelectedOption(null);
      setWrongOptions([]);
      setAttemptsLeft(2);
      setFeedbackState('idle');
      setShowHint(false);
    } else {
      // Finished all 10 questions!
      sound.playWhistle();
      onFinish(sessionQuestions, totalSavedSeconds);
    }
  };

  const timerPercentage = (timeLeft / QUESTION_TIME_LIMIT) * 100;
  const isUrgent = timeLeft <= 5;

  return (
    <div className="relative min-h-[85vh] flex flex-col justify-between max-w-4xl mx-auto px-4 py-4 sm:py-6">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-4 mb-4">
        {/* Left: Difficulty Badge & Question Counter */}
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${diffMeta.badgeColor}`}
          >
            {diffMeta.icon} {diffMeta.title.split(' ')[0]}
          </span>
          <div className="flex items-center gap-1.5 text-sm font-bold text-slate-300 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800">
            <span className="text-emerald-400 text-base">{currentIndex + 1}</span>
            <span className="text-slate-500">/</span>
            <span>{sessionQuestions.length}</span>
          </div>
        </div>

        {/* Center: Lives / Chances indicator */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800 text-xs font-semibold">
          <span className="text-slate-400 mr-1">기회:</span>
          <div className="flex items-center gap-1">
            <Heart
              className={`w-4 h-4 transition-all ${
                attemptsLeft >= 1
                  ? 'text-rose-500 fill-rose-500 scale-100'
                  : 'text-slate-600 scale-90'
              }`}
            />
            <Heart
              className={`w-4 h-4 transition-all ${
                attemptsLeft >= 2
                  ? 'text-rose-500 fill-rose-500 scale-100'
                  : 'text-slate-600 scale-90'
              }`}
            />
          </div>
          {attemptsLeft === 1 && (
            <span className="text-amber-400 text-[11px] font-bold animate-pulse ml-1">
              (마지막 기회!)
            </span>
          )}
        </div>

        {/* Right: Sound & Quit controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleMute}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
            title={isMuted ? '소리 켜기' : '음소거'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
          <button
            type="button"
            onClick={() => {
              if (window.confirm('현재 퀴즈를 중단하고 메인 화면으로 돌아가시겠습니까?')) {
                onQuit();
              }
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-rose-950/60 hover:text-rose-300 text-slate-400 border border-slate-800 hover:border-rose-800/60 text-xs font-medium transition"
          >
            포기하기
          </button>
        </div>
      </div>

      {/* 15-Second Timer Bar */}
      <div className="relative w-full bg-slate-900/90 rounded-full h-3 border border-slate-800 overflow-hidden mb-6 shadow-inner">
        <div
          className={`h-full transition-all duration-1000 ease-linear rounded-full ${
            isUrgent
              ? 'bg-gradient-to-r from-amber-500 to-rose-600 animate-pulse'
              : 'bg-gradient-to-r from-teal-500 to-emerald-400'
          }`}
          style={{ width: `${timerPercentage}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-between px-3 pointer-events-none">
          <div className="flex items-center gap-1">
            <Timer className={`w-3 h-3 ${isUrgent ? 'text-rose-300 animate-spin' : 'text-slate-300'}`} />
            <span
              className={`text-[11px] font-black font-teko tracking-wider ${
                isUrgent ? 'text-rose-200 font-bold' : 'text-slate-200'
              }`}
            >
              {timeLeft}초 남음
            </span>
          </div>
          {isUrgent && !isAnswered && (
            <span className="text-[10px] text-rose-300 font-bold tracking-tight animate-bounce">
              서두르세요!
            </span>
          )}
        </div>
      </div>

      {/* Main Quiz Arena Card */}
      <div className="relative bg-slate-900/75 backdrop-blur-xl border border-slate-800/90 rounded-3xl p-5 sm:p-8 shadow-2xl flex-1 flex flex-col justify-between overflow-hidden">
        {/* Subtle Pitch Grass Grid Watermark */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]" />

        {/* Question Prompt */}
        <div className="relative z-10 text-center mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300 mb-2">
            <span>선수 사진을 보고 올바른 이름을 맞혀보세요</span>
            <span className="text-emerald-400 font-semibold">• 15초 제한</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center justify-center gap-2">
            <span>이 축구 선수의 이름은?</span>
          </h2>
        </div>

        {/* Center: Player Photo & Hint Section */}
        <div className="relative z-10 flex flex-col items-center justify-center my-auto py-2">
          <PlayerImage player={currentQ.player} size="large" />

          {/* Hint Toggle */}
          <div className="mt-3 flex items-center gap-2">
            {!showHint ? (
              <button
                type="button"
                onClick={() => setShowHint(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/50 text-xs transition"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>힌트 보기 (국적 & 포지션)</span>
              </button>
            ) : (
              <div className="flex items-center gap-3 px-4 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 animate-fadeIn">
                <span className="font-semibold">{currentQ.player.nationality}</span>
                <span>•</span>
                <span>{currentQ.player.positionDetail || currentQ.player.position}</span>
                <span>•</span>
                <span>등번호: {currentQ.player.number ? `${currentQ.player.number}번` : '미등록'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Interactive Feedback Notification Banners */}
        <div className="relative z-10 my-3 min-h-[50px] flex items-center justify-center">
          {feedbackState === 'first-wrong' && !isAnswered && (
            <div className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs sm:text-sm animate-bounce shadow-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                <span>
                  <strong>오답입니다!</strong> 하지만 <strong>한 번 더 기회</strong>가 남아있습니다. 다시 골라보세요!
                </span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-md bg-amber-500/20 font-bold shrink-0">
                기회 1회 남음
              </span>
            </div>
          )}

          {feedbackState === 'correct' && (
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs sm:text-sm shadow-lg animate-fadeIn">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold text-white text-base mr-2">{currentQ.correctOption}</span>
                  <span>
                    정답입니다! {attemptsLeft === 2 ? '🎉 첫 시도 만점 (+100점)' : '👏 2차 시도 통과 (+60점)'}
                  </span>
                </div>
              </div>
              <span className="text-xs text-emerald-200/90 hidden sm:inline">
                {currentQ.player.highlight}
              </span>
            </div>
          )}

          {(feedbackState === 'failed' || feedbackState === 'timeout') && (
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2 px-4 py-2.5 rounded-2xl bg-rose-500/20 border border-rose-500/50 text-rose-300 text-xs sm:text-sm shadow-lg animate-fadeIn">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <div>
                  <span className="font-semibold text-rose-200">
                    {feedbackState === 'timeout' ? '시간 초과!' : '기회 소진!'} 정답은
                  </span>{' '}
                  <strong className="text-white text-base underline underline-offset-2">
                    {currentQ.correctOption}
                  </strong>{' '}
                  <span className="text-rose-200/90">(오답노트에 자동 저장됨)</span>
                </div>
              </div>
              <span className="text-xs text-rose-200/80 hidden sm:inline">
                {currentQ.player.highlight}
              </span>
            </div>
          )}
        </div>

        {/* 4 Multiple Choice Option Buttons */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {currentQ.options.map((option, idx) => {
            const isWrong = wrongOptions.includes(option);
            const isCorrectAnswer = isAnswered && option === currentQ.correctOption;
            const isPicked = selectedOption === option;

            let btnStyle =
              'bg-slate-800/80 hover:bg-slate-700/80 text-slate-100 border-slate-700 hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]';

            if (isCorrectAnswer) {
              btnStyle =
                'bg-emerald-600/90 text-white border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)] font-bold';
            } else if (isWrong) {
              btnStyle =
                'bg-rose-950/40 text-rose-300/60 border-rose-900/60 line-through opacity-60 cursor-not-allowed';
            } else if (isAnswered) {
              btnStyle = 'bg-slate-900/60 text-slate-500 border-slate-800 cursor-not-allowed opacity-50';
            }

            return (
              <button
                key={option}
                type="button"
                disabled={isAnswered || isWrong}
                onClick={() => handleSelectOption(option)}
                className={`relative px-5 py-3.5 rounded-2xl border text-base font-semibold transition-all duration-200 flex items-center justify-between group active:scale-[0.98] ${btnStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                      isCorrectAnswer
                        ? 'bg-emerald-400 text-slate-950'
                        : isWrong
                        ? 'bg-rose-900/60 text-rose-300'
                        : 'bg-slate-700/60 text-slate-300 group-hover:bg-emerald-500/20 group-hover:text-emerald-300'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="tracking-wide text-left">{option}</span>
                </div>

                {/* Right side icon */}
                {isCorrectAnswer && <CheckCircle2 className="w-5 h-5 text-emerald-200" />}
                {isWrong && <XCircle className="w-5 h-5 text-rose-400" />}
              </button>
            );
          })}
        </div>

        {/* Footer / Next Button */}
        {isAnswered && (
          <div className="relative z-10 pt-2 border-t border-slate-800/80 flex items-center justify-between animate-fadeIn">
            <div className="text-xs text-slate-400 hidden sm:block">
              {currentIndex + 1 < sessionQuestions.length ? '다음 문제로 이동하세요' : '마지막 문제 완료!'}
            </div>
            <button
              type="button"
              onClick={handleNext}
              className="ml-auto inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-emerald-500/30 transition transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>{currentIndex + 1 < sessionQuestions.length ? '다음 문제' : '결과 확인하기'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
