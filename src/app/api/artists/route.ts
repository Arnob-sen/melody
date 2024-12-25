import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { NextResponse } from 'next/server';

export interface Artist {
  name: string;
  fullName: string;
  bio: string;
  genre: string[];
  country: string;
  image: string;
  popularTracks: {
    id: string;
    title: string;
    path: string;
    duration: string;
  }[];
  albums: {
    id: string;
    title: string;
    year: string;
    coverImage: string;
  }[];
}

export async function GET() {
  try {
    const musicDir = join(process.cwd(), 'public/Music');
    const artistDirs = readdirSync(musicDir).filter(dir => {
      const stat = statSync(join(musicDir, dir));
      return stat.isDirectory();
    });

    const artists: Artist[] = [];

    for (const artistDir of artistDirs) {
      const infoPath = join(musicDir, artistDir, 'info.json');
      try {
        const artistInfo = JSON.parse(readFileSync(infoPath, 'utf-8'));
        artists.push(artistInfo);
      } catch (error) {
        console.error(`Error reading artist info for ${artistDir}:`, error);
      }
    }

    return NextResponse.json(artists);
  } catch (error) {
    console.error('Error reading artists:', error);
    return NextResponse.json({ error: 'Failed to load artists' }, { status: 500 });
  }
}
