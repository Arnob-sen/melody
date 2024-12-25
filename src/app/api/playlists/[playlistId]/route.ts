import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'edge';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { playlistId: string } }
) {
  try {
    const playlistId = params.playlistId;
    const playlistDir = path.join(process.cwd(), 'public', 'Music', 'playlists', playlistId);
    
    // Ensure directory exists
    if (!fs.existsSync(playlistDir)) {
      fs.mkdirSync(playlistDir, { recursive: true });
    }
    
    const infoPath = path.join(playlistDir, 'info.json');
    if (!fs.existsSync(infoPath)) {
      return NextResponse.json(
        { error: 'Playlist not found' },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    console.log('Received form data:', Object.fromEntries(formData.entries()));

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const cover = formData.get('cover');

    // Read current playlist info
    const currentInfo = JSON.parse(fs.readFileSync(infoPath, 'utf-8'));

    // Update basic info
    currentInfo.name = name || currentInfo.name;
    currentInfo.description = description || currentInfo.description;

    // Handle cover image
    if (cover && cover instanceof Blob) {
      try {
        console.log('Processing cover image...');
        const arrayBuffer = await cover.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const coverPath = path.join(playlistDir, 'cover.jpg');
        
        fs.writeFileSync(coverPath, buffer);
        console.log('Cover image saved to:', coverPath);
        
        currentInfo.image = `/Music/playlists/${playlistId}/cover.jpg`;
      } catch (error) {
        console.error('Error saving cover image:', error);
        // Keep existing image on error
      }
    }

    // Save updated info
    fs.writeFileSync(infoPath, JSON.stringify(currentInfo, null, 2));
    console.log('Playlist info updated:', infoPath);

    return NextResponse.json(currentInfo);
  } catch (error) {
    console.error('Error updating playlist:', error);
    return NextResponse.json(
      { error: 'Failed to update playlist' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { playlistId: string } }
) {
  try {
    const playlistId = params.playlistId;
    const playlistDir = path.join(process.cwd(), 'public', 'Music', 'playlists', playlistId);

    if (!fs.existsSync(playlistDir)) {
      return NextResponse.json(
        { error: 'Playlist not found' },
        { status: 404 }
      );
    }

    // Delete the playlist directory and all its contents
    fs.rmSync(playlistDir, { recursive: true, force: true });
    console.log('Playlist deleted:', playlistDir);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting playlist:', error);
    return NextResponse.json(
      { error: 'Failed to delete playlist' },
      { status: 500 }
    );
  }
}
