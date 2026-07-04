'use client';

import React, { useState, useEffect } from 'react';
import { LogIn, KeyRound, Sparkles, ChefHat } from 'lucide-react';

const DUMMY_EMAIL = 'chef@example.com';
const DUMMY_PASSWORD = 'cookingtime';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const session = localStorage.getItem('cooking_todo_auth');
    if (session === 'true') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === DUMMY_EMAIL && password === DUMMY_PASSWORD) {
      localStorage.setItem('cooking_todo_auth', 'true');
      setIsAuthenticated(true);
      setError(null);
    } else {
      setError('Invalid email or password.');
    }
  };

  // Wait for client checking before rendering to prevent SSR hydration mismatch
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-100">
        <span className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center py-12 px-4 relative overflow-hidden">
        {/* Background glow decoration */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-orange-500/10 blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md z-10 space-y-6">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-2">
              <ChefHat className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white">Welcome Chef!</h1>
            <p className="text-sm text-slate-400">Log in to generate your customized daily cooking plans.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl shadow-2xl">
            {error && (
              <div className="p-3 rounded-lg border border-rose-900/60 bg-rose-950/40 text-rose-200 text-xs">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label htmlFor="email" className="block text-xs font-medium text-slate-400">Email Address</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="chef@example.com"
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block text-xs font-medium text-slate-400">Password</label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.01]"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
          </form>

          <p className="text-center text-xs text-slate-500">
            Note: Dummy credentials for testing are available in the repository's <code className="bg-slate-900 px-1 py-0.5 rounded text-slate-400 font-mono">README.md</code> file.
          </p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
