import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Flame, Compass } from 'lucide-react';

export default function Hero({ onExploreClick, onOpenAuth, user }) {
  return (
    <div className="relative overflow-hidden pt-12 pb-20 border-b border-slate-800/60 bg-gradient-to-b from-indigo-950/20 via-slate-950 to-slate-950">
      
      {/* Glow gradient blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-pink-500/10 blur-[130px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6 shadow-sm shadow-indigo-500/10">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Next-Generation Digital Curation Platform</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6">
            Where Human Imagination Meets{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
              Digital Mastery
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto">
            Experience museum-grade digital artwork, curated pavilions, and emerging creators. Built with secure authentication, high-throughput APIs, and real-time provenance tracking.
          </p>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onExploreClick}
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
            {!user && (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white font-medium text-sm border border-slate-800 transition-all hover:scale-105 active:scale-95"
              >
                <span>Join as Creator</span>
              </button>
            )}
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 pt-10 border-t border-slate-800/80">
            {[
              { label: 'Curated Artworks', val: '2,400+' },
              { label: 'Verified Artists', val: '380+' },
              { label: 'Virtual Exhibitions', val: '45+' },
              { label: 'API Uptime SLA', val: '99.98%' },
            ].map((stat, i) => (
              <div key={i} className="p-3 rounded-2xl bg-slate-900/40 border border-slate-800/50">
                <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{stat.val}</div>
                <div className="text-xs text-slate-400 mt-1 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
