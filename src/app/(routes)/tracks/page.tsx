import { getAlbums } from "@/app/actions/get-local-music";
import TracksContent from "./content";

export const dynamic = 'force-static';

export default async function TracksPage() {
  const albums = await getAlbums();
  
  // Flatten all tracks from all albums into a single array
  const allTracks = albums.flatMap(album => 
    album.tracks.map(track => ({
      ...track,
      albumTitle: album.title,
      albumCover: album.coverImage,
    }))
  );

  return <TracksContent tracks={allTracks} />;
}