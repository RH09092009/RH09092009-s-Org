
import React, { useMemo } from 'react';

interface YoutubePlayerProps {
  url: string;
}

/**
 * Enhanced extraction logic combining patterns from the user's Python, 
 * HTML, and React snippets for maximum compatibility.
 */
const extractVideoId = (url: string): string | null => {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\s]+)/,
    /(?:youtu\.be\/)([^?\s]+)/,
    /(?:youtube\.com\/embed\/)([^?\s]+)/,
    /(?:youtube\.com\/shorts\/)([^?\s]+)/,
    /(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([^&#]+)/, // From user's HTML snippet
  ];

  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
};

const YoutubePlayer: React.FC<YoutubePlayerProps> = ({ url }) => {
  const videoId = useMemo(() => extractVideoId(url.trim()), [url]);

  if (!videoId) {
    return (
      <div className="w-full aspect-video bg-slate-900 rounded-3xl flex flex-col items-center justify-center border-2 border-dashed border-slate-800 p-8 text-center animate-pulse">
        <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 border border-slate-700 shadow-inner">
          <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          </svg>
        </div>
        <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.3em]">System Standby: Awaiting Link</p>
      </div>
    );
  }

  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-top-4 duration-700">
      {/* VEO SYSTEM BAR */}
      <div className="flex items-center justify-between px-3">
        <div className="flex items-center gap-3">
          <div className="flex space-x-1">
            <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-red-600/40 animate-pulse [animation-delay:0.2s]"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-red-600/20 animate-pulse [animation-delay:0.4s]"></div>
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] drop-shadow-[0_0_5px_rgba(148,163,184,0.5)]">VEO Live Display</span>
        </div>
        <div className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700">
          <code className="text-[9px] text-emerald-400 font-mono">STREAM_SRC: {videoId}</code>
        </div>
      </div>

      {/* VIDEO CONTAINER */}
      <div className="relative group overflow-hidden rounded-[2.5rem] border border-slate-700 bg-black shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        <div className="aspect-video w-full relative z-10">
          <iframe
            className="w-full h-full"
            src={embedUrl}
            title="VEO Media Player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        
        {/* Interaction Overlay */}
        <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none flex items-end p-6">
          <div className="w-full flex justify-between items-center pointer-events-auto">
            <div className="text-[10px] text-white font-bold uppercase tracking-widest opacity-80">
              Session Secured
            </div>
            <button 
              onClick={() => window.open(watchUrl, '_blank')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl text-white text-[10px] font-bold uppercase tracking-tighter transition-all"
            >
              Open Externally
            </button>
          </div>
        </div>
      </div>

      {/* SYSTEM BYPASS (Solves Error 153/Configuration Error) */}
      <div className="bg-slate-900/40 border border-slate-800/50 p-6 rounded-[2rem] shadow-inner backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center justify-center sm:justify-start gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Signal Restricted?
            </h4>
            <p className="text-[11px] text-slate-500 font-medium">
              If the player above shows <span className="text-white font-bold">"Playback on other websites has been disabled"</span>, click the bypass button.
            </p>
          </div>
          
          <button
            onClick={() => window.open(watchUrl, '_blank')}
            className="group relative flex items-center justify-center gap-4 px-8 py-3.5 bg-red-600 hover:bg-red-500 text-white rounded-2xl transition-all shadow-[0_10px_30px_rgba(220,38,38,0.3)] active:scale-95 overflow-hidden shrink-0"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
            </svg>
            <span className="text-xs font-black uppercase tracking-tight">Run VEO Direct Bypass</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default YoutubePlayer;
