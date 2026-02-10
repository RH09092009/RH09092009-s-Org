
import React, { useState, useCallback } from 'react';
import YoutubePlayer from './components/YoutubePlayer';
import AnalysisDisplay from './components/AnalysisDisplay';
import { analyzeYouTubeVideo } from './services/geminiService';
import { AnalysisState } from './types';

function App() {
  const [urlInput, setUrlInput] = useState('');
  const [activeUrl, setActiveUrl] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisState>({
    isLoading: false,
    error: null,
    data: null
  });

  const handlePlayAndAnalyze = useCallback(async () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    
    // Immediate video playback feedback (Python-like responsiveness)
    setActiveUrl(trimmed);
    
    // Start AI analysis concurrently
    setAnalysis({ isLoading: true, error: null, data: null });
    
    try {
      const result = await analyzeYouTubeVideo(trimmed);
      setAnalysis({ isLoading: false, error: null, data: result });
    } catch (err: any) {
      setAnalysis({ 
        isLoading: false, 
        error: err.message, 
        data: null 
      });
    }
  }, [urlInput]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePlayAndAnalyze();
    }
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-indigo-500/30">
      {/* VEO Top Navigation */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/50 px-6 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 shrink-0">
            <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-[0_8px_30px_rgb(79,70,229,0.3)] border border-white/10 group">
              <svg className="w-7 h-7 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-white">VEO <span className="text-indigo-500 font-light italic">Core</span></h1>
              <p className="text-[9px] text-slate-500 uppercase tracking-[0.4em] font-bold">Analysis Terminal v1.4</p>
            </div>
          </div>

          <div className="flex w-full md:w-auto gap-3">
            <div className="relative flex-1 md:w-[500px]">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Paste YouTube Link (Shorts, Watch, Embed...)"
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-sm pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600 font-medium"
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 015.656 0l4 4a4 4 0 11-5.656 5.656l-1.102-1.101" />
              </svg>
            </div>
            <button
              onClick={handlePlayAndAnalyze}
              disabled={analysis.isLoading || !urlInput}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-700 px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 active:scale-95 shrink-0"
            >
              {analysis.isLoading ? 'Analysing...' : 'Play'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto px-6 mt-10">
        {!activeUrl ? (
          <div className="max-w-3xl mx-auto py-32 text-center space-y-8 animate-in fade-in zoom-in duration-1000">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full"></div>
              <div className="relative w-24 h-24 bg-slate-900 rounded-[2.5rem] mx-auto flex items-center justify-center border border-slate-800 shadow-2xl">
                 <svg className="w-12 h-12 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-white tracking-tight uppercase">Ready to Initialize</h2>
              <p className="text-slate-500 text-lg max-w-xl mx-auto font-medium">
                The VEO System is powered by <span className="text-slate-300">Gemini 3 Flash</span>. Input a video URL to begin real-time analysis.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Player Column */}
            <div className="lg:sticky lg:top-36 space-y-8">
              <YoutubePlayer url={activeUrl} />
              
              {/* System Stats Card */}
              <div className="p-6 bg-slate-900/50 rounded-3xl border border-slate-800 shadow-inner backdrop-blur-sm">
                 <div className="flex items-center gap-3 mb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grounding Engine: Active</span>
                 </div>
                 <div className="space-y-3">
                   <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-500">SECURE_TUNNEL</span>
                      <span className="text-emerald-500">CONNECTED</span>
                   </div>
                   <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full w-[85%] animate-[shimmer_2s_infinite]"></div>
                   </div>
                   <p className="text-[10px] text-slate-600 font-mono italic">
                     Analyzing audio spectrogram and search context...
                   </p>
                 </div>
              </div>
            </div>

            {/* Analysis Column */}
            <div className="space-y-8">
              {analysis.isLoading && (
                <div className="flex flex-col items-center justify-center p-20 bg-slate-900/20 rounded-[3rem] border border-slate-800 border-dashed animate-pulse">
                  <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-6"></div>
                  <p className="text-slate-400 font-black text-xs uppercase tracking-[0.3em]">Processing Summary...</p>
                </div>
              )}

              {analysis.error && (
                <div className="p-8 bg-red-900/10 border border-red-900/30 rounded-[2.5rem] flex gap-6 animate-in zoom-in-95">
                  <div className="w-12 h-12 bg-red-900/20 rounded-2xl flex items-center justify-center text-red-500 shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-red-500 font-black uppercase text-sm tracking-widest mb-1">Signal Interrupt</h3>
                    <p className="text-slate-400 text-sm font-medium">{analysis.error}</p>
                    <button 
                      onClick={handlePlayAndAnalyze}
                      className="mt-4 text-[10px] font-black uppercase tracking-widest text-white border border-white/10 px-4 py-2 rounded-lg hover:bg-white/5"
                    >
                      Retry Analysis
                    </button>
                  </div>
                </div>
              )}

              {analysis.data && <AnalysisDisplay analysis={analysis.data} />}
            </div>
          </div>
        )}
      </main>

      {/* System Footer Bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-slate-950/80 backdrop-blur-md border-t border-slate-800/50 py-3 px-6 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
              <span className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em]">VEO System Stable</span>
            </div>
            <span className="h-4 w-px bg-slate-800"></span>
            <span className="text-[9px] text-slate-600 font-mono">LATENCY: 42MS</span>
          </div>
          <div className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.4em]">
            © 2024 VEO CORE SYSTEM
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
