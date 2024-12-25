import { getAlbums } from "@/app/actions/get-local-music";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

// This ensures the page is statically generated at build time
export const dynamic = 'force-static';

export default async function AlbumsPage() {
  const albums = await getAlbums();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Albums</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {albums.map((album) => (
          <Link key={album.id} href={`/album/${album.id}`}>
            <Card className="hover:opacity-75 transition">
              <CardContent className="p-0">
                <div className="relative aspect-square">
                  <Image
                    src={album.coverImage}
                    alt={album.title}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
                <div className="p-4">
                  <h2 className="font-semibold truncate">{album.title}</h2>
                  <p className="text-sm text-gray-500 truncate">{album.artist}</p>
                  <p className="text-xs text-gray-400">{album.tracks.length} tracks</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}