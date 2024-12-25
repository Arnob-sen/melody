import { useState, useCallback } from 'react';
import { SpotifyService } from '@/lib/services/spotify-api';
import type { SpotifyTrack, SpotifyAlbum, SpotifyPlaylist, SpotifyArtist, SpotifySearchResult } from '@/lib/types/spotify';

interface UseSpotifyReturn {
  loading: boolean;
  error: Error | null;
  tracks: SpotifyTrack[];
  album: SpotifyAlbum | null;
  playlist: SpotifyPlaylist | null;
  artist: SpotifyArtist | null;
  relatedArtists: SpotifyArtist[];
  searchResults: SpotifySearchResult | null;
  downloadUrl: string | null;
  downloadSongUrl: string | null;
  getTrackDetails: (trackId: string) => Promise<void>;
  getTrackRecommendations: (trackId: string) => Promise<void>;
  getAlbumDetails: (albumId: string) => Promise<void>;
  getAlbumTracks: (albumId: string) => Promise<void>;
  getPlaylistDetails: (playlistId: string) => Promise<any>;
  getPlaylistTracks: (playlistId: string) => Promise<any>;
  getArtist: (artistId: string) => Promise<void>;
  getArtistRelated: (artistId: string) => Promise<void>;
  getArtistTopTracks: (artistId: string) => Promise<void>;
  downloadPlaylist: (playlistId: string) => Promise<void>;
  downloadAlbum: (albumId: string) => Promise<void>;
  searchSpotify: (query: string) => Promise<void>;
  downloadSong: (songId: string) => Promise<void>;
}

export function useSpotify(): UseSpotifyReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [album, setAlbum] = useState<SpotifyAlbum | null>(null);
  const [playlist, setPlaylist] = useState<SpotifyPlaylist | null>(null);
  const [artist, setArtist] = useState<SpotifyArtist | null>(null);
  const [relatedArtists, setRelatedArtists] = useState<SpotifyArtist[]>([]);
  const [searchResults, setSearchResults] = useState<SpotifySearchResult | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadSongUrl, setDownloadSongUrl] = useState<string | null>(null);

  const handleRequest = useCallback(async (request: () => Promise<any>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await request();
      return result;
    } catch (err) {
      console.error('Spotify API Error:', err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTrackDetails = useCallback(async (trackId: string) => {
    await handleRequest(async () => {
      const response = await SpotifyService.getTrackDetails(trackId);
      setTracks(response.data.tracks);
    });
  }, [handleRequest]);

  const getTrackRecommendations = useCallback(async (trackId: string) => {
    await handleRequest(async () => {
      const response = await SpotifyService.getTrackRecommendations(trackId);
      setTracks(response.data.tracks);
    });
  }, [handleRequest]);

  const getAlbumDetails = useCallback(async (albumId: string) => {
    await handleRequest(async () => {
      const response = await SpotifyService.getAlbumDetails(albumId);
      setAlbum(response.data.albums[0]);
    });
  }, [handleRequest]);

  const getAlbumTracks = useCallback(async (albumId: string) => {
    await handleRequest(async () => {
      const response = await SpotifyService.getAlbumTracks(albumId);
      setTracks(response.data.album.tracks.items);
    });
  }, [handleRequest]);

  const getPlaylistDetails = useCallback(async (playlistId: string) => {
    return handleRequest(async () => {
      const response = await SpotifyService.getPlaylistDetails(playlistId);
      if (response.success && response.data) {
        setPlaylist(response.data);
      }
      return response;
    });
  }, [handleRequest]);

  const getPlaylistTracks = useCallback(async (playlistId: string) => {
    return handleRequest(async () => {
      const response = await SpotifyService.getPlaylistTracks(playlistId);
      if (response.success && response.data?.items) {
        setTracks(response.data.items);
      }
      return response;
    });
  }, [handleRequest]);

  const getArtist = useCallback(async (artistId: string) => {
    await handleRequest(async () => {
      const response = await SpotifyService.getArtist(artistId);
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch artist');
      }
      setArtist(response.data);
    });
  }, [handleRequest]);

  const getArtistRelated = useCallback(async (artistId: string) => {
    await handleRequest(async () => {
      const response = await SpotifyService.getArtistRelated(artistId);
      if (response?.data?.artists) {
        setRelatedArtists(response.data.artists);
      } else {
        throw new Error('No artists found in response');
      }
    });
  }, [handleRequest]);

  const getArtistTopTracks = useCallback(async (artistId: string) => {
    await handleRequest(async () => {
      const response = await SpotifyService.getArtistTopTracks(artistId);
      console.log('API Response:', response);
      
      if (!response.success || !response.data?.tracks) {
        throw new Error('Failed to get top tracks');
      }
      
      // Map tracks and ensure they have preview URLs
      const tracksWithPreviews = response.data.tracks.map(track => {
        console.log('Track:', track.name, 'Preview URL:', track.preview_url);
        return track;
      });
      
      setTracks(tracksWithPreviews);
    });
  }, [handleRequest]);

  const downloadPlaylist = useCallback(async (playlistId: string) => {
    await handleRequest(async () => {
      const response = await SpotifyService.downloadPlaylist(playlistId);
      if (response.data.songs.length > 0) {
        setDownloadUrl(response.data.songs[0].downloadLink);
      }
    });
  }, [handleRequest]);

  const downloadAlbum = useCallback(async (albumId: string) => {
    await handleRequest(async () => {
      const response = await SpotifyService.downloadAlbum(albumId);
      if (response.data.songs.length > 0) {
        setDownloadUrl(response.data.songs[0].downloadLink);
      }
    });
  }, [handleRequest]);

  const searchSpotify = useCallback(async (query: string) => {
    await handleRequest(async () => {
      const response = await SpotifyService.searchSpotify(query);
      console.log('Search response:', response);
      if (response?.success) {
        setSearchResults(response);
      } else {
        throw new Error('Search request was not successful');
      }
    });
  }, [handleRequest]);

  const downloadSong = useCallback(async (songId: string) => {
    await handleRequest(async () => {
      const response = await SpotifyService.downloadSong(songId);
      setDownloadSongUrl(response.data.downloadLink);
    });
  }, [handleRequest]);

  return {
    loading,
    error,
    tracks,
    album,
    playlist,
    artist,
    relatedArtists,
    searchResults,
    downloadUrl,
    downloadSongUrl,
    getTrackDetails,
    getTrackRecommendations,
    getAlbumDetails,
    getAlbumTracks,
    getPlaylistDetails,
    getPlaylistTracks,
    getArtist,
    getArtistRelated,
    getArtistTopTracks,
    downloadPlaylist,
    downloadAlbum,
    searchSpotify,
    downloadSong,
  };
}