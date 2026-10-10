import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'dark' | 'light';

export type QubiMood =
  | 'idle'
  | 'happy'
  | 'curious'
  | 'surprised'
  | 'thinking'
  | 'excited'
  | 'dizzy';

export interface QubiReaction {
  id: number;
  mood: QubiMood;
  text: string;
}

interface AppState {
  /* settings */
  theme: Theme;
  sound: boolean;
  observerMode: boolean;
  reduceMotion: boolean;

  /* Qubi's reaction event bus */
  reaction: QubiReaction | null;
  reactionCount: number;

  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  toggleSound: () => void;
  toggleObserverMode: () => void;
  setReduceMotion: (value: boolean) => void;
  react: (mood: QubiMood, text: string) => void;
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      sound: false,
      observerMode: true,
      reduceMotion: prefersReducedMotion(),

      reaction: null,
      reactionCount: 0,

      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set({ theme: get().theme === 'dark' ? 'light' : 'dark' }),
      toggleSound: () => set({ sound: !get().sound }),
      toggleObserverMode: () => set({ observerMode: !get().observerMode }),
      setReduceMotion: (reduceMotion) => set({ reduceMotion }),

      react: (mood, text) =>
        set((s) => ({
          reaction: { id: s.reactionCount + 1, mood, text },
          reactionCount: s.reactionCount + 1,
        })),
    }),
    {
      name: 'qubi-preferences',
      // Only persist genuine preferences, never transient UI state.
      partialize: (s) => ({
        theme: s.theme,
        sound: s.sound,
        observerMode: s.observerMode,
      }),
    },
  ),
);

/** Convenience hook: fire a Qubi reaction from anywhere. */
export const useQubi = () => useStore((s) => s.react);
