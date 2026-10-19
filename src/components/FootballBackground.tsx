import React, { memo } from 'react';

interface FootballBackgroundProps {
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export const FootballBackground: React.FC<FootballBackgroundProps> = memo(({ difficulty }) => {
  // Theme color accents depending on difficulty
  const accentGlow =
    difficulty === 'advanced'
      ? 'rgba(244, 63, 94, 0.18)'
      : difficulty === 'intermediate'
      ? 'rgba(245, 158, 11, 0.18)'
      : 'rgba(16, 185, 129, 0.22)';

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none">
      {/* Base deep stadium night sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-[#0a1120] to-[#040914]" />

      {/* Stadium Crowd & Floodlight Night Panorama Texture */}
      <div
        className="absolute inset-0 opacity-25 mix-blend-screen bg-cover bg-center filter contrast-125 saturate-150"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 20%, rgba(255,255,255,0.15) 0%, transparent 60%),
            url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1920&q=80')`,
        }}
      />

      {/* Football Players Action Silhouettes Layer */}
      <div className="absolute inset-0 opacity-20 overflow-hidden">
        {/* Left Striker Bicycle Kick Silhouette */}
        <svg
          className="absolute -left-12 bottom-12 w-96 h-96 text-emerald-500/30 transform -rotate-6 animate-pulse"
          style={{ animationDuration: '6s' }}
          viewBox="0 0 200 200"
          fill="currentColor"
        >
          <path d="M100 20 C108 20 115 27 115 35 C115 43 108 50 100 50 C92 50 85 43 85 35 C85 27 92 20 100 20 Z M120 60 L140 85 L160 80 L145 95 L125 75 L105 110 L135 140 L120 155 L90 120 L75 145 L50 185 L35 175 L65 130 L85 90 L80 65 Z" />
        </svg>

        {/* Right Celebrating Player Silhouette with open arms */}
        <svg
          className="absolute -right-8 bottom-4 w-[420px] h-[420px] text-teal-400/20 transform"
          viewBox="0 0 200 200"
          fill="currentColor"
        >
          <path d="M100 15 C108 15 115 22 115 30 C115 38 108 45 100 45 C92 45 85 38 85 30 C85 22 92 15 100 15 Z M70 55 L35 40 L25 55 L65 75 L85 65 L115 65 L135 75 L175 55 L165 40 L130 55 L115 100 L125 150 L145 195 L125 195 L105 145 L95 145 L75 195 L55 195 L75 150 L85 100 Z" />
        </svg>

        {/* Center Deep Dribbling Player Vector */}
        <svg
          className="absolute left-1/2 -translate-x-1/2 bottom-0 w-80 h-80 text-blue-500/15"
          viewBox="0 0 200 200"
          fill="currentColor"
        >
          <path d="M100 25 C107 25 112 30 112 37 C112 44 107 49 100 49 C93 49 88 44 88 37 C88 30 93 25 100 25 Z M108 55 L125 80 L145 75 L135 90 L115 88 L100 110 L115 150 L95 190 L80 185 L95 145 L75 120 L55 125 L45 110 L75 100 L90 60 Z" />
          <circle cx="150" cy="180" r="14" fill="currentColor" opacity="0.4" />
        </svg>
      </div>

      {/* Football Pitch Graphic Lines (Center Circle, Penalty Box Lines) */}
      <svg
        className="absolute inset-x-0 bottom-0 w-full h-[65vh] opacity-20 pointer-events-none"
        preserveAspectRatio="none"
        viewBox="0 0 1000 600"
      >
        <defs>
          <linearGradient id="pitchLineGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#065f46" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#047857" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Field boundary & perspective lines */}
        <polygon points="100,600 250,200 750,200 900,600" fill="none" stroke="url(#pitchLineGrad)" strokeWidth="3" />
        {/* Halfway line */}
        <line x1="200" y1="360" x2="800" y2="360" stroke="#10b981" strokeWidth="2.5" strokeDasharray="6 4" opacity="0.6" />
        {/* Center circle perspective oval */}
        <ellipse cx="500" cy="360" rx="140" ry="45" fill="none" stroke="#10b981" strokeWidth="2.5" opacity="0.7" />
        <circle cx="500" cy="360" r="4" fill="#34d399" />
        {/* Goal Area Box */}
        <polygon points="350,600 400,480 600,480 650,600" fill="rgba(16,185,129,0.03)" stroke="#10b981" strokeWidth="2" opacity="0.6" />
        {/* Penalty spot */}
        <circle cx="500" cy="520" r="5" fill="#34d399" />
        {/* Penalty arc */}
        <path d="M 440,480 A 65 30 0 0,1 560,480" fill="none" stroke="#10b981" strokeWidth="2" opacity="0.5" />
      </svg>

      {/* Stadium Floodlights & Atmospheric Glow */}
      <div
        className="absolute top-0 left-1/4 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: accentGlow }}
      />
      <div
        className="absolute top-0 right-1/4 translate-x-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: accentGlow }}
      />
      <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-emerald-950/20 via-transparent to-transparent pointer-events-none" />

      {/* Subtle floating soccer ball pattern watermark */}
      <div className="absolute top-12 left-10 opacity-5">
        <svg className="w-48 h-48 text-white" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <polygon points="12,7 15,10 14,14 10,14 9,10" fill="currentColor" />
          <line x1="12" y1="7" x2="12" y2="2" stroke="currentColor" strokeWidth="1.5" />
          <line x1="15" y1="10" x2="20" y2="8" stroke="currentColor" strokeWidth="1.5" />
          <line x1="14" y1="14" x2="18" y2="19" stroke="currentColor" strokeWidth="1.5" />
          <line x1="10" y1="14" x2="6" y2="19" stroke="currentColor" strokeWidth="1.5" />
          <line x1="9" y1="10" x2="4" y2="8" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="absolute top-24 right-12 opacity-5">
        <svg className="w-56 h-56 text-white" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <polygon points="12,7 15,10 14,14 10,14 9,10" fill="currentColor" />
          <line x1="12" y1="7" x2="12" y2="2" stroke="currentColor" strokeWidth="1.5" />
          <line x1="15" y1="10" x2="20" y2="8" stroke="currentColor" strokeWidth="1.5" />
          <line x1="14" y1="14" x2="18" y2="19" stroke="currentColor" strokeWidth="1.5" />
          <line x1="10" y1="14" x2="6" y2="19" stroke="currentColor" strokeWidth="1.5" />
          <line x1="9" y1="10" x2="4" y2="8" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Vignette border */}
      <div className="absolute inset-0 bg-radial-vignette opacity-80" />
    </div>
  );
});

FootballBackground.displayName = 'FootballBackground';
