import React from 'react';

export const ProgressBar = ({ progress, max = 100, color = 'bg-sage', height = 'h-2' }) => {
  const percentage = Math.min(100, Math.max(0, (progress / max) * 100));
  
  return (
    <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${height}`}>
      <div 
        className={`${color} h-full transition-all duration-500 ease-out`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
