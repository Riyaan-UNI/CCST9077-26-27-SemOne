export type EpisodeStatus = 'locked' | 'available' | 'watched' | 'quizPassed';

export interface EpisodeProgress {
  id: string;
  status: EpisodeStatus;
  updatedAt: number;
}

export interface UserProgress {
  version: 1;
  episodes: Record<string, EpisodeProgress>;
  unlockedArtworks: string[];
  observerMode: boolean;
}

export interface QuizQuestion {
  id: string;
  episodeId: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  sourceLecture: string;
  reviewStatus: 'needs-review' | 'reviewed';
}

export type ProgressAction =
  | { type: 'unlockEpisode'; id: string; at: number }
  | { type: 'markWatched'; id: string; at: number }
  | { type: 'passQuiz'; id: string; artworkIds: string[]; at: number }
  | { type: 'setObserverMode'; value: boolean };
