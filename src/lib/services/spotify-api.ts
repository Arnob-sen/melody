import axios from 'axios';
import { SPOTIFY_API_CONFIG } from '@/lib/config/spotify';
import type { 
  ApiResponse, 
  SpotifyTrack, 
  SpotifyAlbum,
  SpotifyPlaylist,
  SpotifyArtist,
  SpotifySearchResult,
  DownloadResponse,
  DownloadSongResponse,
  AlbumsResponse,
  AlbumTracksResponse
} from '@/lib/types/spotify';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: SPOTIFY_API_CONFIG.baseURL,
  headers: SPOTIFY_API_CONFIG.headers
});

// Add request interceptor for rate limiting
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second minimum between requests

api.interceptors.request.use(async (config) => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
  }
  
  lastRequestTime = Date.now();
  return config;
});

// Debug function to log API calls
function logApiCall(method: string, url: string, params?: any, response?: any) {
  console.log(`API ${method} ${url}`, {
    params,
    response: response ? { 
      success: response.success,
      message: response.message,
      data: response.data ? 'data present' : 'no data'
    } : 'no response'
  });
}

// Cache for storing album data
let albumsCache: SpotifyAlbum[] | null = null;
let albumsCacheTimestamp: number | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Cache for storing data
let dataCache: {
  artists: { [key: string]: { data: SpotifyArtist; timestamp: number } };
  relatedArtists: { [key: string]: { data: SpotifyArtist[]; timestamp: number } };
} = {
  artists: {},
  relatedArtists: {}
};

// Utility function to handle retries
async function withRetry<T>(
  operation: () => Promise<T>,
  retries = 3,
  delay = 2000
): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    if (retries > 0 && error.response?.status === 429) {
      console.log(`Request failed, retrying in ${delay}ms... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(operation, retries - 1, delay * 2);
    }
    throw error;
  }
}

export const SpotifyService = {
  // Download endpoints
  async downloadPlaylist(playlistId: string): Promise<DownloadResponse> {
    return withRetry(async () => {
      try {
        const url = '/downloadPlaylist';
        const params = { id: playlistId };
        
        logApiCall('GET', url, params);
        
        const response = await api.get<DownloadResponse>(url, { params });
        
        logApiCall('GET', url, params, response.data);
        
        return response.data;
      } catch (error: any) {
        console.error('Error downloading playlist:', error.response?.data || error.message);
        throw error;
      }
    });
  },

  async downloadAlbum(albumId: string): Promise<DownloadResponse> {
    return withRetry(async () => {
      try {
        const url = '/downloadAlbum';
        const params = {
          albumId: `https://open.spotify.com/album/${albumId}`
        };
        
        logApiCall('GET', url, params);
        
        const response = await api.get<DownloadResponse>(url, { params });
        
        logApiCall('GET', url, params, response.data);
        
        return response.data;
      } catch (error: any) {
        console.error('Download error:', error.response?.data || error.message);
        throw error;
      }
    });
  },

  async downloadSong(songId: string): Promise<DownloadSongResponse> {
    return withRetry(async () => {
      try {
        const url = '/downloadTrack';
        const params = {
          trackId: `https://open.spotify.com/track/${songId}`
        };
        
        logApiCall('GET', url, params);
        
        const response = await api.get<DownloadSongResponse>(url, { params });
        
        logApiCall('GET', url, params, response.data);
        
        return response.data;
      } catch (error: any) {
        console.error('Download error:', error.response?.data || error.message);
        throw error;
      }
    });
  },

  // Search endpoint
  async searchSpotify(query: string): Promise<SpotifySearchResult> {
    return withRetry(async () => {
      try {
        const url = '/search';
        const params = { query };
        
        logApiCall('GET', url, params);
        
        const response = await api.get<SpotifySearchResult>(url, { params });
        
        logApiCall('GET', url, params, response.data);
        
        return response.data;
      } catch (error: any) {
        console.error('Search error:', error.response?.data || error.message);
        throw error;
      }
    });
  },

  // Album endpoints
  async getAlbums(): Promise<AlbumsResponse> {
    return withRetry(async () => {
      try {
        const url = '/albums';
        const params = { ids: '0tGPJ0bkWOUmH7MEOR77qc,2noRn2Aes5aoNVsU6iWThc' }; // Example album IDs
        
        logApiCall('GET', url, params);
        
        const response = await api.get<AlbumsResponse>(url, { params });
        
        logApiCall('GET', url, params, response.data);
        
        return {
          success: true,
          data: {
            albums: response.data?.data?.albums || []
          },
          generatedTimeStamp: Date.now()
        };
      } catch (error: any) {
        console.error('Album fetch error:', error.response?.data || error.message);
        throw error;
      }
    });
  },

  async getAlbumTracks(albumId: string): Promise<AlbumTracksResponse> {
    return withRetry(async () => {
      try {
        // Extract the actual Spotify ID from the URI if needed
        const cleanId = albumId.replace('spotify:album:', '');
        
        const url = '/albumTracks';
        const params = { id: cleanId };
        
        logApiCall('GET', url, params);
        
        const response = await api.get<AlbumTracksResponse>(url, { params });
        
        logApiCall('GET', url, params, response.data);
        
        if (!response.data.success) {
          throw new Error(`Failed to fetch tracks: ${response.data.message}`);
        }
        
        return response.data;
      } catch (error: any) {
        console.error('Track fetch error:', error.response?.data || error.message);
        throw error;
      }
    });
  },

  async getAlbumDetails(albumId: string): Promise<ApiResponse<{ albums: SpotifyAlbum[] }>> {
    return withRetry(async () => {
      try {
        const url = '/albums/';
        const params = { ids: albumId };
        
        logApiCall('GET', url, params);
        
        const response = await api.get<ApiResponse<{ albums: SpotifyAlbum[] }>>(url, { params });
        
        logApiCall('GET', url, params, response.data);
        
        return response.data;
      } catch (error: any) {
        console.error('Error fetching album details:', error.response?.data || error.message);
        throw error;
      }
    });
  },

  async getAlbumTracksOld(albumId: string): Promise<ApiResponse<{ album: { tracks: { items: SpotifyTrack[] } } }>> {
    return withRetry(async () => {
      try {
        const url = `/albums/${albumId}/tracks`;
        const params = { limit: '50', offset: '0' };
        
        logApiCall('GET', url, params);
        
        const response = await api.get<ApiResponse<{ album: { tracks: { items: SpotifyTrack[] } } }>>(url, { params });
        
        logApiCall('GET', url, params, response.data);
        
        return response.data;
      } catch (error: any) {
        console.error('Error fetching album tracks:', error.response?.data || error.message);
        throw error;
      }
    });
  },

  // Track endpoints
  async getTrackDetails(trackId: string): Promise<ApiResponse<{ tracks: SpotifyTrack[] }>> {
    return withRetry(async () => {
      try {
        const url = '/track/';
        const params = { id: trackId };
        
        logApiCall('GET', url, params);
        
        const response = await api.get<ApiResponse<{ tracks: SpotifyTrack[] }>>(url, { params });
        
        logApiCall('GET', url, params, response.data);
        
        return response.data;
      } catch (error: any) {
        console.error('Error fetching track details:', error.response?.data || error.message);
        throw error;
      }
    });
  },

  async getTrackRecommendations(trackId: string): Promise<ApiResponse<{ tracks: SpotifyTrack[] }>> {
    return withRetry(async () => {
      try {
        const url = '/track/recommendations';
        const params = { seed_tracks: trackId };
        
        logApiCall('GET', url, params);
        
        const response = await api.get<ApiResponse<{ tracks: SpotifyTrack[] }>>(url, { params });
        
        logApiCall('GET', url, params, response.data);
        
        return response.data;
      } catch (error: any) {
        console.error('Error fetching track recommendations:', error.response?.data || error.message);
        throw error;
      }
    });
  },

  // Playlist endpoints
  async getPlaylistDetails(playlistId: string): Promise<ApiResponse<SpotifyPlaylist>> {
    return withRetry(async () => {
      try {
        const url = '/playlist/';
        const params = { id: playlistId };
        
        logApiCall('GET', url, params);
        
        const response = await api.get<ApiResponse<SpotifyPlaylist>>(url, { params });
        
        // Add additional error checking
        if (!response.data.success || !response.data.data) {
          throw new Error(response.data.message || 'Failed to fetch playlist details');
        }
        
        logApiCall('GET', url, params, response.data);
        
        return response.data;
      } catch (error: any) {
        console.error('Error fetching playlist details:', error.response?.data || error.message);
        throw error;
      }
    }, 5, 3000); // More retries with longer delay for playlists
  },

  async getPlaylistTracks(playlistId: string): Promise<ApiResponse<{ items: SpotifyTrack[] }>> {
    return withRetry(async () => {
      try {
        const url = `/playlists/${playlistId}/tracks`;
        const params = { limit: '50', offset: '0' };
        
        logApiCall('GET', url, params);
        
        const response = await api.get<ApiResponse<{ items: SpotifyTrack[] }>>(url, { params });
        
        // Add additional error checking
        if (!response.data.success || !response.data.data) {
          throw new Error(response.data.message || 'Failed to fetch playlist tracks');
        }
        
        logApiCall('GET', url, params, response.data);
        
        return response.data;
      } catch (error: any) {
        console.error('Error fetching playlist tracks:', error.response?.data || error.message);
        throw error;
      }
    }, 5, 3000); // More retries with longer delay for playlists
  },

  // Artist endpoints
  async getArtist(artistId: string): Promise<ApiResponse<SpotifyArtist>> {
    return withRetry(async () => {
      try {
        // Check cache first
        const cachedArtist = dataCache.artists[artistId];
        if (cachedArtist && Date.now() - cachedArtist.timestamp < CACHE_DURATION) {
          return { success: true, data: cachedArtist.data };
        }

        const url = '/artist/';
        const params = { id: artistId };
        
        logApiCall('GET', url, params);
        
        const response = await api.get<ApiResponse<{ tracks: SpotifyTrack[] }>>(url, { params });
        
        if (!response.data.success || !response.data.data?.tracks?.[0]) {
          return { success: false, message: 'Artist not found' };
        }

        const track = response.data.data.tracks[0];
        const artist: SpotifyArtist = {
          id: track.artists[0].id,
          name: track.artists[0].name,
          image: track.album.images[0]?.url || '',
          followers: { total: 0 },
          genres: [],
          popularity: 0
        };

        // Cache the result
        dataCache.artists[artistId] = {
          data: artist,
          timestamp: Date.now()
        };

        return { success: true, data: artist };
      } catch (error: any) {
        console.error('Error fetching artist:', error.response?.data || error.message);
        return { success: false, message: error.message };
      }
    });
  },

  async getArtistRelated(artistId: string): Promise<ApiResponse<{ artists: SpotifyArtist[] }>> {
    return withRetry(async () => {
      try {
        // Check cache first
        const cachedRelated = dataCache.relatedArtists[artistId];
        if (cachedRelated && Date.now() - cachedRelated.timestamp < CACHE_DURATION) {
          return { success: true, data: { artists: cachedRelated.data } };
        }

        const url = '/artist/related-artists/';
        const params = { id: artistId };
        
        logApiCall('GET', url, params);
        
        const response = await api.get<ApiResponse<{ artists: SpotifyArtist[] }>>(url, { params });
        
        if (response.data.success && response.data.data?.artists) {
          // Cache the result
          dataCache.relatedArtists[artistId] = {
            data: response.data.data.artists,
            timestamp: Date.now()
          };
        }
        
        return response.data;
      } catch (error: any) {
        console.error('Error fetching related artists:', error.response?.data || error.message);
        return { success: false, message: error.message };
      }
    });
  },

  async getArtistTopTracks(artistId: string): Promise<ApiResponse<{ tracks: SpotifyTrack[] }>> {
    return withRetry(async () => {
      try {
        const url = '/artist/top-tracks/';
        const params = { id: artistId };
        
        logApiCall('GET', url, params);
        
        const response = await api.get<ApiResponse<{ tracks: SpotifyTrack[] }>>(url, { params });
        
        logApiCall('GET', url, params, response.data);
        
        return response.data;
      } catch (error: any) {
        console.error('Error fetching top tracks:', error.response?.data || error.message);
        throw error;
      }
    });
  },
};