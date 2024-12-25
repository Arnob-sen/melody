import { useState, useCallback } from 'react';
import { LocalAlbum, LocalTrack, getAlbums, getAlbum } from '@/app/actions/get-local-music';

export function useLocalMusic() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [albums, setAlbums] = useState<LocalAlbum[]>([]);
  const [currentAlbum, setCurrentAlbum] = useState<LocalAlbum | null>(null);
  const [searchResults, setSearchResults] = useState<{
    albums: LocalAlbum[];
    tracks: LocalTrack[];
  } | null>(null);

  const fetchAlbums = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getAlbums();
      setAlbums(result);
      return result;
    } catch (err) {
      console.error('Error fetching albums:', err);
      setError(err as Error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAlbum = useCallback(async (albumId: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await getAlbum(albumId);
      setCurrentAlbum(result);
      return result;
    } catch (err) {
      console.error('Error fetching album:', err);
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const search = useCallback(async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      const allAlbums = await getAlbums();
      const lowerQuery = query.toLowerCase();

      const matchedAlbums = allAlbums.filter(album => 
        album.title.toLowerCase().includes(lowerQuery) ||
        album.artist.toLowerCase().includes(lowerQuery)
      );

      const matchedTracks = allAlbums.flatMap(album => 
        album.tracks.filter(track => 
          track.title.toLowerCase().includes(lowerQuery) ||
          track.artist.toLowerCase().includes(lowerQuery) ||
          album.title.toLowerCase().includes(lowerQuery)
        )
      );

      const results = { albums: matchedAlbums, tracks: matchedTracks };
      setSearchResults(results);
      return results;
    } catch (err) {
      console.error('Error searching:', err);
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // Data
    albums,
    currentAlbum,
    searchResults,
    
    // Status
    loading,
    error,
    
    // Actions
    fetchAlbums,
    fetchAlbum,
    search
  };
}
