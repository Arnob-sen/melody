import { getArtists } from "@/app/actions/get-artists";
import ArtistContent from "./content";

// This ensures the page is statically generated at build time
export const dynamic = 'force-static';

interface ArtistPageProps {
  params: {
    artistId: string;
  };
}

// Generate static params for all artists
export async function generateStaticParams() {
  const artists = await getArtists();
  return artists.map((artist) => ({
    artistId: encodeURIComponent(artist.id),
  }));
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  const artists = await getArtists();
  const artist = artists.find(a => a.id === decodeURIComponent(params.artistId));

  if (!artist) {
    return (
      <div className="h-full flex items-center justify-center">
        <div>Artist not found</div>
      </div>
    );
  }

  return <ArtistContent artist={artist} />;
}
