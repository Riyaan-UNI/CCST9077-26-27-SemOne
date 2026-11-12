import { describe, expect, it } from 'vitest';
import { episodeQuizzes } from './episodeQuizzes';

describe('episode quiz content', () => {
  it('uses unique questions and three draft questions for each live episode', () => {
    expect(new Set(episodeQuizzes.map((question) => question.id)).size).toBe(episodeQuizzes.length);
    for (const episodeId of ['the-magic-box', 'spooky-twins-no-messages', 'the-game-show-that-broke-reality']) {
      expect(episodeQuizzes.filter((question) => question.episodeId === episodeId)).toHaveLength(3);
    }
  });

  it('has valid answer keys and records lecture/review metadata', () => {
    for (const question of episodeQuizzes) {
      expect(question.options.length).toBeGreaterThanOrEqual(2);
      expect(question.correctIndex).toBeGreaterThanOrEqual(0);
      expect(question.correctIndex).toBeLessThan(question.options.length);
      expect(question.sourceLecture).toMatch(/CCST9077 Lecture/);
      expect(question.reviewStatus).toBe('needs-review');
    }
  });
});
