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
  hasHydrated: boolean;
  introComplete: boolean;
  tourActive: boolean;
  tourIndex: number;

  /* Qubi's reaction event bus */
  reaction: QubiReaction | null;
  reactionCount: number;
  caseLedger: Partial<Record<CaseId, CaseLedgerEntry>>;

  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  toggleSound: () => void;
  toggleObserverMode: () => void;
  setReduceMotion: (value: boolean) => void;
  setHasHydrated: (value: boolean) => void;
  completeIntro: () => void;
  startTour: () => void;
  setTourIndex: (index: number) => void;
  finishTour: () => void;
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
      hasHydrated: false,
      introComplete: false,
      tourActive: false,
      tourIndex: 0,

      reaction: null,
      reactionCount: 0,
      caseLedger: {},

      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set({ theme: get().theme === 'dark' ? 'light' : 'dark' }),
      toggleSound: () => set({ sound: !get().sound }),
      toggleObserverMode: () => set({ observerMode: !get().observerMode }),
      setReduceMotion: (reduceMotion) => set({ reduceMotion }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      completeIntro: () => set({ introComplete: true }),
      startTour: () => set({ introComplete: true, tourActive: true, tourIndex: 0 }),
      setTourIndex: (tourIndex) => set({ tourIndex }),
      finishTour: () => set({ tourActive: false, tourIndex: 0 }),

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
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
      // Only persist genuine preferences, never transient UI state.
      partialize: (s) => ({
        theme: s.theme,
        sound: s.sound,
        observerMode: s.observerMode,
        caseLedger: s.caseLedger,
        introComplete: s.introComplete,
      }),
    },
  ),
);

/** Convenience hook: fire a Qubi reaction from anywhere. */
export const useQubi = () => useStore((s) => s.react);
