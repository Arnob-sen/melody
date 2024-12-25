"use server";

import { getArtists } from "@/app/actions/get-artists";
import { ArtistGrid } from "@/components/artists/artist-grid";

export default async function ArtistsPage() {
  const artists = await getArtists();

  if (!artists || artists.length === 0) {
    return (
      <div className="container p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No artists found</h2>
          <p className="text-muted-foreground">Please add some artists to your music library</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container p-6">
      <ArtistGrid artists={artists} />
    </div>
  );
}