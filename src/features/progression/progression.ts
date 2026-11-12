import type { EpisodeProgress, ProgressAction, UserProgress } from './types';

export const initialProgress = (episodeIds: string[], availableEpisodeIds = episodeIds.filter((id) => id !== 'cant-copy-cant-hack')): UserProgress => ({
  version: 1,
  episodes: Object.fromEntries(episodeIds.map((id) => [id, {
    id,
    status: availableEpisodeIds.includes(id) ? 'available' : 'locked',
    updatedAt: 0,
  } satisfies EpisodeProgress])),
  unlockedArtworks: [],
  observerMode: false,
});

export function progressReducer(state: UserProgress, action: ProgressAction): UserProgress {
  if (action.type === 'setObserverMode') return { ...state, observerMode: action.value };

  const episode = state.episodes[action.id];
  if (!episode) return state;

  if (action.type === 'unlockEpisode') {
    if (episode.status !== 'locked') return state;
    return { ...state, episodes: { ...state.episodes, [action.id]: { ...episode, status: 'available', updatedAt: action.at } } };
  }
  if (action.type === 'markWatched') {
    if (episode.status !== 'available') return state;
    return { ...state, episodes: { ...state.episodes, [action.id]: { ...episode, status: 'watched', updatedAt: action.at } } };
  }
  if (episode.status !== 'watched' && episode.status !== 'quizPassed') return state;
  return {
    ...state,
    episodes: { ...state.episodes, [action.id]: { ...episode, status: 'quizPassed', updatedAt: action.at } },
    unlockedArtworks: [...new Set([...state.unlockedArtworks, ...action.artworkIds])],
  };
}

export const getEpisodeStatus = (state: UserProgress, id: string) => state.episodes[id]?.status ?? 'locked';
export const isArtworkUnlocked = (state: UserProgress, id: string) => state.observerMode || state.unlockedArtworks.includes(id);
export const getUnlockedArtworkCount = (state: UserProgress, artworkIds: string[]) =>
  state.observerMode ? artworkIds.length : artworkIds.filter((id) => state.unlockedArtworks.includes(id)).length;

export const readProgress = (storage: Pick<Storage, 'getItem'>, episodeIds: string[], availableEpisodeIds = episodeIds.filter((id) => id !== 'cant-copy-cant-hack')): UserProgress => {
  const empty = initialProgress(episodeIds, availableEpisodeIds);
  try {
    const raw = storage.getItem('quantum-bureau-progress');
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Partial<UserProgress>;
    if (parsed.version !== 1 || !parsed.episodes || !Array.isArray(parsed.unlockedArtworks) || typeof parsed.observerMode !== 'boolean') return empty;
    return {
      version: 1,
      episodes: Object.fromEntries(episodeIds.map((id) => {
        const candidate = parsed.episodes?.[id];
        const valid = candidate && candidate.id === id && ['locked', 'available', 'watched', 'quizPassed'].includes(candidate.status);
        return [id, valid && !(candidate.status === 'locked' && availableEpisodeIds.includes(id)) ? candidate : empty.episodes[id]];
      })),
      unlockedArtworks: parsed.unlockedArtworks.filter((id): id is string => typeof id === 'string'),
      observerMode: parsed.observerMode,
    };
  } catch {
    return empty;
  }
};

export const writeProgress = (storage: Pick<Storage, 'setItem'>, state: UserProgress) => {
  try { storage.setItem('quantum-bureau-progress', JSON.stringify(state)); } catch { /* Private browsing/storage quota: keep the in-memory state. */ }
};
