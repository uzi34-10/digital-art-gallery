import React, { useState, useEffect } from 'react';
import { Search, Filter, Sparkles, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ArtworkCard from './components/ArtworkCard';
import ArtworkModal from './components/ArtworkModal';
import ExhibitionCard from './components/ExhibitionCard';
import ArtistCard from './components/ArtistCard';
import StudioModal from './components/StudioModal';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';

import {
  api,
  FALLBACK_ARTWORKS,
  FALLBACK_CATEGORIES,
  FALLBACK_EXHIBITIONS,
  FALLBACK_ARTISTS,
} from './api';

export default function App() {
  const [activeTab, setActiveTab] = useState('explore'); // 'explore', 'exhibitions', 'artists'
  const [user, setUser] = useState(null);
  const [health, setHealth] = useState(null);

  // Data states
  const [artworks, setArtworks] = useState(FALLBACK_ARTWORKS);
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [exhibitions, setExhibitions] = useState(FALLBACK_EXHIBITIONS);
  const [artists, setArtists] = useState(FALLBACK_ARTISTS);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modals state
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isStudioOpen, setIsStudioOpen] = useState(false);

  // Toast notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Initial load: User session, Health check, API Data fetch
  useEffect(() => {
    const currentUser = api.auth.getCurrentUser();
    if (currentUser) setUser(currentUser);

    // Health check
    api.health.check().then((h) => setHealth(h));

    // Fetch live categories
    api.categories.getAll()
      .then((data) => {
        if (data && data.length > 0) setCategories(data);
      })
      .catch(() => {});

    // Fetch live artists
    api.artists.getAll()
      .then((data) => {
        if (data && data.length > 0) setArtists(data);
      })
      .catch(() => {});

    // Fetch live exhibitions
    api.exhibitions.getAll()
      .then((data) => {
        if (data && data.length > 0) setExhibitions(data);
      })
      .catch(() => {});

    // Fetch live artworks
    api.artworks.getAll()
      .then((data) => {
        if (data && data.length > 0) setArtworks(data);
      })
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    api.auth.logout();
    setUser(null);
    showToast('Signed out successfully.');
  };

  const handleAuthSuccess = (u) => {
    setUser(u);
    showToast(`Welcome, ${u.name}! Signed in as ${u.role}.`);
  };

  // Filter artworks by search and category
  const filteredArtworks = artworks.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const itemCatId = item.category?._id || item.category;
    const matchesCategory = selectedCategory === 'all' || itemCatId === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* Toast Banner */}
      {toast && (
        <div className="fixed top-24 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl text-xs font-semibold animate-in slide-in-from-top-4">
          {toast.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        health={health}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onOpenStudio={() => setIsStudioOpen(true)}
      />

      {/* Hero Section */}
      <Hero
        onExploreClick={() => {
          setActiveTab('explore');
          window.scrollTo({ top: 600, behavior: 'smooth' });
        }}
        onOpenAuth={() => setIsAuthOpen(true)}
        user={user}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Tab 1: Explore Artworks */}
        {activeTab === 'explore' && (
          <section>
            
            {/* Search and Category Filter Controls */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
              
              {/* Search Bar */}
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search artworks, creators, concepts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  All Genres
                </button>
                {categories.map((c) => (
                  <button
                    key={c._id}
                    onClick={() => setSelectedCategory(c._id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === c._id
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {c.categoryName}
                  </button>
                ))}
              </div>
            </div>

            {/* Artworks Grid */}
            {filteredArtworks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredArtworks.map((art) => (
                  <ArtworkCard
                    key={art._id}
                    artwork={art}
                    onSelect={(artwork) => setSelectedArtwork(artwork)}
                  />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center rounded-3xl bg-slate-900/30 border border-slate-800">
                <Filter className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white mb-1">No Artworks Found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                  We couldn't find any artwork matching your filter criteria. Try adjusting your search query.
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Reset Filters
                </button>
              </div>
            )}

          </section>
        )}

        {/* Tab 2: Exhibitions */}
        {activeTab === 'exhibitions' && (
          <section>
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">Curated Pavilions</h2>
              <p className="text-sm text-slate-400">Step into thematic virtual exhibitions gathering boundary-pushing creators</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {exhibitions.map((ex) => (
                <ExhibitionCard
                  key={ex._id}
                  exhibition={ex}
                  onExploreExhibition={() => {
                    setActiveTab('explore');
                    showToast(`Viewing featured works from ${ex.exhibitionName}`);
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {/* Tab 3: Artists */}
        {activeTab === 'artists' && (
          <section>
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">Featured Creators</h2>
              <p className="text-sm text-slate-400">Discover visionary artists sculpting the digital renaissance</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {artists.map((artist) => (
                <ArtistCard
                  key={artist._id}
                  artist={artist}
                  onSelectArtist={() => {
                    setSearchQuery(artist.artistName);
                    setActiveTab('explore');
                  }}
                />
              ))}
            </div>
          </section>
        )}

      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <ArtworkModal
        artwork={selectedArtwork}
        onClose={() => setSelectedArtwork(null)}
        onPurchaseSuccess={(msg) => showToast(msg)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <StudioModal
        isOpen={isStudioOpen}
        onClose={() => setIsStudioOpen(false)}
        user={user}
        categories={categories}
        artists={artists}
        onSuccess={() => {
          showToast('Gallery catalog updated!');
          api.artworks.getAll().then((data) => { if (data?.length) setArtworks(data); });
          api.categories.getAll().then((data) => { if (data?.length) setCategories(data); });
        }}
      />

    </div>
  );
}
