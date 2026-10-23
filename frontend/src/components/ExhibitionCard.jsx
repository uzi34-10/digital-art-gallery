import React from 'react';
import { Calendar, Layers, ArrowUpRight } from 'lucide-react';

export default function ExhibitionCard({ exhibition, onExploreExhibition }) {
  const startDate = new Date(exhibition.startDate || '2026-10-15').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const endDate = new Date(exhibition.endDate || '2026-11-30').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const banner = exhibition.banner || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80';
  const artworkCount = exhibition.artworkIds?.length || 3;

  return (
    <div className="group relative rounded-3xl overflow-hidden bg-slate-900/60 border border-slate-800 hover:border-violet-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/10 flex flex-col">
      
      {/* Banner */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
        <img
          src={banner}
          alt={exhibition.exhibitionName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
            ● Live Pavilion
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="p-6 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-2">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span>{startDate} – {endDate}</span>
          </div>

          <h3 className="text-xl font-bold text-white group-hover:text-violet-300 transition-colors mb-3">
            {exhibition.exhibitionName}
          </h3>

          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-6">
            Curated selection of high-fidelity synthetic and generative art pieces exploring dynamic spatial algorithms.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
            <Layers className="w-4 h-4 text-violet-400" />
            {artworkCount} Featured Pieces
          </span>

          <button
            onClick={() => onExploreExhibition(exhibition)}
            className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition-all group-hover:bg-violet-600"
          >
            <span>Enter Pavilion</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
}
