"use client";

import { Artist } from "@/app/actions/get-artists";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ArtistGridProps {
  artists: Artist[];
}

export function ArtistGrid({ artists }: ArtistGridProps) {
  const router = useRouter();

  const handleArtistClick = (artist: Artist) => {
    if (artist?.id) {
      router.push(`/artists/${encodeURIComponent(artist.id)}`);
    }
  };

  if (!artists || artists.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No artists found</p>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Artists</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {artists.map((artist) => (
          <Card
            key={artist.id}
            className="group relative aspect-square cursor-pointer transition overflow-hidden"
            onClick={() => handleArtistClick(artist)}
          >
            <div className="relative aspect-square">
              <Image
                src={artist.image}
                alt={artist.name}
                fill
                className="object-cover transition group-hover:scale-110"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              <h3 className="text-white font-semibold truncate">{artist.name}</h3>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}