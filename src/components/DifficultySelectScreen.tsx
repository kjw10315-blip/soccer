import React from 'react';
import { Difficulty } from '../types/quiz';
import { DIFFICULTY_INFO } from '../data/quizManager';
import {
  Trophy,
  BookOpen,
  Users,
  Timer,
  Heart,
  HelpCircle,
  Volume2,
  VolumeX,
  Play,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Flame,
  Award,
} from 'lucide-react';

interface DifficultySelectScreenProps {
  onSelectDifficulty: (difficulty: Difficulty) => void;
  mistakesCount: number;
  onOpenMistakes: () => void;
  onOpenEncyclopedia: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const DifficultySelectScreen: React.FC<DifficultySelectScreenProps> = ({
  onSelectDifficulty,
  mistakesCount,
  onOpenMistakes,
  onOpenEncyclopedia,
  isMuted,
  onToggleMute,
}) => {
  const difficulties: Difficulty[] = ['beginner', 'intermediate', 'advanced'];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10 animate-fadeIn">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-lg">
            ⚽
          </div>
          <span className="font-black text-lg tracking-tight text-white">FOOTBALL QUIZ</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onOpenEncyclopedia}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-bold transition"
          >
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">300+</span>
            <span>선수 도감</span>
          </button>

          <button
            type="button"
            onClick={onOpenMistakes}
            className="relative inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-bold transition"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>오답노트</span>
            {mistakesCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-black bg-rose-500 text-white">
                {mistakesCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onToggleMute}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
            title={isMuted ? '소리 켜기' : '음소거'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Hero Headline Section */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-3 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>초급 · 중급 · 고급 난이도별 100+ 선수 데이터베이스</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3 leading-tight">
          축구 선수 이름 맞추기
        </h1>

        <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
          선수 사진을 보고 15초 안에 이름을 맞혀보세요!<br className="hidden sm:block" />
          한 번 틀려도 패자부활 기회가 주어지며, 틀린 문제는 오답노트에 자동 저장됩니다.
        </p>

        {/* Feature Badges Strip */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-5 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
            <Timer className="w-3.5 h-3.5 text-amber-400" />
            <span>15초 제한 시간</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            <span>1회 추가 기회 (2회 시도)</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
            <Trophy className="w-3.5 h-3.5 text-emerald-400" />
            <span>한 번에 10문제 출제</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span>오답노트 & 다시 풀기</span>
          </div>
        </div>
      </div>

      {/* Difficulty Level Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {difficulties.map((diff) => {
          const meta = DIFFICULTY_INFO[diff];

          const borderHover =
            diff === 'advanced'
              ? 'hover:border-rose-500/80 hover:shadow-[0_0_30px_rgba(244,63,94,0.25)]'
              : diff === 'intermediate'
              ? 'hover:border-amber-500/80 hover:shadow-[0_0_30px_rgba(245,158,11,0.25)]'
              : 'hover:border-emerald-500/80 hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]';

          const btnGrad =
            diff === 'advanced'
              ? 'from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500'
              : diff === 'intermediate'
              ? 'from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400'
              : 'from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400';

          return (
            <div
              key={diff}
              className={`relative bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950/90 border border-slate-800/90 rounded-3xl p-6 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between group transform hover:-translate-y-1 ${borderHover}`}
            >
              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl drop-shadow-md">{meta.icon}</span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-black bg-slate-800 text-slate-300 border border-slate-700">
                    {meta.count}개 문항 DB
                  </span>
                </div>

                <h3 className="text-xl font-black text-white tracking-tight mb-2 flex items-center gap-1.5">
                  <span>{meta.title}</span>
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed mb-4 min-h-[40px]">
                  {meta.sub}
                </p>

                {/* Example sample names */}
                <div className="bg-slate-950/70 rounded-2xl p-3 border border-slate-800/80 mb-6">
                  <span className="text-[11px] font-bold text-slate-400 block mb-1">
                    대표 등장 선수:
                  </span>
                  <span className="text-xs text-slate-200 font-medium">
                    {diff === 'beginner' && '손흥민, 메시, 호날두, 이강인, 김민재, 음바페, 홀란드 등'}
                    {diff === 'intermediate' && '비니시우스, 벨링엄, 로드리, 사카, 포든, 무시알라, 야말 등'}
                    {diff === 'advanced' && '말디니, 바레시, 베르캄프, 리켈메, 피를로, 푸스카스, 쿠바르시 등'}
                  </span>
                </div>
              </div>

              {/* Start Quiz Button */}
              <button
                type="button"
                onClick={() => onSelectDifficulty(diff)}
                className={`w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r ${btnGrad} text-slate-950 font-black text-sm tracking-wide shadow-lg flex items-center justify-center gap-2 transition duration-200 active:scale-95`}
              >
                <Play className="w-4 h-4 fill-current" />
                <span>10문제 도전하기</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Quick Play from Mistakes if user has mistakes */}
      {mistakesCount > 0 && (
        <div className="relative bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/40 rounded-3xl p-5 sm:p-6 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <span>오답노트에 {mistakesCount}명의 선수가 보관되어 있습니다</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                이전에 틀렸던 선수들만 집중적으로 다시 풀며 확실하게 마스터해보세요!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenMistakes}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition shrink-0"
          >
            오답노트 열기 & 다시 풀기
          </button>
        </div>
      )}
    </div>
  );
};
