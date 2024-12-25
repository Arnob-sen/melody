import { useState, useCallback } from 'react';
import { SpotifyService } from '@/lib/services/spotify-api';
import { toast } from 'sonner';
import type { SpotifyAlbum, AlbumTracksResponse } from '@/lib/types/spotify';

// Cache for storing album tracks
const tracksCache = new Map<string, AlbumTracksResponse>();

export function useAlbums() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [albums, setAlbums] = useState<SpotifyAlbum[]>([]);
  const [albumTracks, setAlbumTracks] = useState<AlbumTracksResponse | null>(null);

  const fetchAlbums = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await SpotifyService.getAlbums();
      
      if (!response?.success || !response?.data?.albums) {
        throw new Error('Failed to fetch albums');
      }

      setAlbums(response.data.albums);
    } catch (err) {
      const error = err as Error;
      console.error('Error in fetchAlbums:', error);
      setError(error);
      toast.error('Failed to load albums: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAlbumTracks = useCallback(async (albumId: string) => {
    if (!albumId) {
      console.error('Album ID is required');
      toast.error('Invalid album ID');
      return null;
    }

    // Check cache first
    if (tracksCache.has(albumId)) {
      const cachedTracks = tracksCache.get(albumId);
      setAlbumTracks(cachedTracks || null);
      return cachedTracks || null;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await SpotifyService.getAlbumTracks(albumId);
      
      if (!response?.success) {
        throw new Error('Failed to fetch album tracks');
      }

      // Cache the result
      tracksCache.set(albumId, response);
      setAlbumTracks(response);
      return response;
    } catch (err) {
      const error = err as Error;
      console.error('Error in fetchAlbumTracks:', error);
      setError(error);
      toast.error('Failed to load album tracks: ' + error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    albums,
    albumTracks,
    fetchAlbums,
    fetchAlbumTracks
  };
}
