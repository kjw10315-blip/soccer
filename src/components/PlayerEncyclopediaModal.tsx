import React, { useState } from 'react';
import { Player, Difficulty } from '../types/quiz';
import { ALL_PLAYERS, DIFFICULTY_INFO } from '../data/quizManager';
import { PlayerImage } from './PlayerImage';
import { Search, X, Users, Shield, Sparkles, Filter } from 'lucide-react';

interface PlayerEncyclopediaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlayerEncyclopediaModal: React.FC<PlayerEncyclopediaModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('beginner');
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState<'ALL' | 'FW' | 'MF' | 'DF' | 'GK'>('ALL');

  if (!isOpen) return null;

  const currentPool = ALL_PLAYERS[selectedDifficulty] || [];

  const filteredPlayers = currentPool.filter((p) => {
    const matchesPos = positionFilter === 'ALL' || p.position === positionFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.club.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nationality.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPos && matchesSearch;
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/80 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">300+ 축구 선수 도감</h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  총 300명 등록
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                초·중·고급 난이도별 100명의 선수 프로필과 주요 업적을 사전 학습해보세요.
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

        {/* Difficulty Selector Tabs */}
        <div className="px-6 py-3.5 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {(['beginner', 'intermediate', 'advanced'] as Difficulty[]).map((diff) => {
              const meta = DIFFICULTY_INFO[diff];
              const isSelected = selectedDifficulty === diff;
              return (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md'
                      : 'bg-slate-950/80 hover:bg-slate-800 text-slate-400 border border-slate-800'
                  }`}
                >
                  <span>{meta.icon}</span>
                  <span>{meta.title.split(' ')[0]}</span>
                  <span className="text-[11px] opacity-80">(100명)</span>
                </button>
              );
            })}
          </div>

          {/* Position & Search Filters */}
          <div className="flex items-center gap-2 flex-1 sm:flex-initial justify-end">
            <div className="flex items-center p-0.5 bg-slate-950 rounded-lg border border-slate-800 text-[11px] font-bold">
              {(['ALL', 'FW', 'MF', 'DF', 'GK'] as const).map((pos) => (
                <button
                  key={pos}
                  type="button"
                  onClick={() => setPositionFilter(pos)}
                  className={`px-2 py-1 rounded-md transition ${
                    positionFilter === pos
                      ? 'bg-slate-800 text-emerald-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {pos === 'ALL' ? '전체' : pos}
                </button>
              ))}
            </div>

            <div className="relative min-w-[160px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="선수, 클럽 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredPlayers.map((player) => (
              <div
                key={player.id}
                className="relative bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-2xl p-3.5 transition flex gap-3 group"
              >
                <PlayerImage player={player} size="thumb" className="shrink-0" />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-base font-bold text-white truncate">{player.name}</h4>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-emerald-400">
                      {player.position}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 truncate block">{player.nameEn}</span>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                    <span>{player.nationality}</span>
                    <span>•</span>
                    <span className="truncate">{player.club}</span>
                  </div>

                  <p className="text-[11px] text-slate-300 mt-1.5 line-clamp-2 bg-slate-900/60 p-1.5 rounded-lg border border-slate-800/60">
                    {player.highlight}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {filteredPlayers.length === 0 && (
            <div className="text-center py-16 text-slate-400 text-sm">
              일치하는 선수를 찾을 수 없습니다.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>
            {DIFFICULTY_INFO[selectedDifficulty].title} - {filteredPlayers.length}명 표시 중
          </span>
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
