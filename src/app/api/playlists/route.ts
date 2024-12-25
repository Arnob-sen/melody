import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const cover = formData.get('cover') as Blob | null;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
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
        const arrayBuffer = await cover.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
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

    return NextResponse.json(playlistInfo);
  } catch (error) {
    console.error('Error creating playlist:', error);
    return NextResponse.json(
      { error: 'Failed to create playlist' },
      { status: 500 }
    );
  }
}
