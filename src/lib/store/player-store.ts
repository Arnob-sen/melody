"use client";

import { create } from "zustand";
import { LocalTrack } from "@/app/actions/get-local-music";
import { useHistoryStore } from "./history-store";

// Add helper function to format duration
function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

interface PlayerStore {
  currentTrack: LocalTrack | null;
  queue: LocalTrack[];
  isPlaying: boolean;
  audioElement: HTMLAudioElement | null;
  currentTime: number;
  setCurrentTrack: (track: LocalTrack) => void;
  setQueue: (tracks: LocalTrack[]) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentTime: (time: number) => void;
  playTrack: (track: LocalTrack) => void;
  playQueue: (tracks: LocalTrack[]) => void;
  nextTrack: () => void;
  previousTrack: () => void;
  initializeAudio: () => void;
  togglePlay: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => {
  // Only create audio element on client side
  if (typeof window === 'undefined') {
    return {
      currentTrack: null,
      queue: [],
      isPlaying: false,
      audioElement: null,
      currentTime: 0,
      initializeAudio: () => {},
      setCurrentTrack: () => {},
      setQueue: () => {},
      setIsPlaying: () => {},
      setCurrentTime: () => {},
      playTrack: () => {},
      playQueue: () => {},
      nextTrack: () => {},
      previousTrack: () => {},
      togglePlay: () => {},
    };
  }

  return {
    currentTrack: null,
    queue: [],
    isPlaying: false,
    audioElement: null,
    currentTime: 0,

    initializeAudio: () => {
      if (!get().audioElement) {
        const audio = new Audio();
        audio.preload = 'auto';
        
        // Add timeupdate listener to track current time
        audio.addEventListener('timeupdate', () => {
          set({ currentTime: audio.currentTime });
        });

        set({ audioElement: audio });
      }
    },

    setCurrentTrack: (track) => set({ currentTrack: track }),
    setQueue: (tracks) => set({ queue: tracks }),
    setIsPlaying: (isPlaying) => set({ isPlaying }),
    setCurrentTime: (time) => {
      const { audioElement } = get();
      if (audioElement) {
        audioElement.currentTime = time;
        set({ currentTime: time });
      }
    },

    togglePlay: () => {
      const { isPlaying, audioElement, currentTrack } = get();
      
      if (!audioElement || !currentTrack) return;

      if (isPlaying) {
        audioElement.pause();
        set({ isPlaying: false });
      } else {
        const playPromise = audioElement.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              set({ isPlaying: true });
            })
            .catch(error => {
              console.error('Playback failed:', error);
              set({ isPlaying: false });
            });
        }
      }
    },

    playTrack: (track: LocalTrack) => {
      const historyStore = useHistoryStore.getState();
      const { audioElement, initializeAudio, currentTrack } = get();

      // Initialize audio if not already done
      if (!audioElement) {
        initializeAudio();
      }

      const audio = get().audioElement;
      if (!audio) return;

      // If it's the same track, just resume from current position
      if (currentTrack?.id === track.id) {
        get().togglePlay();
        return;
      }

      // Set the source and load the audio
      audio.src = track.path;
      audio.load();

      // Wait for metadata to be loaded
      audio.addEventListener('loadedmetadata', () => {
        const trackWithMetadata = {
          ...track,
          image: track.image || `/Music/Album${track.album}/cover.jpg`,
          duration: formatDuration(audio.duration)
        };
        
        historyStore.addToHistory(trackWithMetadata);
        set({ currentTrack: trackWithMetadata });

        // Play the audio
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              set({ isPlaying: true });
            })
            .catch(error => {
              console.error('Playback failed:', error);
              set({ isPlaying: false });
            });
        }
      }, { once: true });

      // Handle loading error
      audio.addEventListener('error', () => {
        const trackWithDefault = {
          ...track,
          image: track.image || `/Music/Album${track.album}/cover.jpg`,
          duration: '00:00'
        };
        
        historyStore.addToHistory(trackWithDefault);
        set({ 
          currentTrack: trackWithDefault,
          isPlaying: false
        });
      }, { once: true });
    },

    playQueue: (tracks: LocalTrack[]) => {
      if (tracks.length === 0) return;
      
      const { playTrack } = get();
      set({ queue: tracks });
      playTrack(tracks[0]);
    },

    nextTrack: () => {
      const { queue, currentTrack, playTrack } = get();
      const currentIndex = currentTrack ? queue.findIndex(t => t.id === currentTrack.id) : -1;
      if (currentIndex < queue.length - 1) {
        playTrack(queue[currentIndex + 1]);
      }
    },

    previousTrack: () => {
      const { queue, currentTrack, playTrack } = get();
      const currentIndex = currentTrack ? queue.findIndex(t => t.id === currentTrack.id) : -1;
      if (currentIndex > 0) {
        playTrack(queue[currentIndex - 1]);
      }
    }
  };
});

// Initialize audio element when the store is created
if (typeof window !== 'undefined') {
  usePlayerStore.getState().initializeAudio();
}