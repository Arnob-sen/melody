'use server'

import fs from 'fs'
import path from 'path'

export interface Artist {
  id: string;
  name: string;
  fullName: string;
  bio: string;
  genres: string[];
  country: string;
  image: string;
  tracks: {
    id: string;
    title: string;
    path: string;
    duration: string;
  }[];
}

const ARTISTS_DIR = path.join(process.cwd(), 'public', 'Music', 'artist');

function getSongDuration(filePath: string): string {
  // For now return a placeholder duration
  return "3:30";
}

function getArtistTracks(artistDir: string): { id: string; title: string; path: string; duration: string; }[] {
  const tracks: { id: string; title: string; path: string; duration: string; }[] = [];
  const files = fs.readdirSync(artistDir);

  files.forEach((file, index) => {
    if (file.endsWith('.mp3')) {
      const filePath = path.join(artistDir, file);
      const title = path.basename(file, '.mp3')
        .split('-')
        .map(part => part.trim())
        .join(' ');

      tracks.push({
        id: `track${index + 1}`,
        title: title,
        path: `/Music/artist/${path.basename(artistDir)}/${file}`,
        duration: getSongDuration(filePath)
      });
    }
  });

  return tracks;
}

export async function getArtists(): Promise<Artist[]> {
  try {
    if (!fs.existsSync(ARTISTS_DIR)) {
      console.error('Artists directory does not exist:', ARTISTS_DIR);
      return [];
    }

    const contents = fs.readdirSync(ARTISTS_DIR);
    const artists: Artist[] = [];

    for (const dir of contents) {
      const fullPath = path.join(ARTISTS_DIR, dir);
      const isDirectory = fs.statSync(fullPath).isDirectory();
      
      if (isDirectory) {
        const infoPath = path.join(fullPath, 'info.json');
        if (fs.existsSync(infoPath)) {
          try {
            const info = JSON.parse(fs.readFileSync(infoPath, 'utf-8'));
            const tracks = getArtistTracks(fullPath);
            
            artists.push({
              ...info,
              id: dir,
              image: `/Music/artist/${dir}/cover.jpg`,
              tracks: tracks
            });
          } catch (error) {
            console.error(`Error reading artist info for ${dir}:`, error);
          }
        }
      }
    }

    return artists;
  } catch (error) {
    console.error('Error reading artists:', error);
    return [];
  }
}

export async function getArtist(artistId: string): Promise<Artist | null> {
  try {
    const artistPath = path.join(ARTISTS_DIR, artistId);
    const infoPath = path.join(artistPath, 'info.json');

    if (!fs.existsSync(infoPath)) {
      return null;
    }

    const info = JSON.parse(fs.readFileSync(infoPath, 'utf-8'));
    const tracks = getArtistTracks(artistPath);

    return {
      ...info,
      id: artistId,
      image: `/Music/artist/${artistId}/cover.jpg`,
      tracks: tracks
    };
  } catch (error) {
    console.error(`Error reading artist ${artistId}:`, error);
    return null;
  }
}
