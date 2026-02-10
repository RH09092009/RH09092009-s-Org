
import React from 'react';
import { VideoAnalysis } from '../types';

interface AnalysisDisplayProps {
  analysis: VideoAnalysis;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Summary Section */}
      <section className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-6 bg-indigo-500 rounded-full"></div>
          <h2 className="text-xl font-bold text-white">AI Summary</h2>
        </div>
        <p className="text-slate-300 leading-relaxed text-lg">
          {analysis.summary}
        </p>
      </section>

      {/* Key Takeaways */}
      {analysis.keyPoints.length > 0 && (
        <section className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-6 bg-emerald-500 rounded-full"></div>
            <h2 className="text-xl font-bold text-white">Key Takeaways</h2>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.keyPoints.map((point, idx) => (
              <li key={idx} className="flex gap-3 bg-slate-900/40 p-4 rounded-xl border border-slate-700/50">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-700 text-slate-300 text-xs flex items-center justify-center font-bold">
                  {idx + 1}
                </span>
                <span className="text-slate-300 text-sm leading-snug">{point}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Grounding Context */}
      <section className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-6 bg-amber-500 rounded-full"></div>
          <h2 className="text-xl font-bold text-white">Search Grounding Context</h2>
        </div>
        <div className="prose prose-invert max-w-none text-slate-400 text-sm whitespace-pre-wrap">
          {analysis.context}
        </div>
        
        {analysis.sources.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-700">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Sources & References</h3>
            <div className="flex flex-wrap gap-2">
              {analysis.sources.map((source, idx) => (
                <a
                  key={idx}
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 rounded-lg text-xs text-indigo-400 hover:text-indigo-300 hover:bg-slate-800 border border-slate-700 transition-all"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  {source.title || 'Source'}
                </a>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default AnalysisDisplay;
