import React, { useState } from 'react';
import { X, Plus, Layers, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '../api';

export default function StudioModal({ isOpen, onClose, user, categories, artists, onSuccess }) {
  const [activeTab, setActiveTab] = useState('artwork'); // 'artwork', 'category', 'exhibition'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Artwork Form State
  const [artTitle, setArtTitle] = useState('');
  const [artDesc, setArtDesc] = useState('');
  const [artPrice, setArtPrice] = useState('');
  const [artCat, setArtCat] = useState(categories[0]?._id || '');
  const [artArtist, setArtArtist] = useState(artists[0]?._id || '');
  const [artImage, setArtImage] = useState('');

  // Category Form State
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');

  if (!isOpen) return null;

  const handleCreateArtwork = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.artworks.create({
        title: artTitle,
        description: artDesc,
        price: parseFloat(artPrice),
        category: artCat || categories[0]?._id,
        artistId: artArtist || artists[0]?._id,
        image: artImage || undefined,
      });

      setSuccessMsg('Artwork published successfully!');
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to create artwork');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.categories.create({
        categoryName: catName,
        description: catDesc,
      });

      setSuccessMsg('Category created successfully!');
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Creator & Curator Studio</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Publish new artworks, register categories, and manage exhibitions</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1.5 bg-slate-950/60 rounded-2xl border border-slate-800 mb-6">
          <button
            onClick={() => { setActiveTab('artwork'); setError(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'artwork' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            New Artwork
          </button>
          {user?.role === 'admin' && (
            <button
              onClick={() => { setActiveTab('category'); setError(''); setSuccessMsg(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'category' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              New Category
            </button>
          )}
        </div>

        {/* Alerts */}
        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tab 1: Artwork Form */}
        {activeTab === 'artwork' && (
          <form onSubmit={handleCreateArtwork} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Artwork Title</label>
              <input
                type="text"
                required
                value={artTitle}
                onChange={(e) => setArtTitle(e.target.value)}
                placeholder="e.g. Celestial Continuum #04"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Reserve Price (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={artPrice}
                  onChange={(e) => setArtPrice(e.target.value)}
                  placeholder="e.g. 2400"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
                <select
                  value={artCat}
                  onChange={(e) => setArtCat(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                >
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.categoryName}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Image URL (High-Res Digital Piece)</label>
              <input
                type="url"
                value={artImage}
                onChange={(e) => setArtImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Curator Description</label>
              <textarea
                rows={3}
                value={artDesc}
                onChange={(e) => setArtDesc(e.target.value)}
                placeholder="Details on technique, conceptual inspiration, and digital medium..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/25 transition-all mt-2 disabled:opacity-50"
            >
              {loading ? 'Minting Artwork...' : 'Publish to Gallery'}
            </button>
          </form>
        )}

        {/* Tab 2: Category Form */}
        {activeTab === 'category' && (
          <form onSubmit={handleCreateCategory} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category Name</label>
              <input
                type="text"
                required
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                placeholder="e.g. Kinetic Holograms"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Description</label>
              <textarea
                rows={3}
                value={catDesc}
                onChange={(e) => setCatDesc(e.target.value)}
                placeholder="Description of the category style and artistic genre..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-pink-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white shadow-lg shadow-pink-600/25 transition-all mt-2 disabled:opacity-50"
            >
              {loading ? 'Registering...' : 'Create Category'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
