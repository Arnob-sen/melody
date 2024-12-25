'use server'

import fs from 'fs'
import path from 'path'

export interface PlaylistTrack {
  id: string;
  title: string;
  path: string;
  duration: string;
  artist: string;
  image: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  image: string;
  tracks: PlaylistTrack[];
}

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const PLAYLISTS_DIR = path.join(PUBLIC_DIR, 'Music', 'playlists');
const DEFAULT_COVER = '/images/playlist-default.png';

// Ensure required directories exist
function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Initialize directories
ensureDirectoryExists(PLAYLISTS_DIR);
ensureDirectoryExists(path.join(PUBLIC_DIR, 'images'));

// Copy default image if it doesn't exist
const defaultImageSrc = path.join(process.cwd(), 'public', 'images', 'playlist-default.png');
if (!fs.existsSync(defaultImageSrc)) {
  fs.writeFileSync(defaultImageSrc, fs.readFileSync(path.join(process.cwd(), 'public', 'images', 'playlist-default.png')));
}

export async function getPlaylists(): Promise<Playlist[]> {
  try {
    const playlists: Playlist[] = [];
    const dirs = fs.readdirSync(PLAYLISTS_DIR);

    for (const dir of dirs) {
      const playlistDir = path.join(PLAYLISTS_DIR, dir);
      if (fs.statSync(playlistDir).isDirectory()) {
        const infoPath = path.join(playlistDir, 'info.json');
        try {
          const info = JSON.parse(fs.readFileSync(infoPath, 'utf-8'));
          const coverPath = path.join(playlistDir, 'cover.jpg');
          
          playlists.push({
            ...info,
            id: dir,
            image: fs.existsSync(coverPath) 
              ? `/Music/playlists/${dir}/cover.jpg` 
              : DEFAULT_COVER
          });
        } catch (error) {
          console.error(`Error reading playlist info for ${dir}:`, error);
        }
      }
    }

    return playlists;
  } catch (error) {
    console.error('Error reading playlists:', error);
    return [];
  }
}

export async function getPlaylist(playlistId: string): Promise<Playlist | null> {
  try {
    const playlistDir = path.join(PLAYLISTS_DIR, playlistId);
    const infoPath = path.join(playlistDir, 'info.json');
    
    if (!fs.existsSync(infoPath)) {
      return null;
    }

    const info = JSON.parse(fs.readFileSync(infoPath, 'utf-8'));
    const coverPath = path.join(playlistDir, 'cover.jpg');
    
    return {
      ...info,
      id: playlistId,
      image: fs.existsSync(coverPath) 
        ? `/Music/playlists/${playlistId}/cover.jpg` 
        : DEFAULT_COVER
    };
  } catch (error) {
    console.error(`Error reading playlist ${playlistId}:`, error);
    return null;
  }
}

export async function createPlaylist(
  name: string, 
  description: string, 
  coverFile?: File | null
): Promise<Playlist> {
  try {
    const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const playlistDir = path.join(PLAYLISTS_DIR, id);
    ensureDirectoryExists(playlistDir);

    let imagePath = DEFAULT_COVER;

    if (coverFile) {
      try {
        const arrayBuffer = await coverFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        const coverPath = path.join(playlistDir, 'cover.jpg');
        
        // Write the file
        fs.writeFileSync(coverPath, buffer);
        console.log('Cover image saved to:', coverPath);
        
        // Update the image path
        imagePath = `/Music/playlists/${id}/cover.jpg`;
      } catch (error) {
        console.error('Error saving cover image:', error);
        // Keep default cover if upload fails
      }
    }

    const playlist: Playlist = {
      id,
      name,
      description,
      image: imagePath,
      tracks: []
    };

    const infoPath = path.join(playlistDir, 'info.json');
    fs.writeFileSync(infoPath, JSON.stringify(playlist, null, 2));
    console.log('Playlist info saved to:', infoPath);

    return playlist;
  } catch (error) {
    console.error('Error creating playlist:', error);
    throw error;
  }
}

export async function updatePlaylist(
  playlistId: string, 
  updates: { 
    name?: string; 
    description?: string;
  },
  coverFile?: File | null
): Promise<Playlist> {
  try {
    const playlistDir = path.join(PLAYLISTS_DIR, playlistId);
    ensureDirectoryExists(playlistDir);
    
    const infoPath = path.join(playlistDir, 'info.json');
    if (!fs.existsSync(infoPath)) {
      throw new Error('Playlist not found');
    }

    const currentInfo = JSON.parse(fs.readFileSync(infoPath, 'utf-8'));

    if (coverFile) {
      try {
        const arrayBuffer = await coverFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        const coverPath = path.join(playlistDir, 'cover.jpg');
        
        // Write the file
        fs.writeFileSync(coverPath, buffer);
        console.log('Cover image saved to:', coverPath);
        
        // Update the image path
        currentInfo.image = `/Music/playlists/${playlistId}/cover.jpg`;
      } catch (error) {
        console.error('Error saving cover image:', error);
        currentInfo.image = DEFAULT_COVER;
      }
    }

    const updatedInfo = {
      ...currentInfo,
      ...updates,
    };

    fs.writeFileSync(infoPath, JSON.stringify(updatedInfo, null, 2));
    console.log('Updated playlist info saved to:', infoPath);
    
    return updatedInfo;
  } catch (error) {
    console.error(`Error updating playlist ${playlistId}:`, error);
    throw error;
  }
}

export async function deletePlaylist(playlistId: string): Promise<boolean> {
  try {
    const playlistDir = path.join(PLAYLISTS_DIR, playlistId);
    if (!fs.existsSync(playlistDir)) return false;

    // Remove the entire playlist directory
    fs.rmSync(playlistDir, { recursive: true, force: true });
    return true;
  } catch (error) {
    console.error('Error deleting playlist:', error);
    return false;
  }
}

export async function addTrackToPlaylist(playlistId: string, track: PlaylistTrack): Promise<boolean> {
  try {
    const playlist = await getPlaylist(playlistId);
    if (!playlist) return false;

    // Check if track already exists
    const exists = playlist.tracks.some(t => t.path === track.path);
    if (exists) return true;

    playlist.tracks = [...playlist.tracks, track];
    
    const infoPath = path.join(PLAYLISTS_DIR, playlistId, 'info.json');
    fs.writeFileSync(infoPath, JSON.stringify(playlist, null, 2));

    return true;
  } catch (error) {
    console.error('Error adding track to playlist:', error);
    return false;
  }
}

export async function removeTrackFromPlaylist(playlistId: string, trackId: string): Promise<boolean> {
  try {
    const playlist = await getPlaylist(playlistId);
    if (!playlist) return false;

    playlist.tracks = playlist.tracks.filter(track => track.id !== trackId);
    
    const infoPath = path.join(PLAYLISTS_DIR, playlistId, 'info.json');
    fs.writeFileSync(infoPath, JSON.stringify(playlist, null, 2));

    return true;
  } catch (error) {
    console.error('Error removing track from playlist:', error);
    return false;
  }
}
