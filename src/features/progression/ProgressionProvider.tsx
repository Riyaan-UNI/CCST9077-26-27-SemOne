import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { videos } from '@/data/videos';
import { initialProgress, progressReducer, readProgress, writeProgress } from './progression';
import type { ProgressAction, UserProgress } from './types';

const episodeIds = videos.map((video) => video.id);
const availableEpisodeIds = videos.filter((video) => video.status === 'live' && video.youtubeId).map((video) => video.id);
interface ProgressionContextValue {
  progress: UserProgress;
  dispatch: (action: ProgressAction) => void;
}
const ProgressionContext = createContext<ProgressionContextValue | null>(null);

export function ProgressionProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(() =>
    typeof window === 'undefined' ? initialProgress(episodeIds, availableEpisodeIds) : (() => {
      try { return readProgress(window.localStorage, episodeIds, availableEpisodeIds); } catch { return initialProgress(episodeIds, availableEpisodeIds); }
    })());
  const dispatch = useCallback((action: ProgressAction) => setProgress((current) => progressReducer(current, action)), []);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try { writeProgress(window.localStorage, progress); } catch { /* Storage may be unavailable in private browsing. */ }
    }
  }, [progress]);
  const value = useMemo(() => ({ progress, dispatch }), [progress, dispatch]);
  return <ProgressionContext.Provider value={value}>{children}</ProgressionContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProgression() {
  const value = useContext(ProgressionContext);
  if (!value) throw new Error('useProgression must be used inside ProgressionProvider');
  return value;
}
