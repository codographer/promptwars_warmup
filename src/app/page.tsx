'use client';

import React, { useState } from 'react';
import MealPlannerForm from '@/components/MealPlannerForm';
import MealPlanResults from '@/components/MealPlanResults';
import AuthGuard from '@/components/AuthGuard';
import { ChefHat, HelpCircle, UtensilsCrossed, LogOut } from 'lucide-react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (formData: { dayDescription: string; budget: number; dietConstraints: string }) => {
    setIsLoading(true);
    setError(null);
    setPlan(null);

    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate meal plan');
      }

      setPlan(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong while generating the plan.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('cooking_todo_auth');
    window.location.reload();
  };

  return (
    <AuthGuard>
      <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center py-12 px-4 md:px-8 relative overflow-hidden">
        
        {/* Background decoration elements */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-orange-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-15%] w-[600px] h-[600px] rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />

        <div className="w-full max-w-5xl z-10 space-y-10">
          
          {/* Header */}
          <header className="flex flex-col items-center text-center space-y-4 relative">
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="absolute top-0 right-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/50 text-slate-400 hover:text-white hover:border-slate-700 text-xs transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>

            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <ChefHat className="w-4 h-4" />
              AI Chef Assistant
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400">
              Daily Cooking To-Do Planner
            </h1>
            <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
              Generate customized meal schedules, step-by-step grocery budgets, and smart ingredient substitutions matched precisely to your schedule constraints.
            </p>
          </header>

          {/* Form panel */}
          <section className="max-w-3xl mx-auto w-full">
            <MealPlannerForm onGenerate={handleGenerate} isLoading={isLoading} />
          </section>

          {/* Error message */}
          {error && (
            <div className="max-w-3xl mx-auto p-4 rounded-xl border border-rose-900/60 bg-rose-950/40 text-rose-200 text-sm flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Results display */}
          {plan && (
            <section className="border-t border-slate-900 pt-10">
              <div className="flex items-center gap-3 mb-6">
                <UtensilsCrossed className="w-6 h-6 text-amber-500" />
                <h2 className="text-2xl font-bold text-white tracking-wide">Your Generated Cooking Plan</h2>
              </div>
              <MealPlanResults plan={plan} />
            </section>
          )}

        </div>
      </main>
    </AuthGuard>
  );
}
