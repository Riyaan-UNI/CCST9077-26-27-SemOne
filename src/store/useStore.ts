import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CaseId } from '@/content/cases';

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

export interface CaseLedgerEntry {
  prediction: string;
  observation: string;
  updatedAt: number;
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
  caseLedger: Partial<Record<CaseId, CaseLedgerEntry>>;

  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  toggleSound: () => void;
  toggleObserverMode: () => void;
  setReduceMotion: (value: boolean) => void;
  react: (mood: QubiMood, text: string) => void;
  recordPrediction: (caseId: CaseId, prediction: string) => void;
  recordObservation: (caseId: CaseId, observation: string) => void;
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // New visitors start in dark mode; a saved theme choice still takes precedence.
      theme: 'dark',
      sound: false,
      observerMode: true,
      reduceMotion: prefersReducedMotion(),

      reaction: null,
      reactionCount: 0,
      caseLedger: {},

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
      recordPrediction: (caseId, prediction) =>
        set((s) => ({
          caseLedger: {
            ...s.caseLedger,
            [caseId]: {
              prediction,
              observation: s.caseLedger[caseId]?.observation ?? '',
              updatedAt: Date.now(),
            },
          },
        })),
      recordObservation: (caseId, observation) =>
        set((s) => ({
          caseLedger: {
            ...s.caseLedger,
            [caseId]: {
              prediction: s.caseLedger[caseId]?.prediction ?? '',
              observation,
              updatedAt: Date.now(),
            },
          },
        })),
    }),
    {
      name: 'qubi-preferences',
      // Only persist genuine preferences, never transient UI state.
      partialize: (s) => ({
        theme: s.theme,
        sound: s.sound,
        observerMode: s.observerMode,
        caseLedger: s.caseLedger,
      }),
    },
  ),
);

/** Convenience hook: fire a Qubi reaction from anywhere. */
export const useQubi = () => useStore((s) => s.react);
