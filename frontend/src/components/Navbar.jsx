import React from 'react';
import { Palette, Sparkles, User, LogOut, PlusCircle, Activity } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, user, onOpenAuth, onLogout, onOpenStudio, health }) {
  const isHealthy = health?.status === 'ok';

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('explore')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-300">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                AURA
              </span>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Gallery
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Digital Art & Exhibitions</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-slate-800">
          {[
            { id: 'explore', label: 'Explore Art' },
            { id: 'exhibitions', label: 'Exhibitions' },
            { id: 'artists', label: 'Curators & Artists' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          
          {/* Health indicator pill */}
          <div 
            title={health?.database?.status ? `API ${health.status} • DB ${health.database.status}` : 'API Status'}
            className="hidden sm:flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800"
          >
            <span className={`w-2 h-2 rounded-full animate-pulse ${isHealthy ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            <span className="text-slate-300">
              {isHealthy ? 'Live API' : 'Edge Mode'}
            </span>
          </div>

          {/* Create Button (Admin or Artist) */}
          {user && (user.role === 'admin' || user.role === 'artist') && (
            <button
              onClick={onOpenStudio}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white shadow-lg shadow-pink-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Studio</span>
            </button>
          )}

          {/* User Profile / Auth Button */}
          {user ? (
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs uppercase border border-indigo-500/30">
                {user.name?.charAt(0) || 'U'}
              </div>
              <div className="hidden lg:block text-left pr-2">
                <p className="text-xs font-semibold text-slate-200 leading-tight">{user.name}</p>
                <p className="text-[10px] text-indigo-400 uppercase tracking-wider font-semibold">{user.role}</p>
              </div>
              <button
                onClick={onLogout}
                title="Sign out"
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <User className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
