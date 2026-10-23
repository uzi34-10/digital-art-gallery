import React from 'react';
import { Palette, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center text-white">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white text-base tracking-tight">AURA Digital Gallery</span>
              <p className="text-xs text-slate-500">Production REST API & Contemporary Art Experience</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <span>Powered by Node.js, Express, MongoDB Atlas & Vercel</span>
            <span className="flex items-center gap-1 text-slate-500">
              Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Digital Curators
            </span>
          </div>

        </div>
      </div>
    </footer>
  );
}
