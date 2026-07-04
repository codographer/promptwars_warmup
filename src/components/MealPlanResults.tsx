'use client';

import React from 'react';
import { CheckCircle2, DollarSign, RefreshCw, AlertCircle, ShoppingCart, ListChecks } from 'lucide-react';

interface Meal {
  name: string;
  prepTime: string;
  instructions: string;
}

interface PlanData {
  meals: {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
  };
  groceryList: Array<{ item: string; estimatedCost: number }>;
  substitutions: Array<{ original: string; substitute: string; reason: string }>;
  budgetFeasibility: {
    totalEstimatedCost: number;
    isFeasible: boolean;
    reasoning: string;
  };
  cookingTodo: Array<{ task: string; timeOfDay: string }>;
}

interface MealPlanResultsProps {
  plan: PlanData;
}

export default function MealPlanResults({ plan }: MealPlanResultsProps) {
  const { meals, groceryList, substitutions, budgetFeasibility, cookingTodo } = plan;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* Budget Summary Card */}
      <div className={`p-6 rounded-2xl border backdrop-blur-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        budgetFeasibility.isFeasible 
          ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-100' 
          : 'bg-amber-950/40 border-amber-800/80 text-amber-100'
      }`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
              budgetFeasibility.isFeasible ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
            }`}>
              {budgetFeasibility.isFeasible ? 'Within Budget' : 'Exceeds Budget Limit'}
            </span>
            <span className="text-sm opacity-80">Estimated Total Cost:</span>
            <span className="font-bold text-lg">${budgetFeasibility.totalEstimatedCost.toFixed(2)}</span>
          </div>
          <p className="text-sm opacity-90 leading-relaxed max-w-2xl">{budgetFeasibility.reasoning}</p>
        </div>
        <div className="flex items-center gap-2 font-semibold">
          {budgetFeasibility.isFeasible ? (
            <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-8 h-8 text-amber-400 shrink-0" />
          )}
        </div>
      </div>

      {/* Meal Plan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(['breakfast', 'lunch', 'dinner'] as const).map((mealType) => {
          const meal = meals[mealType];
          return (
            <div key={mealType} className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl shadow-lg relative flex flex-col justify-between">
              <div>
                <span className="absolute -top-3 left-4 px-3 py-1 bg-amber-500 text-slate-950 text-xs font-bold uppercase rounded-md tracking-wider">
                  {mealType}
                </span>
                <h3 className="text-lg font-bold text-white mt-2 mb-1">{meal.name}</h3>
                <span className="text-xs text-amber-400 font-medium">Prep: {meal.prepTime}</span>
                <p className="text-sm text-slate-300 mt-4 leading-relaxed line-clamp-6 hover:line-clamp-none transition-all duration-300">
                  {meal.instructions}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Checklist and Grocery Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Cooking Schedule / Tasks */}
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-850 pb-3">
            <ListChecks className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-semibold text-white">Cooking To-Do Timeline</h3>
          </div>
          <div className="divide-y divide-slate-800">
            {cookingTodo.map((todo, idx) => (
              <div key={idx} className="py-3 flex items-start gap-3">
                <span className="text-xs font-semibold px-2 py-0.5 bg-slate-800 text-slate-300 rounded shrink-0 mt-0.5">
                  {todo.timeOfDay}
                </span>
                <p className="text-sm text-slate-200">{todo.task}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Grocery & Substitutions */}
        <div className="space-y-6">
          {/* Grocery List */}
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-850 pb-3">
              <ShoppingCart className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-semibold text-white">Grocery Shopping List</h3>
            </div>
            <div className="max-h-60 overflow-y-auto divide-y divide-slate-800 pr-1">
              {groceryList.map((grocery, idx) => (
                <div key={idx} className="py-2.5 flex justify-between items-center text-sm">
                  <span className="text-slate-200 font-medium">{grocery.item}</span>
                  <span className="text-slate-400 font-semibold">${grocery.estimatedCost.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Substitutions */}
          {substitutions.length > 0 && (
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-850 pb-3">
                <RefreshCw className="w-5 h-5 text-amber-400 animate-spin-slow" />
                <h3 className="text-lg font-semibold text-white">Budget & Smart Substitutions</h3>
              </div>
              <div className="space-y-3">
                {substitutions.map((sub, idx) => (
                  <div key={idx} className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl text-xs space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="line-through text-slate-500 font-medium">{sub.original}</span>
                      <span className="text-slate-400">→</span>
                      <span className="text-amber-400 font-bold">{sub.substitute}</span>
                    </div>
                    <p className="text-slate-400 leading-relaxed">{sub.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
