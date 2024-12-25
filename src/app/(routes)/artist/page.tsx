'use client';

import { ArtistDetail } from "@/components/artists/artist-detail";
import { useSearchParams } from "next/navigation";

export default function ArtistPage() {
  const searchParams = useSearchParams();
  const artistId = searchParams?.get('id');

  if (!artistId) {
    return (
      <div className="container p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Artist not found</h2>
          <p className="text-muted-foreground">No artist ID provided</p>
        </div>
      </div>
    );
  }

  return <ArtistDetail artistId={artistId} />;
}
