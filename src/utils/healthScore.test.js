import { describe, it, expect } from 'vitest';
import { getHealthScoreColor, getHealthScoreBgColor } from './healthScore';

describe('healthScore utilities', () => {
  describe('getHealthScoreColor', () => {
    it('returns text-sage for scores >= 70', () => {
      expect(getHealthScoreColor(100)).toBe('text-sage');
      expect(getHealthScoreColor(70)).toBe('text-sage');
      expect(getHealthScoreColor(85)).toBe('text-sage');
    });

    it('returns text-yellow-500 for scores between 40 and 69', () => {
      expect(getHealthScoreColor(69)).toBe('text-yellow-500');
      expect(getHealthScoreColor(40)).toBe('text-yellow-500');
      expect(getHealthScoreColor(55)).toBe('text-yellow-500');
    });

    it('returns text-coral for scores < 40', () => {
      expect(getHealthScoreColor(39)).toBe('text-coral');
      expect(getHealthScoreColor(0)).toBe('text-coral');
      expect(getHealthScoreColor(20)).toBe('text-coral');
    });
  });

  describe('getHealthScoreBgColor', () => {
    it('returns bg-sage for scores >= 70', () => {
      expect(getHealthScoreBgColor(100)).toBe('bg-sage');
      expect(getHealthScoreBgColor(70)).toBe('bg-sage');
    });

    it('returns bg-yellow-500 for scores between 40 and 69', () => {
      expect(getHealthScoreBgColor(69)).toBe('bg-yellow-500');
      expect(getHealthScoreBgColor(40)).toBe('bg-yellow-500');
    });

    it('returns bg-coral for scores < 40', () => {
      expect(getHealthScoreBgColor(39)).toBe('bg-coral');
      expect(getHealthScoreBgColor(0)).toBe('bg-coral');
    });
  });
});
