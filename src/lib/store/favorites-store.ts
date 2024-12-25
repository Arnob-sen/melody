"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SpotifyTrack } from '@/lib/types/spotify';

interface FavoritesStore {
  favorites: SpotifyTrack[];
  addFavorite: (track: SpotifyTrack) => void;
  removeFavorite: (trackId: string) => void;
  isFavorite: (trackId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      
      addFavorite: (track) => 
        set((state) => ({
          favorites: [...state.favorites, track]
        })),
      
      removeFavorite: (trackId) =>
        set((state) => ({
          favorites: state.favorites.filter((t) => t.id !== trackId)
        })),
      
      isFavorite: (trackId) =>
        get().favorites.some((t) => t.id === trackId),
    }),
    {
      name: 'favorites-storage',
    }
  )
);