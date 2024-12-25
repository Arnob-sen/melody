import { getAlbum, getAlbums } from "@/app/actions/get-local-music";
import AlbumContent from "./content";

// This ensures the page is statically generated at build time
export const dynamic = 'force-static';

interface AlbumPageProps {
  params: {
    id: string;
  };
}

// Generate static params for all albums
export async function generateStaticParams() {
  const albums = await getAlbums();
  return albums.map((album) => ({
    id: album.id,
  }));
}

export default async function AlbumPage({ params }: AlbumPageProps) {
  const album = await getAlbum(params.id);

  if (!album) {
    return (
      <div className="h-full flex items-center justify-center">
        <div>Album not found</div>
      </div>
    );
  }

  return <AlbumContent album={album} />;
}
