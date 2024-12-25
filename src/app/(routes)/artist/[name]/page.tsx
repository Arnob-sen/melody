import { getArtists } from "@/app/actions/get-artists";
import { ArtistHeader } from "@/components/artists/artist-header";
import { ArtistTracks } from "@/components/artists/artist-tracks";
import { notFound } from "next/navigation";

interface ArtistPageProps {
  params: {
    name: string;
  };
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  const artists = await getArtists();
  const artist = artists.find(
    (a) => a.name.toLowerCase() === decodeURIComponent(params.name).toLowerCase()
  );

  if (!artist) {
    notFound();
  }

  return (
    <div className="bg-background">
      <ArtistHeader artist={artist} />
      <div className="container p-6">
        <ArtistTracks artist={artist} />
      </div>
    </div>
  );
}
