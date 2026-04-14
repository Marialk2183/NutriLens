import React from 'react';
import { getHealthScoreColor } from '../../utils/healthScore';

export const MealCard = ({ meal }) => {
  const timeStr = new Date(meal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  return (
    <div className="glass-panel p-4 mb-3 flex items-center justify-between hover:scale-[1.02] transition-transform duration-200">
      <div className="flex flex-col">
        <h3 className="font-semibold text-forest text-sm md:text-base">{meal.foodName}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-500">{timeStr}</span>
          <span className="text-sm">{meal.mood}</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end">
          <span className="text-xs font-medium text-gray-400 mb-1">GHI Score</span>
          <div className={`px-3 py-1 rounded-full text-xs font-bold bg-white shadow-sm border border-gray-100 ${getHealthScoreColor(meal.healthScore)}`}>
            {meal.healthScore}
          </div>
        </div>
      </div>
    </div>
  );
};
