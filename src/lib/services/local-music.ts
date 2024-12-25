import fs from 'fs';
import path from 'path';

export interface LocalTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  path: string;
}

export interface LocalAlbum {
  id: string;
  title: string;
  artist: string;
  year?: string;
  coverImage: string;
  tracks: LocalTrack[];
}

const MUSIC_DIR = path.join(process.cwd(), 'public', 'Music');

export const LocalMusicService = {
  // Album functions
  async getAlbums(): Promise<LocalAlbum[]> {
    try {
      const albums = fs.readdirSync(MUSIC_DIR)
        .filter(dir => dir.toLowerCase().startsWith('album'))
        .map(albumDir => {
          const albumPath = path.join(MUSIC_DIR, albumDir);
          const infoPath = path.join(albumPath, 'info.json');
          const info = fs.existsSync(infoPath) 
            ? JSON.parse(fs.readFileSync(infoPath, 'utf-8'))
            : {};

          const tracks = fs.readdirSync(albumPath)
            .filter(file => file.endsWith('.mp3'))
            .map(track => ({
              id: track.replace('.mp3', ''),
              title: track.replace('.mp3', '').split('-').pop()?.trim() || track,
              artist: info.artist || 'Unknown Artist',
              album: info.title || albumDir,
              duration: 0, // You might want to use a library like music-metadata to get actual duration
              path: `/Music/${albumDir}/${track}`
            }));

          return {
            id: albumDir,
            title: info.title || albumDir,
            artist: info.artist || 'Unknown Artist',
            year: info.year,
            coverImage: `/Music/${albumDir}/cover.jpg`,
            tracks
          };
        });

      return albums;
    } catch (error) {
      console.error('Error getting albums:', error);
      return [];
    }
  },

  async getAlbum(albumId: string): Promise<LocalAlbum | null> {
    try {
      const albumPath = path.join(MUSIC_DIR, albumId);
      if (!fs.existsSync(albumPath)) return null;

      const infoPath = path.join(albumPath, 'info.json');
      const info = fs.existsSync(infoPath)
        ? JSON.parse(fs.readFileSync(infoPath, 'utf-8'))
        : {};

      const tracks = fs.readdirSync(albumPath)
        .filter(file => file.endsWith('.mp3'))
        .map(track => ({
          id: track.replace('.mp3', ''),
          title: track.replace('.mp3', '').split('-').pop()?.trim() || track,
          artist: info.artist || 'Unknown Artist',
          album: info.title || albumId,
          duration: 0,
          path: `/Music/${albumId}/${track}`
        }));

      return {
        id: albumId,
        title: info.title || albumId,
        artist: info.artist || 'Unknown Artist',
        year: info.year,
        coverImage: `/Music/${albumId}/cover.jpg`,
        tracks
      };
    } catch (error) {
      console.error('Error getting album:', error);
      return null;
    }
  },

  // Search function
  async search(query: string): Promise<{
    albums: LocalAlbum[];
    tracks: LocalTrack[];
  }> {
    const albums = await this.getAlbums();
    const lowerQuery = query.toLowerCase();

    const matchedAlbums = albums.filter(album => 
      album.title.toLowerCase().includes(lowerQuery) ||
      album.artist.toLowerCase().includes(lowerQuery)
    );

    const matchedTracks = albums.flatMap(album => 
      album.tracks.filter(track => 
        track.title.toLowerCase().includes(lowerQuery) ||
        track.artist.toLowerCase().includes(lowerQuery) ||
        album.title.toLowerCase().includes(lowerQuery)
      )
    );

    return {
      albums: matchedAlbums,
      tracks: matchedTracks
    };
  }
};
