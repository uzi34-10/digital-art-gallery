import React from 'react';
import { Sparkles, Palette, ArrowUpRight } from 'lucide-react';

export default function ArtistCard({ artist, onSelectArtist }) {
  const avatar = artist.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';

  return (
    <div className="group relative rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-pink-500/50 p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/10 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-950 border border-slate-700/80 group-hover:scale-105 transition-transform">
            <img src={avatar} alt={artist.artistName} className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white group-hover:text-pink-300 transition-colors">
              {artist.artistName}
            </h3>
            <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20 mt-1">
              {artist.specialization}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-6">
          {artist.bio || 'Curated digital artist represented in the permanent digital collection.'}
        </p>
      </div>

      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
        <span className="text-xs text-slate-400 font-medium">
          <span className="text-white font-bold">{artist.artworkCount || 5}</span> Works Cataloged
        </span>
        <button
          onClick={() => onSelectArtist(artist)}
          className="flex items-center gap-1 text-xs font-bold text-pink-400 hover:text-pink-300 transition-colors"
        >
          <span>View Portfolio</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
