import React, { useState } from 'react';
import { Player } from '../types/quiz';
import { Shield, Sparkles, ZoomIn, X } from 'lucide-react';

interface PlayerImageProps {
  player: Player;
  size?: 'normal' | 'large' | 'thumb';
  className?: string;
  showZoomButton?: boolean;
}

export const PlayerImage: React.FC<PlayerImageProps> = ({
  player,
  size = 'normal',
  className = '',
  showZoomButton = true,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);

  // Derive club/nationality accent colors for fallback card
  const getInitials = (name: string) => {
    if (!name) return 'FC';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2);
  };

  const dims =
    size === 'large'
      ? 'w-72 h-80 sm:w-80 sm:h-96'
      : size === 'thumb'
      ? 'w-16 h-16 sm:w-20 sm:h-20'
      : 'w-60 h-72 sm:w-72 sm:h-80';

  return (
    <>
      <div
        className={`relative ${dims} rounded-2xl overflow-hidden bg-slate-900/90 border border-slate-700/60 shadow-2xl group flex items-center justify-center ${className}`}
      >
        {/* Loading Spinner Skeleton */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 animate-pulse flex flex-col items-center justify-center gap-3 z-10">
            <div className="w-12 h-12 rounded-full border-2 border-emerald-500/40 border-t-emerald-400 animate-spin" />
            <span className="text-xs text-slate-400 font-medium tracking-wide">선수 사진 로딩 중...</span>
          </div>
        )}

        {/* Real photo if available and not errored */}
        {!hasError ? (
          <img
            src={player.imageUrl}
            alt={player.name}
            className={`w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            loading="eager"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setHasError(true);
              setIsLoading(false);
            }}
          />
        ) : (
          /* High-Fidelity Football Card Fallback */
          <div className="w-full h-full bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 flex flex-col items-center justify-between p-4 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Top row: Position & Flag */}
            <div className="w-full flex items-center justify-between z-10">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {player.position}
              </span>
              <span className="text-xl" title={player.nationality}>
                {player.nationality.slice(-2)}
              </span>
            </div>

            {/* Center: Stylized Player Jersey Silhouette & Number */}
            <div className="relative flex flex-col items-center justify-center my-auto z-10">
              <div className="relative">
                <svg
                  className="w-28 h-28 text-emerald-500/30 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                </svg>
                {player.number && (
                  <span className="absolute inset-0 flex items-center justify-center font-black text-2xl text-emerald-400 font-teko tracking-wider">
                    {player.number}
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-300 mt-2 font-medium tracking-tight">
                {player.club}
              </span>
            </div>

            {/* Bottom: Player Initials Banner */}
            <div className="w-full text-center z-10 border-t border-slate-700/60 pt-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {getInitials(player.nameEn)}
              </span>
            </div>
          </div>
        )}

        {/* Shiny Edge Overlay */}
        <div className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none group-hover:border-emerald-400/40 transition-colors duration-300" />

        {/* Position / Club floating pill on bottom */}
        {size !== 'thumb' && (
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800/80 text-xs">
            <div className="flex items-center gap-1.5 min-w-0">
              <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-slate-200 font-medium truncate">{player.club}</span>
            </div>
            <span className="text-slate-400 text-[11px] shrink-0 font-semibold">{player.position}</span>
          </div>
        )}

        {/* Zoom trigger button */}
        {showZoomButton && !hasError && !isLoading && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(true);
            }}
            className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/60 text-slate-300 hover:text-white hover:bg-black/80 backdrop-blur-sm transition opacity-0 group-hover:opacity-100 focus:opacity-100"
            title="사진 크게 보기"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* High-Resolution Zoom Modal */}
      {isZoomed && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="relative max-w-lg w-full max-h-[85vh] rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 shadow-2xl p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/70 text-white hover:bg-black transition"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={player.imageUrl}
              alt={player.name}
              className="w-full max-h-[70vh] object-contain rounded-xl"
            />
            <div className="p-3 text-center">
              <div className="flex items-center justify-center gap-2 text-slate-300 text-sm">
                <span>{player.nationality}</span>
                <span>•</span>
                <span>{player.club}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
