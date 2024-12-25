'use server'

import fs from 'fs'
import path from 'path'
import * as mm from 'music-metadata';

export interface LocalTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  path: string;
  image?: string;
}

export interface LocalAlbum {
  id: string;
  title: string;
  artist: string;
  year?: string;
  genre?: string;
  description?: string;
  coverImage: string;
  tracks: LocalTrack[];
}

const MUSIC_DIR = path.join(process.cwd(), 'public', 'Music');

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

async function getAudioDuration(filePath: string): Promise<string> {
  try {
    const metadata = await mm.parseFile(filePath);
    return formatDuration(metadata.format.duration || 0);
  } catch (error) {
    console.error('Error getting audio duration:', error);
    return '00:00';
  }
}

export async function getAlbums(): Promise<LocalAlbum[]> {
  try {
    console.log('Music directory:', MUSIC_DIR);
    
    if (!fs.existsSync(MUSIC_DIR)) {
      console.error('Music directory does not exist:', MUSIC_DIR);
      return [];
    }

    const contents = fs.readdirSync(MUSIC_DIR);
    console.log('Directory contents:', contents);

    const albumPromises = contents
      .filter(dir => {
        const isAlbumDir = dir.toLowerCase().startsWith('album');
        const fullPath = path.join(MUSIC_DIR, dir);
        const isDirectory = fs.statSync(fullPath).isDirectory();
        return isAlbumDir && isDirectory;
      })
      .map(async albumDir => {
        console.log('Processing album:', albumDir);
        const albumPath = path.join(MUSIC_DIR, albumDir);
        const infoPath = path.join(albumPath, 'info.json');
        
        let info = {};
        if (fs.existsSync(infoPath)) {
          try {
            info = JSON.parse(fs.readFileSync(infoPath, 'utf-8'));
            console.log('Album info loaded:', albumDir, info);
          } catch (e) {
            console.error('Error parsing info.json for album:', albumDir, e);
          }
        } else {
          console.log('No info.json found for album:', albumDir);
        }

        const trackFiles = fs.readdirSync(albumPath).filter(file => file.endsWith('.mp3'));
        const trackPromises = trackFiles.map(async track => {
          const fullPath = path.join(albumPath, track);
          const duration = await getAudioDuration(fullPath);
          
          return {
            id: track.replace('.mp3', ''),
            title: track.replace('.mp3', '').split('-').pop()?.trim() || track,
            artist: info.artist || 'Unknown Artist',
            album: info.title || albumDir,
            duration,
            path: `/Music/${albumDir}/${track}`,
            image: `/Music/${albumDir}/cover.jpg`
          };
        });

        const tracks = await Promise.all(trackPromises);
        console.log('Tracks found for album:', albumDir, tracks.length);

        return {
          id: albumDir,
          title: info.title || albumDir,
          artist: info.artist || 'Unknown Artist',
          year: info.year,
          genre: info.genre,
          description: info.description,
          coverImage: `/Music/${albumDir}/cover.jpg`,
          tracks
        };
      });

    const albums = await Promise.all(albumPromises);
    console.log('Total albums found:', albums.length);
    return albums;
  } catch (error) {
    console.error('Error getting albums:', error);
    return [];
  }
}

export async function getAlbum(albumId: string): Promise<LocalAlbum | null> {
  try {
    const albumPath = path.join(MUSIC_DIR, albumId);
    const infoPath = path.join(albumPath, 'info.json');

    if (!fs.existsSync(albumPath)) {
      console.error('Album directory does not exist:', albumPath);
      return null;
    }

    let info = {};
    if (fs.existsSync(infoPath)) {
      try {
        info = JSON.parse(fs.readFileSync(infoPath, 'utf-8'));
      } catch (e) {
        console.error('Error parsing info.json for album:', albumId, e);
      }
    }

    const trackFiles = fs.readdirSync(albumPath).filter(file => file.endsWith('.mp3'));
    const trackPromises = trackFiles.map(async track => {
      const fullPath = path.join(albumPath, track);
      const duration = await getAudioDuration(fullPath);
      
      return {
        id: track.replace('.mp3', ''),
        title: track.replace('.mp3', '').split('-').pop()?.trim() || track,
        artist: info.artist || 'Unknown Artist',
        album: info.title || albumId,
        duration,
        path: `/Music/${albumId}/${track}`,
        image: `/Music/${albumId}/cover.jpg`
      };
    });

    const tracks = await Promise.all(trackPromises);

    return {
      id: albumId,
      title: info.title || albumId,
      artist: info.artist || 'Unknown Artist',
      year: info.year,
      genre: info.genre,
      description: info.description,
      coverImage: `/Music/${albumId}/cover.jpg`,
      tracks
    };
  } catch (error) {
    console.error('Error getting album:', error);
    return null;
  }
}
