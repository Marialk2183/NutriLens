export const getHealthScoreColor = (score) => {
  if (score >= 70) return 'text-sage';
  if (score >= 40) return 'text-yellow-500';
  return 'text-coral';
};

export const getHealthScoreBgColor = (score) => {
  if (score >= 70) return 'bg-sage';
  if (score >= 40) return 'bg-yellow-500';
  return 'bg-coral';
};
