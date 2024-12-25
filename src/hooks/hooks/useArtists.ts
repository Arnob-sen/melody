import { useState, useCallback } from 'react';
import { useSpotify } from './useSpotify';
import { toast } from 'sonner';
import type { SpotifyArtist, SpotifySearchResult } from '@/lib/types/spotify';

export function useArtists() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { searchSpotify } = useSpotify();
  const [artists, setArtists] = useState<any[]>([]);

  const fetchArtists = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await searchSpotify('genre:pop genre:rock genre:hip-hop');
      
      if (!response?.data?.artists) {
        throw new Error('No artists found');
      }

      setArtists(response.data.artists.map((artist: SpotifyArtist) => ({
        id: artist.id,
        name: artist.name,
        image: artist.images?.[0]?.url || '',
        followers: artist.followers?.total || 0,
        uri: artist.uri,
        genres: artist.genres || []
      })));
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast.error('Failed to load artists: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }, [searchSpotify]);

  return {
    artists,
    isLoading,
    error,
    fetchArtists
  };
}
