'use server';

import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { revalidateData } from './revalidate';
import { Song } from '@/types';

export async function createPlaylist(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const cover = formData.get('cover') as Blob | null;

    if (!name) {
      throw new Error('Name is required');
    }

    // Generate unique ID for the playlist
    const playlistId = uuidv4();
    const playlistDir = path.join(process.cwd(), 'public', 'Music', 'playlists', playlistId);

    // Create playlist directory
    fs.mkdirSync(playlistDir, { recursive: true });

    // Handle cover image
    let imagePath = '/images/playlist-default.png';
    if (cover) {
      try {
        const bytes = await cover.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const coverPath = path.join(playlistDir, 'cover.jpg');
        fs.writeFileSync(coverPath, buffer);
        imagePath = `/Music/playlists/${playlistId}/cover.jpg`;
      } catch (error) {
        console.error('Error saving cover image:', error);
        // Keep default image on error
      }
    }

    // Create playlist info
    const playlistInfo = {
      id: playlistId,
      name,
      description: description || '',
      image: imagePath,
      tracks: [],
    };

    // Save playlist info
    const infoPath = path.join(playlistDir, 'info.json');
    fs.writeFileSync(infoPath, JSON.stringify(playlistInfo, null, 2));

    // Revalidate data
    await revalidateData();

    return { success: true, data: playlistInfo };
  } catch (error) {
    console.error('Error creating playlist:', error);
    return { success: false, error: 'Failed to create playlist' };
  }
}

export async function updatePlaylist(playlistId: string, formData: FormData) {
  try {
    const playlistDir = path.join(process.cwd(), 'public', 'Music', 'playlists', playlistId);
    const infoPath = path.join(playlistDir, 'info.json');

    if (!fs.existsSync(infoPath)) {
      return { success: false, error: 'Playlist not found' };
    }

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const cover = formData.get('cover') as Blob | null;

    // Read current playlist info
    const currentInfo = JSON.parse(fs.readFileSync(infoPath, 'utf-8'));

    // Update basic info
    currentInfo.name = name || currentInfo.name;
    currentInfo.description = description || currentInfo.description;

    // Handle cover image
    if (cover) {
      try {
        const bytes = await cover.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const coverPath = path.join(playlistDir, 'cover.jpg');
        fs.writeFileSync(coverPath, buffer);
        currentInfo.image = `/Music/playlists/${playlistId}/cover.jpg`;
      } catch (error) {
        console.error('Error saving cover image:', error);
        // Keep existing image on error
      }
    }

    // Save updated info
    fs.writeFileSync(infoPath, JSON.stringify(currentInfo, null, 2));

    // Revalidate data
    await revalidateData();

    return { success: true, data: currentInfo };
  } catch (error) {
    console.error('Error updating playlist:', error);
    return { success: false, error: 'Failed to update playlist' };
  }
}

export async function deletePlaylist(playlistId: string) {
  try {
    const playlistDir = path.join(process.cwd(), 'public', 'Music', 'playlists', playlistId);

    if (!fs.existsSync(playlistDir)) {
      return { success: false, error: 'Playlist not found' };
    }

    // Delete the playlist directory and all its contents
    fs.rmSync(playlistDir, { recursive: true, force: true });

    // Revalidate data
    await revalidateData();

    return { success: true };
  } catch (error) {
    console.error('Error deleting playlist:', error);
    return { success: false, error: 'Failed to delete playlist' };
  }
}

export async function addSongToPlaylist(playlistId: string, song: Song) {
  try {
    const playlistDir = path.join(process.cwd(), 'public', 'Music', 'playlists', playlistId);
    const infoPath = path.join(playlistDir, 'info.json');

    if (!fs.existsSync(infoPath)) {
      return { success: false, error: 'Playlist not found' };
    }

    // Read current playlist info
    const currentInfo = JSON.parse(fs.readFileSync(infoPath, 'utf-8'));

    // Check if song already exists in playlist
    const songExists = currentInfo.tracks.some((track: Song) => track.id === song.id);
    if (songExists) {
      return { success: false, error: 'Song already exists in playlist' };
    }

    // Add song to tracks
    currentInfo.tracks.push(song);

    // Save updated info
    fs.writeFileSync(infoPath, JSON.stringify(currentInfo, null, 2));

    // Revalidate data
    await revalidateData();

    return { success: true, data: currentInfo };
  } catch (error) {
    console.error('Error adding song to playlist:', error);
    return { success: false, error: 'Failed to add song to playlist' };
  }
}
