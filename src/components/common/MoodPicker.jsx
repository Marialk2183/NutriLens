import React from 'react';

const MOODS = [
  { emoji: '😫', label: 'Terrible' },
  { emoji: '😕', label: 'Bad' },
  { emoji: '😐', label: 'Okay' },
  { emoji: '🙂', label: 'Good' },
  { emoji: '😄', label: 'Great' }
];

export const MoodPicker = ({ value, onChange }) => {
  return (
    <div className="flex justify-between w-full max-w-[280px] mx-auto py-4">
      {MOODS.map((m) => (
        <button
          key={m.label}
          onClick={() => onChange(m.emoji)}
          aria-label={m.label}
          className={`text-3xl transition-transform duration-200 ${value === m.emoji ? 'scale-125 drop-shadow-md' : 'opacity-50 hover:opacity-100 hover:scale-110'}`}
        >
          {m.emoji}
        </button>
      ))}
    </div>
  );
};
