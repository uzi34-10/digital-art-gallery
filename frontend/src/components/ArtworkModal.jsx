import React, { useState } from 'react';
import { X, ExternalLink, Check, ShoppingBag, ShieldCheck, Calendar, User } from 'lucide-react';

export default function ArtworkModal({ artwork, onClose, onPurchaseSuccess }) {
  const [purchased, setPurchased] = useState(false);

  if (!artwork) return null;

  const imageSrc = artwork.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';
  const artistName = artwork.artistId?.artistName || artwork.artistName || 'Featured Artist';
  const artistBio = artwork.artistId?.bio || 'International digital artist focused on generative spatial environments.';
  const categoryName = artwork.category?.categoryName || artwork.categoryName || 'Digital Art';

  const handlePurchase = () => {
    setPurchased(true);
    setTimeout(() => {
      onPurchaseSuccess?.(`Acquired "${artwork.title}"! Provenance certificate generated.`);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl shadow-black/80 flex flex-col md:flex-row overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-950/70 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Preview (Left) */}
        <div className="md:w-1/2 relative min-h-[320px] md:min-h-full bg-slate-950">
          <img
            src={imageSrc}
            alt={artwork.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-slate-300 bg-slate-950/80 backdrop-blur-md p-2.5 rounded-2xl border border-slate-800">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Verified Authenticity
            </span>
            <span className="font-mono text-slate-400">ID: {artwork._id?.substring(0, 8)}...</span>
          </div>
        </div>

        {/* Info Column (Right) */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            {/* Category */}
            <div className="mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {categoryName}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 leading-tight">
              {artwork.title}
            </h2>

            {/* Artist */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/40 border border-slate-800 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center font-bold text-white text-sm">
                {artistName.charAt(0)}
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Creator</p>
                <h4 className="text-sm font-bold text-white">{artistName}</h4>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Curator Notes</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                {artwork.description || 'No curator notes provided for this edition.'}
              </p>
            </div>

            {/* Artist Bio */}
            <div className="mb-6 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <h4 className="text-xs font-semibold text-slate-400 mb-1">About the Artist</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{artistBio}</p>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-6 border-t border-slate-800/80">
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <span className="text-xs text-slate-400 block font-medium">Acquisition Price</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                  ${typeof artwork.price === 'number' ? artwork.price.toLocaleString() : '1,250'}
                </span>
              </div>
              <span className="text-xs text-slate-400">Includes NFT & Physical Certificate</span>
            </div>

            <button
              onClick={handlePurchase}
              disabled={purchased}
              className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-xl transition-all ${
                purchased
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white shadow-indigo-600/25 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {purchased ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Ownership Transferred!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span>Acquire Artwork</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
