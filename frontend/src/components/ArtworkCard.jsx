import React, { useState } from 'react';
import { Heart, Eye, Tag } from 'lucide-react';

export default function ArtworkCard({ artwork, onSelect, onLike }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(artwork.likes || Math.floor(Math.random() * 80) + 20);

  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
  };

  const imageSrc = artwork.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
  const artistName = artwork.artistId?.artistName || artwork.artistName || 'Featured Artist';
  const categoryName = artwork.category?.categoryName || artwork.categoryName || 'Digital Art';

  return (
    <div
      onClick={() => onSelect(artwork)}
      className="group relative bg-slate-900/60 rounded-3xl overflow-hidden border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 cursor-pointer flex flex-col"
    >
      {/* Artwork Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
        <img
          src={imageSrc}
          alt={artwork.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30 opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Category Pill */}
        <div className="absolute top-3.5 left-3.5">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-950/80 backdrop-blur-md text-indigo-300 border border-slate-700/60 shadow-lg">
            {categoryName}
          </span>
        </div>

        {/* Like Button */}
        <button
          onClick={handleLike}
          className={`absolute top-3.5 right-3.5 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
            isLiked
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-rose-500/20'
              : 'bg-slate-950/60 text-slate-300 hover:text-white border border-slate-700/60 hover:scale-110'
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Quick View Pill */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900/90 text-white text-xs font-semibold backdrop-blur-md shadow-xl border border-slate-700">
            <Eye className="w-3.5 h-3.5" />
            Inspect Artwork
          </span>
        </div>
      </div>

      {/* Info Body */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-bold text-base text-white group-hover:text-indigo-300 transition-colors line-clamp-1 mb-1">
            {artwork.title}
          </h3>
          <p className="text-xs text-slate-400 font-medium mb-3">
            by <span className="text-slate-200">{artistName}</span>
          </p>
          {artwork.description && (
            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
              {artwork.description}
            </p>
          )}
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Reserve Price</span>
            <span className="text-sm font-bold text-emerald-400">
              {typeof artwork.price === 'number' ? `$${artwork.price.toLocaleString()}` : '$1,250'}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
            <Heart className="w-3 h-3 text-slate-500" />
            <span>{likesCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
