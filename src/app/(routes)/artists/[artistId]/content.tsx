"use client";

import { Artist } from "@/app/actions/get-artists";
import { ArtistHeader } from "@/components/artists/artist-header";
import { ArtistTracks } from "@/components/artists/artist-tracks";

interface ArtistContentProps {
  artist: Artist;
}

export default function ArtistContent({ artist }: ArtistContentProps) {
  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <ArtistHeader artist={artist} />
      <ArtistTracks artist={artist} />
    </div>
  );
}
