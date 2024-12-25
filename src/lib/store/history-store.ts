import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface HistoryTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  path: string;
  image: string;
  playedAt: number; // timestamp when the track was played
}

interface HistoryStore {
  history: HistoryTrack[];
  addToHistory: (track: Omit<HistoryTrack, 'playedAt'>) => void;
  clearHistory: () => void;
  removeFromHistory: (trackId: string) => void;
}

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set) => ({
      history: [],
      addToHistory: (track) => 
        set((state) => {
          // Remove any existing entry of the same track
          const filteredHistory = state.history.filter(t => t.id !== track.id);
          // Add the track to the beginning of history with current timestamp
          return {
            history: [
              { ...track, playedAt: Date.now() },
              ...filteredHistory
            ].slice(0, 50) // Keep only the last 50 tracks
          };
        }),
      clearHistory: () => set({ history: [] }),
      removeFromHistory: (trackId) =>
        set((state) => ({
          history: state.history.filter((track) => track.id !== trackId)
        })),
    }),
    {
      name: 'history-storage',
    }
  )
);
