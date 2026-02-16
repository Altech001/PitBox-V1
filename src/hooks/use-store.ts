import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PlayerState {
  volume: number;
  setVolume: (volume: number) => void;
}

interface SeriesState {
  // Track episode progress per series: { [seriesId: string]: episodeIndex }
  progress: Record<string, number>;
  saveProgress: (seriesId: string, index: number) => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set) => ({
      volume: 0.5,
      setVolume: (volume) => set({ volume }),
    }),
    { name: 'pitbox-player-settings' }
  )
);

export const useSeriesStore = create<SeriesState>()(
  persist(
    (set) => ({
      progress: {},
      saveProgress: (seriesId, index) => 
        set((state) => ({
          progress: { ...state.progress, [seriesId]: index }
        })),
    }),
    { name: 'pitbox-series-progress' }
  )
);