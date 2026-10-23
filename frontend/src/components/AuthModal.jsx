import React, { useState } from 'react';
import { X, Lock, Mail, User, Shield, AlertCircle } from 'lucide-react';
import { api } from '../api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('user');
  const [adminSecret, setAdminSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegister) {
        const payload = { name, email, password, role };
        if (role === 'admin' && adminSecret) {
          payload.adminSecret = adminSecret;
        }
        const data = await api.auth.register(payload);
        onAuthSuccess(data?.data?.user);
      } else {
        const data = await api.auth.login(email, password);
        onAuthSuccess(data?.data?.user);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto mb-3 border border-indigo-500/30">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {isRegister ? 'Create Gallery Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isRegister ? 'Join as a collector, creator, or curator' : 'Sign in to access your collection and studio'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Leonardo Rivera"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Platform Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value="user">Art Collector / Member</option>
                  <option value="artist">Digital Artist / Creator</option>
                  <option value="admin">Gallery Administrator</option>
                </select>
              </div>

              {role === 'admin' && (
                <div>
                  <label className="block text-xs font-semibold text-amber-300 mb-1 flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5" />
                    Admin Passphrase (Required)
                  </label>
                  <input
                    type="password"
                    value={adminSecret}
                    onChange={(e) => setAdminSecret(e.target.value)}
                    placeholder="Enter gallery_admin_secret_key"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-amber-500/40 text-white text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/30 transition-all mt-3 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        {/* Switch Mode */}
        <div className="text-center mt-5 pt-4 border-t border-slate-800/80">
          <p className="text-xs text-slate-400">
            {isRegister ? 'Already have an account?' : "Don't have an account yet?"}{' '}
            <button
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              className="text-indigo-400 hover:text-indigo-300 font-bold ml-1"
            >
              {isRegister ? 'Sign In' : 'Register Now'}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
