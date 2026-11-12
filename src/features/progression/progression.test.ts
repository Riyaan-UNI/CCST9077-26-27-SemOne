import { describe, expect, it } from 'vitest';
import { initialProgress, isArtworkUnlocked, progressReducer, readProgress, writeProgress } from './progression';

const ids = ['the-magic-box', 'spooky-twins-no-messages', 'the-game-show-that-broke-reality', 'cant-copy-cant-hack'];

describe('progression state', () => {
  it('starts available published episodes and a locked forthcoming episode', () => {
    const state = initialProgress(ids);
    expect(Object.values(state.episodes).map(({ status }) => status)).toEqual(['available', 'available', 'available', 'locked']);
    expect(state.observerMode).toBe(false);
  });

  it('advances watched episodes to quizPassed and declassifies their artwork', () => {
    let state = initialProgress(ids);
    state = progressReducer(state, { type: 'markWatched', id: ids[0], at: 10 });
    expect(state.episodes[ids[0]].status).toBe('watched');
    state = progressReducer(state, { type: 'passQuiz', id: ids[0], artworkIds: ['bloch'], at: 20 });
    expect(state.episodes[ids[0]].status).toBe('quizPassed');
    expect(isArtworkUnlocked(state, 'bloch')).toBe(true);
  });

  it('does not allow progress to skip the watched step', () => {
    const state = initialProgress(ids);
    expect(progressReducer(state, { type: 'passQuiz', id: ids[0], artworkIds: ['bloch'], at: 2 })).toBe(state);
  });

  it('Observer Mode reveals artwork without changing saved unlocks', () => {
    const state = progressReducer(initialProgress(ids), { type: 'setObserverMode', value: true });
    expect(isArtworkUnlocked(state, 'photon-key')).toBe(true);
    expect(state.unlockedArtworks).toEqual([]);
  });

  it('returns empty state for malformed or unavailable storage and ignores invalid episodes', () => {
    expect(readProgress({ getItem: () => '{broken' }, ids)).toEqual(initialProgress(ids));
    const validButIncomplete = JSON.stringify({ version: 1, episodes: { 'the-magic-box': { id: 'the-magic-box', status: 'nope' } }, unlockedArtworks: [], observerMode: false });
    expect(readProgress({ getItem: () => validButIncomplete }, ids).episodes[ids[0]].status).toBe('available');
    expect(readProgress({ getItem: () => { throw new Error('blocked'); } }, ids)).toEqual(initialProgress(ids));
  });

  it('makes a formerly forthcoming episode available after its slot goes live', () => {
    const beforeRelease = initialProgress(ids);
    const released = readProgress({ getItem: () => JSON.stringify(beforeRelease) }, ids, ids);
    expect(released.episodes['cant-copy-cant-hack'].status).toBe('available');
  });

  it('persists safely when storage throws', () => {
    expect(() => writeProgress({ setItem: () => { throw new Error('blocked'); } }, initialProgress(ids))).not.toThrow();
  });
});
