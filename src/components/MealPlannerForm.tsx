'use client';

import React, { useState } from 'react';
import { Calendar, DollarSign, Sparkles, ShieldAlert } from 'lucide-react';

interface MealPlannerFormProps {
  onGenerate: (data: { dayDescription: string; budget: number; dietConstraints: string }) => void;
  isLoading: boolean;
}

export default function MealPlannerForm({ onGenerate, isLoading }: MealPlannerFormProps) {
  const [dayDescription, setDayDescription] = useState('');
  const [budget, setBudget] = useState('20');
  const [dietConstraints, setDietConstraints] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dayDescription.trim() || !budget) return;
    onGenerate({
      dayDescription,
      budget: parseFloat(budget),
      dietConstraints,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl shadow-2xl">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-4">
        <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
        <h2 className="text-xl font-bold text-white tracking-wide">Plan Your Day & Meals</h2>
      </div>

      <div className="space-y-2">
        <label htmlFor="day-desc" className="block text-sm font-medium text-slate-300">
          How is your day looking?
        </label>
        <textarea
          id="day-desc"
          value={dayDescription}
          onChange={(e) => setDayDescription(e.target.value)}
          placeholder="e.g., 'Busy office day, no time for lunch prep, working out late, quiet dinner at home'"
          required
          rows={3}
          className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all duration-200"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="budget" className="block text-sm font-medium text-slate-300">
            Daily Budget ($ USD)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
              <DollarSign className="w-4 h-4" />
            </span>
            <input
              id="budget"
              type="number"
              min="1"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 pl-9 pr-4 py-3 text-sm text-slate-100 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all duration-200"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="constraints" className="block text-sm font-medium text-slate-300">
            Diet Preferences / Allergies
          </label>
          <input
            id="constraints"
            type="text"
            value={dietConstraints}
            onChange={(e) => setDietConstraints(e.target.value)}
            placeholder="e.g., 'Vegetarian, High-Protein, Nut-free'"
            className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all duration-200"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !dayDescription.trim()}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 py-3.5 px-4 text-sm font-semibold text-white shadow-lg shadow-orange-950/20 transition-all duration-200 hover:scale-[1.01] disabled:opacity-50 disabled:pointer-events-none"
      >
        {isLoading ? (
          <>
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            Generating Cooking Plan...
          </>
        ) : (
          <>
            <Calendar className="w-5 h-5" />
            Generate My Cooking Plan
          </>
        )}
      </button>
    </form>
  );
}
