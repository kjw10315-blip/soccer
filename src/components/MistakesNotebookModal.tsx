import React, { useState } from 'react';
import { MistakeNote, Difficulty } from '../types/quiz';
import { PlayerImage } from './PlayerImage';
import { DIFFICULTY_INFO } from '../data/quizManager';
import {
  BookOpen,
  X,
  Trash2,
  Play,
  Search,
  Filter,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Shield,
  RotateCcw,
} from 'lucide-react';

interface MistakesNotebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  mistakes: MistakeNote[];
  onRemoveMistake: (playerId: string) => void;
  onClearAll: () => void;
  onStartRetrySession: (filteredMistakes: MistakeNote[]) => void;
}

export const MistakesNotebookModal: React.FC<MistakesNotebookModalProps> = ({
  isOpen,
  onClose,
  mistakes,
  onRemoveMistake,
  onClearAll,
  onStartRetrySession,
}) => {
  const [filterDiff, setFilterDiff] = useState<'all' | Difficulty>('all');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredMistakes = mistakes.filter((m) => {
    const matchesDiff = filterDiff === 'all' || m.difficulty === filterDiff;
    const matchesSearch =
      m.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.playerNameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.club.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.nationality.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDiff && matchesSearch;
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/80 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">오답노트</h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {mistakes.length}명 저장됨
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                퀴즈에서 틀렸던 선수들을 복습하고, 오답만 다시 모아서 풀어보세요.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action & Filter Toolbar */}
        <div className="px-6 py-3.5 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          {/* Difficulty filter tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setFilterDiff('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                filterDiff === 'all'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              전체 ({mistakes.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterDiff('beginner')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                filterDiff === 'beginner'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              초급 ({mistakes.filter((m) => m.difficulty === 'beginner').length})
            </button>
            <button
              type="button"
              onClick={() => setFilterDiff('intermediate')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                filterDiff === 'intermediate'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              중급 ({mistakes.filter((m) => m.difficulty === 'intermediate').length})
            </button>
            <button
              type="button"
              onClick={() => setFilterDiff('advanced')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                filterDiff === 'advanced'
                  ? 'bg-rose-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              고급 ({mistakes.filter((m) => m.difficulty === 'advanced').length})
            </button>
          </div>

          {/* Search box & Retry / Clear Actions */}
          <div className="flex items-center gap-2 flex-1 sm:flex-initial justify-end">
            <div className="relative min-w-[180px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="선수, 클럽, 국적 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {filteredMistakes.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  onStartRetrySession(filteredMistakes);
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>오답 다시 풀기 ({Math.min(10, filteredMistakes.length)}문제)</span>
              </button>
            )}

            {mistakes.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('오답노트에 저장된 모든 선수를 삭제하시겠습니까?')) {
                    onClearAll();
                  }
                }}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-800/60 transition"
                title="오답노트 전체 비우기"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Content Body List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {filteredMistakes.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <div className="w-16 h-16 rounded-full bg-slate-800/60 border border-slate-700/60 flex items-center justify-center mb-3 text-slate-500">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-200 mb-1">
                {mistakes.length === 0 ? '저장된 오답이 없습니다!' : '검색 결과가 없습니다.'}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm">
                {mistakes.length === 0
                  ? '퀴즈를 풀다가 틀린 문제는 자동으로 이곳 오답노트에 저장되어 언제든 다시 학습할 수 있습니다.'
                  : '다른 검색어나 난이도 탭을 선택해보세요.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredMistakes.map((m) => {
                const diffInfo = DIFFICULTY_INFO[m.difficulty];
                // Mock player object for PlayerImage
                const dummyPlayer = {
                  id: m.playerId,
                  name: m.playerName,
                  nameEn: m.playerNameEn,
                  imageUrl: m.playerImageUrl,
                  difficulty: m.difficulty,
                  nationality: m.nationality,
                  position: (m.position as 'FW' | 'MF' | 'DF' | 'GK') || 'FW',
                  positionDetail: m.position,
                  club: m.club,
                  era: '현역',
                  highlight: m.highlight,
                };

                return (
                  <div
                    key={m.id}
                    className="relative bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all flex gap-3.5 group"
                  >
                    {/* Player Thumbnail */}
                    <PlayerImage player={dummyPlayer} size="thumb" className="shrink-0" />

                    {/* Information */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-base font-black text-white">{m.playerName}</h4>
                            <span className="text-xs text-slate-400 truncate">{m.playerNameEn}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                            <span>{m.nationality}</span>
                            <span>•</span>
                            <span>{m.club}</span>
                            <span>•</span>
                            <span className="text-slate-300 font-semibold">{m.position}</span>
                          </div>
                        </div>

                        {/* Remove item button */}
                        <button
                          type="button"
                          onClick={() => onRemoveMistake(m.playerId)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition opacity-80 group-hover:opacity-100"
                          title="이 선수 오답노트에서 삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Highlight achievement */}
                      <p className="text-xs text-slate-300 mt-2 bg-slate-900/80 p-2 rounded-xl border border-slate-800/80">
                        {m.highlight}
                      </p>

                      {/* User wrong guesses history & difficulty badge */}
                      <div className="mt-2.5 flex items-center justify-between text-[11px]">
                        <span
                          className={`px-2 py-0.5 rounded-md font-bold border ${diffInfo.badgeColor}`}
                        >
                          {diffInfo.title.split(' ')[0]}
                        </span>

                        <div className="flex items-center gap-2 text-slate-400">
                          {m.userGuessedWrong.length > 0 && (
                            <span className="truncate max-w-[140px]">
                              선택했던 오답: {m.userGuessedWrong.join(', ')}
                            </span>
                          )}
                          <span className="text-rose-400 font-bold">{m.failedCount}회 오답</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>오답노트는 브라우저에 안전하게 자동 저장됩니다.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
